/**
 * 기술공유 세미나 섹션 - 에러 UI
 *
 * 데이터 로딩 실패 시 표시되는 에러 상태 UI
 */

import { Mic } from 'lucide-react'

/**
 * 에러 컴포넌트 Props
 */
interface TechSeminarsErrorProps {
  error: string
}

/**
 * 기술공유 세미나 섹션 에러 상태
 */
export function TechSeminarsError({ error }: TechSeminarsErrorProps) {
  return (
    <section className="border-destructive/30 bg-destructive/5 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-destructive/10 rounded-full p-3">
          <svg
            className="text-destructive size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-destructive text-lg font-semibold">
            기술공유 세미나 정보를 불러올 수 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    </section>
  )
}

/**
 * 빈 데이터 상태 UI
 */
export function TechSeminarsEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Mic className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            아직 등록된 기술공유 세미나가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 기술공유 세미나 정보를 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
