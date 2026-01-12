<script lang="ts">
  import { fail } from '@sveltejs/kit';
  import loginImage from '$lib/assets/SOHMC-about.png';

  export let form; // Props passed from server action (contains error message if login fails)
</script>

<section class="min-h-screen flex items-center justify-center bg-gray-100 font-brand px-(--space-lg) py-(--space-xl)">
  <!-- Login Card -->
  <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-(--space-lg)">
    <!-- Logo + Title -->
    <div class="flex flex-col items-center mb-(--space-lg)">
      <img src={loginImage} alt="SOHMC Logo" class="h-18 w-auto mb-(--space-md)" />
      <h1 class="text-2xl font-bold text-(--color-brand-primary)">Login</h1>
      <p class="text-sm text-gray-600 mt-1">To access your dashboard and Profile</p>
    </div>

    <!-- Error Message -->
    {#if form?.error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-(--space-md) text-sm text-center">
        {form.error}
      </div>
    {/if}

    <!-- Login Form -->
    <form method="post" class="space-y-(--space-md)">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="w-full rounded-md border-gray-300 focus:border-(--color-brand-primary) focus:ring-(--color-brand-primary) px-3 py-2"
          placeholder="you@example.com"
        />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          class="w-full rounded-md border-gray-300 focus:border-(--color-brand-primary) focus:ring-(--color-brand-primary) px-3 py-2"
          placeholder="••••••••"
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-(--color-brand-primary) text-(--color-brand-secondary) font-semibold py-2 px-4 rounded-md hover:opacity-90 transition"
      >
        Login
      </button>
    </form>

    <!-- Footer Links -->
    <div class="mt-(--space-md) text-center text-sm text-gray-600">
      <p>
        Don’t have an account?
        <a href="/auth/signup" class="text-(--color-brand-primary) hover:underline">Sign Up</a>
      </p>
      <p class="mt-1">
        <a href="/auth/reset-password" class="text-(--color-brand-primary) hover:underline">Forgot Password?</a>
      </p>
    </div>
  </div>
</section>
