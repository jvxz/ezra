import { Button } from '@/components/ui/button'
import { useCurrentSession } from '@/lib/hooks/use-current-session'
import { useStatus } from '@/lib/hooks/use-status'
import { cn } from '@/lib/utils'

function TopButtons() {
  return (
    <div className="bg-card flex items-center gap-2 p-4 *:flex-1">
      <StopButton />
      <DashboardButton />
    </div>
  )
}

function StopButton() {
  const { start, stop } = useCurrentSession()
  const { data: status } = useStatus()

  const handleClick = () => {
    if (status?.session === true) {
      stop()
    }
    else {
      start()
    }
  }

  return (
    <Button onClick={handleClick}>
      {status?.session === true ? 'Stop' : 'Start'}
      <span
        className={cn(
          'iconify',
          status?.session === true ? 'icon-[ph--stop-fill]' : 'icon-[ph--play-fill]',
        )}
      >
      </span>
    </Button>
  )
}

function DashboardButton() {
  const handleClick = () => {
    const url = browser.runtime.getURL('/dashboard.html')
    window.open(url, '_blank')
  }

  return (
    <Button onClick={handleClick}>
      Dashboard
    </Button>
  )
}
export { TopButtons }
