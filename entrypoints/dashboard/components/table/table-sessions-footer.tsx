import { Button } from '@/components/ui/button'
import { TableFooter } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'

function TableSessionsFooter({ selectedItems }: { selectedItems: Set<string> }) {
  const { data } = useAllSessions()

  return (
    <TableFooter className="bg-card flex h-10 w-full items-center justify-between border-t px-3">
      <p className="text-muted-foreground text-sm">
        {selectedItems.size === 0 ? `${data?.length} sessions` : `${selectedItems.size} selected`}
      </p>
      {selectedItems.size > 0 && (
        <div className="animate-in fade-in-0 slide-in-from-right-10 flex gap-1 duration-100">
          <Button
            variant="ghost"
            size="sm"
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
