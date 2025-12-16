// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { data: { user }, error } = await locals.supabase.auth.getUser();

  // If no session, don't treat it as a fatal error
  if (error?.message === 'Auth session missing!') {
    return {
      user: null,
      session: null,
      role: null
    };
  }

  if (error) {
    console.error('Auth error:', error.message);
    return {
      user: null,
      session: null,
      role: null
    };
  }

  let role: "student" | "teacher" | "parent" | "admin" | null = null;

  if (user) {
    const { data: profile } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    role = profile?.role as typeof role;
  }

  return {
    user: user ?? null,
    session: null, // keep this for type compatibility
    role
  };
};
