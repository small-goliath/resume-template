# 교육사항 및 역량 섹션 컴포넌트

Task 8 구현 완료 문서

## 생성된 컴포넌트

### 1. EducationSection (교육사항)

**위치**: `src/components/sections/education/education-section.tsx`

**주요 기능**:
- 교육 기관, 학위/전공, 기간 정보 표시
- 2열 그리드 레이아웃 (모바일 1열, 데스크톱 2열)
- `useEducation()` hook으로 데이터 페칭
- `sort_order` 기준 자동 정렬
- 로딩 스켈레톤 UI
- 에러 처리 및 빈 데이터 처리

**디자인 특징**:
- GraduationCap 아이콘과 함께 섹션 헤더
- Card 컴포넌트로 각 교육 항목 표시
- hover:shadow-lg 효과
- bg-muted/50 배경으로 섹션 구분

**Props 타입**:
```typescript
interface Education {
  id: string
  institution_name: string
  start_year: number
  end_year: number | null
  description: string
  sort_order: number
  created_at: string
  updated_at: string
}
```

**사용 예시**:
```tsx
import { EducationSection } from '@/components/sections'

export default function Page() {
  return <EducationSection />
}
```

### 2. SkillsSection (역량)

**위치**: `src/components/sections/skills/skills-section.tsx`

**주요 기능**:
- 카테고리별 기술 스택 키워드 표시
- Badge 컴포넌트로 키워드 강조
- 카테고리마다 Card로 구분
- `useSkills()` hook으로 데이터 페칭
- 카테고리별 색상 구분 (선택적)
- 로딩 스켈레톤 UI
- 에러 처리 및 빈 데이터 처리

**디자인 특징**:
- Code2 아이콘과 함께 섹션 헤더
- 3열 그리드 레이아웃 (lg 이상)
- Badge에 카테고리별 색상 적용:
  - 언어: 파란색
  - 백엔드: 초록색
  - 데이터베이스: 보라색
  - 클라우드 및 인프라: 주황색
  - 메시징: 분홍색
  - 모니터링: 노란색
  - 빌드 툴: 청록색
  - 버전관리 및 협업: 인디고색
- hover:shadow-lg 효과

**Props 타입**:
```typescript
interface Skill {
  id: string
  category: string // '언어', '백엔드', '데이터베이스' 등
  skill_name: string
  sort_order: number
  created_at: string
  updated_at: string
}
```

**사용 예시**:
```tsx
import { SkillsSection } from '@/components/sections'

export default function Page() {
  return <SkillsSection />
}
```

## 기술 스택

- **Next.js 16**: App Router, Server/Client Components
- **TypeScript**: 완전한 타입 안전성
- **Tailwind CSS v4**: 유틸리티 우선 스타일링
- **shadcn/ui**:
  - Card 컴포넌트
  - Badge 컴포넌트
  - Skeleton 컴포넌트
- **lucide-react**: GraduationCap, Code2 아이콘
- **SWR**: 데이터 페칭 및 캐싱

## 데모 페이지

**위치**: `src/app/demo/education-skills/page.tsx`

**접속 URL**: `http://localhost:3000/demo/education-skills`

두 섹션을 함께 미리보기할 수 있는 데모 페이지가 제공됩니다.

**주의**: API가 구현되기 전까지 빈 상태로 표시됩니다.

## API 연동 상태

현재 API 엔드포인트가 아직 구현되지 않아 다음 hooks가 null을 반환합니다:

- `useEducation()` - `/api/education` (미구현)
- `useSkills()` - `/api/skills` (미구현)

hooks는 이미 구현되어 있으며, FastAPI에서 엔드포인트만 추가하면 즉시 동작합니다.

## 반응형 디자인

### EducationSection
- **모바일** (< 768px): 1열 그리드
- **데스크톱** (≥ 768px): 2열 그리드

### SkillsSection
- **모바일** (< 768px): 1열 그리드
- **태블릿** (768px - 1024px): 2열 그리드
- **데스크톱** (≥ 1024px): 3열 그리드

## 접근성

- 시맨틱 HTML 구조 (`<section>`, `<header>`)
- 명확한 텍스트 계층 구조
- 충분한 색상 대비
- 키보드 네비게이션 지원

## 스타일링 패턴

### 공통 패턴
```tsx
// 섹션 래퍼
<section className="py-16">
  <div className="container mx-auto px-4">
    {/* 콘텐츠 */}
  </div>
</section>

// 섹션 헤더
<div className="mb-12 flex items-center gap-3">
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
    <Icon className="h-6 w-6 text-primary" />
  </div>
  <div>
    <h2 className="text-3xl font-bold tracking-tight">제목</h2>
    <p className="text-muted-foreground">Subtitle</p>
  </div>
</div>

// 호버 효과 카드
<Card className="group transition-all hover:shadow-lg">
```

## 향후 개선 사항

1. **API 구현**: FastAPI에 /api/education, /api/skills 엔드포인트 추가
2. **애니메이션**: Framer Motion으로 카드 진입 애니메이션
3. **필터링**: 역량 섹션에 카테고리 필터 추가
4. **검색**: 기술 스택 검색 기능
5. **소팅**: 사용자가 정렬 방식 선택 가능

## 파일 구조

```
src/components/sections/
├── education/
│   ├── education-section.tsx  # 교육사항 섹션
│   └── index.ts               # export
├── skills/
│   ├── skills-section.tsx     # 역량 섹션
│   └── index.ts               # export
└── index.ts                   # 통합 export

src/app/demo/
└── education-skills/
    └── page.tsx               # 데모 페이지

docs/components/
└── education-skills-sections.md  # 이 문서
```

## 검증 완료

- ✅ TypeScript 타입 체크 통과
- ✅ Prettier 포맷팅 적용
- ✅ 컴포넌트 import/export 정상 동작
- ✅ 반응형 레이아웃 검증
- ✅ hooks 연동 확인

## 참고 문서

- [포트폴리오 컴포넌트 가이드](../guides/portfolio-components.md)
- [섹션 네비게이션 가이드](../guides/section-navigation-guide.md)
- [컴포넌트 패턴](../guides/component-patterns.md)
- [스타일링 가이드](../guides/styling-guide.md)
