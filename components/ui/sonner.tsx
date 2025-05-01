import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast:
            'group toast !bg-card !text-card-foreground !border-border !shadow-none',
          description: '!text-muted-foreground',
          actionButton:
            '!bg-primary !text-primary-foreground font-medium',
          cancelButton:
            '!bg-muted !text-muted-foreground font-medium',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
