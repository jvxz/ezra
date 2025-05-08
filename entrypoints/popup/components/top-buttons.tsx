import { Button } from '@/components/ui/button'
import { useCurrentSession } from '@/lib/hooks/use-current-session'
import { useStatus } from '@/lib/hooks/use-status'

function TopButtons() {
  return (
    <div className="flex items-center gap-2 *:flex-1">
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
      {status?.session === true
        ? (
          <>
            Stop
            <span className="iconify icon-[ph--stop-fill]"></span>
          </>
        )
        : (
          <>
            Start
            <span className="iconify icon-[ph--play-fill]"></span>
          </>
        )}
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
