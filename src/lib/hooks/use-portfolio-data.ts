/**
 * SWR 기반 데이터 fetching hooks
 * 모든 포트폴리오 데이터 타입에 대한 custom hooks 제공
 */

import useSWR from 'swr'
import { apiClient } from '@/lib/api-client'
import type {
  Profile,
  Timeline,
  Education,
  Skill,
  PeerReview,
  SideProject,
  Award,
  Internship,
  Research,
  Volunteer,
  ExternalActivity,
  SectionVisibility,
  ApiError,
} from '@/types'

/**
 * SWR Hook의 반환 타입
 */
interface UseResourceReturn<T> {
  data: T | undefined
  error: ApiError | undefined
  isLoading: boolean
  isValidating: boolean
  mutate: () => Promise<T | undefined>
}

/**
 * 제네릭 리소스 fetcher hook
 * 모든 데이터 타입에 대해 공통으로 사용
 */
function useResource<T>(endpoint: string | null): UseResourceReturn<T> {
  const { data, error, isValidating, mutate } = useSWR<T, ApiError>(
    endpoint,
    endpoint ? () => apiClient.get<T>(endpoint) : null,
    {
      // 포커스 시 재검증 (탭 전환 후 돌아올 때)
      revalidateOnFocus: true,
      // 재연결 시 재검증
      revalidateOnReconnect: true,
      // 중복 요청 방지 간격 (2초)
      dedupingInterval: 2000,
      // 에러 발생 시 재시도 (최대 3번)
      errorRetryCount: 3,
      // 재시도 간격 (5초)
      errorRetryInterval: 5000,
    }
  )

  return {
    data,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate,
  }
}

/**
 * 1. 프로필 데이터 조회
 * GET /api/profile
 */
export function useProfile(): UseResourceReturn<Profile> {
  return useResource<Profile>('/profile')
}

/**
 * 2. 타임라인 데이터 조회
 * GET /api/timeline
 */
export function useTimeline(): UseResourceReturn<Timeline[]> {
  return useResource<Timeline[]>('/timeline')
}

/**
 * 3. 교육사항 조회
 * GET /api/education (미구현 - 향후 API 추가 대비)
 */
export function useEducation(): UseResourceReturn<Education[]> {
  // API 미구현 시 null 전달하여 요청 비활성화
  return useResource<Education[]>(null)
}

/**
 * 4. 기술 역량 조회
 * GET /api/skills (미구현 - 향후 API 추가 대비)
 */
export function useSkills(): UseResourceReturn<Skill[]> {
  return useResource<Skill[]>(null)
}

/**
 * 5. 동료평가 이미지 조회
 * GET /api/peer-reviews (미구현 - 향후 API 추가 대비)
 */
export function usePeerReviews(): UseResourceReturn<PeerReview[]> {
  return useResource<PeerReview[]>(null)
}

/**
 * 6. 사이드프로젝트 조회
 * GET /api/side-projects (미구함 - 향후 API 추가 대비)
 */
export function useSideProjects(): UseResourceReturn<SideProject[]> {
  return useResource<SideProject[]>(null)
}

/**
 * 7. 수상 내역 조회
 * GET /api/awards (미구현 - 향후 API 추가 대비)
 */
export function useAwards(): UseResourceReturn<Award[]> {
  return useResource<Award[]>(null)
}

/**
 * 8. 인턴십 조회
 * GET /api/internships (미구현 - 향후 API 추가 대비)
 */
export function useInternships(): UseResourceReturn<Internship[]> {
  return useResource<Internship[]>(null)
}

/**
 * 9. 연구활동 조회
 * GET /api/research (미구현 - 향후 API 추가 대비)
 */
export function useResearch(): UseResourceReturn<Research[]> {
  return useResource<Research[]>(null)
}

/**
 * 10. 봉사활동 조회
 * GET /api/volunteer (미구현 - 향후 API 추가 대비)
 */
export function useVolunteer(): UseResourceReturn<Volunteer[]> {
  return useResource<Volunteer[]>(null)
}

/**
 * 11. 대외활동 조회
 * GET /api/external-activities (미구현 - 향후 API 추가 대비)
 */
export function useExternalActivities(): UseResourceReturn<ExternalActivity[]> {
  return useResource<ExternalActivity[]>(null)
}

/**
 * 12. 섹션 표시 설정 조회
 * GET /api/section-visibility
 */
export function useSectionVisibility(): UseResourceReturn<SectionVisibility> {
  return useResource<SectionVisibility>('/section-visibility')
}

/**
 * 인증 상태 조회
 * GET /api/auth/status
 */
export interface AuthStatus {
  admin_token_configured: boolean
  message: string
}

export function useAuthStatus(): UseResourceReturn<AuthStatus> {
  return useResource<AuthStatus>('/auth/status')
}

/**
 * 헬스 체크
 * GET /api/health
 */
export interface HealthStatus {
  status: string
  timestamp: string
  message: string
  environment: {
    supabase_url_configured: boolean
    supabase_anon_key_configured: boolean
    supabase_service_role_key_configured: boolean
  }
  database: {
    connected: boolean
    error: string | null
    profile_exists?: boolean
  }
}

export function useHealth(): UseResourceReturn<HealthStatus> {
  return useResource<HealthStatus>('/health')
}

/**
 * 모든 포트폴리오 데이터를 한 번에 조회하는 hook
 * 공개 포트폴리오 페이지에서 사용
 */
export function usePortfolioData() {
  const profile = useProfile()
  const timeline = useTimeline()
  const education = useEducation()
  const skills = useSkills()
  const peerReviews = usePeerReviews()
  const sideProjects = useSideProjects()
  const awards = useAwards()
  const internships = useInternships()
  const research = useResearch()
  const volunteer = useVolunteer()
  const externalActivities = useExternalActivities()
  const sectionVisibility = useSectionVisibility()

  // 전체 로딩 상태 (구현된 API만 체크)
  const isLoading =
    profile.isLoading || timeline.isLoading || sectionVisibility.isLoading

  // 에러 수집 (구현된 API만 체크)
  const errors = [
    profile.error,
    timeline.error,
    sectionVisibility.error,
  ].filter(Boolean)

  return {
    profile,
    timeline,
    education,
    skills,
    peerReviews,
    sideProjects,
    awards,
    internships,
    research,
    volunteer,
    externalActivities,
    sectionVisibility,
    isLoading,
    hasError: errors.length > 0,
    errors,
  }
}
