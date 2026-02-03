/**
 * 메인 포트폴리오 페이지 - 사이버펑크/네온 풀스크린 레이아웃
 *
 * 각 섹션이 100vh로 구성되며, 스크롤 스냅으로 부드러운 전환 제공
 */

import { Metadata } from 'next'
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
import { VolunteerSection } from '@/components/sections/volunteer'
import { ActivitiesSection } from '@/components/sections/activities'

export const metadata: Metadata = {
  title: '사이버펑크 포트폴리오 | Cyberpunk Developer',
  description:
    '사이버펑크 스타일의 개발자 포트폴리오. 경력, 기술 역량, 프로젝트를 네온 효과와 함께 소개합니다.',
  openGraph: {
    title: '사이버펑크 포트폴리오',
    description: '네온이 빛나는 개발자의 세계',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      {/* 섹션 네비게이션 인디케이터 - 화면 오른쪽 고정 */}
      <SectionNavigationIndicator />

      {/* 풀스크린 섹션 컨테이너 */}
      <main className="relative">
        {/* 1. 프로필 섹션 (Hero) */}
        <section
          id="profile"
          className="section-fullscreen"
          data-section="profile"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full">
            <ProfileSection />
          </div>
        </section>

        {/* 2. 타임라인 섹션 */}
        <section
          id="timeline"
          className="section-fullscreen"
          data-section="timeline"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <TimelineSection />
          </div>
        </section>

        {/* 3. 교육사항 섹션 */}
        <section
          id="education"
          className="section-fullscreen"
          data-section="education"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <EducationSection />
          </div>
        </section>

        {/* 4. 역량 섹션 */}
        <section id="skills" className="section-fullscreen" data-section="skills">
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <SkillsSection />
          </div>
        </section>

        {/* 5. 동료평가 섹션 */}
        <section
          id="peer-reviews"
          className="section-fullscreen"
          data-section="peer-reviews"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <PeerReviewsSection />
          </div>
        </section>

        {/* 6. 사이드프로젝트 섹션 */}
        <section
          id="projects"
          className="section-fullscreen"
          data-section="projects"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <ProjectsSection />
          </div>
        </section>

        {/* 7. 수상 섹션 */}
        <section id="awards" className="section-fullscreen" data-section="awards">
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <AwardsSection />
          </div>
        </section>

        {/* 8. 인턴십 섹션 */}
        <section
          id="internships"
          className="section-fullscreen"
          data-section="internships"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <InternshipsSection />
          </div>
        </section>

        {/* 9. 연구활동 섹션 */}
        <section
          id="research"
          className="section-fullscreen"
          data-section="research"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <ResearchSection />
          </div>
        </section>

        {/* 10. 봉사활동 섹션 */}
        <section
          id="volunteer"
          className="section-fullscreen"
          data-section="volunteer"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <VolunteerSection />
          </div>
        </section>

        {/* 11. 대외활동 섹션 */}
        <section
          id="activities"
          className="section-fullscreen"
          data-section="activities"
        >
          <div className="container mx-auto max-w-7xl px-4 py-12 w-full overflow-y-auto max-h-screen">
            <ActivitiesSection />
          </div>
        </section>
      </main>
    </>
  )
}
