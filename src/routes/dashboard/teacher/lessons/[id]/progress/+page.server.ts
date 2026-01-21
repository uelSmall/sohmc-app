import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * Load lesson progress data for all students
 * - Fetches lesson details
 * - Fetches all enrolled students (via assignments/lesson_progress)
 * - Aggregates progress data
 * - RLS ensures only the teacher can view their own lesson progress
 */
export const load: PageServerLoad = async ({ locals, params }) => {
  // 1. Verify authentication
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  if (authError || !user) {
    throw redirect(303, '/auth/login');
  }

  const lessonId = params.id;

  // 2. Fetch lesson metadata
  const { data: lesson, error: lessonError } = await locals.supabase
    .from('lessons')
    .select('id, title, description, teacher_id, instrument, published')
    .eq('id', lessonId)
    .eq('teacher_id', user.id)
    .single();

  if (lessonError || !lesson) {
    throw redirect(303, '/dashboard/teacher');
  }

  // 3. Fetch all student progress on this lesson
  // This query gets lesson_progress records for this lesson from students of the same instrument
  const { data: progressData = [], error: progressError } = await locals.supabase
    .from('lesson_progress')
    .select(
      'user_id, status, last_viewed_at, notes, profiles(full_name, email, instrument)'
    )
    .eq('lesson_id', lessonId);

  if (progressError) {
    console.error('Failed to fetch progress:', progressError.message);
  }

  // 4. Format progress data for display
  interface StudentProgress {
    userId: string;
    fullName: string;
    email: string;
    status: string;
    lastViewedAt: string | null;
    notes: string | null;
  }

  const studentProgress: StudentProgress[] = (progressData || []).map((record: any) => ({
    userId: record.user_id,
    fullName: record.profiles?.full_name || 'Unknown',
    email: record.profiles?.email || 'N/A',
    status: record.status,
    lastViewedAt: record.last_viewed_at,
    notes: record.notes
  }));

  // 5. Calculate progress statistics
  const stats = {
    total: studentProgress.length,
    completed: studentProgress.filter(p => p.status === 'completed').length,
    inProgress: studentProgress.filter(p => p.status === 'in_progress').length,
    notStarted: studentProgress.filter(p => p.status === 'not_started').length
  };

  return {
    session: locals.session,
    lesson,
    studentProgress,
    stats,
    userId: user.id
  };
};

/**
 * Server actions for marking student progress
 */
export const actions: Actions = {
  /**
   * Teacher can manually mark a student as completed
   * - Updates lesson_progress status to 'completed'
   * - Verifies ownership of lesson before updating
   */
  markStudentComplete: async ({ request, locals, params }) => {
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const lessonId = params.id;
    const formData = await request.formData();
    const studentId = formData.get('student_id')?.toString() ?? '';

    if (!studentId) {
      return { error: 'Student ID is required' };
    }

    try {
      // Verify this lesson belongs to the teacher
      const { data: lesson, error: lessonError } = await locals.supabase
        .from('lessons')
        .select('teacher_id')
        .eq('id', lessonId)
        .single();

      if (lessonError || !lesson || lesson.teacher_id !== user.id) {
        throw new Error('You do not have permission to mark progress for this lesson');
      }

      // Update student progress
      const { error: updateError } = await locals.supabase
        .from('lesson_progress')
        .update({
          status: 'completed'
        })
        .eq('user_id', studentId)
        .eq('lesson_id', lessonId);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Student marked as completed!'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update student progress';
      return { error: errorMsg };
    }
  },

  /**
   * Teacher can reset a student's progress
   * - Updates lesson_progress status back to 'not_started'
   * - Useful for allowing retakes
   */
  resetStudentProgress: async ({ request, locals, params }) => {
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const lessonId = params.id;
    const formData = await request.formData();
    const studentId = formData.get('student_id')?.toString() ?? '';

    if (!studentId) {
      return { error: 'Student ID is required' };
    }

    try {
      // Verify this lesson belongs to the teacher
      const { data: lesson, error: lessonError } = await locals.supabase
        .from('lessons')
        .select('teacher_id')
        .eq('id', lessonId)
        .single();

      if (lessonError || !lesson || lesson.teacher_id !== user.id) {
        throw new Error('You do not have permission to reset progress for this lesson');
      }

      // Reset student progress
      const { error: updateError } = await locals.supabase
        .from('lesson_progress')
        .update({
          status: 'not_started',
          notes: null,
          last_viewed_at: null
        })
        .eq('user_id', studentId)
        .eq('lesson_id', lessonId);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Student progress reset!'
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset student progress';
      return { error: errorMsg };
    }
  }
};
