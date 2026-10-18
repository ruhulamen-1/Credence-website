import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mysqlAdapter } from 'payload-db-mysql'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Leads } from './collections/Leads'
import { Posts } from './collections/Posts'
import { Team } from './collections/Team'
import { Careers } from './collections/Careers'
import { Redirects } from './collections/Redirects'
import { LandingPages } from './collections/LandingPages'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const url = process.env.DATABASE_URL || 'file:./credence.db'
const secret = process.env.PAYLOAD_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret-change-me')
if (!secret) throw new Error('PAYLOAD_SECRET is not set. Generate one with: openssl rand -hex 32')

export default buildConfig({
  admin: { components: { beforeDashboard: ['/components/admin/LeadStats#LeadStats'] }, user: Users.slug, importMap: { baseDir: path.resolve(dirname) }, meta: { titleSuffix: ' — Credence Admin' } },
  collections: [Projects, Posts, Team, Careers, LandingPages, Leads, Redirects, Media, Users],
  localization: { locales: [{ label: 'English', code: 'en' }, { label: 'বাংলা', code: 'bn' }], defaultLocale: 'en', fallback: true },
  // Scheduled publishing needs the job runner. Self-hosted: runs every minute. Vercel: a cron calls /api/payload-jobs/run (see vercel.json).
  jobs: {
    access: { run: ({ req }) => Boolean(req.user) || req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}` },
    autoRun: process.env.VERCEL ? [] : [{ cron: '* * * * *', limit: 10, queue: 'default' }],
  },
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // The database is chosen by DATABASE_URL in .env:
  //   mysql://user:pass@127.0.0.1:3306/credence      → MySQL / MariaDB (phpMyAdmin)   [community adapter payload-db-mysql]
  //   postgres://user:pass@host:5432/credence        → PostgreSQL (official adapter)
  //   file:./credence.db   (default)                 → SQLite file for quick local work
  // Each database keeps its own migration folder (src/migrations/<name>).
  db: url.startsWith('mysql')
    ? mysqlAdapter({ pool: { uri: url }, migrationDir: path.resolve(dirname, 'migrations/mysql') })
    : url.startsWith('postgres')
      ? postgresAdapter({ pool: { connectionString: url }, migrationDir: path.resolve(dirname, 'migrations/postgres') })
      : sqliteAdapter({ client: { url } }),
  sharp,
  plugins: [
    // Production file storage (Vercel has a read-only disk): Cloudflare R2 / AWS S3 / any S3-compatible bucket.
    ...(process.env.S3_BUCKET
      ? [s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          config: {
            region: process.env.S3_REGION || 'auto',
            endpoint: process.env.S3_ENDPOINT, // e.g. https://<account>.r2.cloudflarestorage.com
            credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' },
            forcePathStyle: true,
          },
        })]
      : []),
  ],
})
