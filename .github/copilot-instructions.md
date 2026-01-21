# Copilot Instructions for SOHMC App

## Architecture Overview

This is a **SvelteKit + Supabase** education platform for managing lessons, student assignments, and role-based access (student/teacher/parent/admin).

### Key Components:
- **Frontend**: Svelte 5 + SvelteKit with server-side rendering
- **Backend**: Supabase (PostgreSQL + Auth) with SSR-aware cookie handling
- **Styling**: Tailwind CSS v4 with forms/typography plugins
- **Build**: Vite + TypeScript (strict mode)

## Data Model & Authentication Flow

### Core Tables (see [database.types.ts](src/lib/database.types.ts)):
- `auth.users` (Supabase built-in)
- `profiles` (stores user role: student/teacher/parent/admin)
- `lessons` (lesson metadata)
- `assignments` (student assignment state)

### Authentication Pattern:
1. `hooks.server.ts` creates cookie-aware Supabase client for every request
2. Session attached to `event.locals.supabase` and `event.locals.session`
3. **Root layout** ([+layout.server.ts](src/routes/+layout.server.ts)) fetches user + role for all routes
4. **Dashboard layout** ([dashboard/+layout.server.ts](src/routes/dashboard/+layout.server.ts)) enforces auth redirect and role-based entry point

### Login Flow Pattern:
- Sign in via `locals.supabase.auth.signInWithPassword()`
- Fetch role from `profiles` table
- Redirect to role-specific dashboard (`/dashboard/student`, `/dashboard/teacher`, etc.)
- See [auth/login/+page.server.ts](src/routes/auth/login/+page.server.ts) for example

## Development Workflows

### Build & Run:
```bash
npm run dev           # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview prod build
```

### Code Quality:
```bash
npm run check        # Svelte type-check (required before commits)
npm run lint         # Prettier + ESLint
npm run format       # Auto-format all files
npm run tailwind:check  # Validate Tailwind CSS
```

## Project Conventions

### File Organization:
- **Routes**: SvelteKit file-based routing in `src/routes/` (use `+page.server.ts` for server actions/loads)
- **Shared code**: `src/lib/` for reusable utilities, Supabase clients, types
- **Server files**: `+page.server.ts`, `+layout.server.ts` (SSR only)
- **CSS**: Global styles in `src/app.css`, inline Tailwind classes preferred

### Authentication in +page.server.ts or +layout.server.ts:
```typescript
export const load = async ({ locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) throw redirect(303, '/auth/login');
  
  // Fetch related data from profiles, lessons, etc.
  return { user, data };
};
```

### Supabase Clients:
- **Server context** (`+page.server.ts`, `+layout.server.ts`): Use `locals.supabase` (cookie-aware, SSR-safe)
- **Client/browser**: Use `supabase` from `src/lib/supabaseClient.ts`
- **Custom server setup** (not in SvelteKit): Use `createAuthClient()` from `src/lib/supabaseServer.ts`

### Styling:
- Tailwind utilities for layout/spacing/colors
- Use custom CSS variables for brand fonts (`--font-brand`), spacing (`--space-xs/sm/md/lg/xl`), borders (`--radius-brand`)
- Forms plugin handles `input`, `select`, `checkbox` styling

### TypeScript:
- Strict mode enabled (`tsconfig.json`)
- Auto-generated types from Supabase: `src/lib/database.types.ts`
- Use `type Database` for RLS/row-level-security queries

## Integration Patterns

### Adding New Pages:
1. Create route folder: `src/routes/path/+page.svelte`
2. Add server load/actions if needed: `src/routes/path/+page.server.ts`
3. In `.server.ts`, fetch user/role via `locals.supabase`
4. Pass data to component via `export let data`

### Adding Database Queries:
1. Use Supabase Postgrest API: `locals.supabase.from('table').select('*')`
2. Handle errors: `if (error) throw error` or return null
3. Type responses using `Database['public']['Tables']['name']['Row']`

### Protected Routes:
Check for user in layout:
```typescript
if (!user) throw redirect(303, '/auth/login');
```

Role-based access in dashboard layouts (see patterns in `src/routes/dashboard/*/`).

## Key Files Reference

| File | Purpose |
|------|---------|
| [src/hooks.server.ts](src/hooks.server.ts) | Global middleware, session initialization |
| [src/routes/+layout.server.ts](src/routes/+layout.server.ts) | Load user data for all routes |
| [src/lib/supabaseServer.ts](src/lib/supabaseServer.ts) | Cookie-aware server client builder |
| [src/lib/supabaseClient.ts](src/lib/supabaseClient.ts) | Browser/client-side Supabase instance |
| [tailwind.config.js](tailwind.config.js) | Tailwind theme + plugin config |
| [vite.config.ts](vite.config.ts) | Vite + SvelteKit + Tailwind setup |

## Common Pitfalls

- **Don't use bare `supabaseClient`** in `+page.server.ts` → use `locals.supabase` (handles cookies/SSR)
- **Always check for `locals.user`** before accessing user data in server contexts
- **Format before committing**: Run `npm run format` and `npm run check`
- **No direct HTML styling**: Use Tailwind classes; CSS variables for theme overrides
- **Env vars**: Public vars use `PUBLIC_` prefix (baked into bundle); private use `SUPABASE_URL`, etc.
