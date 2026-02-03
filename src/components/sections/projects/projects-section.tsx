'use client'

/**
 * 사이드프로젝트 섹션 컴포넌트
 *
 * 개발자의 사이드 프로젝트를 2열 그리드로 표시
 * - 2열 그리드 레이아웃 (모바일 1열)
 * - 프로젝트명, 상태 배지, 설명, 외부 링크
 * - useSideProjects() hook으로 데이터 페칭
 * - sort_order 기준 정렬
 * - 반응형 디자인
 */

import { Rocket, ExternalLink } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSideProjects } from '@/lib/hooks/use-portfolio-data'
import type { SideProject } from '@/types'

/**
 * 사이드프로젝트 섹션 Props 인터페이스
 */
interface ProjectsSectionProps {
  className?: string
}

/**
 * 사이드프로젝트 섹션 메인 컴포넌트
 */
export function ProjectsSection({ className }: ProjectsSectionProps) {
  const { data: projectsData, isLoading, error } = useSideProjects()

  if (isLoading) {
    return <ProjectsSectionSkeleton />
  }

  if (error) {
    return <ProjectsSectionError error={error.message} />
  }

  if (!projectsData || projectsData.length === 0) {
    return <ProjectsSectionEmpty />
  }

  // sort_order 기준 정렬
  const sortedProjects = [...projectsData].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return (
    <ProjectsSectionContent projects={sortedProjects} className={className} />
  )
}

/**
 * 사이드프로젝트 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface ProjectsSectionContentProps {
  projects: SideProject[]
  className?: string
}

function ProjectsSectionContent({
  projects,
  className,
}: ProjectsSectionContentProps) {
  return (
    <section className={`space-y-4 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2.5 backdrop-blur-sm">
            <Rocket className="size-5 text-purple-500 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Side Projects</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          개인적으로 진행한 사이드 프로젝트
        </p>
      </div>

      {/* 프로젝트 그리드 (2열) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

/**
 * 프로젝트 개별 카드 컴포넌트
 */
interface ProjectCardProps {
  project: SideProject
}

function ProjectCard({ project }: ProjectCardProps) {
  const statusVariant =
    project.status === '완료' || project.status === 'completed'
      ? 'default'
      : 'secondary'

  const statusColor =
    project.status === '완료' || project.status === 'completed'
      ? 'from-green-500/10 to-emerald-500/10 border-green-500/20 dark:border-emerald-500/20'
      : 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 dark:border-cyan-500/20'

  return (
    <Card
      variant="outline"
      className="group flex h-full flex-col transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 dark:hover:border-purple-400/30"
    >
      <CardHeader className="space-y-3">
        {/* 상태 배지 */}
        <div>
          <Badge
            variant={statusVariant}
            className={`border bg-gradient-to-r font-semibold backdrop-blur-sm ${statusColor}`}
          >
            {project.status}
          </Badge>
        </div>

        {/* 프로젝트명 */}
        <CardTitle className="flex items-start gap-2 text-lg">
          <Rocket className="mt-1 size-4 shrink-0 text-purple-500 dark:text-purple-400" />
          <span className="flex-1">{project.project_name}</span>
        </CardTitle>
      </CardHeader>

      {/* 설명 */}
      <CardContent className="flex-1">
        <CardDescription className="text-foreground/80 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardContent>

      {/* 외부 링크 버튼 */}
      {project.project_url && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 transition-all duration-300 group-hover:border-purple-500/50 group-hover:bg-purple-500/5"
            onClick={() => {
              // TODO: 외부 링크 열기 로직 구현
              window.open(project.project_url!, '_blank', 'noopener,noreferrer')
            }}
          >
            <span>프로젝트 보기</span>
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
function ProjectsSectionSkeleton() {
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

      {/* 그리드 스켈레톤 (4개 카드) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4 rounded-xl border p-6">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * 에러 상태 UI
 */
interface ProjectsSectionErrorProps {
  error: string
}

function ProjectsSectionError({ error }: ProjectsSectionErrorProps) {
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
            프로젝트를 불러올 수 없습니다
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
function ProjectsSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Rocket className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            사이드프로젝트 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 사이드프로젝트를 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
