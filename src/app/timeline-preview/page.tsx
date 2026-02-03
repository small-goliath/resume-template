/**
 * 타임라인 섹션 프리뷰 페이지
 *
 * 개발용 프리뷰 페이지로 타임라인 컴포넌트를 독립적으로 테스트할 수 있습니다.
 * http://localhost:3000/timeline-preview 접속
 */

import { TimelineSection } from '@/components/sections/timeline'

export default function TimelinePreviewPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* 페이지 헤더 */}
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Timeline Section Preview
          </h1>
          <p className="text-muted-foreground">
            타임라인 섹션 컴포넌트 개발 프리뷰
          </p>
          <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
            <span className="inline-flex size-2 animate-pulse rounded-full bg-green-500" />
            <span>Live Preview Mode</span>
          </div>
        </div>

        {/* 타임라인 섹션 */}
        <TimelineSection />

        {/* 개발 정보 */}
        <div className="border-border/50 mt-12 border-t pt-8">
          <details className="group">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer list-none text-sm font-medium transition-colors">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="size-4 transition-transform group-open:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                개발 정보
              </span>
            </summary>
            <div className="text-muted-foreground mt-4 space-y-2 pl-6 text-sm">
              <p>
                <strong className="text-foreground">컴포넌트:</strong>{' '}
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  src/components/sections/timeline/timeline-section.tsx
                </code>
              </p>
              <p>
                <strong className="text-foreground">데이터 소스:</strong>{' '}
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  useTimeline() hook
                </code>
              </p>
              <p>
                <strong className="text-foreground">API:</strong>{' '}
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  GET /api/timeline
                </code>
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
