"""
Users routes
"""
from fastapi import APIRouter, HTTPException, Header, status
from app.schemas.auth import UserResponse
from app.models.user import UserDB
from app.core.security import decode_token

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(authorization: str = Header(...)):
    """Get current user information"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    user = await UserDB.get_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user)
