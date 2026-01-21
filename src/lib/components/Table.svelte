<script lang="ts">
  export let columns: { key: string; label: string }[] = [];
  export let rows: Record<string, any>[] = [];
</script>

<div class="overflow-x-auto rounded-[--radius-brand] border border-gray-200">
  <table class="w-full">
    <thead class="bg-[--color-brand-primary] text-[--color-brand-secondary]">
      <tr>
        {#each columns as col}
          <th class="px-[--space-md] py-[--space-sm] text-left font-semibold text-sm">
            {col.label}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i}
        <tr
          class={`
            border-t border-gray-200
            ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            hover:bg-gray-100 transition-colors
          `}
        >
          {#each columns as col}
            <td class="px-[--space-md] py-[--space-md] text-sm text-[--color-brand-black]">
              <slot name="cell" key={col.key} value={row[col.key]}>
                {row[col.key]}
              </slot>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  {#if rows.length === 0}
    <div class="text-center p-[--space-lg] text-[--color-brand-gray]">
      No data available
    </div>
  {/if}
</div>
