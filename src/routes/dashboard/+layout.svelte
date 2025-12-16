<script lang="ts">
  export let data: {
    user: { email: string } | null;
    profile: { role?: string; avatar_url?: string } | null;
  };
</script>

<div class="flex h-screen font-brand bg-brand-secondary text-brand-black">
  <!-- Sidebar -->
  <aside class="w-64 bg-brand-primary text-brand-secondary flex flex-col">
    <!-- Brand header -->
    <div class="p-md border-b border-brand-secondary text-center">
      <h1 class="text-xl font-bold">SOHMC</h1>
    </div>

    <!-- User info -->
    <div class="p-md border-b border-brand-secondary flex flex-col items-center">
      <img
        src={data.profile?.avatar_url ?? '/default-avatar.png'}
        alt="User avatar"
        class="w-16 h-16 rounded-full object-cover border border-brand-secondary"
      />
      <p class="mt-sm font-semibold">{data.user?.email}</p>
      <p class="text-caption">{data.profile?.role ?? 'No role'}</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-md space-y-sm text-sm">
      <a href="/dashboard" class="block px-3 py-2 rounded hover:bg-brand-secondary hover:text-brand-black">🏠 Home</a>
      <a href="/dashboard/profile" class="block px-3 py-2 rounded hover:bg-brand-secondary hover:text-brand-black">👤 Profile</a>

      {#if data.profile?.role === 'teacher'}
        <a href="/dashboard/teacher/lessons" class="block px-3 py-2 rounded hover:bg-brand-secondary hover:text-brand-black">📚 Lessons</a>
        <a href="/dashboard/teacher/students" class="block px-3 py-2 rounded hover:bg-brand-secondary hover:text-brand-black">👩‍🎓 Students</a>
      {/if}

      {#if data.profile?.role === 'student'}
        <a href="/dashboard/student/courses" class="block px-3 py-2 rounded hover:bg-brand-secondary hover:text-brand-black">📖 Courses</a>
      {/if}

      {#if data.profile?.role === 'parent'}
        <a href="/dashboard/parent/progress" class="block px-3 py-2 rounded hover:bg-brand-secondary hover:text-brand-black">📊 Children’s Progress</a>
      {/if}
    </nav>
  </aside>

  <!-- Main content -->
  <div class="flex-1 flex flex-col">
    <!-- Topbar -->
    <header class="h-16 bg-brand-secondary border-b border-brand-gray flex items-center justify-between px-md">
      <h2 class="text-lg font-semibold text-brand-black">Dashboard</h2>
      <form method="post" action="/auth/logout">
        <button type="submit" class="btn btn-primary">Logout</button>
      </form>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto p-lg">
      <slot />
    </main>
  </div>
</div>
