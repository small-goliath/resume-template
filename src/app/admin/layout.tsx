import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: '관리자 페이지 - 개발자 포트폴리오',
  description: '포트폴리오 관리 페이지',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 쿠키에서 토큰 가져오기
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')?.value

  // 쿠키 존재 여부만 확인 (실제 검증은 FastAPI에서 수행)
  // FastAPI의 모든 쓰기 API가 verify_admin_token 의존성을 사용하여 검증
  if (!adminToken) {
    redirect('/login')
  }
  return (
    <div className="min-h-screen bg-[--color-black-base]">
      {/* 사이버펑크 그리드 배경 */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.5)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* 사이드바 */}
      <AdminSidebar />

      {/* 메인 컨텐츠 영역 */}
      <main className="relative min-h-screen lg:pl-64">
        <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
          {/* 모바일에서 사이드바 공간 확보 */}
          <div className="pt-16 lg:pt-0">{children}</div>
        </div>
      </main>

      {/* Toast 알림 */}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              'border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.2)]',
            title: 'text-[--color-neon-cyan-500] font-semibold',
            description: 'text-[--color-neon-cyan-700] font-mono text-sm',
            success: 'border-[--color-neon-green-600] shadow-[0_0_20px_rgba(0,255,65,0.2)]',
            error: 'border-[--color-neon-orange-600] shadow-[0_0_20px_rgba(255,107,0,0.2)]',
          },
        }}
      />
    </div>
  )
}
