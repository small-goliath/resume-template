"""
FastAPI Main Application
Vercel automatically converts this to a serverless function
"""

from fastapi import FastAPI, HTTPException, Response, Cookie, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from datetime import datetime
import traceback
import os
from typing import Optional, List
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env.local (for local development)
# Vercel will use environment variables from dashboard
env_path = Path(__file__).resolve().parent.parent / ".env.local"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

# Import Supabase directly to avoid relative import issues in Vercel
try:
    from supabase import create_client, Client
    # Strip whitespace and newlines from environment variables
    SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "").strip()
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    ADMIN_SECRET_TOKEN = os.getenv("ADMIN_SECRET_TOKEN", "").strip()
except ImportError:
    SUPABASE_URL = ""
    SUPABASE_ANON_KEY = ""
    SUPABASE_SERVICE_ROLE_KEY = ""
    ADMIN_SECRET_TOKEN = ""

# Initialize FastAPI app - Vercel will detect and deploy this
# root_path="/api" tells FastAPI that all routes are prefixed with /api
app = FastAPI(
    title="Developer Portfolio API",
    description="FastAPI backend for developer portfolio management",
    version="1.0.0",
    root_path="/api",
)

# CORS Configuration
# 로컬 개발 및 프로덕션 환경 모두 지원
allowed_origins = [
    "http://localhost:3000",  # 로컬 개발
    "https://claude-nextjs-starters-ten.vercel.app",  # 프로덕션
]

# Vercel Preview 환경 지원 (VERCEL_URL 환경변수 사용)
vercel_url = os.getenv("VERCEL_URL")
if vercel_url:
    allowed_origins.append(f"https://{vercel_url}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Developer Portfolio API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
    }

