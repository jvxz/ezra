import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'
import { useDragSelect } from '@/lib/hooks/use-drag-select'
import { useSessionMutations } from '@/lib/hooks/use-session-mutations'
import { useSelectedSessions } from '@/lib/store/selected-sessions'
import { cn, formatDuration, formatEfficiency, formatTimestamp, getEfficiencyColor } from '@/lib/utils'
import { Suspense, useMemo } from 'react'
import { TableSessionsFooter } from './table-sessions-footer'

function TableSessions() {
  const { data } = useAllSessions()
  const { setSessions, selectedSessions } = useSelectedSessions()
  const sortedItems = useMemo(() => {
    return data?.sort((a, b) => {
      return b.start - a.start
    })
  }, [data])

  useDragSelect(setSessions)

  return (
    <div className="grow overflow-auto rounded border select-none">
      <div className="[&>div]:h-[800px]">
        <Table className="font-mono text-xs">
          <TableHeader className="border-border sticky top-0 border-b backdrop-blur-sm">
            <TableRow>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="w-48">Description</TableHead>
              <TableHead className="w-32">Start</TableHead>
              <TableHead className="w-32">End</TableHead>
              <TableHead className="w-42">Duration</TableHead>
              <TableHead className="w-32">Efficiency</TableHead>
              <TableHead className="w-auto">Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense>
            <TableBody>
              {sortedItems?.map(item => (
                <TableRow
                  key={item.id}
                  data-id={item.id.toString()}
                  data-state={selectedSessions.has(item.id.toString()) ? 'selected' : ''}
                  data-active={item.end === 'Active' ? 'true' : 'false'}
                  className="group"
                >
                  <SessionTableCell
                    value={formatTimestamp(item.start, 'date')}
                  />
                  <SessionTableCell value={item.description} />
                  <SessionTableCell value={formatTimestamp(item.start, 'time')} />
                  <SessionTableCell value={item.end === 'Active' ? 'Active' : formatTimestamp(item.end, 'time')} />
                  <SessionTableCell value={formatDuration(item.duration, 'secs')} />
                  <SessionTableCell
                    className={getEfficiencyColor(item.efficiency, item.duration)}
                    value={formatEfficiency(item.efficiency)}
                  />
                  <SessionTableCell value={`$${item.earnings}`} />
                </TableRow>
              ))}
            </TableBody>
          </Suspense>
        </Table>
      </div>
      <TableSessionsFooter />
    </div>
  )
}

function SessionTableCell({ value, className, ...props }: { value: string | number } & React.HTMLAttributes<HTMLTableCellElement>) {
  const { deleteSessions } = useSessionMutations()
  const { selectedSessions } = useSelectedSessions()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableCell
          className={cn(className, 'group-data-[active=true]:bg-accent/50 group-data-[active=true]:font-medium hover:bg-accent/50')}
          {...props}
        >{value}
        </TableCell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* <ContextMenuLabel className="font-mono text-xs">{value}</ContextMenuLabel> */}
        <ContextMenuItem onSelect={() => void navigator.clipboard.writeText(value.toString())}>Copy value</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onSelect={() => deleteSessions(Array.from(selectedSessions))}
        >
          {selectedSessions.size > 1 ? 'Delete sessions' : 'Delete session'}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export { TableSessions }
