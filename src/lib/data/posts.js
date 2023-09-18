import { browser } from '$app/environment'
import { format } from 'date-fns'
import { parse } from 'node-html-parser'
import readingTime from 'reading-time/lib/reading-time.js'
import { website } from "$lib/info.js";

// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`posts can only be imported server-side`)
}

// Get all posts and add metadata
export const posts = Object.entries(import.meta.glob('/posts/**/*.md', { eager: true }))
  .map(metaAnnotator({ withPreview: true, urlPrefix: "/post" }))
  // sort by date
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  // add references to the next/previous post
  .map((post, index, allPosts) => ({
    ...post,
    next: allPosts[index - 1],
    previous: allPosts[index + 1]
  }))

export function metaAnnotator({ withPreview = false, urlPrefix = "/" }) {
  return ([filepath, entry]) => {
    const slug = filepath
      .replace(/(\/index)?\.md/, '')
      .split('/')
      .pop()

    let meta = {
      ...entry.metadata,

      // generate the slug from the file path
      slug: slug,

      path: `${urlPrefix}/${slug}`,
      url: `${website}${urlPrefix}/${slug}`,

      // whether or not this file is `my-post.md` or `my-post/index.md`
      // (needed to do correct dynamic import in posts/[slug].svelte)
      isIndexFile: filepath.endsWith('/index.md'),

      // format date as yyyy-MM-dd
      date: formatDate(entry.metadata.date)
    }
    if (!withPreview) {
      return meta
    }

    const html = parse(entry.default.render().html)
    const preview = entry.metadata.preview ? parse(entry.metadata.preview) : html.querySelector('p')

    meta.readingTime = readingTime(html.structuredText).text
    meta.preview = {
      html: preview.toString(),
      // text-only preview (i.e no html elements), used for SEO
      text: preview.structuredText ?? preview.toString()
    }
    return meta
  }
}

function formatDate(date) {
  if (date) {
    // offset by timezone so that the date is correct
    const xdate = addTimezoneOffset(new Date(date))
    return format(xdate, 'yyyy-MM-dd')
  }
  return format(new Date(), 'yyyy-MM-dd')
}

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000
  return new Date(new Date(date).getTime() + offsetInMilliseconds)
}
