-- ===================================
-- daily_routine 테이블에 분(minute) 필드 추가
-- ===================================
-- 실행일: 2026-02-03
-- 목적: 시간을 분 단위까지 정밀하게 설정 가능하도록 개선

-- 1. start_minute 필드 추가 (기본값 0)
ALTER TABLE daily_routine
ADD COLUMN IF NOT EXISTS start_minute INTEGER NOT NULL DEFAULT 0
CHECK (start_minute >= 0 AND start_minute <= 59);

-- 2. end_minute 필드 추가 (기본값 0)
ALTER TABLE daily_routine
ADD COLUMN IF NOT EXISTS end_minute INTEGER NOT NULL DEFAULT 0
CHECK (end_minute >= 0 AND end_minute <= 59);

-- 3. 기존 데이터 확인 (모든 레코드가 0분으로 설정되어 있어야 함)
SELECT
  id,
  label,
  start_hour,
  start_minute,
  end_hour,
  end_minute
FROM daily_routine
ORDER BY sort_order;

-- ===================================
-- 예시: 분 단위 루틴 추가
-- ===================================
-- 출근 시간을 6:30으로 설정하려면:
-- UPDATE daily_routine
-- SET start_minute = 30, end_minute = 30
-- WHERE label = '출근';

-- 회사업무를 13:30 ~ 17:45로 설정하려면:
-- UPDATE daily_routine
-- SET start_minute = 30, end_minute = 45
-- WHERE label = '회사업무';
