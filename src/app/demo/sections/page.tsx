/**
 * 섹션 네비게이션 데모 페이지
 *
 * 컴포넌트 시각적 테스트 및 개발용 페이지
 * 실제 배포 시에는 제거하거나 /admin 경로로 이동 필요
 */

import { Metadata } from 'next'
import { SectionNavigationExample } from '@/components/sections/section-navigation-example'

export const metadata: Metadata = {
  title: '섹션 네비게이션 데모 | Portfolio',
  description: '섹션 네비게이션 컴포넌트 시각적 테스트 페이지',
}

export default function SectionsDemo() {
  return (
    <div className="bg-background min-h-screen">
      {/* 데모 헤더 */}
      <header className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">섹션 네비게이션 데모</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                포트폴리오 섹션 UI 컴포넌트 미리보기
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                🎨 UI Demo
              </span>
              <span className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="py-8">
        <SectionNavigationExample />
      </main>

      {/* 데모 푸터 */}
      <footer className="bg-card/30 border-t py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* 컴포넌트 정보 */}
            <div>
              <h3 className="mb-3 font-semibold">컴포넌트</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• SectionNavigation</li>
                <li>• SectionContent</li>
                <li>• SimpleSectionContent</li>
                <li>• LoadingSectionContent</li>
                <li>• ErrorSectionContent</li>
                <li>• EmptySectionContent</li>
              </ul>
            </div>

            {/* 기능 */}
            <div>
              <h3 className="mb-3 font-semibold">주요 기능</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✅ 반응형 그리드/스크롤 레이아웃</li>
                <li>✅ 11개 섹션 탭 네비게이션</li>
                <li>✅ 아이콘 + 텍스트 조합</li>
                <li>✅ 부드러운 애니메이션</li>
                <li>✅ 다크모드 지원</li>
                <li>✅ 접근성 준수</li>
              </ul>
            </div>

            {/* 기술 스택 */}
            <div>
              <h3 className="mb-3 font-semibold">기술 스택</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• Next.js 16 App Router</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• TailwindCSS v4</li>
                <li>• shadcn/ui (new-york)</li>
                <li>• Radix UI Primitives</li>
              </ul>
            </div>
          </div>

          <div className="text-muted-foreground mt-6 border-t pt-6 text-center text-sm">
            <p>
              이 페이지는 개발 및 테스트용입니다. 프로덕션 배포 시 제거하거나
              /admin 경로로 이동하세요.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
