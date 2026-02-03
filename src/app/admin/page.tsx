'use client'

/**
 * 관리자 대시보드
 *
 * 포트폴리오 데이터 통계 및 최근 수정 항목 표시
 */

import Link from 'next/link'
import { AdminHeader } from '@/components/admin/admin-header'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  useProfile,
  useTimeline,
  useEducation,
  useSkills,
  usePeerReviews,
  useProjects,
  useAwards,
  useInternships,
  useResearch,
  useVolunteer,
  useActivities,
} from '@/lib/hooks/use-portfolio-data'
import {
  User,
  Clock,
  GraduationCap,
  Code2,
  Users,
  FolderKanban,
  Award,
  Briefcase,
  FlaskConical,
  Heart,
  Sparkles,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * 통계 카드 Props
 */
interface StatCardProps {
  title: string
  count: number | string
  icon: LucideIcon
  href: string
  isLoading?: boolean
}

/**
 * 통계 카드 컴포넌트
 */
function StatCard({ title, count, icon: Icon, href, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="size-12 rounded-lg bg-[--color-black-surface]" />
          <Skeleton className="h-8 w-16 bg-[--color-black-surface]" />
        </div>
        <Skeleton className="mt-4 h-5 w-24 bg-[--color-black-surface]" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-6 shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all hover:border-[--color-neon-cyan-500] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
    >
      {/* 호버 글로우 효과 */}
      <div className="absolute inset-0 -z-10 bg-[--color-neon-cyan-500] opacity-0 blur-xl transition-opacity group-hover:opacity-10" />

      <div className="flex items-center justify-between">
        {/* 아이콘 */}
        <div className="flex size-12 items-center justify-center rounded-lg border border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/20 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group-hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]">
          <Icon className="size-6 text-[--color-neon-cyan-500]" />
        </div>

        {/* 카운트 */}
        <div className="terminal-prompt text-3xl font-bold text-[--color-neon-cyan-500] text-glow-subtle">
          {count}
        </div>
      </div>

      {/* 타이틀 */}
      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-semibold text-[--color-neon-cyan-600] group-hover:text-[--color-neon-cyan-500]">
          {title}
        </h3>
        <ArrowRight className="size-4 text-[--color-neon-cyan-700] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
    </Link>
  )
}

export default function AdminDashboardPage() {
  // 모든 데이터 훅
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: timeline, isLoading: timelineLoading } = useTimeline()
  const { data: education, isLoading: educationLoading } = useEducation()
  const { data: skills, isLoading: skillsLoading } = useSkills()
  const { data: peerReviews, isLoading: peerReviewsLoading } = usePeerReviews()
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: awards, isLoading: awardsLoading } = useAwards()
  const { data: internships, isLoading: internshipsLoading } = useInternships()
  const { data: research, isLoading: researchLoading } = useResearch()
  const { data: volunteer, isLoading: volunteerLoading } = useVolunteer()
  const { data: activities, isLoading: activitiesLoading } = useActivities()

  // 통계 데이터 계산
  const stats = [
    {
      title: '프로필',
      count: profile ? 1 : 0,
      icon: User,
      href: '/admin/profile',
      isLoading: profileLoading,
    },
    {
      title: '타임라인',
      count: timeline?.length || 0,
      icon: Clock,
      href: '/admin/timeline',
      isLoading: timelineLoading,
    },
    {
      title: '교육',
      count: education?.length || 0,
      icon: GraduationCap,
      href: '/admin/education',
      isLoading: educationLoading,
    },
    {
      title: '기술스택',
      count: skills?.length || 0,
      icon: Code2,
      href: '/admin/skills',
      isLoading: skillsLoading,
    },
    {
      title: '동료평가',
      count: peerReviews?.length || 0,
      icon: Users,
      href: '/admin/peer-reviews',
      isLoading: peerReviewsLoading,
    },
    {
      title: '프로젝트',
      count: projects?.length || 0,
      icon: FolderKanban,
      href: '/admin/projects',
      isLoading: projectsLoading,
    },
    {
      title: '수상',
      count: awards?.length || 0,
      icon: Award,
      href: '/admin/awards',
      isLoading: awardsLoading,
    },
    {
      title: '인턴십',
      count: internships?.length || 0,
      icon: Briefcase,
      href: '/admin/internships',
      isLoading: internshipsLoading,
    },
    {
      title: '연구활동',
      count: research?.length || 0,
      icon: FlaskConical,
      href: '/admin/research',
      isLoading: researchLoading,
    },
    {
      title: '봉사활동',
      count: volunteer?.length || 0,
      icon: Heart,
      href: '/admin/volunteer',
      isLoading: volunteerLoading,
    },
    {
      title: '대외활동',
      count: activities?.length || 0,
      icon: Sparkles,
      href: '/admin/activities',
      isLoading: activitiesLoading,
    },
  ]

  // 총 항목 수 계산
  const totalItems = stats.reduce((sum, stat) => {
    return sum + (typeof stat.count === 'number' ? stat.count : 0)
  }, 0)

  return (
    <>
      <AdminHeader
        title="대시보드"
        description="포트폴리오 데이터 현황을 확인합니다"
      />

      {/* 전체 통계 요약 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 총 데이터 항목 */}
        <div className="rounded-lg border border-[--color-neon-cyan-600] bg-gradient-to-br from-[--color-neon-cyan-500]/20 to-[--color-black-elevated] p-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border-2 border-[--color-neon-cyan-500] bg-[--color-neon-cyan-500]/20 shadow-[0_0_20px_var(--color-neon-cyan-500)]">
              <TrendingUp className="size-6 text-[--color-neon-cyan-500]" />
            </div>
            <div>
              <p className="font-mono text-sm text-[--color-neon-cyan-600]">총 데이터</p>
              <p className="terminal-prompt text-3xl font-bold text-[--color-neon-cyan-500] text-glow-medium">
                {totalItems}
              </p>
            </div>
          </div>
        </div>

        {/* 프로필 상태 */}
        <div className="rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-6 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/10">
              <User className="size-6 text-[--color-neon-cyan-500]" />
            </div>
            <div>
              <p className="font-mono text-sm text-[--color-neon-cyan-600]">프로필</p>
              <p className="text-lg font-semibold text-[--color-neon-cyan-500]">
                {profile ? '설정됨' : '미설정'}
              </p>
            </div>
          </div>
        </div>

        {/* 최근 업데이트 */}
        <div className="rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-6 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/10">
              <Calendar className="size-6 text-[--color-neon-cyan-500]" />
            </div>
            <div>
              <p className="font-mono text-sm text-[--color-neon-cyan-600]">최근 업데이트</p>
              <p className="text-lg font-semibold text-[--color-neon-cyan-500]">
                {new Date().toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 섹션별 통계 카드 */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-[--color-neon-cyan-500]">
          섹션별 데이터 현황
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      {/* 빠른 작업 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[--color-neon-cyan-500]">
          빠른 작업
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="neon"
            size="lg"
            asChild
            className="h-auto flex-col gap-2 py-4"
          >
            <Link href="/admin/profile">
              <User className="size-6" />
              <span>프로필 편집</span>
            </Link>
          </Button>
          <Button
            variant="neon"
            size="lg"
            asChild
            className="h-auto flex-col gap-2 py-4"
          >
            <Link href="/admin/timeline">
              <Clock className="size-6" />
              <span>타임라인 관리</span>
            </Link>
          </Button>
          <Button
            variant="neon"
            size="lg"
            asChild
            className="h-auto flex-col gap-2 py-4"
          >
            <Link href="/admin/settings">
              <Sparkles className="size-6" />
              <span>섹션 설정</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-auto flex-col gap-2 border-[--color-neon-cyan-700] bg-[--color-black-elevated] py-4 text-[--color-neon-cyan-500] hover:border-[--color-neon-cyan-600] hover:bg-[--color-neon-cyan-500]/10"
          >
            <Link href="/" target="_blank">
              <TrendingUp className="size-6" />
              <span>공개 페이지 보기</span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
