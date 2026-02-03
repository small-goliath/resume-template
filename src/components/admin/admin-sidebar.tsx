'use client'

/**
 * 관리자 사이드바 컴포넌트 - 사이버펑크 스타일
 *
 * 11개 섹션 + 설정 메뉴를 포함한 사이드바 네비게이션
 * 모바일에서는 햄버거 메뉴로 전환
 */

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Clock,
  Clock3,
  GraduationCap,
  Code2,
  Users,
  FolderKanban,
  Award,
  Briefcase,
  FlaskConical,
  Heart,
  Sparkles,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * 네비게이션 메뉴 아이템 타입
 */
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * 네비게이션 메뉴 구조
 */
const navItems: NavItem[] = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard },
  { name: '프로필', href: '/admin/profile', icon: User },
  { name: '일일 루틴', href: '/admin/daily-routine', icon: Clock3 },
  { name: '타임라인', href: '/admin/timeline', icon: Clock },
  { name: '교육', href: '/admin/education', icon: GraduationCap },
  { name: '기술스택', href: '/admin/skills', icon: Code2 },
  { name: '동료평가', href: '/admin/peer-reviews', icon: Users },
  { name: '프로젝트', href: '/admin/projects', icon: FolderKanban },
  { name: '수상', href: '/admin/awards', icon: Award },
  { name: '인턴십', href: '/admin/internships', icon: Briefcase },
  { name: '연구활동', href: '/admin/research', icon: FlaskConical },
  { name: '봉사활동', href: '/admin/volunteer', icon: Heart },
  { name: '대외활동', href: '/admin/activities', icon: Sparkles },
]

const settingsItem: NavItem = {
  name: '섹션 설정',
  href: '/admin/settings',
  icon: Settings,
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  /**
   * 네비게이션 링크 컴포넌트
   */
  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-[--color-neon-cyan-500]/20 text-[--color-neon-cyan-500] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
            : 'text-[--color-neon-cyan-700] hover:bg-[--color-neon-cyan-500]/10 hover:text-[--color-neon-cyan-500]'
        )}
      >
        {/* 활성 상태 표시 바 */}
        {isActive && (
          <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]" />
        )}

        <Icon className={cn(
          'size-5 shrink-0 transition-transform group-hover:scale-110',
          isActive && 'text-glow-subtle'
        )} />
        <span className="truncate">{item.name}</span>

        {/* 호버 글로우 효과 */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-[--color-neon-cyan-500] opacity-0 blur-xl transition-opacity group-hover:opacity-10" />
      </Link>
    )
  }

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-[--color-neon-cyan-600] bg-[--color-black-elevated] p-2 text-[--color-neon-cyan-500] shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-sm transition-all hover:border-[--color-neon-cyan-500] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] lg:hidden"
        aria-label="메뉴 열기/닫기"
      >
        {isMobileMenuOpen ? (
          <X className="size-6" />
        ) : (
          <Menu className="size-6" />
        )}
      </button>

      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 border-r border-[--color-neon-cyan-800] bg-[--color-black-elevated] shadow-[2px_0_30px_rgba(0,240,255,0.1)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="border-b border-[--color-neon-cyan-800] p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-[--color-neon-cyan-600] bg-[--color-neon-cyan-500]/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <LayoutDashboard className="size-5 text-[--color-neon-cyan-500]" />
              </div>
              <div>
                <h2 className="terminal-prompt text-lg font-bold text-[--color-neon-cyan-500]">
                  Admin Panel
                </h2>
                <p className="font-mono text-xs text-[--color-neon-cyan-700]">
                  포트폴리오 관리
                </p>
              </div>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {/* 메인 메뉴 */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>

            {/* 구분선 */}
            <div className="my-4 h-px bg-[--color-neon-cyan-800] shadow-[0_0_5px_rgba(0,240,255,0.2)]" />

            {/* 설정 메뉴 */}
            <NavLink item={settingsItem} />
          </nav>

          {/* 푸터 (로그아웃 버튼) */}
          <div className="border-t border-[--color-neon-cyan-800] p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-[--color-neon-orange-500] hover:bg-[--color-neon-orange-500]/10 hover:text-[--color-neon-orange-400]"
            >
              <LogOut className="size-4" />
              <span>로그아웃</span>
            </Button>
          </div>
        </div>

        {/* 네온 글로우 테두리 */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[--color-neon-cyan-500] opacity-20 blur-sm" />
      </aside>
    </>
  )
}
