'use client'

/**
 * 연구활동, 봉사활동, 대외활동 섹션 데모 페이지
 *
 * 새로 구현된 세 개의 섹션을 시각적으로 확인하기 위한 데모 페이지
 */

import {
  ResearchSection,
  VolunteerSection,
  ActivitiesSection,
} from '@/components/sections'

export default function ResearchVolunteerActivitiesDemo() {
  return (
    <main className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          연구활동 / 봉사활동 / 대외활동 섹션
        </h1>
        <p className="text-muted-foreground text-lg">
          새로 구현된 세 개의 섹션을 확인하세요.
        </p>
      </div>

      {/* 구분선 */}
      <div className="border-border border-t" />

      {/* 연구활동 섹션 */}
      <div className="space-y-4">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Research Section (2열 그리드)
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">
            연구명, 설명, URL/문서 버튼 (선택적)
          </p>
        </div>
        <ResearchSection />
      </div>

      {/* 구분선 */}
      <div className="border-border border-t" />

      {/* 봉사활동 섹션 */}
      <div className="space-y-4">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">
            Volunteer Section (세로 리스트)
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">
            기관명, 설명 (빨간색 하트 아이콘)
          </p>
        </div>
        <VolunteerSection />
      </div>

      {/* 구분선 */}
      <div className="border-border border-t" />

      {/* 대외활동 섹션 */}
      <div className="space-y-4">
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <h2 className="text-sm font-semibold text-green-600 dark:text-green-400">
            External Activities Section (세로 리스트)
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">
            기관명, 설명 (초록색 타겟 아이콘)
          </p>
        </div>
        <ActivitiesSection />
      </div>
    </main>
  )
}
