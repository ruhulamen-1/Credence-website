/* Shows which database `.env` points to, connects, creates the tables if they are missing, and reports.
   Run:  npm run db:check      (use it first when "no tables appear in phpMyAdmin") */
import config from '@payload-config'
import { getPayload } from 'payload'

const url = process.env.DATABASE_URL || 'file:./credence.db'
const kind = url.startsWith('mysql') ? 'MySQL / MariaDB' : url.startsWith('postgres') ? 'PostgreSQL' : 'SQLite file'
const masked = url.replace(/:\/\/([^:/@]+):([^@]*)@/, '://$1:****@')

console.log(`\nDATABASE_URL  = ${masked}`)
console.log(`Database type = ${kind}`)
if (kind === 'SQLite file') console.log('\n⚠ This is the SQLite file, NOT MySQL. phpMyAdmin will stay empty.\n  For MySQL put this in .env:  DATABASE_URL=mysql://root:@127.0.0.1:3306/credence   (then restart)')

try {
  console.log('\nConnecting and creating tables if needed…')
  const payload = await getPayload({ config })
  const slugs = Object.keys(payload.collections)
  const counts: string[] = []
  for (const s of slugs.filter((x) => !x.startsWith('payload-'))) {
    const r = await payload.count({ collection: s as never, overrideAccess: true })
    counts.push(`  ${s.padEnd(14)} ${r.totalDocs} rows`)
  }
  console.log('\n✔ Connected. Tables exist:\n' + counts.join('\n'))
  if (kind.startsWith('MySQL')) {
    // The MySQL adapter needs MySQL 8.0.19+ or MariaDB 10.6+ (older servers, e.g. XAMPP's MariaDB 10.4, lack JSON_ARRAYAGG).
    try {
      const { sql } = await import('payload-db-mysql')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = JSON.stringify(await (payload.db as any).drizzle.execute(sql`select version() as v`))
      const v = (raw.match(/(\d+)\.(\d+)\.(\d+)[^"]*/) || [])[0] || 'unknown'
      const [maj, min, pat] = v.split(/[.-]/).map((x) => parseInt(x, 10))
      const maria = /maria/i.test(raw)
      const ok = maria ? maj > 10 || (maj === 10 && min >= 6) : maj > 8 || (maj === 8 && (min > 0 || pat >= 19))
      console.log(`\nServer version = ${v}${maria ? ' (MariaDB)' : ' (MySQL)'}  →  ${ok ? 'OK' : '✖ TOO OLD'}`)
      if (!ok) console.log(maria
        ? '  This site needs MariaDB 10.6+ (XAMPP usually ships 10.4). Install a newer MariaDB/MySQL — see MYSQL_SETUP.md ("Version").'
        : '  This site needs MySQL 8.0.19+. Install a newer MySQL — see MYSQL_SETUP.md ("Version").')
    } catch { /* version check is optional */ }
  }
  console.log('\nNext: npm run seed   (adds the 7 projects + the first admin), then npm run dev')
  process.exit(0)
} catch (e) {
  const x = e as { message?: string; cause?: { code?: string; sqlMessage?: string; message?: string } }
  console.error('\n✖ Could not use the database:')
  console.error('  ' + (x.cause?.sqlMessage || x.cause?.message || x.message))
  if (x.cause?.code) console.error('  code: ' + x.cause.code)
  console.error('\nCommon fixes:\n  • ECONNREFUSED         → MySQL is not running (start it in XAMPP) or the port is wrong\n  • ER_ACCESS_DENIED     → wrong user/password in DATABASE_URL\n  • ER_BAD_DB_ERROR      → the database "credence" is not created yet (phpMyAdmin → New)\n  • Unknown/other        → copy this whole message and send it')
  process.exit(1)
}
