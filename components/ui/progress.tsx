import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import * as ProgressPrimitive from '@radix-ui/react-progress'

function Progress({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('bg-primary/20 group relative h-2 w-full overflow-hidden rounded', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 rounded-r-full transition duration-100 ease-out group-data-[state=over]:animate-pulse group-data-[state=over]:bg-red-400"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
