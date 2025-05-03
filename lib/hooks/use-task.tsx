import { sendMessage } from '@/lib/messages'
import { useMutation, useQuery } from '@tanstack/react-query'
import { taskStorage } from '../storage/tasks'
import { useStatusStore } from '../store/status'

const task = {
  id: '1',
  description: 'test',
  aet: 100,
}

function useTask() {
  const { setStatus } = useStatusStore()

  const { data, isLoading } = useQuery({
    queryKey: ['task'],
    queryFn: async () => taskStorage.getValue(),
  })

  const { mutate: start } = useMutation({
    mutationFn: async () => {
      const res = await sendMessage('handleTaskStart', task)

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
      const res = await sendMessage('handleTaskStop', undefined)

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

export { useTask }
