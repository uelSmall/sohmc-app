import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  // 1. Ensure user is logged in
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  if (authError || !user) {
    console.error('Auth error:', authError?.message);
    throw redirect(303, '/auth/login');
  }

  // 2. Fetch profile info (name + instrument)
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('full_name, instrument')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile fetch failed:', profileError?.message);
    throw redirect(303, '/auth/choose-role');
  }

  // 3. Fetch lessons for this instrument (only published ones)
  const { data: lessons } = await locals.supabase
    .from('lessons')
    .select('id, title, description, order_index, published')
    .eq('instrument', profile.instrument)
    .eq('published', true)
    .order('order_index', { ascending: true });

  // 4. Fetch progress records for this user
  const { data: progress } = await locals.supabase
    .from('lesson_progress')
    .select('lesson_id, status, last_viewed_at, notes')
    .eq('user_id', user.id);

  // 5. Determine the highest completed lesson index
  const maxCompleted = lessons && progress
    ? Math.max(
        0,
        ...progress
          .filter(p => p.status === 'completed')
          .map(p => lessons.find(l => l.id === p.lesson_id)?.order_index ?? 0)
      )
    : 0;

  // 6. Return all data to the student dashboard UI
  return {
    profile,                        // student profile info
    lessons: lessons ?? [],         // lessons list
    progress: progress ?? [],       // progress records
    unlockedLessonIndex: maxCompleted + 1 // next lesson unlocked
  };
};
