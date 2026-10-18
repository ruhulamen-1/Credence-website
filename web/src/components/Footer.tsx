import type { Dict } from '../i18n'

export function Footer({ hotline, t }: { hotline: string; t: Dict }) {
  return (
    <footer>
      <div className="wordmark" aria-hidden="true">CREDENCE</div>
      <div className="foot-row">
        <div><strong>CREDENCE</strong> Housing Limited</div>
        <div>© {new Date().getFullYear()} {t.footer.rights} · {t.nav.hotline} {hotline}</div>
      </div>
    </footer>
  )
}
