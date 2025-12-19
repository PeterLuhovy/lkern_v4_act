"""
================================================================
{{SERVICE_NAME}} - Example Model
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/models/example.py
Version: v2.0.0
Created: 2025-11-08
Updated: 2025-12-16
Description:
  SQLAlchemy model for {{MODEL_NAME}}.
  Replace this with actual business model.

  Features:
  - Human-readable code (PREFIX-RRMM-NNNN format)
  - Rich enum classification (Type, Status, Priority)
  - Soft delete support (deleted_at timestamp)
  - Lifecycle timestamps (resolved_at, closed_at)
  - JSON attachments column
  - Pessimistic Locking support
================================================================
"""

import uuid

from sqlalchemy import Column, String, DateTime, Boolean, Enum, text
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.sql import func
from app.database import Base
from app.models.enums import {{MODEL_NAME}}Type, {{MODEL_NAME}}Status, {{MODEL_NAME}}Priority


class {{MODEL_NAME}}(Base):
    """
    Example model - replace with actual business entity.

    Attributes:
        id: Primary key (UUID)
        entity_code: Human-readable code (e.g., TYA-2512-0042)
        name: Entity name
        description: Entity description

        type: Entity type classification
        status: Lifecycle status
        priority: Priority level

        attachments: JSON array of file metadata
        is_active: Active status flag

        created_at: Creation timestamp
        updated_at: Last update timestamp
        resolved_at: When marked as resolved
        closed_at: When finally closed
        deleted_at: Soft delete timestamp (NULL = active)

        locked_by_id: UUID of user who locked the record
        locked_by_name: Name of user who locked (denormalized)
        locked_at: Timestamp when lock was acquired
    """

    __tablename__ = "{{TABLE_NAME}}"

    # ================================================================
    # PRIMARY KEY & IDENTIFIER
    # ================================================================
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
        index=True
    )

    # Human-readable code: PREFIX-RRMM-NNNN (e.g., TYA-2512-0042)
    # Generated automatically on creation via code_generator.py
    entity_code = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True,
        comment="Human-readable code: PREFIX-RRMM-NNNN"
    )

    # ================================================================
    # CORE FIELDS
    # ================================================================
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)

    # ================================================================
    # CLASSIFICATION (Rich Enums)
    # ================================================================
    type = Column(
        Enum({{MODEL_NAME}}Type),
        nullable=False,
        index=True,
        comment="Entity type classification"
    )
    status = Column(
        Enum({{MODEL_NAME}}Status),
        nullable=False,
        default={{MODEL_NAME}}Status.OPEN,
        index=True,
        comment="Lifecycle status"
    )
    priority = Column(
        Enum({{MODEL_NAME}}Priority),
        nullable=False,
        default={{MODEL_NAME}}Priority.MEDIUM,
        index=True,
        comment="Priority level"
    )

    # ================================================================
    # ATTACHMENTS (JSON Column)
    # ================================================================
    # Store file metadata as JSON array:
    # [{"filename": "doc.pdf", "size": 1024, "mimetype": "application/pdf", "url": "..."}]
    attachments = Column(
        JSON,
        nullable=True,
        comment="JSON array of file metadata"
    )

    is_active = Column(Boolean, default=True, nullable=False)

    # ================================================================
    # TIMESTAMPS
    # ================================================================
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="Record creation timestamp"
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
        comment="Last modification timestamp"
    )
    resolved_at = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="When status changed to RESOLVED"
    )
    closed_at = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="When status changed to CLOSED"
    )

    # ================================================================
    # SOFT DELETE
    # ================================================================
    # NULL = active record, timestamp = deleted record
    # Always filter by deleted_at IS NULL unless include_deleted=True
    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
        comment="Soft delete timestamp (NULL = active)"
    )

    # ================================================================
    # PESSIMISTIC LOCKING
    # ================================================================
    # When a user opens a record for editing, these fields are populated.
    # Other users see read-only mode until lock is released.
    locked_by_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    locked_by_name = Column(String(255), nullable=True)  # Denormalized for quick display
    locked_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<{{MODEL_NAME}}(id={self.id}, code='{self.entity_code}', name='{self.name}')>"
