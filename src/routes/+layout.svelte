<script lang="ts">
  export let data: { user: { email: string } | null };
</script>

<header class="flex items-center justify-between px-lg py-md bg-brand-primary text-white">
  <!-- Logo -->
  <div class="flex items-center space-x-sm">
    <img src="/logo.svg" alt="SOHMC Logo" class="h-10 w-10" />
    <span class="font-brand text-xl">SOHMC</span>
  </div>

  <!-- Navigation -->
  <nav class="flex space-x-md">
    <a href="/" class="hover:text-brand-secondary">Home</a>
    <a href="/about" class="hover:text-brand-secondary">About</a>
    <a href="/contact" class="hover:text-brand-secondary">Contact</a>

    {#if data.user}
      <a href="/dashboard" class="hover:text-brand-secondary">Dashboard</a>
      <a href="/auth/logout" class="hover:text-brand-secondary">Logout</a>
    {:else}
      <a href="/auth/login" class="hover:text-brand-secondary">Login</a>
      <a href="/auth/signup" class="hover:text-brand-secondary">Sign Up</a>
    {/if}
  </nav>
</header>



<slot />