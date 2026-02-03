/**
 * 섹션 컴포넌트 통합 export
 *
 * 포트폴리오 섹션 네비게이션 및 컨텐츠 래퍼 컴포넌트
 */

// 네비게이션 컴포넌트
export { SectionNavigation, PORTFOLIO_SECTIONS } from './section-navigation'
export type { Section } from './section-navigation'

// 컨텐츠 래퍼 컴포넌트
export {
  SectionContent,
  SimpleSectionContent,
  LoadingSectionContent,
  ErrorSectionContent,
  EmptySectionContent,
} from './section-content'

// 사용 예제 컴포넌트 (개발/문서화용)
export {
  SectionNavigationExample,
  MinimalExample,
} from './section-navigation-example'

// 프로필 섹션 컴포넌트
export { ProfileSection } from './profile'

// 타임라인 섹션 컴포넌트
export { TimelineSection } from './timeline'

// 교육사항 섹션 컴포넌트
export { EducationSection } from './education'

// 역량 섹션 컴포넌트
export { SkillsSection } from './skills'

// 동료평가 섹션 컴포넌트
export { PeerReviewsSection } from './peer-reviews'

// 사이드프로젝트 섹션 컴포넌트
export { ProjectsSection } from './projects'

// 수상 섹션 컴포넌트
export { AwardsSection } from './awards'

// 인턴십 섹션 컴포넌트
export { InternshipsSection } from './internships'

// 연구활동 섹션 컴포넌트
export { ResearchSection } from './research'

// 봉사활동 섹션 컴포넌트
export { VolunteerSection } from './volunteer'

// 대외활동 섹션 컴포넌트
export { ActivitiesSection } from './activities'
