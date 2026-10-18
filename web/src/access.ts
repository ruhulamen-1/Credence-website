import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'marketing' | 'sales'
type U = { role?: Role } | null | undefined

export const isAdmin: Access = ({ req }) => (req.user as U)?.role === 'admin'
export const isStaff: Access = ({ req }) => Boolean(req.user)
/** Admin or marketing: can change website content. */
export const canEditContent: Access = ({ req }) => {
  const r = (req.user as U)?.role
  return r === 'admin' || r === 'marketing'
}
/** Admin or sales: can see and work leads. */
export const canWorkLeads: Access = ({ req }) => {
  const r = (req.user as U)?.role
  return r === 'admin' || r === 'sales'
}
export const adminOnlyField: FieldAccess = ({ req }) => (req.user as U)?.role === 'admin'
export const anyone: Access = () => true

/** Public visitors only see published documents; logged-in staff see drafts too. */
export const readPublished: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })

/** Admin, sales and marketing can read leads (marketing: view only). */
export const canReadLeads: Access = ({ req }) => {
  const r = (req.user as U)?.role
  return r === 'admin' || r === 'sales' || r === 'marketing'
}
