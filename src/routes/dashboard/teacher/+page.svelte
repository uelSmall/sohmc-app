<script lang="ts">
  export let data;
</script>

<section class="container">
  <h1 class="heading">Teacher Dashboard</h1>
  <p class="mt-md">Welcome, {data.user?.email}</p>

  <div class="grid gap-lg mt-lg">
    <div class="card">
      <h2 class="subheading">My Lessons</h2>
      <a href="/dashboard/teacher/lessons" class="btn btn-secondary mt-md">Upload / Manage Lessons</a>
    </div>

    <div class="card">
      <h2 class="subheading">Students</h2>
      <p>View and manage enrolled students.</p>
    </div>
  </div>
</section>
