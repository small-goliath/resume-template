/**
 * 프로필 섹션 데모 페이지
 *
 * ProfileSection 컴포넌트의 다양한 상태를 시연하는 페이지
 */

import { ProfileSection } from '@/components/sections'

export default function ProfileDemoPage() {
  return (
    <div className="container mx-auto space-y-12 px-4 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">프로필 섹션 데모</h1>
        <p className="text-muted-foreground">
          개발자 포트폴리오 프로필 섹션의 실제 동작을 확인할 수 있습니다.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">실제 데이터 (SWR 사용)</h2>
          <p className="text-muted-foreground text-sm">
            useProfile() hook을 통해 실제 API 데이터를 페칭합니다.
          </p>
          <ProfileSection />
        </div>

        <div className="border-border/50 bg-muted/30 rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">컴포넌트 특징</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>현대적인 디자인:</strong> 그라디언트 배경, 그리드 패턴,
                빛나는 효과로 개발자스러운 감성 구현
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>반응형 레이아웃:</strong> 모바일에서는 세로 배치,
                데스크톱에서는 가로 배치
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Skeleton UI:</strong> 로딩 중 자연스러운 플레이스홀더
                표시
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>에러 처리:</strong> API 오류 시 사용자 친화적인 에러
                메시지
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>빈 데이터 처리:</strong> 프로필 정보가 없을 때 안내
                메시지
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>외부 링크 보안:</strong> target="_blank" + rel="noopener
                noreferrer" 적용
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>MBTI Badge:</strong> MBTI 정보가 있을 때만 표시,
                Sparkles 아이콘으로 포인트
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Avatar Fallback:</strong> 이미지가 없을 때 이름 첫
                글자로 대체
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-blue-600 dark:text-blue-400">
            💡 사용 방법
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              공개 포트폴리오 페이지에서 사용:
            </p>
            <pre className="bg-muted overflow-x-auto rounded-md p-4">
              <code>{`import { ProfileSection } from '@/components/sections'

export default function PortfolioPage() {
  return (
    <div>
      <ProfileSection />
      {/* 다른 섹션들 */}
    </div>
  )
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
