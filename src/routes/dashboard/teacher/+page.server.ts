import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * Load teacher profile and their lessons
 * - Ensures user is authenticated and has teacher role
 * - Fetches teacher's profile (name, instrument)
 * - Fetches all lessons created by this teacher (published and draft)
 * - RLS enforces teacher_id match on lessons table
 */
export const load: PageServerLoad = async ({ locals }) => {
  // 1. Verify user is authenticated
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  if (authError || !user) {
    throw redirect(303, '/auth/login');
  }

  // 2. Fetch teacher's profile to verify role
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('full_name, instrument, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw redirect(303, '/auth/choose-role');
  }

  // 3. Only teachers can access this page
  if (profile.role !== 'teacher') {
    throw redirect(303, '/dashboard');
  }

  // 4. Fetch all lessons created by this teacher (RLS enforces teacher_id = user.id)
  const { data: lessonsData, error: lessonsError } = await locals.supabase
    .from('lessons')
    .select('id, title, description, instrument, order_index, published, content_type, created_at')
    .eq('teacher_id', user.id)
    .order('order_index', { ascending: true });

  if (lessonsError) {
    console.error('Failed to fetch lessons:', lessonsError.message);
  }

  const lessons = lessonsData || [];

  return {
    session: locals.session,
    role: profile.role,
    profile: {
      full_name: profile.full_name,
      instrument: profile.instrument
    },
    lessons,
    userId: user.id
  };
};

/**
 * Server actions for lesson management
 * All actions verify teacher ownership via RLS policies
 */
export const actions: Actions = {
  /**
   * Create or update a lesson
   * - Validates title, description, and content
   * - Assigns teacher_id from authenticated user
   * - Returns success/error status for form feedback
   */
  createLesson: async ({ request, locals }) => {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString()?.trim() ?? '';
    const description = formData.get('description')?.toString()?.trim() ?? '';
    const content_type = formData.get('content_type')?.toString() ?? 'text';
    const content_body = formData.get('content_body')?.toString() ?? '';
    const order_index = Number(formData.get('order_index')) || 1;

    // Validate required fields
    if (!title || !description) {
      return {
        error: 'Title and description are required.'
      };
    }

    if (content_type === 'text' && !content_body) {
      return {
        error: 'Text content is required for text-based lessons.'
      };
    }

    try {
      // Insert lesson with teacher_id from current user
      const { data: lesson, error: insertError } = await locals.supabase
        .from('lessons')
        .insert({
          title,
          description,
          content_type,
          content_body: content_type === 'text' ? content_body : null,
          teacher_id: user.id,
          instrument: (await locals.supabase.from('profiles').select('instrument').eq('id', user.id).single()).data?.instrument,
          order_index,
          published: false
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return {
        success: true,
        message: 'Lesson created successfully!',
        lessonId: lesson?.id
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create lesson';
      return { error: errorMsg };
    }
  },

  /**
   * Toggle lesson published state
   * - Only the lesson's teacher can publish/unpublish (enforced by RLS)
   * - Returns updated lesson status
   */
  togglePublish: async ({ request, locals }) => {
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const formData = await request.formData();
    const lesson_id = formData.get('lesson_id')?.toString() ?? '';

    if (!lesson_id) {
      return { error: 'Lesson ID is required' };
    }

    try {
      // Fetch current lesson state
      const { data: lesson, error: fetchError } = await locals.supabase
        .from('lessons')
        .select('published, teacher_id')
        .eq('id', lesson_id)
        .single();

      if (fetchError || !lesson) throw new Error('Lesson not found');

      // Verify ownership before updating
      if (lesson.teacher_id !== user.id) {
        throw new Error('You do not have permission to modify this lesson');
      }

      // Toggle published state
      const { error: updateError } = await locals.supabase
        .from('lessons')
        .update({ published: !lesson.published })
        .eq('id', lesson_id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: `Lesson ${!lesson.published ? 'published' : 'unpublished'} successfully!`,
        published: !lesson.published
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update lesson';
      return { error: errorMsg };
    }
  },

  /**
   * Delete a lesson
   * - Only the lesson's teacher can delete (enforced by RLS)
   * - Cascading deletes should handle related assignments/progress
   */
  deleteLesson: async ({ request, locals }) => {
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const formData = await request.formData();
    const lesson_id = formData.get('lesson_id')?.toString() ?? '';

    if (!lesson_id) {
      return { error: 'Lesson ID is required' };
    }

    try {
      // Verify ownership before deleting
      const { data: lesson, error: fetchError } = await locals.supabase
        .from('lessons')
        .select('teacher_id')
        .eq('id', lesson_id)
        .single();

      if (fetchError || !lesson) throw new Error('Lesson not found');

      if (lesson.teacher_id !== user.id) {
        throw new Error('You do not have permission to delete this lesson');
      }

      // Delete the lesson (RLS and cascade rules will handle related records)
      const { error: deleteError } = await locals.supabase
        .from('lessons')
        .delete()
        .eq('id', lesson_id);

      if (deleteError) throw deleteError;

      return {
        success: true,
        message: 'Lesson deleted successfully!'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete lesson';
      return { error: errorMsg };
    }
  }
};
