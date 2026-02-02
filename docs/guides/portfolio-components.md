# 포트폴리오 컴포넌트 가이드

이 문서는 개발자 포트폴리오 공개 페이지의 컴포넌트 구조와 사용법을 설명합니다.

## 📂 컴포넌트 구조

```
src/components/
├── layout/
│   ├── Header.tsx              # 프로필 히어로 섹션
│   └── SectionContainer.tsx    # 섹션 래퍼 컴포넌트
│
├── sections/
│   ├── TimelineSection.tsx     # 경력 타임라인
│   ├── SkillsSection.tsx       # 기술 스택
│   ├── ProjectsSection.tsx     # 사이드프로젝트
│   ├── EducationSection.tsx    # 교육사항
│   ├── AwardsSection.tsx       # 수상 내역
│   └── ResearchSection.tsx     # 연구활동
│
└── ui/
    ├── ExternalLink.tsx        # 외부 링크 버튼
    └── StatusBadge.tsx         # 상태 뱃지
```

## 🎨 레이아웃 컴포넌트

### Header

프로필 정보를 표시하는 히어로 섹션 컴포넌트입니다.

**Props:**
```tsx
interface HeaderProps {
  name?: string              // 이름
  mbti?: string              // MBTI 유형
  profileImageUrl?: string   // 프로필 이미지 URL
  githubUrl?: string         // GitHub 링크
  blogUrl?: string           // 블로그 링크
  careerDocumentUrl?: string // 경력기술서 링크
  tagline?: string           // 한 줄 소개
}
```

**사용 예시:**
```tsx
<Header
  name="홍길동"
  mbti="INTJ"
  profileImageUrl="/profile.jpg"
  githubUrl="https://github.com/example"
  blogUrl="https://blog.example.com"
  careerDocumentUrl="https://example.com/career.pdf"
  tagline="좋은 코드를 작성하는 개발자입니다."
/>
```

**디자인 특징:**
- Glassmorphism 효과 (반투명 + backdrop blur)
- Gradient Text 효과 (이름)
- Terminal Cursor 애니메이션
- Scroll Indicator (스크롤 유도)
- 프로필 이미지 호버 효과

---

### SectionContainer

각 섹션을 감싸는 래퍼 컴포넌트입니다.

**Props:**
```tsx
interface SectionContainerProps {
  id?: string              // 섹션 ID (앵커 링크용)
  title: string            // 섹션 제목
  description?: string     // 섹션 설명
  children: React.ReactNode // 섹션 콘텐츠
  className?: string       // 추가 클래스
}
```

**사용 예시:**
```tsx
<SectionContainer
  id="timeline"
  title="Timeline"
  description="경력 및 주요 이벤트"
>
  <TimelineSection />
</SectionContainer>
```

---

## 📋 섹션 컴포넌트

### TimelineSection

경력 타임라인을 표시하는 컴포넌트입니다.

**Props:**
```tsx
interface TimelineItem {
  id: string
  year: number
  company: string
  role: string
  event?: string
  startDate: string
  endDate?: string | null  // null이면 재직 중
}

interface TimelineSectionProps {
  items?: TimelineItem[]
}
```

**디자인 특징:**
- 수평 스크롤 가능한 카드 리스트 (모바일)
- 그리드 레이아웃 (데스크톱)
- 재직 중인 경우 "Present" 배지
- 카드 호버 시 확대 효과

---

### SkillsSection

기술 스택을 카테고리별로 표시하는 컴포넌트입니다.

**Props:**
```tsx
interface SkillItem {
  id: string
  category: string  // 9개 카테고리 중 하나
  skillName: string
}

interface SkillsSectionProps {
  items?: SkillItem[]
}
```

**지원 카테고리:**
- 언어
- 백엔드
- 프론트엔드
- 데이터베이스
- 클라우드
- 도구
- 프레임워크
- 방법론
- 기타

**디자인 특징:**
- 카테고리별 카드
- Badge 형태로 스킬 표시
- Badge 호버 시 확대 + 색상 변화

---

### ProjectsSection

사이드프로젝트를 표시하는 컴포넌트입니다.

**Props:**
```tsx
interface ProjectItem {
  id: string
  projectName: string
  projectUrl?: string | null
  description: string
  status: string  // 서비스 중, 개발 중, 완료 등
  year: number
}

interface ProjectsSectionProps {
  items?: ProjectItem[]
}
```

**디자인 특징:**
- Masonry Grid 레이아웃
- 상태 뱃지 (StatusBadge)
- 외부 링크 버튼 (ExternalLink)
- 카드 호버 시 확대 + 그림자 효과

---

### EducationSection

교육 및 학력 사항을 표시하는 컴포넌트입니다.

**Props:**
```tsx
interface EducationItem {
  id: string
  institutionName: string
  startYear: number
  endYear?: number | null  // null이면 재학 중
  description: string
}

interface EducationSectionProps {
  items?: EducationItem[]
}
```

