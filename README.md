# Cyberpunk Resume

사이버펑크 스타일의 개발자 포트폴리오 관리 시스템입니다.

Next.js 16 + FastAPI + Supabase 기반으로 구축된 풀스택 웹 애플리케이션으로, 네온 글로우와 사이버펑크 감성의 현대적인 포트폴리오를 제공합니다.

## ✨ 주요 특징

### 🎨 사이버펑크 디자인 시스템
- **네온 글로우 효과**: 청록색(Cyan), 마젠타(Magenta), 보라색(Purple) 네온 컬러 팔레트
- **다크모드 전용**: 순수 블랙 배경과 그리드 패턴
- **부드러운 애니메이션**: 섹션 전환 시 페이드 슬라이드 애니메이션 (0.8초)
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화된 레이아웃
- **GPU 가속**: `transform`, `opacity` 기반 60fps 애니메이션
- **접근성**: `prefers-reduced-motion` 지원

### 📊 포트폴리오 섹션 (11개)
1. **프로필 (Profile)**: 이름, MBTI, 프로필 이미지, 소개글, 외부 링크
2. **일일 루틴 (Daily Routine)**: 24시간 시계 형태의 루틴 표시
3. **타임라인 (Timeline)**: 경력 및 주요 이벤트 (연도별 정렬)
4. **교육 (Education)**: 학력 및 교육 이력
5. **기술 스택 (Skills)**: 카테고리별 기술 뱃지
6. **동료평가 (Peer Reviews)**: 이미지 갤러리 + Lightbox
7. **프로젝트 (Projects)**: 사이드프로젝트 포트폴리오
8. **수상 (Awards)**: 수상 내역 및 인증서
9. **인턴십 (Internships)**: 인턴 경험
10. **연구 (Research)**: 연구 활동
11. **봉사/대외활동 (Volunteer & Activities)**: 봉사 및 대외활동

### 🔐 관리자 시스템
- **토큰 기반 인증**: httpOnly 쿠키로 안전한 세션 관리
- **CRUD 관리 페이지**: 모든 섹션 데이터 생성/수정/삭제
- **섹션 표시 제어**: 각 섹션별 공개/비공개 설정
- **실시간 미리보기**: 편집 중 변경사항 즉시 확인
- **통계 대시보드**: 데이터 현황 및 빠른 작업 링크

### ⚡ 성능 최적화
- **Turbopack**: Next.js 16의 고속 번들러
- **SWR 캐싱**: 자동 재검증 및 중복 요청 제거
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **CSS Containment**: 섹션별 렌더링 격리
- **Lazy Loading**: 스크롤 시 섹션별 점진적 로딩

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.1.6 (App Router + Turbopack)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york)
- **State Management**: SWR 2.4.0
- **Form**: React Hook Form 7.71.1 + Zod 4.3.6
- **Icons**: Lucide React 0.543.0
- **Lightbox**: yet-another-react-lightbox 3.28.0
- **Toast**: Sonner 2.0.7

### Backend
- **API Framework**: FastAPI (Python 3.12+)
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel Serverless Functions
- **Authentication**: Token-based httpOnly cookie

### Development Tools
- **Linting**: ESLint 9 + Prettier 3.6.2
- **Git Hooks**: Husky 9.1.7 + lint-staged 16.1.6
- **Bundler**: Turbopack (Next.js 16 내장)

## 📦 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd cyberpunk-resume
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin Authentication
ADMIN_SECRET_TOKEN=your-secure-admin-token

# Next.js Public API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 다음 순서로 실행:
   ```sql
   -- 1. 기본 스키마
   docs/database/scheme.sql

   -- 2. 프로필 소개글 필드 추가 (마이그레이션)
   ALTER TABLE profile ADD COLUMN IF NOT EXISTS introduction TEXT;

   -- 3. (선택) 샘플 데이터
   docs/database/seed.sql
   ```

### 4. 개발 서버 실행

```bash
npm run dev
```

- **Next.js**: http://localhost:3000
- **FastAPI**: http://localhost:8000
- **관리자**: http://localhost:3000/admin
- **로그인**: http://localhost:3000/login

> **💡 Tip**: `npm run dev`는 Next.js와 FastAPI를 동시에 실행합니다 (concurrently 사용)

## 🚀 배포 (Vercel)

### 1. GitHub 연동

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에서 "New Project"
2. GitHub 저장소 선택
3. 프로젝트명: `cyberpunk-resume`
4. Framework Preset: Next.js
5. Root Directory: `./`

### 3. 환경변수 설정

Settings → Environment Variables에 다음 변수 추가:

```bash
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ADMIN_SECRET_TOKEN=<your-admin-token>
NEXT_PUBLIC_API_URL=https://cyberpunk-resume.vercel.app/api
```

