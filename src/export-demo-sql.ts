/* Writes demo-data/credence-demo-data.sql — a MySQL/MariaDB dump of ALL site content (the 7 projects, site settings,
   demo posts/team/jobs/campaign/redirects and 30 demo leads) that can be imported in phpMyAdmin.
   It is generated from the local SQLite database, so run these first:
        (.env: DATABASE_URL=file:./credence.db)   npm run seed   &&   npm run seed:demo   &&   npm run export:demo-sql
   Users/passwords are NOT included — create the admin afterwards with  npm run create-admin. */
import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'

const url = process.env.DATABASE_URL || 'file:./credence.db'
if (!url.startsWith('file:')) { console.error('Run this against the SQLite file (DATABASE_URL=file:./credence.db).'); process.exit(1) }
const db = createClient({ url })

// Content tables only: no users/sessions, no payload_* bookkeeping, no draft-version (_*) tables.
const isContent = (n: string) => !n.startsWith('sqlite_') && !n.startsWith('payload_') && !n.startsWith('users') && !n.startsWith('_')
const tables = (await db.execute("select name from sqlite_master where type='table' order by name")).rows.map((r) => String(r.name)).filter(isContent)

const ISO = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(?:\.(\d{1,3})\d*)?Z$/
const q = (v: unknown): string => {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number' || typeof v === 'bigint') return String(v)
  if (typeof v === 'boolean') return v ? '1' : '0'
  const s = String(v)
  const m = s.match(ISO)
  if (m) return `'${m[1]} ${m[2]}.${(m[3] || '0').padEnd(3, '0')}'` // DATETIME(3), UTC
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\0/g, '')}'`
}
const id = (n: string) => '`' + n.replace(/`/g, '``') + '`'

// parents before children (helps readers; FK checks are switched off anyway)
const order = [...tables].sort((a, b) => (a.includes('_') ? 1 : 0) - (b.includes('_') ? 1 : 0) || a.localeCompare(b))
const out: string[] = [
  '-- Credence website — demo/sample content for MySQL / MariaDB (import in phpMyAdmin → Import).',
  `-- Generated ${new Date().toISOString().slice(0, 10)} from the project database. Contains NO users — run  npm run create-admin  afterwards.`,
  '-- IMPORT INTO AN EXISTING DATABASE WHOSE TABLES WERE ALREADY CREATED BY THE SITE (run  npm run db:check  once first).',
  '-- WARNING: each content table is emptied (DELETE) before its rows are inserted.',
  '', 'SET NAMES utf8mb4;', "SET time_zone = '+00:00';", 'SET FOREIGN_KEY_CHECKS = 0;', "SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';", '',
]
let rowsTotal = 0
for (const t of order) {
  const cols = (await db.execute(`pragma table_info('${t}')`)).rows.map((r) => String(r.name))
  const rows = (await db.execute(`select * from ${id(t)}`)).rows
  out.push(`-- ${t} (${rows.length} rows)`, `DELETE FROM ${id(t)};`)
  for (let i = 0; i < rows.length; i += 25) {
    const chunk = rows.slice(i, i + 25)
    out.push(`INSERT INTO ${id(t)} (${cols.map(id).join(', ')}) VALUES`)
    out.push(chunk.map((r) => '(' + cols.map((c) => q((r as Record<string, unknown>)[c])).join(', ') + ')').join(',\n') + ';')
  }
  out.push('')
  rowsTotal += rows.length
}
out.push('SET SQL_MODE = @OLD_SQL_MODE;', 'SET FOREIGN_KEY_CHECKS = 1;', '')
fs.mkdirSync('demo-data', { recursive: true })
const file = path.join('demo-data', 'credence-demo-data.sql')
fs.writeFileSync(file, out.join('\n'), 'utf8')
console.log(`✔ ${file}: ${tables.length} tables, ${rowsTotal} rows, ${(fs.statSync(file).size / 1024).toFixed(0)} KB`)
process.exit(0)
