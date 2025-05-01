function useDragSelect() {
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
        el.dataset.state = 'unselected'
      }
      else if (selStateRef.current.mode === 'enable' && !selItemsRef.current.has(el.dataset.id)) {
        selItemsRef.current.add(el.dataset.id)
        el.dataset.state = 'selected'
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

  return selItems
}

export { useDragSelect }
