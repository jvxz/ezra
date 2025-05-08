import { Separator } from '@/components/ui/separator'
import { TimeInfo } from './components/time-info'
import { TopButtons } from './components/top-buttons'

function App() {
  return (
    <div className="flex h-[400px] w-68 flex-col gap-2 p-4">
      <TopButtons />
      <Separator />
      <TimeInfo />
    </div>
  )
}

export default App
