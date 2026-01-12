<script lang="ts">
  import { enhance } from '$app/forms';

  // Define the expected form shape
  type ProfileForm = {
    error?: string;
    success?: boolean;
  };

  export let form: ProfileForm;
  export let data: { profile: { full_name: string; avatar_url: string } | null };
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <form
    method="post"
    use:enhance
    class="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md"
  >
    <h1 class="text-xl font-semibold text-gray-900">Edit Profile</h1>

    <div>
      <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
      <input
        id="full_name"
        name="full_name"
        type="text"
        value={data.profile?.full_name ?? ''}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar URL</label>
      <input
        id="avatar_url"
        name="avatar_url"
        type="url"
        value={data.profile?.avatar_url ?? ''}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    {#if form?.error}
      <p class="text-sm text-red-600">{form.error}</p>
    {/if}

    {#if form?.success}
      <p class="text-sm text-green-600">Profile updated successfully!</p>
    {/if}

    <button
      type="submit"
      class="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Save Changes
    </button>
  </form>
</div>
