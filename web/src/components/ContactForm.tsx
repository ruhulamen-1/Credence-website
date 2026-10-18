'use client'
import { useState, type FormEvent } from 'react'

type Errs = Record<string, string>
export function ContactForm({ project, button = 'Request a call back', thanks = 'Thank you — our team will contact you shortly.', messageRequired = true }: { project?: string; button?: string; thanks?: string; messageRequired?: boolean }) {
  const [errs, setErrs] = useState<Errs>({})
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    const next: Errs = {}
    if (!d.name?.trim()) next.name = 'Please fill this in.'
    if (!/^[+\d][\d\s()-]{5,}$/.test(d.phone?.trim() || '')) next.phone = 'Enter a valid phone number.'
    if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) next.email = 'Enter a valid email address.'
    if (messageRequired && !d.msg?.trim()) next.msg = 'Please fill this in.'
    setErrs(next)
    if (Object.keys(next).length) return
    setState('sending')
    try {
      const attribution = (window as unknown as { getAttribution?: () => object }).getAttribution?.() || {}
      const r = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...d, project, page: location.pathname, source: attribution }),
      })
      if (!r.ok) throw new Error(String(r.status))
      form.reset()
      setState('ok')
      ;(window as unknown as { track?: (n: string, p?: object) => void }).track?.('generate_lead', { page: location.pathname, project })
    } catch {
      setState('fail')
    }
  }

  const L = ({ name, label, children }: { name: string; label: string; children: React.ReactNode }) => (
    <label className={errs[name] ? 'bad' : ''}>{label}{children}<em>{errs[name]}</em></label>
  )
  return (
    <form className="form reveal" id="contactForm" noValidate onSubmit={submit}>
      <L name="name" label="Full name"><input name="name" autoComplete="name" /></L>
      <L name="phone" label="Contact number"><input name="phone" type="tel" autoComplete="tel" inputMode="tel" /></L>
      <L name="email" label="Email (optional)"><input name="email" type="email" autoComplete="email" /></L>
      <L name="msg" label={messageRequired ? 'Message' : 'Message (optional)'}><textarea name="msg" rows={4} /></L>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }} />
      <button className="btn dark" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : button}</button>
      {state === 'ok' && <p className="ok" role="status">{thanks}</p>}
      {state === 'fail' && <p className="ok err" role="status">We couldn’t send your message. Please call 16769 or try again.</p>}
    </form>
  )
}
