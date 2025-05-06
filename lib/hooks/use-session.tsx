import { createTrpc } from '@/lib/messages/trpc'
// import { sendMessage } from '@/lib/messages/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionStorage } from '../storage/sessions'
import { taskStorage } from '../storage/tasks'
import { useStatusStore } from '../store/status'

const trpc = createTrpc()

function useSession() {
  const qc = useQueryClient()
  const { setStatus } = useStatusStore()
  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => trpc.getCurrentSessionData.query(),
  })

  useEffect(() => {
    const unsub = sessionStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['session'],
      })
    })

    const unsubTask = taskStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['session'],
      })
    })

    return () => {
      unsub()
      unsubTask()
    }
  }, [])

  const { mutate: start } = useMutation({
    mutationFn: async () => trpc.startSession.query(),
    onError: (error) => {
      setStatus({
        message: error.message,
        timestamp: Date.now(),
        type: 'error',
      })
    },
    onSuccess: () => {
      setStatus({
        message: 'Session started',
        timestamp: Date.now(),
        type: 'success',
      })
    },
  })

  const { mutate: stop } = useMutation({
    mutationFn: async () => trpc.stopSession.query(),
    onError: (error) => {
      setStatus({
        message: error.message,
        timestamp: Date.now(),
        type: 'error',
      })
    },
    onSuccess: () => {
      setStatus({
        message: 'Session stopped',
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
