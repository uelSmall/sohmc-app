<script lang="ts">
  export let form;
</script>

<section class="container max-w-md mx-auto mt-lg card">
  <h1 class="heading text-brand-primary mb-md">Login to SOHMC</h1>

  <form method="post" class="space-y-md">
    <!-- Email -->
    <div>
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        class="form-input"
        required
      />
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="form-label">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        class="form-input"
        required
      />
    </div>

    <!-- Error handling -->
    {#if form?.error}
      <p class="form-error">{form.error}</p>
    {/if}

    <!-- Submit -->
    <button type="submit" class="btn btn-primary w-full">Login</button>
  </form>

  <p class="text-caption mt-md text-center">
    Don’t have an account?
    <a href="/auth/signup" class="text-brand-primary hover:underline">Sign up</a>
  </p>
</section>
