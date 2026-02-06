# Tech Seminars Section

기술공유 세미나 섹션 컴포넌트입니다.

## 📁 파일 구조

```
tech-seminars/
├── index.ts                      # 통합 export
├── tech-seminars-section.tsx     # 메인 컴포넌트
├── tech-seminars-content.tsx     # 데이터 표시 컴포넌트
├── tech-seminars-skeleton.tsx    # 로딩 스켈레톤
├── tech-seminars-error.tsx       # 에러/빈 데이터 상태
└── README.md                     # 문서
```

## 🎨 디자인 특징

- **아이콘**: Mic (마이크) - 네온 그린 계열
- **색상**: 그라디언트 그린/에메랄드 (`from-green-500 to-emerald-500`)
- **카드**: neon-border variant
- **레이아웃**: 연도별 그룹화, 리스트 형태
- **링크**:
  - 있을 경우: 언더라인 + ExternalLink 아이콘 + 호버 효과
  - 없을 경우: 일반 텍스트

## 📊 데이터 구조

```typescript
interface TechSeminar {
  id: string
  seminar_name: string
  seminar_url: string | null  // 선택적
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}
```

## 🔧 사용 방법

### 기본 사용

```tsx
import { TechSeminarsSection } from '@/components/sections/tech-seminars'

export default function Page() {
  return <TechSeminarsSection />
}
```

### className 전달

```tsx
<TechSeminarsSection className="mt-8" />
```

## 🎯 컴포넌트 구성

### TechSeminarsSection (메인)
- useTechSeminars() hook으로 데이터 페칭
- 로딩/에러/빈 데이터/성공 상태 분기 처리

### TechSeminarsContent
- 연도별 그룹화 (최신순)
- YearGroup: 연도 헤더 + 세미나 리스트
- SeminarItem: 개별 세미나 (링크 처리)

### TechSeminarsSkeleton
- 3개 연도 그룹 스켈레톤
- 각 그룹당 3개 아이템

### TechSeminarsError / TechSeminarsEmpty
- 에러: 붉은색 테마 + 에러 메시지
- 빈 데이터: 회색 테마 + 안내 메시지

## 📱 반응형 디자인

모든 화면 크기에서 단일 컬럼 레이아웃 사용 (리스트가 더 적합)

## ✨ UI 특징

### 연도 헤더
- 그라디언트 배경 + 그라디언트 텍스트
- 우측으로 그라데이션 라인 연결

### 세미나 아이템
- 불릿 포인트 (•)
- 링크 있을 경우:
  - 그린 언더라인 (hover 시 진해짐)
  - ExternalLink 아이콘 (hover 시 opacity 증가)
  - 새창 열기 (`target="_blank"`)

## 🔗 관련 파일

- **타입**: `/src/types/index.ts`
- **Hook**: `/src/lib/hooks/use-portfolio-data.ts` (useTechSeminars)
- **Export**: `/src/components/sections/index.ts`

## 🎨 색상 팔레트

```css
/* 네온 그린 계열 */
--green-400: #4ade80  /* 다크모드 */
--green-500: #22c55e  /* 메인 */
--green-600: #16a34a  /* 라이트모드 */

--emerald-400: #34d399  /* 다크모드 */
--emerald-500: #10b981  /* 메인 */
--emerald-600: #059669  /* 라이트모드 */
```

## 🧪 테스트

```bash
# 타입 체크
npm run typecheck

# 린트 검사
npm run lint

# 개발 서버
npm run dev
```

## 📝 참고한 패턴

- `research-section.tsx`: 유사한 구조 (year, url)
- `activities-section.tsx`: 카드 스타일
- `volunteer-section.tsx`: 간단한 레이아웃
