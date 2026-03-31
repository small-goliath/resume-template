/**
 * 메인 포트폴리오 페이지 - 사이버펑크/네온 풀스크린 레이아웃
 *
 * 각 섹션이 100vh로 구성되며, 스크롤 스냅으로 부드러운 전환 제공
 * 섹션 진입 시 Glitch Slide 애니메이션 실행
 */

'use client'

import { SectionNavigationIndicator } from '@/components/section-navigation-indicator'
import { ProfileSection } from '@/components/sections/profile'
import { TimelineSection } from '@/components/sections/timeline'
import { EducationSection } from '@/components/sections/education'
import { SkillsSection } from '@/components/sections/skills'
import { PeerReviewsSection } from '@/components/sections/peer-reviews'
import { ProjectsSection } from '@/components/sections/projects'
import { AwardsSection } from '@/components/sections/awards'
import { InternshipsSection } from '@/components/sections/internships'
import { ResearchSection } from '@/components/sections/research'
import { TechSeminarsSection } from '@/components/sections/tech-seminars'
import { VolunteerSection } from '@/components/sections/volunteer'
import { ActivitiesSection } from '@/components/sections/activities'
import { useSectionAnimation } from '@/hooks/use-section-animation'

export default function HomePage() {
  // 섹션 애니메이션 활성화
  useSectionAnimation()
  return (
    <>
      {/* 섹션 네비게이션 인디케이터 - 화면 오른쪽 고정 */}
      <SectionNavigationIndicator />

      {/* 풀스크린 섹션 컨테이너 */}
      <main className="relative">
        {/* 1. 프로필 섹션 (Hero) - 즉시 표시 */}
        <section
          id="profile"
          className="section-fullscreen opacity-100"
          data-section="profile"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full">
            <ProfileSection />
          </div>
        </section>

        {/* 2. 타임라인 섹션 */}
        <section
          id="timeline"
          className="section-fullscreen opacity-0"
          data-section="timeline"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <TimelineSection />
          </div>
        </section>

        {/* 3. 사이드프로젝트 섹션 */}
        <section
          id="projects"
          className="section-fullscreen opacity-0"
          data-section="projects"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <ProjectsSection />
          </div>
        </section>

        {/* 4. 기술공유 세미나 섹션 */}
        <section
          id="tech-seminars"
          className="section-fullscreen opacity-0"
          data-section="tech-seminars"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <TechSeminarsSection />
          </div>
        </section>

        {/* 5. 동료평가 섹션 */}
        <section
          id="peer-reviews"
          className="section-fullscreen opacity-0"
          data-section="peer-reviews"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <PeerReviewsSection />
          </div>
        </section>

        {/* 6. 수상 섹션 */}
        <section id="awards" className="section-fullscreen opacity-0" data-section="awards">
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <AwardsSection />
          </div>
        </section>

        {/* 7. 역량 섹션 */}
        <section id="skills" className="section-fullscreen opacity-0" data-section="skills">
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <SkillsSection />
          </div>
        </section>

        {/* 8. 연구활동 섹션 */}
        <section
          id="research"
          className="section-fullscreen opacity-0"
          data-section="research"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <ResearchSection />
          </div>
        </section>

        {/* 9. 인턴십 섹션 */}
        <section
          id="internships"
          className="section-fullscreen opacity-0"
          data-section="internships"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <InternshipsSection />
          </div>
        </section>

        {/* 10. 교육사항 섹션 */}
        <section
          id="education"
          className="section-fullscreen opacity-0"
          data-section="education"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <EducationSection />
          </div>
        </section>

        {/* 11. 대외활동 섹션 */}
        <section
          id="activities"
          className="section-fullscreen opacity-0"
          data-section="activities"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <ActivitiesSection />
          </div>
        </section>

        {/* 12. 봉사활동 섹션 */}
        <section
          id="volunteer"
          className="section-fullscreen opacity-0"
          data-section="volunteer"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <VolunteerSection />
          </div>
        </section>
      </main>
    </>
  )
}
