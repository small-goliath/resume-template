import * as React from 'react'
import { type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// SectionCard Props 인터페이스
interface SectionCardProps {
  // 섹션 아이콘
  icon?: LucideIcon
  // 섹션 제목
  title: string
  // 섹션 설명 (선택적)
  description?: string
  // 카드 내용
  children: React.ReactNode
  // 추가 className
  className?: string
  // 헤더 className
  headerClassName?: string
  // 컨텐츠 className
  contentClassName?: string
  // 카드 variant
  variant?:
    | 'default'
    | 'cyber'
    | 'neon-border'
    | 'terminal'
    | 'glass'
    | 'magenta'
    | 'purple'
    | 'minimal'
    | 'interactive'
  // 아이콘 색상 (Tailwind 클래스)
  iconColor?: string
  // 아이콘 배경 활성화
  iconBackground?: boolean
}

// SectionCard 컴포넌트 - 포트폴리오 섹션에서 재사용 가능한 카드
export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = 'cyber',
  iconColor = 'text-primary',
  iconBackground = true,
}: SectionCardProps) {
  return (
    <Card variant={variant} className={cn('w-full', className)}>
      <CardHeader className={cn(headerClassName)}>
        <div className="flex items-start gap-4">
          {/* 아이콘 영역 */}
          {Icon && (
            <div
              className={cn(
                'shrink-0 rounded-lg transition-all',
                iconBackground ? 'bg-primary/10 dark:bg-primary/20 p-3' : 'p-1',
                iconColor
              )}
            >
              <Icon className="size-6" />
            </div>
          )}

          {/* 타이틀과 설명 영역 */}
          <div className="flex-1 space-y-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      {/* 컨텐츠 영역 */}
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
    </Card>
  )
}

// SectionCard.Item - 섹션 내부 아이템용 서브 컴포넌트
interface SectionCardItemProps {
  // 아이템 제목
  title: string
  // 아이템 부제목 (선택적)
  subtitle?: string
  // 아이템 설명
  description?: string
  // 날짜/기간 정보
  period?: string
  // 아이템 아이콘
  icon?: LucideIcon
  // 추가 컨텐츠
  children?: React.ReactNode
  // className
  className?: string
}

export function SectionCardItem({
  title,
  subtitle,
  description,
  period,
  icon: Icon,
  children,
  className,
}: SectionCardItemProps) {
  return (
    <div
      className={cn(
        'group hover:border-border hover:bg-accent/50 dark:hover:bg-accent/20 relative space-y-3 rounded-lg border border-transparent p-4 transition-all',
        className
      )}
    >
      {/* 상단: 아이콘 + 타이틀 + 기간 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          {/* 아이콘 */}
          {Icon && (
            <div className="bg-primary/10 dark:bg-primary/20 shrink-0 rounded-md p-2">
              <Icon className="text-primary size-4" />
            </div>
          )}

          {/* 타이틀 & 부제목 */}
          <div className="flex-1 space-y-1">
            <h4 className="leading-none font-semibold">{title}</h4>
            {subtitle && (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
          </div>
        </div>

        {/* 기간 정보 */}
        {period && (
          <time className="text-muted-foreground shrink-0 text-xs">
            {period}
          </time>
        )}
      </div>

      {/* 설명 */}
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* 추가 컨텐츠 */}
      {children}
    </div>
  )
}

// SectionCard에 Item 서브 컴포넌트 연결
SectionCard.Item = SectionCardItem
