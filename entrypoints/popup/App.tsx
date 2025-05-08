import { Separator } from '@/components/ui/separator'
import { TopButtons } from './components/top-buttons'

function App() {
  return (
    <div className="flex h-[400px] w-68 flex-col gap-2 p-4">
      <TopButtons />
      <Separator />
    </div>
  )
}

export default App
