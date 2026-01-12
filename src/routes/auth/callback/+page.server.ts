import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  // 1. Get current user after OAuth
  const { data: { user }, error } = await locals.supabase.auth.getUser();

  if (error || !user) {
    console.error('OAuth callback error:', error?.message);
    throw redirect(303, '/auth/login');
  }

  // 2. Fetch role from profiles table
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw redirect(303, '/auth/choose-role');
  }

  // 3. Redirect based on role
  if (profile.role === 'student') {
    throw redirect(303, '/dashboard/student');
  } else if (profile.role === 'teacher') {
    throw redirect(303, '/dashboard/teacher');
  } else {
    throw redirect(303, '/auth/choose-role');
  }
};
