import { revalidatePath } from 'next/cache'

/** Refresh the public pages after content is saved in /admin. Silently skipped outside a Next request (e.g. seed script). */
export function refreshSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    /* not in a Next.js request context */
  }
}
