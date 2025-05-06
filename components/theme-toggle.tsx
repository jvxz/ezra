import { useTheme } from '@/lib/hooks/use-theme'
import { Button } from './ui/button'

function ThemeToggle() {
  const { handleThemeToggle, theme } = useTheme()

  return (
    <Button onClick={handleThemeToggle} size="icon">
      {theme === 'dark' ? <div className="iconify icon-[ph--sun]"></div> : <div className="iconify icon-[ph--moon]"></div>}
    </Button>
  )
}

export { ThemeToggle }
