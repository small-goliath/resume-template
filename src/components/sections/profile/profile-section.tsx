'use client'

/**
 * 프로필 섹션 컴포넌트
 *
 * 개발자 포트폴리오의 프로필 영역을 표시하는 현대적인 UI 컴포넌트
 * - 성명 (h1)
 * - MBTI Badge
 * - 프로필 이미지 (Avatar)
 * - 외부 링크 버튼 (Github, Blog, 경력기술서)
 * - 로딩 상태용 Skeleton UI
 * - 반응형 디자인 (모바일/데스크톱)
 */

import { Github, BookOpen, FileText, Sparkles } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/hooks/use-portfolio-data'
import { DailyRoutineClock } from '@/components/daily-routine-clock/daily-routine-clock'
import type { Profile } from '@/types'

/**
 * 프로필 섹션 Props 인터페이스
 */
interface ProfileSectionProps {
  className?: string
}

/**
 * 프로필 섹션 메인 컴포넌트
 */
export function ProfileSection({ className }: ProfileSectionProps) {
  const { data: profile, isLoading, error } = useProfile()

  if (isLoading) {
    return <ProfileSectionSkeleton />
  }

  if (error) {
    return <ProfileSectionError error={error.message} />
  }

  if (!profile) {
    return <ProfileSectionEmpty />
  }

  return <ProfileSectionContent profile={profile} className={className} />
}

