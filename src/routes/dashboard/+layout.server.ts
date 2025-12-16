// src/routes/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // Get current session
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

  // Pass session + role down to child pages
  return { session, role: profile.role };
};
