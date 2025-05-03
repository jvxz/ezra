import type { Task } from './tasks'

export interface Status {
  id: string
  description: `${number} tasks` | 'No tasks'
  start: number
  end: number
  duration: number
  efficiency: number
  earnings: number
  tasks: Task[]
}

export interface StatusStorage {
  session: boolean
  task: boolean
}

export const statusStorage = storage.defineItem<StatusStorage>(
  'local:status',
  {
    fallback: {
      session: false,
      task: false,
    },
  },
)