/**
 * 프로필 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface ProfileSectionContentProps {
  profile: Profile
  className?: string
}

function ProfileSectionContent({
  profile,
  className,
}: ProfileSectionContentProps) {
  // 이름에서 첫 글자 추출 (Avatar Fallback용)
  const initials = profile.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <section
      className={`relative overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-8 shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-sm transition-all hover:border-[--color-neon-cyan-500] hover:shadow-[0_0_50px_rgba(0,240,255,0.3)] md:p-12 ${className || ''}`}
    >
      {/* 사이버펑크 그리드 배경 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 네온 글로우 테두리 효과 */}
      <div className="absolute -inset-px rounded-lg bg-[--color-neon-cyan-500] opacity-20 blur-xl" />

      {/* 컨텐츠 영역 */}
      <div className="relative z-10">
        {/* 모바일: 세로 레이아웃, 데스크톱: 가로 레이아웃 */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* 프로필 이미지 영역 */}
          <div className="shrink-0">
            <div className="relative">
              {/* 네온 글로우 효과 */}
              <div className="absolute -inset-2 rounded-full bg-[--color-neon-cyan-500] opacity-30 blur-2xl" />

              <Avatar className="relative size-20 border-2 border-[--color-neon-cyan-500] shadow-[0_0_20px_var(--color-neon-cyan-500)] ring-4 ring-[--color-neon-cyan-500]/20 md:size-24">
                <AvatarImage
                  src={profile.profile_image_url || undefined}
                  alt={profile.name}
                />
                <AvatarFallback className="bg-[--color-black-surface] text-[--color-neon-cyan-500] text-2xl font-bold md:text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* 텍스트 및 버튼 영역 */}
          <div className="flex flex-1 flex-col items-center gap-6 md:items-start">
            {/* 이름 및 MBTI */}
            <div className="flex flex-col items-center gap-3 md:items-start">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <h1 className="terminal-prompt text-center text-3xl font-bold tracking-tight text-[--color-neon-cyan-500] text-glow-medium md:text-left md:text-4xl lg:text-5xl">
                  {profile.name}
                </h1>

                {profile.mbti && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 border border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/10 px-3 py-1 text-sm font-semibold text-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]"
                  >
                    <Sparkles className="size-3.5" />
                    {profile.mbti}
                  </Badge>
                )}
              </div>

              {/* 네온 구분선 */}
              <div className="h-0.5 w-20 rounded-full bg-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]" />
            </div>

            {/* 외부 링크 버튼 영역 */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:w-auto">
              {/* Github 버튼 */}
              {profile.github_url && (
                <Button
                  variant="neon"
                  size="default"
                  asChild
                >
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="size-4" />
                    <span>Github</span>
                  </a>
                </Button>
              )}

              {/* 블로그 버튼 */}
              {profile.blog_url && (
                <Button
                  variant="neon"
                  size="default"
                  asChild
                >
                  <a
                    href={profile.blog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="size-4" />
                    <span>블로그</span>
                  </a>
                </Button>
              )}

              {/* 경력기술서 버튼 */}
              {profile.career_document_url && (
                <Button
                  variant="neon"
                  size="default"
                  asChild
                >
                  <a
                    href={profile.career_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <FileText className="size-4" />
                    <span>경력기술서</span>
                  </a>
                </Button>
              )}
            </div>

            {/* 소개 글 영역 */}
            {profile.introduction && (
              <div className="mt-4 w-full">
                <div className="rounded-lg border border-[--color-neon-cyan-700]/50 bg-[--color-black-surface]/50 p-4 backdrop-blur-sm md:p-6">
                  <div className="space-y-2 text-sm leading-relaxed text-[--color-text-secondary] md:text-base">
                    {profile.introduction.split('\n').map((line, index) => (
                      <p
                        key={index}
                        className="flex items-start gap-2 transition-colors hover:text-[--color-neon-cyan-400]"
                      >
                        {line.trim().startsWith('•') ? (
                          <>
                            <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-[--color-neon-cyan-500] shadow-[0_0_5px_var(--color-neon-cyan-500)]" />
                            <span className="flex-1">{line.trim().substring(1).trim()}</span>
                          </>
                        ) : (
                          <span className="flex-1">{line}</span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 24시간 루틴 시계 섹션 */}
        <div className="mt-8 border-t border-[--color-neon-cyan-800] pt-8">
          <div className="space-y-6">
            {/* 섹션 제목 */}
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-[--color-neon-cyan-500] text-glow-medium">
                📅 일일 루틴
              </h3>
            </div>

            {/* 시계 컴포넌트 */}
            <div className="flex justify-center">
              <DailyRoutineClock />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 로딩 상태 Skeleton UI - 사이버펑크 스타일
 */
function ProfileSectionSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-8 shadow-[0_0_20px_rgba(0,240,255,0.1)] md:p-12">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
        {/* 프로필 이미지 스켈레톤 */}
        <div className="shrink-0">
          <Skeleton className="size-20 rounded-full border-2 border-[--color-neon-cyan-700] bg-[--color-black-surface] md:size-24" />
        </div>

        {/* 텍스트 및 버튼 스켈레톤 */}
        <div className="flex flex-1 flex-col items-center gap-6 md:items-start">
          {/* 이름 및 MBTI 스켈레톤 */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-48 bg-[--color-black-surface] md:h-12 md:w-64" />
              <Skeleton className="h-7 w-16 rounded-full bg-[--color-black-surface]" />
            </div>
            <Skeleton className="h-0.5 w-20 rounded-full bg-[--color-neon-cyan-800]" />
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28 border border-[--color-neon-cyan-800] bg-[--color-black-surface]" />
            <Skeleton className="h-9 w-28 border border-[--color-neon-cyan-800] bg-[--color-black-surface]" />
            <Skeleton className="h-9 w-32 border border-[--color-neon-cyan-800] bg-[--color-black-surface]" />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 에러 상태 UI - 사이버펑크 스타일
 */
interface ProfileSectionErrorProps {
  error: string
}

function ProfileSectionError({ error }: ProfileSectionErrorProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[--color-neon-orange-600] bg-[--color-black-elevated] p-8 shadow-[0_0_25px_rgba(255,107,0,0.3)] md:p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full border-2 border-[--color-neon-orange-500] bg-[--color-neon-orange-500]/10 p-3 shadow-[0_0_15px_var(--color-neon-orange-500)]">
          <svg
            className="size-6 text-[--color-neon-orange-500]"
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
          <h3 className="text-lg font-semibold text-[--color-neon-orange-500] text-glow-subtle">
            프로필을 불러올 수 없습니다
          </h3>
          <p className="font-mono text-sm text-[--color-neon-orange-600]">{error}</p>
        </div>
        <Button
          variant="neon"
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          다시 시도
        </Button>
      </div>
    </section>
  )
}

/**
 * 빈 데이터 상태 UI - 사이버펑크 스타일
 */
function ProfileSectionEmpty() {
  return (
    <section className="overflow-hidden rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-8 shadow-[0_0_15px_rgba(0,240,255,0.1)] md:p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full border-2 border-[--color-neon-cyan-600] bg-[--color-black-surface] p-3">
          <svg
            className="size-6 text-[--color-neon-cyan-600]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[--color-neon-cyan-600]">
            프로필 정보가 없습니다
          </h3>
          <p className="font-mono text-sm text-[--color-neon-cyan-700]">
            관리자 페이지에서 프로필을 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
