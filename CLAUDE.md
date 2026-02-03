# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

개발자 포트폴리오 관리 시스템 - Next.js 16 + FastAPI + Supabase 기반의 단일 사용자 MVP 애플리케이션입니다.

**핵심 아키텍처:**

- **Frontend**: Next.js 16 App Router + React 19 + TypeScript + TailwindCSS v4 + shadcn/ui
- **Backend**: FastAPI (Vercel Serverless Functions로 배포)
- **Database**: Supabase PostgreSQL
- **인증**: 토큰 기반 httpOnly 쿠키 인증 (단일 관리자)

## Development Commands

```bash
# 개발 서버 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npm run typecheck

# 린트
npm run lint          # 체크만
npm run lint:fix      # 자동 수정

# 포맷팅
npm run format        # 자동 포맷
npm run format:check  # 체크만

# 모든 검증 실행
npm run check-all     # typecheck + lint + format:check
```

## Agent Responsibilities

이 프로젝트에서는 특화된 에이전트들이 각자의 전문 영역을 담당합니다:

### `ui-markup-specialist` 에이전트

- **역할**: 웹 디자인 및 UI/UX 구현
- **담당 영역**:
  - 정적 마크업 및 스타일링 (HTML/CSS/TailwindCSS)
  - shadcn/ui 컴포넌트 활용
  - 반응형 레이아웃 디자인
  - 시각적 인터페이스 구성
- **디자인 방향**:
  - 🎨 **현대적이고 획기적인** 디자인
  - 💻 **개발자스러운** 감성 (미니멀, 다크모드 친화적)
  - ⚡ **클린하고 직관적인** 사용자 경험
  - 🚀 **최신 웹 디자인 트렌드** 반영

### `nextjs-app-developer` 에이전트

- **역할**: Next.js 애플리케이션 개발
- **담당 영역**:
  - Next.js 16 App Router 구조 설계 및 구현
  - 페이지 라우팅 및 레이아웃 설정
  - Server Components / Client Components 아키텍처
  - API 연동 및 데이터 페칭
  - Server Actions 구현
  - Middleware 설정

**협업 방식:**

1. `ui-markup-specialist`가 UI 컴포넌트와 디자인 시스템 구축
2. `nextjs-app-developer`가 Next.js 구조에 통합하고 비즈니스 로직 연결
3. 두 에이전트가 협력하여 완성도 높은 애플리케이션 구현

## Local Development Environment

### 로컬 개발 서버 실행

```bash
npm run dev
```

**중요 사항:**

- ✅ `npm run dev` 실행 시 **Next.js와 FastAPI가 함께 실행**됩니다
- ✅ **로컬 환경끼리만 통신**합니다 (localhost ↔ localhost)
- Next.js: `http://localhost:3000`
- FastAPI: `http://localhost:8000` (또는 별도 포트)

**환경별 통신 구조:**

```
로컬 개발:
  Next.js (localhost:3000) ↔ FastAPI (localhost:8000)

프로덕션 (Vercel):
  Next.js ↔ FastAPI Serverless Functions (/api/*)
```

**구현 방법:**

- `package.json`의 `dev` 스크립트에서 `concurrently` 사용
- Next.js와 FastAPI 서버를 동시에 실행
- 환경변수로 로컬/프로덕션 API URL 분기

## Architecture Patterns

### 1. API Routes via FastAPI

모든 백엔드 API는 `api/index.py`에 FastAPI로 구현되며, Vercel이 자동으로 `/api/*` 경로로 변환합니다.

**Vercel Routing:**

```json
// vercel.json
"rewrites": [
  { "source": "/api/:path*", "destination": "/api/index" }
]
```

**FastAPI 앱 설정:**

```python
# api/index.py
app = FastAPI(root_path="/api")  # 모든 라우트에 /api 프리픽스
```

**주요 엔드포인트:**

- `GET /api/health` - 헬스 체크 및 Supabase 연결 테스트
- `GET /api/profile` - 프로필 조회
- `PUT /api/profile` - 프로필 업데이트
- `GET /api/timeline` - 타임라인 조회
- `POST /api/timeline` - 타임라인 생성
- `GET /api/section-visibility` - 섹션 표시 설정 조회
- `POST /api/auth/login` - 관리자 로그인
- `POST /api/auth/logout` - 로그아웃

### 2. Authentication System

**토큰 기반 쿠키 인증:**

- `ADMIN_SECRET_TOKEN` 환경변수와 비교하여 검증
- 인증 성공 시 httpOnly 쿠키에 토큰 저장 (7일 유효)
- Next.js Middleware가 `/admin` 경로 접근 시 쿠키 검증
- JavaScript에서 토큰 접근 불가 (보안)

**인증 플로우:**

1. `/login` 페이지에서 토큰 입력
2. FastAPI `/api/auth/login`으로 검증
3. 성공 시 `admin_token` httpOnly 쿠키 설정
4. Next.js Middleware가 `/admin` 접근 시 쿠키 확인
5. 유효하면 접근 허용, 아니면 `/login`으로 리다이렉트

