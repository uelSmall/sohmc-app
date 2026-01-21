<script lang="ts">
  export let title: string | undefined = undefined;
  export let hover = false;
</script>

<div
  class={`
    bg-white rounded-[--radius-brand] border border-gray-200 p-[--space-md]
    ${hover ? 'hover:shadow-lg hover:border-[--color-brand-primary] transition-all cursor-pointer' : 'shadow-sm'}
  `}
>
  {#if title}
    <h3 class="text-lg font-semibold text-[--color-brand-primary] mb-[--space-sm]">
      {title}
    </h3>
  {/if}
  <slot />
</div>
