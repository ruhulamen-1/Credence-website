import type { Metadata } from 'next'
import { href, type Lang } from '../i18n'

/** Canonical + hreflang alternates for a path (English path without prefix, e.g. '/projects/arkology'). */
export function alternates(lang: Lang, path: string): Metadata['alternates'] {
  return { canonical: href(lang, path), languages: { en: href('en', path), bn: href('bn', path), 'x-default': href('en', path) } }
}
