'use client'

/**
 * 기술공유 세미나 섹션 컴포넌트
 *
 * 개발자의 기술공유 세미나 활동을 연도별로 그룹화하여 표시
 * - 연도별 그룹화 (최신순)
 * - 세미나명, 링크 (선택적)
 * - useTechSeminars() hook으로 데이터 페칭
 * - sort_order 기준 정렬
 * - 반응형 디자인
 */

import { useTechSeminars } from '@/lib/hooks/use-portfolio-data'
import { TechSeminarsContent } from './tech-seminars-content'
import { TechSeminarsSkeleton } from './tech-seminars-skeleton'
import { TechSeminarsError, TechSeminarsEmpty } from './tech-seminars-error'

/**
 * 기술공유 세미나 섹션 Props 인터페이스
 */
interface TechSeminarsSectionProps {
  className?: string
}

/**
 * 기술공유 세미나 섹션 메인 컴포넌트
 */
export function TechSeminarsSection({ className }: TechSeminarsSectionProps) {
  const { data: seminarsData, isLoading, error } = useTechSeminars()

  if (isLoading) {
    return <TechSeminarsSkeleton />
  }

  if (error) {
    return <TechSeminarsError error={error.message} />
  }

  if (!seminarsData || seminarsData.length === 0) {
    return <TechSeminarsEmpty />
  }

  // sort_order 기준 정렬
  const sortedSeminars = [...seminarsData].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return <TechSeminarsContent seminars={sortedSeminars} className={className} />
}
