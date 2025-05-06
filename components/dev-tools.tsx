import { useCurrentSession } from '@/lib/hooks/use-current-session'
import { useTask } from '@/lib/hooks/use-task'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

function DevTools() {
  const { start: startSession, stop: stopSession } = useCurrentSession()
  const { _debugStart: startTask, _debugStop: stopTask } = useTask()

  return (
    <div className="bg-card fixed top-12 right-1/2 left-1/2 z-50 flex w-fit -translate-x-1/2 gap-2 rounded border p-2">
      <Button onClick={() => startSession()}>start session</Button>
      <Button onClick={() => stopSession()}>stop session</Button>
      <Button onClick={() => startTask()}>start task</Button>
      <Button onClick={() => stopTask()}>stop task</Button>
      <Button onClick={() => void browser.storage.local.clear()}>clear storage</Button>
      <ThemeToggle />
    </div>
  )
}

export { DevTools }
