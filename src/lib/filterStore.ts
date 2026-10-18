'use client'
import { useSyncExternalStore } from 'react'

export type Filters = { type: string; status: string; loc: string; name: string }
const empty: Filters = { type: '', status: '', loc: '', name: '' }
let state: Filters = empty
const subs = new Set<() => void>()

export const setFilters = (patch: Partial<Filters>) => {
  state = { ...state, ...patch }
  subs.forEach((f) => f())
}
export const resetFilters = () => setFilters(empty)
export const useFilters = () =>
  useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb) } }, () => state, () => empty)
