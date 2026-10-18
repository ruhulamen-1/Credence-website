/* Creates the first admin login from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env (does nothing if that user exists).
   Run:  npm run create-admin     — useful after importing demo-data/credence-demo-data.sql (which has no users). */
import config from '@payload-config'
import { getPayload } from 'payload'

const email = process.env.SEED_ADMIN_EMAIL || 'admin@credence.local'
const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'
const payload = await getPayload({ config })
const has = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (has.docs[0]) console.log(`Admin ${email} already exists.`)
else {
  await payload.create({ collection: 'users', data: { email, password, name: 'Admin', role: 'admin' } as never })
  console.log(`✔ Admin created: ${email}`)
}
process.exit(0)
