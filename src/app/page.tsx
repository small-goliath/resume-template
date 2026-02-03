/**
 * 메인 포트폴리오 페이지
 *
 * ProfileSection을 최상단에 배치하고,
 * SectionNavigation으로 11개 섹션을 탭 형태로 구성
 */

import { Metadata } from 'next'
import { SectionNavigation } from '@/components/sections/section-navigation'
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
import { SimpleSectionContent } from '@/components/sections/section-content'

export const metadata: Metadata = {
  title: '개발자 포트폴리오',
  description:
    '개발자 경력, 교육, 기술 역량, 프로젝트, 수상, 연구활동 등을 소개하는 포트폴리오입니다.',
  openGraph: {
    title: '개발자 포트폴리오',
    description: '개발자 경력 및 기술 역량 소개',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 프로필 섹션 - 최상단 고정 */}
      <section className="border-b">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <ProfileSection />
        </div>
      </section>

      {/* 섹션 네비게이션 - 11개 섹션 */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionNavigation defaultSection="timeline">
            {/* 1. 타임라인 섹션 */}
            <SimpleSectionContent value="timeline">
              <TimelineSection />
            </SimpleSectionContent>

            {/* 2. 교육사항 섹션 */}
            <SimpleSectionContent value="education">
              <EducationSection />
            </SimpleSectionContent>

            {/* 3. 역량 섹션 */}
            <SimpleSectionContent value="skills">
              <SkillsSection />
            </SimpleSectionContent>

            {/* 4. 동료평가 섹션 */}
            <SimpleSectionContent value="peer-reviews">
              <PeerReviewsSection />
            </SimpleSectionContent>

            {/* 5. 사이드프로젝트 섹션 */}
            <SimpleSectionContent value="projects">
              <ProjectsSection />
            </SimpleSectionContent>

            {/* 6. 수상 섹션 */}
            <SimpleSectionContent value="awards">
              <AwardsSection />
            </SimpleSectionContent>

            {/* 7. 인턴십 섹션 */}
            <SimpleSectionContent value="internships">
              <InternshipsSection />
            </SimpleSectionContent>

            {/* 8. 연구활동 섹션 */}
            <SimpleSectionContent value="research">
              <ResearchSection />
            </SimpleSectionContent>

            {/* 9. 봉사활동 섹션 */}
            <SimpleSectionContent value="volunteer">
              <VolunteerSection />
            </SimpleSectionContent>

            {/* 10. 대외활동 섹션 */}
            <SimpleSectionContent value="activities">
              <ActivitiesSection />
            </SimpleSectionContent>
          </SectionNavigation>
        </div>
      </section>
    </div>
  )
}
