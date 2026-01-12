<!-- src/routes/auth/choose-role/+page.svelte -->
<script lang="ts">
  // Data passed from server loader (contains authenticated user info)
  export let data: { user: { email: string } | null };
</script>

<div class="p-lg text-center">
  <!-- Success message -->
  <h1 class="text-2xl font-bold text-brand-black">🎉 Account Created!</h1>
  <p class="mt-md text-brand-gray">
    Welcome {data.user?.email}. Please choose your role to continue.
  </p>

  <!-- Role selection buttons -->
  <div class="mt-lg grid grid-cols-1 md:grid-cols-3 gap-md">
    <!-- Student role -->
    <!-- IMPORTANT: action="?/student" matches actions.student in +page.server.ts -->
    <form method="post" action="?/student">
      <button type="submit" class="btn btn-primary w-full">Student</button>
    </form>

    <!-- Teacher role -->
    <!-- action="?/teacher" matches actions.teacher -->
    <form method="post" action="?/teacher">
      <button type="submit" class="btn btn-primary w-full">Teacher</button>
    </form>

    <!-- Parent role -->
    <!-- action="?/parent" matches actions.parent -->
    <form method="post" action="?/parent">
      <button type="submit" class="btn btn-primary w-full">Parent</button>
    </form>
  </div>
</div>
