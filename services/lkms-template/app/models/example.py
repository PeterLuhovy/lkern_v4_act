"""
================================================================
{{SERVICE_NAME}} - Example Model
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/models/example.py
Version: v1.1.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  SQLAlchemy model for {{MODEL_NAME}}.
  Replace this with actual business model.
  Includes Pessimistic Locking support.
================================================================
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base


class {{MODEL_NAME}}(Base):
    """
    Example model - replace with actual business entity.

    Attributes:
        id: Primary key
        name: Entity name
        description: Entity description
        is_active: Active status flag
        created_at: Creation timestamp
        updated_at: Last update timestamp
        locked_by_id: UUID of user who locked the record
        locked_by_name: Name of user who locked (denormalized)
        locked_at: Timestamp when lock was acquired
    """

    __tablename__ = "{{TABLE_NAME}}"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Pessimistic Locking
    # When a user opens a record for editing, these fields are populated.
    # Other users see read-only mode until lock is released.
    locked_by_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    locked_by_name = Column(String(255), nullable=True)  # Denormalized for quick display
    locked_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<{{MODEL_NAME}}(id={self.id}, name='{self.name}')>"
