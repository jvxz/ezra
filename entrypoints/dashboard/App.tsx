import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/lib/db'
import { useDragSelect } from '@/lib/hooks/use-drag-select'
import { useLiveQuery } from 'dexie-react-hooks'
import { Suspense } from 'react'

function App() {
  const sessions = useLiveQuery(async () => db.sessions.toArray())
  const selectedItems = useDragSelect()

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p>{selectedItems.size}</p>
      <div className="h-[800px] w-lg overflow-auto rounded border select-none">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense>
            <TableBody>
              {sessions?.map(item => (
                <TableRow
                  key={item.id}
                  data-id={item.id.toString()}
                  data-state={selectedItems.has(item.id.toString()) ? 'selected' : ''}
                  className='group'
                >
                  <TableCell className='group-data-[state=selected]:italic'>{item.id}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Suspense>
        </Table>
      </div>
    </div>
  )
}

export default App
