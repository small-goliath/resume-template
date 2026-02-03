'use client'

/**
 * 봉사활동 섹션 컴포넌트
 *
 * 개발자의 봉사활동을 세로 리스트로 표시
 * - 세로 리스트 레이아웃
 * - 기관명, 설명
 * - useVolunteer() hook으로 데이터 페칭
 * - sort_order 기준 정렬
 * - 반응형 디자인
 */

import { Heart, Building2 } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useVolunteer } from '@/lib/hooks/use-portfolio-data'
import type { Volunteer } from '@/types'

/**
 * 봉사활동 섹션 Props 인터페이스
 */
interface VolunteerSectionProps {
  className?: string
}

/**
 * 봉사활동 섹션 메인 컴포넌트
 */
export function VolunteerSection({ className }: VolunteerSectionProps) {
  const { data: volunteerData, isLoading, error } = useVolunteer()

  if (isLoading) {
    return <VolunteerSectionSkeleton />
  }

  if (error) {
    return <VolunteerSectionError error={error.message} />
  }

  if (!volunteerData || volunteerData.length === 0) {
    return <VolunteerSectionEmpty />
  }

  // sort_order 기준 정렬
  const sortedVolunteer = [...volunteerData].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return (
    <VolunteerSectionContent volunteer={sortedVolunteer} className={className} />
  )
}

/**
 * 봉사활동 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface VolunteerSectionContentProps {
  volunteer: Volunteer[]
  className?: string
}

function VolunteerSectionContent({
  volunteer,
  className,
}: VolunteerSectionContentProps) {
  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-red-500/20 bg-gradient-to-br from-red-500/20 to-pink-500/20 p-2.5 backdrop-blur-sm">
            <Heart className="size-5 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Volunteer</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          봉사활동 및 사회공헌
        </p>
      </div>

      {/* 봉사활동 리스트 */}
      <div className="space-y-4">
        {volunteer.map(item => (
          <VolunteerCard key={item.id} volunteer={item} />
        ))}
      </div>
    </section>
  )
}

/**
 * 봉사활동 개별 카드 컴포넌트
 */
interface VolunteerCardProps {
  volunteer: Volunteer
}

function VolunteerCard({ volunteer }: VolunteerCardProps) {
  return (
    <Card
      variant="neon-border"
      className="transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 dark:hover:border-red-400/30"
    >
      <CardHeader className="space-y-3">
        {/* 기관명 */}
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 rounded-md bg-gradient-to-br from-red-500/10 to-pink-500/10 p-1.5 backdrop-blur-sm">
            <Building2 className="size-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg">{volunteer.organization}</CardTitle>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Heart className="size-3" />
              <span>봉사활동</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* 설명 */}
      {volunteer.description && (
        <CardContent>
          <CardDescription className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {volunteer.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function VolunteerSectionSkeleton() {
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

      {/* 리스트 스켈레톤 (3개 카드) */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4 rounded-xl border p-6">
            <div className="flex items-start gap-2.5">
              <Skeleton className="size-7 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
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
interface VolunteerSectionErrorProps {
  error: string
}

function VolunteerSectionError({ error }: VolunteerSectionErrorProps) {
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
            봉사활동 정보를 불러올 수 없습니다
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
function VolunteerSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Heart className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            봉사활동 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 봉사활동 정보를 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
