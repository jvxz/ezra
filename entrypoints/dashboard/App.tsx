import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/hooks/use-theme'

function App() {
  const { theme, handleThemeToggle } = useTheme()

  return (
    <div className="grid h-screen place-items-center">
      <Button onClick={handleThemeToggle}>
        Dashboard
      </Button>
      <p>{theme}</p>
    </div>
  )
}

export default App
