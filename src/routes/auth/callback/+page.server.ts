import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // ✅ If no user session yet, redirect to login
  if (!locals.user) {
    throw redirect(303, '/auth/login');
  }

  // ✅ Check if profile exists and has a role
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', locals.user.id)
    .single();

  // ✅ If no role yet, send to choose-role
  if (!profile?.role) {
    throw redirect(303, '/auth/choose-role');
  }

  // ✅ Otherwise, send to role dashboard
  switch (profile.role) {
    case 'teacher':
      throw redirect(303, '/dashboard/teacher');
    case 'student':
      throw redirect(303, '/dashboard/student');
    case 'parent':
      throw redirect(303, '/dashboard/parent');
    default:
      throw redirect(303, '/dashboard');
  }
};