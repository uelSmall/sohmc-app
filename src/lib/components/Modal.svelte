<script lang="ts">
  export let title: string | undefined = undefined;
  export let onClose: (() => void) | undefined = undefined;

  function handleBackdropClick() {
    if (onClose) onClose();
  }
</script>

<div
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  on:click={handleBackdropClick}
  role="presentation"
>
  <div
    class="bg-white rounded-[--radius-brand] shadow-lg max-w-md w-full mx-4 p-[--space-lg]"
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="dialog"
    aria-modal="true"
    tabindex="0"
  >
    {#if title}
      <h2 class="text-xl font-bold text-[--color-brand-primary] mb-[--space-md]">
        {title}
      </h2>
    {/if}
    <slot />
  </div>
</div>
