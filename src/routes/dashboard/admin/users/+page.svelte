<script lang="ts">
  import { enhance } from '$app/forms';
  export let data;
  export let form: { error?: string; success?: boolean } | undefined;

  const totalPages = Math.ceil(data.count / data.limit);

  function sortLink(column: string) {
    const newDir =
      data.sortBy === column && data.sortDir === 'asc' ? 'desc' : 'asc';
    return `?sortBy=${column}&sortDir=${newDir}&page=${data.page}&search=${data.search}`;
  }
</script>

<section class="container-narrow">
  <div class="card">
    <h1 class="heading">User Management</h1>

    <!-- Search form -->
    <form method="get" class="flex gap-md mb-md">
      <input
        type="text"
        name="search"
        placeholder="Search by name or email"
        class="input flex-1"
        value={data.search}
      />
      <button type="submit" class="btn btn-secondary">Search</button>
      <!-- ✅ Reset filters button -->
      <a href="/dashboard/admin/users" class="btn btn-outline">Reset filters</a>
    </form>

    {#if data.users.length === 0}
      <!-- ✅ Graceful empty state -->
      <p class="text-gray-600 text-center mt-md">
        No users found {#if data.search}matching "{data.search}"{/if}.
      </p>
      <div class="flex justify-center mt-md">
        <a href="/dashboard/admin/users" class="btn btn-outline">Clear search</a>
      </div>
    {:else}
      <table class="table mt-md">
        <thead>
          <tr>
            <th>
              <a href={sortLink('email')} class="underline">
                Email {data.sortBy === 'email' ? (data.sortDir === 'asc' ? '▲' : '▼') : ''}
              </a>
            </th>
            <th>
              <a href={sortLink('full_name')} class="underline">
                Name {data.sortBy === 'full_name' ? (data.sortDir === 'asc' ? '▲' : '▼') : ''}
              </a>
            </th>
            <th>
              <a href={sortLink('role')} class="underline">
                Role {data.sortBy === 'role' ? (data.sortDir === 'asc' ? '▲' : '▼') : ''}
              </a>
            </th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user}
            <tr>
              <td>{user.email}</td>
              <td>{user.full_name}</td>
              <td>{user.role ?? '—'}</td>
              <td>
                <form method="post" action="?/updateRole" use:enhance>
                  <input type="hidden" name="user_id" value={user.user_id} />
                  <select name="role" class="input">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" class="btn btn-secondary ml-sm">Save</button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-center gap-sm mt-md">
        {#each Array(totalPages) as _, i}
          <a
            href={`?page=${i + 1}&search=${data.search}&sortBy=${data.sortBy}&sortDir=${data.sortDir}`}
            class="btn btn-outline {data.page === i + 1 ? 'bg-blue-100' : ''}"
          >
            {i + 1}
          </a>
        {/each}
      </div>
    {/if}

    {#if form?.error}
      <p class="text-red-600 mt-md">❌ {form.error}</p>
    {/if}
    {#if form?.success}
      <p class="text-green-600 mt-md">✅ Role updated successfully</p>
    {/if}
  </div>
</section>
