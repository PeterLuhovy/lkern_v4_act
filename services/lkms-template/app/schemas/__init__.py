"""
{{SERVICE_NAME}} - Pydantic Schemas
"""

from app.schemas.example import (
    # Core schemas
    {{MODEL_NAME}}Base,
    {{MODEL_NAME}}Create,
    {{MODEL_NAME}}Update,
    {{MODEL_NAME}}Response,
    AttachmentMetadata,
    # Status change schemas
    StatusChangeRequest,
    StatusChangeResponse,
    # Soft delete schemas
    DeleteResponse,
    RestoreResponse,
    # Locking schemas
    LockRequest,
    LockResponse,
    LockConflictDetail,
    UnlockResponse,
)

__all__ = [
    # Core schemas
    "{{MODEL_NAME}}Base",
    "{{MODEL_NAME}}Create",
    "{{MODEL_NAME}}Update",
    "{{MODEL_NAME}}Response",
    "AttachmentMetadata",
    # Status change schemas
    "StatusChangeRequest",
    "StatusChangeResponse",
    # Soft delete schemas
    "DeleteResponse",
    "RestoreResponse",
    # Locking schemas
    "LockRequest",
    "LockResponse",
    "LockConflictDetail",
    "UnlockResponse",
]
