<script lang="ts">
  export let error: App.Error | undefined;
  export let status: number | undefined;
</script>

<section class="max-w-md mx-auto mt-xl p-lg rounded-lg shadow-lg bg-surface text-center">
  <h1 class="text-primary text-2xl font-bold">
    Oops! Something went wrong
  </h1>

  <p class="mt-md text-secondary">
    {error?.message ?? 'Unexpected error — please try again.'}
  </p>

  {#if status}
    <p class="text-sm text-muted mt-sm">Error code: {status}</p>
  {/if}

  {#if error?.values}
    <div class="mt-md text-left">
      <h2 class="text-accent font-semibold">Form details:</h2>
      <ul class="list-disc ml-lg text-secondary">
        {#if error.values.email}
          <li>Email: {error.values.email}</li>
        {/if}
        {#if error.values.role}
          <li>Role: {error.values.role}</li>
        {/if}
      </ul>
    </div>
  {/if}

  <div class="mt-lg flex justify-center gap-md">
    <a href="/auth/signup" class="btn btn-primary">Try Again</a>
    <a href="/" class="btn btn-outline">Go Home</a>
  </div>
</section>
