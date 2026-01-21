<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Card, FormInput } from '$lib/components';

  interface Lesson {
    id: string;
    title: string;
    description: string;
    content_type: string;
    content_body: string;
    content_url: string;
    order_index: number;
    instrument: string;
    published: boolean;
  }

  interface FormResult {
    error?: string;
    success?: boolean;
    message?: string;
  }

  export let data: {
    lesson: Lesson;
  };

  // Reactive form state
  let formData = {
    title: data.lesson.title,
    description: data.lesson.description,
    content_type: data.lesson.content_type,
    content_body: data.lesson.content_body,
    order_index: data.lesson.order_index
  };

  let isSubmitting = false;
  let formResult: FormResult | null = null;

  /**
   * Form submission handler
   * - Handles loading state
   * - Displays success/error messages
   * - Auto-clears messages after 3 seconds
   */
  const handleSubmit = () => {
    isSubmitting = true;
    return async ({ result }: any) => {
      isSubmitting = false;
      formResult = result.data;

      // Auto-clear success message and redirect
      if (formResult?.success) {
        setTimeout(() => {
          window.location.href = '/dashboard/teacher';
        }, 2000);
      }
    };
  };
</script>

<!-- Page Header -->
<div class="mb-8">
  <h1 class="text-4xl font-bold mb-2">Edit Lesson</h1>
  <p class="text-gray-600">Update lesson content and settings</p>
</div>

<!-- Main Form Card -->
<Card>
  <form method="post" action="?/updateLesson" use:enhance={handleSubmit} class="space-y-6">
    <!-- Lesson Title -->
    <FormInput
      label="Lesson Title"
      name="title"
      type="text"
      placeholder="e.g., Mastering the Pentatonic Scale"
      bind:value={formData.title}
      required
    />

    <!-- Lesson Description -->
    <div>
      <label for="description" class="block text-sm font-semibold mb-2">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="A detailed description of what students will learn..."
        bind:value={formData.description}
        required
        class="form-input w-full"
        rows="4"
      ></textarea>
    </div>

    <!-- Content Type Selection -->
    <div>
      <label for="content_type" class="block text-sm font-semibold mb-2">Content Type</label>
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
        <label for="content_body" class="block text-sm font-semibold mb-2">Lesson Content</label>
        <p class="text-sm text-gray-600 mb-2">Write the full lesson content. Students will see this when they open the lesson.</p>
        <textarea
          id="content_body"
          name="content_body"
          placeholder="Enter comprehensive lesson content here..."
          bind:value={formData.content_body}
          required
          class="form-input w-full font-mono text-sm"
          rows="10"
        ></textarea>
      </div>
    {:else}
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          <strong>Note:</strong> This lesson uses {formData.content_type} content. Students will access it via a link.
        </p>
        {#if data.lesson.content_url}
          <p class="text-xs text-blue-600 mt-2">Current URL: <code class="bg-white px-2 py-1 rounded">{data.lesson.content_url}</code></p>
        {/if}
      </div>
    {/if}

    <!-- Lesson Order -->
    <div>
      <label for="order_index" class="block text-sm font-semibold mb-2">Lesson Order (Sequence)</label>
      <input
        id="order_index"
        name="order_index"
        type="number"
        min="1"
        bind:value={formData.order_index}
        class="form-input w-full"
      />
    </div>

    <!-- Lesson Metadata (Read-only) -->
    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 class="font-semibold mb-3 text-gray-700">Lesson Details</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">Instrument:</span>
          <p class="font-semibold text-gray-900">{data.lesson.instrument || 'Not specified'}</p>
        </div>
        <div>
          <span class="text-gray-600">Status:</span>
          <p class="font-semibold">
            {#if data.lesson.published}
              <span class="text-green-600">📖 Published</span>
            {:else}
              <span class="text-yellow-600">📝 Draft</span>
            {/if}
          </p>
        </div>
      </div>
    </div>

    <!-- Form Status Messages -->
    {#if formResult?.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {formResult.error}
      </div>
    {/if}

    {#if formResult?.success}
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        {formResult.message} Redirecting...
      </div>
    {/if}

    <!-- Form Actions -->
    <div class="flex gap-2 justify-end pt-4 border-t border-gray-200">
      <Button
        variant="ghost"
        on:click={() => {
          window.location.href = '/dashboard/teacher';
        }}
      >
        Cancel
      </Button>
      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  </form>
</Card>
