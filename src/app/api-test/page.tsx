/**
 * API 클라이언트 및 SWR Hooks 테스트 페이지
 * 개발 환경에서 API 통신 테스트용
 */

'use client'

import {
  useProfile,
  useTimeline,
  useSectionVisibility,
  useHealth,
  usePortfolioData,
} from '@/lib/hooks/use-portfolio-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function APITestPage() {
  const health = useHealth()
  const profile = useProfile()
  const timeline = useTimeline()
  const sectionVisibility = useSectionVisibility()
  const portfolioData = usePortfolioData()

  return (
    <div className="container mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-4xl font-bold">API 클라이언트 테스트</h1>

      {/* 헬스 체크 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. 헬스 체크 (GET /api/health)</CardTitle>
          <CardDescription>FastAPI 서버 및 Supabase 연결 상태</CardDescription>
        </CardHeader>
        <CardContent>
          {health.isLoading && (
            <p className="text-muted-foreground">로딩 중...</p>
          )}
          {health.error && (
            <div className="text-red-500">
              <p className="font-semibold">에러 발생:</p>
              <p>{health.error.message}</p>
            </div>
          )}
          {health.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    health.data.status === 'healthy' ? 'default' : 'destructive'
                  }
                >
                  {health.data.status}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {health.data.message}
                </span>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">환경 변수 설정:</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    Supabase URL:{' '}
                    {health.data.environment.supabase_url_configured
                      ? '✅ 설정됨'
                      : '❌ 미설정'}
                  </li>
                  <li>
                    Anon Key:{' '}
                    {health.data.environment.supabase_anon_key_configured
                      ? '✅ 설정됨'
                      : '❌ 미설정'}
                  </li>
                  <li>
                    Service Role Key:{' '}
                    {health.data.environment
                      .supabase_service_role_key_configured
                      ? '✅ 설정됨'
                      : '❌ 미설정'}
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">데이터베이스 연결:</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    상태:{' '}
                    {health.data.database.connected
                      ? '✅ 연결됨'
                      : '❌ 연결 실패'}
                  </p>
                  {health.data.database.error && (
                    <p className="text-red-500">
                      에러: {health.data.database.error}
                    </p>
                  )}
                  {health.data.database.profile_exists !== undefined && (
                    <p>
                      프로필 존재:{' '}
                      {health.data.database.profile_exists
                        ? '✅ 있음'
                        : '❌ 없음'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 프로필 조회 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2. 프로필 조회 (GET /api/profile)</CardTitle>
          <CardDescription>useProfile() hook 테스트</CardDescription>
        </CardHeader>
        <CardContent>
          {profile.isLoading && (
            <p className="text-muted-foreground">로딩 중...</p>
          )}
          {profile.error && (
            <div className="text-red-500">
              <p className="font-semibold">에러 발생:</p>
              <p>{profile.error.message}</p>
              {profile.error.statusCode && (
                <p>Status Code: {profile.error.statusCode}</p>
              )}
            </div>
          )}
          {profile.data && (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">이름:</span> {profile.data.name}
              </p>
              <p>
                <span className="font-semibold">MBTI:</span>{' '}
                {profile.data.mbti || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">GitHub:</span>{' '}
                {profile.data.github_url ? (
                  <a
                    href={profile.data.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {profile.data.github_url}
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
              <p>
                <span className="font-semibold">생성일:</span>{' '}
                {new Date(profile.data.created_at).toLocaleString('ko-KR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 타임라인 조회 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. 타임라인 조회 (GET /api/timeline)</CardTitle>
          <CardDescription>useTimeline() hook 테스트</CardDescription>
        </CardHeader>
        <CardContent>
          {timeline.isLoading && (
            <p className="text-muted-foreground">로딩 중...</p>
          )}
          {timeline.error && (
            <div className="text-red-500">
              <p className="font-semibold">에러 발생:</p>
              <p>{timeline.error.message}</p>
            </div>
          )}
          {timeline.data && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                총 {timeline.data.length}개 항목
              </p>
              <div className="space-y-3">
                {timeline.data.map(item => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>{item.year}</Badge>
                      <h4 className="font-semibold">{item.company}</h4>
                      <span className="text-muted-foreground text-sm">
                        - {item.role}
                      </span>
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      {item.events.map((event, idx) => (
                        <li key={idx}>{event}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 섹션 표시 설정 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>4. 섹션 표시 설정 (GET /api/section-visibility)</CardTitle>
          <CardDescription>useSectionVisibility() hook 테스트</CardDescription>
        </CardHeader>
        <CardContent>
          {sectionVisibility.isLoading && (
            <p className="text-muted-foreground">로딩 중...</p>
          )}
          {sectionVisibility.error && (
            <div className="text-red-500">
              <p className="font-semibold">에러 발생:</p>
              <p>{sectionVisibility.error.message}</p>
            </div>
          )}
          {sectionVisibility.data && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sectionVisibility.data)
                .filter(([key]) => key.endsWith('_enabled'))
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">
                      {key.replace('_enabled', '')}:
                    </span>
                    <Badge variant={value ? 'default' : 'secondary'}>
                      {value ? '표시' : '숨김'}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 전체 포트폴리오 데이터 */}
      <Card>
        <CardHeader>
          <CardTitle>5. 전체 포트폴리오 데이터 (usePortfolioData)</CardTitle>
          <CardDescription>모든 데이터 타입 통합 hook 테스트</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold">로딩 상태:</p>
              <Badge
                variant={portfolioData.isLoading ? 'secondary' : 'default'}
              >
                {portfolioData.isLoading ? '로딩 중...' : '완료'}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="mb-2 text-sm font-semibold">에러 상태:</p>
              <Badge
                variant={portfolioData.hasError ? 'destructive' : 'default'}
              >
                {portfolioData.hasError
                  ? `에러 ${portfolioData.errors.length}개`
                  : '정상'}
              </Badge>
              {portfolioData.hasError && (
                <ul className="mt-2 space-y-1 text-sm text-red-500">
                  {portfolioData.errors.map((error, idx) => (
                    <li key={idx}>{error?.message}</li>
                  ))}
                </ul>
              )}
            </div>
            <Separator />
            <div>
              <p className="mb-2 text-sm font-semibold">데이터 상태 요약:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>프로필: {portfolioData.profile.data ? '✅' : '❌'}</div>
                <div>타임라인: {portfolioData.timeline.data ? '✅' : '❌'}</div>
                <div>
                  섹션 설정:{' '}
                  {portfolioData.sectionVisibility.data ? '✅' : '❌'}
                </div>
                <div className="text-muted-foreground">교육사항: 미구현</div>
                <div className="text-muted-foreground">스킬: 미구현</div>
                <div className="text-muted-foreground">동료평가: 미구현</div>
                <div className="text-muted-foreground">프로젝트: 미구현</div>
                <div className="text-muted-foreground">수상: 미구현</div>
                <div className="text-muted-foreground">인턴십: 미구현</div>
                <div className="text-muted-foreground">연구: 미구현</div>
                <div className="text-muted-foreground">봉사: 미구현</div>
                <div className="text-muted-foreground">대외활동: 미구현</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 안내 메시지 */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
        <h3 className="mb-2 font-semibold">💡 테스트 안내</h3>
        <ul className="space-y-1 text-sm">
          <li>
            • 로컬 환경에서는 FastAPI 서버가 실행되지 않아 API 호출이 실패할 수
            있습니다.
          </li>
          <li>• Vercel 배포 후 테스트하시면 정상적으로 데이터가 조회됩니다.</li>
          <li>
            • 에러가 발생하면 .env.local 파일의 환경변수가 올바르게 설정되었는지
            확인하세요.
          </li>
          <li>
            • 미구현된 API (교육, 스킬 등)는 향후 FastAPI에 엔드포인트를
            추가하면 자동으로 작동합니다.
          </li>
        </ul>
      </div>
    </div>
  )
}
