import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관리자 페이지 - 개발자 포트폴리오',
  description: '포트폴리오 관리 페이지',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">포트폴리오 관리</h1>
          <nav className="flex gap-4">
            <span className="text-sm text-gray-600">관리자</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
