import { useMutation, useQuery } from '@tanstack/react-query'
import { createTrpc } from '../messages/trpc'

const trpc = createTrpc()

function useTask() {
  const { data, isLoading } = useQuery({
    queryKey: ['task'],
    queryFn: async () => trpc.getCurrentSessionData.query(),
  })

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
