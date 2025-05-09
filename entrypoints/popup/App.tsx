import { Separator } from '@/components/ui/separator'
import { Footer } from './components/footer'
import { TaskInfo } from './components/task-info'
import { TimeInfo } from './components/time-info'
import { TopButtons } from './components/top-buttons'

function App() {
  return (
    <div className="h-fit w-68 font-sans">
      <TopButtons />
      <TimeInfo />
      <Separator />
      <TaskInfo />
      <Separator />
      <Footer />
    </div>
  )
}

export default App
