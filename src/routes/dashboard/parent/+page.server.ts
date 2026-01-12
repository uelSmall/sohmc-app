import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();

  if (!user) {
    throw redirect(303, '/auth/login');
  }

  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'parent') {
    throw redirect(303, `/dashboard/${profile?.role}`);
  }

  return { user, role: profile.role };
};
