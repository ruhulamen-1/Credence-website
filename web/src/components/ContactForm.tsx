'use client'
import { useState, type FormEvent } from 'react'
import type { Dict } from '../i18n'

type Errs = Record<string, string>
export type Extra = { name: string; label: string; textarea?: boolean }
type Props = {
  t: Dict['form']
  button?: string
  thanks?: string
  messageRequired?: boolean
  kind?: 'enquiry' | 'landowner' | 'buyer' | 'career' | 'campaign'
  project?: string
  job?: string
  campaign?: string
  variant?: string
  extra?: Extra[]
  idPrefix?: string
}

export function ContactForm({ t, button, thanks, messageRequired = true, kind = 'enquiry', project, job, campaign, variant, extra = [] }: Props) {
  const [errs, setErrs] = useState<Errs>({})
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    const next: Errs = {}
    if (!d.name?.trim()) next.name = t.errFill
    if (!/^[+\d০-৯][\d০-৯\s()-]{5,}$/.test(d.phone?.trim() || '')) next.phone = t.errPhone
    if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) next.email = t.errEmail
    if (messageRequired && !d.msg?.trim()) next.msg = t.errFill
    setErrs(next)
    if (Object.keys(next).length) return
    setState('sending')
    try {
      const attribution = (window as unknown as { getAttribution?: () => object }).getAttribution?.() || {}
      const details = extra.map((x) => (d[x.name]?.trim() ? `${x.label}: ${d[x.name].trim()}` : '')).filter(Boolean).join('\n')
      // Normal site: the built-in API route. Shared-hosting export: set NEXT_PUBLIC_ENQUIRY_URL=/enquiry.php (PHP + MySQL).
      const r = await fetch(process.env.NEXT_PUBLIC_ENQUIRY_URL || '/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: d.name, phone: d.phone, email: d.email, msg: d.msg, website: d.website, kind, project, job, campaign, variant, details, page: location.pathname, source: attribution }),
      })
      if (!r.ok) throw new Error(String(r.status))
      form.reset()
      setState('ok')
      ;(window as unknown as { track?: (n: string, p?: object) => void }).track?.('generate_lead', { page: location.pathname, kind, project, campaign, variant })
    } catch {
      setState('fail')
    }
  }

  const L = ({ name, label, children }: { name: string; label: string; children: React.ReactNode }) => (
    <label className={errs[name] ? 'bad' : ''}>{label}{children}<em>{errs[name]}</em></label>
  )
  return (
    <form className="form reveal" id="contactForm" noValidate onSubmit={submit}>
      <L name="name" label={t.name}><input name="name" autoComplete="name" /></L>
      <L name="phone" label={t.phone}><input name="phone" type="tel" autoComplete="tel" inputMode="tel" /></L>
      <L name="email" label={t.email}><input name="email" type="email" autoComplete="email" /></L>
      {extra.map((x) => <L key={x.name} name={x.name} label={x.label}>{x.textarea ? <textarea name={x.name} rows={3} /> : <input name={x.name} />}</L>)}
      <L name="msg" label={messageRequired ? t.message : t.messageOpt}><textarea name="msg" rows={4} /></L>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }} />
      <button className="btn dark" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t.sending : button || t.send}</button>
      {state === 'ok' && <p className="ok" role="status">{thanks || t.thanks}</p>}
      {state === 'fail' && <p className="ok err" role="status">{t.fail}</p>}
    </form>
  )
}
