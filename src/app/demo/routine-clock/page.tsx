/**
 * 24시간 아날로그 루틴 시계 - 데모 페이지
 *
 * 접근 경로: http://localhost:3000/demo/routine-clock
 *
 * 이 페이지는 DailyRoutineClock 컴포넌트를 시각적으로 테스트하기 위한 데모 페이지입니다.
 * API 미구현 상태에서도 동작 확인을 위해 사용할 수 있습니다.
 */

import { DailyRoutineClock } from '@/components/daily-routine-clock'

export default function RoutineClockDemoPage() {
  return (
    <div className="min-h-screen bg-black-base p-8">
      {/* 헤더 */}
      <div className="mx-auto mb-12 max-w-4xl">
        <h1 className="mb-4 font-mono text-3xl font-bold text-neon-cyan-500 text-glow-medium">
          24시간 아날로그 루틴 시계
        </h1>
        <p className="font-mono text-sm text-neon-cyan-300">
          KST 기준 현재 시간을 표시하고, 일일 루틴을 시각화하는 네온 스타일 시계
        </p>
      </div>

      {/* 시계 컴포넌트 */}
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-neon-cyan-800 bg-black-elevated p-8">
          <DailyRoutineClock />
        </div>
      </div>

      {/* 기능 설명 */}
      <div className="mx-auto mt-12 max-w-4xl">
        <div className="rounded-lg border border-neon-purple-800 bg-black-elevated p-6">
          <h2 className="mb-4 font-mono text-xl font-bold text-neon-purple-500">
            주요 기능
          </h2>
          <ul className="space-y-2 font-mono text-sm text-neon-cyan-300">
            <li>✅ 24시간 아날로그 시계 (0시~23시)</li>
            <li>✅ KST 기준 실시간 시침/분침</li>
            <li>✅ 시간대별 루틴 호(Arc) 시각화</li>
            <li>✅ 네온 색상 및 글로우 효과</li>
            <li>✅ 반응형 디자인 (모바일/데스크톱)</li>
            <li>✅ 범례를 통한 루틴 라벨 표시</li>
          </ul>
        </div>

        {/* API 상태 안내 */}
        <div className="mt-6 rounded-lg border border-neon-orange-800 bg-black-elevated p-6">
          <h2 className="mb-4 font-mono text-xl font-bold text-neon-orange-500">
            API 연동 상태
          </h2>
          <p className="mb-4 font-mono text-sm text-neon-cyan-300">
            이 컴포넌트는 <code className="text-neon-green-500">useDailyRoutine()</code>{' '}
            훅을 사용하여 API 데이터를 가져옵니다.
          </p>
          <div className="space-y-2 font-mono text-xs text-neon-cyan-400">
            <p>
              • <strong>API 엔드포인트:</strong> GET /api/daily-routine
            </p>
            <p>
              • <strong>로컬 개발:</strong> npm run dev 실행 시 FastAPI 자동 실행
            </p>
            <p>
              • <strong>에러 발생 시:</strong> API 미구현 또는 네트워크 오류
            </p>
          </div>
        </div>
      </div>

      {/* 데이터 구조 예시 */}
      <div className="mx-auto mt-12 max-w-4xl">
        <div className="rounded-lg border border-neon-green-800 bg-black-elevated p-6">
          <h2 className="mb-4 font-mono text-xl font-bold text-neon-green-500">
            예상 데이터 구조
          </h2>
          <pre className="overflow-x-auto rounded bg-black-surface p-4 font-mono text-xs text-neon-green-400">
            {`[
  {
    "id": "1",
    "profile_id": "uuid",
    "start_hour": 7,
    "end_hour": 9,
    "label": "Morning Routine",
    "color": "neon-cyan",
    "intensity": "bright",
    "sort_order": 1,
    "created_at": "2026-02-03T00:00:00Z",
    "updated_at": "2026-02-03T00:00:00Z"
  },
  {
    "id": "2",
    "profile_id": "uuid",
    "start_hour": 9,
    "end_hour": 18,
    "label": "Work",
    "color": "neon-magenta",
    "intensity": "medium",
    "sort_order": 2,
    "created_at": "2026-02-03T00:00:00Z",
    "updated_at": "2026-02-03T00:00:00Z"
  },
  {
    "id": "3",
    "profile_id": "uuid",
    "start_hour": 22,
    "end_hour": 6,
    "label": "Sleep",
    "color": "neon-purple",
    "intensity": "dim",
    "sort_order": 3,
    "created_at": "2026-02-03T00:00:00Z",
    "updated_at": "2026-02-03T00:00:00Z"
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  )
}