**보안 설정 (FastAPI):**

```python
response.set_cookie(
    key="admin_token",
    httponly=True,           # JS 접근 차단
    secure=is_production,    # HTTPS only (프로덕션)
    samesite="lax",          # CSRF 방지
    max_age=60*60*24*7       # 7일
)
```

### 3. Database Design

**Supabase PostgreSQL 스키마:**

- 위치: `docs/database/scheme.sql`
- Seed 데이터: `docs/database/seed.sql`

**핵심 테이블:**

- `profile` - 프로필 정보 (단일 레코드)
- `timeline` - 경력 타임라인 (`sort_order`로 정렬)
- `education` - 교육사항
- `skills` - 기술 역량 (카테고리별)
- `peer_reviews` - 동료평가 이미지
- `projects` - 사이드프로젝트
- `awards` - 수상 내역
- `internships` - 인턴십
- `research` - 연구활동
- `volunteer` - 봉사활동
- `activities` - 대외활동
- `section_visibility` - 섹션 표시 제어 (단일 레코드)

**데이터베이스 접근:**

- **읽기**: `SUPABASE_ANON_KEY` 사용 (공개 접근)
- **쓰기**: `SUPABASE_SERVICE_ROLE_KEY` 사용 (관리자만)

### 4. Environment Variables

**필수 환경변수 (`.env.local`):**

```bash
# Supabase 설정
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 관리자 인증
ADMIN_SECRET_TOKEN=your-secure-admin-token

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api  # 로컬
# NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api  # 프로덕션
```

### 5. Frontend Data Layer

**API 클라이언트:**
- 위치: `src/lib/api-client.ts`
- RESTful API 통신을 위한 중앙화된 클라이언트
- 메서드: `get`, `post`, `put`, `delete`
- 자동 에러 처리 및 credentials 포함

**SWR 기반 데이터 페칭:**
- 위치: `src/lib/hooks/use-portfolio-data.ts`
- Generic `useResource<T>` 패턴으로 11개 리소스 훅 제공
- 조건부 페칭: API 미구현 시 `null` endpoint 전달

**패턴 예시:**
```typescript
function useResource<T>(endpoint: string | null): UseResourceReturn<T> {
  const { data, error, isValidating, mutate } = useSWR<T, ApiError>(
    endpoint,
    endpoint ? () => apiClient.get<T>(endpoint) : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      errorRetryCount: 3,
    }
  )
  return {
    data,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate
  }
}

// 사용 예시
export function useProfile() {
  return useResource<Profile>('/profile')
}
export function useEducation() {
  return useResource<Education[]>(null)  // API 미구현
}
```

**주요 훅:**
- `useProfile()` - 프로필 정보
- `useTimeline()` - 경력 타임라인
- `useEducation()` - 교육사항
- `useSkills()` - 기술 스택
- `usePeerReviews()` - 동료평가
- `useProjects()` - 사이드프로젝트
- `useAwards()` - 수상 내역
- `useInternships()` - 인턴십
- `useResearch()` - 연구활동
- `useVolunteer()` - 봉사활동
- `useActivities()` - 대외활동

### 6. Component Architecture

**섹션 컴포넌트 패턴:**

모든 포트폴리오 섹션은 일관된 구조로 구현됩니다:

```
Section (Main Component)
├── SectionContent  - 실제 데이터 표시
├── SectionSkeleton - 로딩 상태 UI
├── SectionError    - 에러 상태 UI
└── SectionEmpty    - 빈 데이터 상태 UI
```

**디렉토리 구조:**
```
src/components/sections/
├── profile/
│   ├── profile-section.tsx       # Main
│   ├── profile-content.tsx       # Content
│   ├── profile-skeleton.tsx      # Loading
│   └── profile-error.tsx         # Error
├── timeline/
│   └── timeline-section.tsx
├── education/
│   └── education-section.tsx
└── ...
```

**상태 처리 로직:**
```typescript
export function ProfileSection() {
  const { data, error, isLoading } = useProfile()

  if (isLoading) return <ProfileSkeleton />
  if (error) return <ProfileError error={error} />
  if (!data) return <ProfileEmpty />

  return <ProfileContent profile={data} />
}
```

**공통 UI 컴포넌트:**
- `SectionCard` (`src/components/section-card.tsx`)
  - 아이콘, 제목, 설명을 포함하는 섹션 래퍼
  - `SectionCard.Item` 서브 컴포넌트로 리스트 아이템 구성
  - variant 지원: default, elevated, glass, neon 등

**디자인 특징:**
- 그라디언트 배경 및 글로우 효과
- Pseudo-elements를 활용한 시각적 요소 (타임라인 연결선 등)
- 반응형 그리드/플렉스 레이아웃
- 다크모드 친화적 컬러 스킴
- 개발자스러운 미니멀 디자인

### 7. Styling with TailwindCSS v4

**TailwindCSS v4 특징:**

