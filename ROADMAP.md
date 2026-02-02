# Developer Portfolio MVP 개발 로드맵

개발자의 경력, 역량, 프로젝트를 체계적으로 보여주는 원스톱 포트폴리오 웹사이트 MVP

## 개요

Developer Portfolio는 단일 사용자(개발자)를 위한 포트폴리오 관리 시스템으로 다음 기능을 제공합니다:

- **프로필 정보 표시**: 성명, MBTI, 프로필 이미지, 외부 링크 (Github, 블로그, 경력기술서)
- **11개 섹션 관리**: 타임라인, 교육사항, 역량, 동료평가, 사이드프로젝트, 수상, 인턴십, 연구활동, 봉사활동, 대/외활동
- **섹션 가시성 제어**: 관리자가 각 섹션의 표시 여부를 제어

## 기술 스택

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + TailwindCSS v4 + shadcn/ui
- **Backend**: FastAPI (Python 3.12+) - Vercel Serverless Functions
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel

## 프로젝트 현재 상태

| 구분 | 상태 | 비고 |
|------|------|------|
| FastAPI 백엔드 기본 | 완료 | 인증, 프로필, 타임라인, 섹션가시성 API |
| 데이터베이스 스키마 | 완료 | 12개 테이블 정의 |
| Seed 데이터 | 완료 | 샘플 데이터 준비 |
| Next.js 프론트엔드 | 미시작 | src/ 디렉토리 비어있음 |
| UI 컴포넌트 | 미시작 | shadcn/ui 미설치 |

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

---

## 개발 단계

### Phase 1: 데이터베이스 & API 기반 완성

> PRD F020, F021, F022 구현 완료 단계

- **Task 001: 누락된 READ API 엔드포인트 구현** - 우선순위
  - 교육사항 조회 API (GET /api/education)
  - 역량 조회 API (GET /api/skills)
  - 동료평가 조회 API (GET /api/peer-reviews)
  - 사이드프로젝트 조회 API (GET /api/projects)
  - 수상 조회 API (GET /api/awards)
  - 인턴십 조회 API (GET /api/internships)
  - 연구활동 조회 API (GET /api/research)
  - 봉사활동 조회 API (GET /api/volunteer)
  - 대/외활동 조회 API (GET /api/activities)

- **Task 002: 로컬 개발 환경 완성 (F022)**
  - concurrently 패키지 설치
  - package.json dev 스크립트 수정 (Next.js + FastAPI 동시 실행)
  - .env.local 템플릿 작성
  - 로컬 환경 테스트 및 검증

---

### Phase 2: 애플리케이션 골격 구축

> 구조 우선 접근법 - 전체 라우트와 빈 페이지 생성

- **Task 003: Next.js App Router 기본 구조 생성** - 우선순위
  - /app/layout.tsx (루트 레이아웃 with 메타데이터)
  - /app/page.tsx (메인 포트폴리오 페이지 껍데기)
  - /app/loading.tsx (로딩 상태 UI)
  - /app/error.tsx (에러 상태 UI)
  - /app/not-found.tsx (404 페이지)
  - /app/globals.css (TailwindCSS 설정)

- **Task 004: TypeScript 타입 정의 및 인터페이스**
  - /src/types/profile.ts (프로필 타입)
  - /src/types/timeline.ts (타임라인 타입)
  - /src/types/education.ts (교육사항 타입)
  - /src/types/skill.ts (역량 타입)
  - /src/types/peer-review.ts (동료평가 타입)
  - /src/types/project.ts (사이드프로젝트 타입)
  - /src/types/award.ts (수상 타입)
  - /src/types/internship.ts (인턴십 타입)
  - /src/types/research.ts (연구활동 타입)
  - /src/types/volunteer.ts (봉사활동 타입)
  - /src/types/activity.ts (대/외활동 타입)
  - /src/types/section-visibility.ts (섹션 가시성 타입)
  - /src/types/api.ts (API 응답 래퍼 타입)
  - /src/types/index.ts (통합 export)

