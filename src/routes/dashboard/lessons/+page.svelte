<!-- src/routes/dashboard/lessons/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div class="card max-w-3xl">
  <h2 class="text-brand-primary font-brand mb-md">Lessons</h2>

  {#if data.lessons?.length}
    <ul class="space-y-md">
      {#each data.lessons as lesson}
        <li class="border-b pb-sm">
          <h3 class="text-brand-black font-semibold">{lesson.title}</h3>
          <p class="text-brand-black text-sm mb-sm">{lesson.description}</p>
          <p class="text-muted text-xs">
            {lesson.instrument} • {new Date(lesson.created_at).toLocaleDateString()}
          </p>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-brand-black">No lessons available for your instrument yet.</p>
  {/if}
</div>
