// src/hooks.server.ts
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';

export const handle: Handle = async ({ event, resolve }) => {
  // Create a cookie‑aware Supabase client for SSR using the anon key
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        for (const c of cookies) {
          event.cookies.set(c.name, c.value, {
            path: c.options?.path ?? '/',
            httpOnly: c.options?.httpOnly ?? true,
            secure: c.options?.secure ?? (event.url.protocol === 'https:'),
            sameSite: c.options?.sameSite ?? 'lax',
            maxAge: c.options?.maxAge,
            domain: c.options?.domain
          });
        }
      } 
    }
  });

  // Attach supabase client to locals for use in loads/actions
  event.locals.supabase = supabase;

  // Get the current user from Supabase (more secure than getSession)
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  // Reconstruct session object if user exists
  let session: Session | null = null;
  if (user) {
    session = {
      user,
      expires_at: 0,
      expires_in: 0,
      refresh_token: '',
      access_token: '',
      token_type: 'bearer'
    };
  }

  // Attach both session and user to locals
  event.locals.session = session;
  event.locals.user = user ?? null;

  // Continue processing the request
  return resolve(event);
};
