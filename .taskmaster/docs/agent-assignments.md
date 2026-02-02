# Task 담당 에이전트 할당 가이드

## 개요

이 문서는 각 task를 어떤 에이전트가 담당할지 정의합니다.
task를 시작하기 전에 이 문서를 참고하여 적절한 에이전트를 호출하세요.

---

## 🎨 UI/마크업 전담 에이전트: `ui-markup-specialist`

다음 task들은 **ui-markup-specialist** 에이전트가 전담합니다:

---

## 🚀 디자인 철학: 현대적이고 획기적인 개발자 포트폴리오

### 핵심 원칙

#### 1️⃣ Developer-First Aesthetic
- **Terminal/IDE 영감**: VSCode, iTerm2, Linear 등 개발 도구의 세련된 인터페이스에서 영감
- **기술적 정교함**: 과도한 장식 없이 기능과 정보에 집중하는 미니멀리즘
- **전문성 표현**: 기술력이 느껴지는 타이포그래피와 레이아웃

#### 2️⃣ Modern & Progressive
- **최신 디자인 트렌드**: Glassmorphism, Subtle Gradients, Micro-interactions
- **획기적인 레이아웃**: 전통적인 포트폴리오 틀을 깨는 실험적 구성
- **움직임의 미학**: 부드럽고 의미 있는 애니메이션 (하지만 과하지 않게)

#### 3️⃣ Dark Mode First
- **다크 테마 우선**: 개발자들이 선호하는 다크 모드를 기본으로
- **라이트 모드 대비**: 필요시 라이트 모드도 우아하게 지원
- **높은 대비**: 가독성을 위한 충분한 명도 차이

---

### 🎨 시각적 언어 (Visual Language)

#### 색상 시스템
```css
/* 다크 모드 기본 팔레트 */
--background: 220 13% 9%;        /* #0d1117 - GitHub dark bg */
--surface: 220 13% 13%;          /* #161b22 - Elevated surface */
--surface-hover: 220 13% 18%;    /* Hover state */

--primary: 210 100% 66%;         /* #3b82f6 - Blue accent */
--primary-hover: 210 100% 56%;   /* Hover blue */
--success: 142 71% 45%;          /* #22c55e - Green */
--warning: 38 92% 50%;           /* #f59e0b - Amber */
--error: 0 72% 51%;              /* #dc2626 - Red */

--text-primary: 210 40% 98%;     /* #f8fafc - Primary text */
--text-secondary: 215 16% 65%;   /* #94a3b8 - Secondary text */
--text-tertiary: 215 20% 45%;    /* #64748b - Muted text */

--border: 220 13% 20%;           /* Subtle borders */
--border-bright: 220 13% 30%;    /* Emphasized borders */
```

#### 타이포그래피
```css
/* 폰트 시스템 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
--font-display: 'Cal Sans', 'SF Pro Display', sans-serif; /* 헤딩용 */

/* 폰트 크기 (Fluid Typography) */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
--text-3xl: clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem);
--text-4xl: clamp(2.25rem, 1.9rem + 1.75vw, 3rem);
```

#### 간격 시스템 (8pt Grid System)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

---

### 🧩 컴포넌트 스타일 가이드

#### 1. Cards (프로젝트, 경력 등)
```tsx
// Glassmorphism + Subtle Border
<div className="
  bg-surface/50 backdrop-blur-xl
  border border-border hover:border-border-bright
  rounded-2xl p-6
  transition-all duration-300
  hover:translate-y-[-2px] hover:shadow-2xl
  hover:shadow-primary/10
">
```

**특징**:
- 반투명 배경 + 블러 효과 (Glassmorphism)
- Hover 시 살짝 위로 떠오르는 효과
- 부드러운 그림자 전환
- 넓은 border-radius (2xl = 16px)

