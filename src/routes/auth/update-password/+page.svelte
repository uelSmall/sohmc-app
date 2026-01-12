<!-- src/routes/auth/update-password/+page.svelte -->
<script lang="ts">
  // "form" contains data returned from the server action
  // It may include error or success messages depending on the result
  export let form;
</script>

<div class="p-lg max-w-md mx-auto">
  <!-- Page heading -->
  <h1 class="text-2xl font-bold text-brand-black">🔑 Update Password</h1>

  <!-- Show error message if update fails -->
  {#if form?.error}
    <div class="bg-red-100 text-red-700 p-md rounded mt-md">
      {form.error}
    </div>
  {/if}

  <!-- Show success message if update succeeds -->
  {#if form?.success}
    <div class="bg-green-100 text-green-700 p-md rounded mt-md">
      {form.success}
    </div>
  {/if}

  <!-- Update password form -->
  <form method="post" class="space-y-md mt-lg">
    <!-- New password input -->
    <div>
      <label for="password" class="block text-sm font-medium text-brand-black">New Password</label>
      <input id="password" name="password" type="password" required class="input w-full" />
    </div>

    <!-- Confirm password input -->
    <div>
      <label for="confirm" class="block text-sm font-medium text-brand-black">Confirm Password</label>
      <input id="confirm" name="confirm" type="password" required class="input w-full" />
    </div>

    <!-- Submit button -->
    <button type="submit" class="btn btn-primary w-full">Update Password</button>
  </form>
</div>
