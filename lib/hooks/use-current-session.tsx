import { createTrpc } from '@/lib/messages/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStatusStore } from '../store/status'

const trpc = createTrpc()

function useCurrentSession() {
  const qc = useQueryClient()
  const { setStatus } = useStatusStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: async () => trpc.getCurrentSessionData.query(),
  })

  const { mutate: start, isPending: isStarting } = useMutation({
    mutationFn: async () => trpc.startSession.mutate(),
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
  })

  const { mutate: stop, isPending: isStopping } = useMutation({
    mutationFn: async () => trpc.stopSession.mutate(),
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
    // onMutate: () => {
    //   qc.setQueryData(['session'], () => {
    //     return null
    //   })
    // },
  })

  return {
    data,
    isLoading,
    isStopping,
    isStarting,
    start,
    stop,
  }
}

export { useCurrentSession }
