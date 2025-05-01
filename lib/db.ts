import type { EntityTable } from 'dexie'
import type { Session } from './storage/sessions'
import Dexie from 'dexie'

export const db = new Dexie('ezra') as Dexie & {
  sessions: EntityTable<
    Session,
    'id'
  >
}

db.version(1).stores({
  sessions: '++id',
})
