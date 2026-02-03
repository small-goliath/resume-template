/**
 * Database 스키마와 1:1 매칭되는 타입 정의
 * scheme.sql 기반 (단일 사용자 MVP - profile_id FK 없음)
 */

export interface Profile {
  id: string
  name: string
  mbti: string | null
  profile_image_url: string | null
  github_url: string | null
  blog_url: string | null
  career_document_url: string | null
  introduction: string | null
  created_at: string
  updated_at: string
}

export interface Timeline {
  id: string
  year: number
  company: string
  role: string
  events: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution_name: string
  start_year: number
  end_year: number | null
  description: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  category: string // '언어', '백엔드', '데이터베이스', '클라우드 및 인프라', '메시징', '모니터링', '빌드 툴', '버전관리 및 협업', '기타'
  skill_name: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PeerReview {
  id: string
  image_url: string
  thumbnail_url: string | null
  description: string | null
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SideProject {
  id: string
  project_name: string
  project_url: string | null
  description: string
  status: string
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Award {
  id: string
  award_name: string
  award_url: string | null
  contest_name: string
  certificate_image_url: string
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Internship {
  id: string
  company: string
  description: string
  start_date: string
  end_date: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Research {
  id: string
  research_name: string
  research_url: string | null
  document_url: string
  description: string
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Volunteer {
  id: string
  organization: string
  description: string
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ExternalActivity {
  id: string
  organization: string
  description: string
  year: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SectionVisibility {
  id: string
  timeline_enabled: boolean
  education_enabled: boolean
  skills_enabled: boolean
  peer_reviews_enabled: boolean
  projects_enabled: boolean
  awards_enabled: boolean
  internships_enabled: boolean
  research_enabled: boolean
  volunteer_enabled: boolean
  activities_enabled: boolean
  created_at: string
  updated_at: string
}

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

// API Response 타입
export type ApiResponse<T> =
  | {
      data: T
      error: null
    }
  | {
      data: null
      error: string
    }

// API Error 타입
export interface ApiError {
  message: string
  statusCode?: number
}
