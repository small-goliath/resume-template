-- Profile 테이블에 introduction 필드 추가
-- 간략한 자기소개 글을 저장하는 텍스트 필드

ALTER TABLE profile
ADD COLUMN IF NOT EXISTS introduction TEXT;

-- 기본값 설정 (선택사항)
COMMENT ON COLUMN profile.introduction IS '간략한 자기소개 글 (예: • 항목1\n• 항목2)';
