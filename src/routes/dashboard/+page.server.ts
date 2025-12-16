// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const {
    data: { session }
  } = await locals.supabase.auth.getSession();

  if (!session) {
    throw redirect(303, '/auth/login');
  }

  // Fetch role from users table
  const { data: profile, error } = await locals.supabase
    .from('users')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (error || !profile?.role) {
    throw redirect(303, '/auth/login');
  }

  // Role-based redirect
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
