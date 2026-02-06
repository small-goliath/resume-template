-- ===================================
-- Migration: Add tech_seminar table
-- Created: 2026-02-06
-- Purpose: F014 기술공유 세미나 섹션 추가
-- ===================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS tech_seminar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_name TEXT NOT NULL,
  seminar_url TEXT,
  year INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_tech_seminar_year ON tech_seminar(year DESC, sort_order);

-- 3. RLS (Row Level Security) 설정
ALTER TABLE tech_seminar ENABLE ROW LEVEL SECURITY;

-- 4. 공개 읽기 정책 생성
CREATE POLICY "Enable read access for all users" ON tech_seminar FOR SELECT USING (true);

-- 5. updated_at 자동 업데이트 함수 생성 (이미 존재하면 교체)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. updated_at 자동 업데이트 트리거 설정
CREATE TRIGGER update_tech_seminar_updated_at
  BEFORE UPDATE ON tech_seminar
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- Verification Queries
-- ===================================
-- 테이블 생성 확인:
-- SELECT * FROM information_schema.tables WHERE table_name = 'tech_seminar';
--
-- 인덱스 생성 확인:
-- SELECT * FROM pg_indexes WHERE tablename = 'tech_seminar';
--
-- RLS 정책 확인:
-- SELECT * FROM pg_policies WHERE tablename = 'tech_seminar';
--
-- 트리거 확인:
-- SELECT * FROM information_schema.triggers WHERE event_object_table = 'tech_seminar';
