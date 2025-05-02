export interface Task {
  id: string
  description: string
  aet: number
  start: number
  duration: number
  efficiency: number
  earnings: number
}

export interface TaskStorage {
  active: boolean
  data: Task
}

export const taskStorage = storage.defineItem<TaskStorage>(
  'local:task',
  {
    fallback: {
      active: false,
      data: {
        id: '',
        description: '',
        aet: 0,
        start: 0,
        duration: 0,
        efficiency: 0,
        earnings: 0,
      },
    },
  },
)
