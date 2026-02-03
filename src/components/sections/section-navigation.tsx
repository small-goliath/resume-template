'use client'

import * as React from 'react'
import {
  Calendar,
  GraduationCap,
  Code,
  Users,
  Rocket,
  Trophy,
  Building,
  FlaskConical,
  Heart,
  Target,
  type LucideIcon,
} from 'lucide-react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// 섹션 데이터 타입 정의
export interface Section {
  id: string
  label: string
  shortLabel?: string // 태블릿에서 표시될 축약 텍스트
  icon: LucideIcon
}

// 포트폴리오 섹션 데이터
export const PORTFOLIO_SECTIONS: Section[] = [
  {
    id: 'timeline',
    label: '타임라인',
    shortLabel: '타임라인',
    icon: Calendar,
  },
  {
    id: 'education',
    label: '교육사항',
    shortLabel: '교육',
    icon: GraduationCap,
  },
  {
    id: 'skills',
    label: '역량',
    shortLabel: '역량',
    icon: Code,
  },
  {
    id: 'peer-reviews',
    label: '동료평가',
    shortLabel: '동료평가',
    icon: Users,
  },
  {
    id: 'projects',
    label: '사이드프로젝트',
    shortLabel: '프로젝트',
    icon: Rocket,
  },
  {
    id: 'awards',
    label: '수상',
    shortLabel: '수상',
    icon: Trophy,
  },
  {
    id: 'internships',
    label: '인턴십',
    shortLabel: '인턴십',
    icon: Building,
  },
  {
    id: 'research',
    label: '연구활동',
    shortLabel: '연구',
    icon: FlaskConical,
  },
  {
    id: 'volunteer',
    label: '봉사활동',
    shortLabel: '봉사',
    icon: Heart,
  },
  {
    id: 'activities',
    label: '대외활동',
    shortLabel: '대외',
    icon: Target,
  },
]

// 섹션 네비게이션 Props
interface SectionNavigationProps {
  defaultSection?: string
  children: React.ReactNode
  className?: string
}

/**
 * 포트폴리오 섹션 네비게이션 컴포넌트
 *
 * 🎨 현대적이고 개발자스러운 디자인의 탭 네비게이션
 * - 💻 아이콘 중심의 미니멀한 디자인
 * - ⚡ 부드러운 호버/선택 애니메이션
 * - 📱 완벽한 반응형 레이아웃 (모바일 가로스크롤 → 데스크톱 그리드)
 * - ♿ 접근성 지원 (키보드 네비게이션, ARIA, 스크린리더)
 * - 🌙 다크모드 친화적
 */
export function SectionNavigation({
  defaultSection = 'timeline',
  children,
  className,
}: SectionNavigationProps) {
  return (
    <Tabs defaultValue={defaultSection} className={cn('w-full', className)}>
      {/* 섹션 탭 네비게이션 - 반응형 스크롤/그리드 */}
      <div className="relative mb-8">
        {/* 모바일: 가로 스크롤 컨테이너 */}
        <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList
            variant="line"
            className={cn(
              // 기본 레이아웃
              'h-auto w-full justify-start gap-2 overflow-x-auto px-0 pb-3',
              // 스크롤바 스타일링
              'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-border/80',
              // 모바일: flex 가로스크롤
              'flex flex-nowrap md:flex-wrap',
              // 데스크톱: 그리드 레이아웃
              'lg:grid lg:grid-cols-5 xl:grid-cols-10'
            )}
          >
            {PORTFOLIO_SECTIONS.map(section => {
              const Icon = section.icon
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className={cn(
                    // 기본 스타일 - 개발자스러운 카드 디자인
                    'group relative flex min-w-[4.5rem] flex-shrink-0 flex-col items-center gap-2 rounded-lg',
                    'border-border/40 bg-card/50 border px-3 py-3 backdrop-blur-sm',
                    'transition-all duration-200 ease-in-out',
                    // 호버 효과
                    'hover:border-primary/30 hover:bg-accent/50 hover:shadow-md',
                    'dark:hover:border-primary/20 dark:hover:bg-accent/20',
                    // 선택 상태 - 강조 효과
                    'data-[state=active]:border-primary/60 data-[state=active]:bg-primary/10',
                    'data-[state=active]:shadow-primary/5 data-[state=active]:shadow-lg',
                    'dark:data-[state=active]:border-primary/40 dark:data-[state=active]:bg-primary/5',
                    // 포커스 스타일
                    'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    'dark:focus-visible:ring-offset-background',
                    // 데스크톱: 너비 확장
                    'md:min-w-[5.5rem] lg:min-w-0'
                  )}
                >
                  {/* 아이콘 - 애니메이션 효과 */}
                  <Icon
                    className={cn(
                      'text-muted-foreground h-5 w-5 shrink-0 transition-all duration-200',
                      'group-hover:text-foreground group-hover:scale-110',
                      'group-data-[state=active]:text-primary group-data-[state=active]:scale-110',
                      'sm:h-6 sm:w-6'
                    )}
                    aria-hidden="true"
                  />

                  {/* 텍스트 레이블 - 반응형 표시 */}
                  {/* 모바일: 숨김 */}
                  <span
                    className={cn(
                      'text-muted-foreground hidden text-center text-xs leading-tight font-medium',
                      'transition-colors duration-200',
                      'group-hover:text-foreground',
                      'group-data-[state=active]:text-foreground group-data-[state=active]:font-semibold',
                      // 태블릿: 축약 텍스트 표시
                      'md:block',
                      // 데스크톱: 전체 텍스트 표시
                      'xl:max-w-[8rem]'
                    )}
                  >
                    <span className="md:inline xl:hidden">
                      {section.shortLabel}
                    </span>
                    <span className="hidden xl:inline">{section.label}</span>
                  </span>

                  {/* 스크린 리더용 텍스트 (모바일 아이콘만 표시 시) */}
                  <span className="sr-only md:not-sr-only">
                    {section.label}
                  </span>

                  {/* 선택 인디케이터 - 하단 강조선 */}
                  <span
                    className={cn(
                      'bg-primary absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full transition-all duration-200',
                      'group-data-[state=active]:w-2/3'
                    )}
                    aria-hidden="true"
                  />
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* 가로 스크롤 힌트 - 그라디언트 오버레이 (모바일/태블릿) */}
        <div
          className="from-background pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l to-transparent md:w-16 lg:hidden"
          aria-hidden="true"
        />
      </div>

      {/* 섹션 컨텐츠 영역 */}
      {children}
    </Tabs>
  )
}
