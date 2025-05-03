export interface Task {
  id: string
  description: string
  aet: number
  start: number
  duration: number
  efficiency: number
  earnings: number
}

export const taskStorage = storage.defineItem<Task>('local:task')

export const taskDraft: Task = {
  id: '',
  description: '',
  aet: 0,
  start: 0,
  duration: 0,
  efficiency: 0,
  earnings: 0,
}
