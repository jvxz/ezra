import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/lib/db'
import { useDragSelect } from '@/lib/hooks/use-drag-select'
import { formatTimestamp } from '@/src/lib/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { Suspense } from 'react'

function App() {
  const sessions = useLiveQuery(async () => db.sessions.toArray())
  const selectedItems = useDragSelect()

  const sortedSessions = useMemo(() => sessions?.sort((a, b) => b.start - a.start), [sessions])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p>{selectedItems.size}</p>
      <div className="h-[800px] w-[700px] overflow-auto rounded border select-none">
        <Table className="w-full">
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
                    value={formatTimestamp(item.end, 'time')}
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
    </div>
  )
}

function CopyableTableCell({ value }: { value: string | number }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableCell>{value}</TableCell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{value}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => void navigator.clipboard.writeText(value.toString())}>Copy value</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default App