#### 2. Buttons
```tsx
// Primary Button (CTA)
<button className="
  bg-primary hover:bg-primary-hover
  text-white font-medium
  px-6 py-3 rounded-xl
  transition-all duration-200
  hover:scale-105 active:scale-95
  shadow-lg shadow-primary/30
">

// Ghost Button (Secondary)
<button className="
  bg-transparent hover:bg-surface-hover
  text-text-secondary hover:text-text-primary
  border border-border hover:border-border-bright
  px-6 py-3 rounded-xl
  transition-all duration-200
">
```

#### 3. 타임라인 (Terminal-inspired)
```tsx
<div className="relative pl-8 border-l-2 border-border">
  {/* Terminal cursor effect */}
  <div className="absolute left-[-5px] top-0 w-2 h-2
    bg-primary rounded-full animate-pulse" />

  <div className="space-y-2">
    <div className="font-mono text-sm text-text-tertiary">
      $ cd /career/2023
    </div>
    <h3 className="text-xl font-bold text-text-primary">
      Senior Developer @ Company
    </h3>
  </div>
</div>
```

#### 4. Skill Tags (Code-like)
```tsx
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5 rounded-lg
  bg-surface border border-border
  font-mono text-sm text-text-secondary
  hover:border-primary hover:text-primary
  transition-colors duration-200
">
  <span className="text-primary">&lt;</span>
  TypeScript
  <span className="text-primary">/&gt;</span>
</span>
```

#### 5. 섹션 헤더 (Progressive Disclosure)
```tsx
<div className="group relative mb-8">
  {/* Gradient underline */}
  <div className="absolute bottom-0 left-0 w-full h-[2px]
    bg-gradient-to-r from-primary via-purple-500 to-pink-500
    opacity-50 group-hover:opacity-100 transition-opacity" />

  <h2 className="text-3xl font-bold font-display
    bg-gradient-to-r from-text-primary to-text-secondary
    bg-clip-text text-transparent">
    Projects
  </h2>

  {/* Decorative element */}
  <span className="ml-3 font-mono text-text-tertiary text-sm">
    // 06 items
  </span>
</div>
```

---

### ⚡ 인터랙션 & 애니메이션

#### 페이지 전환
```tsx
// Framer Motion을 활용한 페이지 로드 애니메이션
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

#### Hover 마이크로 인터랙션
- **Card Hover**: Y축 -2px 이동 + 그림자 증가
- **Button Hover**: Scale 1.05 + 그림자 변화
- **Link Hover**: Underline 애니메이션 (left to right)
- **Image Hover**: Subtle zoom (scale 1.02)

#### 로딩 상태
```tsx
// Skeleton with shimmer effect
<div className="
  animate-pulse bg-gradient-to-r
  from-surface via-surface-hover to-surface
  bg-[length:200%_100%]
  animate-shimmer
  rounded-lg h-24
" />
```

#### Scroll Animations
```tsx
// Intersection Observer를 활용한 스크롤 애니메이션
// 섹션이 뷰포트에 들어올 때 페이드인
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up')
        }
      })
    },
    { threshold: 0.1 }
  )
})
```

---

### 📐 레이아웃 원칙

#### 1. Asymmetric Grid (비대칭 그리드)
```tsx
// 전통적인 대칭 레이아웃을 피하고 시각적 긴장감 생성
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-7">Main Content</div>
  <div className="col-span-5">Sidebar</div>
</div>
```

#### 2. Bento Box Layout (프로젝트 갤러리)
```tsx
// 다양한 크기의 카드로 구성된 모자이크 레이아웃
<div className="grid grid-cols-4 auto-rows-[200px] gap-4">
  <div className="col-span-2 row-span-2">Featured</div>
  <div className="col-span-2">Project 1</div>
  <div>Project 2</div>
  <div>Project 3</div>
</div>
```

#### 3. Vertical Rhythm (수직 리듬)
- 섹션 간 일관된 간격: `space-24` (96px)
- 요소 간 간격: `space-6` ~ `space-8` (24-32px)
- 텍스트 줄간격: `leading-relaxed` (1.625)

#### 4. Container & Breakpoints
```tsx
// 반응형 컨테이너
<div className="
  container mx-auto px-6
  max-w-7xl
  sm:px-8 md:px-12 lg:px-16
