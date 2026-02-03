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
      className={`border-border/50 from-background via-background to-accent/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl md:p-12 ${className || ''}`}
    >
      {/* 배경 장식 효과 (개발자스러운 그리드 패턴) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-10">
        {/* 모바일: 세로 레이아웃, 데스크톱: 가로 레이아웃 */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* 프로필 이미지 영역 */}
          <div className="shrink-0">
            <div className="relative">
              {/* 이미지 주변 빛나는 효과 (개발자스러운 감성) */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />

              <Avatar
                size="lg"
                className="border-border/50 ring-background/50 relative size-24 border-2 shadow-xl ring-4 md:size-32"
              >
                <AvatarImage
                  src={profile.profile_image_url || undefined}
                  alt={profile.name}
                />
                <AvatarFallback className="text-foreground bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-2xl font-bold md:text-3xl">
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
                <h1 className="text-foreground text-center text-3xl font-bold tracking-tight md:text-left md:text-4xl lg:text-5xl">
                  {profile.name}
                </h1>

                {profile.mbti && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1 text-sm font-semibold backdrop-blur-sm dark:from-blue-500/20 dark:to-purple-500/20"
                  >
                    <Sparkles className="size-3.5" />
                    {profile.mbti}
                  </Badge>
                )}
              </div>

              {/* 구분선 (선택적) */}
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
            </div>

            {/* 외부 링크 버튼 영역 */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:w-auto">
              {/* Github 버튼 */}
              {profile.github_url && (
                <Button
                  variant="outline"
                  size="default"
                  asChild
                  className="group relative overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:bg-blue-500/10"
                >
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="size-4 transition-transform group-hover:scale-110" />
                    <span>Github</span>
                  </a>
                </Button>
              )}

              {/* 블로그 버튼 */}
              {profile.blog_url && (
                <Button
                  variant="outline"
                  size="default"
                  asChild
                  className="group relative overflow-hidden transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:bg-purple-500/10"
                >
                  <a
                    href={profile.blog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="size-4 transition-transform group-hover:scale-110" />
                    <span>블로그</span>
                  </a>
                </Button>
              )}

              {/* 경력기술서 버튼 */}
              {profile.career_document_url && (
                <Button
                  variant="outline"
                  size="default"
                  asChild
                  className="group relative overflow-hidden transition-all hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 dark:hover:bg-pink-500/10"
                >
                  <a
                    href={profile.career_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <FileText className="size-4 transition-transform group-hover:scale-110" />
                    <span>경력기술서</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function ProfileSectionSkeleton() {
  return (
    <section className="border-border/50 from-background via-background to-accent/5 overflow-hidden rounded-2xl border bg-gradient-to-br p-8 shadow-lg md:p-12">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
        {/* 프로필 이미지 스켈레톤 */}
        <div className="shrink-0">
          <Skeleton className="size-24 rounded-full md:size-32" />
        </div>

        {/* 텍스트 및 버튼 스켈레톤 */}
        <div className="flex flex-1 flex-col items-center gap-6 md:items-start">
          {/* 이름 및 MBTI 스켈레톤 */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-48 md:h-12 md:w-64" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-1 w-16 rounded-full" />
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 에러 상태 UI
 */
interface ProfileSectionErrorProps {
  error: string
}

function ProfileSectionError({ error }: ProfileSectionErrorProps) {
  return (
    <section className="border-destructive/30 bg-destructive/5 overflow-hidden rounded-2xl border p-8 shadow-lg md:p-12">
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
            프로필을 불러올 수 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <Button
          variant="outline"
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
 * 빈 데이터 상태 UI
 */
function ProfileSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8 shadow-lg md:p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <svg
            className="text-muted-foreground size-6"
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
          <h3 className="text-muted-foreground text-lg font-semibold">
            프로필 정보가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 프로필을 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
