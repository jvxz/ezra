export interface Session {
  id: string
  description: `${number} tasks`
  start: number
  end: number | 'Active'
}
