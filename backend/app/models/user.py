"""
User model and database operations - Supabase
Tabla: users(id, email, hashed_password, full_name, is_active, created_at, updated_at)
"""
from typing import Optional
import uuid
from app.core.security import get_password_hash, verify_password
from app.core.supabase import SupabaseDB


def _map_user(row: dict) -> dict:
    return {
        "id": row["id"],
        "email": row.get("email", ""),
        "full_name": row.get("full_name") or "",
        "hashed_password": row.get("hashed_password", ""),
        "is_active": row.get("is_active", False),
    }


class UserDB:
    TABLE_NAME = "users"

    @staticmethod
    def _is_supabase_available() -> bool:
        from app.core.config import settings
        return bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)

    @staticmethod
    async def get_by_email(email: str) -> Optional[dict]:
        if not UserDB._is_supabase_available():
            return None
        try:
            client = SupabaseDB.get_client()
            result = client.table(UserDB.TABLE_NAME)\
                .select("*")\
                .eq("email", email.lower())\
                .limit(1)\
                .execute()
            return _map_user(result.data[0]) if result.data else None
        except Exception as e:
            print(f"[UserDB.get_by_email] {e}")
            return None

    @staticmethod
    async def get_by_id(user_id: str) -> Optional[dict]:
        if not UserDB._is_supabase_available():
            return None
        try:
            client = SupabaseDB.get_client()
            result = client.table(UserDB.TABLE_NAME)\
                .select("*")\
                .eq("id", user_id)\
                .limit(1)\
                .execute()
            return _map_user(result.data[0]) if result.data else None
        except Exception as e:
            print(f"[UserDB.get_by_id] {e}")
            return None

    @staticmethod
    async def create(email: str, password: str, full_name: str = "", is_active: bool = False) -> dict:
        if not UserDB._is_supabase_available():
            raise RuntimeError("Supabase not configured")
        client = SupabaseDB.get_client()
        row = {
            "id": str(uuid.uuid4()),
            "email": email.lower(),
            "full_name": full_name,
            "hashed_password": get_password_hash(password),
            "is_active": is_active,
        }
        result = client.table(UserDB.TABLE_NAME).insert(row).execute()
        return _map_user(result.data[0])

    @staticmethod
    async def activate(email: str) -> bool:
        if not UserDB._is_supabase_available():
            return False
        try:
            client = SupabaseDB.get_client()
            client.table(UserDB.TABLE_NAME)\
                .update({"is_active": True})\
                .eq("email", email.lower())\
                .execute()
            return True
        except Exception as e:
            print(f"[UserDB.activate] {e}")
            return False
