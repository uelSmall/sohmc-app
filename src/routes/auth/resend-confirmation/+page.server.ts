import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();

    if (!email) {
      return fail(400, { error: 'Email is required' });
    }

    const { error } = await locals.supabase.auth.resend({
      type: 'signup',
      email
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    // ✅ Inline success feedback
    return { success: true };
  }
};
