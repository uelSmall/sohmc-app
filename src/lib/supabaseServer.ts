// Cookie-aware Supabase client for server loads.
// Reads/writes cookies so SSR can see the session.
import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import * as env from '$env/static/private';

const url = env.SUPABASE_URL;
const anon = env.SUPABASE_ANON_KEY;

export function createAuthClient(event: RequestEvent) {
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        for (const c of cookies) {
          // Write cookies back to response
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

  return { supabase };
}
