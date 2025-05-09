import { Separator } from '@/components/ui/separator'
import { TaskInfo } from './components/task-info'
import { TimeInfo } from './components/time-info'
import { TopButtons } from './components/top-buttons'

function App() {
  return (
    <div className="h-[400px] w-68 font-sans">
      <TopButtons />
      <TimeInfo />
      <Separator />
      <TaskInfo />
    </div>
  )
}

export default App
