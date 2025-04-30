import { Button } from '@/components/ui/button'

function App() {
  const handleClick = () => {
    const url = browser.runtime.getURL('/dashboard.html')
    void browser.tabs.create({
      url,
    })
  }

  return (
    <div className="p-4">
      <Button onClick={handleClick}>
        Dashboard
      </Button>
    </div>
  )
}

export default App