">
```

---

### 🎯 UI 패턴별 구현 가이드

#### Profile Header
```tsx
<header className="relative overflow-hidden">
  {/* Animated gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br
    from-primary/20 via-purple-500/10 to-pink-500/20
    animate-gradient-shift" />

  <div className="relative z-10 container py-24">
    {/* Avatar with glow effect */}
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-primary/30 blur-2xl" />
      <img className="relative w-32 h-32 rounded-full
        border-4 border-surface shadow-2xl" />
    </div>

    {/* Animated typing effect for name */}
    <h1 className="text-5xl font-bold font-display mt-6">
      <TypewriterEffect text="John Doe" />
    </h1>

    {/* Subtle badge */}
    <span className="inline-flex items-center gap-2
      px-4 py-2 rounded-full bg-surface/80 backdrop-blur
      border border-border mt-4">
      <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
      <span className="font-mono text-sm">Available for work</span>
    </span>
  </div>
</header>
```

#### Skill Grid with Categories
```tsx
<div className="space-y-8">
  {categories.map(category => (
    <div key={category}>
      {/* Category header with icon */}
      <h3 className="flex items-center gap-3 mb-4
        text-lg font-mono text-text-secondary">
        <span className="text-primary">//</span>
        {category}
      </h3>

      {/* Skills as terminal commands */}
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span className="px-3 py-1.5 rounded-lg
            bg-surface hover:bg-surface-hover
            border border-border hover:border-primary
            font-mono text-sm
            transition-all duration-200
            cursor-pointer">
            $ {skill}
          </span>
        ))}
      </div>
    </div>
  ))}
</div>
```

#### Project Card (Glassmorphism)
```tsx
<article className="group relative overflow-hidden rounded-2xl
  bg-surface/50 backdrop-blur-xl
  border border-border hover:border-primary/50
  transition-all duration-300
  hover:translate-y-[-4px] hover:shadow-2xl
  hover:shadow-primary/20">

  {/* Project thumbnail with overlay */}
  <div className="relative aspect-video overflow-hidden">
    <img className="w-full h-full object-cover
      transition-transform duration-500
      group-hover:scale-110" />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t
      from-background via-background/50 to-transparent" />
  </div>

  {/* Content */}
  <div className="p-6">
    <h3 className="text-xl font-bold mb-2
      group-hover:text-primary transition-colors">
      {project.name}
    </h3>

    <p className="text-text-secondary text-sm mb-4">
      {project.description}
    </p>

    {/* Tech stack badges */}
    <div className="flex flex-wrap gap-2">
      {project.tech.map(tech => (
        <span className="px-2 py-1 rounded text-xs
          bg-primary/10 text-primary border border-primary/20">
          {tech}
        </span>
      ))}
    </div>
  </div>

  {/* Hover indicator */}
  <div className="absolute top-4 right-4 opacity-0
    group-hover:opacity-100 transition-opacity">
    <ArrowUpRight className="text-primary" />
  </div>
</article>
```

---

### 🔍 관리자 페이지 UI 원칙

#### Dashboard Layout
```tsx
<div className="min-h-screen bg-background">
  {/* Sidebar with blur background */}
  <aside className="fixed left-0 top-0 h-full w-64
    bg-surface/80 backdrop-blur-xl
    border-r border-border">
    {/* Navigation items with active state */}
  </aside>

  {/* Main content area */}
  <main className="ml-64 p-8">
    {/* Form sections */}
  </main>
</div>
```

#### Form Controls
```tsx
// Input with focus state
<input className="
  w-full px-4 py-3 rounded-xl
  bg-surface border border-border
  text-text-primary placeholder:text-text-tertiary
  focus:border-primary focus:ring-2 focus:ring-primary/20
  transition-all duration-200
  font-mono text-sm
" />

// Toggle switch (shadcn/ui Switch component)
<Switch className="
  data-[state=checked]:bg-primary
  data-[state=unchecked]:bg-surface-hover
