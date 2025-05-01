import { sendMessage } from '@/entrypoints/background/messages'
import { useMutation, useQuery } from '@tanstack/react-query'
import { sessionStorage } from '../storage/sessions'
import { useErrorStore } from '../store/error'

function useSession() {
  const { setError } = useErrorStore()

  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => sessionStorage.getValue(),
  })

  const { mutate: start } = useMutation({
    mutationFn: async () => {
      const res = await sendMessage('handleStartSession', undefined)

      if (!res.success) {
        return setError({
          message: res.message,
        })
      }

      return res.message
    },
  })

  const { mutate: stop } = useMutation({
    mutationFn: async () => {
      const res = await sendMessage('handleStopSession', undefined)

      if (!res.success) {
        return setError({
          message: res.message,
        })
      }

      return res.message
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
