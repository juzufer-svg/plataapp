"""
Configuration settings for the application
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Full Stack App"
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:8000",
            "http://localhost:5173",
            "https://localhost:3000",
            "https://localhost:8000",
            "https://vercel.com",
            "https://*.app.github.dev",
            "http://*.app.github.dev",
            "*"  # Allow all origins in development
        ]
    )
    
    # JWT
    SECRET_KEY: str = Field(default="your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Supabase
    SUPABASE_URL: str = Field(default="")
    SUPABASE_KEY: str = Field(default="")
    SUPABASE_ANON_KEY: str = Field(default="")
    
    # Database
    DATABASE_URL: str = Field(default="postgresql://user:password@localhost/dbname")
    
    # SMTP / Email
    SMTP_HOST: str = Field(default="smtp.gmail.com")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="")
    SMTP_PASSWORD: str = Field(default="")
    FROM_EMAIL: str = Field(default="")
    FROM_NAME: str = Field(default="Finanzy")

    # Environment
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
