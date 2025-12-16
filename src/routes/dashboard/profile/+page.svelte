<script lang="ts">
  export let data: {
    user: { email: string } | null;
    profile: { role: string | null; avatar_url: string | null } | null;
  };
</script>

<section class="container max-w-md mx-auto mt-lg card">
  <h1 class="heading text-brand-primary mb-md">Your Profile</h1>

  {#if data.user && data.profile}
    <div class="flex flex-col items-center space-y-md">
      <!-- Avatar -->
      <img
        src={data.profile.avatar_url}
        alt="User avatar"
        class="w-24 h-24 rounded-full border-2 border-brand-primary"
      />

      <!-- Email -->
      <p class="text-body font-semibold">
        Email: <span class="text-brand-black">{data.user.email}</span>
      </p>

      <!-- Role -->
      <p class="text-body">
        Role: <span class="capitalize text-brand-secondary">{data.profile.role ?? 'Not set'}</span>
      </p>
    </div>
  {:else}
    <p class="form-error">Profile not found.</p>
  {/if}
</section>
