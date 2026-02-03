'use client'

import { GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEducation } from '@/lib/hooks/use-portfolio-data'
import type { Education } from '@/types'

/**
 * 교육사항 섹션 컴포넌트
 *
 * 2열 그리드 레이아웃으로 교육 기관 정보를 표시합니다.
 * - 기관명, 학위, 전공, 기간 정보
 * - sort_order 기준 정렬
 * - 반응형 디자인 (모바일 1열, 데스크톱 2열)
 */
export function EducationSection() {
  const { data: educations, isLoading, error } = useEducation()

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-muted-foreground text-center">
            교육사항을 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <EducationSkeleton />
        </div>
      </section>
    )
  }

  // 빈 데이터 처리
  if (!educations || educations.length === 0) {
    return null
  }

  // sort_order 기준 정렬
  const sortedEducations = [...educations].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="mb-12 flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <GraduationCap className="text-primary h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">교육사항</h2>
            <p className="text-muted-foreground">Education</p>
          </div>
        </div>

        {/* 교육 항목 그리드 */}
        <div className="grid gap-6 md:grid-cols-2">
          {sortedEducations.map(education => (
            <EducationCard key={education.id} education={education} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * 개별 교육 카드 컴포넌트
 */
interface EducationCardProps {
  education: Education
}

function EducationCard({ education }: EducationCardProps) {
  const { institution_name, description, start_year, end_year } = education

  // 기간 표시 (예: "2015 - 2019" 또는 "2020 - 현재")
  const period = end_year
    ? `${start_year} - ${end_year}`
    : `${start_year} - 현재`

  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <span className="text-xl font-bold">{institution_name}</span>
          <span className="text-muted-foreground shrink-0 text-sm font-normal">
            {period}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

/**
 * 로딩 스켈레톤 UI
 */
function EducationSkeleton() {
  return (
    <div className="space-y-8">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* 카드 그리드 스켈레톤 */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
