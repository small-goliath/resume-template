# 섹션 네비게이션 컴포넌트 가이드

## 개요

포트폴리오 섹션을 탭 형태로 표시하는 현대적이고 개발자스러운 UI 컴포넌트입니다.

### 주요 특징

- 🎨 **현대적인 디자인**: 카드 기반의 미니멀한 탭 디자인
- 💻 **개발자스러운 감성**: 다크모드 친화적, 세련된 애니메이션
- 📱 **완벽한 반응형**: 모바일 가로스크롤 → 데스크톱 그리드 레이아웃
- ⚡ **부드러운 애니메이션**: 호버, 선택 상태 전환 효과
- ♿ **접근성**: 키보드 네비게이션, ARIA 속성, 스크린리더 지원
- 🌙 **다크모드**: 완벽한 다크모드 지원

## 컴포넌트 구조

### 1. `SectionNavigation`

메인 탭 네비게이션 컴포넌트

### 2. `SectionContent`

탭 컨텐츠 래퍼 컴포넌트 (Card + TabsContent)

### 3. 헬퍼 컴포넌트

- `SimpleSectionContent` - 간단한 섹션 (제목 없음)
- `LoadingSectionContent` - 로딩 상태
- `ErrorSectionContent` - 에러 상태
- `EmptySectionContent` - 빈 상태

## 기본 사용법

```tsx
import { SectionNavigation, SimpleSectionContent } from '@/components/sections'

export default function PortfolioPage() {
  return (
    <SectionNavigation defaultSection="timeline">
      <SimpleSectionContent value="timeline">
        {/* 타임라인 컨텐츠 */}
      </SimpleSectionContent>

      <SimpleSectionContent value="education">
        {/* 교육사항 컨텐츠 */}
      </SimpleSectionContent>

      {/* ... 나머지 섹션들 */}
    </SectionNavigation>
  )
}
```

## 고급 사용법

### 제목과 설명이 있는 섹션

```tsx
import { SectionNavigation, SectionContent } from '@/components/sections'
;<SectionNavigation>
  <SectionContent
    value="timeline"
    title="경력 타임라인"
    description="주요 경력 사항을 시간순으로 정리했습니다"
    variant="elevated"
  >
    {/* 컨텐츠 */}
  </SectionContent>
</SectionNavigation>
```

### Card variant 종류

```tsx
// 기본 카드
<SectionContent value="timeline" variant="default">

// 입체감 있는 카드
<SectionContent value="timeline" variant="elevated">

// Glassmorphism 효과
<SectionContent value="timeline" variant="glass">

// 아웃라인 강조
<SectionContent value="timeline" variant="outline">

// 미니멀 디자인
<SectionContent value="timeline" variant="minimal">

// 네온 효과 (개발자스러운)
<SectionContent value="timeline" variant="neon">
```

### Card 없이 순수 컨텐츠만

```tsx
<SectionContent value="skills" title="기술 역량" hideCard={true}>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* 커스텀 레이아웃 */}
  </div>
</SectionContent>
```

### 로딩/에러/빈 상태 처리

```tsx
import {
  LoadingSectionContent,
  ErrorSectionContent,
  EmptySectionContent,
} from "@/components/sections"

// 로딩 중
<LoadingSectionContent value="internships" title="인턴십 경험" />

// 에러 발생
<ErrorSectionContent
  value="research"
  title="연구활동"
  error="네트워크 연결을 확인해주세요"
/>

// 데이터 없음
<EmptySectionContent
  value="volunteer"
  title="봉사활동"
  message="아직 등록된 봉사활동이 없습니다"
/>
```

## Props 상세

### SectionNavigation Props

| Prop             | Type              | Default      | Description            |
| ---------------- | ----------------- | ------------ | ---------------------- |
| `defaultSection` | `string`          | `"timeline"` | 초기 선택 섹션 ID      |
| `children`       | `React.ReactNode` | -            | TabsContent 컴포넌트들 |
| `className`      | `string`          | -            | 추가 CSS 클래스        |

### SectionContent Props

