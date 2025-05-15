import { Button } from '@/components/ui/button'
import { TableFooter } from '@/components/ui/table'
import { useAllTasks } from '@/lib/hooks/use-all-tasks'
import { useSelectedTasks } from '@/lib/store/selected-tasks'

function TableTasksFooter() {
  const { data } = useAllTasks()
  // const { deleteSessions } = useSessionMutations()
  const { selectedTasks } = useSelectedTasks()

  return (
    <TableFooter className="bg-card flex h-10 w-full items-center justify-between border-t px-3">
      <p className="text-muted-foreground text-sm">
        {selectedTasks.size === 0 ? `${data?.length} ${data?.length === 1 ? 'task' : 'tasks'}` : `${selectedTasks.size} selected`}
      </p>
      {selectedTasks.size > 0 && (
        <div className="animate-in fade-in-0 slide-in-from-right-10 flex gap-1 duration-100">
          <Button
            variant="ghost"
            size="sm"
            // onClick={() => deleteSessions(Array.from(selectedSessions))}
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

export { TableTasksFooter }
