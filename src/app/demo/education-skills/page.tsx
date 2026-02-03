'use client'

import { EducationSection, SkillsSection } from '@/components/sections'

/**
 * 교육사항 및 역량 섹션 데모 페이지
 *
 * 컴포넌트 미리보기 및 테스트용
 */
export default function EducationSkillsDemo() {
  return (
    <div className="bg-background min-h-screen">
      {/* 페이지 헤더 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-2 text-4xl font-bold">
            교육사항 및 역량 섹션 데모
          </h1>
          <p className="text-muted-foreground">
            Education & Skills Sections Component Preview
          </p>
        </div>
      </header>

      {/* 교육사항 섹션 */}
      <EducationSection />

      {/* 역량 섹션 */}
      <SkillsSection />

      {/* 푸터 */}
      <footer className="border-t py-8">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
          <p>API가 아직 구현되지 않아 빈 상태로 표시됩니다.</p>
          <p className="mt-2">
            FastAPI에 /api/education, /api/skills 엔드포인트 구현 후 데이터가
            표시됩니다.
          </p>
        </div>
      </footer>
    </div>
  )
}
