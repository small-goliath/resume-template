# DailyRoutineClock 컴포넌트

24시간 아날로그 루틴 시계 컴포넌트 - KST 기준 현재 시간을 표시하고 일일 루틴을 네온 스타일로 시각화합니다.

## 기능

- ✅ **24시간 아날로그 시계**: 0시부터 23시까지 표시
- ✅ **KST 시간 표시**: UTC+9 기준 실시간 시침/분침 회전
- ✅ **루틴 시각화**: 시간대별 호(Arc)로 일일 루틴 표시
- ✅ **네온 효과**: 사이버펑크 테마의 글로우 효과
- ✅ **반응형 디자인**: 모바일(280px) / 데스크톱(400px) 자동 조정
- ✅ **범례 표시**: 루틴 라벨과 색상 정보 제공

## 사용법

### 기본 사용

```tsx
import { DailyRoutineClock } from '@/components/daily-routine-clock'

export default function Page() {
  return (
    <div>
      <DailyRoutineClock />
    </div>
  )
}
```

### API 연동

이 컴포넌트는 `useDailyRoutine()` 훅을 사용하여 자동으로 데이터를 가져옵니다:

```typescript
// GET /api/daily-routine
[
  {
    "id": "1",
    "profile_id": "uuid",
    "start_hour": 7,
    "end_hour": 9,
    "label": "Morning Routine",
    "color": "neon-cyan",
    "intensity": "bright",
    "sort_order": 1,
    "created_at": "2026-02-03T00:00:00Z",
    "updated_at": "2026-02-03T00:00:00Z"
  }
]
```

## 디자인 사양

### SVG 크기
- **모바일**: 280×280px
- **데스크톱**: 400×400px

### 시계 요소
- **시침**: 길이 100px, 너비 6px, Neon Cyan (#00f0ff)
- **분침**: 길이 130px, 너비 3px, Neon Magenta (#ff00ff)
- **중앙 텍스트**: "small-goliath" 고정 표시

### 색상 매핑
| 색상 이름 | 색상 코드 | 용도 |
|----------|---------|------|
| `neon-cyan` | `#00f0ff` | 시침, 메인 강조 |
| `neon-magenta` | `#ff00ff` | 분침, 보조 강조 |
| `neon-purple` | `#9d00ff` | 액센트 |
| `neon-green` | `#00ff41` | 터미널 느낌 |
| `neon-orange` | `#ff6b00` | 경고/중요 |

### 글로우 강도
| 강도 | 투명도 | Blur | 용도 |
|-----|-------|------|------|
| `dim` | 0.3 | 8px | 수면 시간 등 |
| `medium` | 0.5 | 12px | 일반 활동 |
| `bright` | 0.8 | 16px | 중요 루틴 |

## 데이터 구조

### DailyRoutine 타입

```typescript
interface DailyRoutine {
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

## 자정 경계 처리

루틴이 자정을 넘어가는 경우 (예: 22시 ~ 5시) 자동으로 처리됩니다:

```typescript
{
  "start_hour": 22, // 오후 10시
  "end_hour": 6,    // 오전 6시
  "label": "Sleep"
}
```

Arc가 22시부터 시작하여 0시를 넘어 6시까지 연속으로 표시됩니다.

## 상태 처리

### 로딩 상태
```tsx
<div className="animate-pulse">Loading...</div>
```

### 에러 상태
```tsx
<div className="border border-neon-orange-500">
  Error loading routines: {error.message}
</div>
```

### 빈 데이터
```tsx
// 루틴이 없으면 시계만 표시됩니다
```

## 성능 최적화

- ✅ **1초 간격 업데이트**: setInterval로 시침/분침만 업데이트
- ✅ **SVG 필터 캐싱**: 각 루틴의 글로우 필터 재사용
- ✅ **CSS Transition**: GPU 가속 transform 사용
- ✅ **메모이제이션**: 불필요한 리렌더링 방지

## 접근성

- ✅ **시맨틱 SVG**: 적절한 aria-label 사용 가능
- ✅ **텍스트 가독성**: 네온 효과로 명확한 대비
- ✅ **반응형 크기**: 모바일에서도 가독성 유지

## 데모 페이지

개발 서버에서 다음 URL로 접근:

```
http://localhost:3000/demo/routine-clock
```

## 문제 해결

### API 호출 실패
- FastAPI 서버가 실행 중인지 확인: `npm run dev`
- 환경변수 설정 확인: `.env.local`
- 네트워크 오류 확인: 개발자 도구 Console 탭

### 시간이 표시되지 않음
- 브라우저의 JavaScript가 활성화되어 있는지 확인
- 콘솔에 에러가 있는지 확인

### 루틴 호(Arc)가 표시되지 않음
- API 응답 데이터 형식 확인
- `start_hour`, `end_hour`가 0-23 범위인지 확인
- 색상/강도 값이 유효한지 확인

## 커스터마이징

### 시계 크기 변경

```tsx
// 더 큰 시계
<svg
  viewBox="0 0 400 400"
  className="h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
>
```

### 색상 변경

`COLOR_MAP` 객체를 수정하여 색상 커스터마이징:

```typescript
const COLOR_MAP = {
  'neon-cyan': '#00f0ff',
  'neon-magenta': '#ff00ff',
  // 커스텀 색상 추가
}
```

### 글로우 강도 조정

`INTENSITY_MAP` 객체를 수정:

```typescript
const INTENSITY_MAP = {
  dim: { opacity: 0.2, blur: 6 },
  medium: { opacity: 0.4, blur: 10 },
  bright: { opacity: 0.7, blur: 14 },
}
```

## 의존성

- `react`: ^19.0.0
- `@/lib/hooks/use-portfolio-data`: SWR 기반 데이터 페칭
- `@/types`: TypeScript 타입 정의

## 라이선스

이 컴포넌트는 프로젝트의 라이선스를 따릅니다.