**디자인 특징:**
- 2컬럼 그리드 (데스크톱)
- 아이콘 + 정보 레이아웃
- 재학 중 표시 지원

---

### AwardsSection

수상 내역을 표시하는 컴포넌트입니다.

**Props:**
```tsx
interface AwardItem {
  id: string
  awardName: string
  awardUrl?: string | null
  contestName: string
  certificateImageUrl: string
  year: number
}

interface AwardsSectionProps {
  items?: AwardItem[]
}
```

**디자인 특징:**
- 2컬럼 그리드 (데스크톱)
- 상장 이미지 표시 (4:3 비율)
- 이미지 호버 시 확대 효과
- 외부 링크 지원

---

### ResearchSection

연구 활동 및 논문을 표시하는 컴포넌트입니다.

**Props:**
```tsx
interface ResearchItem {
  id: string
  researchName: string
  researchUrl?: string | null
  documentUrl: string
  description: string
  year: number
}

interface ResearchSectionProps {
  items?: ResearchItem[]
}
```

**디자인 특징:**
- 전체 너비 카드 리스트
- 논문 열람 버튼
- 연구 페이지 링크 (선택사항)

---

## 🎨 UI 컴포넌트

### ExternalLink

외부 링크를 여는 버튼 컴포넌트입니다.

**Props:**
```tsx
interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean  // 기본값: true
}
```

**사용 예시:**
```tsx
<ExternalLink href="https://example.com" size="sm">
  프로젝트 보기
</ExternalLink>
```

**특징:**
- 자동으로 `target="_blank"` 및 `rel="noopener noreferrer"` 설정
- 외부 링크 아이콘 표시 (선택사항)
- 호버 시 확대 효과

---

### StatusBadge

프로젝트 상태를 표시하는 뱃지 컴포넌트입니다.

**Props:**
```tsx
interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}
```

**자동 variant 선택:**
- "운영", "서비스", "완료" → `default` (파란색)
- "개발", "진행" → `secondary` (회색)
- "중단", "종료" → `destructive` (빨간색)

**사용 예시:**
```tsx
<StatusBadge status="서비스 중" />
<StatusBadge status="개발 중" />
<StatusBadge status="중단" />
```

---

## 🎯 메인 페이지 구조

`src/app/page.tsx`에서 모든 컴포넌트를 조합합니다.

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Header {...profileData} />

      {/* Timeline Section */}
      <TimelineSection items={timelineData} />

      {/* Skills Section */}
      <SkillsSection items={skillsData} />

      {/* Projects Section */}
      <ProjectsSection items={projectsData} />

      {/* Education & Awards Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        <EducationSection items={educationData} />
        <AwardsSection items={awardsData} />
      </div>

      {/* Research Section */}
      <ResearchSection items={researchData} />

      {/* Footer */}
      <footer>...</footer>
    </main>
  )
}
```

---

## 🎨 커스텀 스타일

### Glassmorphism 효과

```tsx
<div className="glass rounded-2xl border border-border/50 p-8">
  {/* 콘텐츠 */}
</div>
```

### Gradient Text

```tsx
<h1 className="gradient-text text-4xl font-bold">
  제목
</h1>
```

### Terminal Cursor

```tsx
<span className="terminal-cursor inline-block h-5 w-2 bg-primary" />
```

### Scroll Indicator

```tsx
<div className="scroll-indicator animate-bounce">
  <svg>...</svg>
</div>
```

---

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: `< 768px` (기본)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large**: `xl:` (1280px+)

### 반응형 패턴

**그리드 레이아웃:**
```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* 카드들 */}
</div>
```

**수평 스크롤 (모바일):**
```tsx
<div className="hide-scrollbar flex space-x-6 overflow-x-auto pb-4 md:grid md:grid-cols-2">
  {/* 카드들 */}
</div>
```

---

## 🚀 데이터 연동 (TODO)

현재는 데모 데이터를 사용하고 있습니다. FastAPI 백엔드가 준비되면 다음과 같이 연동합니다:

```tsx
export default async function HomePage() {
  const profileData = await fetch('/api/profile').then(res => res.json())
  const timelineData = await fetch('/api/timeline').then(res => res.json())
  const skillsData = await fetch('/api/skills').then(res => res.json())
  // ... 기타 데이터

  return (
    <main>
      <Header {...profileData} />
      <TimelineSection items={timelineData} />
      <SkillsSection items={skillsData} />
      {/* ... */}
    </main>
  )
}
```

---

## ✅ 체크리스트

새 섹션 추가 시 확인사항:

- [ ] TypeScript 인터페이스 정의
- [ ] 데모 데이터 준비
- [ ] SectionContainer로 래핑
- [ ] 반응형 디자인 적용
- [ ] 호버 효과 추가
- [ ] 접근성 (ARIA) 고려

---

이 가이드를 참고하여 포트폴리오 페이지를 확장하고 커스터마이징하세요!
