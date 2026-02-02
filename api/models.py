"""
SQLAlchemy ORM Models for 12 Database Tables
Matches Supabase PostgreSQL schema
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    Integer,
    String,
    Text,
    DateTime,
    text,
    ARRAY,
)
from sqlalchemy.dialects.postgresql import UUID
from .config import Base

class Profile(Base):
    """User profile information (single row)"""
    __tablename__ = "profile"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(Text, nullable=False)
    mbti = Column(String(4))
    profile_image_url = Column(Text)
    github_url = Column(Text)
    blog_url = Column(Text)
    career_document_url = Column(Text)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class SectionVisibility(Base):
    """Section visibility toggles (single row)"""
    __tablename__ = "section_visibility"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    timeline_enabled = Column(Boolean, default=True, nullable=False)
    education_enabled = Column(Boolean, default=True, nullable=False)
    skills_enabled = Column(Boolean, default=True, nullable=False)
    peer_reviews_enabled = Column(Boolean, default=True, nullable=False)
    projects_enabled = Column(Boolean, default=True, nullable=False)
    awards_enabled = Column(Boolean, default=True, nullable=False)
    internships_enabled = Column(Boolean, default=True, nullable=False)
    research_enabled = Column(Boolean, default=True, nullable=False)
    volunteer_enabled = Column(Boolean, default=True, nullable=False)
    activities_enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Timeline(Base):
    """Career timeline entries"""
    __tablename__ = "timeline"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    year = Column(Integer, nullable=False)
    company = Column(Text, nullable=False)
    role = Column(Text, nullable=False)
    events = Column(ARRAY(Text), default=[])
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Education(Base):
    """Educational background"""
    __tablename__ = "education"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    institution = Column(String(200), nullable=False)
    degree = Column(String(200), nullable=False)
    field_of_study = Column(String(200))
    start_year = Column(Integer, nullable=False)
    end_year = Column(Integer)
    description = Column(Text)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Skill(Base):
    """Skills categorized by type"""
    __tablename__ = "skill"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    category = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    proficiency_level = Column(String(50))
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Award(Base):
    """Awards and recognitions"""
    __tablename__ = "award"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title = Column(String(200), nullable=False)
    issuer = Column(String(200))
    issue_date = Column(Date)
    description = Column(Text)
    award_url = Column(String(500))
    certificate_image_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Volunteer(Base):
    """Volunteer activities"""
    __tablename__ = "volunteer"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    organization = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    description = Column(Text)
    is_current = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class ExternalActivity(Base):
    """External activities and engagements"""
    __tablename__ = "external_activity"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title = Column(String(200), nullable=False)
    organization = Column(String(200))
    activity_date = Column(Date)
    description = Column(Text)
    activity_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Internship(Base):
    """Internship experiences"""
    __tablename__ = "internship"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    company = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    description = Column(Text)
    location = Column(String(100))
    is_current = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class Research(Base):
    """Research projects and publications"""
    __tablename__ = "research"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title = Column(String(300), nullable=False)
    authors = Column(Text)
    publication_date = Column(Date)
    description = Column(Text)
    research_url = Column(String(500))
    document_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class PeerReview(Base):
    """Peer reviews with images"""
    __tablename__ = "peer_review"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    reviewer_name = Column(String(100), nullable=False)
    reviewer_title = Column(String(200))
    review_content = Column(Text, nullable=False)
    review_date = Column(Date)
    image_url = Column(String(500))
    thumbnail_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)

class SideProject(Base):
    """Side projects and personal work"""
    __tablename__ = "side_project"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(Text)
    project_url = Column(String(500))
    github_url = Column(String(500))
    status = Column(String(50))
    start_date = Column(Date)
    end_date = Column(Date)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("timezone('utc', now())"))
    updated_at = Column(DateTime, server_default=text("timezone('utc', now())"), onupdate=datetime.utcnow)
