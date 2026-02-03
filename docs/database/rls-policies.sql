-- ===================================
-- RLS 정책 추가
-- ===================================
-- Service Role Key를 사용하면 RLS를 무시하므로
-- 이 정책들은 주로 안전 장치 역할을 합니다.
--
-- 실제 관리자 인증은 FastAPI의 admin_token 쿠키로 처리됩니다.

-- Timeline INSERT/UPDATE/DELETE 정책
-- (Service Role Key는 이를 무시하고 모든 작업 가능)
CREATE POLICY "Enable insert for service role" ON timeline FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON timeline FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON timeline FOR DELETE USING (true);

-- Profile INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON profile FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON profile FOR DELETE USING (true);

-- Education INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON education FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON education FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON education FOR DELETE USING (true);

-- Skill INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON skill FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON skill FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON skill FOR DELETE USING (true);

-- Award INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON award FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON award FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON award FOR DELETE USING (true);

-- Volunteer INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON volunteer FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON volunteer FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON volunteer FOR DELETE USING (true);

-- External Activity INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON external_activity FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON external_activity FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON external_activity FOR DELETE USING (true);

-- Internship INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON internship FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON internship FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON internship FOR DELETE USING (true);

-- Research INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON research FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON research FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON research FOR DELETE USING (true);

-- Peer Review INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON peer_review FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON peer_review FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON peer_review FOR DELETE USING (true);

-- Side Project INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON side_project FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON side_project FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON side_project FOR DELETE USING (true);

-- Section Visibility INSERT/UPDATE/DELETE 정책
CREATE POLICY "Enable insert for service role" ON section_visibility FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON section_visibility FOR UPDATE USING (true);
CREATE POLICY "Enable delete for service role" ON section_visibility FOR DELETE USING (true);

-- ===================================
-- 정책 확인 쿼리
-- ===================================
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
