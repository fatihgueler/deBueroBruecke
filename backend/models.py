"""SQLAlchemy ORM-Modelle für Users, Documents und Analyses."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    preferred_language: Mapped[str] = mapped_column(String(5), nullable=False, default="de")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    original_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1000), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)  # pdf | image
    raw_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped[User] = relationship("User", back_populates="documents")
    analysis: Mapped[Optional["Analysis"]] = relationship(
        "Analysis",
        back_populates="document",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    document_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("documents.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    authority_type: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    letter_type: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    demand: Mapped[str] = mapped_column(Text, nullable=False, default="")
    deadline: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    consequence: Mapped[str] = mapped_column(Text, nullable=False, default="")
    action_required: Mapped[str] = mapped_column(Text, nullable=False, default="")
    full_explanation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    urgency_level: Mapped[str] = mapped_column(String(20), nullable=False, default="medium")
    reply_draft: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[str] = mapped_column(String(5), nullable=False, default="de")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    document: Mapped[Document] = relationship("Document", back_populates="analysis")
