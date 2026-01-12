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
    progress?: {
      lesson_id: string;
      status: string;
      notes?: string;
    }[];
    unlockedLessonIndex?: number;
  };

  // Helper to get the status of a lesson from progress records
  const getStatus = (lessonId: string) => {
    const record = data.progress?.find(p => p.lesson_id === lessonId);
    return record ? record.status : 'not_started';
  };
</script>

<!-- Profile header -->
{#if data.profile}
  <section class="mb-6">
    <h2 class="text-2xl font-bold">Welcome, {data.profile.full_name}</h2>
    <p class="text-gray-600">Instrument: {data.profile.instrument}</p>
  </section>
{/if}

<!-- Lessons list -->
{#if data.lessons && data.unlockedLessonIndex !== undefined}
  <section>
    <h3 class="text-xl font-semibold mb-4">Your Lessons</h3>

    {#each data.lessons as lesson}
      <article class="border rounded p-4 mb-4 shadow-sm">
        <!-- Lesson title + description -->
        <h4 class="font-semibold text-lg">{lesson.title}</h4>
        <p class="text-gray-700 mb-2">{lesson.description}</p>

        <!-- Lesson status -->
        <p class="text-sm">Status: {getStatus(lesson.id)}</p>

        <!-- Published/Draft indicator -->
        {#if lesson.published !== undefined}
          <p class="text-sm">
            {lesson.published ? '📖 Published' : '📝 Draft'}
          </p>
        {/if}

        <!-- Lesson state based on unlocked index -->
        {#if lesson.order_index === data.unlockedLessonIndex}
          <!-- Current unlocked lesson -->
          <p class="mt-2 text-blue-600">Unlocked — ready to start!</p>

          <!-- Example actions -->
          <div class="mt-3 space-y-2">
            <!-- Start lesson -->
            <form method="post" action="?/startLesson">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded">
                Start Lesson
              </button>
            </form>

            <!-- Complete lesson -->
            <form method="post" action="?/completeLesson">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <button type="submit" class="px-3 py-1 bg-green-600 text-white rounded">
                Mark Complete
              </button>
            </form>

            <!-- Add note -->
            <form method="post" action="?/noteLesson" class="flex space-x-2">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <input
                type="text"
                name="note"
                placeholder="Add a note…"
                class="flex-1 border rounded px-2 py-1"
              />
              <button type="submit" class="px-3 py-1 bg-gray-700 text-white rounded">
                Save Note
              </button>
            </form>
          </div>

        {:else if lesson.order_index < data.unlockedLessonIndex}
          <!-- Completed lessons -->
          <p class="mt-2 text-green-600">✅ Completed</p>

        {:else}
          <!-- Locked lessons -->
          <p class="mt-2 text-gray-400">🔒 Locked</p>
        {/if}
      </article>
    {/each}
  </section>
{/if}

<section class="space-y-6">
  <!-- Brand Heading -->
  <h1 class="text-3xl font-bold text-brand-primary font-brand">
    Tailwind v4 + Brand Tokens Active
  </h1>

  <!-- Button Test -->
  <button class="btn btn-primary">Primary Button</button>
  <button class="btn btn-success">Success Button</button>
  <button class="btn btn-error">Error Button</button>
  <button class="btn btn-warning">Warning Button</button>
  <button class="btn btn-info">Info Button</button>

  <!-- Card Test -->
  <div class="card">
    <h2 class="text-lead">Card Component</h2>
    <p class="text-caption">This card uses brand colors and spacing tokens.</p>
    <span class="tag">Tag Example</span>
  </div>

  <!-- Alert Test -->
  <div class="alert alert-success">✅ Success Alert</div>
  <div class="alert alert-error">❌ Error Alert</div>
  <div class="alert alert-warning">⚠️ Warning Alert</div>
  <div class="alert alert-info">ℹ️ Info Alert</div>

  <!-- Form Test -->
  <label class="form-label">Email</label>
  <input type="email" class="form-input" placeholder="you@example.com" />
  <p class="form-helper">We’ll never share your email.</p>
</section>
