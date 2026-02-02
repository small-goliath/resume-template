-- Resume 웹 애플리케이션 샘플 데이터
-- Supabase PostgreSQL용 초기 데이터 삽입

-- ===================================
-- 1. Profile (프로필 정보)
-- ===================================
INSERT INTO profile (name, mbti, profile_image_url, github_url, blog_url, career_document_url)
VALUES (
  '홍길동',
  'INTJ',
  'https://via.placeholder.com/200',
  'https://github.com/example',
  'https://blog.example.com',
  'https://docs.example.com/career.pdf'
) ON CONFLICT DO NOTHING;

-- ===================================
-- 2. Timeline (타임라인)
-- ===================================
INSERT INTO timeline (year, company, role, event, start_date, end_date, sort_order) VALUES
  (2023, 'ABC Company', '백엔드 개발자', '우수사원 선정', '2023-01-01', NULL, 1),
  (2022, 'XYZ Tech', '풀스택 개발자', NULL, '2022-03-01', '2022-12-31', 2),
  (2021, 'StartUp Inc', '주니어 개발자', '신입사원 교육 수료', '2021-06-01', '2022-02-28', 3)
ON CONFLICT DO NOTHING;

-- ===================================
-- 3. Education (교육사항)
-- ===================================
INSERT INTO education (institution_name, start_year, end_year, description, sort_order) VALUES
  ('서울대학교', 2017, 2021, '컴퓨터공학과 학사 졸업', 1),
  ('코드스테이츠', 2020, 2021, '풀스택 개발 부트캠프 수료', 2)
ON CONFLICT DO NOTHING;

-- ===================================
-- 4. Skill (역량)
-- ===================================
INSERT INTO skill (category, skill_name, sort_order) VALUES
  -- 언어
  ('언어', 'JavaScript', 1),
  ('언어', 'TypeScript', 2),
  ('언어', 'Python', 3),
  ('언어', 'Java', 4),

  -- 백엔드
  ('백엔드', 'Node.js', 5),
  ('백엔드', 'Express.js', 6),
  ('백엔드', 'FastAPI', 7),
  ('백엔드', 'Spring Boot', 8),

  -- 데이터베이스
  ('데이터베이스', 'PostgreSQL', 9),
  ('데이터베이스', 'MySQL', 10),
  ('데이터베이스', 'MongoDB', 11),
  ('데이터베이스', 'Redis', 12),

  -- 클라우드 및 인프라
  ('클라우드 및 인프라', 'AWS', 13),
  ('클라우드 및 인프라', 'Docker', 14),
  ('클라우드 및 인프라', 'Kubernetes', 15),
  ('클라우드 및 인프라', 'Vercel', 16),

  -- 메시징
  ('메시징', 'RabbitMQ', 17),
  ('메시징', 'Kafka', 18),

  -- 모니터링
  ('모니터링', 'Prometheus', 19),
  ('모니터링', 'Grafana', 20),

  -- 빌드 툴
  ('빌드 툴', 'Webpack', 21),
  ('빌드 툴', 'Vite', 22),
  ('빌드 툴', 'Turbopack', 23),

  -- 버전관리 및 협업
  ('버전관리 및 협업', 'Git', 24),
  ('버전관리 및 협업', 'GitHub', 25),
  ('버전관리 및 협업', 'Jira', 26),

  -- 기타
  ('기타', 'Next.js', 27),
  ('기타', 'React', 28),
  ('기타', 'TailwindCSS', 29)
ON CONFLICT DO NOTHING;

-- ===================================
-- 5. Award (수상)
-- ===================================
INSERT INTO award (award_name, award_url, contest_name, certificate_image_url, year, sort_order) VALUES
  ('우수상', 'https://example.com/award1', '학과 내 프린터 제어 프로그램 개발 경진대회', 'https://via.placeholder.com/400x300', 2020, 1),
  ('대상', 'https://example.com/award2', '전국 대학생 해커톤', 'https://via.placeholder.com/400x300', 2019, 2),
  ('장려상', NULL, '코딩 챌린지', 'https://via.placeholder.com/400x300', 2018, 3)
ON CONFLICT DO NOTHING;

-- ===================================
-- 6. Volunteer (봉사활동)
-- ===================================
INSERT INTO volunteer (organization, description, year, sort_order) VALUES
  ('서울시자원봉사센터', '코딩 교육 봉사 (초등학생 대상)', 2022, 1),
  ('지역아동센터', 'IT 멘토링 활동', 2021, 2),
  ('대학교 동아리', '신입생 프로그래밍 튜터링', 2020, 3)
