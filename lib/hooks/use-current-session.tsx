import { createTrpc } from '@/lib/messages/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionStorage } from '../storage/sessions'
import { taskStorage } from '../storage/tasks'
import { useStatusStore } from '../store/status'

const trpc = createTrpc()

function useCurrentSession() {
  const qc = useQueryClient()
  const { setStatus } = useStatusStore()
  const { data, isLoading, refetch } = useQuery({
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
  })

  const { mutate: start } = useMutation({
    mutationFn: async () => trpc.startSession.query(),
    onError: (error) => {
      qc.setQueryData(['session'], () => {
        return null
      })

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
    onMutate: () => {
      qc.setQueryData(['session'], () => {
        return {
          earnings: 0,
          taskCount: 0,
          duration: 0,
          efficiency: 0,
          isActive: true,
        }
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

      void refetch()
    },
    onSuccess: () => {
      setStatus({
        message: 'Session stopped',
        timestamp: Date.now(),
        type: 'success',
      })
    },
    onMutate: () => {
      qc.setQueryData(['session'], () => {
        return null
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

export { useCurrentSession }