- **Task 005: API 클라이언트 및 더미 데이터 유틸리티**
  - 의존성: Task 004
  - /src/lib/api-client.ts (fetch 래퍼, 에러 핸들링)
  - /src/lib/constants.ts (API URL, 상수 정의)
  - /src/lib/utils.ts (유틸리티 함수)
  - /src/data/mock/profile.ts (프로필 더미 데이터)
  - /src/data/mock/timeline.ts (타임라인 더미 데이터)
  - /src/data/mock/education.ts (교육사항 더미 데이터)
  - /src/data/mock/skills.ts (역량 더미 데이터)
  - /src/data/mock/peer-reviews.ts (동료평가 더미 데이터)
  - /src/data/mock/projects.ts (사이드프로젝트 더미 데이터)
  - /src/data/mock/awards.ts (수상 더미 데이터)
  - /src/data/mock/internships.ts (인턴십 더미 데이터)
  - /src/data/mock/research.ts (연구활동 더미 데이터)
  - /src/data/mock/volunteer.ts (봉사활동 더미 데이터)
  - /src/data/mock/activities.ts (대/외활동 더미 데이터)
  - /src/data/mock/section-visibility.ts (섹션 가시성 더미 데이터)
  - /src/data/mock/index.ts (통합 export)

---

### Phase 3: UI 컴포넌트 라이브러리

> shadcn/ui 기반 디자인 시스템 구축

