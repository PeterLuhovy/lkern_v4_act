"""
{{SERVICE_NAME}} - Pydantic Schemas
"""

from app.schemas.example import (
    {{MODEL_NAME}}Base,
    {{MODEL_NAME}}Create,
    {{MODEL_NAME}}Update,
    {{MODEL_NAME}}Response,
    # Locking schemas
    LockRequest,
    LockResponse,
    LockConflictDetail,
    UnlockResponse,
)

__all__ = [
    "{{MODEL_NAME}}Base",
    "{{MODEL_NAME}}Create",
    "{{MODEL_NAME}}Update",
    "{{MODEL_NAME}}Response",
    # Locking schemas
    "LockRequest",
    "LockResponse",
    "LockConflictDetail",
    "UnlockResponse",
]
