# 로컬 개발 환경 설정 가이드

이 문서는 프로젝트를 로컬 환경에서 실행하기 위한 상세 가이드입니다.

## 필수 요구사항

### 1. Node.js 및 npm
- **Node.js**: 20.x 이상 (권장: 20.11.0 LTS)
- **npm**: 10.x 이상
- 확인: `node --version` 및 `npm --version`

### 2. Python (FastAPI 백엔드)
- **Python**: 3.10 이상 (권장: 3.11 또는 3.12)
- **pip**: 최신 버전
- 확인: `python --version` 및 `pip --version`

### 3. Git
- 버전 관리를 위한 Git 설치

## 초기 설정

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd claude-nextjs-starters
```

### 2. 의존성 설치

#### Node.js 의존성
```bash
npm install
```

#### Python 의존성 (FastAPI 백엔드)
```bash
cd api
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
.\venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

### 3. 환경변수 설정

#### `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 입력합니다:

```bash
# Supabase 설정
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 관리자 인증
ADMIN_SECRET_TOKEN=your-secure-admin-token

# API URL (로컬 개발)
NEXT_PUBLIC_API_URL=/api
```

**환경변수 설명:**
- `SUPABASE_URL`: Supabase 프로젝트 URL (예: `https://xxx.supabase.co`)
- `SUPABASE_ANON_KEY`: Supabase 익명 키 (공개 읽기용)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 역할 키 (쓰기 권한)
- `ADMIN_SECRET_TOKEN`: 관리자 인증을 위한 비밀 토큰 (임의의 강력한 문자열)
- `NEXT_PUBLIC_API_URL`: API 엔드포인트 URL (로컬: `/api`, 프로덕션: `/api` 또는 절대 URL)

**Supabase 설정 가져오기:**
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택 → Settings → API
3. `Project URL`, `anon` key, `service_role` key 복사

### 4. 데이터베이스 설정

#### Supabase 테이블 생성
1. Supabase Dashboard → SQL Editor
2. `docs/database/scheme.sql` 파일 내용 복사 후 실행
3. (선택사항) `docs/database/seed.sql` 샘플 데이터 삽입

## 개발 서버 실행

### 통합 개발 서버 (권장)

**단일 명령으로 Next.js + FastAPI 동시 실행:**
```bash
npm run dev
```

이 명령은 다음을 동시에 실행합니다:
- Next.js 개발 서버: `http://localhost:3000`
- FastAPI 백엔드: `http://localhost:8000`

### 개별 서버 실행 (문제 해결용)

**Next.js만 실행:**
```bash
npx next dev --turbopack
```

**FastAPI만 실행:**
```bash
cd api
source venv/bin/activate  # 가상환경 활성화
uvicorn index:app --reload --port 8000
```

## 로컬 환경 통신 구조

```
┌─────────────────────────────────────────────────────────────┐
│  브라우저 (http://localhost:3000)                            │
│  ├─ Next.js 클라이언트                                       │
│  └─ API 요청: fetch('/api/profile')                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ (프록시)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js 개발 서버 (http://localhost:3000)                  │
│  ├─ 페이지 렌더링                                            │
│  └─ /api/* 요청을 FastAPI로 전달                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ (CORS)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  FastAPI 백엔드 (http://localhost:8000)                     │
│  ├─ /api/profile, /api/timeline 등 처리                     │
│  └─ Supabase 데이터베이스 통신                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Supabase PostgreSQL (클라우드)                             │
└─────────────────────────────────────────────────────────────┘
```

**로컬 vs 프로덕션 차이:**
| 환경 | Next.js | FastAPI | 통신 |
|------|---------|---------|------|
| 로컬 | localhost:3000 | localhost:8000 | CORS 필요 |
| Vercel | vercel.app | Serverless Functions | Same-origin |

## 주요 명령어

### 개발
```bash
npm run dev                # Next.js + FastAPI 동시 실행
npm run api:dev            # FastAPI만 실행
```

### 코드 품질 검증
```bash
npm run typecheck          # TypeScript 타입 체크
npm run lint               # ESLint 검사
npm run lint:fix           # ESLint 자동 수정
npm run format             # Prettier 자동 포맷
npm run format:check       # Prettier 검사만
npm run check-all          # 모든 검증 실행 (typecheck + lint + format:check)
```

### 빌드
```bash
npm run build              # 프로덕션 빌드 (Turbopack)
npm run start              # 프로덕션 서버 실행
```

### shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add button       # Button 컴포넌트 추가
npx shadcn@latest add card         # Card 컴포넌트 추가
npx shadcn@latest add form         # Form 컴포넌트 추가
```

## 주요 URL

### 로컬 개발
- **홈페이지**: http://localhost:3000
- **로그인**: http://localhost:3000/login
- **관리자 대시보드**: http://localhost:3000/admin
- **컴포넌트 데모**: http://localhost:3000/components-demo
- **타임라인 미리보기**: http://localhost:3000/timeline-preview
- **FastAPI 문서**: http://localhost:8000/api/docs
- **API 헬스 체크**: http://localhost:8000/api/health

### API 엔드포인트 테스트
```bash
# 헬스 체크 (Supabase 연결 확인)
curl http://localhost:8000/api/health

# 프로필 조회
curl http://localhost:8000/api/profile

# 타임라인 조회
curl http://localhost:8000/api/timeline

# 섹션 표시 설정 조회
curl http://localhost:8000/api/section-visibility
```

## 문제 해결

### 1. `npm run dev` 실행 시 FastAPI 오류

**증상:**
```
[api] Error: No module named 'fastapi'
```

**해결:**
```bash
cd api
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### 2. 포트 충돌 오류

**증상:**
```
Error: Port 3000 is already in use
```

**해결:**
```bash
# 포트 사용 프로세스 확인 및 종료 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# 또는 다른 포트 사용
PORT=3001 npm run dev
```

### 3. Supabase 연결 실패

**증상:**
```
Failed to fetch profile: Supabase credentials not configured
```

**해결 체크리스트:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경변수 값에 **공백이나 따옴표가 없는지** 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인
4. 데이터베이스 테이블이 생성되어 있는지 확인 (`docs/database/scheme.sql` 실행)

### 4. 타입 에러

**증상:**
```
Type error: Cannot find module '@/components/ui/button'
```

**해결:**
```bash
# shadcn/ui 컴포넌트 설치
npx shadcn@latest add button

# 또는 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### 5. CORS 에러 (로컬 개발)

**증상:**
```
Access to fetch at 'http://localhost:8000/api/profile' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**해결:**
`api/index.py`의 CORS 설정 확인:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. Python 가상환경 활성화 오류 (Windows)

**증상:**
```
.\venv\Scripts\activate : cannot be loaded because running scripts is disabled
```

**해결:**
```powershell
# PowerShell을 관리자 권한으로 실행 후
Set-ExecutionPolicy RemoteSigned

# 또는 Git Bash 사용
source venv/Scripts/activate
```

### 7. 빌드 캐시 문제

**해결:**
```bash
# Next.js 캐시 삭제
rm -rf .next

# npm 캐시 삭제
npm cache clean --force

# 재설치
rm -rf node_modules package-lock.json
npm install
```

## Git 커밋 전 체크리스트

프로젝트에는 Husky + lint-staged가 설정되어 있어, 커밋 시 자동으로 다음을 실행합니다:
1. ESLint 자동 수정
2. Prettier 자동 포맷

**수동 검증:**
```bash
npm run check-all  # typecheck + lint + format:check
```

## 디버깅 팁

### 1. Chrome DevTools 활용
- **Network 탭**: API 요청/응답 확인
- **Application 탭 → Cookies**: `admin_token` 쿠키 확인
- **Console 탭**: JavaScript 에러 확인

### 2. FastAPI 자동 문서
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### 3. Next.js 디버깅
```bash
# 자세한 빌드 로그
npm run build -- --debug

# 환경변수 확인
node -e "console.log(process.env)"
```

### 4. Python 디버깅
```python
# api/index.py에 추가
import logging
logging.basicConfig(level=logging.DEBUG)
```

## VS Code 추천 설정

### 추천 확장 프로그램
- **ESLint**: dbaeumer.vscode-eslint
- **Prettier**: esbenp.prettier-vscode
- **Tailwind CSS IntelliSense**: bradlc.vscode-tailwindcss
- **Python**: ms-python.python
- **TypeScript**: built-in

### `.vscode/settings.json` (이미 설정됨)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 추가 리소스

- [Next.js 16 문서](https://nextjs.org/docs)
- [FastAPI 문서](https://fastapi.tiangolo.com/)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [TailwindCSS v4 문서](https://tailwindcss.com/docs)

## 문제 보고

이슈가 발생하면 다음 정보와 함께 보고해주세요:
1. 오류 메시지 전체
2. 실행 환경 (OS, Node.js/Python 버전)
3. 재현 단계
4. 관련 로그 파일

---

**작성일**: 2026-02-03
**업데이트**: 프로젝트 초기 설정 완료 시점
