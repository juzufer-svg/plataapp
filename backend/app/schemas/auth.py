"""
Authentication schemas
"""
from pydantic import BaseModel, Field, EmailStr


class UserRegistration(BaseModel):
    """User registration request"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class VerifyEmailRequest(BaseModel):
    """Verify email with code"""
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)


class ResendCodeRequest(BaseModel):
    """Resend verification code"""
    email: EmailStr


class Token(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"
    user_id: str


class PendingVerification(BaseModel):
    """Response when email verification is required"""
    status: str = "pending"
    message: str


class UserResponse(BaseModel):
    """User response"""
    id: str
    email: str
    full_name: str | None = None

    class Config:
        from_attributes = True
