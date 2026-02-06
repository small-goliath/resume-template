/**
 * 기술공유 세미나 섹션 - 로딩 Skeleton UI
 *
 * 데이터 로딩 중에 표시되는 스켈레톤 UI
 */

import { Skeleton } from '@/components/ui/skeleton'

/**
 * 기술공유 세미나 섹션 스켈레톤
 */
export function TechSeminarsSkeleton() {
  return (
    <section className="space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="ml-[52px] h-4 w-48" />
      </div>

      {/* 카드 스켈레톤 */}
      <div className="space-y-6 rounded-xl border p-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-px flex-1" />
            </div>
            <div className="space-y-2 pl-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
