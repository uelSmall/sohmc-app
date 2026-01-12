// src/routes/auth/choose-role/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const actions = {
  // Handles "Student" form submission
  student: async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();
    if (!user) throw redirect(303, '/auth/login');

    // Attempt to update role
    const { data, error } = await locals.supabase
      .from('profiles')
      .update({ role: 'student' })
      .eq('id', user.id)
      .select(); // return updated row for logging

    // Log result for debugging
    console.log('Student role update result:', { data, error });

    if (error) {
      console.error('Failed to update role:', error.message);
      throw redirect(303, '/auth/choose-role'); // fallback if update fails
    }

    throw redirect(303, '/dashboard/student');
  },

  // Handles "Teacher" form submission
  teacher: async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();
    if (!user) throw redirect(303, '/auth/login');

    const { data, error } = await locals.supabase
      .from('profiles')
      .update({ role: 'teacher' })
      .eq('id', user.id)
      .select();

    // Log result for debugging
    console.log('Teacher role update result:', { data, error });

    if (error) {
      console.error('Failed to update role:', error.message);
      throw redirect(303, '/auth/choose-role');
    }

    throw redirect(303, '/dashboard/teacher');
  },

  // Handles "Parent" form submission
  parent: async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();
    if (!user) throw redirect(303, '/auth/login');

    const { data, error } = await locals.supabase
      .from('profiles')
      .update({ role: 'parent' })
      .eq('id', user.id)
      .select();

    // Log result for debugging
    console.log('Parent role update result:', { data, error });

    if (error) {
      console.error('Failed to update role:', error.message);
      throw redirect(303, '/auth/choose-role');
    }

    throw redirect(303, '/dashboard/parent');
  }
};
