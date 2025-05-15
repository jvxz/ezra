import type { Task } from '../storage/tasks'
import { useAllSessions } from './use-all-sessions'

function useAllTasks() {
  const { data: sessions } = useAllSessions()

  const tasks: Task[] | undefined = useMemo(() => sessions?.map(session => session.tasks).flat(), [sessions])

  return {
    data: tasks,
  }
}

export { useAllTasks }
