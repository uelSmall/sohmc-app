<script lang="ts">
  export let data;
</script>

<h2>Test users</h2>

{#if data.error}
  <p style="color:red">Error: {data.error}</p>
{:else}
  <ul>
    {#each data.users as u}
      <li>{u.full_name} — {u.role}</li>
    {/each}
  </ul>
{/if}
