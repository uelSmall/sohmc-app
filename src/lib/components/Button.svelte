<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<button
  type={type}
  disabled={disabled}
  class={`
    font-brand font-semibold rounded transition-all
    ${size === 'sm' ? 'px-3 py-1 text-sm' : ''}
    ${size === 'md' ? 'px-4 py-2 text-base' : ''}
    ${size === 'lg' ? 'px-6 py-3 text-lg' : ''}
    ${variant === 'primary' ? 'bg-[--color-brand-primary] text-[--color-brand-secondary] hover:opacity-90' : ''}
    ${variant === 'secondary' ? 'bg-gray-200 text-[--color-brand-black] hover:bg-gray-300' : ''}
    ${variant === 'danger' ? 'bg-[--color-error] text-white hover:opacity-90' : ''}
    ${variant === 'ghost' ? 'bg-transparent text-[--color-brand-primary] hover:bg-gray-100' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `}
>
  <slot />
</button>
