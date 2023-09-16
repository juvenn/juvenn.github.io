<script>
  import Card from "./Card.svelte";
  import ArrowRightIcon from "./ArrowRightIcon.svelte";

  export let post;
  export let showPreview = true;
</script>

<Card href={post.path} data-sveltekit-prefetch>
  <slot slot="eyebrow" name="eyebrow" />
  <slot slot="title">{post.title}</slot>
  <div slot="description" class="prose dark:prose-invert">
    {#if showPreview}
      {@html post.preview.html}
    {/if}
  </div>
  <div slot="actions">
    <div class="flex items-center text-teal-500">
      <span class="text-sm font-medium">Read</span>
      <ArrowRightIcon class="w-4 h-4 ml-1" />
    </div>
  </div>
</Card>

<style>
  .prose > :global(p) {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
