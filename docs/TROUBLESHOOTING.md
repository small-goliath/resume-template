# 문제 해결 가이드

## 타임라인 추가 실패 문제 (2024-01-XX)

### 문제 상황
- 관리자 페이지 `/admin/timeline`에서 타임라인 추가 시도
- "타임라인 추가에 실패했습니다" 에러 메시지 표시
- 로그인은 정상 작동 (admin_token 쿠키 설정됨)

### 문제 분석

#### 1. 프론트엔드 (`/admin/timeline/page.tsx`)
- ✅ API 클라이언트 호출 정상: `apiClient.post('/timeline', payload)`
- ✅ credentials: 'include' 설정되어 쿠키 전송됨
- ✅ events 배열 변환 로직 정상
- ❌ 에러 메시지가 너무 일반적 (상세 정보 부족)

#### 2. API 클라이언트 (`src/lib/api-client.ts`)
- ✅ POST 메서드 구현 정상
- ✅ credentials: 'include' 설정됨
- ✅ Content-Type: application/json 헤더 설정됨
- ✅ 에러 핸들링 구조 정상

#### 3. FastAPI 백엔드 (`api/index.py`)
- ❌ **인증 검증 누락**: POST /timeline 엔드포인트가 쿠키를 확인하지 않음
- ❌ **Pydantic 모델 없음**: dict로만 받아서 데이터 검증 불가
- ❌ **에러 로깅 부족**: Supabase 에러의 상세 정보를 확인할 수 없음
- ✅ Service Role Key 사용 중 (RLS 무시)

#### 4. 데이터베이스 (Supabase)
- ✅ timeline 테이블 구조 정상
- ✅ events는 TEXT[] 타입 (PostgreSQL 배열)
- ⚠️ RLS 활성화되어 있지만 INSERT/UPDATE/DELETE 정책 없음
- ✅ Service Role Key 사용 시 RLS 무시되므로 실제로는 문제 없음

### 근본 원인 (추정)

**가능성 1: 인증 실패**
- FastAPI가 쿠키의 admin_token을 검증하지 않음
- 관리자 권한 없이 쓰기 작업 시도 → 실패

**가능성 2: 데이터 검증 실패**
- timeline_data 구조가 Supabase 스키마와 불일치
- Pydantic 모델이 없어서 사전 검증 불가

**가능성 3: Supabase 에러**
- Service Role Key가 제대로 설정되지 않음
- 네트워크 오류 또는 Supabase 연결 실패
- 에러 로깅이 부족해서 원인 파악 불가

### 해결 방법

#### 1. FastAPI 백엔드 개선 (핵심)

**A. Pydantic 모델 추가**
```python
from pydantic import BaseModel, Field
from typing import List

class TimelineCreate(BaseModel):
    year: int = Field(..., ge=1900, le=2100)
    company: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=200)
    events: List[str] = Field(..., min_length=1)
    sort_order: int = Field(default=0, ge=0)
```

**B. 인증 의존성 추가**
```python
from fastapi import Cookie, Depends, HTTPException

def verify_admin_token(admin_token: Optional[str] = Cookie(None)):
    if not ADMIN_SECRET_TOKEN:
        raise HTTPException(status_code=500, detail="Admin token not configured")
    if not admin_token or admin_token != ADMIN_SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return admin_token
```

**C. 엔드포인트 수정**
```python
@app.post("/timeline")
async def create_timeline(
    timeline_data: TimelineCreate,
    _: str = Depends(verify_admin_token)
):
    try:
        payload = timeline_data.model_dump()
        print(f"[DEBUG] Creating timeline: {payload}")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("timeline").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="No data returned")

        return {
            "message": "Timeline entry created successfully",
            "data": response.data[0]
        }
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
```

#### 2. 프론트엔드 에러 처리 개선

**A. 상세한 에러 메시지 표시**
```typescript
catch (error) {
  const errorMessage = error && typeof error === 'object' && 'message' in error
    ? (error as { message: string }).message
    : '알 수 없는 오류가 발생했습니다'

  console.error('[ERROR] 타임라인 저장 실패:', {
    error,
    errorMessage,
    statusCode: (error as any)?.statusCode,
  })

  toast.error(`타임라인 추가에 실패했습니다: ${errorMessage}`)
}
```

**B. 디버깅 로그 추가**
```typescript
console.log('[DEBUG] 전송할 payload:', payload)
```

#### 3. 데이터베이스 RLS 정책 추가 (선택)

Service Role Key 사용 시 RLS를 무시하므로 필수는 아니지만, 명시적으로 정책을 추가하면 더 안전합니다.

```sql
-- docs/database/rls-policies.sql 파일 참조
CREATE POLICY "Enable insert for service role" ON timeline FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON timeline FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON timeline FOR DELETE USING (true);
```

### 테스트 절차

#### 1. 로컬 개발 환경
```bash
# 1. 개발 서버 재시작
npm run dev

# 2. 브라우저 개발자 도구 열기 (F12)
# 3. Console 탭에서 로그 확인
# 4. Network 탭에서 POST /api/timeline 요청 확인
```

#### 2. 확인 사항
- [ ] Console에 `[DEBUG] 전송할 payload:` 로그 출력
- [ ] Network 탭에서 Request Payload 확인
- [ ] Response 상태 코드 확인 (200 OK 또는 4xx/5xx)
- [ ] Response Body에 에러 detail 확인
- [ ] Application 탭에서 Cookies → admin_token 존재 확인

#### 3. FastAPI 로그 확인 (Vercel)
```bash
# Vercel에 배포 후
vercel logs

# 또는 Vercel Dashboard → Functions → Logs
```

확인할 로그:
- `[DEBUG] Creating timeline with payload: {...}`
- `[DEBUG] Supabase response: {...}`
- `[ERROR] Failed to create timeline: ...`

### 추가 권장사항

#### 1. 환경변수 확인
```bash
# .env.local 파일에 다음 변수들이 모두 설정되어 있는지 확인
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SECRET_TOKEN=your-secure-token
```

#### 2. Supabase 연결 테스트
```bash
curl https://your-domain.vercel.app/api/health

# 응답 확인:
# {
#   "status": "healthy",
#   "database": {
#     "connected": true
#   }
# }
```

#### 3. 관리자 인증 테스트
```bash
# 로그인 후 쿠키 확인
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"token":"your-admin-token"}' \
  -c cookies.txt

# 쿠키로 타임라인 생성 테스트
curl -X POST https://your-domain.vercel.app/api/timeline \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "year": 2024,
    "company": "Test Company",
    "role": "Test Role",
    "events": ["Event 1", "Event 2"],
    "sort_order": 0
  }'
```

### 향후 개선 사항

1. **API 에러 타입 정의**
   - 프론트엔드에 명확한 에러 타입 추가
   - 상태 코드별 에러 메시지 표준화

2. **통합 테스트 추가**
   - Timeline CRUD 작업의 end-to-end 테스트
   - 인증 실패 케이스 테스트

3. **모니터링 도구 연동**
   - Sentry 등으로 프로덕션 에러 추적
   - FastAPI 로그를 구조화된 JSON 형식으로 출력

4. **다른 엔드포인트에도 동일한 패턴 적용**
   - Education, Skills, Projects 등 다른 리소스
   - 일관된 인증 및 검증 로직

### 참고 문서

- FastAPI 의존성 주입: https://fastapi.tiangolo.com/tutorial/dependencies/
- Pydantic 모델 검증: https://docs.pydantic.dev/latest/
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- Next.js 쿠키 처리: https://nextjs.org/docs/app/api-reference/functions/cookies
