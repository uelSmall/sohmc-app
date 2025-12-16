import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const allowedRoles = ['student', 'teacher', 'parent']; // ✅ no admin here

export const load: PageServerLoad = async ({ locals }) => {
  const {
    data: { session }
  } = await locals.supabase.auth.getSession();

  if (!session) throw redirect(303, '/auth/login');

  const { data: profile, error } = await locals.supabase
    .from('users')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (error) throw fail(500, { error: error.message });

  if (profile?.role) {
    throw redirect(303, '/dashboard');
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const role = String(form.get('role') ?? '').trim();

    if (!allowedRoles.includes(role)) {
      return fail(400, { error: 'Invalid role selection' });
    }

    const {
      data: { session }
    } = await locals.supabase.auth.getSession();

    if (!session) throw redirect(303, '/auth/login');

    const { error } = await locals.supabase
      .from('users')
      .update({ role })
      .eq('user_id', session.user.id);

    if (error) {
      return fail(500, { error: error.message });
    }

    throw redirect(303, '/dashboard');
  }
};
