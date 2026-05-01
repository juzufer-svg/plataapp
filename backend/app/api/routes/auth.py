"""
Authentication routes
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from app.schemas.auth import (
    UserRegistration, UserLogin, Token, UserResponse,
    VerifyEmailRequest, ResendCodeRequest, PendingVerification,
)
from app.models.user import UserDB
from app.core.security import create_access_token, verify_password
from app.core.config import settings
from app.utils.email import generate_code, save_code, verify_code, send_verification_email

router = APIRouter()


# ── Register ──────────────────────────────────────────────────────────────────

@router.post("/register", response_model=PendingVerification, status_code=201)
async def register(user_data: UserRegistration, background_tasks: BackgroundTasks):
    """Register a new user and send verification code to email"""
    email = user_data.email.lower()

    # Check duplicate
    existing = await UserDB.get_by_email(email)
    if existing:
        if existing["is_active"]:
            raise HTTPException(status_code=409, detail="El correo ya está registrado")
        # Already registered but pending → resend code
    else:
        # Create inactive user
        await UserDB.create(
            email=email,
            password=user_data.password,
            full_name=user_data.full_name,
            is_active=False,
        )

    # Generate & send code
    code = generate_code()
    save_code(email, code)
    background_tasks.add_task(send_verification_email, email, code)

    return PendingVerification(
        status="pending",
        message="Te enviamos un código de 6 dígitos a tu correo. Ingrésalo para activar tu cuenta.",
    )


# ── Verify email ──────────────────────────────────────────────────────────────

@router.post("/verify-email", response_model=Token)
async def verify_email(data: VerifyEmailRequest):
    """Verify email code and return JWT"""
    email = data.email.lower()

    if not verify_code(email, data.code):
        raise HTTPException(status_code=400, detail="Código inválido o expirado")

    user = await UserDB.get_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    await UserDB.activate(email)

    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return Token(access_token=access_token, user_id=user["id"], full_name=user.get("full_name"))


# ── Resend code ───────────────────────────────────────────────────────────────

@router.post("/resend-code", response_model=PendingVerification)
async def resend_code(data: ResendCodeRequest, background_tasks: BackgroundTasks):
    """Resend verification code"""
    email = data.email.lower()
    user = await UserDB.get_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="No existe una cuenta con ese correo")

    code = generate_code()
    save_code(email, code)
    background_tasks.add_task(send_verification_email, email, code)

    return PendingVerification(
        status="pending",
        message="Te reenviamos el código a tu correo.",
    )


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login")
async def login(user_data: UserLogin, background_tasks: BackgroundTasks):
    """Login with email + password. Returns JWT or pending verification."""
    email = user_data.email.lower()
    user = await UserDB.get_by_email(email)

    if not user or not verify_password(user_data.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if not user["is_active"]:
        # Send new verification code
        code = generate_code()
        save_code(email, code)
        background_tasks.add_task(send_verification_email, email, code)
        return PendingVerification(
            status="pending",
            message="Tu cuenta no está verificada. Te enviamos un nuevo código.",
        )

    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return Token(access_token=access_token, user_id=user["id"])
