import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Card variant 스타일 정의
const cardVariants = cva(
  'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm transition-all',
  {
    variants: {
      variant: {
        // default - 기본 사이버펑크 스타일
        default:
          'py-6 bg-[--color-black-elevated] border-[--color-neon-cyan-900] shadow-[0_0_10px_rgba(0,240,255,0.1)]',
        // cyber - 강한 네온 보더
        cyber:
          'py-6 bg-[--color-black-elevated] border-2 border-[--color-neon-cyan-500] shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300',
        // neon-border - 네온 보더 효과
        'neon-border':
          'py-6 bg-[--color-black-elevated] border border-[--color-neon-cyan-700] shadow-[0_0_15px_rgba(0,240,255,0.2),inset_0_0_15px_rgba(0,240,255,0.05)] hover:border-[--color-neon-cyan-500] hover:shadow-[0_0_25px_rgba(0,240,255,0.4),inset_0_0_25px_rgba(0,240,255,0.1)] transition-all duration-300',
        // terminal - 터미널 스타일
        terminal:
          'py-6 bg-[--color-black-surface] border border-[--color-neon-green-800] text-[--color-neon-green-500] font-mono shadow-[0_0_10px_rgba(0,255,65,0.1)]',
        // glass - 사이버펑크 글래스
        glass:
          'py-6 bg-[--color-black-elevated]/50 backdrop-blur-xl border border-[--color-neon-cyan-900]/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
        // magenta - 마젠타 네온
        magenta:
          'py-6 bg-[--color-black-elevated] border border-[--color-neon-magenta-700] shadow-[0_0_15px_rgba(255,0,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-all duration-300',
        // purple - 퍼플 네온
        purple:
          'py-6 bg-[--color-black-elevated] border border-[--color-neon-purple-700] shadow-[0_0_15px_rgba(157,0,255,0.2)] hover:shadow-[0_0_25px_rgba(157,0,255,0.4)] transition-all duration-300',
        // minimal - 미니멀 사이버펑크
        minimal:
          'py-6 bg-[--color-black-surface] border-0 shadow-none hover:bg-[--color-black-elevated] transition-colors duration-300',
        // interactive - 인터랙티브 효과
        interactive:
          'py-6 bg-[--color-black-elevated] border border-[--color-neon-cyan-800] cursor-pointer hover:scale-[1.02] hover:border-[--color-neon-cyan-600] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] active:scale-[0.98] transition-all duration-300',
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
