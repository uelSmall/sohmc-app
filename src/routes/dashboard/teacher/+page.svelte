<script lang="ts">
  // Data passed in from +page.server.ts loader
  export let data: {
    profile?: { full_name: string; instrument: string };
    lessons?: {
      id: string;
      title: string;
      description: string;
      order_index: number;
      published?: boolean;
    }[];
    status?: { type: 'success' | 'error'; message: string }; // SSR feedback
  };
</script>

<!-- Profile header -->
{#if data.profile}
  <section class="mb-6">
    <h2 class="text-2xl font-bold">Welcome, {data.profile.full_name}</h2>
  </section>
{/if}

<!-- Upload new lesson -->
<section class="mb-8">
  <h3 class="text-xl font-semibold mb-4">Create a New Lesson</h3>

 <form method="post" action="?/uploadLesson" class="space-y-4">
  <input
    type="text"
    name="title"
    placeholder="Lesson Title"
    required
    class="form-input w-full"
  />

  <textarea
    name="description"
    placeholder="Lesson Description"
    required
    class="form-input w-full"
  ></textarea>

  <input
    type="number"
    name="order_index"
    placeholder="Order Index"
    required
    class="form-input w-full"
  />

  <!-- Updated accept attribute to include .docx -->
  <input
    type="file"
    name="file"
    accept=".pdf,.mp4,.docx"
    required
    class="form-input w-full"
  />

  <button type="submit" class="btn btn-primary w-full">Upload Lesson</button>
</form>


  {#if data.status}
    <div class={`alert-${data.status.type} mt-4`}>
      {data.status.message}
    </div>
  {/if}
</section>

<!-- Lessons management -->
{#if data.lessons}
  <section>
    <h3 class="text-xl font-semibold mb-4">Manage Your Lessons</h3>

    {#each data.lessons as lesson}
      <article class="border rounded p-4 mb-4 shadow-sm">
        <h4 class="font-semibold text-lg">{lesson.title}</h4>
        <p class="text-gray-700 mb-2">{lesson.description}</p>
        <p class="text-sm">Order: {lesson.order_index}</p>

        {#if lesson.published !== undefined}
          <p class="text-sm">
            {lesson.published ? '📖 Published' : '📝 Draft'}
          </p>
        {/if}

        <div class="mt-3 space-x-2">
          <form method="get" action={`/dashboard/teacher/lessons/${lesson.id}/edit`} class="inline">
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
          </form>

          <form method="post" action="?/togglePublish" class="inline">
            <input type="hidden" name="lesson_id" value={lesson.id} />
            <button type="submit" class="px-3 py-1 bg-green-600 text-white rounded">
              {lesson.published ? 'Unpublish' : 'Publish'}
            </button>
          </form>

          <form method="post" action="?/deleteLesson" class="inline">
            <input type="hidden" name="lesson_id" value={lesson.id} />
            <button type="submit" class="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </form>
        </div>
      </article>
    {/each}
  </section>
{:else}
  <p class="text-gray-500">No lessons found. Create your first lesson to get started!</p>
{/if}
