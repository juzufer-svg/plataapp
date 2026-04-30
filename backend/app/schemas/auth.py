"""
Authentication schemas
"""
from pydantic import BaseModel, Field


class UserRegistration(BaseModel):
    """User registration request"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """User login request"""
    username: str
    password: str


class Token(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"
    user_id: str


class UserResponse(BaseModel):
    """User response"""
    id: str
    username: str
    
    class Config:
        from_attributes = True
