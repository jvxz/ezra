import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'
import { useSelectedItems } from '@/lib/store/selected-items'
import { Suspense } from 'react'
import { TableSessionsFooter } from './table-sessions-footer'

function TableTasks() {
  const { selectedItems } = useSelectedItems()
  const { data: sessions } = useAllSessions()

  const selectedSessionsTasks = useMemo(() => {
    const x = sessions?.filter(session => selectedItems.has(session.id.toString()))

    return x?.map(session => session.tasks).flat()
  }, [sessions, selectedItems])

  return (
    <div className="grow overflow-auto rounded border select-none">
      <div className="[&>div]:h-[800px]">
        <Table className="font-mono text-xs">
          <TableHeader className="border-border sticky top-0 border-b backdrop-blur-sm">
            <TableRow>
              <TableHead className="w-32">ID</TableHead>
              <TableHead className="w-48">Description</TableHead>
              <TableHead className="w-32">Start</TableHead>
              <TableHead className="w-32">AET</TableHead>
              <TableHead className="w-42">Duration</TableHead>
              <TableHead className="w-32">Efficiency</TableHead>
              <TableHead className="w-auto">Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense>
            <TableBody>
              {selectedSessionsTasks?.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="w-32 truncate">{task.id}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.start}</TableCell>
                  <TableCell>{task.aet}</TableCell>
                  <TableCell>{task.duration}</TableCell>
                  <TableCell>{task.efficiency}</TableCell>
                  <TableCell>{task.earnings}</TableCell>
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

export { TableTasks }