ON CONFLICT DO NOTHING;

-- ===================================
-- 7. ExternalActivity (대/외활동)
-- ===================================
INSERT INTO external_activity (organization, description, year, sort_order) VALUES
  ('Google Developer Student Clubs', '코어 멤버 활동', 2021, 1),
  ('대학교 컴퓨터공학과', '학생회 임원 활동', 2020, 2),
  ('오픈소스 커뮤니티', '컨트리뷰터 활동', 2019, 3)
ON CONFLICT DO NOTHING;

-- ===================================
-- 8. Internship (인턴십)
-- ===================================
INSERT INTO internship (company, description, start_date, end_date, sort_order) VALUES
  ('네이버', '백엔드 개발 인턴 - 검색 서비스 개발팀', '2020-07-01', '2020-08-31', 1),
  ('카카오', '풀스택 개발 인턴 - 플랫폼 개발팀', '2019-12-01', '2020-02-28', 2)
ON CONFLICT DO NOTHING;

-- ===================================
-- 9. Research (연구활동)
-- ===================================
INSERT INTO research (research_name, research_url, document_url, description, year, sort_order) VALUES
  ('분산 시스템의 성능 최적화 연구', 'https://example.com/research1', 'https://example.com/paper1.pdf', 'MSA 환경에서의 서비스 간 통신 최적화 방법론 연구', 2022, 1),
  ('AI 기반 코드 리뷰 자동화 연구', 'https://example.com/research2', 'https://example.com/paper2.pdf', '머신러닝을 활용한 코드 품질 자동 검증 시스템 개발', 2021, 2)
ON CONFLICT DO NOTHING;

-- ===================================
-- 10. PeerReview (동료평가)
-- ===================================
INSERT INTO peer_review (image_url, thumbnail_url, description, year, sort_order) VALUES
  ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/200x150', '팀 프로젝트 동료 평가 - 긍정적 피드백', 2023, 1),
  ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/200x150', '코드 리뷰 우수 사례', 2022, 2),
  ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/200x150', '협업 우수 인정', 2021, 3)
ON CONFLICT DO NOTHING;

-- ===================================
-- 11. SideProject (사이드프로젝트)
-- ===================================
INSERT INTO side_project (project_name, project_url, description, status, year, sort_order) VALUES
  ('개인 블로그 플랫폼', 'https://myblog.example.com', 'Next.js + Supabase로 구축한 마크다운 기반 블로그', '서비스 중', 2023, 1),
  ('할 일 관리 앱', 'https://todo.example.com', 'React Native로 개발한 크로스 플랫폼 할 일 관리 앱', '개발 완료', 2022, 2),
  ('코딩 챌린지 플랫폼', 'https://github.com/example/coding-challenge', '알고리즘 문제 풀이 및 공유 커뮤니티', '개발 중', 2023, 3)
ON CONFLICT DO NOTHING;

-- ===================================
-- 12. SectionVisibility (섹션 표시 설정)
-- ===================================
INSERT INTO section_visibility (
  timeline_enabled,
  education_enabled,
  skills_enabled,
  peer_reviews_enabled,
  projects_enabled,
  awards_enabled,
  internships_enabled,
  research_enabled,
  volunteer_enabled,
  activities_enabled
) VALUES (
  true, true, true, true, true, true, true, true, true, true
) ON CONFLICT DO NOTHING;

-- ===================================
-- 데이터 확인 쿼리
-- ===================================
-- 모든 테이블의 데이터 개수 확인
SELECT 'profile' as table_name, COUNT(*) as count FROM profile
UNION ALL
SELECT 'timeline', COUNT(*) FROM timeline
UNION ALL
SELECT 'education', COUNT(*) FROM education
UNION ALL
SELECT 'skill', COUNT(*) FROM skill
UNION ALL
SELECT 'award', COUNT(*) FROM award
UNION ALL
SELECT 'volunteer', COUNT(*) FROM volunteer
UNION ALL
SELECT 'external_activity', COUNT(*) FROM external_activity
UNION ALL
SELECT 'internship', COUNT(*) FROM internship
UNION ALL
SELECT 'research', COUNT(*) FROM research
UNION ALL
SELECT 'peer_review', COUNT(*) FROM peer_review
UNION ALL
SELECT 'side_project', COUNT(*) FROM side_project
UNION ALL
SELECT 'section_visibility', COUNT(*) FROM section_visibility;
