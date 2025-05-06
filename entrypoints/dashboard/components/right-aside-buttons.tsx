import { Button } from '@/components/ui/button'

function RightAsideButtons() {
  return (
    <div className="flex items-center justify-end gap-2">
      <ThemeToggle />
      <Button size="icon">
        <div className="iconify icon-[ph--layout]"></div>
      </Button>
      <Button size="icon">
        <div className="iconify icon-[ph--faders]"></div>
      </Button>
    </div>
  )
}

export { RightAsideButtons }
