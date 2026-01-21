import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * Load a single lesson for editing
 * - Verifies user is authenticated
 * - Ensures lesson exists and belongs to the teacher
 * - RLS prevents other teachers from accessing this lesson
 */
export const load: PageServerLoad = async ({ locals, params }) => {
  // 1. Verify authentication
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  if (authError || !user) {
    throw redirect(303, '/auth/login');
  }

  const lessonId = params.id;

  // 2. Fetch the lesson (RLS ensures teacher_id = user.id)
  const { data: lesson, error: lessonError } = await locals.supabase
    .from('lessons')
    .select('id, title, description, content_type, content_body, content_url, order_index, instrument, published')
    .eq('id', lessonId)
    .eq('teacher_id', user.id)
    .single();

  if (lessonError || !lesson) {
    // Redirect if lesson not found or not owned by this teacher
    throw redirect(303, '/dashboard/teacher');
  }

  return {
    session: locals.session,
    lesson,
    userId: user.id
  };
};

/**
 * Server actions for lesson editing
 */
export const actions: Actions = {
  /**
   * Update lesson details
   * - Validates all required fields
   * - Verifies ownership before updating
   * - Returns success/error feedback
   */
  updateLesson: async ({ request, locals, params }) => {
    // Verify authentication
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const lessonId = params.id;
    const formData = await request.formData();
    const title = formData.get('title')?.toString()?.trim() ?? '';
    const description = formData.get('description')?.toString()?.trim() ?? '';
    const content_type = formData.get('content_type')?.toString() ?? 'text';
    const content_body = formData.get('content_body')?.toString() ?? '';
    const order_index = Number(formData.get('order_index')) || 1;

    // Validate required fields
    if (!title || !description) {
      return { error: 'Title and description are required.' };
    }

    if (content_type === 'text' && !content_body) {
      return { error: 'Text content is required for text-based lessons.' };
    }

    try {
      // Verify ownership before updating
      const { data: lesson, error: fetchError } = await locals.supabase
        .from('lessons')
        .select('teacher_id')
        .eq('id', lessonId)
        .single();

      if (fetchError || !lesson) {
        throw new Error('Lesson not found');
      }

      if (lesson.teacher_id !== user.id) {
        throw new Error('You do not have permission to edit this lesson');
      }

      // Update lesson
      const { error: updateError } = await locals.supabase
        .from('lessons')
        .update({
          title,
          description,
          content_type,
          content_body: content_type === 'text' ? content_body : null,
          order_index
        })
        .eq('id', lessonId)
        .eq('teacher_id', user.id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Lesson updated successfully!'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update lesson';
      return { error: errorMsg };
    }
  }
};
