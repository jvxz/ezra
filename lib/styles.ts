const interactiveStyles = {
  base: 'focus-visible:border-primary/50 select-none focus-visible:ring-ring/40 focus-visible:ring-[3px] active:ring-ring/20 aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 shrink-0 cursor-pointer gap-2 rounded text-base whitespace-nowrap transition-all outline-none disabled:pointer-events-none hover:disabled:cursor-not-allowed disabled:opacity-50 underline-offset-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 duration-100',
  variant: {
    default: 'bg-card border-border text-card-foreground border hover:border-primary/30 active:border-primary/40',
    destructive: 'bg-destructive/90 text-destructive-foreground hover:bg-destructive active:bg-destructive/90',
    outline: 'border-border/60 border bg-transparent hover:bg-card hover:border-primary/30 active:border-primary/40',
    ghost: 'hover:bg-muted active:bg-muted/80',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-8 px-3 py-1.5 text-sm',
    sm: 'h-7 px-2.5 py-1 text-sm',
    lg: 'h-10 px-5 text-base text-lg',
    icon: 'aspect-square size-8',
  },
}

const staticStyles = {
  base: 'rounded p-5 duration-100',
  variant: {
    default: 'bg-card border text-card-foreground',
    destructive: 'bg-card border-destructive text-destructive border [&>svg]:text-current',
  },
}

const popoverStyles = {
  item: [interactiveStyles.base, interactiveStyles.variant.ghost, interactiveStyles.size.default, 'focus:bg-muted focus:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground [&_svg:not([class*=\'size-\'])]:size-4 data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground dark:data-[variant=destructive]:focus:bg-destructive/40 relative flex cursor-default items-center p-1 px-2 text-sm outline-hidden transition-all select-none focus-visible:ring-0 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0'],
  content: [staticStyles.base, staticStyles.variant.default, 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden p-1 duration-100'],
}

const overlayStyles = 'data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-overlay backdrop-blur-xs'

export {
  interactiveStyles,
  overlayStyles,
  popoverStyles,
  staticStyles,
}
