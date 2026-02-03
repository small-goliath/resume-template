/**
 * 관리자 페이지 헤더 컴포넌트
 *
 * 페이지 제목 및 액션 버튼을 표시하는 사이버펑크 스타일 헤더
 * Server Component
 */

interface AdminHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="terminal-prompt text-3xl font-bold tracking-tight text-[--color-neon-cyan-500] text-glow-medium">
          {title}
        </h1>
        {description && (
          <p className="font-mono text-sm text-[--color-neon-cyan-700]">
            {description}
          </p>
        )}
        {/* 네온 구분선 */}
        <div className="mt-2 h-0.5 w-16 rounded-full bg-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]" />
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  )
}
