import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/hooks/use-session'
import { calcEarnings } from '@/src/lib/utils'

const rate = 15

function InfoCardSession() {
  const { data } = useSession()

  if (!data) {
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
        </CardContent>
      </Card>
    )
  }

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
              {data.duration}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Efficiency</h2>
            <div className="text-xl font-medium text-orange-400">
              {data.efficiency}
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
              {`$${calcEarnings(data.duration, rate)}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ToggleSessionButton() {
  const { data, start, stop } = useSession()

  if (!data) {
    return (
      <Button disabled>
        Start
        {' '}
        <span className="iconify icon-[ph--play-fill]"></span>
      </Button>
    )
  }

  if (data.isActive) {
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
