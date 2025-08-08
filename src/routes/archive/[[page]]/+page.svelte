<script>
  import { name, archivePath } from "$lib/info.js";
  import ArrowLeftIcon from "$lib/components/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/components/ArrowRightIcon.svelte";
  import PostsList from "$lib/components/PostsList.svelte";

  
  /**
   * @typedef {Object} Props
   * @property {import('./$types').PageData} data
   */

  /** @type {Props} */
  let { data } = $props();

  let isFirstPage = $derived(data.page === 1);
  let hasNextPage = $derived(data.posts[data.posts.length - 1]?.previous);
</script>

<svelte:head>
  <title>Posts archive | {name}</title>
</svelte:head>

<div class="flex flex-col flex-grow">
  <header class="pt-4">
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Archive</h1>
    <p class="mt-6"></p>
  </header>

  <div class="mt-16 sm:mt-20">
    <PostsList posts={data.posts} showPreview={false} />
  </div>

  <!-- pagination -->
  <div class="flex items-center justify-between pt-16 pb-8">
    {#if !isFirstPage}
      <a href={`${archivePath}/${data.page - 1}`} data-sveltekit-prefetch>
        <ArrowLeftIcon class="w-4 h-4" />
        Previous
      </a>
    {:else}
      <div></div>
    {/if}

    {#if hasNextPage}
      <a href={`#${archivePath}/${data.page + 1}`} data-sveltekit-prefetch
        >Next
        <ArrowRightIcon class="w-4 h-4" />
      </a>
    {/if}
  </div>
</div>

<style>
  a {
    @apply flex items-center gap-2 font-medium text-zinc-700;
  }

  :global(.dark) a {
    @apply text-zinc-300;
  }
</style>
