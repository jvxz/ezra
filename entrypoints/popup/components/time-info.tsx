import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentSession } from '@/lib/hooks/use-current-session'
import { useStatus } from '@/lib/hooks/use-status'
import { formatDuration } from '@/lib/utils'

function TimeInfo() {
  return (
    <Tabs
      defaultValue="session"
      className="w-full gap-0"
    >
      <TabsList className="bg-card w-full gap-2 px-4 *:h-8">
        <TabsTrigger value="session">Session</TabsTrigger>
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
      <Separator />
      <SessionTabContent />
    </Tabs>
  )
}

function SessionTabContent() {
  const { data: status } = useStatus()
  const { data: currentSession } = useCurrentSession()

  return (
    <TabsContent
      value="session"
      className="flex flex-col p-4"
    >
      <div className="h-30">

        {!status?.session && (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">No session active</span>
          </div>
        )}
        {status?.session && currentSession && (
          <div className="grid h-full w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--clock]" />
                Elapsed time
              </div>
              <span className="font-mono text-lg font-medium">
                {formatDuration(currentSession.duration, 'secs') === '0' ? '0s' : formatDuration(currentSession.duration, 'secs')}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--chart-line-up]" />
                Efficiency
              </div>
              <span className="font-mono text-lg font-medium text-amber-500">
                {currentSession.efficiency}%
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--list]" />
                Total tasks
              </div>
              <span className="font-mono text-lg font-medium">
                {currentSession.taskCount}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--money]" />
                Total earnings
              </div>
              <span className="font-mono text-lg font-medium">
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                }).format(currentSession.earnings)}
              </span>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  )
}

export { TimeInfo }
