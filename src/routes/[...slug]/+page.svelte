<script>
  import ToC from "$lib/components/ToC.svelte";
  import { name } from "$lib/info.js";
  
  /**
   * @typedef {Object} Props
   * @property {import('./$types').PageData} data
   */

  /** @type {Props} */
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.page.title} | {name}</title>
</svelte:head>

<div class="flex flex-col flex-grow">
  <div class="w-full mx-auto overflow-x-hidden">
    <article>
      <header class="pt-4">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          {data.page.title}
        </h1>
        <p class="mt-6"></p>
      </header>

      <!-- render the page -->
      <div class="prose dark:prose-invert prose-li:m-0 prose-li:p-0">
        <data.component />
      </div>
    </article>
  </div>
</div>
