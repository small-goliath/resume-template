/**
 * 섹션 네비게이션 인디케이터
 *
 * 화면 오른쪽에 고정되어 현재 섹션을 표시하고,
 * 클릭하면 해당 섹션으로 스크롤합니다.
 *
 * 기능:
 * - Intersection Observer로 성능 최적화된 섹션 감지
 * - 키보드 네비게이션 (ArrowUp/Down)
 * - 반응형 디자인 (모바일 하단 위치)
 * - GPU 가속 애니메이션
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'profile', label: 'Profile', icon: '◉' },
  { id: 'timeline', label: 'Timeline', icon: '◈' },
  { id: 'projects', label: 'Projects', icon: '◈' },
  { id: 'tech-seminars', label: 'Tech Seminars', icon: '◈' },
  { id: 'peer-reviews', label: 'Peer Reviews', icon: '◈' },
  { id: 'awards', label: 'Awards', icon: '◈' },
  { id: 'skills', label: 'Skills', icon: '◈' },
  { id: 'research', label: 'Research', icon: '◈' },
  { id: 'internships', label: 'Internships', icon: '◈' },
  { id: 'education', label: 'Education', icon: '◈' },
  { id: 'activities', label: 'Activities', icon: '◈' },
  { id: 'volunteer', label: 'Volunteer', icon: '◈' },
]

export function SectionNavigationIndicator() {
  const [activeSection, setActiveSection] = useState<string>('profile')
  const [isMobile, setIsMobile] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer로 섹션 감지 (성능 최적화)
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // 화면 중앙 기준
      threshold: 0,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      // 가장 많이 보이는 섹션 찾기
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        // intersectionRatio가 가장 높은 섹션 선택
        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        )
        const sectionId = mostVisible.target.id
        if (sectionId) {
          setActiveSection(sectionId)
        }
      }
    }, observerOptions)

    // 모든 섹션 관찰 시작
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // 반응형 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 섹션으로 스크롤
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // 키보드 네비게이션 (ArrowUp/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sections.findIndex((s) => s.id === activeSection)

      if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault()
        scrollToSection(sections[currentIndex + 1].id)
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        scrollToSection(sections[currentIndex - 1].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection, scrollToSection])

  return (
    <nav
      className={cn(
        'fixed z-50 flex gap-3',
        // 데스크톱: 오른쪽 중앙
        'right-4 top-1/2 -translate-y-1/2 flex-col md:right-8',
        // 모바일: 하단 중앙
        'max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-auto max-md:translate-y-0 max-md:flex-row',
        // GPU 가속
        'will-change-transform'
      )}
      aria-label="섹션 네비게이션"
      role="navigation"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'group relative flex items-center justify-end transition-all duration-300',
              'hover:pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-cyan-500] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-black-base]',
              'max-md:hover:pr-0 max-md:hover:pb-2',
              // GPU 가속
              'will-change-transform'
            )}
            aria-label={`${section.label} 섹션으로 이동`}
            aria-current={isActive ? 'location' : undefined}
            tabIndex={0}
          >
            {/* 라벨 - 호버 시 표시 (데스크톱만) */}
            <span
              className={cn(
                'absolute whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-mono uppercase tracking-wider',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                'bg-[--color-black-elevated] border text-[--color-neon-cyan-500]',
                // 데스크톱: 왼쪽
                'right-full mr-4',
                // 모바일: 위쪽
                'max-md:right-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:bottom-full max-md:mb-2 max-md:mr-0',
                isActive
                  ? 'border-[--color-neon-cyan-500] shadow-[0_0_15px_var(--color-neon-cyan-500)]'
                  : 'border-[--color-neon-cyan-800]',
                // 모바일에서 숨김
                'max-md:hidden'
              )}
            >
              {section.label}
            </span>

            {/* 인디케이터 점 */}
            <span
              className={cn(
                'flex items-center justify-center w-3 h-3 rounded-full transition-all duration-300',
                'border-2',
                isActive
                  ? 'w-4 h-4 border-[--color-neon-cyan-500] bg-[--color-neon-cyan-500] shadow-[0_0_15px_var(--color-neon-cyan-500),0_0_30px_var(--color-neon-cyan-500)]'
                  : 'border-[--color-neon-cyan-800] bg-transparent group-hover:border-[--color-neon-cyan-600] group-hover:shadow-[0_0_10px_var(--color-neon-cyan-600)]',
                // GPU 가속으로 글로우 최적화
                'will-change-[box-shadow]'
              )}
            >
              {/* 내부 점 */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-black-base] animate-glow-pulse" />
              )}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
