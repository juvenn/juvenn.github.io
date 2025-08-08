import { error } from '@sveltejs/kit';

/**
 * Dynamically loads the svelte component for the post (only possible in +page.js)
 * and pass on the data from +page.server.js
 *
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ params }) {
  // load the markdown file based on slug
  // vite requires relative paths and explicit file extensions for dynamic imports
  // see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations

  // see vitejs/vite#11824
  const pages = import.meta.glob('../../../pages/*.md')
  const page = pages[`../../../pages/${params.slug}.md`]
  if (!page) {
    error(404, "Not found");
  }
  const component = await page()

  return {
    page: { ...component.metadata, slug: params.slug },
    component: component.default,
    layout: {
    }
  }
}