" />
```

---

### ✨ 특별 효과

#### Gradient Text
```tsx
<h1 className="
  bg-gradient-to-r from-primary via-purple-400 to-pink-400
  bg-clip-text text-transparent
  animate-gradient-x
">
  Innovative Developer
</h1>
```

#### Noise Texture (Subtle grain effect)
```css
/* Add to background for texture */
.noise-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
}
```

#### Glow Effects
```tsx
// Text glow on hover
<h2 className="
  transition-all duration-300
  hover:text-primary
  hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]
">
```

---

### 📱 반응형 디자인 원칙

#### Mobile First Approach
```tsx
// 모바일부터 시작하여 점진적으로 확장
<div className="
  px-4 py-6
  sm:px-6 sm:py-8
  md:px-8 md:py-12
  lg:px-12 lg:py-16

  grid grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
">
```

#### Breakpoint Strategy
- **Mobile**: < 640px (1 column, stacked layout)
- **Tablet**: 640px - 1024px (2 columns, simplified navigation)
- **Desktop**: > 1024px (full layout, all features)
- **Wide**: > 1536px (max-width constraint, centered)

---

### 🎭 애니메이션 가이드라인

#### 성능 최적화
```css
/* GPU 가속을 위해 transform 사용 */
.animate {
  will-change: transform;
  transform: translateZ(0);
}

