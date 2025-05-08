import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createTrpc } from '../messages/trpc'
import { sessionStorage } from '../storage/sessions'
import { taskStorage } from '../storage/tasks'

const trpc = createTrpc()

function useAllSessions() {
  const qc = useQueryClient()
  const { data: sessions } = useQuery({
    queryKey: ['all-sessions'],
    queryFn: async () => trpc.getAllSessionData.query(),
  })

  useEffect(() => {
    const unsub = sessionStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['all-sessions'],
      })
    })

    const unsubTask = taskStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['all-sessions'],
      })
    })

    return () => {
      unsub()
      unsubTask()
    }
  })

  return {
    data: sessions,
  }
}

export { useAllSessions }