| Prop          | Type              | Default     | Description             |
| ------------- | ----------------- | ----------- | ----------------------- |
| `value`       | `string`          | -           | 섹션 ID (필수)          |
| `title`       | `string`          | -           | 섹션 제목               |
| `description` | `string`          | -           | 섹션 설명               |
| `children`    | `React.ReactNode` | -           | 컨텐츠                  |
| `className`   | `string`          | -           | 추가 CSS 클래스         |
| `variant`     | `CardVariant`     | `"default"` | 카드 스타일             |
| `hideCard`    | `boolean`         | `false`     | Card 없이 컨텐츠만 표시 |

## 섹션 ID 목록

```typescript
export const PORTFOLIO_SECTIONS: Section[] = [
  { id: 'timeline', label: '타임라인', icon: Calendar },
  { id: 'education', label: '교육사항', icon: GraduationCap },
  { id: 'skills', label: '역량', icon: Code },
  { id: 'peer-reviews', label: '동료평가', icon: Users },
  { id: 'projects', label: '사이드프로젝트', icon: Rocket },
  { id: 'awards', label: '수상', icon: Trophy },
  { id: 'internships', label: '인턴십', icon: Building },
  { id: 'research', label: '연구활동', icon: FlaskConical },
  { id: 'volunteer', label: '봉사활동', icon: Heart },
  { id: 'activities', label: '대외활동', icon: Target },
]
```

## 반응형 동작

### 모바일 (< 768px)

- 가로 스크롤 TabsList
- 아이콘만 표시 (텍스트 숨김)
- 최소 너비 4.5rem
- 스크롤 힌트 그라디언트

### 태블릿 (768px ~ 1024px)

- 가로 스크롤 + flex-wrap
- 아이콘 + 축약 텍스트 표시
- 최소 너비 5.5rem

### 데스크톱 (1024px+)

- 그리드 레이아웃 (lg: 5열, xl: 10열)
- 아이콘 + 전체 텍스트 표시
- 스크롤 불필요

## 접근성

- ✅ 키보드 네비게이션 (Tab, Arrow keys)
- ✅ ARIA 속성 (`aria-hidden`, `role`, `aria-selected`)
- ✅ 스크린리더 지원 (`sr-only` 텍스트)
- ✅ 포커스 인디케이터 (ring-2)
- ✅ 명확한 선택 상태 표시

## 스타일 커스터마이징

### TailwindCSS 클래스 오버라이드

```tsx
<SectionNavigation className="my-custom-class">
  <SectionContent value="timeline" className="my-content-class">
    {/* ... */}
  </SectionContent>
</SectionNavigation>
```

### CSS 변수 활용

컴포넌트는 Tailwind의 디자인 토큰을 사용합니다:

- `--border` - 테두리 색상
- `--primary` - 강조 색상
- `--accent` - 보조 색상
- `--muted-foreground` - 비활성 텍스트 색상
- `--foreground` - 활성 텍스트 색상

## 예제 파일

전체 예제는 다음 파일을 참조하세요:

- `src/components/sections/section-navigation-example.tsx`

## 문제 해결

### 탭이 보이지 않아요

- `TabsContent`의 `value`가 `PORTFOLIO_SECTIONS`의 `id`와 일치하는지 확인
- `SectionNavigation`의 children으로 TabsContent를 전달했는지 확인

### 스크롤이 작동하지 않아요

- 부모 컨테이너에 `overflow: hidden`이 적용되지 않았는지 확인
- 충분한 컨텐츠가 있는지 확인

### 다크모드가 작동하지 않아요

- Next.js의 다크모드 설정이 활성화되어 있는지 확인
- `dark:` prefix가 있는 클래스들이 올바르게 적용되는지 확인

## 성능 최적화

- ✅ 컴포넌트 메모이제이션 없음 (정적 마크업)
- ✅ CSS transitions만 사용 (JavaScript 애니메이션 없음)
- ✅ 가벼운 lucide-react 아이콘
- ✅ 지연 로딩 불필요 (작은 번들 크기)

## 다음 단계

1. 각 섹션별 실제 데이터 컴포넌트 구현
2. API 연동하여 동적 데이터 표시
3. 로딩/에러 처리 로직 추가
4. URL 기반 섹션 선택 구현 (Deep linking)

## 관련 문서

- [Card 컴포넌트 가이드](./card-guide.md)
- [Tabs 컴포넌트 가이드](./tabs-guide.md)
- [스타일링 가이드](./styling-guide.md)
