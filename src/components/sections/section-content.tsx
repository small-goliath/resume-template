import * as React from 'react'

import { TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionContentProps {
  value: string
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'glass' | 'outline' | 'minimal' | 'neon'
  hideCard?: boolean // Card 없이 컨텐츠만 표시
}

/**
 * 섹션 컨텐츠 래퍼 컴포넌트
 *
 * TabsContent와 Card를 조합하여 일관된 섹션 레이아웃 제공
 * - 🎨 다양한 카드 스타일 variant 지원
 * - 📦 선택적 제목/설명 표시
 * - 🔧 Card 없이 순수 컨텐츠만 렌더링 가능
 */
export function SectionContent({
  value,
  title,
  description,
  children,
  className,
  variant = 'default',
  hideCard = false,
}: SectionContentProps) {
  return (
    <TabsContent value={value} className={cn('outline-none', className)}>
      {hideCard ? (
        // Card 없이 순수 컨텐츠만 렌더링
        <div className="space-y-6">{children}</div>
      ) : (
        // Card로 감싼 컨텐츠
        <Card variant={variant} className="overflow-hidden">
          {/* 헤더 (제목/설명이 있을 때만 표시) */}
          {(title || description) && (
            <CardHeader className="border-b">
              {title && (
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              )}
              {description && (
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {description}
                </p>
              )}
            </CardHeader>
          )}

          {/* 컨텐츠 영역 */}
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      )}
    </TabsContent>
  )
}

/**
 * 간단한 섹션 컨텐츠 (제목 없이 카드만)
 */
export function SimpleSectionContent({
  value,
  children,
  className,
  variant = 'minimal',
}: Omit<SectionContentProps, 'title' | 'description' | 'hideCard'>) {
  return (
    <SectionContent value={value} variant={variant} className={className}>
      {children}
    </SectionContent>
  )
}

/**
 * 로딩 상태 섹션 컨텐츠
 */
export function LoadingSectionContent({
  value,
  title,
}: Pick<SectionContentProps, 'value' | 'title'>) {
  return (
    <SectionContent value={value} title={title}>
      <div className="flex min-h-[24rem] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* 로딩 스피너 */}
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground text-sm">데이터 로딩 중...</p>
        </div>
      </div>
    </SectionContent>
  )
}

/**
 * 에러 상태 섹션 컨텐츠
 */
export function ErrorSectionContent({
  value,
  title,
  error,
}: Pick<SectionContentProps, 'value' | 'title'> & { error: string }) {
  return (
    <SectionContent value={value} title={title} variant="outline">
      <div className="flex min-h-[24rem] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          {/* 에러 아이콘 */}
          <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-destructive h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">데이터를 불러올 수 없습니다</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </div>
    </SectionContent>
  )
}

/**
 * 빈 상태 섹션 컨텐츠
 */
export function EmptySectionContent({
  value,
  title,
  message = '표시할 데이터가 없습니다',
}: Pick<SectionContentProps, 'value' | 'title'> & { message?: string }) {
  return (
    <SectionContent value={value} title={title} variant="minimal">
      <div className="flex min-h-[24rem] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          {/* 빈 상태 아이콘 */}
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-muted-foreground h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
      </div>
    </SectionContent>
  )
}
