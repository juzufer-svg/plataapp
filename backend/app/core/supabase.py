"""
Supabase database connection and utilities
"""
from supabase import create_client, Client
from app.core.config import settings


class SupabaseDB:
    """Supabase connection manager"""
    
    _client: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client"""
        if cls._client is None:
            cls._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY  # Use service_role key for backend operations
            )
        return cls._client
    
    @classmethod
    def close(cls):
        """Close the connection"""
        cls._client = None


# Dependency to get Supabase client
def get_supabase() -> Client:
    """Dependency for getting Supabase client"""
    return SupabaseDB.get_client()
