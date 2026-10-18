import type { TextFieldSingleValidation } from 'payload'

/** Required in English only, so Bangla can be filled in gradually (missing Bangla falls back to English on the site). */
export const requiredInEnglish: TextFieldSingleValidation = (value, { req }) => {
  const locale = (req as { locale?: string }).locale
  if (locale && locale !== 'en') return true
  return value ? true : 'This field is required (English)'
}
