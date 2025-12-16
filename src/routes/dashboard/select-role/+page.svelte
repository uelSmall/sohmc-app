<script lang="ts">
  import { enhance } from '$app/forms';
  export let form: { error?: string } | undefined;
</script>

<section class="container-narrow">
  <div class="card text-center">
    <h1 class="heading">Select Your Role</h1>

    <form method="post" use:enhance>
      <div class="flex flex-col gap-md">
        <label for="role">Choose your role</label>
        <select id="role" name="role" class="input" required>
          <option value="">-- Select a role --</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>

        <button type="submit" class="btn btn-secondary">Continue</button>
      </div>
    </form>

    {#if form?.error}
      <p class="text-red-600 mt-md">❌ {form.error}</p>
    {/if}
  </div>
</section>
