import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAllSessions } from '@/lib/hooks/use-all-sessions'
import { useAllTasks } from '@/lib/hooks/use-all-tasks'
import { useDragSelect } from '@/lib/hooks/use-drag-select'
import { useSelectedSessions } from '@/lib/store/selected-sessions'
import { useSelectedTasks } from '@/lib/store/selected-tasks'
import { Suspense } from 'react'
import { TableTasksFooter } from './table-tasks-footer'

function TableTasks() {
  const { setTasks, selectedTasks } = useSelectedTasks()
  const { data: allTasks } = useAllTasks()
  const { selectedSessions } = useSelectedSessions()
  const { data: sessions } = useAllSessions()

  const selectedSessionsTasks = useMemo(() => {
    const x = sessions?.filter(session => selectedSessions.has(session.id.toString()))
    return x?.map(session => session.tasks).flat()
  }, [sessions, selectedSessions])

  useDragSelect(setTasks)

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
              {selectedSessionsTasks && selectedSessionsTasks.length > 0 ? selectedSessionsTasks.map(item => (
                <TableRow
                  data-id={item.id.toString()}
                  data-state={selectedSessions.has(item.id.toString()) ? 'selected' : ''}
                  // data-active={item.end === 'Active' ? 'true' : 'false'}
                  className="group"
                  key={item.id}
                >
                  <TableCell className="w-32 truncate">{item.id}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.start}</TableCell>
                  <TableCell>{item.aet}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.efficiency}</TableCell>
                  <TableCell>{item.earnings}</TableCell>
                </TableRow>
              )) : allTasks?.map(item => (
                <TableRow
                  data-id={item.id.toString()}
                  data-state={selectedTasks.has(item.id.toString()) ? 'selected' : ''}
                  // data-active={item.end === 'Active' ? 'true' : 'false'}
                  className="group"
                  key={item.id}
                >
                  <TableCell className="w-32 truncate">{item.id}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.start}</TableCell>
                  <TableCell>{item.aet}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.efficiency}</TableCell>
                  <TableCell>{item.earnings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Suspense>
        </Table>
      </div>
      <TableTasksFooter />
    </div>
  )
}

export { TableTasks }
