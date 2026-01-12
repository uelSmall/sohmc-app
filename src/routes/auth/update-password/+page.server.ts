// src/routes/auth/update-password/+page.server.ts
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    // 1. Extract form data from the request
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    // 2. Validate that both password fields match
    if (password !== confirm) {
      // If they don't match, return an error message to the page
      return fail(400, { error: 'Passwords do not match. Please try again.' });
    }

    // 3. Attempt to update the user's password using Supabase
    const { error } = await locals.supabase.auth.updateUser({ password });

    // 4. Handle errors from Supabase
    if (error) {
      console.error('Password update error:', error.message);
      return fail(400, { error: 'Failed to update password. Please try again.' });
    }

    // 5. If successful, return a success message
    // The page will display this message to the user
    return { success: 'Password updated successfully! You can now log in with your new password.' };
  }
};
