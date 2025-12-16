import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Not authenticated' });
    }

    const formData = await request.formData();
    const role = String(formData.get('role'));

    // ✅ Validate against enum
    if (!['student', 'teacher', 'parent'].includes(role)) {
      return fail(400, { error: 'Invalid role selected' });
    }

    // ✅ Update profile role (overwrites default)
    const { error } = await locals.supabase
      .from('profiles')
      .update({ role })
      .eq('id', locals.user.id);

    if (error) {
      return fail(500, { error: error.message });
    }

    // ✅ Redirect to role dashboard
    switch (role) {
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
