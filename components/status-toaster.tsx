import { useStatusStore } from '@/lib/store/status'
import { toast } from 'sonner'
import { Toaster } from './ui/sonner'

function StatusToaster() {
  const { message, timestamp, type } = useStatusStore()

  useEffect(() => {
    if (!message) return

    switch (type) {
      case 'error':
        toast.error(message)
        break
      case 'success':
        toast.success(message)
        break
      case 'info':
        toast.info(message)
        break
    }
  }, [timestamp])

  return (
    <Toaster />
  )
}

export { StatusToaster }
