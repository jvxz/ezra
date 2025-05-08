import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
        <TabsContent value="session">
          <div className="my-2 flex items-center justify-around text-2xl font-medium">
            <span>10:00</span>
            <span className="text-orange-400">98.7%</span>
          </div>
        </TabsContent>
        <TabsContent value="day">
          <div className="my-2 flex items-center justify-around text-2xl font-medium">
            <span>10:00</span>
            <span className="text-orange-400">98.7%</span>
          </div>
        </TabsContent>
        <TabsContent value="week">
          <div className="my-2 flex items-center justify-around text-2xl font-medium">
            <span>10:00</span>
            <span className="text-orange-400">98.7%</span>
          </div>
        </TabsContent>
        <TabsContent value="month">
          <div className="my-2 flex items-center justify-around text-2xl font-medium">
            <span>10:00</span>
            <span className="text-orange-400">98.7%</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { TimeInfo }
