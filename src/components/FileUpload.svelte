<script lang="ts">
  /**
   * Minimal file upload UI. No network calls.
   * Emits `change` with the selected File.
   */
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ change: File | null }>();

  export let accept = '.doc,.docx,.pdf,.rtf';
  export let maxBytes = 10 * 1024 * 1024; // 10MB
  let file: File | null = null;
  let error = '';

  function onChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files && input.files[0] ? input.files[0] : null;
    error = '';
    if (f && f.size > maxBytes) {
      error = `File too large. Max ${(maxBytes / (1024 * 1024)).toFixed(0)}MB.`;
      file = null;
      dispatch('change', null);
    } else {
      file = f;
      dispatch('change', file);
    }
  }
</script>

<div class="section">
  <div class="container">
    <label for="upload" class="font-medium text-primary-navy">Upload your document</label>
    <input id="upload" name="upload" class="mt-2" type="file" {accept} on:change={onChange} />
    {#if file}
      <p class="mt-2 text-sm text-text-secondary">{file.name} — {(file.size/1024).toFixed(0)} KB</p>
    {/if}
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>
  </div>

<style>
  /* Rely on global base styles and tokens */
</style>

