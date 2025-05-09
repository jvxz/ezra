import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

function TimeInfo() {
  return (
    <div>
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
        <div className="flex flex-col p-4">
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--clock]" />
                Elapsed time
              </div>
              <span className="font-mono text-lg font-medium">10:00</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--chart-line-up]" />
                Efficiency
              </div>
              <span className="font-mono text-lg font-medium text-amber-500">98%</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--list]" />
                Total tasks
              </div>
              <span className="font-mono text-lg font-medium">3</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <span className="iconify icon-[ph--dollar-sign]" />
                Total earnings
              </div>
              <span className="font-mono text-lg font-medium">$2.01</span>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export { TimeInfo }
