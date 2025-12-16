<script lang="ts">
  export let form;
</script>

<section class="container max-w-md mx-auto mt-lg card">
  <h1 class="heading text-brand-primary mb-md">Choose Your Role</h1>

  <form method="post" class="space-y-md">
    <label for = 'SelectRole' id="select-role" class="form-label">Select your role</label>
    <select name="role" class="form-select" required>
      <option value="student">Student</option>
      <option value="teacher">Teacher</option>
      <option value="parent">Parent</option>
    </select>

    {#if form?.error}
      <p class="form-error">{form.error}</p>
    {/if}

    <button type="submit" class="btn btn-primary w-full">Continue</button>
  </form>
</section>
