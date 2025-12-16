import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ locals }) => {
    // ✅ Clear Supabase session
    await locals.supabase.auth.signOut();

    // ✅ Redirect to home or login page
    throw redirect(303, '/');
  }
};
