"""
FastAPI Main Application
Vercel automatically converts this to a serverless function
"""

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime
import traceback
import os
from typing import Optional
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
# 로컬 개발: Next.js 개발 서버(localhost:3000)만 허용
# 프로덕션: Vercel이 자동으로 same-origin이므로 CORS 불필요
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # 로컬 개발 환경
        "https://*.vercel.app",   # Vercel 프리뷰/프로덕션
    ],
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
async def auth_status(response: Response):
    """
    Check authentication status
    Note: This endpoint doesn't verify the token - that's done by Next.js middleware
    It just returns whether a token cookie exists
    """
    return {
        "admin_token_configured": bool(ADMIN_SECRET_TOKEN),
        "message": "Use Next.js middleware for actual auth verification"
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
async def create_timeline(timeline_data: dict):
    """Create a new timeline entry"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("timeline").insert(timeline_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create timeline entry")

        return {
            "message": "Timeline entry created successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create timeline: {str(e)}")


@app.put("/timeline/{timeline_id}")
async def update_timeline(timeline_id: str, timeline_data: dict):
    """Update a timeline entry by ID"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = supabase.table("timeline").update(timeline_data).eq("id", timeline_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Timeline entry not found")

        return {
            "message": "Timeline entry updated successfully",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update timeline: {str(e)}")


@app.delete("/timeline/{timeline_id}")
async def delete_timeline(timeline_id: str):
    """Delete a timeline entry by ID"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

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
        raise HTTPException(status_code=500, detail=f"Failed to delete timeline: {str(e)}")
