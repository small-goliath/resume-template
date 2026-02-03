/**
 * 새로운 섹션 데모 페이지
 * 사이드프로젝트, 수상, 인턴십 섹션 프리뷰
 */

import {
  ProjectsSection,
  AwardsSection,
  InternshipsSection,
} from '@/components/sections'

export default function NewSectionsDemo() {
  return (
    <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          New Sections Preview
        </h1>
        <p className="text-muted-foreground text-lg">
          사이드프로젝트, 수상, 인턴십 섹션 프리뷰입니다.
        </p>
      </div>

      {/* 사이드프로젝트 섹션 */}
      <div className="rounded-2xl border bg-card p-6">
        <ProjectsSection />
      </div>

      {/* 수상 섹션 */}
      <div className="rounded-2xl border bg-card p-6">
        <AwardsSection />
      </div>

      {/* 인턴십 섹션 */}
      <div className="rounded-2xl border bg-card p-6">
        <InternshipsSection />
      </div>
    </div>
  )
}
