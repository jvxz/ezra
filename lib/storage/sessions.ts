import type { Task } from './tasks'

export interface Session {
  id: string
  description: `${number} tasks` | 'No tasks'
  start: number
  end: number
  duration: number
  efficiency: number
  earnings: number
  tasks: Task[]
}

export interface SessionStorage {
  active: boolean
  data: Session
}

export const sessionStorage = storage.defineItem<Session>('local:session')
