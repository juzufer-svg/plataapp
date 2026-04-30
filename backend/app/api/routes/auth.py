"""
Authentication routes
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import UserRegistration, UserLogin, Token, UserResponse
from app.models.user import UserDB
from app.core.security import create_access_token, verify_password
from app.core.config import settings

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegistration):
    """Register a new user"""
    # Check if user already exists
    existing_user = await UserDB.get_by_username(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )
    
    # Create new user
    new_user = await UserDB.create(
        username=user_data.username,
        password=user_data.password
    )
    
    return UserResponse(**new_user)


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user and get JWT token"""
    user = await UserDB.get_by_username(user_data.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_password(user_data.password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(access_token=access_token, user_id=user["id"])


@router.post("/refresh")
async def refresh_token():
    """Refresh JWT token"""
    # TODO: Implement token refresh logic
    pass
