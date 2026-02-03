'use client'

/**
 * 수상 섹션 컴포넌트
 *
 * 개발자의 수상 내역을 3열 그리드로 표시
 * - 3열 그리드 레이아웃 (모바일 1열, 태블릿 2열)
 * - 인증서 이미지 (4:3 비율), 수상명, 대회명, 상세 링크
 * - useAwards() hook으로 데이터 페칭
 * - sort_order 기준 정렬
 * - 반응형 디자인
 */

import { Trophy, ExternalLink, Award as AwardIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAwards } from '@/lib/hooks/use-portfolio-data'
import type { Award } from '@/types'

/**
 * 수상 섹션 Props 인터페이스
 */
interface AwardsSectionProps {
  className?: string
}

/**
 * 수상 섹션 메인 컴포넌트
 */
export function AwardsSection({ className }: AwardsSectionProps) {
  const { data: awardsData, isLoading, error } = useAwards()

  if (isLoading) {
    return <AwardsSectionSkeleton />
  }

  if (error) {
    return <AwardsSectionError error={error.message} />
  }

  if (!awardsData || awardsData.length === 0) {
    return <AwardsSectionEmpty />
  }

  // sort_order 기준 정렬
  const sortedAwards = [...awardsData].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return <AwardsSectionContent awards={sortedAwards} className={className} />
}

/**
 * 수상 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface AwardsSectionContentProps {
  awards: Award[]
  className?: string
}

function AwardsSectionContent({
  awards,
  className,
}: AwardsSectionContentProps) {
  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-yellow-500/20 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-2.5 backdrop-blur-sm">
            <Trophy className="size-5 text-yellow-600 dark:text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Awards</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          수상 내역 및 인증서
        </p>
      </div>

      {/* 수상 그리드 (3열) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map(award => (
          <AwardCard key={award.id} award={award} />
        ))}
      </div>
    </section>
  )
}

/**
 * 수상 개별 카드 컴포넌트
 */
interface AwardCardProps {
  award: Award
}

function AwardCard({ award }: AwardCardProps) {
  return (
    <Card
      variant="neon-border"
      className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5 dark:hover:border-yellow-500/30"
    >
      {/* 인증서 이미지 (4:3 비율) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
        {award.certificate_image_url ? (
          <img
            src={award.certificate_image_url}
            alt={`${award.award_name} 인증서`}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // 이미지 플레이스홀더
          <div className="flex size-full items-center justify-center">
            <AwardIcon className="text-muted-foreground/20 size-16" />
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* 카드 내용 */}
      <CardHeader className="space-y-2">
        {/* 수상명 */}
        <CardTitle className="flex items-start gap-2 text-base">
          <Trophy className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-500" />
          <span className="flex-1 leading-snug">{award.award_name}</span>
        </CardTitle>

        {/* 대회명 */}
        <CardDescription className="text-foreground/70 flex items-start gap-2 text-sm">
          <AwardIcon className="mt-0.5 size-3.5 shrink-0" />
          <span className="flex-1 leading-relaxed">{award.contest_name}</span>
        </CardDescription>
      </CardHeader>

      {/* 상세 링크 버튼 */}
      {award.award_url && (
        <CardFooter className="mt-auto pt-0">
          <Button
            variant="neon-ghost"
            size="sm"
            className="w-full gap-2 transition-all duration-300 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5"
            onClick={() => {
              // TODO: 외부 링크 열기 로직 구현
              window.open(award.award_url!, '_blank', 'noopener,noreferrer')
            }}
          >
            <span>상세보기</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function AwardsSectionSkeleton() {
  return (
    <section className="space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="ml-[52px] h-4 w-48" />
      </div>

      {/* 그리드 스켈레톤 (6개 카드) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full" />
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
interface AwardsSectionErrorProps {
  error: string
}

function AwardsSectionError({ error }: AwardsSectionErrorProps) {
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
            수상 내역을 불러올 수 없습니다
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
function AwardsSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Trophy className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            수상 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 수상 내역을 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
