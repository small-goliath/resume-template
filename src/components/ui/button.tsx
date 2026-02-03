import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // 사이버펑크 네온 variants
        neon: 'bg-transparent border-2 border-[--color-neon-cyan-500] text-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)] hover:bg-[--color-neon-cyan-500] hover:text-[--color-black-base] hover:shadow-[0_0_20px_var(--color-neon-cyan-500),0_0_40px_var(--color-neon-cyan-500)] transition-all duration-300',
        'neon-magenta':
          'bg-transparent border-2 border-[--color-neon-magenta-500] text-[--color-neon-magenta-500] shadow-[0_0_10px_var(--color-neon-magenta-500)] hover:bg-[--color-neon-magenta-500] hover:text-[--color-black-base] hover:shadow-[0_0_20px_var(--color-neon-magenta-500),0_0_40px_var(--color-neon-magenta-500)] transition-all duration-300',
        'neon-purple':
          'bg-transparent border-2 border-[--color-neon-purple-500] text-[--color-neon-purple-500] shadow-[0_0_10px_var(--color-neon-purple-500)] hover:bg-[--color-neon-purple-500] hover:text-[--color-black-base] hover:shadow-[0_0_20px_var(--color-neon-purple-500),0_0_40px_var(--color-neon-purple-500)] transition-all duration-300',
        'neon-green':
          'bg-transparent border-2 border-[--color-neon-green-500] text-[--color-neon-green-500] shadow-[0_0_10px_var(--color-neon-green-500)] hover:bg-[--color-neon-green-500] hover:text-[--color-black-base] hover:shadow-[0_0_20px_var(--color-neon-green-500),0_0_40px_var(--color-neon-green-500)] transition-all duration-300',
        // neon filled variants
        'neon-filled':
          'bg-[--color-neon-cyan-500] text-[--color-black-base] shadow-[0_0_20px_var(--color-neon-cyan-500)] hover:shadow-[0_0_30px_var(--color-neon-cyan-500),0_0_60px_var(--color-neon-cyan-500)] hover:brightness-110 transition-all duration-300',
        // neon ghost variant
        'neon-ghost':
          'bg-transparent text-[--color-neon-cyan-500] hover:bg-[--color-neon-cyan-500]/10 hover:text-[--color-neon-cyan-400] hover:shadow-[0_0_15px_var(--color-neon-cyan-500)] transition-all duration-300',
        // terminal variant
        terminal:
          'bg-[--color-black-elevated] border border-[--color-neon-green-700] text-[--color-neon-green-500] font-mono hover:border-[--color-neon-green-500] hover:shadow-[0_0_10px_var(--color-neon-green-500)] transition-all duration-300',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-lg px-8 text-base has-[>svg]:px-6',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
