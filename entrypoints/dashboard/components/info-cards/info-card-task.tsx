import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function InfoCardTask() {
  return (
    <Card>
      <CardHeader >
        <CardTitle>Task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="iconify icon-[ph--clock-countdown] text-lg" />
              <p className="text-muted-foreground text-sm">--:--</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="iconify icon-[ph--warning] text-lg" />
              <p className="text-muted-foreground text-sm">--:--</p>
            </div>
          </div>
          <Progress value={33} />
        </div>
      </CardContent>
    </Card>
  )
}

export { InfoCardTask }
