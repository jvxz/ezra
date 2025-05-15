import { TableSessions } from './components/table/table-sessions'
import { TableTasks } from './components/table/table-tasks'

function App() {
  return (
    <main className="container mx-auto h-screen font-sans">
      <div className="flex w-full gap-4 pt-56">
        <TableSessions />
        <TableTasks />
        {/* <InfoCards /> */}
      </div>
    </main>
  )
}

export default App
