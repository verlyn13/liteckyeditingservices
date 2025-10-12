<script lang="ts">
export const items: { title: string; body: string }[] = [
	{
		title: "Academic Rigor",
		body: "Editors with advanced degrees and domain expertise.",
	},
	{
		title: "Fast Turnaround",
		body: "Typical 2–3 day service with rush options.",
	},
	{
		title: "Confidential & Secure",
		body: "Data handled with encryption and least-privilege access.",
	},
];

let expanded = 0;

function _toggle(i: number) {
	expanded = expanded === i ? -1 : i;
}
</script>

<div class="section">
  <div class="container">
    {#each items as item, i (item.title)}
      <div class="border border-soft-gray rounded mb-3 bg-white">
        <button class="w-full text-left p-4 flex items-center justify-between" on:click={() => toggle(i)} aria-expanded={expanded === i}>
          <span class="font-semibold text-primary-navy">{item.title}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" class="text-text-secondary" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor"/></svg>
        </button>
        {#if expanded === i}
          <div class="px-4 pb-4 text-text-secondary">{item.body}</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  /* Minimal component styles rely on global tokens */
</style>
