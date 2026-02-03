'use client'

import { Code2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSkills } from '@/lib/hooks/use-portfolio-data'
import type { Skill } from '@/types'

/**
 * 역량 섹션 컴포넌트
 *
 * 카테고리별로 기술 스택을 Badge로 표시합니다.
 * - 카테고리별 Card 구분
 * - Badge 컴포넌트로 키워드 표시
 * - 호버 효과로 인터랙티브함
 */
export function SkillsSection() {
  const { data: skills, isLoading, error } = useSkills()

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-muted-foreground text-center">
            역량 정보를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SkillsSkeleton />
        </div>
      </section>
    )
  }

  // 빈 데이터 처리
  if (!skills || skills.length === 0) {
    return null
  }

  // 카테고리별로 그룹핑
  const groupedSkills = groupSkillsByCategory(skills)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="mb-12 flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <Code2 className="text-primary h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">역량</h2>
            <p className="text-muted-foreground">Skills</p>
          </div>
        </div>

        {/* 카테고리별 기술 스택 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <SkillCategoryCard
              key={category}
              category={category}
              skills={categorySkills}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * 카테고리별 기술 카드 컴포넌트
 */
interface SkillCategoryCardProps {
  category: string
  skills: Skill[]
}

function SkillCategoryCard({ category, skills }: SkillCategoryCardProps) {
  // sort_order 기준 정렬
  const sortedSkills = [...skills].sort((a, b) => a.sort_order - b.sort_order)

  // 카테고리별 색상 매핑 (선택사항)
  const categoryColors: Record<string, string> = {
    언어: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20',
    백엔드:
      'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20',
    데이터베이스:
      'bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20',
    '클라우드 및 인프라':
      'bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20',
    메시징:
      'bg-pink-500/10 text-pink-700 dark:text-pink-400 hover:bg-pink-500/20',
    모니터링:
      'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20',
    '빌드 툴':
      'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20',
    '버전관리 및 협업':
      'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20',
  }

  const defaultColor =
    'bg-slate-500/10 text-slate-700 dark:text-slate-400 hover:bg-slate-500/20'

  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedSkills.map(skill => (
            <Badge
              key={skill.id}
              variant="secondary"
              className={`cursor-default transition-colors ${categoryColors[category] || defaultColor}`}
            >
              {skill.skill_name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 기술을 카테고리별로 그룹핑하는 유틸 함수
 */
function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = skill.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )
}

/**
 * 로딩 스켈레톤 UI
 */
function SkillsSkeleton() {
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 + (i % 3) }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
