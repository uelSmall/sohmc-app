// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// This loader runs when a user visits /dashboard directly.
// It checks their role and redirects them to the correct sub-dashboard.
export const load: PageServerLoad = async ({ locals }) => {
  // 1. Get authenticated user
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) throw redirect(303, '/auth/login');

  // 2. Fetch role from profiles table
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // 3. If no role, redirect to login
  if (!profile?.role) throw redirect(303, '/auth/login');

  // 4. Redirect based on role
  switch (profile.role) {
    case 'student':
      throw redirect(303, '/dashboard/student');
    case 'teacher':
      throw redirect(303, '/dashboard/teacher');
    case 'parent':
      throw redirect(303, '/dashboard/parent');
    case 'admin':
      throw redirect(303, '/dashboard/admin');
    default:
      throw redirect(303, '/auth/login');
  }
};
