'use client'

/**
 * 타임라인 섹션 컴포넌트
 *
 * 개발자 경력을 시간 순서대로 표시하는 현대적인 타임라인 UI
 * - 세로 타임라인 레이아웃 (연결선 표시)
 * - 왼쪽: 연도 인디케이터 + 아이콘
 * - 오른쪽: 회사명, 역할, 이벤트 카드
 * - useTimeline() hook으로 데이터 페칭
 * - sort_order 기준 정렬 (최신이 위)
 * - 반응형 디자인 (모바일/데스크톱)
 */

import { Calendar, Building2, Briefcase, TrendingUp } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTimeline } from '@/lib/hooks/use-portfolio-data'
import type { Timeline } from '@/types'

/**
 * 타임라인 섹션 Props 인터페이스
 */
interface TimelineSectionProps {
  className?: string
}

/**
 * 타임라인 섹션 메인 컴포넌트
 */
export function TimelineSection({ className }: TimelineSectionProps) {
  const { data: timelineData, isLoading, error } = useTimeline()

  if (isLoading) {
    return <TimelineSectionSkeleton />
  }

  if (error) {
    return <TimelineSectionError error={error.message} />
  }

  if (!timelineData || timelineData.length === 0) {
    return <TimelineSectionEmpty />
  }

  // sort_order 기준 정렬 (최신이 위)
  const sortedTimeline = [...timelineData].sort(
    (a, b) => b.sort_order - a.sort_order
  )

  return (
    <TimelineSectionContent timeline={sortedTimeline} className={className} />
  )
}

/**
 * 타임라인 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface TimelineSectionContentProps {
  timeline: Timeline[]
  className?: string
}

function TimelineSectionContent({
  timeline,
  className,
}: TimelineSectionContentProps) {
  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-2.5 backdrop-blur-sm">
            <TrendingUp className="size-5 text-blue-500 dark:text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Career Timeline</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          시간 순으로 정리된 경력 여정
        </p>
      </div>

      {/* 타임라인 아이템 리스트 */}
      <div className="ml-2 space-y-6">
        {timeline.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={index === timeline.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * 타임라인 개별 아이템 컴포넌트
 */
interface TimelineItemProps {
  item: Timeline
  isLast: boolean
}

function TimelineItem({ item, isLast }: TimelineItemProps) {
  return (
    <div className="group relative flex gap-6">
      {/* 왼쪽: 연도 인디케이터 + 연결선 */}
      <div className="relative flex shrink-0 flex-col items-center">
        {/* 연결선 (위쪽) - before pseudo-element로 구현 */}
        {/* 아이콘 원형 배경 */}
        <div className="relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-500/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/80 group-hover:shadow-xl group-hover:shadow-blue-500/30 before:absolute before:-top-6 before:left-1/2 before:h-6 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-transparent before:via-blue-500/30 before:to-blue-500/50 before:content-[''] first:before:hidden dark:border-cyan-500/50 dark:from-cyan-500/20 dark:to-blue-500/20 dark:group-hover:border-cyan-500/80 dark:before:via-cyan-500/30 dark:before:to-cyan-500/50">
          <Calendar className="size-4.5 text-blue-600 dark:text-cyan-400" />
        </div>

        {/* 연결선 (아래쪽) - after pseudo-element로 구현 */}
        {!isLast && (
          <div className="absolute top-10 left-1/2 h-[calc(100%+1.5rem)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-500/50 via-blue-500/30 to-transparent dark:from-cyan-500/50 dark:via-cyan-500/30" />
        )}
      </div>

      {/* 오른쪽: 컨텐츠 카드 */}
      <div className="flex-1 pb-6">
        {/* 연도 Badge */}
        <div className="mb-3">
          <Badge
            variant="secondary"
            className="border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 font-mono text-xs font-semibold backdrop-blur-sm dark:border-cyan-500/20 dark:from-cyan-500/20 dark:to-blue-500/20"
          >
            {item.year}
          </Badge>
        </div>

        {/* 카드 */}
        <Card
          variant="outline"
          className="transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-cyan-500/30"
        >
          <CardHeader>
            {/* 회사명 */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0 rounded-md bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-1.5 backdrop-blur-sm">
                <Building2 className="size-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 space-y-2">
                <CardTitle className="text-lg">{item.company}</CardTitle>

                {/* 역할 */}
                {item.role && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Briefcase className="size-3.5" />
                    <CardDescription className="font-medium">
                      {item.role}
                    </CardDescription>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          {/* 이벤트 목록 */}
          {item.events && item.events.length > 0 && (
            <CardContent>
              <ul className="space-y-2.5">
                {item.events.map((event, idx) => (
                  <li
                    key={idx}
                    className="text-foreground/90 flex items-start gap-3 text-sm"
                  >
                    {/* 불릿 포인트 (개발자스러운 디자인) */}
                    <span className="mt-2 inline-flex size-1.5 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 ring-4 ring-blue-500/10 dark:from-cyan-400 dark:to-blue-400 dark:ring-cyan-500/10" />
                    <span className="flex-1 leading-relaxed">{event}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function TimelineSectionSkeleton() {
  return (
    <section className="space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="ml-[52px] h-4 w-64" />
      </div>

      {/* 타임라인 아이템 스켈레톤 (3개) */}
      <div className="ml-2 space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="relative flex gap-6">
            {/* 왼쪽 인디케이터 */}
            <div className="relative flex shrink-0 flex-col items-center">
              <Skeleton className="size-10 rounded-full" />
              {i < 3 && (
                <div className="bg-border/50 absolute top-10 left-1/2 h-20 w-0.5 -translate-x-1/2" />
              )}
            </div>

            {/* 오른쪽 컨텐츠 */}
            <div className="flex-1 space-y-3 pb-6">
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="space-y-4 rounded-xl border p-6">
                <div className="flex items-start gap-2.5">
                  <Skeleton className="size-7 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * 에러 상태 UI
 */
interface TimelineSectionErrorProps {
  error: string
}

function TimelineSectionError({ error }: TimelineSectionErrorProps) {
  return (
    <section className="border-destructive/30 bg-destructive/5 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-destructive/10 rounded-full p-3">
          <svg
            className="text-destructive size-6"
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
          <h3 className="text-destructive text-lg font-semibold">
            타임라인을 불러올 수 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    </section>
  )
}

/**
 * 빈 데이터 상태 UI
 */
function TimelineSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Calendar className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            타임라인 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 경력 타임라인을 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
