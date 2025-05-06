import { TableFooter } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'

function TableSessionsFooter({ selectedItems }: { selectedItems: Set<string> }) {
  const { data } = useAllSessions()

  return (
    <TableFooter className="bg-card flex h-10 w-full items-center justify-between border-t px-3">
      <p className="text-muted-foreground text-sm">
        {selectedItems.size === 0 ? `${data?.length} sessions` : `${selectedItems.size} selected`}
      </p>
    </TableFooter>
  )
}

export { TableSessionsFooter }
