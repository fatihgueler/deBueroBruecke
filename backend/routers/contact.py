"""Kontaktformular-Endpoint."""
from __future__ import annotations

import asyncio

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

try:
    from services.email_service import send_contact_notification
except ImportError:
    from backend.services.email_service import send_contact_notification

router = APIRouter(prefix="/api/contact", tags=["contact"])

CATEGORIES = ["Allgemeine Anfrage", "Kooperation / NGO", "Presseanfrage", "Technischer Support", "Feedback", "Sonstiges"]


class ContactRequest(BaseModel):
    name:     str      = Field(min_length=2, max_length=100)
    email:    EmailStr
    category: str      = Field(default="Allgemeine Anfrage")
    message:  str      = Field(min_length=10, max_length=2000)


@router.post("/", status_code=status.HTTP_200_OK)
async def send_contact(payload: ContactRequest) -> dict:
    if payload.category not in CATEGORIES:
        payload.category = "Allgemeine Anfrage"

    # SMTP ist blockierendes I/O – in Thread auslagern, damit der Event-Loop
    # währenddessen weiter andere Anfragen wie Login bedienen kann
    sent = await asyncio.to_thread(
        send_contact_notification,
        name=payload.name,
        email=payload.email,
        message=payload.message,
        category=payload.category,
    )
    return {
        "success": True,
        "emailed": sent,
        "message": "Nachricht erhalten. Wir melden uns so schnell wie möglich.",
    }
