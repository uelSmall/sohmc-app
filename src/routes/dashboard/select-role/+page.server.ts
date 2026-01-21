import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const allowedRoles = ['student', 'teacher', 'parent']; // ✅ no admin here

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();

  if (!user) throw redirect(303, '/auth/login');

  const { data: profile, error } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) throw fail(500, { error: error.message });

  if (profile?.role) {
    throw redirect(303, '/dashboard');
  }

  return { session: locals.session, role: profile?.role ?? null };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const role = String(form.get('role') ?? '').trim();

    if (!allowedRoles.includes(role)) {
      return fail(400, { error: 'Invalid role selection' });
    }

    const { data: { user } } = await locals.supabase.auth.getUser();

    if (!user) throw redirect(303, '/auth/login');

    const { error } = await locals.supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id);

    if (error) {
      return fail(500, { error: error.message });
    }

    throw redirect(303, '/dashboard');
  }
};
