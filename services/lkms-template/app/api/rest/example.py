"""
================================================================
{{SERVICE_NAME}} - Example REST API
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/api/rest/example.py
Version: v2.0.0
Created: 2025-11-08
Updated: 2025-12-16
Description:
  FastAPI router for {{MODEL_NAME}} CRUD operations.

  Features:
  - Human-readable code generation (PREFIX-RRMM-NNNN)
  - Rich enum filtering (type, status, priority)
  - Soft delete with restore
  - Status change endpoint
  - Pessimistic Locking
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.database import get_db
from app.models import {{MODEL_NAME}}
from app.models.enums import {{MODEL_NAME}}Type, {{MODEL_NAME}}Status, {{MODEL_NAME}}Priority
from app.schemas import (
    {{MODEL_NAME}}Create,
    {{MODEL_NAME}}Update,
    {{MODEL_NAME}}Response,
    StatusChangeRequest,
    StatusChangeResponse,
    DeleteResponse,
    RestoreResponse,
    LockRequest,
    LockResponse,
    UnlockResponse,
)
from app.services.code_generator import generate_entity_code
from app.events.producer import publish_event
from app.config import settings

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/{{ROUTE_PREFIX}}", tags=["{{MODEL_NAME}}"])


# ================================================================
# LIST & READ ENDPOINTS
# ================================================================

@router.get("/", response_model=List[{{MODEL_NAME}}Response])
async def list_{{ROUTE_PREFIX}}(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    type: Optional[{{MODEL_NAME}}Type] = Query(None, description="Filter by type"),
    status: Optional[{{MODEL_NAME}}Status] = Query(None, description="Filter by status"),
    priority: Optional[{{MODEL_NAME}}Priority] = Query(None, description="Filter by priority"),
    include_deleted: bool = Query(False, description="Include soft-deleted records"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    db: Session = Depends(get_db),
):
    """
    Get list of {{MODEL_NAME}} entities with optional filtering.

    Filters:
    - type: Filter by entity type
    - status: Filter by status
    - priority: Filter by priority level
    - include_deleted: Include soft-deleted records (default: False)
    - search: Full-text search in name and description

    Pagination:
    - skip: Number of records to skip (default: 0)
    - limit: Maximum records to return (default: 100, max: 500)
    """
    query = db.query({{MODEL_NAME}})

    # Soft delete filter (default: exclude deleted)
    if not include_deleted:
        query = query.filter({{MODEL_NAME}}.deleted_at.is_(None))

    # Enum filters
    if type:
        query = query.filter({{MODEL_NAME}}.type == type)
    if status:
        query = query.filter({{MODEL_NAME}}.status == status)
    if priority:
        query = query.filter({{MODEL_NAME}}.priority == priority)

    # Search filter (ILIKE for case-insensitive)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            ({{MODEL_NAME}}.name.ilike(search_pattern)) |
            ({{MODEL_NAME}}.description.ilike(search_pattern))
        )

    # Order by created_at descending (newest first)
    query = query.order_by({{MODEL_NAME}}.created_at.desc())

    # Pagination
    items = query.offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model={{MODEL_NAME}}Response)
async def get_{{ROUTE_SINGULAR}}(
    item_id: int,
    include_deleted: bool = Query(False, description="Allow fetching soft-deleted records"),
    db: Session = Depends(get_db),
):
    """Get single {{MODEL_NAME}} by ID."""
    query = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id)

    if not include_deleted:
        query = query.filter({{MODEL_NAME}}.deleted_at.is_(None))

    item = query.first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )
    return item


@router.get("/code/{entity_code}", response_model={{MODEL_NAME}}Response)
async def get_by_code(
    entity_code: str,
    include_deleted: bool = Query(False, description="Allow fetching soft-deleted records"),
    db: Session = Depends(get_db),
):
    """Get single {{MODEL_NAME}} by human-readable code (e.g., TYA-2512-0001)."""
    query = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.entity_code == entity_code)

    if not include_deleted:
        query = query.filter({{MODEL_NAME}}.deleted_at.is_(None))

    item = query.first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with code {entity_code} not found",
        )
    return item


# ================================================================
# CREATE & UPDATE ENDPOINTS
# ================================================================

@router.post("/", response_model={{MODEL_NAME}}Response, status_code=status.HTTP_201_CREATED)
async def create_{{ROUTE_SINGULAR}}(
    item_data: {{MODEL_NAME}}Create,
    db: Session = Depends(get_db),
):
    """
    Create new {{MODEL_NAME}}.

    Auto-generated fields:
    - entity_code: Human-readable code (PREFIX-RRMM-NNNN)
    - status: OPEN (default)
    - created_at: Current timestamp
    """
    # Generate human-readable code based on type
    entity_code = generate_entity_code(db, item_data.type, {{MODEL_NAME}})

    # Create item with generated code
    item_dict = item_data.model_dump()
    item_dict["entity_code"] = entity_code
    item_dict["status"] = {{MODEL_NAME}}Status.OPEN  # Default status

    item = {{MODEL_NAME}}(**item_dict)
    db.add(item)
    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.created", {
        "id": item.id,
        "entity_code": item.entity_code,
        "name": item.name,
        "type": item.type.value,
    })

    logger.info(f"Created {{MODEL_NAME}} id={item.id} code={item.entity_code}")
    return item


@router.put("/{item_id}", response_model={{MODEL_NAME}}Response)
async def update_{{ROUTE_SINGULAR}}(
    item_id: int,
    item_data: {{MODEL_NAME}}Update,
    db: Session = Depends(get_db),
):
    """
    Update existing {{MODEL_NAME}}.

    Note: entity_code and type cannot be changed after creation.
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    if item.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update soft-deleted record. Restore it first.",
        )

    # Update only provided fields
    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.updated", {
        "id": item.id,
        "entity_code": item.entity_code,
        "name": item.name,
    })

    logger.info(f"Updated {{MODEL_NAME}} id={item.id}")
    return item


