import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  // 1. Get the current authenticated user from Supabase
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();

  // If no user or an error occurred, redirect to login
  if (authError || !user) {
    console.error('Auth error:', authError?.message);
    throw redirect(303, '/auth/login');
  }

  // 2. Fetch the user's role from the profiles table
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // If no role is found, redirect to choose-role page
  if (profileError || !profile) {
    console.error('Profile fetch failed:', profileError?.message);
    throw redirect(303, '/auth/choose-role');
  }

  // 3. Return user + role to be consumed by dashboard layout
  return {
    user: { email: user.email }, // only expose email, not full user object
    role: profile.role           // student or teacher
  };
};
