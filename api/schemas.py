"""
Pydantic Schemas for Request/Response validation
"""

from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# Profile Schemas
class ProfileBase(BaseModel):
    """Base profile schema"""
    name: str = Field(..., min_length=1)
    mbti: Optional[str] = Field(None, max_length=4, pattern="^[IE][NS][FT][JP]$")
    profile_image_url: Optional[str] = None
    github_url: Optional[str] = None
    blog_url: Optional[str] = None
    career_document_url: Optional[str] = None


class ProfileCreate(ProfileBase):
    """Schema for creating profile"""
    pass


class ProfileUpdate(ProfileBase):
    """Schema for updating profile"""
    name: Optional[str] = Field(None, min_length=1)


class ProfileResponse(ProfileBase):
    """Schema for profile response"""
    id: str

    class Config:
        from_attributes = True


# SectionVisibility Schemas
class SectionVisibilityBase(BaseModel):
    """Base section visibility schema"""
    timeline_enabled: bool = True
    education_enabled: bool = True
    skills_enabled: bool = True
    peer_reviews_enabled: bool = True
    projects_enabled: bool = True
    awards_enabled: bool = True
    internships_enabled: bool = True
    research_enabled: bool = True
    volunteer_enabled: bool = True
    activities_enabled: bool = True


class SectionVisibilityUpdate(SectionVisibilityBase):
    """Schema for updating section visibility"""
    pass


class SectionVisibilityResponse(SectionVisibilityBase):
    """Schema for section visibility response"""
    id: str

    class Config:
        from_attributes = True


# Timeline Schemas
class TimelineBase(BaseModel):
    """Base timeline schema"""
    year: int = Field(..., ge=1900, le=2100)
    company: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=200)
    events: list[str] = Field(default_factory=list)
    sort_order: int = Field(default=0)


class TimelineCreate(TimelineBase):
    """Schema for creating timeline entry"""
    pass


class TimelineUpdate(BaseModel):
    """Schema for updating timeline entry"""
    year: Optional[int] = Field(None, ge=1900, le=2100)
    company: Optional[str] = Field(None, min_length=1, max_length=200)
    role: Optional[str] = Field(None, min_length=1, max_length=200)
    events: Optional[list[str]] = None
    sort_order: Optional[int] = None


class TimelineResponse(TimelineBase):
    """Schema for timeline response"""
    id: str

    class Config:
        from_attributes = True
