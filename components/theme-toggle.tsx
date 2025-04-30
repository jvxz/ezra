import { useTheme } from '@/lib/hooks/use-theme'
import { Button } from './ui/button'

function ThemeToggle() {
  const { handleThemeToggle, theme } = useTheme()

  return (
    <Button onClick={handleThemeToggle}>
      {theme}
    </Button>
  )
}

export { ThemeToggle }
