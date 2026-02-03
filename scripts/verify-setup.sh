#!/bin/bash

# 로컬 개발 환경 검증 스크립트
# 사용법: bash scripts/verify-setup.sh

set -e  # 에러 발생 시 중단

echo "======================================"
echo "로컬 개발 환경 검증 시작"
echo "======================================"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 체크 함수
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 설치됨: $($1 --version 2>&1 | head -n 1)"
    else
        echo -e "${RED}✗${NC} $1 설치되지 않음"
        return 1
    fi
}

# 1. Node.js 및 npm 확인
echo "1. Node.js 및 npm 확인"
echo "------------------------"
check_command node
check_command npm
echo ""

# 2. Python 확인
echo "2. Python 확인"
echo "------------------------"
check_command python3 || check_command python
check_command pip3 || check_command pip
echo ""

# 3. Git 확인
echo "3. Git 확인"
echo "------------------------"
check_command git
echo ""

# 4. 의존성 설치 확인
echo "4. Node.js 의존성 확인"
echo "------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 존재"
else
    echo -e "${YELLOW}⚠${NC} node_modules 없음 - npm install 실행 필요"
fi
echo ""

# 5. Python 가상환경 확인
echo "5. Python 가상환경 확인"
echo "------------------------"
if [ -d "api/venv" ]; then
    echo -e "${GREEN}✓${NC} api/venv 존재"
else
    echo -e "${YELLOW}⚠${NC} api/venv 없음 - 가상환경 생성 필요"
    echo "   실행: cd api && python -m venv venv"
fi
echo ""

# 6. 환경변수 파일 확인
echo "6. 환경변수 파일 확인"
echo "------------------------"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local 존재"

    # 필수 환경변수 확인
    if grep -q "SUPABASE_URL=" .env.local && \
       grep -q "SUPABASE_ANON_KEY=" .env.local && \
       grep -q "ADMIN_SECRET_TOKEN=" .env.local; then
        echo -e "${GREEN}✓${NC} 필수 환경변수 설정됨"
    else
        echo -e "${YELLOW}⚠${NC} 일부 환경변수 누락 가능성"
    fi
else
    echo -e "${RED}✗${NC} .env.local 없음"
    echo "   .env.local.example을 복사하여 생성하세요:"
    echo "   cp .env.local.example .env.local"
fi
echo ""

# 7. 필수 파일 존재 확인
echo "7. 필수 파일 확인"
echo "------------------------"
files=(
    "package.json"
    "next.config.ts"
    "tsconfig.json"
    "api/index.py"
    "api/requirements.txt"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file 없음"
    fi
done
echo ""

# 8. 타입 체크
echo "8. TypeScript 타입 체크"
echo "------------------------"
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 타입 체크 통과"
else
    echo -e "${RED}✗${NC} 타입 에러 발견"
    echo "   실행: npm run typecheck"
fi
echo ""

# 9. 린트 체크
echo "9. ESLint 체크"
echo "------------------------"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 린트 통과"
else
    echo -e "${YELLOW}⚠${NC} 린트 경고/에러 발견"
    echo "   실행: npm run lint"
fi
echo ""

# 10. 포트 사용 확인
echo "10. 포트 사용 확인"
echo "------------------------"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} 포트 3000 이미 사용 중"
else
    echo -e "${GREEN}✓${NC} 포트 3000 사용 가능"
fi

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} 포트 8000 이미 사용 중"
else
    echo -e "${GREEN}✓${NC} 포트 8000 사용 가능"
fi
echo ""

# 최종 결과
echo "======================================"
echo "검증 완료"
echo "======================================"
echo ""
echo "다음 단계:"
echo "1. .env.local 파일 설정 (아직 안 했다면)"
echo "2. npm run dev 실행하여 개발 서버 시작"
echo "3. http://localhost:3000 접속"
echo ""
echo "문제 발생 시: docs/LOCAL_DEVELOPMENT.md 참조"
