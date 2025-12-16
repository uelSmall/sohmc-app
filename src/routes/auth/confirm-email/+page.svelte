<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let showToast = false;

  onMount(() => {
    if ($page.url.searchParams.get('resent') === 'true') {
      showToast = true;
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        showToast = false;
      }, 5000);
    }
  });
</script>

<section class="container-narrow">
  <div class="card text-center">
    <h1 class="heading text-green-600">🎉 Account Created!</h1>

    <p class="mt-md text-gray-700">
      We’ve sent a confirmation link to your email. Please check your inbox and click the link to verify your account.
    </p>

    <p class="mt-sm text-gray-500">
      Didn’t get the email? 
      <a href="/auth/resend-confirmation" class="text-blue-600 underline">
        Click here to resend
      </a>.
    </p>

    <div class="mt-lg flex justify-center gap-md">
      <a href="/" class="btn btn-outline">Go Home</a>
    </div>
  </div>
</section>

<!-- ✅ Toast notification -->
{#if showToast}
  <div
    class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500"
  >
    ✅ A new confirmation email has been sent
  </div>
{/if}
