"""
User model and database operations - Supabase with Demo DB fallback
username se guarda en el campo 'email' de la tabla users existente
"""
from typing import Optional
import uuid
from app.core.security import get_password_hash, verify_password
from app.core.supabase import SupabaseDB
from app.models.demo_db import DemoUserDB


def _map_user(row: dict) -> dict:
    """Mapea la fila de Supabase al formato interno (email -> username)"""
    return {
        "id": row["id"],
        "username": row.get("email", ""),  # email field stores username
        "hashed_password": row.get("hashed_password", ""),
        "is_active": row.get("is_active", True),
    }


class UserDB:
    """User database operations - Supabase with Demo DB fallback"""

    TABLE_NAME = "users"
    USE_DEMO = False  # Will be set to True if Supabase fails

    @staticmethod
    def _is_supabase_available() -> bool:
        """Check if Supabase credentials are available"""
        from app.core.config import settings
        return bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)

    @staticmethod
    async def get_by_username(username: str) -> Optional[dict]:
        """Get user by username (stored in email field in Supabase)"""
        # Use demo DB if Supabase not configured
        if not UserDB._is_supabase_available():
            return await DemoUserDB.get_by_username(username)
        
        try:
            client = SupabaseDB.get_client()
            result = client.table(UserDB.TABLE_NAME)\
                .select("*")\
                .eq("email", username)\
                .limit(1)\
                .execute()
            if result.data:
                return _map_user(result.data[0])
            return None
        except Exception as e:
            print(f"Error in Supabase, falling back to demo DB: {e}")
            return await DemoUserDB.get_by_username(username)

    @staticmethod
    async def get_by_id(user_id: str) -> Optional[dict]:
        """Get user by ID"""
        # Use demo DB if Supabase not configured
        if not UserDB._is_supabase_available():
            return await DemoUserDB.get_by_id(user_id)
        
        try:
            client = SupabaseDB.get_client()
            result = client.table(UserDB.TABLE_NAME)\
                .select("*")\
                .eq("id", user_id)\
                .limit(1)\
                .execute()
            if result.data:
                return _map_user(result.data[0])
            return None
        except Exception as e:
            print(f"Error in Supabase, falling back to demo DB: {e}")
            return await DemoUserDB.get_by_id(user_id)

    @staticmethod
    async def create(username: str, password: str) -> dict:
        """Create a new user"""
        # Use demo DB if Supabase not configured
        if not UserDB._is_supabase_available():
            return await DemoUserDB.create(username, password)
        
        try:
            client = SupabaseDB.get_client()
            user_id = str(uuid.uuid4())
            row = {
                "id": user_id,
                "email": username,          # username stored in email field
                "hashed_password": get_password_hash(password),
                "is_active": True,
            }
            result = client.table(UserDB.TABLE_NAME).insert(row).execute()
            return _map_user(result.data[0])
        except Exception as e:
            print(f"Error in Supabase, falling back to demo DB: {e}")
            return await DemoUserDB.create(username, password)

    @staticmethod
    async def verify_password(user_id: str, password: str) -> bool:
        """Verify user password"""
        user = await UserDB.get_by_id(user_id)
        if not user:
            return False
        return verify_password(password, user.get("hashed_password", ""))
