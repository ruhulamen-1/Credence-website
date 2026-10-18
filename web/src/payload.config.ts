import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const url = process.env.DATABASE_URL || 'file:./credence.db'
const secret = process.env.PAYLOAD_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret-change-me')
if (!secret) throw new Error('PAYLOAD_SECRET is not set. Generate one with: openssl rand -hex 32')

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) }, meta: { titleSuffix: ' — Credence Admin' } },
  collections: [Projects, Leads, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Local dev: SQLite file. Production: set DATABASE_URL=postgres://… (Neon / Supabase / any Postgres).
  db: url.startsWith('postgres')
    ? postgresAdapter({ pool: { connectionString: url } })
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
