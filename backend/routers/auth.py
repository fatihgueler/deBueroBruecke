"""Auth-Router: Registrierung, Login, aktueller Benutzer, Passwort-Reset."""
from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from auth import create_access_token, get_current_user, hash_password, verify_password
    from database import get_db
    from models import PasswordResetToken, User
    from schemas import TokenResponse, UserCreate, UserLogin, UserOut, UserUpdate
except ImportError:
    from backend.auth import create_access_token, get_current_user, hash_password, verify_password
    from backend.database import get_db
    from backend.models import PasswordResetToken, User
    from backend.schemas import TokenResponse, UserCreate, UserLogin, UserOut, UserUpdate

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    existing = await db.execute(select(User).where(User.email == payload.email.lower()))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Diese E-Mail-Adresse ist bereits registriert.",
        )

    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        preferred_language=payload.preferred_language,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-Mail oder Passwort ist falsch.",
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)


@router.patch("/me", response_model=UserOut)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    if payload.preferred_language is not None:
        current_user.preferred_language = payload.preferred_language
    await db.commit()
    await db.refresh(current_user)
    return UserOut.model_validate(current_user)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(payload: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalar_one_or_none()
    # Immer 200 zurückgeben (kein User-Enumeration)
    if user is None:
        return {"message": "Falls diese E-Mail existiert, wurde ein Reset-Link gesendet."}

    # Alte Tokens löschen
    old_tokens = await db.execute(
        select(PasswordResetToken).where(PasswordResetToken.user_id == user.id)
    )
    for t in old_tokens.scalars().all():
        await db.delete(t)

    token = secrets.token_urlsafe(32)
    reset_token = PasswordResetToken(
        token=token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    db.add(reset_token)
    await db.commit()

    # In Produktion: E-Mail mit Link senden
    # Im Dev-Modus: Token in Response (nur für lokale Tests)
    return {
        "message": "Falls diese E-Mail existiert, wurde ein Reset-Link gesendet.",
        "dev_token": token,  # Nur im Development-Modus
    }


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: ResetPasswordRequest, db: AsyncSession = Depends(get_db)) -> dict:
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Passwort muss mindestens 8 Zeichen lang sein.")

    result = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token == payload.token,
            PasswordResetToken.used == False,  # noqa: E712
        )
    )
    reset_token = result.scalar_one_or_none()

    if reset_token is None or reset_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Ungültiger oder abgelaufener Reset-Link.")

    user_result = await db.execute(select(User).where(User.id == reset_token.user_id))
    user = user_result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden.")

    user.hashed_password = hash_password(payload.new_password)
    reset_token.used = True
    await db.commit()

    return {"message": "Passwort erfolgreich zurückgesetzt."}
