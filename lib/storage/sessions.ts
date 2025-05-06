import type { Task } from './tasks'

/**
 * id - id

 * description - "X tasks"

 * start - start timestamp from Date.now()

 * end - end timestamp from Date.now()

 * duration - duration in seconds

 * aet - total aet in minutes, accumulated from all tasks

 * efficiency - efficiency percentage, accumulated from all tasks

 * earnings - earnings in dollars

 * tasks - submitted tasks during the session
 */
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