# ================================================================
# STATUS CHANGE ENDPOINT
# ================================================================

@router.post("/{item_id}/status", response_model=StatusChangeResponse)
async def change_status(
    item_id: int,
    request: StatusChangeRequest,
    db: Session = Depends(get_db),
):
    """
    Change status of {{MODEL_NAME}}.

    Updates lifecycle timestamps:
    - RESOLVED: sets resolved_at
    - CLOSED: sets closed_at
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    if item.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change status of soft-deleted record",
        )

    old_status = item.status
    new_status = request.status
    now = datetime.now(timezone.utc)

    # Update status
    item.status = new_status

    # Update lifecycle timestamps
    if new_status == {{MODEL_NAME}}Status.RESOLVED and not item.resolved_at:
        item.resolved_at = now
    elif new_status == {{MODEL_NAME}}Status.CLOSED and not item.closed_at:
        item.closed_at = now

    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.status_changed", {
        "id": item.id,
        "entity_code": item.entity_code,
        "old_status": old_status.value,
        "new_status": new_status.value,
    })

    logger.info(f"Status changed {{MODEL_NAME}} id={item.id}: {old_status.value} -> {new_status.value}")

    return StatusChangeResponse(
        id=item.id,
        entity_code=item.entity_code,
        old_status=old_status,
        new_status=new_status,
        changed_at=now,
    )


# ================================================================
# SOFT DELETE & RESTORE ENDPOINTS
# ================================================================

@router.delete("/{item_id}", response_model=DeleteResponse)
async def soft_delete_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """
    Soft delete {{MODEL_NAME}}.

    Sets deleted_at timestamp instead of removing from database.
    Record can be restored using POST /{item_id}/restore.
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    if item.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Record is already deleted",
        )

    now = datetime.now(timezone.utc)
    item.deleted_at = now
    db.commit()

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.deleted", {
        "id": item.id,
        "entity_code": item.entity_code,
        "deleted_at": now.isoformat(),
    })

    logger.info(f"Soft deleted {{MODEL_NAME}} id={item.id}")

    return DeleteResponse(
        id=item.id,
        entity_code=item.entity_code,
        deleted_at=now,
    )


@router.post("/{item_id}/restore", response_model=RestoreResponse)
async def restore_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """
    Restore soft-deleted {{MODEL_NAME}}.

    Clears deleted_at timestamp, making the record active again.
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    if not item.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Record is not deleted",
        )

    item.deleted_at = None
    db.commit()

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.restored", {
        "id": item.id,
        "entity_code": item.entity_code,
    })

    logger.info(f"Restored {{MODEL_NAME}} id={item.id}")

    return RestoreResponse(
        id=item.id,
        entity_code=item.entity_code,
    )


@router.delete("/{item_id}/permanent", status_code=status.HTTP_204_NO_CONTENT)
async def hard_delete_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """
    Permanently delete {{MODEL_NAME}} (hard delete).

    WARNING: This cannot be undone. Use soft delete for normal operations.
    Consider implementing admin-only access for this endpoint.
    """
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    entity_code = item.entity_code
    db.delete(item)
    db.commit()

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.hard_deleted", {
        "id": item_id,
        "entity_code": entity_code,
    })

    logger.warning(f"HARD DELETED {{MODEL_NAME}} id={item_id} code={entity_code}")
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

    if item.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot lock soft-deleted record",
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
