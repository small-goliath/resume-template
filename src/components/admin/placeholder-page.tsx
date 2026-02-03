/**
 * 플레이스홀더 페이지 컴포넌트
 *
 * 아직 구현되지 않은 관리자 페이지를 위한 공통 UI
 * Server Component
 */

import { AdminHeader } from '@/components/admin/admin-header'
import { Construction, type LucideIcon } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  IconComponent?: LucideIcon
}

export function PlaceholderPage({
  title,
  description,
  IconComponent = Construction,
}: PlaceholderPageProps) {
  return (
    <>
      <AdminHeader title={title} description={description} />

      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.1)]">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <IconComponent className="size-10 text-[--color-neon-cyan-500]" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[--color-neon-cyan-500]">
            준비 중입니다
          </h3>
          <p className="font-mono text-sm text-[--color-neon-cyan-700]">
            이 기능은 곧 추가될 예정입니다.
          </p>
        </div>
      </div>
    </>
  )
}
