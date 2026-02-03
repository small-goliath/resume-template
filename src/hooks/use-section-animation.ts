'use client'

import { useEffect, useRef } from 'react'

/**
 * 섹션 진입 애니메이션 훅
 *
 * Intersection Observer로 섹션 진입을 감지하고
 * .section-enter 클래스를 추가하여 애니메이션 실행
 */
export function useSectionAnimation() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const animatedSections = useRef<Set<string>>(new Set())

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // 50% 보일 때 트리거 (애니메이션이 확실히 보이도록)
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id

        // 섹션이 화면에 진입하고(50% 이상), 아직 애니메이션이 실행되지 않았을 때
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.5 && // 50% 이상 보일 때만
          !animatedSections.current.has(sectionId) &&
          sectionId !== 'profile' // 첫 섹션은 즉시 표시
        ) {
          // opacity-0 제거 후 애니메이션 클래스 추가
          entry.target.classList.remove('opacity-0')
          entry.target.classList.add('section-enter')

          // 애니메이션 완료 후 최적화
          const animationDuration = 800 // 0.8초 (부드러운 페이드 슬라이드)
          setTimeout(() => {
            entry.target.classList.remove('section-enter')
            entry.target.classList.add('section-enter-done')
          }, animationDuration)

          // 중복 실행 방지
          animatedSections.current.add(sectionId)
        }
      })
    }, observerOptions)

    // 모든 섹션 관찰 시작
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
}
