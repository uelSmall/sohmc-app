<script lang="ts">
  export let label: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let value = '';
  export let options: { value: string; label: string }[] = [];
  export let error: string | undefined = undefined;
  export let required = false;
  export let disabled = false;
</script>

<div class="space-y-[--space-xs]">
  {#if label}
    <label for={name} class="block text-sm font-medium text-[--color-brand-black]">
      {label}
      {#if required}
        <span class="text-[--color-error]">*</span>
      {/if}
    </label>
  {/if}
  <select
    {name}
    {value}
    {required}
    {disabled}
    on:change
    class={`
      w-full px-3 py-2 border rounded-[--radius-brand] text-[--color-brand-black]
      focus:outline-none focus:ring-2 focus:ring-[--color-brand-primary]
      ${error ? 'border-[--color-error]' : 'border-gray-300'}
      ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    `}
  >
    <option value="">Select an option</option>
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
  {#if error}
    <p class="text-sm text-[--color-error]">{error}</p>
  {/if}
</div>