- 설정 파일 불필요 (CSS 기반 설정)
- `@import "tailwindcss"` 방식
- PostCSS 플러그인 사용: `@tailwindcss/postcss`

**shadcn/ui 통합:**

- 스타일: `new-york`
- 컴포넌트 위치: `src/components/ui/`
- 설치된 컴포넌트 (17개):
  - 기본: Button, Card, Avatar, Badge, Separator, Skeleton
  - 폼: Input, Textarea, Label, Checkbox, Radio Group, Select, Switch
  - 네비게이션: Navigation Menu, Dropdown Menu
  - 기타: Progress, Dialog
- 커스터마이징:
  - Button: gradient, glass, neon, sleek variants 추가
  - Card: elevated, glass, outline, minimal, neon, interactive variants 추가
  - 개발자스러운 감성의 모던 디자인 적용

## Project Status

✅ **현재 상태: 프론트엔드 개발 진행 중 (66.67%)**

**완료된 작업:**
- ✅ FastAPI 백엔드 구현 완료 (`api/index.py`)
- ✅ 데이터베이스 스키마 설계 완료 (`docs/database/scheme.sql`)
- ✅ PRD 및 README 문서 작성 완료
- ✅ Next.js 16 App Router 기본 구조 생성
- ✅ shadcn/ui 컴포넌트 시스템 구축 (17개 컴포넌트)
  - Button, Card, Avatar 등 기본 컴포넌트 커스터마이징
  - gradient, glass, neon, sleek 등 개발자스러운 variant 추가
- ✅ API 클라이언트 및 데이터 페칭 레이어 구현
  - SWR 기반 훅 시스템 (11개 리소스)
  - 조건부 페칭 패턴 (null endpoint)
- ✅ 포트폴리오 섹션 구현 (6/11)
  - Profile Section (모던 그라디언트 디자인)
  - Timeline Section (수직 타임라인)
  - Education Section (2열 그리드)
  - Skills Section (카테고리별 뱃지)
  - Section Navigation (11개 섹션 탭)

**진행 중:**
- 🚧 동료평가 이미지 갤러리 (Task 9)
- 🚧 추가 포트폴리오 섹션 (Tasks 10-11)
  - Projects, Awards, Internships
  - Research, Volunteer, Activities
- 🚧 로컬 개발 환경 통합 (Task 12)

**다음 단계:**
1. 이미지 갤러리 구현 (yet-another-react-lightbox)
2. 나머지 포트폴리오 섹션 구현
3. 관리자 페이지 구현
4. 로컬/프로덕션 환경 통합 테스트

## Key Technical Decisions

### Next.js 16 + Turbopack

- 개발/빌드 모두 Turbopack 사용 (`--turbopack` 플래그)
- App Router 기반 (Pages Router 사용 안 함)

### Vercel Deployment

- GitHub 연동으로 자동 배포
- FastAPI는 Python Runtime으로 자동 변환
- 리전: `icn1` (서울)

### React 19 + TypeScript

- React 19의 최신 동시성 기능 활용
- 엄격한 타입 체크 (`tsconfig.json`)

### Form Handling

- React Hook Form + Zod validation
- 의존성 설치됨: `react-hook-form`, `zod`, `@hookform/resolvers`

### State Management

- **서버 상태**: SWR (설치 완료)
  - 위치: `src/lib/hooks/use-portfolio-data.ts`
  - 리소스별 훅: useProfile, useTimeline, useEducation 등 11개
  - 특징: 자동 재검증, 에러 재시도, 중복 제거
- **클라이언트 상태**: React hooks (useState, useReducer)

## Documentation

프로젝트 상세 문서는 `docs/` 디렉토리 참조:

- `PRD.md` - 제품 요구사항 문서
- `database/scheme.sql` - 데이터베이스 스키마
- `database/seed.sql` - 샘플 데이터

## Testing the Application

**로컬 테스트 (UI만):**

```bash
npm run dev
# http://localhost:3000 접속
# ⚠️ API 호출은 실패함
```

**전체 기능 테스트 (Vercel):**

```bash
# 1. 환경변수 설정 (Vercel Dashboard)
# 2. 배포
git push origin main

# 3. 배포 URL에서 테스트
# - 공개 페이지: /
# - 로그인: /login
# - 관리자: /admin
```

**헬스 체크:**

```bash
# 로컬 (실패함)
curl http://localhost:3000/api/health

# Vercel (성공)
curl https://your-app.vercel.app/api/health
```

## Common Issues

### "API 호출 실패" 에러

- 로컬 환경에서는 정상 (FastAPI 미실행)
- Vercel 배포 후 테스트 필요

### 관리자 페이지 접근 불가

1. `.env.local`에 `ADMIN_SECRET_TOKEN` 설정 확인
2. `/login`에서 정확한 토큰 입력
3. 브라우저 개발자 도구에서 쿠키 확인

### 빌드 오류

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### TypeScript 에러

```bash
# 타입 체크만 실행 (빌드 없이)
npm run typecheck
```
