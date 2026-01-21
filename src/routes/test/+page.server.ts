export async function load({ locals }) {
  const supabase = locals.supabase;

  if (!supabase) {
    return { users: [], error: 'Supabase client not initialized (check .env and app.d.ts).' };
  }

  // Simple query: grab first 5 users
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .limit(5);

  return {
    users: data ?? [],
    error: error?.message ?? null
  };
}
