import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();

  if (!user) {
    throw redirect(303, '/auth/login');
  }

  const { data: profile, error } = await locals.supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Profile load error:", error.message);
    return { profile: null };
  }

  return { profile };
};
