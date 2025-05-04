import type { MsgResponse } from '@/lib/messages'
import type { Session } from '../storage/sessions'
import { sendMessage } from '@/lib/messages'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionStorage } from '../storage/sessions'
import { taskStorage } from '../storage/tasks'
import { useStatusStore } from '../store/status'

function useSession() {
  const qc = useQueryClient()
  const { setStatus } = useStatusStore()
  const allSessions = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await sendMessage('getLiveData', 'sessions') as MsgResponse<Session[]>

      if (!res.success) {
        return setStatus({
          message: res.message,
          timestamp: Date.now(),
          type: 'error',
        })
      }

      return res.data
    },
  })

  const currentSession = useQuery({
    queryKey: ['current-session'],
    queryFn: async () => {
      const session = await sessionStorage.getValue()
      if (!session) return null

      const task = await taskStorage.getValue()
      if (task) {
        const duration = (session.tasks.reduce((acc, curr) => acc + curr.duration, 0) + task.duration)

        return {
          duration,
        }
      }

      return {
        duration: session.duration,
      }
    },
  })

  useEffect(() => {
    const unsub = sessionStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['sessions'],
      })
      void qc.invalidateQueries({
        queryKey: ['current-session'],
      })
    })

    const unsubTask = taskStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['current-session'],
      })
    })

    return () => {
      unsub()
      unsubTask()
    }
  }, [])

  const { mutate: start } = useMutation({
    mutationFn: async () => {
      const res = await sendMessage('handleStartSession', undefined)

      if (!res.success) {
        return setStatus({
          message: res.message,
          timestamp: Date.now(),
          type: 'error',
        })
      }

      return setStatus({
        message: res.message,
        timestamp: Date.now(),
        type: 'success',
      })
    },
  })

  const { mutate: stop } = useMutation({
    mutationFn: async () => {
      const res = await sendMessage('handleStopSession', undefined)

      if (!res.success) {
        return setStatus({
          message: res.message,
          timestamp: Date.now(),
          type: 'error',
        })
      }

      return setStatus({
        message: res.message,
        timestamp: Date.now(),
        type: 'success',
      })
    },
  })

  return {
    allSessions,
    currentSession,
    start,
    stop,
  }
}

export { useSession }
