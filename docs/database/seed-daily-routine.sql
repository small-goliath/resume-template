-- ===================================
-- daily_routine 테이블 Seed 데이터
-- ===================================
-- 24시간 루틴 시계에 표시될 기본 일일 루틴 데이터

-- profile_id는 실제 profile 테이블의 UUID로 교체해야 함
-- Supabase Dashboard에서 실행 전에 아래 명령으로 profile_id 확인:
-- SELECT id FROM profile LIMIT 1;

INSERT INTO daily_routine (profile_id, start_hour, end_hour, label, color, intensity, sort_order)
VALUES
  -- profile_id를 실제 값으로 교체
  (
    (SELECT id FROM profile LIMIT 1),  -- 첫 번째 프로필 ID 자동 가져오기
    0,
    5,
    '취침',
    'neon-cyan',
    'dim',
    1
  ),
  (
    (SELECT id FROM profile LIMIT 1),
    6,
    6,
    '출근',
    'neon-orange',
    'bright',
    2
  ),
  (
    (SELECT id FROM profile LIMIT 1),
    7,
    8,
    '재취침',
    'neon-cyan',
    'dim',
    3
  ),
  (
    (SELECT id FROM profile LIMIT 1),
    13,
    17,
    '회사업무',
    'neon-green',
    'medium',
    4
  ),
  (
    (SELECT id FROM profile LIMIT 1),
    19,
    20,
    '자기계발',
    'neon-magenta',
    'bright',
    5
  ),
  (
    (SELECT id FROM profile LIMIT 1),
    21,
    21,
    '퇴근',
    'neon-orange',
    'bright',
    6
  ),
  (
    (SELECT id FROM profile LIMIT 1),
    23,
    24,
    '휴식/제2외국어',
    'neon-purple',
    'medium',
    7
  );

-- 검증: 데이터 확인
SELECT
  id,
  start_hour,
  end_hour,
  label,
  color,
  intensity,
  sort_order
FROM daily_routine
ORDER BY sort_order;
