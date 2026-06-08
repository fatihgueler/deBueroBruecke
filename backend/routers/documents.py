"""Documents-Router: Upload, Liste, Details, Löschen."""

import asyncio
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from auth import get_current_user
    from config import get_settings
    from database import get_db
    from limiter import limiter
    from models import Document, User
    from schemas import DocumentOut
    from services.ocr_service import extract_image_text
    from services.pdf_service import extract_pdf_text
except ImportError:
    from backend.auth import get_current_user
    from backend.config import get_settings
    from backend.database import get_db
    from backend.limiter import limiter
    from backend.models import Document, User
    from backend.schemas import DocumentOut
    from backend.services.ocr_service import extract_image_text
    from backend.services.pdf_service import extract_pdf_text

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_MIME_TYPES: dict[str, str] = {
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/png": "image",
    "application/pdf": "pdf",
}
ALLOWED_EXTENSIONS: dict[str, str] = {
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".pdf": "pdf",
}

settings = get_settings()


def _detect_file_type(upload: UploadFile) -> str:
    if upload.content_type and upload.content_type in ALLOWED_MIME_TYPES:
        return ALLOWED_MIME_TYPES[upload.content_type]
    suffix = Path(upload.filename or "").suffix.lower()
    if suffix in ALLOWED_EXTENSIONS:
        return ALLOWED_EXTENSIONS[suffix]
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Nicht unterstütztes Dateiformat. Erlaubt sind JPG, PNG und PDF.",
    )


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    response_model=None,
)
@limiter.limit("10/minute")
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    file_type = _detect_file_type(file)
    suffix = Path(file.filename or "").suffix.lower() or (".pdf" if file_type == "pdf" else ".png")

    # Größenprüfung (streamend, ohne komplette Datei in Memory zu halten)
    data = await file.read(settings.max_file_size_bytes + 1)
    if len(data) > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Datei ist zu groß (max. {settings.max_file_size_mb} MB).",
        )
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hochgeladene Datei ist leer.",
        )

    safe_name = f"{uuid.uuid4()}{suffix}"
    target_path = settings.upload_path / safe_name
    try:
        target_path.write_bytes(data)
    except OSError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Datei konnte nicht gespeichert werden.",
        ) from exc

    # Textextraktion (CPU-lastig/blockierend – in Thread auslagern, damit der
    # Event-Loop währenddessen weiter andere Anfragen wie Login bedienen kann)
    try:
        if file_type == "pdf":
            raw_text = await asyncio.to_thread(extract_pdf_text, target_path)
        else:
            raw_text = await asyncio.to_thread(extract_image_text, target_path)
    except Exception:
        raw_text = ""

    document = Document(
        user_id=current_user.id,
        original_filename=file.filename or safe_name,
        file_path=str(target_path),
        file_type=file_type,
        raw_text=raw_text,
        status="pending",
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    return DocumentOut.model_validate(document)


@router.get("/", response_model=list[DocumentOut])
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[DocumentOut]:
    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(desc(Document.created_at))
    )
    documents = result.scalars().unique().all()
    return [DocumentOut.model_validate(doc) for doc in documents]


async def _get_user_document(document_id: str, user_id: str, db: AsyncSession) -> Document:
    result = await db.execute(
        select(Document).where(Document.id == document_id, Document.user_id == user_id)
    )
    doc = result.scalar_one_or_none()
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dokument nicht gefunden.",
        )
    return doc


@router.get("/{document_id}", response_model=DocumentOut)
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DocumentOut:
    document = await _get_user_document(document_id, current_user.id, db)
    return DocumentOut.model_validate(document)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    document = await _get_user_document(document_id, current_user.id, db)

    file_path = Path(document.file_path)
    try:
        if file_path.exists():
            file_path.unlink()
    except OSError:
        pass

    await db.delete(document)
    await db.commit()
