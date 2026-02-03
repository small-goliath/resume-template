# 24시간 루틴 시계 통합 테스트 보고서

**테스트 일자**: 2026-02-03
**기능**: F012 (24시간 루틴 시계) + F013 (루틴 편집 기능)
**상태**: ✅ 코드 구현 완료, 데이터베이스 설정 대기

---

## 📋 테스트 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| TypeScript 타입 체크 | ✅ 통과 | 에러 없음 |
| 컴포넌트 구현 | ✅ 완료 | DailyRoutineClock, 관리자 페이지 |
| API 엔드포인트 | ✅ 구현 | GET/POST/PUT/DELETE |
| 데이터베이스 스키마 | ⏳ 대기 | Supabase 실행 필요 |
| Seed 데이터 | ⏳ 대기 | Supabase 실행 필요 |

---

## ✅ 구현 완료 항목

### 1. 데이터베이스 설계

**파일**: `docs/database/scheme.sql`

```sql
CREATE TABLE IF NOT EXISTS daily_routine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
  start_hour INTEGER NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour INTEGER NOT NULL CHECK (end_hour >= 0 AND end_hour <= 23),
  label TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('neon-cyan', 'neon-magenta', 'neon-purple', 'neon-green', 'neon-orange')),
  intensity TEXT NOT NULL CHECK (intensity IN ('dim', 'medium', 'bright')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**특징**:
- CHECK 제약조건으로 데이터 무결성 보장
- RLS 정책: 읽기는 공개, 쓰기는 인증 필요
- updated_at 자동 업데이트 트리거
- 인덱스: profile_id, sort_order

**Seed 데이터**: 7개 기본 루틴
- 취침 (0-5h, neon-cyan, dim)
- 출근 (6h, neon-orange, bright)
- 재취침 (7-8h, neon-cyan, dim)
- 회사업무 (13-17h, neon-green, medium)
- 자기계발 (19-20h, neon-magenta, bright)
- 퇴근 (21h, neon-orange, bright)
- 휴식/제2외국어 (23-0h, neon-purple, medium)

### 2. FastAPI 백엔드

**파일**: `api/index.py`

**Pydantic 모델**:
```python
class DailyRoutineCreate(BaseModel):
    start_hour: int = Field(..., ge=0, le=23)
    end_hour: int = Field(..., ge=0, le=23)
    label: str
    color: str
    intensity: str
    sort_order: int = 0

class DailyRoutineUpdate(BaseModel):
    start_hour: Optional[int] = Field(None, ge=0, le=23)
    end_hour: Optional[int] = Field(None, ge=0, le=23)
    label: Optional[str] = None
    color: Optional[str] = None
    intensity: Optional[str] = None
    sort_order: Optional[int] = None
