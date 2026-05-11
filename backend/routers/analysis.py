"""Analyse-Router: KI-Analyse starten, abrufen, Antwortentwurf generieren."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from auth import get_current_user
    from database import get_db
    from models import Analysis, Document, User
    from schemas import AnalysisOut, ReplyDraftRequest
    from services.claude_service import get_claude_service
except ImportError:
    from backend.auth import get_current_user
    from backend.database import get_db
    from backend.models import Analysis, Document, User
    from backend.schemas import AnalysisOut, ReplyDraftRequest
    from backend.services.claude_service import get_claude_service

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


async def _load_document_for_user(
    document_id: str, user_id: str, db: AsyncSession
) -> Document:
    result = await db.execute(
        select(Document).where(Document.id == document_id, Document.user_id == user_id)
    )
    document = result.scalar_one_or_none()
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dokument nicht gefunden.",
        )
    return document


@router.post(
    "/{document_id}",
    response_model=AnalysisOut,
    status_code=status.HTTP_201_CREATED,
)
async def analyze_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AnalysisOut:
    document = await _load_document_for_user(document_id, current_user.id, db)

    # Wenn bereits analysiert: bestehende Analyse zurückgeben
    if document.analysis is not None:
        return AnalysisOut.model_validate(document.analysis)

    if not document.raw_text.strip():
        document.status = "error"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Text konnte nicht erkannt werden. Bitte lade ein klareres Bild oder PDF hoch.",
        )

    service = get_claude_service()
    try:
        result = await service.analyze_letter(document.raw_text, current_user.preferred_language)
    except ValueError as exc:
        document.status = "error"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        document.status = "error"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    analysis = Analysis(
        document_id=document.id,
        authority_type=result["authority_type"],
        letter_type=result["letter_type"],
        demand=result["demand"],
        deadline=result["deadline"],
        consequence=result["consequence"],
        action_required=result["action_required"],
        full_explanation=result["full_explanation"],
        urgency_level=result["urgency_level"],
        language=result["language"],
    )
    db.add(analysis)
    document.status = "analyzed"
    await db.commit()
    await db.refresh(analysis)

    return AnalysisOut.model_validate(analysis)


@router.get("/{document_id}", response_model=AnalysisOut)
async def get_analysis(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AnalysisOut:
    document = await _load_document_for_user(document_id, current_user.id, db)
    if document.analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Für dieses Dokument liegt noch keine Analyse vor.",
        )
    return AnalysisOut.model_validate(document.analysis)


@router.post("/{document_id}/reply", response_model=AnalysisOut)
async def generate_reply(
    document_id: str,
    payload: ReplyDraftRequest | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AnalysisOut:
    document = await _load_document_for_user(document_id, current_user.id, db)
    if document.analysis is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bitte zuerst eine Analyse erstellen, bevor ein Antwortentwurf generiert wird.",
        )

    analysis_dict = {
        "authority_type": document.analysis.authority_type,
        "letter_type": document.analysis.letter_type,
        "demand": document.analysis.demand,
        "deadline": document.analysis.deadline,
    }
    service = get_claude_service()
    try:
        draft = await service.generate_reply(
            raw_text=document.raw_text,
            analysis=analysis_dict,
            language=current_user.preferred_language,
            additional_context=payload.additional_context if payload else None,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    document.analysis.reply_draft = draft
    await db.commit()
    await db.refresh(document.analysis)

    return AnalysisOut.model_validate(document.analysis)
