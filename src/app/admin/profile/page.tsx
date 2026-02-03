'use client'

/**
 * 프로필 편집 페이지
 *
 * React Hook Form + Zod 검증을 사용한 프로필 정보 수정
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Sparkles, Save, Github, BookOpen, FileText } from 'lucide-react'

/**
 * 프로필 폼 스키마
 */
const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(100, '이름은 100자 이내여야 합니다'),
  mbti: z.string().length(4, 'MBTI는 4자리여야 합니다 (예: INTJ)').optional().or(z.literal('')),
  profile_image_url: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  github_url: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  blog_url: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  career_document_url: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  introduction: z.string().max(1000, '소개 글은 1000자 이내여야 합니다').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function AdminProfilePage() {
  const { data: profile, isLoading, error, mutate } = useProfile()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // 프로필 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        mbti: profile.mbti || '',
        profile_image_url: profile.profile_image_url || '',
        github_url: profile.github_url || '',
        blog_url: profile.blog_url || '',
        career_document_url: profile.career_document_url || '',
        introduction: profile.introduction || '',
      })
    }
  }, [profile, reset])

  // 실시간 미리보기를 위한 watch
  const watchedData = watch()

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: ProfileFormData) => {
    try {
      await apiClient.put('/profile', data)
      await mutate() // SWR 캐시 갱신
      toast.success('프로필이 성공적으로 업데이트되었습니다')
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다')
      console.error('프로필 업데이트 실패:', error)
    }
  }

  if (isLoading) {
    return (
      <>
        <AdminHeader title="프로필 편집" description="개발자 프로필 정보를 수정합니다" />
        <ProfileEditSkeleton />
      </>
    )
  }

  if (error) {
    return (
      <>
        <AdminHeader title="프로필 편집" description="개발자 프로필 정보를 수정합니다" />
        <div className="rounded-lg border border-[--color-neon-orange-600] bg-[--color-black-elevated] p-8 text-center shadow-[0_0_25px_rgba(255,107,0,0.3)]">
          <p className="text-[--color-neon-orange-500]">프로필을 불러올 수 없습니다</p>
          <p className="mt-2 font-mono text-sm text-[--color-neon-orange-600]">{error.message}</p>
        </div>
      </>
    )
  }

  // 미리보기용 initials
  const previewInitials = watchedData.name
    ?.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'UN'

  return (
    <>
      <AdminHeader
        title="프로필 편집"
        description="개발자 프로필 정보를 수정합니다"
        action={
          <Button
            type="submit"
            form="profile-form"
            variant="neon"
            size="default"
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save className="size-4" />
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 편집 폼 */}
        <div className="rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <h2 className="mb-4 text-lg font-semibold text-[--color-neon-cyan-500]">
            정보 입력
          </h2>

          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[--color-neon-cyan-600]">
                이름 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="홍길동"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.name && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* MBTI */}
            <div className="space-y-2">
              <Label htmlFor="mbti" className="text-[--color-neon-cyan-600]">
                MBTI
              </Label>
              <Input
                id="mbti"
                {...register('mbti')}
                placeholder="INTJ"
                maxLength={4}
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.mbti && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.mbti.message}
                </p>
              )}
            </div>

            {/* 프로필 이미지 URL */}
            <div className="space-y-2">
              <Label htmlFor="profile_image_url" className="text-[--color-neon-cyan-600]">
                프로필 이미지 URL
              </Label>
              <Input
                id="profile_image_url"
                {...register('profile_image_url')}
                placeholder="https://example.com/profile.jpg"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.profile_image_url && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.profile_image_url.message}
                </p>
              )}
            </div>

            {/* Github URL */}
            <div className="space-y-2">
              <Label htmlFor="github_url" className="flex items-center gap-2 text-[--color-neon-cyan-600]">
                <Github className="size-4" />
                Github URL
              </Label>
              <Input
                id="github_url"
                {...register('github_url')}
                placeholder="https://github.com/username"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.github_url && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.github_url.message}
                </p>
              )}
            </div>

            {/* 블로그 URL */}
            <div className="space-y-2">
              <Label htmlFor="blog_url" className="flex items-center gap-2 text-[--color-neon-cyan-600]">
                <BookOpen className="size-4" />
                블로그 URL
              </Label>
              <Input
                id="blog_url"
                {...register('blog_url')}
                placeholder="https://blog.example.com"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.blog_url && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.blog_url.message}
                </p>
              )}
            </div>

            {/* 경력기술서 URL */}
            <div className="space-y-2">
              <Label htmlFor="career_document_url" className="flex items-center gap-2 text-[--color-neon-cyan-600]">
                <FileText className="size-4" />
                경력기술서 URL
              </Label>
              <Input
                id="career_document_url"
                {...register('career_document_url')}
                placeholder="https://example.com/career.pdf"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.career_document_url && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.career_document_url.message}
                </p>
              )}
            </div>

            {/* 소개 글 */}
            <div className="space-y-2">
              <Label htmlFor="introduction" className="text-[--color-neon-cyan-600]">
                소개 글
              </Label>
              <Textarea
                id="introduction"
                {...register('introduction')}
                placeholder="• 공부한 내용을 정리하고, 여러 사람들과의 공유와 스스로의 이해를 위해 이를 블로그에 기록합니다.&#10;• 단순히 주어진 일을 끝내는 것이 아니라 개발, 배포에 있어 필요한 내용을 이해하기 위해 노력합니다."
                rows={8}
                className="resize-none border-[--color-neon-cyan-800] bg-[--color-black-surface] font-mono text-sm text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900]"
              />
              {errors.introduction && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.introduction.message}
                </p>
              )}
              <p className="font-mono text-xs text-[--color-neon-cyan-700]">
                Tip: 각 항목을 • 로 시작하면 네온 효과 불릿 포인트로 표시됩니다
              </p>
            </div>
          </form>
        </div>

        {/* 실시간 미리보기 */}
        <div className="rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <h2 className="mb-4 text-lg font-semibold text-[--color-neon-cyan-500]">
            미리보기
          </h2>

          <div className="space-y-6">
            {/* 프로필 이미지 */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-[--color-neon-cyan-500] opacity-30 blur-2xl" />
                <Avatar
                  size="lg"
                  className="relative size-32 border-2 border-[--color-neon-cyan-500] shadow-[0_0_20px_var(--color-neon-cyan-500)] ring-4 ring-[--color-neon-cyan-500]/20"
                >
                  <AvatarImage
                    src={watchedData.profile_image_url || undefined}
                    alt={watchedData.name || 'Profile'}
                  />
                  <AvatarFallback className="bg-[--color-black-surface] text-3xl font-bold text-[--color-neon-cyan-500]">
                    {previewInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* 이름 및 MBTI */}
            <div className="space-y-3 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <h3 className="terminal-prompt text-2xl font-bold text-[--color-neon-cyan-500] text-glow-medium">
                  {watchedData.name || '이름 없음'}
                </h3>
                {watchedData.mbti && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 border border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/10 px-3 py-1 text-sm font-semibold text-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]"
                  >
                    <Sparkles className="size-3.5" />
                    {watchedData.mbti}
                  </Badge>
                )}
              </div>
              <div className="mx-auto h-0.5 w-20 rounded-full bg-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]" />
            </div>

            {/* 외부 링크 버튼 */}
            <div className="flex flex-col gap-3">
              {watchedData.github_url && (
                <Button
                  variant="neon"
                  size="default"
                  className="w-full gap-2"
                  asChild
                >
                  <a href={watchedData.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="size-4" />
                    <span>Github</span>
                  </a>
                </Button>
              )}
              {watchedData.blog_url && (
                <Button
                  variant="neon"
                  size="default"
                  className="w-full gap-2"
                  asChild
                >
                  <a href={watchedData.blog_url} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="size-4" />
                    <span>블로그</span>
                  </a>
                </Button>
              )}
              {watchedData.career_document_url && (
                <Button
                  variant="neon"
                  size="default"
                  className="w-full gap-2"
                  asChild
                >
                  <a href={watchedData.career_document_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="size-4" />
                    <span>경력기술서</span>
                  </a>
                </Button>
              )}
            </div>

            {/* 소개 글 미리보기 */}
            {watchedData.introduction && (
              <div className="mt-4">
                <div className="rounded-lg border border-[--color-neon-cyan-700]/50 bg-[--color-black-surface]/50 p-4 backdrop-blur-sm">
                  <div className="space-y-2 text-sm leading-relaxed text-[--color-text-secondary]">
                    {watchedData.introduction.split('\n').map((line, index) => (
                      <p key={index} className="flex items-start gap-2">
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
      </div>
    </>
  )
}

/**
 * 로딩 스켈레톤
 */
function ProfileEditSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-6">
        <Skeleton className="mb-4 h-6 w-24 bg-[--color-black-surface]" />
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32 bg-[--color-black-surface]" />
              <Skeleton className="h-10 w-full bg-[--color-black-surface]" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-6">
        <Skeleton className="mb-4 h-6 w-24 bg-[--color-black-surface]" />
        <div className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="size-32 rounded-full bg-[--color-black-surface]" />
          </div>
          <div className="space-y-3">
            <Skeleton className="mx-auto h-8 w-48 bg-[--color-black-surface]" />
            <Skeleton className="mx-auto h-0.5 w-20 bg-[--color-black-surface]" />
          </div>
        </div>
      </div>
    </div>
  )
}
