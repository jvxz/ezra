import { useSession } from '@/lib/hooks/use-session'
import { Button } from './ui/button'

function DevTools() {
  const { start, stop } = useSession()

  return (
    <div className="bg-card fixed top-12 right-1/2 left-1/2 z-50 flex w-fit -translate-x-1/2 gap-2 rounded border p-2">
      <Button onClick={() => start()}>start session</Button>
      <Button onClick={() => stop()}>stop session</Button>
      <ThemeToggle />
    </div>
  )
}

export { DevTools }
