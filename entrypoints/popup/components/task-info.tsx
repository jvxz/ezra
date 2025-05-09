import { Progress } from '@/components/ui/progress'
import { useTask } from '@/lib/hooks/use-task'
import { formatDuration, getTaskProgress } from '@/lib/utils'

function TaskInfo() {
  const { data: task } = useTask()

  if (!task) {
    return (
      <div className="space-y-2 p-4">
        <div className="text-muted-foreground flex items-center">
          <p>Task</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="iconify icon-[ph--clock-countdown]" />
              <p className="text-muted-foreground text-sm">
                --
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="iconify icon-[ph--warning]" />
              <p
                className="text-muted-foreground text-sm"
              >
                --
              </p>
            </div>
          </div>
          <Progress
            className="h-1"
            value={0}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 p-4">
      <div className="text-muted-foreground flex items-center justify-between">
        <p>Task</p>
        <p className="text-muted-foreground animate-in fade-in-0 slide-in-from-right-50 font-mono duration-150">
          {task.description}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="iconify icon-[ph--clock-countdown]" />
            <p className="text-muted-foreground text-sm">
              {formatDuration(task.duration, 'secs')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="iconify icon-[ph--warning]" />
            <p
              data-state={getTaskProgress(task.duration, task.aet) === 100 ? 'over' : 'under'}
              className="text-muted-foreground text-sm"
            >
              {formatDuration(task.aet, 'mins')}
            </p>
          </div>
        </div>
        <Progress
          className="h-1"
          data-state={getTaskProgress(task.duration, task.aet) === 100 ? 'over' : 'under'}
          value={getTaskProgress(task.duration, task.aet)}
        />
      </div>
    </div>
  )
}

export { TaskInfo }
