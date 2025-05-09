import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTask } from '@/lib/hooks/use-task'
import { formatDuration, getTaskProgress } from '@/lib/utils'

function InfoCardTask() {
  const { data } = useTask()

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="iconify icon-[ph--clock-countdown] text-lg" />
                <p className="text-muted-foreground text-sm">
                  --
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="iconify icon-[ph--warning] text-lg" />
                <p className="text-muted-foreground text-sm">
                  --
                </p>
              </div>
            </div>
            <Progress />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task</CardTitle>
        <p className="text-muted-foreground animate-in fade-in-0 slide-in-from-right-50 text-sm duration-150">
          {data.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="iconify icon-[ph--clock-countdown] text-lg" />
              <p className="text-muted-foreground text-sm">
                {formatDuration(data.duration, 'secs')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="iconify icon-[ph--warning] text-lg" />
              <p
                data-state={getTaskProgress(data.duration, data.aet) === 100 ? 'over' : 'under'}
                className="text-muted-foreground text-sm"
              >
                {formatDuration(data.aet, 'mins')}
              </p>
            </div>
          </div>
          <Progress
            data-state={getTaskProgress(data.duration, data.aet) === 100 ? 'over' : 'under'}
            value={getTaskProgress(data.duration, data.aet)}
          />
        </div>
      </CardContent>
    </Card>
  )
}



export { InfoCardTask }