@app.get("/health")
async def health_check():
    """Health check endpoint with Supabase connectivity test"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "message": "FastAPI is running on Vercel",
        "environment": {
            "supabase_url_configured": bool(SUPABASE_URL),
            "supabase_anon_key_configured": bool(SUPABASE_ANON_KEY),
            "supabase_service_role_key_configured": bool(SUPABASE_SERVICE_ROLE_KEY),
        },
        "database": {
            "connected": False,
            "error": None,
        }
    }

    # Test Supabase connection
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise ValueError("Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        # Try to query profile table (should have at most 1 row)
        response = supabase.table("profile").select("id").limit(1).execute()
        health_status["database"]["connected"] = True
        health_status["database"]["profile_exists"] = len(response.data) > 0
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["database"]["error"] = str(e)
        health_status["database"]["traceback"] = traceback.format_exc()

    return health_status


# Pydantic Models for Auth
class LoginRequest(BaseModel):
    token: str


# Pydantic Models for Timeline
class TimelineCreate(BaseModel):
    year: int = Field(..., ge=1900, le=2100, description="연도 (1900-2100)")
    company: str = Field(..., min_length=1, max_length=200, description="회사명")
    role: str = Field(..., min_length=1, max_length=200, description="역할")
    events: List[str] = Field(default=[], description="이벤트 목록 (선택사항)")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class TimelineUpdate(BaseModel):
    year: Optional[int] = Field(None, ge=1900, le=2100)
    company: Optional[str] = Field(None, min_length=1, max_length=200)
    role: Optional[str] = Field(None, min_length=1, max_length=200)
    events: Optional[List[str]] = Field(None)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for Education
class EducationCreate(BaseModel):
    institution_name: str = Field(..., min_length=1, max_length=200, description="교육기관명")
    start_year: int = Field(..., ge=1900, le=2100, description="시작 연도")
    end_year: Optional[int] = Field(None, ge=1900, le=2100, description="종료 연도 (선택사항)")
    description: str = Field(..., min_length=1, description="설명")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class EducationUpdate(BaseModel):
    institution_name: Optional[str] = Field(None, min_length=1, max_length=200)
    start_year: Optional[int] = Field(None, ge=1900, le=2100)
    end_year: Optional[int] = Field(None, ge=1900, le=2100)
    description: Optional[str] = Field(None, min_length=1)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for Skill
class SkillCreate(BaseModel):
    category: str = Field(..., min_length=1, max_length=100, description="카테고리")
    skill_name: str = Field(..., min_length=1, max_length=100, description="스킬명")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class SkillUpdate(BaseModel):
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    skill_name: Optional[str] = Field(None, min_length=1, max_length=100)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for PeerReview
class PeerReviewCreate(BaseModel):
    image_url: str = Field(..., description="이미지 URL")
    thumbnail_url: Optional[str] = Field(None, description="썸네일 URL (선택사항)")
    description: Optional[str] = Field(None, description="설명 (선택사항)")
    year: int = Field(..., ge=1900, le=2100, description="연도")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class PeerReviewUpdate(BaseModel):
    image_url: Optional[str] = Field(None)
    thumbnail_url: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for SideProject
class SideProjectCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=200, description="프로젝트명")
    project_url: Optional[str] = Field(None, description="프로젝트 URL (선택사항)")
    description: str = Field(..., min_length=1, description="설명")
    status: str = Field(..., min_length=1, max_length=50, description="상태")
    year: int = Field(..., ge=1900, le=2100, description="연도")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class SideProjectUpdate(BaseModel):
    project_name: Optional[str] = Field(None, min_length=1, max_length=200)
    project_url: Optional[str] = Field(None)
    description: Optional[str] = Field(None, min_length=1)
    status: Optional[str] = Field(None, min_length=1, max_length=50)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for Award
class AwardCreate(BaseModel):
    award_name: str = Field(..., min_length=1, max_length=200, description="수상명")
    award_url: Optional[str] = Field(None, description="수상 URL (선택사항)")
    contest_name: str = Field(..., min_length=1, max_length=200, description="대회명")
    certificate_image_url: Optional[str] = Field(None, description="수료증 이미지 URL (선택사항)")
    year: int = Field(..., ge=1900, le=2100, description="연도")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class AwardUpdate(BaseModel):
    award_name: Optional[str] = Field(None, min_length=1, max_length=200)
    award_url: Optional[str] = Field(None)
    contest_name: Optional[str] = Field(None, min_length=1, max_length=200)
    certificate_image_url: Optional[str] = Field(None)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for Internship
class InternshipCreate(BaseModel):
    company: str = Field(..., min_length=1, max_length=200, description="회사명")
    description: str = Field(..., min_length=1, description="설명")
    start_date: str = Field(..., description="시작일 (YYYY-MM-DD)")
    end_date: str = Field(..., description="종료일 (YYYY-MM-DD)")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class InternshipUpdate(BaseModel):
    company: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    start_date: Optional[str] = Field(None)
    end_date: Optional[str] = Field(None)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for Research
class ResearchCreate(BaseModel):
    research_name: str = Field(..., min_length=1, max_length=200, description="연구명")
    research_url: Optional[str] = Field(None, description="연구 URL (선택사항)")
    document_url: Optional[str] = Field(None, description="문서 URL (선택사항)")
    description: str = Field(..., min_length=1, description="설명")
    year: int = Field(..., ge=1900, le=2100, description="연도")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class ResearchUpdate(BaseModel):
    research_name: Optional[str] = Field(None, min_length=1, max_length=200)
    research_url: Optional[str] = Field(None)
    document_url: Optional[str] = Field(None)
    description: Optional[str] = Field(None, min_length=1)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for Volunteer
class VolunteerCreate(BaseModel):
    organization: str = Field(..., min_length=1, max_length=200, description="조직명")
    description: str = Field(..., min_length=1, description="설명")
    year: int = Field(default_factory=lambda: datetime.now().year, ge=1900, le=2100, description="연도 (자동 설정)")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class VolunteerUpdate(BaseModel):
    organization: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sort_order: Optional[int] = Field(None, ge=0)


# Pydantic Models for ExternalActivity
class ExternalActivityCreate(BaseModel):
    organization: str = Field(..., min_length=1, max_length=200, description="조직명")
    description: str = Field(..., min_length=1, description="설명")
    year: int = Field(default_factory=lambda: datetime.now().year, ge=1900, le=2100, description="연도 (자동 설정)")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")


class ExternalActivityUpdate(BaseModel):
    organization: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sort_order: Optional[int] = Field(None, ge=0)


# Authentication Dependency
def verify_admin_token(admin_token: Optional[str] = Cookie(None)):
    """
    관리자 토큰 검증 의존성
    쿠키에서 admin_token을 읽어 검증
    """
    if not ADMIN_SECRET_TOKEN:
        raise HTTPException(status_code=500, detail="Admin token not configured on server")

    if not admin_token or admin_token != ADMIN_SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized - Invalid or missing admin token")

    return admin_token


# Auth Endpoints
@app.post("/auth/login")
async def login(request: LoginRequest, response: Response):
    """
    Validate admin token and set secure cookie
    """
    try:
        if not ADMIN_SECRET_TOKEN:
            raise HTTPException(status_code=500, detail="Admin token not configured on server")

        # Validate token
        if request.token != ADMIN_SECRET_TOKEN:
            raise HTTPException(status_code=401, detail="Invalid admin token")

        # Create response with cookie
        json_response = JSONResponse(
            content={
                "message": "Login successful",
                "authenticated": True
            }
        )

        # Set secure cookie
        # In production (HTTPS), secure=True will be enforced
        # For local development, we use secure=False
        is_production = os.getenv("VERCEL_ENV") == "production"

        json_response.set_cookie(
            key="admin_token",
            value=ADMIN_SECRET_TOKEN,
            httponly=True,  # Prevent JavaScript access
            secure=is_production,  # HTTPS only in production
            samesite="lax",  # CSRF protection
            max_age=60 * 60 * 24 * 7,  # 7 days
            path="/",
        )

        return json_response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@app.post("/auth/logout")
async def logout():
    """
    Clear admin token cookie
    """
    try:
        json_response = JSONResponse(
            content={
                "message": "Logout successful",
                "authenticated": False
            }
        )

        # Clear cookie by setting max_age to 0
        json_response.set_cookie(
            key="admin_token",
            value="",
            httponly=True,
            secure=os.getenv("VERCEL_ENV") == "production",
            samesite="lax",
            max_age=0,
            path="/",
        )

        return json_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")


@app.get("/auth/status")
async def auth_status(admin_token: Optional[str] = Cookie(None)):
    """
    Check authentication status and debug token validation
    """
    return {
        "admin_token_configured": bool(ADMIN_SECRET_TOKEN),
        "admin_token_value_length": len(ADMIN_SECRET_TOKEN) if ADMIN_SECRET_TOKEN else 0,
        "cookie_received": bool(admin_token),
        "cookie_value_length": len(admin_token) if admin_token else 0,
        "tokens_match": admin_token == ADMIN_SECRET_TOKEN if admin_token and ADMIN_SECRET_TOKEN else False,
        "message": "Use for debugging authentication"
    }


# Profile Endpoints
@app.get("/profile")
async def get_profile():
    """Get profile information"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("profile").select("*").limit(1).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")


