import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentSession } from '@/lib/hooks/use-current-session'
import { formatDuration } from '@/src/lib/utils'

function TimeInfo() {
  return (
    <div>
      <Tabs
        defaultValue="session"
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>
        <TabsContentTime value="session" />
        <TabsContentTime value="day" />
        <TabsContentTime value="week" />
        <TabsContentTime value="month" />
      </Tabs>
    </div>
  )
}

// TODO: Add a loading state
function TabsContentTime({ value }: { value: 'session' | 'day' | 'week' | 'month' }) {
  const { data: session, isLoading } = useCurrentSession()

  if (isLoading) {
    return (
      <TabsContent value={value}>
        <div className="my-2 flex items-center justify-around text-2xl font-medium">
          <span>--</span>
          <span>--</span>
        </div>
      </TabsContent>
    )
  }

  if (!session) {
    return (
      <TabsContent value={value}>
        <div className="my-2 flex items-center justify-around text-lg">
          <span>No session active</span>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value={value}>
      <div className="my-2 flex items-center justify-around text-2xl font-medium">
        <span>{formatDuration(session.duration, 'secs')}</span>
        <span className="text-orange-400">{session.efficiency}</span>
      </div>
    </TabsContent>
  )
}

export { TimeInfo }
