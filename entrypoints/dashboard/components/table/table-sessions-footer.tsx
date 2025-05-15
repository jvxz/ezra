import { Button } from '@/components/ui/button'
import { TableFooter } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'
import { useSessionMutations } from '@/lib/hooks/use-session-mutations'
import { useSelectedSessions } from '@/lib/store/selected-sessions'

function TableSessionsFooter() {
  const { data } = useAllSessions()
  const { deleteSessions } = useSessionMutations()
  const { selectedSessions } = useSelectedSessions()

  return (
    <TableFooter className="bg-card flex h-10 w-full items-center justify-between border-t px-3">
      <p className="text-muted-foreground text-sm">
        {selectedSessions.size === 0 ? `${data?.length} ${data?.length === 1 ? 'session' : 'sessions'}` : `${selectedSessions.size} selected`}
      </p>
      {selectedSessions.size > 0 && (
        <div className="animate-in fade-in-0 slide-in-from-right-10 flex gap-1 duration-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteSessions(Array.from(selectedSessions))}
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
          >
            Edit
          </Button>
        </div>
      )}
    </TableFooter>
  )
}

export { TableSessionsFooter }
