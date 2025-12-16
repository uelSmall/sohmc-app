<script lang="ts">
  export let data;
</script>

<section class="container">
  <h1 class="heading">Student Dashboard</h1>
  <p class="mt-md">Welcome, {data.user?.email}</p>

  <div class="grid gap-lg mt-lg">
    <div class="card">
      <h2 class="subheading">My Courses</h2>
      <p>Browse lessons assigned to you.</p>
    </div>

    <div class="card">
      <h2 class="subheading">Profile</h2>
      <a href="/dashboard/profile" class="btn btn-secondary mt-md">View / Edit Profile</a>
    </div>
  </div>
</section>
