"""
Configuration and Supabase Client Setup
Handles both Anon Key (public reads) and Service Role Key (admin writes)
"""

import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from supabase import create_client, Client
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

class Settings(BaseSettings):
    """Environment variables configuration"""

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    DATABASE_URL: str = ""

    # Admin
    ADMIN_SECRET_TOKEN: str = ""

    # App
    ENVIRONMENT: Literal["development", "production"] = "production"

    model_config = SettingsConfigDict(
        # Try to load from .env file if it exists (local development)
        # In production (Vercel), env vars are automatically available from system
        env_file="../backend/.env" if os.path.exists(os.path.join(os.path.dirname(__file__), "../backend/.env")) else None,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

# Initialize settings
settings = Settings()

# SQLAlchemy Base
Base = declarative_base()

# Database Engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=settings.ENVIRONMENT == "development"
)

# Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_supabase_client(mode: Literal["public", "admin"] = "public") -> Client:
    """
    Get Supabase client based on mode

    Args:
        mode: "public" uses ANON_KEY (RLS enforced), "admin" uses SERVICE_ROLE_KEY (RLS bypassed)

    Returns:
        Configured Supabase client
    """
    key = settings.SUPABASE_SERVICE_ROLE_KEY if mode == "admin" else settings.SUPABASE_ANON_KEY
    return create_client(settings.SUPABASE_URL, key)

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
