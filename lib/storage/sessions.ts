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

export const sessionStorage = storage.defineItem<SessionStorage>(
  'local:session',
  {
    fallback: {
      active: false,
      data: {
        id: '',
        description: 'No tasks',
        start: 0,
        end: 0,
        duration: 0,
        efficiency: 0,
        earnings: 0,
        tasks: [],
      },
    },
  },
)
