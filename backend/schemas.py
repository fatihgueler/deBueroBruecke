"""Pydantic v2 Schemas für Request- und Response-Validierung."""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

SupportedLanguage = Literal["de", "tr", "ar", "ru", "ku"]
UrgencyLevel = Literal["low", "medium", "high", "critical"]
DocumentStatus = Literal["pending", "analyzed", "error"]


# ----- User -----
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    preferred_language: SupportedLanguage = "de"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    preferred_language: Optional[SupportedLanguage] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    preferred_language: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ----- Analysis -----
class AnalysisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    authority_type: str
    letter_type: str
    demand: str
    deadline: Optional[str]
    consequence: str
    action_required: str
    full_explanation: str
    urgency_level: str
    reply_draft: Optional[str]
    language: str
    created_at: datetime


# ----- Document -----
class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    original_filename: str
    file_type: str
    status: str
    created_at: datetime
    analysis: Optional[AnalysisOut] = None


# ----- Reply Draft -----
class ReplyDraftRequest(BaseModel):
    additional_context: Optional[str] = Field(default=None, max_length=1000)