@app.put("/profile")
async def update_profile(profile_data: dict):
    """Update profile information"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        # Use service role key for write operations
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        # Check if profile exists
        existing = supabase.table("profile").select("id").limit(1).execute()

        if existing.data:
            # Update existing profile
            profile_id = existing.data[0]["id"]
            response = supabase.table("profile").update(profile_data).eq("id", profile_id).execute()
        else:
            # Create new profile
            response = supabase.table("profile").insert(profile_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save profile")

        return {
            "message": "Profile saved successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


# Section Visibility Endpoints
@app.get("/section-visibility")
async def get_section_visibility():
    """Get section visibility settings"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("section_visibility").select("*").limit(1).execute()

        if not response.data:
            # Return default values if no settings exist
            return {
                "timeline_enabled": True,
                "education_enabled": True,
                "skills_enabled": True,
                "peer_reviews_enabled": True,
                "projects_enabled": True,
                "awards_enabled": True,
                "internships_enabled": True,
                "research_enabled": True,
                "volunteer_enabled": True,
                "activities_enabled": True,
            }

        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch section visibility: {str(e)}")


@app.put("/section-visibility")
async def update_section_visibility(visibility_data: dict):
    """Update section visibility settings"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        # Use service role key for write operations
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        # Check if settings exist
        existing = supabase.table("section_visibility").select("id").limit(1).execute()

        if existing.data:
            # Update existing settings
            settings_id = existing.data[0]["id"]
            response = supabase.table("section_visibility").update(visibility_data).eq("id", settings_id).execute()
        else:
            # Create new settings
            response = supabase.table("section_visibility").insert(visibility_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save section visibility")

        return {
            "message": "Section visibility saved successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update section visibility: {str(e)}")


# Timeline Endpoints
@app.get("/timeline")
async def get_timeline():
    """Get all timeline entries, sorted by sort_order then year desc"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("timeline").select("*").order("sort_order").order("year", desc=True).execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch timeline: {str(e)}")


