import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'
import { useDragSelect } from '@/lib/hooks/use-drag-select'
import { cn, formatDuration, formatEfficiency, formatTimestamp, getEfficiencyColor } from '@/lib/utils'
import { Suspense, useMemo } from 'react'
import { TableSessionsFooter } from './table-sessions-footer'

function TableSessions() {
  const { data } = useAllSessions()
  const selectedItems = useDragSelect()
  const sortedItems = useMemo(() => {
    return data?.sort((a, b) => {
      return b.start - a.start
    })
  }, [data])

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
                  data-state={selectedItems.has(item.id.toString()) ? 'selected' : ''}
                  data-active={item.end === 'Active' ? 'true' : 'false'}
                  className="group"
                >
                  <CopyableTableCell value={formatTimestamp(item.start, 'date')} />
                  <CopyableTableCell value={item.description} />
                  <CopyableTableCell value={formatTimestamp(item.start, 'time')} />
                  <CopyableTableCell value={item.end === 'Active' ? 'Active' : formatTimestamp(item.end, 'time')} />
                  <CopyableTableCell value={formatDuration(item.duration, 'secs')} />
                  <CopyableTableCell
                    className={getEfficiencyColor(item.efficiency, item.duration)}
                    value={formatEfficiency(item.efficiency)}
                  />
                  <CopyableTableCell value={`$${item.earnings}`} />
                </TableRow>
              ))}
            </TableBody>
          </Suspense>
        </Table>
      </div>
      <TableSessionsFooter selectedItems={selectedItems} />
    </div>
  )
}

function CopyableTableCell({ value, className, ...props }: { value: string | number } & React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableCell
          className={cn(className, 'group-data-[active=true]:bg-accent group-data-[active=true]:font-medium')}
          {...props}
        >{value}
        </TableCell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel className="font-mono text-xs">{value}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => void navigator.clipboard.writeText(value.toString())}>Copy value</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export { TableSessions }
