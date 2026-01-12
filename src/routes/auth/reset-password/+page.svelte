<script lang="ts">
  export let form; // optional, if you want to show server-side errors
</script>

<section class="min-h-screen flex items-center justify-center bg-gray-100 font-brand px-(--space-lg) py-(--space-xl)">
  <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-(--space-lg)">
    <!-- Logo + Title -->
    <div class="flex flex-col items-center mb-(--space-lg)">
      <img src="/SOHMC-full.svg.png" alt="SOHMC Logo" class="h-20 w-auto mb-(--space-md)" />
      <h1 class="text-2xl font-bold text-(--color-brand-primary)">Reset Your Password</h1>
      <p class="text-sm text-gray-600 mt-1">Enter your email to receive reset instructions</p>
    </div>

    {#if form?.error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-(--space-md) text-sm text-center">
        {form.error}
      </div>
    {/if}

    <!-- Reset Form -->
    <form method="post" action="/auth/reset-password" class="space-y-(--space-md)">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input id="email" name="email" type="email" required
          class="w-full rounded-md border-gray-300 focus:border-(--color-brand-primary) focus:ring-(--color-brand-primary) px-3 py-2"
          placeholder="you@example.com" />
      </div>

      <button type="submit"
        class="w-full bg-(--color-brand-primary) text-(--color-brand-secondary) font-semibold py-2 px-4 rounded-md hover:opacity-90 transition">
        Send Reset Link
      </button>
    </form>

    <!-- Footer Links -->
    <div class="mt-(--space-md) text-center text-sm text-gray-600">
      <p>
        Remembered your password?
        <a href="/auth/login" class="text-(--color-brand-primary) hover:underline">Login</a>
      </p>
    </div>
  </div>
</section>