- **Task 006: shadcn/ui 초기화 및 공통 컴포넌트 설치** - 우선순위
  - 의존성: Task 003
  - shadcn/ui 초기화 (npx shadcn@latest init)
  - 필수 컴포넌트 설치: button, card, tabs, accordion, badge, avatar, dialog, separator, scroll-area
  - /src/components/ui/* (shadcn 컴포넌트 디렉토리)
  - 테마 색상 설정 (개발자스러운 다크모드 친화적 디자인)

- **Task 007: 공통 레이아웃 컴포넌트**
  - 의존성: Task 006
  - /src/components/layout/header.tsx (헤더 with 네비게이션)
  - /src/components/layout/footer.tsx (푸터)
  - /src/components/layout/section-container.tsx (섹션 컨테이너)
  - /src/components/layout/page-wrapper.tsx (페이지 래퍼)
  - /src/components/layout/index.ts (통합 export)

- **Task 008: 프로필 영역 컴포넌트 (F001)**
  - 의존성: Task 006, Task 007
  - /src/components/profile/profile-card.tsx (프로필 카드 전체)
  - /src/components/profile/profile-avatar.tsx (아바타 with MBTI 배지)
  - /src/components/profile/profile-info.tsx (이름, 소개)
  - /src/components/profile/external-links.tsx (Github, 블로그, 경력기술서 링크 버튼)
  - /src/components/profile/index.ts (통합 export)
  - 더미 데이터로 UI 검증

- **Task 009: 섹션 네비게이션 컴포넌트 (F023)**
  - 의존성: Task 006, Task 007
  - /src/components/sections/section-tabs.tsx (탭 네비게이션)
  - /src/components/sections/section-accordion.tsx (아코디언 대안 UI)
  - /src/components/sections/section-panel.tsx (섹션 패널 컨테이너)
  - /src/components/sections/section-header.tsx (섹션 헤더)
  - /src/components/sections/index.ts (통합 export)
  - 11개 섹션 탭 구조 설정

---

### Phase 4: 핵심 섹션 UI 구현 (더미 데이터)

> PRD Phase 2 - 핵심 섹션 5개 구현

- **Task 010: 타임라인 섹션 UI (F002)** - 우선순위
  - 의존성: Task 009
  - /src/components/sections/timeline/timeline-section.tsx (타임라인 섹션 전체)
  - /src/components/sections/timeline/timeline-list.tsx (타임라인 리스트)
  - /src/components/sections/timeline/timeline-item.tsx (연도별 아이템)
  - /src/components/sections/timeline/timeline-event.tsx (이벤트 상세)
  - /src/components/sections/timeline/index.ts (통합 export)
  - 연도별 회사/업무/이벤트 시간순 표시
  - 더미 데이터로 UI 검증

- **Task 011: 교육사항 섹션 UI (F003)**
  - 의존성: Task 009
  - /src/components/sections/education/education-section.tsx (교육사항 섹션 전체)
  - /src/components/sections/education/education-list.tsx (교육 리스트)
  - /src/components/sections/education/education-item.tsx (교육 아이템)
  - /src/components/sections/education/index.ts (통합 export)
  - 시작/종료 연도, 교육 기관/내용 표시
  - 더미 데이터로 UI 검증

- **Task 012: 역량 섹션 UI (F004)**
  - 의존성: Task 009
  - /src/components/sections/skills/skills-section.tsx (역량 섹션 전체)
  - /src/components/sections/skills/skill-category-list.tsx (카테고리 리스트)
  - /src/components/sections/skills/skill-category.tsx (카테고리별 그룹)
  - /src/components/sections/skills/skill-badge.tsx (기술 뱃지)
  - /src/components/sections/skills/index.ts (통합 export)
  - 9개 카테고리별 기술 키워드 뱃지 표시
  - 더미 데이터로 UI 검증

- **Task 013: 동료평가 갤러리 UI (F005)**
  - 의존성: Task 009
  - yet-another-react-lightbox 패키지 설치
  - /src/components/sections/peer-reviews/peer-reviews-section.tsx (동료평가 섹션 전체)
  - /src/components/sections/peer-reviews/review-gallery.tsx (이미지 그리드 갤러리)
  - /src/components/sections/peer-reviews/review-thumbnail.tsx (썸네일 아이템)
  - /src/components/sections/peer-reviews/review-lightbox.tsx (라이트박스 모달 - 확대/축소)
  - /src/components/sections/peer-reviews/index.ts (통합 export)
  - 이미지 확대/축소 기능
  - 더미 데이터로 UI 검증

- **Task 014: 사이드프로젝트 섹션 UI (F006)**
  - 의존성: Task 009
  - /src/components/sections/projects/projects-section.tsx (프로젝트 섹션 전체)
  - /src/components/sections/projects/project-list.tsx (프로젝트 리스트)
  - /src/components/sections/projects/project-card.tsx (프로젝트 카드)
  - /src/components/sections/projects/project-status-badge.tsx (상태 뱃지)
  - /src/components/sections/projects/index.ts (통합 export)
  - 프로젝트명(링크), 설명, 상태 배지
  - 링크 클릭 시 새창 이동
  - 더미 데이터로 UI 검증

---

### Phase 5: 추가 섹션 UI 구현 (더미 데이터)

> PRD Phase 3 - 추가 섹션 6개 구현

- **Task 015: 수상 섹션 UI (F007)** - 우선순위
  - 의존성: Task 009
  - /src/components/sections/awards/awards-section.tsx (수상 섹션 전체)
  - /src/components/sections/awards/award-list.tsx (수상 리스트)
  - /src/components/sections/awards/award-card.tsx (수상 카드)
  - /src/components/sections/awards/certificate-image.tsx (상장 이미지)
  - /src/components/sections/awards/index.ts (통합 export)
  - 수상명(링크), 대회명, 상장 이미지
  - 더미 데이터로 UI 검증

- **Task 016: 인턴십 섹션 UI (F008)**
  - 의존성: Task 009
  - /src/components/sections/internships/internships-section.tsx (인턴십 섹션 전체)
  - /src/components/sections/internships/internship-list.tsx (인턴십 리스트)
  - /src/components/sections/internships/internship-item.tsx (인턴십 아이템)
  - /src/components/sections/internships/index.ts (통합 export)
  - 회사명, 업무 내용, 기간 표시
  - 더미 데이터로 UI 검증

- **Task 017: 연구활동 섹션 UI (F009)**
  - 의존성: Task 009
  - /src/components/sections/research/research-section.tsx (연구활동 섹션 전체)
  - /src/components/sections/research/research-list.tsx (연구 리스트)
  - /src/components/sections/research/research-item.tsx (연구 아이템)
  - /src/components/sections/research/document-link.tsx (문서 링크 버튼)
  - /src/components/sections/research/index.ts (통합 export)
  - 연구명(링크), 열람하기 버튼(문서 새창)
  - 더미 데이터로 UI 검증

- **Task 018: 봉사활동 섹션 UI (F010)**
  - 의존성: Task 009
  - /src/components/sections/volunteer/volunteer-section.tsx (봉사활동 섹션 전체)
  - /src/components/sections/volunteer/volunteer-list.tsx (봉사 리스트)
  - /src/components/sections/volunteer/volunteer-item.tsx (봉사 아이템)
  - /src/components/sections/volunteer/index.ts (통합 export)
  - 기관명, 봉사 내용 표시
  - 더미 데이터로 UI 검증

- **Task 019: 대/외활동 섹션 UI (F011)**
  - 의존성: Task 009
  - /src/components/sections/activities/activities-section.tsx (대외활동 섹션 전체)
  - /src/components/sections/activities/activity-list.tsx (활동 리스트)
  - /src/components/sections/activities/activity-item.tsx (활동 아이템)
  - /src/components/sections/activities/index.ts (통합 export)
  - 기관명, 활동 내용 표시
  - 더미 데이터로 UI 검증

---

### Phase 6: 메인 페이지 조립 및 API 연동

> 더미 데이터를 실제 API로 교체

- **Task 020: 메인 포트폴리오 페이지 조립** - 우선순위
  - 의존성: Task 008 ~ Task 019 전체
  - /app/page.tsx 완성 (모든 컴포넌트 조합)
  - 프로필 영역 + 섹션 네비게이션 + 11개 섹션 통합
  - 더미 데이터로 전체 사용자 플로우 검증
  - 모바일/태블릿/데스크톱 레이아웃 확인

- **Task 021: API 연동 - 프로필 및 섹션 가시성**
  - 의존성: Task 005, Task 020
  - /src/hooks/use-profile.ts (프로필 데이터 페칭 훅)
  - /src/hooks/use-section-visibility.ts (섹션 가시성 페칭 훅)
  - 프로필 컴포넌트에 실제 API 연동
  - 섹션 가시성에 따른 조건부 렌더링
  - API 에러 핸들링 및 로딩 상태

- **Task 022: API 연동 - 모든 섹션 데이터**
  - 의존성: Task 021
  - /src/hooks/use-timeline.ts
  - /src/hooks/use-education.ts
  - /src/hooks/use-skills.ts
  - /src/hooks/use-peer-reviews.ts
  - /src/hooks/use-projects.ts
  - /src/hooks/use-awards.ts
  - /src/hooks/use-internships.ts
  - /src/hooks/use-research.ts
  - /src/hooks/use-volunteer.ts
  - /src/hooks/use-activities.ts
  - /src/hooks/index.ts (통합 export)
  - 모든 섹션 컴포넌트에 실제 API 연동
  - 데이터 없음 상태 처리
  - 에러 상태 처리

---

### Phase 7: 배포 및 최적화

> PRD Phase 4 - 배포 준비 및 성능 최적화

- **Task 023: SEO 및 메타데이터 설정** - 우선순위
  - 의존성: Task 020
  - /app/layout.tsx 메타데이터 완성
  - Open Graph 태그 설정 (SNS 공유용)
  - Twitter Card 설정
  - /app/robots.ts (robots.txt 생성)
  - /app/sitemap.ts (sitemap.xml 생성)
  - 구조화된 데이터 (JSON-LD)

- **Task 024: 이미지 최적화**
  - 의존성: Task 022
  - Next.js Image 컴포넌트로 모든 이미지 교체
  - 프로필 이미지 최적화
  - 동료평가 이미지 최적화
  - 상장 이미지 최적화
  - 이미지 placeholder 및 blur 처리
  - 외부 이미지 도메인 설정 (next.config.js)

- **Task 025: 반응형 디자인 최적화**
  - 의존성: Task 020
  - 모바일 레이아웃 검증 및 수정 (< 640px)
  - 태블릿 레이아웃 검증 및 수정 (640px ~ 1024px)
  - 데스크톱 레이아웃 검증 (> 1024px)
  - 터치 인터랙션 최적화
  - 접근성 검증 (키보드 네비게이션, 스크린 리더)

- **Task 026: 성능 최적화 및 배포 준비**
  - 의존성: Task 023, Task 024, Task 025
  - Lighthouse 성능 점수 확인 및 개선
  - 번들 크기 분석 및 최적화
  - 코드 스플리팅 검증
  - Vercel 환경변수 설정 확인
  - 프로덕션 빌드 테스트
  - 배포 후 기능 검증

---

## PRD 기능 매핑

| PRD ID | 기능명 | 관련 Task | Phase |
|--------|--------|-----------|-------|
| F001 | 프로필 정보 표시 | Task 008 | Phase 3 |
| F002 | 타임라인 표시 | Task 010 | Phase 4 |
| F003 | 교육사항 표시 | Task 011 | Phase 4 |
| F004 | 역량 표시 | Task 012 | Phase 4 |
| F005 | 동료평가 갤러리 | Task 013 | Phase 4 |
| F006 | 사이드프로젝트 표시 | Task 014 | Phase 4 |
| F007 | 수상 내역 표시 | Task 015 | Phase 5 |
| F008 | 인턴십 표시 | Task 016 | Phase 5 |
| F009 | 연구활동 표시 | Task 017 | Phase 5 |
| F010 | 봉사활동 표시 | Task 018 | Phase 5 |
| F011 | 대/외활동 표시 | Task 019 | Phase 5 |
| F020 | FastAPI 데이터 조회 | Task 001, Task 021, Task 022 | Phase 1, 6 |
| F021 | Supabase PostgreSQL | (완료) | - |
| F022 | 로컬 개발 환경 | Task 002 | Phase 1 |
| F023 | 섹션 선택 UI | Task 009 | Phase 3 |

---

## 디렉토리 구조 (예상)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                    # shadcn/ui 컴포넌트
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── section-container.tsx
│   │   └── page-wrapper.tsx
│   ├── profile/
│   │   ├── profile-card.tsx
│   │   ├── profile-avatar.tsx
│   │   ├── profile-info.tsx
│   │   └── external-links.tsx
│   └── sections/
│       ├── section-tabs.tsx
│       ├── section-panel.tsx
│       ├── timeline/
│       ├── education/
│       ├── skills/
│       ├── peer-reviews/
│       ├── projects/
│       ├── awards/
│       ├── internships/
│       ├── research/
│       ├── volunteer/
│       └── activities/
├── hooks/
│   ├── use-profile.ts
│   ├── use-timeline.ts
│   └── ... (각 섹션별 훅)
├── lib/
│   ├── api-client.ts
│   ├── constants.ts
│   └── utils.ts
├── types/
│   ├── profile.ts
│   ├── timeline.ts
│   └── ... (각 엔티티별 타입)
└── data/
    └── mock/
        ├── profile.ts
        └── ... (각 엔티티별 더미 데이터)
```

---

## 참고 문서

- **PRD**: `docs/PRD.md`
- **데이터베이스 스키마**: `docs/database/scheme.sql`
- **Seed 데이터**: `docs/database/seed.sql`
- **FastAPI 백엔드**: `api/index.py`
- **프로젝트 가이드**: `CLAUDE.md`
