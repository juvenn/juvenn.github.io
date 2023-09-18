
import { metaAnnotator } from '$lib/data/posts'

// Build all page objects with metadata
export const pages = Object.entries(import.meta.glob('/pages/**/*.md', { eager: true }))
  .map(metaAnnotator({ withPreview: false, urlPrefix: "" }))
