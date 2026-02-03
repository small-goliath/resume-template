'use client'

/**
 * 인턴십 섹션 컴포넌트
 *
 * 개발자의 인턴십 경험을 세로 리스트로 표시
 * - 세로 리스트 레이아웃 (타임라인 유사)
 * - 회사명, 기간, 설명
 * - useInternships() hook으로 데이터 페칭
 * - sort_order 기준 정렬
 * - 반응형 디자인
 */

import { Building, Calendar, Briefcase } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useInternships } from '@/lib/hooks/use-portfolio-data'
import type { Internship } from '@/types'

/**
 * 인턴십 섹션 Props 인터페이스
 */
interface InternshipsSectionProps {
  className?: string
}

/**
 * 인턴십 섹션 메인 컴포넌트
 */
export function InternshipsSection({ className }: InternshipsSectionProps) {
  const { data: internshipsData, isLoading, error } = useInternships()

  if (isLoading) {
    return <InternshipsSectionSkeleton />
  }

  if (error) {
    return <InternshipsSectionError error={error.message} />
  }

  if (!internshipsData || internshipsData.length === 0) {
    return <InternshipsSectionEmpty />
  }

  // sort_order 기준 정렬
  const sortedInternships = [...internshipsData].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return (
    <InternshipsSectionContent
      internships={sortedInternships}
      className={className}
    />
  )
}

/**
 * 인턴십 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface InternshipsSectionContentProps {
  internships: Internship[]
  className?: string
}

function InternshipsSectionContent({
  internships,
  className,
}: InternshipsSectionContentProps) {
  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-2.5 backdrop-blur-sm">
            <Building className="size-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Internships</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          인턴십 및 실무 경험
        </p>
      </div>

      {/* 인턴십 리스트 */}
      <div className="space-y-4">
        {internships.map(internship => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </div>
    </section>
  )
}

/**
 * 인턴십 개별 카드 컴포넌트
 */
interface InternshipCardProps {
  internship: Internship
}

function InternshipCard({ internship }: InternshipCardProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${year}.${month}`
    } catch {
      return dateString
    }
  }

  const startDate = formatDate(internship.start_date)
  const endDate = formatDate(internship.end_date)
  const period = `${startDate} - ${endDate}`

  return (
    <Card
      variant="neon-border"
      className="transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:border-indigo-400/30"
    >
      <CardHeader className="space-y-3">
        {/* 기간 Badge - 개선된 가독성 */}
        <div>
          <Badge
            variant="secondary"
            className="border-2 border-indigo-500/40 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 px-3 py-1.5 font-mono text-base font-bold shadow-lg shadow-indigo-500/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/30 dark:border-indigo-500/40 dark:from-indigo-500/30 dark:to-blue-500/30 dark:shadow-indigo-500/20 dark:hover:border-indigo-500/60 dark:hover:shadow-indigo-500/30"
          >
            <Calendar className="mr-1.5 size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
              {period}
            </span>
          </Badge>
        </div>

        {/* 회사명 */}
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 rounded-md bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-1.5 backdrop-blur-sm">
            <Building className="size-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg">{internship.company}</CardTitle>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Briefcase className="size-3" />
              <span>인턴십</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* 설명 */}
      {internship.description && (
        <CardContent>
          <CardDescription className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {internship.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function InternshipsSectionSkeleton() {
  return (
    <section className="space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="ml-[52px] h-4 w-48" />
      </div>

      {/* 리스트 스켈레톤 (3개 카드) */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4 rounded-xl border p-6">
            <Skeleton className="h-6 w-32 rounded-full" />
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
interface InternshipsSectionErrorProps {
  error: string
}

function InternshipsSectionError({ error }: InternshipsSectionErrorProps) {
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
            인턴십 정보를 불러올 수 없습니다
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
function InternshipsSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Building className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            인턴십 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 인턴십 정보를 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
