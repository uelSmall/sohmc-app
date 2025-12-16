import type { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    // What you attach in hooks.server.ts
    interface Locals {
      supabase: SupabaseClient;
      user: User |null;
    }

    // What you return in +layout.server.ts
    interface PageData {
      session: Session | null;
      role: 'student' | 'teacher' | 'parent' | 'admin' | null;
    }

    // What you pass into +error.svelte
    interface Error {
      message: string;
      status?: number;
      values?: {
        email?: string;
        role?: string;
      };
    }
  }
}

export {};
