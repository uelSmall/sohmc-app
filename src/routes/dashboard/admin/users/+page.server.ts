import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const {
    data: { session }
  } = await locals.supabase.auth.getSession();

  if (!session) throw redirect(303, '/auth/login');

  // ✅ Only allow admins
  const { data: profile } = await locals.supabase
    .from('users')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw redirect(303, '/dashboard');
  }

  // Pagination params
  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  // Search param
  const search = url.searchParams.get('search') ?? '';

  // Sorting params
  const sortBy = url.searchParams.get('sortBy') ?? 'created_at';
  const sortDir = url.searchParams.get('sortDir') ?? 'desc';

  let query = locals.supabase
    .from('users')
    .select('user_id, email, full_name, role', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data: users, error, count } = await query;

  if (error) throw fail(500, { error: error.message });

 return { users, count: count ?? 0, page, limit, search, sortBy, sortDir };

};
