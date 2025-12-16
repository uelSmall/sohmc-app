import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = locals.session;
  if (!session) throw redirect(302, '/auth/login');

  const { data: profile } = await locals.supabase
    .from('users')
    .select('role,instrument')
    .eq('id', session.user.id)
    .single();

  // return profile even if null so PageData includes it
  return { session, profile: profile ?? null };
};

export const actions: Actions = {
  upload: async ({ request, locals }) => {
    const session = locals.session;
    if (!session) return fail(401, { message: 'Not authenticated' });

    // parse form
    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const instrument = String(formData.get('instrument') ?? '').trim();
    const file = formData.get('file') as File | null;

    // <-- Put the values object here, right after parsing -->
    const values = { title, description, instrument };

    // validation (returns values on failure)
    if (!title || !instrument || !file || file.size === 0) {
      return fail(400, {
        message: 'Title, instrument, and file are required',
        values
      });
    }

    // upload to storage
    const ext = file.name.split('.').pop();
    const path = `${session.user.id}/${crypto.randomUUID()}.${ext ?? 'bin'}`;

    const { error: uploadError } = await locals.supabase.storage
      .from('lessons')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      return fail(500, { message: `Upload failed: ${uploadError.message}`, values });
    }

    const { data: publicURLData } = locals.supabase.storage
      .from('lessons')
      .getPublicUrl(path);

    const file_url = publicURLData?.publicUrl ?? null;

    // insert metadata
    const { error: insertError } = await locals.supabase
      .from('lessons')
      .insert({
        title,
        description,
        instrument,
        file_path: path,
        file_url,
        user_id: session.user.id
      });

    if (insertError) {
      return fail(500, { message: `Save failed: ${insertError.message}`, values });
    }

    // success: include values so the ActionData shape is consistent
    return { success: true, values };
  }
};
