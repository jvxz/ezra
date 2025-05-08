import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTrpc } from '../messages/trpc'
import { taskStorage } from '../storage/tasks'

const trpc = createTrpc()

function useTask() {
  const qc = useQueryClient()
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
    mutationFn: async () => trpc.startTask.mutate({
      aet: 0.2,
      description: 'test',
      id: crypto.randomUUID(),
    }),
  })

  const { mutate: _debugStop } = useMutation({
    mutationFn: async () => trpc.stopTask.mutate({
      action: 'submit',
      rate: 15,
    }),
  })

  return {
    data,
    isLoading,
    _debugStart,
    _debugStop,
  }
}

export { useTask }
