import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const data = Array.from({
  length: 10,
}, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
}))

function App() {
  const [selItems, setSelItems] = useState<Set<string>>(new Set())

  const selStateRef = useRef<{
    state: boolean
    mode: 'enable' | 'disable'
  }>({
    state: false,
    mode: 'enable',
  })
  const selItemsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const handleSelectToggle = (el: HTMLTableRowElement) => {
      if (!el.dataset.id) return

      if (selStateRef.current.mode === 'disable' && selItemsRef.current.has(el.dataset.id)) {
        selItemsRef.current.delete(el.dataset.id)
        el.dataset.selected = 'false'
      }
      else if (selStateRef.current.mode === 'enable' && !selItemsRef.current.has(el.dataset.id)) {
        selItemsRef.current.add(el.dataset.id)
        el.dataset.selected = 'true'
      }
    }

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = (event.target as HTMLElement).parentElement
      if (!target || target.tagName !== 'TR' || !target.dataset.id) return

      selStateRef.current.state = true

      if (selItemsRef.current.has(target.dataset.id)) {
        selStateRef.current.mode = 'disable'
      }
      else {
        selStateRef.current.mode = 'enable'
      }

      handleSelectToggle(target as HTMLTableRowElement)
    }

    const handleMouseOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).parentElement
      if (!target || !selStateRef.current.state) return

      if (target.tagName === 'TR') {
        handleSelectToggle(target as HTMLTableRowElement)
      }
    }

    const handlePointerUp = () => {
      if (!selStateRef.current.state) return
      selStateRef.current.state = false
      setSelItems(new Set(selItemsRef.current))
    }

    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [selItems])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p>{selItems.size}</p>
      <div className="h-[800px] w-lg overflow-auto rounded border">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow
                key={item.id}
                data-id={item.id.toString()}
                data-selected={selItems.has(item.id.toString()) ? 'true' : 'false'}
                className="data-[selected=true]:bg-red-500"
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default App
