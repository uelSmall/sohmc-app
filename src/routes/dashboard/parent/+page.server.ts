// src/routes/dashboard/parent/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const {
    data: { session }
  } = await locals.supabase.auth.getSession();

  if (!session) {
    throw redirect(303, '/auth/login');
  }

  const { data: profile } = await locals.supabase
    .from('users')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (profile?.role !== 'parent') {
    throw redirect(303, '/dashboard');
  }

  return { session,
    user: session.user,
    role: profile.role };
};
