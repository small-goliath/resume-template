import { z } from 'zod'

/**
 * Zod Validation 스키마
 * 폼 입력 및 API 요청 데이터 검증에 사용
 */

// 프로필 스키마
export const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  mbti: z
    .string()
    .length(4, 'MBTI는 4자리여야 합니다')
    .regex(/^[EISTFPNJ]{4}$/, '유효한 MBTI 유형을 입력하세요')
    .nullable()
    .optional(),
  profile_image_url: z
    .string()
    .url('유효한 URL을 입력하세요')
    .nullable()
    .optional(),
  github_url: z.string().url('유효한 URL을 입력하세요').nullable().optional(),
  blog_url: z.string().url('유효한 URL을 입력하세요').nullable().optional(),
  career_document_url: z
    .string()
    .url('유효한 URL을 입력하세요')
    .nullable()
    .optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

// 타임라인 스키마
export const timelineSchema = z.object({
  year: z.number().int().min(1900, '유효한 연도를 입력하세요').max(2100),
  company: z.string().min(1, '회사명을 입력하세요'),
  role: z.string().min(1, '역할을 입력하세요'),
  events: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
})

export type TimelineInput = z.infer<typeof timelineSchema>

// 교육사항 스키마
export const educationSchema = z.object({
  institution_name: z.string().min(1, '교육 기관명을 입력하세요'),
  start_year: z.number().int().min(1900, '유효한 시작 연도를 입력하세요'),
  end_year: z
    .number()
    .int()
    .min(1900, '유효한 종료 연도를 입력하세요')
    .nullable()
    .optional(),
  description: z.string().min(1, '교육 내용을 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type EducationInput = z.infer<typeof educationSchema>

// 역량 스키마
export const skillSchema = z.object({
  category: z.string().min(1, '카테고리를 입력하세요'),
  skill_name: z.string().min(1, '스킬명을 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type SkillInput = z.infer<typeof skillSchema>

// 동료평가 스키마
export const peerReviewSchema = z.object({
  image_url: z.string().url('유효한 URL을 입력하세요'),
  thumbnail_url: z
    .string()
    .url('유효한 URL을 입력하세요')
    .nullable()
    .optional(),
  description: z.string().nullable().optional(),
  year: z.number().int().min(1900, '유효한 연도를 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type PeerReviewInput = z.infer<typeof peerReviewSchema>

// 사이드프로젝트 스키마
export const sideProjectSchema = z.object({
  project_name: z.string().min(1, '프로젝트명을 입력하세요'),
  project_url: z.string().url('유효한 URL을 입력하세요').nullable().optional(),
  description: z.string().min(1, '프로젝트 설명을 입력하세요'),
  status: z.enum(['서비스 중', '개발 완료', '개발 중', '중단']),
  year: z.number().int().min(1900, '유효한 연도를 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type SideProjectInput = z.infer<typeof sideProjectSchema>

// 수상 스키마
export const awardSchema = z.object({
  award_name: z.string().min(1, '수상명을 입력하세요'),
  award_url: z.string().url('유효한 URL을 입력하세요').nullable().optional(),
  contest_name: z.string().min(1, '대회명을 입력하세요'),
  certificate_image_url: z.string().url('유효한 URL을 입력하세요'),
  year: z.number().int().min(1900, '유효한 연도를 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type AwardInput = z.infer<typeof awardSchema>

// 인턴십 스키마
export const internshipSchema = z.object({
  company: z.string().min(1, '회사명을 입력하세요'),
  description: z.string().min(1, '업무 내용을 입력하세요'),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '유효한 날짜 형식(YYYY-MM-DD)을 입력하세요'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '유효한 날짜 형식(YYYY-MM-DD)을 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type InternshipInput = z.infer<typeof internshipSchema>

// 연구활동 스키마
export const researchSchema = z.object({
  research_name: z.string().min(1, '연구명을 입력하세요'),
  research_url: z.string().url('유효한 URL을 입력하세요').nullable().optional(),
  document_url: z.string().url('유효한 URL을 입력하세요'),
  description: z.string().min(1, '연구 내용을 입력하세요'),
  year: z.number().int().min(1900, '유효한 연도를 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type ResearchInput = z.infer<typeof researchSchema>

// 봉사활동 스키마
export const volunteerSchema = z.object({
  organization: z.string().min(1, '기관명을 입력하세요'),
  description: z.string().min(1, '봉사 내용을 입력하세요'),
  year: z.number().int().min(1900, '유효한 연도를 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type VolunteerInput = z.infer<typeof volunteerSchema>

// 대외활동 스키마
export const externalActivitySchema = z.object({
  organization: z.string().min(1, '기관명을 입력하세요'),
  description: z.string().min(1, '활동 내용을 입력하세요'),
  year: z.number().int().min(1900, '유효한 연도를 입력하세요'),
  sort_order: z.number().int().default(0),
})

export type ExternalActivityInput = z.infer<typeof externalActivitySchema>

// 섹션 표시 설정 스키마
export const sectionVisibilitySchema = z.object({
  timeline_enabled: z.boolean().default(true),
  education_enabled: z.boolean().default(true),
  skills_enabled: z.boolean().default(true),
  peer_reviews_enabled: z.boolean().default(true),
  projects_enabled: z.boolean().default(true),
  awards_enabled: z.boolean().default(true),
  internships_enabled: z.boolean().default(true),
  research_enabled: z.boolean().default(true),
  volunteer_enabled: z.boolean().default(true),
  activities_enabled: z.boolean().default(true),
})

export type SectionVisibilityInput = z.infer<typeof sectionVisibilitySchema>

// 로그인 스키마
export const loginSchema = z.object({
  token: z.string().min(1, '토큰을 입력하세요'),
})

export type LoginInput = z.infer<typeof loginSchema>
