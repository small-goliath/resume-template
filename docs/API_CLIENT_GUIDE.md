# API 클라이언트 및 SWR Hooks 가이드

FastAPI 백엔드와 통신하기 위한 API 클라이언트 및 SWR 기반 데이터 fetching hooks 사용 가이드입니다.

## 목차

1. [개요](#개요)
2. [설치 및 설정](#설치-및-설정)
3. [API 클라이언트 사용법](#api-클라이언트-사용법)
4. [SWR Hooks 사용법](#swr-hooks-사용법)
5. [에러 핸들링](#에러-핸들링)
6. [고급 사용법](#고급-사용법)
7. [테스트](#테스트)

---

## 개요

### 주요 기능

- ✅ **타입 안전성**: TypeScript 제네릭으로 완벽한 타입 추론
- ✅ **자동 재검증**: 포커스, 재연결 시 자동 데이터 갱신
- ✅ **에러 처리**: FastAPI의 HTTPException 자동 파싱
- ✅ **캐싱**: SWR의 강력한 캐싱 전략
- ✅ **인증 지원**: httpOnly 쿠키 자동 전송
- ✅ **개발자 경험**: 간결한 API와 직관적인 사용법

### 아키텍처

```
┌─────────────────┐
│  React 컴포넌트  │
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│   SWR Hooks     │  (use-portfolio-data.ts)
│  - useProfile() │
│  - useTimeline()│
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  API Client     │  (api-client.ts)
│  - GET/POST     │
│  - PUT/DELETE   │
└────────┬────────┘
         │ fetches
         ▼
┌─────────────────┐
│  FastAPI        │  (/api/*)
│  + Supabase     │
└─────────────────┘
```

---

## 설치 및 설정

### 1. 환경변수 설정

`.env.local` 파일 생성:

```bash
# API URL (Next.js 클라이언트에서 사용)
NEXT_PUBLIC_API_URL=/api  # 로컬 및 프로덕션 (same-origin)
```

### 2. SWR Provider 설정

`src/app/layout.tsx`에서 이미 설정되어 있습니다:

```tsx
import { SWRProvider } from './swr-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}
```

---

## API 클라이언트 사용법

### 기본 사용법

```typescript
import { apiClient } from '@/lib/api-client'

// GET 요청
const profile = await apiClient.get<Profile>('/profile')

// POST 요청
const newTimeline = await apiClient.post<Timeline>('/timeline', {
  year: 2024,
  company: 'Example Corp',
  role: 'Senior Developer',
  events: ['프로젝트 리드', '성과 개선'],
  sort_order: 1,
})

// PUT 요청
const updated = await apiClient.put<Profile>('/profile', {
  name: 'Updated Name',
  mbti: 'INTJ',
})

// DELETE 요청
await apiClient.delete(`/timeline/${timelineId}`)
```

### 타입 안전성

```typescript
// ✅ 타입 추론 자동
const profile = await apiClient.get<Profile>('/profile')
console.log(profile.name) // string
console.log(profile.mbti) // string | null

// ✅ 컴파일 타임 에러 검출
console.log(profile.invalidField) // ❌ TypeScript 에러
```

### 에러 처리

```typescript
import type { ApiError } from '@/types'

try {
  const data = await apiClient.get<Profile>('/profile')
  console.log(data)
} catch (error) {
  const apiError = error as ApiError
  console.error(apiError.message) // FastAPI의 detail 메시지
  console.error(apiError.statusCode) // HTTP 상태 코드
}
```

---

## SWR Hooks 사용법

### 1. 개별 리소스 조회

#### useProfile() - 프로필 조회

```typescript
'use client'

import { useProfile } from '@/lib/hooks/use-portfolio-data'

export default function ProfileSection() {
  const { data, error, isLoading } = useProfile()

  if (isLoading) return <p>로딩 중...</p>
  if (error) return <p>에러: {error.message}</p>

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>MBTI: {data?.mbti}</p>
      <a href={data?.github_url}>GitHub</a>
    </div>
  )
}
```

#### useTimeline() - 타임라인 조회

```typescript
'use client'

import { useTimeline } from '@/lib/hooks/use-portfolio-data'

export default function TimelineSection() {
  const { data: timeline, error, isLoading } = useTimeline()

  if (isLoading) return <p>로딩 중...</p>
  if (error) return <p>에러: {error.message}</p>

  return (
    <div>
      {timeline?.map((item) => (
        <div key={item.id}>
          <h3>
            {item.year} - {item.company}
          </h3>
          <p>{item.role}</p>
          <ul>
            {item.events.map((event, idx) => (
              <li key={idx}>{event}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

#### useSectionVisibility() - 섹션 표시 설정

```typescript
'use client'

import { useSectionVisibility } from '@/lib/hooks/use-portfolio-data'

export default function PortfolioPage() {
  const { data: visibility } = useSectionVisibility()

  return (
    <div>
      {visibility?.timeline_enabled && <TimelineSection />}
      {visibility?.skills_enabled && <SkillsSection />}
      {visibility?.projects_enabled && <ProjectsSection />}
    </div>
  )
}
```

### 2. 통합 데이터 조회

#### usePortfolioData() - 모든 데이터 한 번에

```typescript
'use client'

import { usePortfolioData } from '@/lib/hooks/use-portfolio-data'

export default function PortfolioPage() {
  const { profile, timeline, sectionVisibility, isLoading, hasError, errors } =
    usePortfolioData()

  if (isLoading) return <p>포트폴리오 로딩 중...</p>

  if (hasError) {
    return (
      <div>
        <h2>데이터 로딩 실패</h2>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error?.message}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {/* 프로필 */}
      {profile.data && <h1>{profile.data.name}</h1>}

      {/* 타임라인 */}
      {sectionVisibility.data?.timeline_enabled && timeline.data && (
        <TimelineSection items={timeline.data} />
      )}

      {/* 기타 섹션... */}
    </div>
  )
}
```

### 3. 사용 가능한 모든 Hooks

| Hook                      | 설명             | 구현 상태 |
| ------------------------- | ---------------- | --------- |
| `useProfile()`            | 프로필 조회      | ✅ 구현   |
| `useTimeline()`           | 타임라인 조회    | ✅ 구현   |
| `useSectionVisibility()`  | 섹션 표시 설정   | ✅ 구현   |
| `useAuthStatus()`         | 인증 상태 조회   | ✅ 구현   |
| `useHealth()`             | 헬스 체크        | ✅ 구현   |
| `useEducation()`          | 교육사항 조회    | 🔄 대기   |
| `useSkills()`             | 기술 역량 조회   | 🔄 대기   |
| `usePeerReviews()`        | 동료평가 조회    | 🔄 대기   |
| `useSideProjects()`       | 사이드프로젝트   | 🔄 대기   |
| `useAwards()`             | 수상 내역 조회   | 🔄 대기   |
| `useInternships()`        | 인턴십 조회      | 🔄 대기   |
| `useResearch()`           | 연구활동 조회    | 🔄 대기   |
| `useVolunteer()`          | 봉사활동 조회    | 🔄 대기   |
| `useExternalActivities()` | 대외활동 조회    | 🔄 대기   |
| `usePortfolioData()`      | 전체 데이터 통합 | ✅ 구현   |

**참고**: 🔄 대기 상태인 hooks는 구조만 생성되어 있으며, FastAPI에 해당 엔드포인트를 추가하면 자동으로 작동합니다.

---

## 에러 핸들링

### Hook 레벨 에러 처리

```typescript
import { useProfile } from '@/lib/hooks/use-portfolio-data'

export default function ProfileSection() {
  const { data, error, isLoading } = useProfile()

  // 로딩 상태
  if (isLoading) {
    return <Skeleton />
  }

  // 에러 상태
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>데이터 로딩 실패</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        {error.statusCode && <p>Status: {error.statusCode}</p>}
      </Alert>
    )
  }

  // 데이터 없음
  if (!data) {
    return <p>데이터가 없습니다.</p>
  }

  // 정상 렌더링
  return <div>{data.name}</div>
}
```

### 전역 에러 핸들러

`src/app/swr-provider.tsx`에서 설정:

```typescript
<SWRConfig
  value={{
    onError: (error, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SWR Error]', key, error)
      }
      // 프로덕션에서는 에러 리포팅 서비스로 전송
      // sendToErrorTracking(error, key)
    },
  }}
>
  {children}
</SWRConfig>
```

---

## 고급 사용법

### 1. 수동 데이터 갱신 (mutate)

```typescript
import { useProfile } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'

export default function ProfileEditor() {
  const { data, mutate } = useProfile()

  const handleUpdate = async (newData: Partial<Profile>) => {
    try {
      // 1. API 호출
      await apiClient.put('/profile', newData)

      // 2. SWR 캐시 갱신 (자동 리페칭)
      await mutate()

      console.log('프로필 업데이트 성공!')
    } catch (error) {
      console.error('업데이트 실패:', error)
    }
  }

  return <button onClick={() => handleUpdate({ name: 'New Name' })}>업데이트</button>
}
```

### 2. Optimistic UI 업데이트

```typescript
import { useTimeline } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'

export default function TimelineEditor() {
  const { data, mutate } = useTimeline()

  const handleDelete = async (id: string) => {
    // Optimistic Update: 즉시 UI에서 제거
    await mutate(
      data?.filter((item) => item.id !== id),
      false // 재검증 안함
    )

    try {
      // API 호출
      await apiClient.delete(`/timeline/${id}`)

      // 성공 시 서버 데이터로 재검증
      await mutate()
    } catch (error) {
      // 실패 시 롤백 (자동)
      await mutate()
      console.error('삭제 실패:', error)
    }
  }

  return <button onClick={() => handleDelete('123')}>삭제</button>
}
```

### 3. 조건부 페칭

```typescript
import { useResource } from '@/lib/hooks/use-portfolio-data'

export default function ConditionalFetch({ userId }: { userId: string | null }) {
  // userId가 null이면 요청 안함
  const { data } = useResource<User>(userId ? `/users/${userId}` : null)

  return <div>{data?.name}</div>
}
```

### 4. 폴링 (주기적 갱신)

```typescript
import useSWR from 'swr'
import { apiClient } from '@/lib/api-client'

export default function LiveStats() {
  const { data } = useSWR(
    '/stats',
    () => apiClient.get('/stats'),
    {
      refreshInterval: 5000, // 5초마다 갱신
      refreshWhenHidden: false, // 탭이 백그라운드일 때는 멈춤
    }
  )

  return <div>실시간 통계: {data?.count}</div>
}
```

---

## 테스트

### 로컬 테스트 페이지

개발 환경에서 API 통신을 테스트할 수 있는 페이지가 제공됩니다:

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 접속
http://localhost:3000/api-test
```

### 테스트 항목

1. **헬스 체크** - FastAPI 서버 및 Supabase 연결 상태
2. **프로필 조회** - useProfile() hook 테스트
3. **타임라인 조회** - useTimeline() hook 테스트
4. **섹션 설정** - useSectionVisibility() hook 테스트
5. **통합 데이터** - usePortfolioData() hook 테스트

### 프로덕션 배포 후 테스트

```bash
# Vercel 배포
git push origin main

# 배포된 URL에서 테스트
https://your-app.vercel.app/api-test
```

---

## FAQ

### Q1. 로컬에서 API 호출이 실패합니다.

**A:** 로컬 환경에서는 FastAPI 서버가 실행되지 않습니다. Vercel 배포 후 테스트하세요.

### Q2. "CORS 에러"가 발생합니다.

**A:** `credentials: 'include'` 설정이 되어 있고, FastAPI의 CORS 미들웨어가 올바르게 설정되어 있는지 확인하세요.

### Q3. 쿠키가 전송되지 않습니다.

**A:**

- 로컬: `credentials: 'include'` 설정 필요
- 프로덕션: HTTPS 환경에서 `secure: true` 쿠키 사용

### Q4. 미구현된 API를 추가하려면?

**A:**

1. FastAPI에 엔드포인트 추가 (`api/index.py`)
2. hooks는 이미 생성되어 있으므로 자동으로 작동합니다.
3. `use-portfolio-data.ts`에서 `null` → `'/endpoint'`로 변경

**예시**:

```typescript
// Before (미구현)
export function useEducation() {
  return useResource<Education[]>(null)
}

// After (FastAPI에 /api/education 추가 후)
export function useEducation() {
  return useResource<Education[]>('/education')
}
```

---

## 추가 자료

- [SWR 공식 문서](https://swr.vercel.app)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
