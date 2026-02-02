import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // /admin 경로 접근 시 인증 확인
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value
    const expectedToken = process.env.ADMIN_SECRET_TOKEN

    // 토큰이 없거나 일치하지 않으면 로그인 페이지로 리다이렉트
    if (!adminToken || adminToken !== expectedToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ['/admin/:path*'],
}
