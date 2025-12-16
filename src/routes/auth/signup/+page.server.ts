import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173/auth/callback' // adjust for prod
      }
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    // ✅ Inform user to check email for confirmation
    return {
      success: 'Signup successful! Please check your email to confirm your account.'
    };
  }
};
