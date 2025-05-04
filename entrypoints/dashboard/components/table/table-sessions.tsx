import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDragSelect } from '@/lib/hooks/use-drag-select'
import { useSession } from '@/lib/hooks/use-session'
import { formatTimestamp } from '@/src/lib/utils'
import { Suspense } from 'react'

function TableSessions() {
  const { data: sessions } = useSession()
  const selectedItems = useDragSelect()
  const sortedSessions = useMemo(() => sessions?.sort((a, b) => b.start - a.start), [sessions])

  return (
    <div className="grow overflow-auto rounded border select-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead>Efficiency</TableHead>
          </TableRow>
        </TableHeader>
        <Suspense>
          <TableBody>
            {sortedSessions?.map(item => (
              <TableRow
                key={item.id}
                data-id={item.id.toString()}
                data-state={selectedItems.has(item.id.toString()) ? 'selected' : ''}
                data-active={item.end === 'Active' ? 'true' : 'false'}
                className="group"
              >
                {/* <TableCell className="group-data-[state=selected]:italic">{item.id}</TableCell> */}
                <CopyableTableCell
                  value={item.description}
                />
                <CopyableTableCell
                  value={formatTimestamp(item.start, 'time')}
                />
                <CopyableTableCell
                  value={item.end === 'Active' ? 'Active' : formatTimestamp(item.end, 'time')}
                />
                <CopyableTableCell
                  value={item.duration}
                />
                <CopyableTableCell
                  value={item.earnings}
                />
                <CopyableTableCell
                  value={item.efficiency}
                />
              </TableRow>
            ))}
          </TableBody>
        </Suspense>
      </Table>
    </div>
  )
}

function CopyableTableCell({ value }: { value: string | number }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableCell className="group-data-[active=true]:font-medium">{value}</TableCell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{value}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => void navigator.clipboard.writeText(value.toString())}>Copy value</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export { TableSessions }
