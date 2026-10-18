import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

// Very small in-memory limiter (per server instance): 5 enquiries / 10 min / IP. Use Turnstile or an edge limiter for stronger protection.
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now(), recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now); hits.set(ip, recent)
  return recent.length > 5
}
const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }) }
  if (str(body.website)) return Response.json({ ok: true }) // honeypot: pretend success to bots

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (limited(ip)) return Response.json({ error: 'Too many requests. Please call 16769.' }, { status: 429 })

  const name = str(body.name, 120), phone = str(body.phone, 40), email = str(body.email, 160), message = str(body.msg, 2000)
  if (!name || !/^[+\d][\d\s()-]{5,}$/.test(phone)) return Response.json({ error: 'Name and a valid phone number are required.' }, { status: 422 })
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: 'Invalid email.' }, { status: 422 })

  const kind = (['enquiry', 'landowner', 'buyer', 'career', 'campaign'] as const).find((k) => k === str(body.kind)) || 'enquiry'
  const payload = await getPayload({ config })
  const src = (body.source && typeof body.source === 'object' ? body.source : {}) as Record<string, unknown>
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ttclid', 'referrer', 'landing']
  const source = Object.fromEntries(keys.map((k) => [k, str(src[k], 300)]).filter(([, v]) => v))

  let project: number | string | undefined
  let job: number | string | undefined
  const slug = str(body.project, 120)
  if (slug) project = (await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]?.id
  const jobSlug = str(body.job, 120)
  if (jobSlug) job = (await payload.find({ collection: 'careers', where: { slug: { equals: jobSlug } }, limit: 1, depth: 0 })).docs[0]?.id
  const dup = (await payload.find({ collection: 'leads', where: { phone: { equals: phone } }, limit: 1, depth: 0, sort: 'createdAt' })).docs[0]

  const lead = await payload.create({
    collection: 'leads',
    overrideAccess: true,
    data: { name, phone, email: email || undefined, message, kind, job, campaign: str(body.campaign, 160), variant: str(body.variant, 4), details: str(body.details, 2000), page: str(body.page, 200), project, source, duplicateOf: dup?.id } as never,
  })

  // Optional e-mail alert: set RESEND_API_KEY, LEADS_FROM and LEADS_TO in the environment.
  const { RESEND_API_KEY, LEADS_FROM, LEADS_TO } = process.env
  if (RESEND_API_KEY && LEADS_FROM && LEADS_TO) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: LEADS_FROM, to: LEADS_TO.split(','), subject: `New ${kind} lead: ${name} (${phone})`, text: `${message}\n\nPage: ${body.page}\nSource: ${JSON.stringify(source)}` }),
    }).catch(() => {})
  }
  return Response.json({ ok: true, id: lead.id })
}
