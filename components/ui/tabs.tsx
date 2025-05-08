import type { ComponentProps } from 'react'
import { interactiveStyles, staticStyles } from '@/lib/styles'
import { cn } from '@/src/lib/utils'
import * as TabsPrimitive from '@radix-ui/react-tabs'

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        staticStyles.base,
        staticStyles.variant.default,
        'relative inline-flex w-fit items-center justify-center gap-4 border-0 bg-transparent p-0 px-2',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        interactiveStyles.base,
        interactiveStyles.variant.default,
        'text-muted-foreground relative inline-flex flex-1 cursor-default items-center justify-center border-0 bg-transparent py-1 text-sm hover:text-foreground data-[state=active]:text-foreground',
        'data-[state=active]:before:bg-foreground before:absolute before:inset-x-0 before:top-[calc(100%-1px)] before:h-px before:rounded-full before:bg-transparent before:transition-all before:duration-100 before:ease-in-out before:content-[""]',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
}
