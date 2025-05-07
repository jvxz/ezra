import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePrefsStore } from '@/lib/store/prefs'
import { useStatusStore } from '@/lib/store/status'

function RightAsideButtons() {
  return (
    <div className="flex items-center justify-end gap-2">
      <ThemeToggle />
      <Button size="icon">
        <div className="iconify icon-[ph--layout]"></div>
      </Button>
      <PrefsDialog />
    </div>
  )
}

function PrefsDialog() {
  const i = useRef<HTMLInputElement>(null)
  const { rate, setRate } = usePrefsStore()
  const { setStatus } = useStatusStore()

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (i.current && Number(i.current.value) > 0) {
        setRate(Number(i.current.value))
        setStatus({
          message: 'Rate updated',
          timestamp: Date.now(),
          type: 'success',
        })
      }
      else {
        setStatus({
          message: 'Rate must be greater than 0',
          timestamp: Date.now(),
          type: 'error',
        })
      }
    },
    [setRate, setStatus],
  )

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size="icon">
          <div className="iconify icon-[ph--faders]"></div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-2">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle>Preferences</AlertDialogTitle>
        </AlertDialogHeader>

        <Label className="gap-1">
          <span className="iconify icon-[ph--money]"></span>
          Rate
        </Label>
        <form
          className="mb-2 flex items-center gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            type="number"
            defaultValue={rate}
            ref={i}
            max={100}
            className="flex-1"
          />
          <Button
            className="shrink-0"
            type="submit"
          >
            Submit
          </Button>
        </form>

        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { RightAsideButtons }
