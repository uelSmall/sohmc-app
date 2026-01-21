<script lang="ts">
  import { Button, Card, Table } from '$lib/components';

  interface StudentProgress {
    userId: string;
    fullName: string;
    email: string;
    status: string;
    lastViewedAt: string | null;
    notes: string | null;
  }

  interface Lesson {
    id: string;
    title: string;
    description: string;
    published: boolean;
  }

  interface Stats {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  }

  export let data: {
    lesson: Lesson;
    studentProgress: StudentProgress[];
    stats: Stats;
  };

  // Reactive state for action feedback
  let actionFeedback: { [key: string]: { message?: string; error?: string } } = {};

  /**
   * Format last viewed date for display
   */
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge styling
   */
  const getStatusBadgeClass = (status: string) => {
    const base = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'completed':
        return `${base} bg-green-100 text-green-800`;
      case 'in_progress':
        return `${base} bg-blue-100 text-blue-800`;
      case 'not_started':
        return `${base} bg-gray-100 text-gray-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  /**
   * Get human-readable status text
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅ Completed';
      case 'in_progress':
        return '🔄 In Progress';
      case 'not_started':
        return '⭕ Not Started';
      default:
        return status;
    }
  };
</script>

<!-- Page Header -->
<div class="mb-8">
  <div class="flex items-center gap-4 mb-4">
    <div class="text-4xl font-bold">Student Progress</div>
    <span class="text-lg text-gray-600 font-semibold">{data.lesson.title}</span>
  </div>
  <p class="text-gray-600">{data.lesson.description}</p>
</div>

<!-- Progress Statistics -->
<div class="grid grid-cols-4 gap-4 mb-8">
  <Card>
    <div class="text-center">
      <div class="text-4xl font-bold text-gray-900">{data.stats.total}</div>
      <div class="text-sm text-gray-600 mt-1">Total Students</div>
    </div>
  </Card>

  <Card>
    <div class="text-center">
      <div class="text-4xl font-bold text-green-600">{data.stats.completed}</div>
      <div class="text-sm text-gray-600 mt-1">Completed</div>
    </div>
  </Card>

  <Card>
    <div class="text-center">
      <div class="text-4xl font-bold text-blue-600">{data.stats.inProgress}</div>
      <div class="text-sm text-gray-600 mt-1">In Progress</div>
    </div>
  </Card>

  <Card>
    <div class="text-center">
      <div class="text-4xl font-bold text-gray-400">{data.stats.notStarted}</div>
      <div class="text-sm text-gray-600 mt-1">Not Started</div>
    </div>
  </Card>
</div>

<!-- Student Progress Table -->
<section>
  {#if data.studentProgress.length === 0}
    <Card>
      <div class="text-center py-8 text-gray-500">
        <p>No students have viewed this lesson yet.</p>
      </div>
    </Card>
  {:else}
    <Card>
      <h2 class="text-2xl font-bold mb-6">Student Details</h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th class="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Last Viewed</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
              <th class="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each data.studentProgress as student (student.userId)}
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <!-- Student Name -->
                <td class="py-3 px-4 font-semibold text-gray-900">{student.fullName}</td>

                <!-- Email -->
                <td class="py-3 px-4 text-sm text-gray-600">{student.email}</td>

                <!-- Status Badge -->
                <td class="py-3 px-4 text-center">
                  <span class={getStatusBadgeClass(student.status)}>
                    {getStatusText(student.status)}
                  </span>
                </td>

                <!-- Last Viewed -->
                <td class="py-3 px-4 text-sm text-gray-600">{formatDate(student.lastViewedAt)}</td>

                <!-- Notes -->
                <td class="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                  {student.notes || '—'}
                </td>

                <!-- Actions -->
                <td class="py-3 px-4 text-center">
                  <div class="flex gap-2 justify-center">
                    {#if student.status !== 'completed'}
                      <!-- Mark as Complete -->
                      <form method="post" action="?/markStudentComplete" class="inline">
                        <input type="hidden" name="student_id" value={student.userId} />
                        <button
                          type="submit"
                          class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                          title="Mark student as completed"
                        >
                          ✓ Done
                        </button>
                      </form>
                    {/if}

                    {#if student.status !== 'not_started'}
                      <!-- Reset Progress -->
                      <form
                        method="post"
                        action="?/resetStudentProgress"
                        class="inline"
                        on:submit={() => confirm('Are you sure? This will reset their progress.')}
                      >
                        <input type="hidden" name="student_id" value={student.userId} />
                        <button
                          type="submit"
                          class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                          title="Reset student progress"
                        >
                          ↻ Reset
                        </button>
                      </form>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Completion Summary -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-800">
          <strong>{data.stats.completed}</strong> of <strong>{data.stats.total}</strong> students have completed this lesson
          ({((data.stats.completed / data.stats.total) * 100).toFixed(0)}% completion rate)
        </p>
      </div>
    </Card>
  {/if}
</section>

<!-- Back Link -->
<div class="mt-8">
  <Button
    variant="ghost"
    on:click={() => {
      window.history.back();
    }}
  >
    ← Back to Lessons
  </Button>
</div>
