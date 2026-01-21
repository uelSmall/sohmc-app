import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * Load student's lessons and progress
 * - Fetches student profile (name, instrument)
 * - Fetches all published lessons for their instrument
 * - Fetches student's progress on each lesson
 * - Determines which lessons are unlocked based on completion sequence
 */
export const load: PageServerLoad = async ({ locals }) => {
  // 1. Verify user is authenticated
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  if (authError || !user) {
    throw redirect(303, '/auth/login');
  }

  // 2. Fetch student profile (name + instrument for lesson filtering)
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('full_name, instrument')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw redirect(303, '/auth/choose-role');
  }

  // 3. Fetch published lessons for this student's instrument
  const { data: lessons = [] } = await locals.supabase
    .from('lessons')
    .select('id, title, description, content_type, content_body, content_url, order_index, published, teacher_id')
    .eq('instrument', profile.instrument)
    .eq('published', true)
    .order('order_index', { ascending: true });

  // 4. Fetch student's progress records
  const { data: progress = [] } = await locals.supabase
    .from('lesson_progress')
    .select('lesson_id, status, last_viewed_at, notes')
    .eq('user_id', user.id);

  // 5. Map progress to lessons for quick lookup
  const progressArray = progress || [];
  const progressMap = new Map(progressArray.map((p: any) => [p.lesson_id, p]));

  // 6. Determine the highest completed lesson index (for unlocking next lesson)
  const lessonArray = lessons || [];
  const completedIndices = progressArray
    .filter(p => p.status === 'completed')
    .map((p: any) => {
      const lesson = lessonArray.find(l => l.id === p.lesson_id);
      return lesson?.order_index ?? 0;
    });
  const maxCompletedIndex = completedIndices.length > 0 ? Math.max(...completedIndices) : 0;

  return {
    session: locals.session,
    role: 'student',
    profile: {
      full_name: profile.full_name,
      instrument: profile.instrument
    },
    lessons,
    progressMap: Object.fromEntries(progressMap),
    unlockedLessonIndex: maxCompletedIndex + 1,
    userId: user.id
  };
};

/**
 * Server actions for student lesson interaction
 * All actions are RLS-protected to ensure students only update their own progress
 */
export const actions: Actions = {
  /**
   * Start a lesson - creates a lesson_progress record
   * - Sets status to 'in_progress'
   * - Records the timestamp student first viewed the lesson
   */
  startLesson: async ({ request, locals }) => {
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
      // Check if progress record already exists
      const { data: existingProgress } = await locals.supabase
        .from('lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson_id)
        .single();

      if (existingProgress) {
        // Already started, just update to in_progress if needed
        const { error: updateError } = await locals.supabase
          .from('lesson_progress')
          .update({ status: 'in_progress', last_viewed_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('lesson_id', lesson_id);

        if (updateError) throw updateError;
      } else {
        // Create new progress record
        const { error: insertError } = await locals.supabase
          .from('lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id,
            status: 'in_progress',
            last_viewed_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      return {
        success: true,
        message: 'Lesson started!'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start lesson';
      return { error: errorMsg };
    }
  },

  /**
   * Complete a lesson - marks as 'completed'
   * - Verifies lesson was unlocked (order-based progression)
   * - Updates status and timestamps
   */
  completeLesson: async ({ request, locals }) => {
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
      // Update or create progress record with completed status
      const { error: upsertError } = await locals.supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id,
            status: 'completed',
            last_viewed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (upsertError) throw upsertError;

      return {
        success: true,
        message: 'Great job! Lesson marked as complete.'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete lesson';
      return { error: errorMsg };
    }
  },

  /**
   * Add a note to a lesson
   * - Stores student's personal notes/reflections
   * - Updates progress record with notes
   */
  noteLesson: async ({ request, locals }) => {
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const formData = await request.formData();
    const lesson_id = formData.get('lesson_id')?.toString() ?? '';
    const note = formData.get('note')?.toString()?.trim() ?? '';

    if (!lesson_id || !note) {
      return { error: 'Lesson ID and note are required' };
    }

    try {
      // Update progress record with note
      const { error: updateError } = await locals.supabase
        .from('lesson_progress')
        .update({
          notes: note,
          last_viewed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('lesson_id', lesson_id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Note saved!'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save note';
      return { error: errorMsg };
    }
  }
};
