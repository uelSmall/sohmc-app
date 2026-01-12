// src/routes/+layout.server.ts
export const load = async ({ locals }) => {
  // Ask Supabase for the current user
  const { data: { user } } = await locals.supabase.auth.getUser();

  // If no user, return nulls
  if (!user) {
    return {
      user: null,
      role: null
    };
  }

  // If user exists, fetch their role from profiles table
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return {
    user,
    role: profile?.role ?? null
  };
};
