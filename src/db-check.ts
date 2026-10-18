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
