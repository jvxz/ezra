import { db } from '@/lib/db'
import { type } from 'arktype'

export const deleteSessionsValidator = type('string').array()

export async function handleDeleteSessions(ids: typeof deleteSessionsValidator.t) {
  return db.sessions.bulkDelete(ids)
}
