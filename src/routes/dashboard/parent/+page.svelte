<!-- src/routes/dashboard/parent/+page.svelte -->
<script lang="ts">
  // Props passed down from +layout.server.ts
  export let data: {
    user: { email: string } | null;
    profile: { role?: string } | null;
  };
</script>

<div class="p-lg space-y-lg">
  <!-- Page heading -->
  <h1 class="text-2xl font-bold text-brand-black">📊 Welcome, Parent</h1>

  <!-- Show logged-in user's email -->
  <p class="text-brand-gray">You are logged in as {data.user?.email}</p>

  <!-- Children’s progress section -->
  <section class="mt-lg">
    <h2 class="text-xl font-semibold text-brand-black">Children’s Progress</h2>
    <p class="text-sm text-brand-gray">Track your child’s learning journey and achievements.</p>

    <!-- Example progress card -->
    <div class="bg-brand-primary text-brand-secondary p-md rounded shadow mt-md">
      <h3 class="font-bold">John Doe</h3>
      <p class="text-sm">Currently enrolled in Music Theory 101.</p>
      <a href="/dashboard/parent/progress/1" class="btn btn-secondary mt-sm">View Progress</a>
    </div>
  </section>
</div>
