-- Resume 웹 애플리케이션 데이터베이스 스키마
-- Supabase PostgreSQL용 스키마 정의
--
-- 🎯 설계 원칙: 단일 사용자 MVP
-- - 모든 테이블은 단일 사용자(본인)의 데이터만 저장
-- - profile_id FK 관계 불필요 (향후 다중 사용자 지원 시 추가)
-- - 공개 읽기 정책으로 누구나 조회 가능

-- ===================================
-- 1. Profile (프로필 정보)
-- ===================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mbti VARCHAR(4),
  profile_image_url TEXT,
  github_url TEXT,
  blog_url TEXT,
  career_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 2. Timeline (타임라인)
-- ===================================
CREATE TABLE IF NOT EXISTS timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  events TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 3. Education (교육사항)
-- ===================================
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 4. Skill (역량)
-- ===================================
CREATE TABLE IF NOT EXISTS skill (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- category 값: '언어', '백엔드', '데이터베이스', '클라우드 및 인프라',
-- '메시징', '모니터링', '빌드 툴', '버전관리 및 협업', '기타'

-- ===================================
-- 5. Award (수상)
-- ===================================
CREATE TABLE IF NOT EXISTS award (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  award_name TEXT NOT NULL,
  award_url TEXT,
  contest_name TEXT NOT NULL,
  certificate_image_url TEXT NOT NULL,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 6. Volunteer (봉사활동)
-- ===================================
CREATE TABLE IF NOT EXISTS volunteer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 7. ExternalActivity (대/외활동)
-- ===================================
CREATE TABLE IF NOT EXISTS external_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 8. Internship (인턴십)
-- ===================================
CREATE TABLE IF NOT EXISTS internship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 9. Research (연구활동)
-- ===================================
CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_name TEXT NOT NULL,
  research_url TEXT,
  document_url TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 10. PeerReview (동료평가)
-- ===================================
CREATE TABLE IF NOT EXISTS peer_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 11. SideProject (사이드프로젝트)
-- ===================================
CREATE TABLE IF NOT EXISTS side_project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  project_url TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- status 값 예시: '서비스 중', '개발 완료', '개발 중', '중단'

-- ===================================
-- 12. SectionVisibility (섹션 표시 설정)
-- ===================================
CREATE TABLE IF NOT EXISTS section_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_enabled BOOLEAN DEFAULT true,
  education_enabled BOOLEAN DEFAULT true,
  skills_enabled BOOLEAN DEFAULT true,
  peer_reviews_enabled BOOLEAN DEFAULT true,
  projects_enabled BOOLEAN DEFAULT true,
  awards_enabled BOOLEAN DEFAULT true,
  internships_enabled BOOLEAN DEFAULT true,
  research_enabled BOOLEAN DEFAULT true,
  volunteer_enabled BOOLEAN DEFAULT true,
  activities_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 13. DailyRoutine (일일 루틴)
-- ===================================
CREATE TABLE IF NOT EXISTS daily_routine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
  start_hour INTEGER NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour INTEGER NOT NULL CHECK (end_hour >= 0 AND end_hour <= 23),
  label TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('neon-cyan', 'neon-magenta', 'neon-purple', 'neon-green', 'neon-orange')),
  intensity TEXT NOT NULL CHECK (intensity IN ('dim', 'medium', 'bright')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 인덱스 생성 (성능 최적화)
-- ===================================
CREATE INDEX IF NOT EXISTS idx_timeline_sort ON timeline(sort_order);
CREATE INDEX IF NOT EXISTS idx_education_sort ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_skill_category ON skill(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_award_year ON award(year DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_volunteer_year ON volunteer(year DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_external_activity_year ON external_activity(year DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_internship_start ON internship(start_date DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_research_year ON research(year DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_peer_review_year ON peer_review(year DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_side_project_year ON side_project(year DESC, sort_order);
CREATE INDEX IF NOT EXISTS idx_daily_routine_sort ON daily_routine(sort_order);
CREATE INDEX IF NOT EXISTS idx_daily_routine_profile ON daily_routine(profile_id);

-- ===================================
-- Row Level Security (RLS) 설정
-- ===================================
-- MVP 단계에서는 RLS를 비활성화하여 공개 읽기 허용
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE award ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship ENABLE ROW LEVEL SECURITY;
ALTER TABLE research ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE side_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_routine ENABLE ROW LEVEL SECURITY;

-- 모든 테이블에 대해 공개 읽기 정책 생성
CREATE POLICY "Enable read access for all users" ON profile FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON timeline FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON education FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON skill FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON award FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON volunteer FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON external_activity FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON internship FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON research FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON peer_review FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON side_project FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON section_visibility FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON daily_routine FOR SELECT USING (true);

-- ===================================
-- 업데이트 트리거 함수
-- ===================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 모든 테이블에 updated_at 자동 업데이트 트리거 설정
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timeline_updated_at BEFORE UPDATE ON timeline FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_updated_at BEFORE UPDATE ON skill FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_award_updated_at BEFORE UPDATE ON award FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_updated_at BEFORE UPDATE ON volunteer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_external_activity_updated_at BEFORE UPDATE ON external_activity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internship_updated_at BEFORE UPDATE ON internship FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_updated_at BEFORE UPDATE ON research FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_peer_review_updated_at BEFORE UPDATE ON peer_review FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_side_project_updated_at BEFORE UPDATE ON side_project FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_section_visibility_updated_at BEFORE UPDATE ON section_visibility FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_routine_updated_at BEFORE UPDATE ON daily_routine FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