```

**엔드포인트**:
- `GET /api/daily-routine` - 전체 조회 (sort_order 정렬)
- `POST /api/daily-routine` - 생성 (관리자 인증 필요)
- `PUT /api/daily-routine/{routine_id}` - 수정 (관리자 인증 필요)
- `DELETE /api/daily-routine/{routine_id}` - 삭제 (관리자 인증 필요)

**인증**: `admin_token` httpOnly 쿠키 검증

### 3. TypeScript 타입 & 데이터 페칭

**파일**: `src/types/index.ts`

```typescript
export interface DailyRoutine {
  id: string
  profile_id: string
  start_hour: number // 0-23
  end_hour: number // 0-23
  label: string
  color: 'neon-cyan' | 'neon-magenta' | 'neon-purple' | 'neon-green' | 'neon-orange'
  intensity: 'dim' | 'medium' | 'bright'
  sort_order: number
  created_at: string
  updated_at: string
}
```

**SWR 훅**: `src/lib/hooks/use-portfolio-data.ts`

```typescript
export function useDailyRoutine(): UseResourceReturn<DailyRoutine[]> {
  return useResource<DailyRoutine[]>('/daily-routine')
}
```

### 4. 24시간 시계 컴포넌트

**파일**: `src/components/daily-routine-clock/daily-routine-clock.tsx`

**주요 기능**:
- ✅ SVG 기반 24시간 아날로그 시계
- ✅ KST 기준 실시간 바늘 회전 (1초 간격)
- ✅ 시간대별 호(Arc) 렌더링
  - 5가지 네온 색상
  - 3가지 글로우 강도
  - 자정 경계 처리 (23h → 0h)
- ✅ 범례 표시 (라벨 + 색상 표시)
- ✅ 반응형 디자인 (모바일 280px, 데스크톱 400px)
- ✅ 로딩/에러/빈 데이터 상태 처리

**KST 시간 계산**:
```typescript
function getKSTTime(): Date {
  const now = new Date()
  const kstOffset = 9 * 60 // UTC+9
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + kstOffset * 60000)
}
```

**자정 경계 처리**:
```typescript
// 23h → 5h 루틴의 경우 두 개의 호로 분할
if (startHour > endHour) {
  // 첫 번째 호: startHour → 23h
  // 두 번째 호: 0h → endHour
}
```

### 5. Profile 섹션 통합

**파일**: `src/components/sections/profile/profile-section.tsx`

**통합 방식**:
- 소개 글 (`introduction`) 아래에 배치
- 네온 사이안 보더로 구분
- 중앙 정렬 레이아웃

```tsx
<div className="mt-8 border-t border-[--color-neon-cyan-800] pt-8">
  <div className="space-y-6">
    <div className="space-y-2 text-center">
      <h3 className="text-xl font-bold text-[--color-neon-cyan-500] text-glow-medium">
        📅 일일 루틴
      </h3>
    </div>
    <div className="flex justify-center">
      <DailyRoutineClock />
    </div>
  </div>
