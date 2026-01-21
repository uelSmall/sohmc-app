<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Card, FormInput, Modal, Table } from '$lib/components';
  
  // Type-safe data from server
  interface Teacher {
    full_name: string;
    instrument: string;
  }

  interface Lesson {
    id: string;
    title: string;
    description: string;
    instrument: string;
    content_type: string;
    order_index: number;
    published: boolean;
    created_at: string;
  }

  interface FormResult {
    error?: string;
    success?: boolean;
    message?: string;
    lessonId?: string;
  }

  export let data: {
    profile?: Teacher;
    lessons: Lesson[];
    userId: string;
  };

  // Reactive state for modals and forms
  let showCreateModal = false;
  let isSubmitting = false;
  let formResult: FormResult | null = null;
  let selectedLesson: Lesson | null = null;

  // Form state for create lesson
  let formData = {
    title: '',
    description: '',
    content_type: 'text',
    content_body: '',
    order_index: 1
  };

  /**
   * Reusable form submission handler
   * - Prevents double submissions
   * - Clears result after 2 seconds
   * - Closes modal on success
   */
  const handleFormSubmit = () => {
    isSubmitting = true;
    return async ({ result, update }: any) => {
      await update();
      isSubmitting = false;
      formResult = result.data;

      // Clear success messages after 2 seconds
      if (formResult?.success) {
        setTimeout(() => {
          formResult = null;
          showCreateModal = false;
          // Reset form
          formData = {
            title: '',
            description: '',
            content_type: 'text',
            content_body: '',
            order_index: 1
          };
        }, 2000);
      }
    };
  };

  /**
   * Format date for display (e.g., "Jan 21, 2026")
   */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get badge color based on lesson state
   */
  const getStatusBadgeClass = (published: boolean) => {
    return published
      ? 'inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full'
      : 'inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full';
  };
</script>

<!-- Page Header -->
<div class="mb-8">
  <h1 class="text-4xl font-bold mb-2">Teacher Dashboard</h1>
  {#if data.profile}
    <p class="text-gray-600">Welcome, <span class="font-semibold">{data.profile.full_name}</span> • {data.profile.instrument}</p>
  {/if}
</div>

<!-- Create Lesson Button -->
<div class="mb-6 flex justify-end">
  <Button on:click={() => (showCreateModal = true)} variant="primary">
    + Create Lesson
  </Button>
</div>

<!-- Create Lesson Modal -->
{#if showCreateModal}
  <Modal
    title="Create New Lesson"
    onClose={() => {
      showCreateModal = false;
      formResult = null;
    }}
  >
    <form method="post" action="?/createLesson" use:enhance={handleFormSubmit} class="space-y-4">
      <!-- Lesson Title -->
      <FormInput
        label="Lesson Title"
        name="title"
        type="text"
        placeholder="e.g., Introduction to C Major Scale"
        bind:value={formData.title}
        required
      />

      <!-- Lesson Description -->
      <div>
        <label for="description" class="block text-sm font-semibold mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe what students will learn..."
          bind:value={formData.description}
          required
          class="form-input w-full"
          rows="4"
        ></textarea>
      </div>

      <!-- Content Type Selection -->
      <div>
        <label for="content_type" class="block text-sm font-semibold mb-1">Content Type</label>
        <select
          id="content_type"
          name="content_type"
          bind:value={formData.content_type}
          class="form-input w-full"
        >
          <option value="text">Text / Notes</option>
          <option value="pdf">PDF Document</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      <!-- Content Body (for text lessons) -->
      {#if formData.content_type === 'text'}
        <div>
          <label for="content_body" class="block text-sm font-semibold mb-1">Lesson Content</label>
          <textarea
            id="content_body"
            name="content_body"
            placeholder="Enter the full lesson content here..."
            bind:value={formData.content_body}
            required
            class="form-input w-full"
            rows="6"
          ></textarea>
        </div>
      {/if}

      <!-- Order Index -->
      <div>
        <label for="order_index" class="block text-sm font-semibold mb-1">Lesson Order</label>
        <input
          id="order_index"
          name="order_index"
          type="number"
          min="1"
          bind:value={formData.order_index}
          class="form-input w-full"
        />
      </div>

      <!-- Form Status Message -->
      {#if formResult?.error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {formResult.error}
        </div>
      {/if}

      {#if formResult?.success}
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {formResult.message}
        </div>
      {/if}

      <!-- Form Actions -->
      <div class="flex gap-2 justify-end pt-4">
        <Button
          variant="ghost"
          on:click={() => {
            showCreateModal = false;
            formResult = null;
          }}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  </Modal>
{/if}

<!-- Lessons List -->
<section>
  <h2 class="text-2xl font-bold mb-6">Your Lessons ({data.lessons?.length ?? 0})</h2>

  {#if !data.lessons || data.lessons.length === 0}
    <Card>
      <div class="text-center py-8 text-gray-500">
        <p class="mb-4">No lessons yet. Create one to get started!</p>
        <Button on:click={() => (showCreateModal = true)} variant="primary">
          Create Your First Lesson
        </Button>
      </div>
    </Card>
  {:else}
    <div class="grid gap-4">
      {#each data.lessons as lesson (lesson.id)}
        <Card>
          <div class="flex justify-between items-start mb-3">
            <!-- Lesson Title & Badge -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{lesson.title}</h3>
                <span class={getStatusBadgeClass(lesson.published)}>
                  {lesson.published ? '📖 Published' : '📝 Draft'}
                </span>
              </div>
              <p class="text-sm text-gray-600">{lesson.description}</p>
            </div>
          </div>

          <!-- Lesson Metadata -->
          <div class="grid grid-cols-4 gap-4 mb-4 text-sm text-gray-700 py-3 border-y border-gray-200">
            <div>
              <span class="font-semibold">Type:</span> {lesson.content_type}
            </div>
            <div>
              <span class="font-semibold">Order:</span> #{lesson.order_index}
            </div>
            <div>
              <span class="font-semibold">Instrument:</span> {lesson.instrument || 'N/A'}
            </div>
            <div>
              <span class="font-semibold">Created:</span> {formatDate(lesson.created_at)}
            </div>
          </div>

          <!-- Lesson Actions -->
          <div class="flex gap-2">
            <!-- Publish/Unpublish Button -->
            <form method="post" action="?/togglePublish" class="inline">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <Button
                variant={lesson.published ? 'secondary' : 'primary'}
                type="submit"
                size="sm"
              >
                {lesson.published ? '🔒 Unpublish' : '✓ Publish'}
              </Button>
            </form>

            <!-- Edit Button -->
            <Button
              variant="secondary"
              size="sm"
              on:click={() => {
                window.location.href = `/dashboard/teacher/lessons/${lesson.id}/edit`;
              }}
            >
              ✏️ Edit
            </Button>

            <!-- Delete Button -->
            <form
              method="post"
              action="?/deleteLesson"
              class="inline"
              on:submit={() => confirm('Are you sure? This cannot be undone.')}
            >
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <Button
                variant="danger"
                size="sm"
                type="submit"
              >
                🗑️ Delete
              </Button>
            </form>

            <!-- View Student Progress Button -->
            <Button
              variant="ghost"
              size="sm"
              on:click={() => {
                window.location.href = `/dashboard/teacher/lessons/${lesson.id}/progress`;
              }}
            >
              👥 Progress
            </Button>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</section>
