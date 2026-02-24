/**
 * 기술공유 세미나 섹션 - 컨텐츠 컴포넌트
 *
 * 데이터 로드 완료 시 표시되는 실제 컨텐츠
 * - 연도별 그룹화 및 표시
 * - 세미나명 + 링크 (선택적)
 */

import { Card, CardContent } from '@/components/ui/card'
import type { TechSeminar } from '@/types'
import { ExternalLink, Mic } from 'lucide-react'

/**
 * 컨텐츠 컴포넌트 Props
 */
interface TechSeminarsContentProps {
  seminars: TechSeminar[]
  className?: string
}

/**
 * 기술공유 세미나 섹션 컨텐츠
 */
export function TechSeminarsContent({
  seminars,
  className,
}: TechSeminarsContentProps) {
  // 연도별로 그룹화 (최신순)
  const groupedByYear = seminars.reduce(
    (acc, seminar) => {
      if (!acc[seminar.year]) {
        acc[seminar.year] = []
      }
      acc[seminar.year].push(seminar)
      return acc
    },
    {} as Record<number, TechSeminar[]>
  )

  // 연도 배열 (내림차순 정렬)
  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-green-500/20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-2.5 backdrop-blur-sm">
            <Mic className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Tech Seminars</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          개발자로서의 조직 내 기술 공유 활동
        </p>
      </div>

      {/* 세미나 리스트 (연도별) */}
      <Card
        variant="neon-border"
        className="transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 dark:hover:border-green-400/30"
      >
        <CardContent className="p-6">
          <div className="space-y-6">
            {years.map(year => (
              <YearGroup
                key={year}
                year={year}
                seminars={groupedByYear[year]}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

/**
 * 연도별 그룹 컴포넌트
 */
interface YearGroupProps {
  year: number
  seminars: TechSeminar[]
}

function YearGroup({ year, seminars }: YearGroupProps) {
  return (
    <div className="group space-y-3">
      {/* 연도 헤더 */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 min-w-[64px] items-center justify-center rounded-md bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-3 backdrop-blur-sm">
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-semibold text-transparent dark:from-green-400 dark:to-emerald-400">
            {year}
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-green-500/20 to-transparent" />
      </div>

      {/* 세미나 리스트 */}
      <ul className="space-y-2 pl-4">
        {seminars.map(seminar => (
          <SeminarItem key={seminar.id} seminar={seminar} />
        ))}
      </ul>
    </div>
  )
}

/**
 * 세미나 개별 아이템 컴포넌트
 */
interface SeminarItemProps {
  seminar: TechSeminar
}

function SeminarItem({ seminar }: SeminarItemProps) {
  const hasLink = Boolean(seminar.seminar_url)

  return (
    <li className="group/item flex items-start gap-2">
      {/* 불릿 포인트 */}
      <span className="text-muted-foreground mt-2 shrink-0">•</span>

      {/* 세미나명 */}
      {hasLink ? (
        <a
          href={seminar.seminar_url!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center gap-1.5 text-foreground/90 underline decoration-green-500/30 decoration-1 underline-offset-2 transition-all hover:text-foreground hover:decoration-green-500/60 hover:decoration-2"
        >
          <span className="flex-1">{seminar.seminar_name}</span>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-green-600 opacity-70 transition-opacity group-hover/item:opacity-100 dark:text-green-400" />
        </a>
      ) : (
        <span className="flex-1 text-foreground/90">{seminar.seminar_name}</span>
      )}
    </li>
  )
}
