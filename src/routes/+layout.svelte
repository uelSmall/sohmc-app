<script lang="ts">
  import '../app.css';
  import horizontalLogo from '$lib/assets/SOHMC_Header_Logo_White.png';
  export let data: { user: { email: string } | null; role: string | null };
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/SOHMC-icon.svg" />
  <link rel="icon" type="image/png" href="/SOHMC-icon.png" sizes="40x40" />
  <link rel="apple-touch-icon" href="/SOHMC-icon.png" />
</svelte:head>

<header
  class="flex items-center justify-between px-6 py-2 bg-(--color-brand-primary) 
         text-(--color-brand-secondary) font-brand shadow-md h-17"
>
  <!-- Logo -->
  <div class="flex items-center">
   <a href="/"><img src={horizontalLogo} alt="SOHMC Logo" class=" md:h-20 w-auto" /></a>
  </div>

  <!-- Navigation -->
  <nav class="flex items-center gap-(--space-md)">
    <a href="/about" class="hover:text-(--color-brand-secondary)">About</a>
    <a href="/gallery" class="hover:text-(--color-brand-secondary)">Gallery</a>
    <a href="/contact" class="hover:text-(--color-brand-secondary)">Contact</a>

    {#if data.user}
      <a href="/dashboard" class="hover:text-(--color-brand-secondary)">Dashboard</a>
      <form method="post" action="/auth/logout">
        <button type="submit" class="hover:text-(--color-brand-secondary)">Logout</button>
      </form>
    {:else}
      <a href="/auth/login" class="hover:text-(--color-brand-secondary)">Login</a>
      <a href="/auth/signup" class="hover:text-(--color-brand-secondary)">Sign Up</a>
    {/if}
  </nav>
</header>

<slot />
