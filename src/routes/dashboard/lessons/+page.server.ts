import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) throw redirect(302, '/auth/login');

  // fetch profile (may be null if not created yet)
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('role, instrument')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Failed to fetch profile', profileError);
    // optionally handle/report the error to Sentry/logging here
  }

  const instrument = profile?.instrument ?? null;

  // fetch lessons filtered by instrument
  const { data: lessons, error: lessonsError } = await locals.supabase
    .from('lessons')
    .select('id,title,description,instrument,created_at')
    .eq('instrument', instrument);

  if (lessonsError) {
    console.error('Failed to fetch lessons', lessonsError);
  }

  return {
    session: locals.session,
    role: profile?.role ?? null,
    user,
    profile: { instrument },
    lessons: lessons ?? []
  };
};
