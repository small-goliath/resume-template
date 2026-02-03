'use client'

/**
 * 연구활동 섹션 컴포넌트
 *
 * 개발자의 연구활동을 2열 그리드로 표시
 * - 2열 그리드 레이아웃 (모바일 1열)
 * - 연구명, 설명, 상세보기/문서보기 버튼
 * - useResearch() hook으로 데이터 페칭
 * - sort_order 기준 정렬
 * - 반응형 디자인
 */

import { FlaskConical, ExternalLink, FileText } from 'lucide-react'
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
import { useResearch } from '@/lib/hooks/use-portfolio-data'
import type { Research } from '@/types'

/**
 * 연구활동 섹션 Props 인터페이스
 */
interface ResearchSectionProps {
  className?: string
}

/**
 * 연구활동 섹션 메인 컴포넌트
 */
export function ResearchSection({ className }: ResearchSectionProps) {
  const { data: researchData, isLoading, error } = useResearch()

  if (isLoading) {
    return <ResearchSectionSkeleton />
  }

  if (error) {
    return <ResearchSectionError error={error.message} />
  }

  if (!researchData || researchData.length === 0) {
    return <ResearchSectionEmpty />
  }

  // sort_order 기준 정렬
  const sortedResearch = [...researchData].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return <ResearchSectionContent research={sortedResearch} className={className} />
}

/**
 * 연구활동 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface ResearchSectionContentProps {
  research: Research[]
  className?: string
}

function ResearchSectionContent({
  research,
  className,
}: ResearchSectionContentProps) {
  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-2.5 backdrop-blur-sm">
            <FlaskConical className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Research</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          연구활동 및 학술 프로젝트
        </p>
      </div>

      {/* 연구활동 그리드 (2열) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {research.map(item => (
          <ResearchCard key={item.id} research={item} />
        ))}
      </div>
    </section>
  )
}

/**
 * 연구활동 개별 카드 컴포넌트
 */
interface ResearchCardProps {
  research: Research
}

function ResearchCard({ research }: ResearchCardProps) {
  // URL이 하나라도 존재하는지 확인
  const hasLinks = research.research_url || research.document_url

  return (
    <Card
      variant="neon-border"
      className="group flex h-full flex-col transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-400/30"
    >
      <CardHeader className="space-y-3">
        {/* 연구명 */}
        <CardTitle className="flex items-start gap-2.5 text-lg">
          <div className="mt-0.5 shrink-0 rounded-md bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-1.5 backdrop-blur-sm">
            <FlaskConical className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="flex-1 leading-snug">{research.research_name}</span>
        </CardTitle>
      </CardHeader>

      {/* 설명 */}
      <CardContent className="flex-1">
        <CardDescription className="text-foreground/80 leading-relaxed whitespace-pre-line">
          {research.description}
        </CardDescription>
      </CardContent>

      {/* 버튼 영역 (URL이 있을 때만 표시) */}
      {hasLinks && (
        <CardFooter className="flex flex-wrap gap-2 pt-0">
          {/* 상세보기 버튼 (research_url이 있을 때) */}
          {research.research_url && (
            <Button
              variant="neon-ghost"
              size="sm"
              className="flex-1 gap-2 transition-all duration-300 group-hover:border-blue-500/50 group-hover:bg-blue-500/5"
              onClick={() => {
                // TODO: 외부 링크 열기 로직 구현
                window.open(research.research_url!, '_blank', 'noopener,noreferrer')
              }}
            >
              <span>상세보기</span>
              <ExternalLink className="size-3.5" />
            </Button>
          )}

          {/* 문서 보기 버튼 (document_url이 있을 때) */}
          {research.document_url && (
            <Button
              variant="neon-ghost"
              size="sm"
              className="flex-1 gap-2 transition-all duration-300 group-hover:border-blue-500/50 group-hover:bg-blue-500/5"
              onClick={() => {
                // TODO: 문서 링크 열기 로직 구현
                window.open(research.document_url!, '_blank', 'noopener,noreferrer')
              }}
            >
              <span>문서 보기</span>
              <FileText className="size-3.5" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function ResearchSectionSkeleton() {
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

      {/* 그리드 스켈레톤 (4개 카드) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4 rounded-xl border p-6">
            <div className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 size-7 shrink-0 rounded-md" />
              <Skeleton className="h-6 flex-1" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
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
interface ResearchSectionErrorProps {
  error: string
}

function ResearchSectionError({ error }: ResearchSectionErrorProps) {
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
            연구활동 정보를 불러올 수 없습니다
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
function ResearchSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <FlaskConical className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            연구활동 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 연구활동 정보를 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
