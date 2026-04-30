"""
Main FastAPI application with Supabase integration
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, users, plataapp
from app.models.demo_db import DemoUserDB
from app.core.security import get_password_hash
import asyncio

# Initialize FastAPI app
app = FastAPI(
    title="Full Stack API",
    description="API con autenticación JWT y Base de Datos Supabase",
    version="1.0.0"
)

# ============================================
# Initialize Demo Users (for development)
# ============================================
async def init_demo_users():
    """Initialize demo users if using demo database"""
    from app.models.user import UserDB
    
    # Check if using demo database
    if not UserDB._is_supabase_available():
        # Pre-load demo users
        demo_users = [
            ("julian", "password123"),
            ("alice", "password123"),
            ("bob", "password123"),
        ]
        
        for username, password in demo_users:
            existing = await DemoUserDB.get_by_username(username)
            if not existing:
                user = await DemoUserDB.create(username, password)
                print(f"✅ Created demo user: {username}")
            else:
                print(f"✓ Demo user already exists: {username}")

@app.on_event("startup")
async def startup_event():
    """Run on startup"""
    await init_demo_users()
    print("🚀 Application started - using Demo DB for authentication")

# CORS Middleware Configuration
# IMPORTANT: allow_origins=["*"] is INCOMPATIBLE with allow_credentials=True
# Must use explicit origins or allow_origin_regex
import os

codespace_name = os.getenv("CODESPACE_NAME", "").strip()

allow_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:5173",
    "https://localhost:3000",
    "https://localhost:8000",
]

if codespace_name:
    allow_origins.extend([
        f"https://{codespace_name}-3000.app.github.dev",
        f"https://{codespace_name}-8000.app.github.dev",
        f"http://{codespace_name}-3000.app.github.dev",
        f"http://{codespace_name}-8000.app.github.dev",
    ])
    print(f"✓ Codespaces detected: {codespace_name}")

# Vercel frontend URL
vercel_url = os.getenv("VERCEL_URL", "").strip()
if vercel_url:
    allow_origins.append(f"https://{vercel_url}")

# Always allow Vercel production domain
allow_origins.extend([
    "https://plataapp-omega.vercel.app",
    "https://plataapp.vercel.app",
])

print(f"✓ CORS allowed origins: {allow_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://(.*\.app\.github\.dev|.*\.vercel\.app)",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(plataapp.router, prefix="/api/v1", tags=["plataapp"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bienvenido a tu API Full Stack",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/api/v1/diagnostics")
async def diagnostics():
    """Diagnostics endpoint - checks database connection"""
    from app.models.user import UserDB
    
    # Check if Supabase is available
    supabase_available = UserDB._is_supabase_available()
    
    # Try to connect to Supabase
    supabase_connected = False
    supabase_error = None
    demo_db_users = 0
    supabase_users = []
    
    if supabase_available:
        try:
            from app.core.supabase import SupabaseDB
            client = SupabaseDB.get_client()
            # Try to get all users
            result = client.table("users").select("id,email,is_active").execute()
            supabase_connected = True
            user_count = len(result.data) if result.data else 0
            supabase_users = [{"id": u.get("id"), "email": u.get("email"), "is_active": u.get("is_active")} for u in (result.data or [])]
        except Exception as e:
            supabase_error = str(e)
            user_count = None
    else:
        user_count = None
    
    # Count demo DB users
    from app.models.demo_db import DemoUserDB
    demo_db_users = len(DemoUserDB._users)
    
    return {
        "environment": settings.ENVIRONMENT,
        "supabase": {
            "configured": supabase_available,
            "connected": supabase_connected,
            "error": supabase_error,
            "url": settings.SUPABASE_URL[:30] + "..." if settings.SUPABASE_URL else "Not configured",
            "users_count": user_count,
            "users": supabase_users
        },
        "demo_db": {
            "users_count": demo_db_users,
            "users": list(DemoUserDB._users.keys())
        },
        "using": "Supabase" if (supabase_available and supabase_connected) else "Demo DB (Fallback)"
    }

@app.get("/api/v1/diagnostics/create-test-user")
async def create_test_user(username: str = "julian", password: str = "password123"):
    """Create a test user for development"""
    from app.models.user import UserDB
    
    try:
        # Check if user already exists
        existing_user = await UserDB.get_by_username(username)
        if existing_user:
            return {
                "success": False,
                "message": f"User '{username}' already exists",
                "user_id": existing_user.get("id")
            }
        
        # Create new user
        new_user = await UserDB.create(username, password)
        return {
            "success": True,
            "message": f"User '{username}' created successfully",
            "user_id": new_user.get("id"),
            "username": new_user.get("username")
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error creating user: {str(e)}",
            "error": type(e).__name__
        }

@app.get("/api/v1/diagnostics/reset-password")
async def reset_password(username: str = "julian", new_password: str = "password123"):
    """Reset user password - DEV ONLY"""
    from app.models.user import UserDB
    from app.core.security import get_password_hash
    
    try:
        user = await UserDB.get_by_username(username)
        if not user:
            return {
                "success": False,
                "message": f"User '{username}' not found"
            }
        
        # Update password in Supabase
        from app.core.supabase import SupabaseDB
        client = SupabaseDB.get_client()
        
        result = client.table("users")\
            .update({"hashed_password": get_password_hash(new_password)})\
            .eq("id", user["id"])\
            .execute()
        
        return {
            "success": True,
            "message": f"Password for '{username}' reset to '{new_password}'",
            "user_id": user["id"],
            "username": username
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error resetting password: {str(e)}",
            "error": type(e).__name__
        }

@app.get("/api/v1/diagnostics/test-login")
async def test_login(username: str = "julian", password: str = "password123"):
    """Test login and show debug info"""
    from app.models.user import UserDB
    from app.core.security import verify_password
    
    try:
        # Get user
        user = await UserDB.get_by_username(username)
        if not user:
            return {
                "success": False,
                "message": f"User '{username}' not found"
            }
        
        # Get raw data from Supabase to debug
        from app.core.supabase import SupabaseDB
        client = SupabaseDB.get_client()
        raw_result = client.table("users")\
            .select("*")\
            .eq("email", username)\
            .limit(1)\
            .execute()
        
        raw_user = raw_result.data[0] if raw_result.data else None
        
        # Try to verify password
        hashed_password = user.get("hashed_password", "")
        password_match = verify_password(password, hashed_password)
        
        return {
            "success": password_match,
            "debug": {
                "user_id": user.get("id"),
                "username": user.get("username"),
                "hashed_password_length": len(hashed_password),
                "hashed_password_preview": hashed_password[:50] if hashed_password else "EMPTY",
                "password_match": password_match,
                "raw_user_keys": list(raw_user.keys()) if raw_user else None,
                "raw_hashed_password": raw_user.get("hashed_password") if raw_user else None,
                "raw_hashed_password_length": len(raw_user.get("hashed_password", "")) if raw_user else 0
            },
            "message": f"Login {'successful' if password_match else 'failed'}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error testing login: {str(e)}",
            "error": type(e).__name__,
            "traceback": str(e)
        }

@app.post("/api/v1/diagnostics/test-login-post")
async def test_login_post(username: str = "julian", password: str = "password123"):
    """Test login POST endpoint - debug version"""
    from app.models.user import UserDB
    from app.core.security import verify_password, create_access_token
    from datetime import timedelta
    
    try:
        # Step 1: Get user
        print(f"[DEBUG] Attempting login for user: {username}")
        user = await UserDB.get_by_username(username)
        
        if not user:
            print(f"[DEBUG] User not found: {username}")
            return {
                "success": False,
                "step": 1,
                "message": f"User '{username}' not found"
            }
        
        print(f"[DEBUG] User found: {user}")
        
        # Step 2: Verify password
        hashed_password = user.get("hashed_password", "")
        print(f"[DEBUG] Hashed password: {hashed_password[:30]}...")
        
        password_match = verify_password(password, hashed_password)
        print(f"[DEBUG] Password match: {password_match}")
        
        if not password_match:
            return {
                "success": False,
                "step": 2,
                "message": "Invalid credentials",
                "debug": {
                    "user_id": user.get("id"),
                    "password_match": False
                }
            }
        
        # Step 3: Create token
        print(f"[DEBUG] Creating access token...")
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["id"]},
            expires_delta=access_token_expires
        )
        
        print(f"[DEBUG] Token created successfully")
        
        return {
            "success": True,
            "step": 3,
            "message": "Login successful",
            "access_token": access_token,
            "user_id": user["id"],
            "token_type": "bearer"
        }
        
    except Exception as e:
        print(f"[DEBUG] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "message": f"Error: {str(e)}",
            "error": type(e).__name__,
            "traceback": traceback.format_exc()
        }

@app.post("/api/v1/diagnostics/debug-login")
async def debug_login(username: str = "julian", password: str = "password123"):
    """Test login with POST JSON - debug version"""
    from app.models.user import UserDB
    from app.core.security import verify_password, create_access_token
    from datetime import timedelta
    
    print(f"\n=== DEBUG LOGIN START ===")
    print(f"Username: {username}")
    print(f"Password: {password}")
    
    try:
        # Get user
        user = await UserDB.get_by_username(username)
        print(f"User found: {user is not None}")
        
        if not user:
            return {"success": False, "message": "User not found"}
        
        # Verify password
        hashed_password = user.get("hashed_password", "")
        password_match = verify_password(password, hashed_password)
        print(f"Password match: {password_match}")
        
        if not password_match:
            return {"success": False, "message": "Invalid credentials"}
        
        # Create token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["id"]},
            expires_delta=access_token_expires
        )
        
        print(f"Login successful!\n=== DEBUG LOGIN END ===\n")
        
        return {
            "success": True,
            "access_token": access_token,
            "user_id": user["id"],
            "token_type": "bearer"
        }
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "message": f"Error: {str(e)}",
            "error": type(e).__name__
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
