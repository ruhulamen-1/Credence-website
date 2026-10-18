import { en, type Dict } from './en'
import { bn } from './bn'

export const locales = ['en', 'bn'] as const
export type Lang = (typeof locales)[number]
export const isLang = (v: string): v is Lang => (locales as readonly string[]).includes(v)
export const getDict = (lang: Lang): Dict => (lang === 'bn' ? bn : en)
/** Build a link that keeps the visitor's language. English has no prefix, Bangla lives under /bn. */
export const href = (lang: Lang, path = '/') => (lang === 'bn' ? `/bn${path === '/' ? '' : path}` || '/bn' : path)
export const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
export const dateLocale = (lang: Lang) => (lang === 'bn' ? 'bn-BD' : 'en-GB')
export type { Dict }

/** Only what the client-side Nav needs (keeps the page payload small). */
export const navT = (t: Dict) => ({ nav: t.nav, switchTo: t.switchTo })
