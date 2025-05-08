import { Button } from '@/components/ui/button'

function TopButtons() {
  return (
    <div className="flex items-center gap-2 *:flex-1">
      <Button>
        Stop
      </Button>
      <Button>
        Dashboard
      </Button>
    </div>
  )
}

export { TopButtons }
