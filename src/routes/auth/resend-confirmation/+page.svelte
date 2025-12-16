<script lang="ts">
  import { enhance } from '$app/forms';
  export let form: { error?: string; success?: boolean } | undefined;
</script>

<section class="container-narrow">
  <div class="card text-center">
    <h1 class="heading">Resend Confirmation Email</h1>

    <form method="post" use:enhance>
      <div class="flex flex-col gap-md">
        <label for="email">Enter your email</label>
        <input
          id="email"
          name="email"
          type="email"
          class="input"
          required
        />

        <button type="submit" class="btn btn-secondary">Resend Email</button>
      </div>
    </form>

    {#if form?.error}
      <p class="text-red-600 mt-md">❌ {form.error}</p>
    {/if}

    {#if form?.success}
      <p class="text-green-600 mt-md">✅ Confirmation email resent successfully</p>
    {/if}

    <!-- ✅ Navigation links -->
    <div class="mt-lg flex justify-center gap-md">
      <a href="/auth/login" class="btn btn-outline">Back to Login</a>
      <a href="/" class="btn btn-outline">Back to Home</a>
    </div>
  </div>
</section>