### 4. 배포 확인

- 배포 URL: `https://cyberpunk-resume.vercel.app`
- Health Check: `https://cyberpunk-resume.vercel.app/api/health`

## 🔐 관리자 로그인

### 로그인 절차

1. `/login` 페이지 접속
2. `ADMIN_SECRET_TOKEN` 값 입력
3. "로그인" 버튼 클릭
4. `/admin` 대시보드로 자동 리다이렉트

### 보안 특징

- **httpOnly Cookie**: JavaScript에서 토큰 접근 불가
- **7일 유효기간**: 자동 만료
- **HTTPS 전용**: 프로덕션 환경에서 secure 쿠키
- **CSRF 방지**: SameSite=lax 설정
- **Middleware 보호**: `/admin` 경로 자동 검증

## 📁 프로젝트 구조

```
.
├── api/                          # FastAPI 백엔드
│   ├── index.py                  # 메인 API 엔드포인트
│   ├── requirements.txt          # Python 의존성
│   └── venv/                     # Python 가상환경
├── src/
│   ├── app/
│   │   ├── admin/                # 관리자 페이지
│   │   │   ├── profile/          # 프로필 관리
│   │   │   ├── timeline/         # 타임라인 관리
│   │   │   ├── education/        # 교육 관리
│   │   │   ├── skills/           # 기술스택 관리
│   │   │   ├── peer-reviews/     # 동료평가 관리
│   │   │   ├── projects/         # 프로젝트 관리
│   │   │   ├── awards/           # 수상 관리
│   │   │   ├── internships/      # 인턴십 관리
│   │   │   ├── research/         # 연구 관리
│   │   │   ├── volunteer/        # 봉사 관리
│   │   │   ├── activities/       # 대외활동 관리
│   │   │   └── settings/         # 섹션 표시 설정
│   │   ├── login/                # 로그인 페이지
│   │   ├── layout.tsx            # 전역 레이아웃
│   │   ├── page.tsx              # 공개 포트폴리오
│   │   └── globals.css           # 사이버펑크 테마
│   ├── components/
│   │   ├── admin/                # 관리자 전용 컴포넌트
│   │   ├── sections/             # 포트폴리오 섹션
│   │   │   ├── profile/
│   │   │   ├── timeline/
│   │   │   ├── education/
│   │   │   └── ...
│   │   ├── daily-routine-clock/  # 24시간 루틴 시계
│   │   ├── section-navigation-indicator.tsx
│   │   └── ui/                   # shadcn/ui 컴포넌트
│   ├── hooks/
│   │   ├── use-portfolio-data.ts # SWR 데이터 훅
│   │   └── use-section-animation.ts  # 섹션 애니메이션
│   ├── lib/
│   │   ├── api-client.ts         # RESTful API 클라이언트
│   │   └── schemas/              # Zod 스키마
│   ├── types/                    # TypeScript 타입
│   └── middleware.ts             # 인증 Middleware
├── docs/
│   ├── database/
│   │   ├── scheme.sql            # DB 스키마
│   │   ├── seed.sql              # 샘플 데이터
│   │   └── rls-policies.sql      # Row Level Security
│   ├── guides/                   # 개발 가이드
│   ├── PRD.md                    # 제품 요구사항
│   ├── LOCAL_DEVELOPMENT.md      # 로컬 개발 가이드
│   └── TROUBLESHOOTING.md        # 문제 해결
└── vercel.json                   # Vercel 배포 설정
```

## 🎯 주요 API 엔드포인트

### 공개 API
- `GET /api/health` - 헬스 체크 및 DB 연결 테스트
- `GET /api/profile` - 프로필 조회
- `GET /api/timeline` - 타임라인 조회
- `GET /api/section-visibility` - 섹션 표시 설정 조회

### 관리자 API (인증 필요)
- `PUT /api/profile` - 프로필 업데이트
- `POST /api/timeline` - 타임라인 생성
- `PUT /api/timeline/{id}` - 타임라인 수정
- `DELETE /api/timeline/{id}` - 타임라인 삭제
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

> 📝 전체 API 문서: [docs/API_CLIENT_GUIDE.md](./docs/API_CLIENT_GUIDE.md)

## 🧪 개발 명령어

```bash
# 개발 서버 (Next.js + FastAPI)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start

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

## 🎨 디자인 시스템

### 컬러 팔레트

```css
/* 주요 네온 컬러 */
--color-neon-cyan-500: #00f0ff;      /* 청록 네온 */
--color-neon-magenta-500: #ff00ff;   /* 마젠타 네온 */
--color-neon-purple-500: #9d00ff;    /* 보라 네온 */
--color-neon-green-500: #00ff41;     /* 초록 네온 (터미널) */
--color-neon-orange-500: #ff6b00;    /* 주황 네온 (경고) */

