// src/hooks.server.ts
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

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

  // Get the current session from Supabase
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  // Attach both session and user to locals
  event.locals.session = session ?? null;
  event.locals.user = session?.user ?? null;

  // Continue processing the request
  return resolve(event);
};
