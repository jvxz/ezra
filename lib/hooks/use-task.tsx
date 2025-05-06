import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTrpc } from '../messages/trpc'
import { taskStorage } from '../storage/tasks'
import { useStatusStore } from '../store/status'

const trpc = createTrpc()

function useTask() {
  const qc = useQueryClient()
  const { setStatus } = useStatusStore()

  const { data, isLoading } = useQuery({
    queryKey: ['task'],
    queryFn: async () => taskStorage.getValue(),
  })

  useEffect(() => {
    const end = taskStorage.watch(() => void qc.invalidateQueries({
      queryKey: ['task'],
    }))

    return () => end()
  }, [])

  const { mutate: _debugStart } = useMutation({
    mutationFn: async () => {
      const res = await trpc.startTask.mutate({
        aet: 0.2,
        description: 'test',
        id: crypto.randomUUID(),
      })

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

  const { mutate: _debugStop } = useMutation({
    mutationFn: async () => {
      // TODO: get rate from user
      const res = await trpc.stopTask.mutate({
        action: 'submit',
        rate: 15,
      })

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
    _debugStart,
    _debugStop,
  }
}

export { useTask }
