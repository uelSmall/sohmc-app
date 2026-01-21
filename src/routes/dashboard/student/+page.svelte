<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Card } from '$lib/components';

  interface Profile {
    full_name: string;
    instrument: string;
  }

  interface Lesson {
    id: string;
    title: string;
    description: string;
    content_type: string;
    content_body: string;
    content_url: string;
    order_index: number;
    published: boolean;
  }

  interface FormResult {
    error?: string;
    success?: boolean;
    message?: string;
  }

  export let data: {
    profile?: Profile;
    lessons?: Lesson[];
    progressMap: Record<string, { status: string; notes?: string; last_viewed_at?: string }>;
    unlockedLessonIndex?: number;
  };

  // Reactive state
  let selectedLessonId: string | null = null;
  let expandedNoteId: string | null = null;
  let formResults: Record<string, FormResult> = {};

  /**
   * Get progress status for a lesson
   * Returns: 'not_started' | 'in_progress' | 'completed'
   */
  const getStatus = (lessonId: string) => {
    return data.progressMap[lessonId]?.status ?? 'not_started';
  };

  /**
   * Get status badge styling and text
   */
  const getStatusBadge = (status: string) => {
    const badgeMap = {
      completed: { color: 'bg-green-100 text-green-800', icon: '✅' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: '🔄' },
      not_started: { color: 'bg-gray-100 text-gray-800', icon: '⭕' }
    };
    return badgeMap[status as keyof typeof badgeMap] || badgeMap.not_started;
  };

  /**
   * Format progress for display
   */
  const formatProgressText = (status: string) => {
    const textMap = {
      completed: 'Completed',
      in_progress: 'In Progress',
      not_started: 'Not Started'
    };
    return textMap[status as keyof typeof textMap] || status;
  };

  /**
   * Form submission handler for lesson actions
   * - Provides loading feedback
   * - Displays success/error messages
   * - Clears selected lesson on completion
   */
  const handleFormAction = (lessonId: string) => {
    return async ({ result }: any) => {
      formResults[lessonId] = result.data ?? {};

      // Clear selected lesson and feedback after 2 seconds on success
      if (result.data?.success) {
        setTimeout(() => {
          selectedLessonId = null;
          delete formResults[lessonId];
        }, 2000);
      }
    };
  };

  /**
   * Check if a lesson is unlocked
   * - First lesson always unlocked
   * - Others unlocked after previous lesson completion
   */
  const isUnlocked = (orderIndex: number) => {
    return orderIndex <= (data.unlockedLessonIndex ?? 1);
  };

  /**
   * Format last viewed date
   */
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<!-- Page Header -->
<div class="mb-8">
  <h1 class="text-4xl font-bold mb-2">Student Dashboard</h1>
  {#if data.profile}
    <div class="flex items-center gap-6">
      <div>
        <p class="text-gray-600">
          Welcome, <span class="font-semibold">{data.profile.full_name}</span>
        </p>
        <p class="text-gray-600">
          Instrument: <span class="font-semibold">{data.profile.instrument}</span>
        </p>
      </div>
    </div>
  {/if}
</div>

<!-- Lessons Grid -->
<section>
  <h2 class="text-2xl font-bold mb-6">Your Lessons</h2>

  {#if !data.lessons || data.lessons.length === 0}
    <Card>
      <div class="text-center py-12 text-gray-500">
        <p class="mb-4 text-lg">No lessons available yet.</p>
        <p class="text-sm">Check back soon for new content!</p>
      </div>
    </Card>
  {:else}
    <div class="space-y-4">
      {#each data.lessons as lesson (lesson.id)}
        {@const status = getStatus(lesson.id)}
        {@const isLocked = !isUnlocked(lesson.order_index)}
        {@const badge = getStatusBadge(status)}
        {@const isSelected = selectedLessonId === lesson.id}

        <Card>
          <div class="flex items-start justify-between mb-4">
            <!-- Lesson Header -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-gray-900">{lesson.order_index}. {lesson.title}</h3>
                {#if isLocked}
                  <span class="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                    🔒 Locked
                  </span>
                {:else}
                  <span class={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                    {badge.icon} {formatProgressText(status)}
                  </span>
                {/if}
              </div>
              <p class="text-gray-700 mb-2">{lesson.description}</p>

              <!-- Progress Info -->
              <div class="text-sm text-gray-600">
                <p>Content Type: <span class="font-semibold">{lesson.content_type}</span></p>
                {#if data.progressMap[lesson.id]?.last_viewed_at && !isLocked}
                  <p>Last Viewed: {formatDate(data.progressMap[lesson.id]?.last_viewed_at ?? null)}</p>
                {/if}
              </div>
            </div>
          </div>

          {#if !isLocked}
            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Start/View Lesson Button -->
              {#if status === 'not_started'}
                <form method="post" action="?/startLesson" use:enhance={handleFormAction(lesson.id)} >
                  <input type="hidden" name="lesson_id" value={lesson.id} />
                  <Button type="submit" variant="primary" >
                    Begin Lesson →
                  </Button>
                </form>
              {:else if status === 'in_progress'}
                <Button
                  variant="secondary"
                  on:click={() => (selectedLessonId = selectedLessonId === lesson.id ? null : lesson.id)}
                  
                >
                  {isSelected ? '▼ Hide Content' : '▶ View Content'}
                </Button>
              {:else}
                <Button
                  variant="secondary"
                  on:click={() => (selectedLessonId = selectedLessonId === lesson.id ? null : lesson.id)}
                  
                >
                  {isSelected ? '▼ Hide Content' : '▶ Review Content'}
                </Button>
              {/if}

              <!-- Status Messages -->
              {#if formResults[lesson.id]?.error}
                <div class="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {formResults[lesson.id].error}
                </div>
              {/if}

              {#if formResults[lesson.id]?.success}
                <div class="text-sm text-green-600 bg-green-50 p-2 rounded">
                  {formResults[lesson.id].message}
                </div>
              {/if}
            </div>

            <!-- Complete Lesson Button (only when in progress) -->
            {#if status === 'in_progress' || status === 'completed'}
              <div class="mt-3 pt-3 border-t border-gray-200">
                <form method="post" action="?/completeLesson" use:enhance={handleFormAction(lesson.id)} >
                  <input type="hidden" name="lesson_id" value={lesson.id} />
                  <Button
                    type="submit"
                    variant={status === 'completed' ? 'secondary' : 'primary'}
                    
                  >
                    {status === 'completed' ? '✅ Mark Incomplete' : '✓ Mark Complete'}
                  </Button>
                </form>
              </div>
            {/if}
          {/if}

          <!-- Lesson Content (when selected and unlocked) -->
          {#if isSelected && !isLocked}
            <div class="mt-4 pt-4 border-t border-gray-200">
              {#if lesson.content_type === 'text' && lesson.content_body}
                <div class="bg-gray-50 rounded-lg p-6 mb-4">
                  <h4 class="font-bold text-gray-900 mb-3">Lesson Content</h4>
                  <div class="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                    {lesson.content_body}
                  </div>
                </div>
              {:else if lesson.content_url}
                <div class="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                  <p class="text-sm text-blue-900">
                    <strong>External Content:</strong> This lesson is hosted externally.
                  </p>
                  <a href={lesson.content_url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline text-sm">
                    Open {lesson.content_type.toUpperCase()} →
                  </a>
                </div>
              {/if}

              <!-- Student Notes Section -->
              <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-4">
                <h4 class="font-semibold text-gray-900 mb-2">📝 Your Notes</h4>
                <form method="post" action="?/noteLesson" use:enhance class="space-y-2">
                  <input type="hidden" name="lesson_id" value={lesson.id} />
                  <textarea
                    name="note"
                    placeholder="Add your thoughts, questions, or reflections here..."
                    value={data.progressMap[lesson.id]?.notes ?? ''}
                    class="form-input w-full"
                    rows="3"
                  ></textarea>
                  <Button type="submit" variant="secondary" size="sm">
                    💾 Save Note
                  </Button>
                </form>
              </div>
            </div>
          {/if}
        </Card>
      {/each}
    </div>

    <!-- Progress Overview -->
    <div class="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <h3 class="font-bold text-gray-900 mb-2">Your Progress</h3>
      <p class="text-sm text-gray-700">
        {#if data.lessons}
          You've completed <span class="font-semibold">{data.lessons.filter(l => getStatus(l.id) === 'completed').length}</span> of
          <span class="font-semibold">{data.lessons.length}</span> lessons. Keep up the great work!
        {/if}
      </p>
    </div>
  {/if}
</section>
