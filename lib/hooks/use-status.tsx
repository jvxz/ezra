import { useQuery, useQueryClient } from '@tanstack/react-query'
import { statusStorage } from '../storage/status'

function useStatus() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['status'],
    queryFn: async () => statusStorage.getValue(),
  })

  useEffect(() => {
    const unsub = statusStorage.watch(() => {
      void qc.invalidateQueries({
        queryKey: ['status'],
      })
    })

    return () => unsub()
  })

  return {
    data,
    isLoading,
  }
}

export { useStatus }
