import type { deleteSessionsValidator } from '../messages/handle-delete-sessions'
import type { Session } from '../storage/sessions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTrpc } from '../messages/trpc'
import { useSelectedSessions } from '../store/selected-sessions'
import { useStatusStore } from '../store/status'

const trpc = createTrpc()

function useSessionMutations() {
  const { setStatus } = useStatusStore()
  const qc = useQueryClient()
  const { resetItems } = useSelectedSessions()

  const { mutate: deleteSessions, isPending: isDeletingSessions } = useMutation({
    mutationFn: async (ids: typeof deleteSessionsValidator.t) => trpc.deleteSessions.mutate(ids),
    onMutate: async (ids: typeof deleteSessionsValidator.t) => {
      setStatus({
        message: 'Deleted sessions',
        timestamp: Date.now(),
        type: 'info',
      })

      resetItems()

      const sessions = qc.getQueryData<Session[]>(['all-sessions'])
      const filteredSessions = sessions?.filter(session => !ids.includes(session.id))
      return qc.setQueryData(['all-sessions'], filteredSessions)
    },
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ['all-sessions'],
      })
    },
  })

  return {
    deleteSessions,
    isDeletingSessions,
  }
}

export { useSessionMutations }
