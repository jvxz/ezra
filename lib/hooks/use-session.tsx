import { sendMessage } from '@/lib/messages'
import { useMutation, useQuery } from '@tanstack/react-query'
import { sessionStorage } from '../storage/sessions'
import { useStatusStore } from '../store/status'

function useSession() {
  const { setStatus } = useStatusStore()

  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => sessionStorage.getValue(),
  })

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
