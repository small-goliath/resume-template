/**
 * 섹션 네비게이션 사용 예제
 *
 * SectionNavigation과 SectionContent를 활용한 포트폴리오 섹션 구현 예시
 */

import { SectionNavigation } from './section-navigation'
import {
  SectionContent,
  SimpleSectionContent,
  LoadingSectionContent,
  ErrorSectionContent,
  EmptySectionContent,
} from './section-content'

export function SectionNavigationExample() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <SectionNavigation defaultSection="timeline">
        {/* 타임라인 섹션 */}
        <SectionContent
          value="timeline"
          title="경력 타임라인"
          description="주요 경력 사항을 시간순으로 정리했습니다"
          variant="elevated"
        >
          <div className="space-y-4">
            {/* TODO: 타임라인 컴포넌트 추가 */}
            <p className="text-muted-foreground">타임라인 컨텐츠 영역</p>
          </div>
        </SectionContent>

        {/* 교육사항 섹션 */}
        <SectionContent
          value="education"
          title="교육사항"
          description="학력 및 수료 과정"
        >
          <div className="space-y-4">
            {/* TODO: 교육사항 리스트 추가 */}
            <p className="text-muted-foreground">교육사항 컨텐츠 영역</p>
          </div>
        </SectionContent>

        {/* 역량 섹션 - 카드 없이 순수 컨텐츠만 */}
        <SectionContent value="skills" title="기술 역량" hideCard={true}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* TODO: 스킬 카드들 추가 */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold">Frontend</h3>
              <p className="text-muted-foreground text-sm">
                React, Next.js, TypeScript
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold">Backend</h3>
              <p className="text-muted-foreground text-sm">
                Python, FastAPI, Node.js
              </p>
            </div>
          </div>
        </SectionContent>

        {/* 동료평가 섹션 - 미니멀 variant */}
        <SimpleSectionContent value="peer-reviews">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* TODO: 동료평가 이미지 그리드 추가 */}
            <div className="bg-muted aspect-video rounded-lg" />
            <div className="bg-muted aspect-video rounded-lg" />
            <div className="bg-muted aspect-video rounded-lg" />
          </div>
        </SimpleSectionContent>

        {/* 사이드프로젝트 섹션 */}
        <SectionContent
          value="projects"
          title="사이드프로젝트"
          description="개인 및 팀 프로젝트 포트폴리오"
          variant="outline"
        >
          <div className="space-y-6">
            {/* TODO: 프로젝트 카드들 추가 */}
            <p className="text-muted-foreground">프로젝트 리스트 영역</p>
          </div>
        </SectionContent>

        {/* 수상 섹션 */}
        <SectionContent
          value="awards"
          title="수상 내역"
          description="대회 및 공모전 수상 경력"
        >
          <div className="space-y-4">
            {/* TODO: 수상 리스트 추가 */}
            <p className="text-muted-foreground">수상 내역 영역</p>
          </div>
        </SectionContent>

        {/* 인턴십 섹션 - 로딩 상태 예시 */}
        <LoadingSectionContent value="internships" title="인턴십 경험" />

        {/* 연구활동 섹션 - 에러 상태 예시 */}
        <ErrorSectionContent
          value="research"
          title="연구활동"
          error="네트워크 연결을 확인해주세요"
        />

        {/* 봉사활동 섹션 - 빈 상태 예시 */}
        <EmptySectionContent
          value="volunteer"
          title="봉사활동"
          message="아직 등록된 봉사활동이 없습니다"
        />

        {/* 대외활동 섹션 */}
        <SectionContent
          value="activities"
          title="대외활동"
          description="동아리, 학회, 커뮤니티 활동"
          variant="glass"
        >
          <div className="space-y-4">
            {/* TODO: 대외활동 리스트 추가 */}
            <p className="text-muted-foreground">대외활동 리스트 영역</p>
          </div>
        </SectionContent>
      </SectionNavigation>
    </div>
  )
}

/**
 * 간단한 사용 예제 - 최소한의 코드로 섹션 네비게이션 구현
 */
export function MinimalExample() {
  return (
    <SectionNavigation>
      <SimpleSectionContent value="timeline">
        <p>타임라인 컨텐츠</p>
      </SimpleSectionContent>

      <SimpleSectionContent value="education">
        <p>교육사항 컨텐츠</p>
      </SimpleSectionContent>

      <SimpleSectionContent value="skills">
        <p>역량 컨텐츠</p>
      </SimpleSectionContent>

      {/* ... 나머지 섹션들 */}
    </SectionNavigation>
  )
}
