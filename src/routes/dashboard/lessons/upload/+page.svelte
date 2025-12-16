<script lang="ts">
  import type { PageData, ActionData } from './$types';
  export let data: PageData;
  export let form: ActionData;
</script>

<div class="card max-w-2xl">
  <h2 class="text-brand-primary font-brand mb-md">Upload lesson</h2>

  {#if form?.message}
    <p class="text-brand-black mb-sm"><strong>Note:</strong> {form.message}</p>
  {/if}

  {#if form?.success}
    <p class="text-brand-black mb-md"><strong>Success:</strong> Lesson uploaded.</p>
  {/if}

  <form method="post" enctype="multipart/form-data" class="space-y-md">
    <div>
      <label for="title" class="text-brand-black font-semibold">Title</label>
      <input id="title" name="title" type="text" class="input w-full"
        value={form?.values?.title ?? ''} required />
    </div>

    <div>
      <label for="description" class="text-brand-black font-semibold">Description</label>
      <textarea id="description" name="description" class="textarea w-full" rows="4">
{form?.values?.description ?? ''}</textarea>
    </div>

    <div>
      <label for="instrument" class="text-brand-black font-semibold">Instrument</label>
      <input id="instrument" name="instrument" type="text" class="input w-full"
        value={form?.values?.instrument ?? data.profile?.instrument ?? ''} required />
    </div>

    <div>
      <label for="file" class="text-brand-black font-semibold">File</label>
      <input id="file" name="file" type="file" class="input w-full" required />
      <p class="text-muted text-xs">Accepted: video, audio, PDF. Max per your bucket policy.</p>
    </div>

    <button type="submit" class="btn btn-primary" name="upload">Upload</button>
  </form>
</div>
