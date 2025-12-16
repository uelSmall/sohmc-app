<script lang="ts">
  export let data;
</script>

<section class="container">
  <h1 class="heading">Parent Dashboard</h1>
  <p class="mt-md">Welcome, {data.user?.email}</p>

  <div class="grid gap-lg mt-lg">
    <div class="card">
      <h2 class="subheading">Children’s Progress</h2>
      <p>Track lessons and performance of your child.</p>
    </div>

    <div class="card">
      <h2 class="subheading">Messages</h2>
      <p>Communicate with teachers and admins.</p>
    </div>
  </div>
</section>
