# 개발자 포트폴리오 관리 시스템

Next.js 16.1.6 + FastAPI + Supabase 기반 개인 포트폴리오 관리 시스템입니다.

## 🚀 주요 기능

- **프로필 관리**: 이름, MBTI, 프로필 이미지, 외부 링크 관리
- **타임라인**: 경력 및 주요 이벤트 관리
- **섹션 표시 제어**: 각 섹션의 공개/비공개 설정
- **관리자 인증**: 토큰 기반 접근 제어

## 🛠️ 기술 스택

### Frontend
- Next.js 16.1.6 (App Router + Turbopack)
- React 19.1.0
- TypeScript 5
- TailwindCSS v4
- shadcn/ui (new-york style)
- React Hook Form + Zod

### Backend
- FastAPI (Vercel Serverless Functions)
- Supabase PostgreSQL
- Python 3.12+

## 📦 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd claude-nextjs-starters
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
2. SQL Editor에서 `docs/database/scheme.sql` 실행
3. (선택사항) `docs/database/seed.sql` 실행하여 샘플 데이터 추가

### 4. 개발 서버 실행

**⚠️ 중요: 로컬 개발 환경 제한사항**

로컬 개발 환경에서는 FastAPI 백엔드가 자동으로 실행되지 않습니다. 다음 두 가지 옵션이 있습니다:

#### 옵션 A: 프론트엔드만 개발 (권장)

```bash
npm run dev
```

- **공개 페이지**: http://localhost:3000
- **관리자 페이지**: http://localhost:3000/admin (로그인 불가)
- **로그인 페이지**: http://localhost:3000/login (로그인 불가)

**Note**: API가 작동하지 않으므로 데이터 로드/저장이 실패합니다. UI 개발에만 사용하세요.

#### 옵션 B: Vercel에 배포하여 전체 테스트

FastAPI를 포함한 전체 기능을 테스트하려면 Vercel에 배포하세요:

```bash
git push origin main  # Vercel이 자동 배포
# 또는
vercel --prod
```

- 배포된 URL에서 모든 API 기능이 정상 작동합니다

## 🔐 관리자 접근 제어

### 인증 방식

이 시스템은 간단한 토큰 기반 인증을 사용합니다:

1. **환경변수 설정**: `ADMIN_SECRET_TOKEN`에 강력한 임의의 문자열 설정
2. **로그인**: `/login` 페이지에서 토큰 입력
3. **쿠키 저장**: 인증 성공 시 httpOnly 쿠키에 토큰 저장 (7일 유효)
4. **Middleware 검증**: `/admin` 접근 시 자동으로 토큰 확인

### 보안 설정

- **httpOnly**: JavaScript에서 쿠키 접근 불가
- **secure**: 프로덕션 환경에서 HTTPS 필수
- **sameSite**: CSRF 공격 방지

### 로그인 방법

```bash
# 1. 브라우저에서 로그인 페이지 접속
http://localhost:3000/login

# 2. ADMIN_SECRET_TOKEN 값 입력
# 예: my-super-secret-token-2024

# 3. "로그인" 버튼 클릭
```

### 로그아웃

관리자 페이지 우측 상단의 "로그아웃" 버튼을 클릭하거나, 쿠키를 삭제하면 됩니다.

## 🚢 배포 (Vercel)

### 1. GitHub 저장소 연결

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 환경변수 설정 (Settings → Environment Variables):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_SECRET_TOKEN`
   - `NEXT_PUBLIC_API_URL` (예: https://your-project.vercel.app/api)

### 3. 배포

```bash
# 자동 배포 (GitHub push 시)
git push origin main

# 또는 Vercel CLI 사용
npx vercel --prod
```

## 📁 프로젝트 구조

```
.
├── api/                      # FastAPI 백엔드
│   ├── index.py             # FastAPI 앱 및 엔드포인트
│   └── requirements.txt     # Python 의존성
├── src/
│   ├── app/
│   │   ├── actions/         # Next.js Server Actions
│   │   │   ├── auth.ts      # 인증 관련
│   │   │   ├── profile.ts   # 프로필 관리
│   │   │   └── timeline.ts  # 타임라인 관리
│   │   ├── admin/           # 관리자 페이지
│   │   │   ├── _components/ # 관리자 전용 컴포넌트
│   │   │   ├── layout.tsx   # 관리자 레이아웃
│   │   │   └── page.tsx     # 관리자 메인 페이지
│   │   ├── login/           # 로그인 페이지
│   │   │   └── page.tsx
│   │   ├── layout.tsx       # 전역 레이아웃
│   │   └── page.tsx         # 공개 포트폴리오 페이지
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/              # shadcn/ui 컴포넌트
│   ├── lib/
│   │   └── schemas/         # Zod 스키마
│   ├── types/               # TypeScript 타입 정의
│   └── middleware.ts        # Next.js Middleware (접근 제어)
├── docs/
│   ├── database/
│   │   ├── scheme.sql       # 데이터베이스 스키마
│   │   └── seed.sql         # 샘플 데이터
│   ├── guides/              # 개발 가이드
│   └── PRD.md               # 프로젝트 요구사항 문서
└── .env.example             # 환경변수 예시
```

## 🧪 테스트 및 검증

```bash
# 타입 체크
npm run type-check

# 린트 체크
npm run lint

# 빌드 테스트
npm run build

# 모든 검사 실행
npm run check-all
```

## 📖 문서

자세한 개발 가이드는 다음 문서를 참조하세요:

- [프로젝트 요구사항 (PRD)](./docs/PRD.md)
- [개발 로드맵](./docs/ROADMAP.md)
- [프로젝트 구조 가이드](./docs/guides/project-structure.md)
- [스타일링 가이드](./docs/guides/styling-guide.md)
- [컴포넌트 패턴](./docs/guides/component-patterns.md)
- [Next.js 16.1.6 가이드](./docs/guides/nextjs-16.md)
- [폼 처리 가이드](./docs/guides/forms-react-hook-form.md)

## 🔧 트러블슈팅

### 관리자 페이지 접근 불가

1. `.env.local` 파일에 `ADMIN_SECRET_TOKEN` 설정 확인
2. 로그인 페이지에서 올바른 토큰 입력 확인
3. 브라우저 쿠키 확인 (개발자 도구 → Application → Cookies)

### API 호출 실패

1. `NEXT_PUBLIC_API_URL` 환경변수 확인
2. Supabase 환경변수 확인
3. FastAPI 서버 상태 확인: http://localhost:3000/api/health

### 빌드 오류

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

## 📝 라이선스

MIT

## 🤝 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!
