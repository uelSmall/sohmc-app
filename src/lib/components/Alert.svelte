<script lang="ts">
  export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
  export let title: string | undefined = undefined;
</script>

<div
  class={`
    rounded-[--radius-brand] p-[--space-md] border-l-4
    ${type === 'success' ? 'bg-green-50 border-[--color-success] text-green-800' : ''}
    ${type === 'error' ? 'bg-red-50 border-[--color-error] text-red-800' : ''}
    ${type === 'warning' ? 'bg-yellow-50 border-[--color-warning] text-yellow-800' : ''}
    ${type === 'info' ? 'bg-blue-50 border-[--color-info] text-blue-800' : ''}
  `}
>
  {#if title}
    <h4 class="font-semibold mb-1">{title}</h4>
  {/if}
  <slot />
</div>
