# Vercel 배포 체크리스트

## 1. 프로젝트 연결
```bash
vercel link
# 또는 새 프로젝트 생성
vercel
```

## 2. 환경변수 설정 (Vercel Dashboard에서 설정 필요)

### Production 환경변수
```bash
# Supabase
SUPABASE_URL=https://qkbgrlqimlnkmfkjxmqf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Auth
ADMIN_SECRET_TOKEN=ehxhflWkd5252

# API URL (프로덕션 도메인으로 자동 설정됨)
# NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

### 환경변수 CLI로 설정하기
```bash
# Production 환경
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ADMIN_SECRET_TOKEN production

# Preview 환경 (선택사항)
vercel env add SUPABASE_URL preview
vercel env add SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
vercel env add ADMIN_SECRET_TOKEN preview
```

## 3. 데이터베이스 마이그레이션

Supabase SQL Editor에서 실행:
```sql
-- Profile introduction 필드 추가
ALTER TABLE profile
ADD COLUMN IF NOT EXISTS introduction TEXT;
```

## 4. 배포 명령어

### Preview 배포 (테스트)
```bash
vercel
```

### Production 배포
```bash
vercel --prod
```

## 5. 배포 후 확인사항

- [ ] 헬스 체크: `curl https://your-domain.vercel.app/api/health`
- [ ] 공개 페이지 접속: `https://your-domain.vercel.app/`
- [ ] 로그인 테스트: `https://your-domain.vercel.app/login`
- [ ] 관리자 페이지: `https://your-domain.vercel.app/admin`
- [ ] API 엔드포인트 테스트:
  - GET /api/profile
  - GET /api/timeline
  - GET /api/section-visibility
- [ ] Next.js Image 외부 도메인 로드 확인
- [ ] 모든 포트폴리오 섹션 정상 표시 확인

## 6. 빌드 설정 (vercel.json)

현재 설정:
- ✅ Framework: Next.js
- ✅ Region: icn1 (Seoul)
- ✅ API Rewrites: /api/* → /api/index
- ✅ Build Command: npm run build
- ✅ Dev Command: npm run dev

## 7. 알려진 이슈

- ESLint circular structure 에러 (빌드/배포에 영향 없음)
- 로컬 환경에서는 FastAPI가 별도 포트(8000)에서 실행됨
- 프로덕션에서는 Vercel이 FastAPI를 Serverless Function으로 자동 변환

## 8. 배포 전 로컬 테스트

```bash
# 개발 서버 실행 (Next.js + FastAPI)
npm run dev

# 프로덕션 빌드 테스트
npm run build

# 타입 체크
npm run typecheck
```

## 9. 도메인 설정 (선택사항)

Vercel Dashboard에서 커스텀 도메인 추가:
1. Settings > Domains
2. Add Domain
3. DNS 설정 (CNAME 또는 A 레코드)

## 10. 모니터링

배포 후 Vercel Dashboard에서 확인:
- Build Logs
- Function Logs
- Analytics
- Error Tracking
