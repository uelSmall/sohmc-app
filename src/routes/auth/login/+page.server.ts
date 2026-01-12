import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Attempt login with Supabase
    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login failed:', error.message);
      return fail(400, { error: 'Invalid credentials' });
    }

    // 2. Fetch role from profiles table
    const { data: profile, error: profileError } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw redirect(303, '/auth/choose-role');
    }

    // 3. Redirect based on role
    if (profile.role === 'student') {
      throw redirect(303, '/dashboard/student');
    } else if (profile.role === 'teacher') {
      throw redirect(303, '/dashboard/teacher');
    } else {
      throw redirect(303, '/auth/choose-role');
    }
  }
};
