'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Terminal, Lock, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const loginSchema = z.object({
  token: z.string().min(1, '토큰을 입력하세요'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    console.log('[LOGIN] 로그인 시도 시작:', data)

    try {
      console.log('[LOGIN] API 호출 전')
      const response = await apiClient.post('/auth/login', data)
      console.log('[LOGIN] API 호출 성공:', response)

      // 로그인 성공 - 관리자 페이지로 리다이렉트
      // window.location.href를 사용하여 완전한 페이지 새로고침
      console.log('[LOGIN] /admin으로 리다이렉트 시도')
      window.location.href = '/admin'
      // 리다이렉트 중이므로 로딩 상태 유지
    } catch (err) {
      console.error('[LOGIN] 에러 발생:', err)
      console.error('[LOGIN] 에러 타입:', typeof err)
      console.error('[LOGIN] 에러 상세:', JSON.stringify(err, null, 2))
      setError('토큰이 올바르지 않습니다')
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[--color-black-base]">
      {/* 사이버펑크 그리드 배경 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <CardHeader className="space-y-3 text-center">
            {/* 터미널 아이콘 */}
            <div className="mx-auto rounded-full bg-[--color-neon-cyan-500]/10 p-3 shadow-[0_0_20px_var(--color-neon-cyan-500)]">
              <Terminal className="h-8 w-8 text-[--color-neon-cyan-500]" />
            </div>

            <CardTitle className="text-2xl font-bold text-[--color-neon-cyan-500] text-glow-medium">
              관리자 로그인
            </CardTitle>
            <CardDescription className="text-[--color-neon-cyan-700]">
              관리자 토큰을 입력하세요
            </CardDescription>

            {/* 네온 구분선 */}
            <div className="mx-auto h-0.5 w-20 rounded-full bg-[--color-neon-cyan-500] shadow-[0_0_10px_var(--color-neon-cyan-500)]" />
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="token"
                  className="flex items-center gap-2 text-[--color-neon-cyan-500]"
                >
                  <Lock className="h-4 w-4" />
                  Admin Token
                </Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="••••••••••••"
                  className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400] placeholder:text-[--color-neon-cyan-800] focus:border-[--color-neon-cyan-500] focus:shadow-[0_0_10px_var(--color-neon-cyan-500)] focus:ring-[--color-neon-cyan-500]"
                  {...register('token')}
                />
                {errors.token && (
                  <p className="flex items-center gap-1 text-sm text-[--color-neon-orange-500]">
                    <AlertCircle className="h-3 w-3" />
                    {errors.token.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-md border border-[--color-neon-orange-600] bg-[--color-neon-orange-500]/10 p-3">
                  <p className="flex items-center gap-2 text-sm text-[--color-neon-orange-500]">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="neon"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    로그인
                  </>
                )}
              </Button>
            </form>

            {/* 하단 도움말 */}
            <div className="mt-6 rounded-md border border-[--color-neon-cyan-800] bg-[--color-black-surface] p-3">
              <p className="text-xs text-[--color-neon-cyan-700]">
                💡{' '}
                <strong className="text-[--color-neon-cyan-500]">Tip:</strong>{' '}
                토큰은 환경변수{' '}
                <code className="rounded bg-[--color-black-base] px-1 py-0.5 font-mono text-[--color-neon-cyan-400]">
                  ADMIN_SECRET_TOKEN
                </code>
                에 설정된 값입니다
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
