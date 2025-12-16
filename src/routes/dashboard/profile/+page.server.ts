import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return { user: null, profile: null };
  }

  // ✅ Fetch profile info tied to auth.users.id
  const { data: profile, error } = await locals.supabase
    .from('profiles')
    .select('email, role, avatar_url, created_at')
    .eq('id', locals.user.id)
    .single();

  if (error) {
    console.error('Profile fetch error:', error.message);
    return { user: locals.user, profile: null };
  }

  return {
    user: locals.user,   // comes from auth.users
    profile              // comes from public.profiles
  };
};
