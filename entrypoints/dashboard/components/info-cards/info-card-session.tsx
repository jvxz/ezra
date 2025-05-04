import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function InfoCardSession() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Session</CardTitle>
        <Button>
          Start
          {' '}
          <span className="iconify icon-[ph--play-fill]"></span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-base font-medium">Elapsed time</h2>
            <div className="text-xl font-medium">32m 21s</div>
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

export { InfoCardSession }
