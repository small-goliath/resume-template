'use client'

/**
 * 섹션 가시성 제어 페이지
 *
 * 11개 섹션의 표시/숨김을 제어
 */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'
import { Save } from 'lucide-react'
import useSWR from 'swr'

/**
 * 섹션 가시성 타입
 */
interface SectionVisibility {
  show_education: boolean
  show_skills: boolean
  show_peer_reviews: boolean
  show_projects: boolean
  show_awards: boolean
  show_internships: boolean
  show_research: boolean
  show_volunteer: boolean
  show_activities: boolean
}

/**
 * 섹션 정보
 */
const sections = [
  { key: 'show_education', label: '교육', description: '학력 및 교육 이수 사항' },
  { key: 'show_skills', label: '기술스택', description: '기술 역량 및 사용 가능한 기술' },
  { key: 'show_peer_reviews', label: '동료평가', description: '동료평가 이미지 갤러리' },
  { key: 'show_projects', label: '프로젝트', description: '사이드 프로젝트 및 개인 프로젝트' },
  { key: 'show_awards', label: '수상', description: '수상 경력 및 인증' },
  { key: 'show_internships', label: '인턴십', description: '인턴십 경험' },
  { key: 'show_research', label: '연구활동', description: '학술 연구 및 논문' },
  { key: 'show_volunteer', label: '봉사활동', description: '자원봉사 및 사회공헌 활동' },
  { key: 'show_activities', label: '대외활동', description: '대외활동 및 동아리 활동' },
] as const

export default function AdminSettingsPage() {
  const { data, isLoading, mutate } = useSWR<SectionVisibility>(
    '/section-visibility',
    () => apiClient.get<SectionVisibility>('/section-visibility')
  )

  const [settings, setSettings] = useState<SectionVisibility>({
    show_education: true,
    show_skills: true,
    show_peer_reviews: true,
    show_projects: true,
    show_awards: true,
    show_internships: true,
    show_research: true,
    show_volunteer: true,
    show_activities: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (data) {
      setSettings(data)
    }
  }, [data])

  /**
   * 토글 핸들러
   */
  const handleToggle = (key: keyof SectionVisibility) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
    setHasChanges(true)
  }

  /**
   * 저장 핸들러
   */
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await apiClient.post('/section-visibility', settings)
      await mutate()
      toast.success('섹션 설정이 성공적으로 저장되었습니다')
      setHasChanges(false)
    } catch (error) {
      toast.error('섹션 설정 저장에 실패했습니다')
      console.error('섹션 설정 저장 실패:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="섹션 설정"
        description="포트폴리오에 표시할 섹션을 선택합니다"
        action={
          hasChanges && (
            <Button
              variant="neon"
              size="default"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="size-4" />
              {isSaving ? '저장 중...' : '변경사항 저장'}
            </Button>
          )
        }
      />

      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.key}
              className="flex items-center justify-between rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] p-6 shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all hover:border-[--color-neon-cyan-600] hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]"
            >
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={section.key}
                  className="cursor-pointer text-lg font-semibold text-[--color-neon-cyan-500]"
                >
                  {section.label}
                </Label>
                <p className="font-mono text-sm text-[--color-neon-cyan-700]">
                  {section.description}
                </p>
              </div>

              <Switch
                id={section.key}
                checked={settings[section.key]}
                onCheckedChange={() => handleToggle(section.key)}
                className="data-[state=checked]:bg-[--color-neon-cyan-500]"
              />
            </div>
          ))}

          {/* 하단 저장 버튼 (모바일용) */}
          {hasChanges && (
            <div className="sticky bottom-4 flex justify-end pt-4 sm:hidden">
              <Button
                variant="neon"
                size="default"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                <Save className="size-4" />
                {isSaving ? '저장 중...' : '변경사항 저장'}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

/**
 * 로딩 스켈레톤
 */
function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-6"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32 bg-[--color-black-surface]" />
            <Skeleton className="h-4 w-64 bg-[--color-black-surface]" />
          </div>
          <Skeleton className="size-10 rounded-full bg-[--color-black-surface]" />
        </div>
      ))}
    </div>
  )
}