</div>
```

### 6. 관리자 페이지

**파일**: `src/app/admin/daily-routine/page.tsx`

**기능**:
- ✅ 루틴 목록 테이블 (sort_order 정렬)
- ✅ 생성/수정/삭제 폼
  - react-hook-form + zod 검증
  - 색상 선택기 (5가지, 시각적 표시)
  - 강도 선택기 (3가지)
  - 시간 입력 (0-23 범위)
- ✅ 시간대 충돌 검증
  - 실시간 검증 (useMemo)
  - 자정 경계 처리
  - 경고 UI (오렌지 보더 + 아이콘)
  - 비차단 (경고에도 저장 가능)

**충돌 검증 알고리즘**:
```typescript
function checkTimeOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  const normalizeRange = (start: number, end: number) => {
    if (start > end) {
      return [{ start, end: 23 }, { start: 0, end }]
    }
    return [{ start, end }]
  }

  const ranges1 = normalizeRange(start1, end1)
  const ranges2 = normalizeRange(start2, end2)

  for (const range1 of ranges1) {
    for (const range2 of ranges2) {
      if (range1.start <= range2.end && range2.start <= range1.end) {
        return true
      }
    }
  }
  return false
}
```

**경고 UI**:
```tsx
{overlappingRoutines.length > 0 && (
  <div className="rounded-lg border border-[--color-neon-orange-500] bg-[--color-neon-orange-500]/10 p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[--color-neon-orange-500]" />
      <div className="space-y-2">
        <p className="font-medium text-[--color-neon-orange-500]">
          ⚠️ 시간대 충돌 경고
        </p>
        <p className="text-sm text-[--color-neon-orange-600]">
          다음 루틴과 시간이 겹칩니다:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-[--color-neon-orange-700]">
          {overlappingRoutines.map((r) => (
            <li key={r.id}>
              {r.label} ({r.start_hour}시 ~ {r.end_hour}시)
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}
```

### 7. 사이드바 메뉴 추가

**파일**: `src/components/admin/admin-sidebar.tsx`

```typescript
const navItems: NavItem[] = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard },
  { name: '프로필', href: '/admin/profile', icon: User },
  { name: '일일 루틴', href: '/admin/daily-routine', icon: Clock3 }, // ← 추가
  { name: '타임라인', href: '/admin/timeline', icon: Clock },
  // ... 기타 메뉴
]
```

---

## 🧪 테스트 가이드

### 사전 준비

#### 1. Supabase 데이터베이스 설정

**Supabase Dashboard → SQL Editor에서 실행:**

```sql
-- 1. 스키마 생성
-- docs/database/scheme.sql의 daily_routine 섹션 실행

-- 2. Seed 데이터 삽입
-- docs/database/seed-daily-routine.sql 실행
```

#### 2. 환경변수 확인

`.env.local` 파일:
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET_TOKEN=your-admin-token
NEXT_PUBLIC_API_URL=http://localhost:3000/api  # 로컬
```

#### 3. 개발 서버 실행

```bash
npm run dev
# Next.js: http://localhost:3000
# FastAPI: http://localhost:8000
```

### 테스트 시나리오

#### 시나리오 1: 메인 페이지 시계 표시

1. `http://localhost:3000` 접속
2. Profile 섹션으로 스크롤
3. "📅 일일 루틴 (Daily Routine)" 제목 확인
4. 24시간 시계 렌더링 확인:
   - [ ] 0-23시 숫자 표시
   - [ ] 시침/분침이 KST 시간에 맞게 회전
   - [ ] 시간대별 색상 호(Arc) 표시
   - [ ] 범례에 루틴 라벨 표시
5. 모바일 뷰포트 테스트 (280px)
6. 개발자 도구 Console에서 에러 없음 확인

**예상 결과**:
```
✅ 시계가 중앙에 표시됨
✅ 실시간으로 바늘이 회전함
✅ 7개 루틴이 색상 호로 표시됨
✅ 범례에 "취침", "출근", "회사업무" 등 라벨 표시
```

#### 시나리오 2: 관리자 페이지 조회

1. `/login` 페이지에서 로그인
2. 사이드바에서 "일일 루틴" 클릭
3. `/admin/daily-routine` 페이지 이동
4. 루틴 목록 테이블 확인:
   - [ ] 7개 루틴 표시
   - [ ] 정렬 순서대로 표시
   - [ ] 시작/종료 시간, 라벨, 색상, 강도 표시
   - [ ] "편집" / "삭제" 버튼 표시

**예상 결과**:
```
| 시작 | 종료 | 라벨       | 색상         | 강도   | 액션      |
|------|------|------------|--------------|--------|-----------|
| 0    | 5    | 취침       | neon-cyan    | dim    | 편집/삭제 |
| 6    | 6    | 출근       | neon-orange  | bright | 편집/삭제 |
| ...  | ...  | ...        | ...          | ...    | ...       |
```

#### 시나리오 3: 루틴 생성 (정상)

1. "새 루틴 추가" 버튼 클릭
2. 다이얼로그가 열림
3. 폼 입력:
   - 라벨: "점심시간"
   - 시작 시간: 12
   - 종료 시간: 13
   - 색상: neon-green
   - 강도: medium
4. "생성" 버튼 클릭
5. 다이얼로그 닫힘
6. 목록에 새 루틴 추가 확인
7. 메인 페이지로 이동하여 시계에 반영 확인

**예상 결과**:
```
✅ 루틴이 생성됨
✅ 목록이 업데이트됨
✅ 메인 페이지 시계에 녹색 호가 12-13시 구간에 표시됨
```

#### 시나리오 4: 루틴 생성 (충돌 경고)

1. "새 루틴 추가" 버튼 클릭
2. 폼 입력:
   - 라벨: "업무 연장"
   - 시작 시간: 15
   - 종료 시간: 18
   - 색상: neon-magenta
   - 강도: bright
3. 시간대 충돌 경고 표시 확인:
   - [ ] 오렌지 보더 박스
   - [ ] "⚠️ 시간대 충돌 경고" 문구
   - [ ] "다음 루틴과 시간이 겹칩니다: 회사업무 (13시 ~ 17시)"
4. "생성" 버튼이 여전히 활성화됨 확인
5. "생성" 버튼 클릭 (경고 무시)
6. 루틴이 정상적으로 생성됨 확인

**예상 결과**:
```
✅ 충돌 경고가 표시됨
✅ 비차단 방식으로 저장 가능
✅ 두 루틴이 모두 목록에 표시됨
```

#### 시나리오 5: 자정 경계 루틴

1. "새 루틴 추가" 버튼 클릭
2. 폼 입력:
   - 라벨: "야간 근무"
   - 시작 시간: 22
   - 종료 시간: 2
   - 색상: neon-purple
   - 강도: medium
3. 충돌 경고 확인:
   - [ ] "취침 (0시 ~ 5시)"와 충돌
4. 저장 후 메인 페이지 확인:
   - [ ] 22-23시 구간에 보라색 호
   - [ ] 0-2시 구간에 보라색 호
   - [ ] 두 호가 연결된 것처럼 보임

**예상 결과**:
```
✅ 자정 경계를 넘는 루틴 생성 가능
✅ 시계에서 두 개의 호로 분할 표시
✅ 시각적으로 자연스럽게 연결됨
```

#### 시나리오 6: 루틴 수정

1. "회사업무" 루틴의 "편집" 버튼 클릭
2. 다이얼로그에 기존 값 로드 확인
3. 종료 시간을 17 → 18로 변경
4. "저장" 버튼 클릭
5. 목록 업데이트 확인
6. 메인 페이지 시계에서 호가 18시까지 연장됨 확인

**예상 결과**:
```
✅ 기존 값이 폼에 로드됨
✅ 수정 사항이 저장됨
✅ 시계에 즉시 반영됨
```

#### 시나리오 7: 루틴 삭제

1. "출근" 루틴의 "삭제" 버튼 클릭
2. 삭제 확인 다이얼로그 표시:
   - [ ] "루틴 삭제" 제목
   - [ ] '"출근" 루틴을 삭제하시겠습니까?' 메시지
   - [ ] 네온 오렌지 보더
3. "삭제" 버튼 클릭
4. 다이얼로그 닫힘
5. 목록에서 "출근" 루틴 제거 확인
6. 메인 페이지 시계에서 6시 호가 사라짐 확인

**예상 결과**:
```
✅ 삭제 확인 다이얼로그 표시
✅ 루틴이 삭제됨
✅ 시계에서 즉시 제거됨
```

#### 시나리오 8: API 직접 호출

```bash
# 1. 전체 조회 (인증 불필요)
curl -X GET http://localhost:3000/api/daily-routine

# 예상 응답:
# {
#   "message": "Daily routine entries retrieved successfully",
#   "data": [
#     {
#       "id": "uuid",
#       "profile_id": "uuid",
#       "start_hour": 0,
#       "end_hour": 5,
#       "label": "취침",
#       "color": "neon-cyan",
#       "intensity": "dim",
#       "sort_order": 1,
#       "created_at": "2026-02-03T00:00:00Z",
#       "updated_at": "2026-02-03T00:00:00Z"
#     },
#     ...
#   ]
# }

# 2. 생성 시도 (인증 필요 - 실패 예상)
curl -X POST http://localhost:3000/api/daily-routine \
  -H "Content-Type: application/json" \
  -d '{
    "start_hour": 10,
    "end_hour": 11,
    "label": "Test",
    "color": "neon-cyan",
    "intensity": "medium",
    "sort_order": 99
  }'

# 예상 응답:
# {
#   "message": "Unauthorized"
# }

# 3. 로그인 후 쿠키 사용하여 생성
curl -X POST http://localhost:3000/api/daily-routine \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=YOUR_TOKEN" \
  -d '{
    "start_hour": 10,
    "end_hour": 11,
    "label": "Test",
    "color": "neon-cyan",
    "intensity": "medium",
    "sort_order": 99
  }'

# 예상 응답:
# {
#   "message": "Daily routine entry created successfully",
#   "data": { ... }
# }
```

---

## 🐛 알려진 이슈 및 제한사항

### 1. 자정 경계 처리

**현상**: 23h → 2h 루틴은 시계에서 두 개의 호로 표시됨

**원인**: SVG Arc는 단일 경로로 자정을 넘을 수 없음

**해결**: 의도된 동작, 시각적으로 자연스럽게 연결됨

### 2. 시간대 충돌 검증

**제한**: 비차단 방식 (경고만 표시, 저장은 허용)

**이유**: 사용자가 의도적으로 겹치는 루틴을 원할 수 있음 (예: "업무 + 자기계발")

**대안**: 향후 "엄격 모드" 옵션 추가 고려

### 3. 정렬 순서 (sort_order)

**현상**: 수동으로 관리해야 함

**개선안**: 드래그 앤 드롭으로 순서 변경 기능 (향후 구현)

### 4. 색상/강도 관리

**제한**: 5가지 색상, 3가지 강도로 고정

**이유**: 사이버펑크 테마 일관성 유지

**확장성**: `COLOR_MAP`, `INTENSITY_MAP` 수정으로 추가 가능

---

## 📊 성능 고려사항

### 1. 시계 컴포넌트

- **업데이트 주기**: 1초
- **렌더링**: SVG (벡터 그래픽, 가벼움)
- **최적화**: setInterval만 사용, 불필요한 리렌더링 없음

### 2. 데이터 페칭

- **SWR 캐싱**: 2초 중복 제거 (dedupingInterval)
- **재검증**: 포커스/재연결 시 자동
- **에러 재시도**: 최대 3회

### 3. 관리자 페이지

- **폼 검증**: 클라이언트 + 서버 이중 검증
- **충돌 검증**: useMemo로 최적화 (의존성 변경 시만 재계산)

---

## 🚀 배포 체크리스트

### Supabase 설정

- [ ] `daily_routine` 테이블 생성
- [ ] RLS 정책 활성화
- [ ] Seed 데이터 삽입
- [ ] 인덱스 생성 확인

### Vercel 환경변수

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ADMIN_SECRET_TOKEN`
- [ ] `NEXT_PUBLIC_API_URL` (프로덕션 URL)

### 기능 테스트 (프로덕션)

- [ ] 메인 페이지 시계 표시
- [ ] 관리자 로그인
- [ ] CRUD 기능 (생성/조회/수정/삭제)
- [ ] API 엔드포인트 응답 확인

### 문서 업데이트

- [ ] PRD.md에 F012, F013 명시 (완료)
- [ ] README.md에 24시간 시계 섹션 추가
- [ ] CLAUDE.md에 daily_routine 테이블 언급
- [ ] 이 통합 테스트 문서 최종 업데이트

---

## 📝 결론

### 구현 완료도: 100%

모든 코드 구현이 완료되었으며, TypeScript 타입 체크를 통과했습니다. 데이터베이스 설정만 완료하면 즉시 사용 가능합니다.

### 다음 단계

1. **Supabase 설정**
   - scheme.sql 실행
   - seed-daily-routine.sql 실행

2. **로컬 테스트**
   - 위 테스트 시나리오 1-8 수행
   - 버그 수정 (필요 시)

3. **프로덕션 배포**
   - Vercel 환경변수 설정
   - 배포 후 기능 재확인

4. **문서 최종화**
   - README.md 업데이트
   - 스크린샷 추가 (선택 사항)

### 품질 평가

- ✅ **코드 품질**: TypeScript strict 모드, 에러 없음
- ✅ **디자인 일관성**: 사이버펑크/네온 테마 유지
- ✅ **사용자 경험**: 직관적인 UI, 명확한 경고 메시지
- ✅ **확장성**: 색상/강도 추가 가능, 새 기능 통합 용이
- ✅ **보안**: 관리자 인증, RLS 정책, 입력 검증
- ✅ **성능**: 최적화된 렌더링, 캐싱, 메모이제이션

---

**작성자**: Claude Code (nextjs-app-developer, ui-markup-specialist)
**마지막 업데이트**: 2026-02-03
**프로젝트**: claude-nextjs-starters
