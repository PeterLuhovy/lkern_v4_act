"""
================================================================
{{SERVICE_NAME}} - Example REST API
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/api/rest/example.py
Version: v1.1.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  FastAPI router for {{MODEL_NAME}} CRUD operations.
  Includes Pessimistic Locking endpoints.
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.database import get_db
from app.models import {{MODEL_NAME}}
from app.schemas import (
    {{MODEL_NAME}}Create,
    {{MODEL_NAME}}Update,
    {{MODEL_NAME}}Response,
    LockRequest,
    LockResponse,
    UnlockResponse,
)
from app.events.producer import publish_event
from app.config import settings

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/{{ROUTE_PREFIX}}", tags=["{{MODEL_NAME}}"])


@router.get("/", response_model=List[{{MODEL_NAME}}Response])
async def list_{{ROUTE_PREFIX}}(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get list of all {{MODEL_NAME}} entities."""
    items = db.query({{MODEL_NAME}}).offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model={{MODEL_NAME}}Response)
async def get_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Get single {{MODEL_NAME}} by ID."""
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )
    return item


@router.post("/", response_model={{MODEL_NAME}}Response, status_code=status.HTTP_201_CREATED)
async def create_{{ROUTE_SINGULAR}}(
    item_data: {{MODEL_NAME}}Create,
    db: Session = Depends(get_db),
):
    """Create new {{MODEL_NAME}}."""
    item = {{MODEL_NAME}}(**item_data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.created", {"id": item.id, "name": item.name})

    logger.info(f"Created {{MODEL_NAME}} id={item.id}")
    return item


@router.put("/{item_id}", response_model={{MODEL_NAME}}Response)
async def update_{{ROUTE_SINGULAR}}(
    item_id: int,
    item_data: {{MODEL_NAME}}Update,
    db: Session = Depends(get_db),
):
    """Update existing {{MODEL_NAME}}."""
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    # Update only provided fields
    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.updated", {"id": item.id, "name": item.name})

    logger.info(f"Updated {{MODEL_NAME}} id={item.id}")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Delete {{MODEL_NAME}}."""
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    db.delete(item)
    db.commit()

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.deleted", {"id": item_id})

    logger.info(f"Deleted {{MODEL_NAME}} id={item_id}")
    return None


# ================================================================
# PESSIMISTIC LOCKING ENDPOINTS
# ================================================================

@router.post("/{item_id}/lock", response_model=LockResponse)
async def acquire_lock(
    item_id: int,
    lock_request: Optional[LockRequest] = None,
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    x_user_name: Optional[str] = Header(None, alias="X-User-Name"),
    db: Session = Depends(get_db),
):
    """
    Acquire edit lock on a record.

    When a user opens a record for editing, this endpoint is called to lock it.
    Other users will see the record as read-only until the lock is released.

    Returns:
        - 200 OK: Lock acquired successfully
        - 404 Not Found: Record doesn't exist
        - 409 Conflict: Record is already locked by another user

    Headers:
        - X-User-ID: UUID of the current user (from auth middleware)
        - X-User-Name: Display name of the current user

    Note: In development mode without auth, a random UUID is generated.
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    # Get user info from headers or request body (fallback for dev mode)
    user_id_str = x_user_id or str(uuid4())  # Generate random UUID in dev mode
    user_name = x_user_name or (lock_request.user_name if lock_request else None) or "Unknown User"

    try:
        user_id = UUID(user_id_str)
    except ValueError:
        user_id = uuid4()

    # Check existing lock
    if item.locked_at:
        lock_age = datetime.now(timezone.utc) - item.locked_at.replace(tzinfo=timezone.utc)
        lock_expired = lock_age.total_seconds() > (settings.LOCK_TIMEOUT_MINUTES * 60)

        # Lock exists, not expired, and not by current user
        if not lock_expired and item.locked_by_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "message": "Record is locked by another user",
                    "locked_by_id": str(item.locked_by_id),
                    "locked_by_name": item.locked_by_name,
                    "locked_at": item.locked_at.isoformat(),
                },
            )

    # Acquire lock
    item.locked_by_id = user_id
    item.locked_by_name = user_name
    item.locked_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)

    logger.info(f"Lock acquired on {{MODEL_NAME}} id={item_id} by user={user_id} ({user_name})")

    return LockResponse(
        locked_by_id=item.locked_by_id,
        locked_by_name=item.locked_by_name,
        locked_at=item.locked_at,
        message="Lock acquired successfully",
    )


@router.delete("/{item_id}/lock", response_model=UnlockResponse)
async def release_lock(
    item_id: int,
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    x_is_admin: Optional[str] = Header(None, alias="X-Is-Admin"),
    db: Session = Depends(get_db),
):
    """
    Release edit lock on a record.

    Called when user saves, cancels, or closes the edit modal.
    Only the user who acquired the lock (or an admin) can release it.

    Returns:
        - 200 OK: Lock released successfully
        - 404 Not Found: Record doesn't exist
        - 403 Forbidden: Cannot release lock owned by another user

    Headers:
        - X-User-ID: UUID of the current user
        - X-Is-Admin: "true" if user has admin privileges (can force unlock)
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    # Parse user info
    user_id = None
    if x_user_id:
        try:
            user_id = UUID(x_user_id)
        except ValueError:
            pass

    is_admin = x_is_admin and x_is_admin.lower() == "true"

    # Check if locked by current user (or admin override)
    if item.locked_by_id:
        if item.locked_by_id != user_id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot release lock owned by another user",
            )

    # Release lock
    previous_holder = item.locked_by_name
    item.locked_by_id = None
    item.locked_by_name = None
    item.locked_at = None

    db.commit()

    logger.info(f"Lock released on {{MODEL_NAME}} id={item_id} (was held by: {previous_holder})")

    return UnlockResponse(
        status="unlocked",
        message="Lock released successfully",
    )
