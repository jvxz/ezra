import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentSession } from '@/lib/hooks/use-current-session'
import { useStatus } from '@/lib/hooks/use-status'
import { formatDuration } from '@/src/lib/utils'

function InfoCardSession() {
  const { data } = useCurrentSession()

  if (!data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Session</CardTitle>
          <ToggleSessionButton />
        </CardHeader>
        {/* <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h2 className="text-muted-foreground text-base font-medium">Elapsed time</h2>
              <div className="text-xl font-medium">
                <Skeleton className="h-[20px] w-[100px]" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-muted-foreground text-base font-medium">Efficiency</h2>
              <div className="text-xl font-medium text-orange-400">
                <Skeleton className="h-[20px] w-[100px]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-muted-foreground text-base font-medium">Total tasks</h2>
              <div className="text-xl font-medium">
                <Skeleton className="h-[20px] w-[100px]" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-muted-foreground text-base font-medium">Total earnings</h2>
              <div className="text-xl font-medium">
                <Skeleton className="h-[20px] w-[100px]" />
              </div>
            </div>
          </div>
        </CardContent> */}
      </Card>
    )
  }

  console.log(data.efficiency)

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
              {formatDuration(data.duration, 'secs') === '0' ? '0s' : formatDuration(data.duration, 'secs')}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Efficiency</h2>
            <div className="text-xl font-medium text-orange-400">
              {`${data.efficiency ?? 0}%`}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Total tasks</h2>
            <div className="text-xl font-medium">
              {data.taskCount}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Total earnings</h2>
            <div className="text-xl font-medium">
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              }).format(data.earnings)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ToggleSessionButton() {
  const { start, stop } = useCurrentSession()
  const { data } = useStatus()

  if (!data) {
    return (
      <Button disabled>
        Start
        {' '}
        <span className="iconify icon-[ph--play-fill]"></span>
      </Button>
    )
  }

  if (data.session) {
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