/* 애니메이션은 transform과 opacity만 사용 */
.smooth-transition {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

#### 애니메이션 타이밍
- **Micro**: 100-200ms (버튼 호버, 포커스)
- **Short**: 200-400ms (카드 호버, 전환)
- **Medium**: 400-600ms (모달, 드로어)
- **Long**: 600-1000ms (페이지 전환, 복잡한 애니메이션)

#### Easing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 🎨 디자인 체크리스트

UI 구현 시 반드시 확인할 사항:

### ✅ 필수 요소
- [ ] 다크 모드 기본 적용
- [ ] 모든 상호작용 요소에 hover 상태
- [ ] 포커스 가능한 요소에 focus-visible 스타일
- [ ] 로딩 상태 표시 (Skeleton 또는 Spinner)
- [ ] 에러 상태 UI
- [ ] 모바일 반응형 (320px부터 테스트)

### ✅ 개발자스러운 요소
- [ ] Monospace 폰트 활용 (코드, 날짜, 숫자)
- [ ] Terminal/IDE 느낌의 UI 요소
- [ ] 기술적인 디테일 (버전 번호, 커밋 해시 스타일)
- [ ] Code-like 장식 요소 (`</>`, `//`, `$`, `>`)

### ✅ 현대적 요소
- [ ] Glassmorphism 효과 (적절한 곳에)
- [ ] Subtle gradient 사용
- [ ] Smooth micro-interactions
- [ ] 넓은 border-radius (최소 12px)
- [ ] 충분한 여백 (공간의 여유로움)

### ✅ 접근성
- [ ] 충분한 색상 대비 (WCAG AA 이상)
- [ ] 키보드 네비게이션 가능
- [ ] Screen reader 친화적인 마크업
- [ ] Alt text for images
- [ ] ARIA labels where needed

---

### 공개 페이지 UI (Tasks 12-14)

#### Task 12: 공개 포트폴리오 페이지 (/) 레이아웃 및 프로필 섹션 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - Next.js App Router 페이지 구조 (`app/page.tsx`)
  - 반응형 레이아웃 및 TailwindCSS 스타일링
  - 프로필 섹션 컴포넌트 (이미지, 성명, MBTI, 링크 버튼)
  - shadcn/ui 컴포넌트 통합 (Card, Button, Avatar)
- **참고사항**: 정적 마크업과 스타일링에 집중, API 연동은 기본 fetch만 구현

#### Task 13: 공개 포트폴리오 페이지 타임라인 및 역량 섹션 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - 타임라인 섹션 컴포넌트 (세로형 타임라인 UI)
  - 역량 섹션 컴포넌트 (카테고리별 스킬 태그)
  - 조건부 렌더링 로직 (section_visibility 기반)
- **참고사항**: 시각적 디자인과 레이아웃에 집중

#### Task 14: 공개 포트폴리오 페이지 나머지 섹션들 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - 사이드프로젝트 섹션 (카드 레이아웃, 배지)
  - 동료평가 섹션 (이미지 갤러리, 모달)
  - 교육사항, 수상, 인턴십, 연구활동, 봉사활동, 대외활동 섹션
- **참고사항**: 각 섹션별 적절한 UI 패턴 적용

### 관리자 페이지 UI (Tasks 15-18)

#### Task 15: 관리자 편집 페이지 (/admin) 기본 레이아웃 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - 관리자 전용 레이아웃 구조 (`app/admin/page.tsx`)
  - 사이드바 네비게이션
  - 탭/아코디언 UI
  - React Hook Form 기본 설정
- **참고사항**: 폼 레이아웃과 네비게이션 구조에 집중

#### Task 16: 관리자 편집 페이지 프로필 및 섹션 설정 폼 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - 프로필 정보 입력 폼 (텍스트 필드, URL 입력)
  - 이미지 URL 미리보기 UI
  - 섹션 활성화 토글 스위치 (10개)
  - React Hook Form + Zod 검증
- **참고사항**: 폼 컴포넌트와 검증 UI에 집중

#### Task 17: 관리자 편집 페이지 타임라인 및 역량 관리 폼 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - 동적 폼 배열 UI (useFieldArray)
  - 날짜 선택 컴포넌트 (DatePicker)
  - 스킬 태그 입력 UI
  - 항목 추가/삭제 버튼
- **참고사항**: 동적 폼 UI와 입력 컴포넌트에 집중

#### Task 18: 관리자 편집 페이지 나머지 섹션들 관리 폼 구현
- **담당 에이전트**: `ui-markup-specialist`
- **작업 범위**:
  - 8개 섹션별 관리 폼 UI
  - 이미지 URL 미리보기
  - 다중 항목 관리 UI
  - URL 유효성 검사 피드백
- **참고사항**: 일관된 폼 패턴 유지

---

## 🔧 백엔드/API 전담: General Purpose Agent

다음 task들은 일반 개발 에이전트가 담당합니다:

### Infrastructure (Tasks 1-4)
- **Task 1**: Supabase 프로젝트 설정
- **Task 2**: Vercel 프로젝트 설정
- **Task 3**: Next.js 16.1.6 프로젝트 초기 설정
- **Task 4**: FastAPI 기본 구조 및 Supabase 연결

### API Implementation (Tasks 5-10)
- **Task 5**: 프로필 정보 관리 API
- **Task 6**: 섹션 활성화 설정 API
- **Task 7**: 타임라인 관리 API
- **Task 8**: 역량 키워드 관리 API
- **Task 9**: 사이드프로젝트, 동료평가, 교육사항 API
- **Task 10**: 수상, 인턴십, 연구활동, 봉사활동, 대외활동 API

### Security & Integration (Tasks 11, 19)
- **Task 11**: Next.js Middleware 접근 제어
- **Task 19**: 통합 테스트 및 Vercel 배포 최적화

---

## 📋 에이전트 호출 방법

### ui-markup-specialist 에이전트 호출
```
Task 12를 시작합니다. ui-markup-specialist 에이전트를 호출하여 공개 페이지 레이아웃을 구현해주세요.
```

### General Purpose Agent (직접 작업)
```
Task 5를 시작합니다. FastAPI에서 프로필 정보 관리 API를 구현해주세요.
```

---

## 🔄 작업 흐름

1. `task-master next` 또는 MCP `next_task`로 다음 task 확인
2. 이 문서에서 해당 task의 담당 에이전트 확인
3. 적절한 에이전트 호출 또는 직접 작업
4. 작업 완료 후 `set_task_status --status=done`

---

**작성일**: 2026-02-02
**버전**: 1.0
