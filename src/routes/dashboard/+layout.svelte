<script lang="ts">
  // Dashboard layout receives user + role from +layout.server.ts
  export let data: { user: { email: string } | null; role: string | null };
</script>


<!-- Sidebar for role-specific actions -->
{#if data.user}
  <aside class="bg-gray-100 p-4 border-r w-52 float-left min-h-screen">
    <div class="mb-4 text-sm text-gray-700">
      {data.user.email} <br />
      Role: {data.role}
    </div>

    {#if data.role === 'student'}
      <ul class="space-y-2">
        <li><a href="/dashboard/student/profile" class="block">👤 Profile</a></li>
        <li><a href="/dashboard/student/courses" class="block">📖 Lessons</a></li>
      </ul>
    {:else if data.role === 'teacher'}
      <ul class="space-y-2">
        <li><a href="/dashboard/teacher/profile" class="block">👤 Profile</a></li>
        <li><a href="/dashboard/teacher/lessons" class="block">📖 Manage Lessons</a></li>
      </ul>
    {/if}
  </aside>
{/if}

<main class="ml-56 p-6">
  <slot />
</main>