/* 배경 */
--color-black-base: #000000;         /* 순수 블랙 */
--color-black-surface: #0a0a0a;      /* 표면 */
--color-black-elevated: #121212;     /* 상승 */
```

### 네온 글로우 레벨

```css
/* 텍스트 글로우 */
.text-glow-subtle   /* 은은한 글로우 */
.text-glow-medium   /* 중간 글로우 */
.text-glow-strong   /* 강한 글로우 */
.text-glow-intense  /* 매우 강한 글로우 */

/* 박스 글로우 */
.box-glow-subtle
.box-glow-medium
.box-glow-strong
.box-glow-intense
```

### 애니메이션

```css
/* 섹션 진입 애니메이션 */
.section-enter {
  animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 접근성: 애니메이션 감소 */
@media (prefers-reduced-motion: reduce) {
  .section-enter {
    animation: fadeInSimple 0.2s ease-out forwards;
  }
}
```

> 📝 전체 디자인 가이드: [docs/guides/styling-guide.md](./docs/guides/styling-guide.md)

## 🔧 문제 해결

### 관리자 페이지 접근 불가

1. `.env.local`에 `ADMIN_SECRET_TOKEN` 설정 확인
2. 브라우저 쿠키 확인 (개발자 도구 → Application → Cookies)
3. 토큰이 정확한지 확인
4. 브라우저 캐시 삭제 후 재시도

### API 호출 실패

```bash
# 1. Health Check 확인
curl http://localhost:3000/api/health

# 2. Supabase 환경변수 확인
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# 3. FastAPI 서버 로그 확인
# 터미널에서 FastAPI 출력 확인
```

### 프로필 이미지가 표시되지 않음

`next.config.ts`의 `images.remotePatterns`에 이미지 호스팅 도메인 추가:

```typescript
images: {
  remotePatterns: [
    { hostname: 'avatars.githubusercontent.com' },
    { hostname: '**.imgur.com' },
    { hostname: 'cdn.torii.kro.kr' },
    // 추가 도메인...
  ],
}
```

### 섹션 애니메이션이 작동하지 않음

1. `use-section-animation.ts` 훅이 `page.tsx`에서 호출되는지 확인
2. 브라우저 콘솔에서 JavaScript 에러 확인
3. `prefers-reduced-motion` 설정 확인 (시스템 설정)

### 빌드 오류

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

> 📝 상세 가이드: [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

## 📚 문서

### 개발 가이드
- [프로젝트 요구사항 (PRD)](./docs/PRD.md)
- [로컬 개발 환경](./docs/LOCAL_DEVELOPMENT.md)
- [프로젝트 구조](./docs/guides/project-structure.md)
- [스타일링 가이드](./docs/guides/styling-guide.md)
- [컴포넌트 패턴](./docs/guides/component-patterns.md)
- [Next.js 16.1.6 가이드](./docs/guides/nextjs-16.md)
- [폼 처리 (React Hook Form)](./docs/guides/forms-react-hook-form.md)

### 기능별 가이드
- [API 클라이언트](./docs/API_CLIENT_GUIDE.md)
- [포트폴리오 컴포넌트](./docs/guides/portfolio-components.md)
- [섹션 네비게이션](./docs/guides/section-navigation-guide.md)
- [관리자 구현](./docs/admin-implementation.md)
- [일일 루틴 시계](./docs/components/daily-routine-clock.md)

## 🎯 주요 기능 상태

✅ **완료된 기능**
- [x] 사이버펑크 디자인 시스템
- [x] 11개 포트폴리오 섹션 구현
- [x] 섹션별 CRUD 관리 페이지
- [x] 토큰 기반 인증 시스템
- [x] 섹션 전환 애니메이션
- [x] 일일 루틴 24시간 시계
- [x] 이미지 갤러리 + Lightbox
- [x] 반응형 디자인
- [x] 로컬/프로덕션 환경 통합
- [x] Vercel 배포 설정

🚧 **진행 중**
- [ ] 실제 데이터 입력 및 QA
- [ ] SEO 최적화
- [ ] 커스텀 도메인 설정

## 🤝 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!

### 개발 워크플로우

1. 브랜치 생성: `git checkout -b feature/new-feature`
2. 변경사항 커밋: `git commit -m "feat: add new feature"`
3. 푸시: `git push origin feature/new-feature`
4. Pull Request 생성

### 커밋 컨벤션

```bash
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 변경
```

## 🔗 링크

- [API 문서](./docs/API_CLIENT_GUIDE.md)
- [개발 가이드](./docs/guides/)

---

Made with ❤️ using Next.js 16, React 19, and Supabase
