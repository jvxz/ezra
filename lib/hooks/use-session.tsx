import type { MsgResponse } from '@/lib/messages'
import type { Session } from '../storage/sessions'
import { sendMessage } from '@/lib/messages'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionStorage } from '../storage/sessions'
import { useStatusStore } from '../store/status'

function useSession() {
  const qc = useQueryClient()
  const { setStatus } = useStatusStore()
  const { data, isLoading } = useQuery({
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

  useEffect(() => {
    sessionStorage.watch(() => void qc.invalidateQueries({
      queryKey: ['sessions'],
    }))
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
    data,
    isLoading,
    start,
    stop,
  }
}

export { useSession }
