import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    // ✅ Redirect to role selection if no role yet
    const { data: profile } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile?.role) {
      throw redirect(303, '/auth/choose-role');
    }

    // ✅ Redirect to role dashboard
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
  }
};
