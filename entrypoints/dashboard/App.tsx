import { InfoCards } from './components/info-cards'
import { TableSessions } from './components/table/table-sessions'

function App() {
  return (
    <main className="container mx-auto h-screen">
      <div className="flex w-full gap-4 pt-56">
        <TableSessions />
        <InfoCards />
      </div>
    </main>
  )
}

export default App