@app.post("/timeline")
async def create_timeline(
    timeline_data: TimelineCreate,
    _: str = Depends(verify_admin_token)
):
    """
    Create a new timeline entry (관리자 인증 필요)

    Args:
        timeline_data: 타임라인 데이터 (Pydantic 모델로 자동 검증)
        _: 관리자 토큰 검증 의존성
    """
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        # Pydantic 모델을 dict로 변환
        payload = timeline_data.model_dump()

        print(f"[DEBUG] Creating timeline with payload: {payload}")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("timeline").insert(payload).execute()

        print(f"[DEBUG] Supabase response: {response}")

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create timeline entry - no data returned")

        return {
            "message": "Timeline entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        error_detail = f"Failed to create timeline: {str(e)}"
        error_traceback = traceback.format_exc()
        print(f"[ERROR] {error_detail}")
        print(f"[ERROR] Traceback: {error_traceback}")
        raise HTTPException(status_code=500, detail=error_detail)


@app.put("/timeline/{timeline_id}")
async def update_timeline(
    timeline_id: str,
    timeline_data: TimelineUpdate,
    _: str = Depends(verify_admin_token)
):
    """
    Update a timeline entry by ID (관리자 인증 필요)

    Args:
        timeline_id: 타임라인 ID
        timeline_data: 업데이트할 데이터 (Pydantic 모델로 자동 검증)
        _: 관리자 토큰 검증 의존성
    """
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        # None이 아닌 필드만 추출
        payload = timeline_data.model_dump(exclude_unset=True)

        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        print(f"[DEBUG] Updating timeline {timeline_id} with payload: {payload}")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("timeline").update(payload).eq("id", timeline_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Timeline entry not found")

        return {
            "message": "Timeline entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        error_detail = f"Failed to update timeline: {str(e)}"
        error_traceback = traceback.format_exc()
        print(f"[ERROR] {error_detail}")
        print(f"[ERROR] Traceback: {error_traceback}")
        raise HTTPException(status_code=500, detail=error_detail)


@app.delete("/timeline/{timeline_id}")
async def delete_timeline(
    timeline_id: str,
    _: str = Depends(verify_admin_token)
):
    """
    Delete a timeline entry by ID (관리자 인증 필요)

    Args:
        timeline_id: 타임라인 ID
        _: 관리자 토큰 검증 의존성
    """
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        print(f"[DEBUG] Deleting timeline {timeline_id}")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("timeline").delete().eq("id", timeline_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Timeline entry not found")

        return {
            "message": "Timeline entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        error_detail = f"Failed to delete timeline: {str(e)}"
        error_traceback = traceback.format_exc()
        print(f"[ERROR] {error_detail}")
        print(f"[ERROR] Traceback: {error_traceback}")
        raise HTTPException(status_code=500, detail=error_detail)


# ===================================
# Education Endpoints
# ===================================
@app.get("/education")
async def get_education():
    """Get all education entries, sorted by sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("education").select("*").order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch education: {str(e)}")


@app.post("/education")
async def create_education(
    education_data: EducationCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new education entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = education_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("education").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create education entry")

        return {
            "message": "Education entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create education: {str(e)}")


@app.put("/education/{education_id}")
async def update_education(
    education_id: str,
    education_data: EducationUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update an education entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = education_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("education").update(payload).eq("id", education_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Education entry not found")

        return {
            "message": "Education entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update education: {str(e)}")


@app.delete("/education/{education_id}")
async def delete_education(
    education_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete an education entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("education").delete().eq("id", education_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Education entry not found")

        return {
            "message": "Education entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete education: {str(e)}")


# ===================================
# Skill Endpoints
# ===================================
@app.get("/skills")
async def get_skills():
    """Get all skills, sorted by category and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("skill").select("*").order("category").order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch skills: {str(e)}")


@app.post("/skills")
async def create_skill(
    skill_data: SkillCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new skill entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = skill_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("skill").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create skill entry")

        return {
            "message": "Skill entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create skill: {str(e)}")


@app.put("/skills/{skill_id}")
async def update_skill(
    skill_id: str,
    skill_data: SkillUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update a skill entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = skill_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("skill").update(payload).eq("id", skill_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Skill entry not found")

        return {
            "message": "Skill entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update skill: {str(e)}")


@app.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete a skill entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("skill").delete().eq("id", skill_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Skill entry not found")

        return {
            "message": "Skill entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete skill: {str(e)}")


# ===================================
# PeerReview Endpoints
# ===================================
@app.get("/peer-reviews")
async def get_peer_reviews():
    """Get all peer reviews, sorted by year desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("peer_review").select("*").order("year", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch peer reviews: {str(e)}")


@app.post("/peer-reviews")
async def create_peer_review(
    peer_review_data: PeerReviewCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new peer review entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = peer_review_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("peer_review").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create peer review entry")

        return {
            "message": "Peer review entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create peer review: {str(e)}")


@app.put("/peer-reviews/{peer_review_id}")
async def update_peer_review(
    peer_review_id: str,
    peer_review_data: PeerReviewUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update a peer review entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = peer_review_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("peer_review").update(payload).eq("id", peer_review_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Peer review entry not found")

        return {
            "message": "Peer review entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update peer review: {str(e)}")


@app.delete("/peer-reviews/{peer_review_id}")
async def delete_peer_review(
    peer_review_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete a peer review entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("peer_review").delete().eq("id", peer_review_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Peer review entry not found")

        return {
            "message": "Peer review entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete peer review: {str(e)}")


# ===================================
# SideProject Endpoints
# ===================================
@app.get("/projects")
async def get_projects():
    """Get all side projects, sorted by year desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("side_project").select("*").order("year", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")


@app.post("/projects")
async def create_project(
    project_data: SideProjectCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new side project entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = project_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("side_project").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create project entry")

        return {
            "message": "Project entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")


@app.put("/projects/{project_id}")
async def update_project(
    project_id: str,
    project_data: SideProjectUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update a side project entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = project_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("side_project").update(payload).eq("id", project_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Project entry not found")

        return {
            "message": "Project entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")


@app.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete a side project entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("side_project").delete().eq("id", project_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Project entry not found")

        return {
            "message": "Project entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")


# ===================================
# Award Endpoints
# ===================================
@app.get("/awards")
async def get_awards():
    """Get all awards, sorted by year desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("award").select("*").order("year", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch awards: {str(e)}")


@app.post("/awards")
async def create_award(
    award_data: AwardCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new award entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = award_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("award").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create award entry")

        return {
            "message": "Award entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create award: {str(e)}")


@app.put("/awards/{award_id}")
async def update_award(
    award_id: str,
    award_data: AwardUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update an award entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = award_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("award").update(payload).eq("id", award_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Award entry not found")

        return {
            "message": "Award entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update award: {str(e)}")


@app.delete("/awards/{award_id}")
async def delete_award(
    award_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete an award entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("award").delete().eq("id", award_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Award entry not found")

        return {
            "message": "Award entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete award: {str(e)}")


# ===================================
# Internship Endpoints
# ===================================
@app.get("/internships")
async def get_internships():
    """Get all internships, sorted by start_date desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("internship").select("*").order("start_date", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch internships: {str(e)}")


@app.post("/internships")
async def create_internship(
    internship_data: InternshipCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new internship entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = internship_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("internship").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create internship entry")

        return {
            "message": "Internship entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create internship: {str(e)}")


@app.put("/internships/{internship_id}")
async def update_internship(
    internship_id: str,
    internship_data: InternshipUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update an internship entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = internship_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("internship").update(payload).eq("id", internship_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Internship entry not found")

        return {
            "message": "Internship entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update internship: {str(e)}")


@app.delete("/internships/{internship_id}")
async def delete_internship(
    internship_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete an internship entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("internship").delete().eq("id", internship_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Internship entry not found")

        return {
            "message": "Internship entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete internship: {str(e)}")


# ===================================
# Research Endpoints
# ===================================
@app.get("/research")
async def get_research():
    """Get all research entries, sorted by year desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("research").select("*").order("year", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch research: {str(e)}")


@app.post("/research")
async def create_research(
    research_data: ResearchCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new research entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = research_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("research").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create research entry")

        return {
            "message": "Research entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create research: {str(e)}")


@app.put("/research/{research_id}")
async def update_research(
    research_id: str,
    research_data: ResearchUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update a research entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = research_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("research").update(payload).eq("id", research_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Research entry not found")

        return {
            "message": "Research entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update research: {str(e)}")


@app.delete("/research/{research_id}")
async def delete_research(
    research_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete a research entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("research").delete().eq("id", research_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Research entry not found")

        return {
            "message": "Research entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete research: {str(e)}")


# ===================================
# Volunteer Endpoints
# ===================================
@app.get("/volunteer")
async def get_volunteer():
    """Get all volunteer entries, sorted by year desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("volunteer").select("*").order("year", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch volunteer: {str(e)}")


@app.post("/volunteer")
async def create_volunteer(
    volunteer_data: VolunteerCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new volunteer entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = volunteer_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("volunteer").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create volunteer entry")

        return {
            "message": "Volunteer entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create volunteer: {str(e)}")


@app.put("/volunteer/{volunteer_id}")
async def update_volunteer(
    volunteer_id: str,
    volunteer_data: VolunteerUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update a volunteer entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = volunteer_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("volunteer").update(payload).eq("id", volunteer_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Volunteer entry not found")

        return {
            "message": "Volunteer entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update volunteer: {str(e)}")


@app.delete("/volunteer/{volunteer_id}")
async def delete_volunteer(
    volunteer_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete a volunteer entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("volunteer").delete().eq("id", volunteer_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Volunteer entry not found")

        return {
            "message": "Volunteer entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete volunteer: {str(e)}")


# ===================================
# ExternalActivity Endpoints
# ===================================
@app.get("/activities")
async def get_activities():
    """Get all external activities, sorted by year desc and sort_order"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        response = supabase.table("external_activity").select("*").order("year", desc=True).order("sort_order").execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")


@app.post("/activities")
async def create_activity(
    activity_data: ExternalActivityCreate,
    _: str = Depends(verify_admin_token)
):
    """Create a new external activity entry (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = activity_data.model_dump()
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("external_activity").insert(payload).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create activity entry")

        return {
            "message": "Activity entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create activity: {str(e)}")


@app.put("/activities/{activity_id}")
async def update_activity(
    activity_id: str,
    activity_data: ExternalActivityUpdate,
    _: str = Depends(verify_admin_token)
):
    """Update an external activity entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        payload = activity_data.model_dump(exclude_unset=True)
        if not payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("external_activity").update(payload).eq("id", activity_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Activity entry not found")

        return {
            "message": "Activity entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update activity: {str(e)}")


@app.delete("/activities/{activity_id}")
async def delete_activity(
    activity_id: str,
    _: str = Depends(verify_admin_token)
):
    """Delete an external activity entry by ID (관리자 인증 필요)"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("external_activity").delete().eq("id", activity_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Activity entry not found")

        return {
            "message": "Activity entry deleted successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete activity: {str(e)}")
