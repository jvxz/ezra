import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@/lib/hooks/use-session'

function InfoCardSession() {
  const { currentSession } = useSession()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Session</CardTitle>
        <ToggleSessionButton />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Elapsed time</h2>
            <div className="text-xl font-medium">
              {currentSession.data?.duration}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Efficiency</h2>
            <div className="text-xl font-medium text-orange-400">97.3%</div>
          </div>

          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Total tasks</h2>
            <div className="text-xl font-medium">6</div>
          </div>
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Total earnings</h2>
            <div className="text-xl font-medium">$32</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ToggleSessionButton() {
  const { currentSession, start, stop } = useSession()

  if (currentSession.isLoading) {
    return (
      <Button disabled>
        Start
        {' '}
        <span className="iconify icon-[ph--play-fill]"></span>
      </Button>
    )
  }

  if (currentSession.data) {
    return (
      <Button onClick={() => stop()}>
        Stop
        {' '}
        <span className="iconify icon-[ph--stop-fill]"></span>
      </Button>
    )
  }

  return (
    <Button onClick={() => start()}>
      Start
      {' '}
      <span className="iconify icon-[ph--play-fill]"></span>
    </Button>
  )
}
export { InfoCardSession }
