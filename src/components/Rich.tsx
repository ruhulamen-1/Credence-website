import { RichText } from '@payloadcms/richtext-lexical/react'

/** Renders a Payload rich-text field (blog body, job description). */
export function Rich({ data }: { data: unknown }) {
  if (!data) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <div className="rich"><RichText data={data as any} /></div>
}
