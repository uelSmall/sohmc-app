// src/routes/auth/reset-password/+page.server.ts
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    // Request Supabase to send a password reset email
    const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/auth/update-password' // adjust for your app URL
    });

    if (error) {
      console.error('Password reset error:', error.message);
      return fail(400, { error: 'Failed to send reset email. Please check the address and try again.' });
    }

    return { success: 'Password reset link sent! Check your email.' };
  }
};
