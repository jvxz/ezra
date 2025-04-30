import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { interactiveStyles } from '@/lib/styles'
import { cn } from '@/src/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { Spinner } from './spinner'

const buttonVariants = cva(
  `${interactiveStyles.base} relative inline-flex items-center justify-center`,
  {
    variants: {
      variant: {
        default: interactiveStyles.variant.default,
        destructive: interactiveStyles.variant.destructive,
        outline: interactiveStyles.variant.outline,
        ghost: interactiveStyles.variant.ghost,
        link: interactiveStyles.variant.link,
      },
      size: {
        default: interactiveStyles.size.default,
        sm: interactiveStyles.size.sm,
        lg: interactiveStyles.size.lg,
        icon: interactiveStyles.size.icon,
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  children,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
    disabled?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      disabled={disabled || isLoading}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
        isLoading && 'grid text-transparent [grid-template-areas:stack]',
        disabled && 'pointer-events-none',
      )}
      {...props}
    >
      {children}
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner className="size-6" />
        </span>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
