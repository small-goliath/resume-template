/**
 * 기술공유 세미나 섹션 사용 예시
 *
 * 개발/테스트용 컴포넌트 - 실제 프로덕션에서는 사용하지 않음
 */

import { TechSeminarsContent } from './tech-seminars-content'
import { TechSeminarsSkeleton } from './tech-seminars-skeleton'
import { TechSeminarsError, TechSeminarsEmpty } from './tech-seminars-error'
import type { TechSeminar } from '@/types'

/**
 * 샘플 데이터
 */
const SAMPLE_SEMINARS: TechSeminar[] = [
  {
    id: '1',
    seminar_name: 'Next.js 16 App Router 완벽 가이드',
    seminar_url: 'https://example.com/nextjs-guide',
    year: 2024,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    seminar_name: 'React 19 새로운 기능 톺아보기',
    seminar_url: null,
    year: 2024,
    sort_order: 2,
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: '3',
    seminar_name: 'TypeScript 고급 타입 시스템',
    seminar_url: 'https://example.com/typescript',
    year: 2023,
    sort_order: 3,
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-03-01T00:00:00Z',
  },
  {
    id: '4',
    seminar_name: 'FastAPI와 Supabase로 만드는 현대적 백엔드',
    seminar_url: 'https://example.com/fastapi',
    year: 2023,
    sort_order: 4,
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2023-09-01T00:00:00Z',
  },
  {
    id: '5',
    seminar_name: 'TailwindCSS v4 마이그레이션 전략',
    seminar_url: null,
    year: 2023,
    sort_order: 5,
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z',
  },
]

/**
 * 예시 1: 정상 데이터 표시
 */
export function TechSeminarsExample() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">기술공유 세미나 섹션 예시</h2>
        <p className="text-muted-foreground text-sm">
          5개의 샘플 세미나 데이터 (2023-2024)
        </p>
      </div>

      <TechSeminarsContent seminars={SAMPLE_SEMINARS} />
    </div>
  )
}

/**
 * 예시 2: 로딩 상태
 */
export function TechSeminarsLoadingExample() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">로딩 상태</h2>
        <p className="text-muted-foreground text-sm">스켈레톤 UI 표시</p>
      </div>

      <TechSeminarsSkeleton />
    </div>
  )
}

/**
 * 예시 3: 에러 상태
 */
export function TechSeminarsErrorExample() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">에러 상태</h2>
        <p className="text-muted-foreground text-sm">데이터 로딩 실패 시</p>
      </div>

      <TechSeminarsError error="API 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." />
    </div>
  )
}

/**
 * 예시 4: 빈 데이터 상태
 */
export function TechSeminarsEmptyExample() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">빈 데이터 상태</h2>
        <p className="text-muted-foreground text-sm">등록된 세미나가 없을 때</p>
      </div>

      <TechSeminarsEmpty />
    </div>
  )
}

/**
 * 예시 5: 단일 연도 (링크 없음)
 */
export function TechSeminarsSingleYearExample() {
  const singleYearSeminars: TechSeminar[] = [
    {
      id: '1',
      seminar_name: 'GraphQL과 REST의 장단점 비교',
      seminar_url: null,
      year: 2024,
      sort_order: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      seminar_name: '모던 프론트엔드 성능 최적화',
      seminar_url: null,
      year: 2024,
      sort_order: 2,
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
    },
  ]

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">단일 연도 (링크 없음)</h2>
        <p className="text-muted-foreground text-sm">
          2024년 세미나 2개 (URL 없음)
        </p>
      </div>

      <TechSeminarsContent seminars={singleYearSeminars} />
    </div>
  )
}

/**
 * 예시 6: 모든 링크 있음
 */
export function TechSeminarsWithLinksExample() {
  const seminarsWithLinks: TechSeminar[] = [
    {
      id: '1',
      seminar_name: 'WebAssembly 실전 활용',
      seminar_url: 'https://example.com/wasm',
      year: 2024,
      sort_order: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      seminar_name: 'Serverless 아키텍처 디자인 패턴',
      seminar_url: 'https://example.com/serverless',
      year: 2024,
      sort_order: 2,
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
    },
  ]

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">모든 링크 있음</h2>
        <p className="text-muted-foreground text-sm">
          외부 링크가 있는 세미나들
        </p>
      </div>

      <TechSeminarsContent seminars={seminarsWithLinks} />
    </div>
  )
}

/**
 * 통합 예시 (모든 상태)
 */
export function TechSeminarsAllStatesExample() {
  return (
    <div className="space-y-16 p-8">
      <TechSeminarsExample />
      <TechSeminarsLoadingExample />
      <TechSeminarsErrorExample />
      <TechSeminarsEmptyExample />
      <TechSeminarsSingleYearExample />
      <TechSeminarsWithLinksExample />
    </div>
  )
}
