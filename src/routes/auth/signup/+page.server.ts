// src/routes/auth/signup/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    console.log("Signup triggered:", { email, password });

    const { error } = await locals.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    // Supabase sends confirmation email automatically
    throw redirect(303, '/auth/confirm-email');
  }
};
