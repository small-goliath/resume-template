import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Card variant 스타일 정의
const cardVariants = cva(
  'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm transition-all',
  {
    variants: {
      variant: {
        // default - 기본 카드 스타일
        default: 'py-6',
        // elevated - 입체감 있는 카드
        elevated:
          'py-6 shadow-md hover:shadow-lg border-transparent bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50',
        // glass - glassmorphism 효과
        glass:
          'py-6 bg-white/50 backdrop-blur-xl border-white/20 shadow-xl dark:bg-black/30 dark:border-white/10',
        // outline - 아웃라인 강조 카드
        outline:
          'py-6 border-2 hover:border-primary/50 hover:shadow-md dark:hover:border-primary/30',
        // minimal - 미니멀 디자인
        minimal:
          'py-6 border-0 shadow-none hover:bg-accent/50 dark:hover:bg-accent/20',
        // neon - 네온 효과 카드 (개발자스러운)
        neon: 'py-6 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] dark:border-cyan-400/50',
        // interactive - 인터랙티브 효과
        interactive:
          'py-6 cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-transform',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
