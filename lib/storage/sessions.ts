import type { Task } from './tasks'

export interface Session {
  id: string
  description: `${number} tasks`
  start: number
  end: number | 'Active'
  duration: number
  efficiency: number
  earnings: number
  tasks: Task[]
}

export const sessionStorage = storage.defineItem<Session>('local:session')
