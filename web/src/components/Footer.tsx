export function Footer({ hotline }: { hotline: string }) {
  return (
    <footer>
      <div className="wordmark" aria-hidden="true">CREDENCE</div>
      <div className="foot-row">
        <div><strong>CREDENCE</strong> Housing Limited</div>
        <div>© {new Date().getFullYear()} Credence Housing Ltd. · Hotline {hotline}</div>
      </div>
    </footer>
  )
}
