<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient'; // ✅ use the client helper
  import type { Session } from '@supabase/supabase-js';

  let session: Session | null = null;

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  });
</script>

{#if session}
  <h1>Welcome back!</h1>
  <p>You are logged in as {session.user.email}.</p>
{:else}
  <h1>Welcome to Our App</h1>
  <p>Main home page content here</p>
{/if}