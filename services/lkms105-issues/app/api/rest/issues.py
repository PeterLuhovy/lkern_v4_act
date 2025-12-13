"""
================================================================
Issues Service - Issues REST API
================================================================
File: services/lkms105-issues/app/api/rest/issues.py
Version: v1.2.0
Created: 2025-11-08
Updated: 2025-11-30
Description:
  FastAPI router for Issue CRUD operations with:
  - Role-based create (user_basic, user_standard, user_advance)
  - 8 filters (type, severity, status, category, priority, assignee, reporter, search)
  - Soft delete
  - Actions (assign, resolve, close)
  - 9-level permission system (0-100 scale)

PERMISSION LEVELS (0-100 scale):
  - 0-29 (Basic lvl 1-3): View only, id hidden
  - 30-59 (Standard lvl 1-3): Can edit description, id hidden
  - 60-69 (Admin lvl 1): id hidden, can view technical fields
  - 70-99 (Admin lvl 2-3): id visible, full edit (except type, status, code)
  - 100 (Super Admin): Full access (except id - NEVER editable)

CHANGES (v1.2.0):
  - UPDATED: Permission levels now use 0-100 scale (was 1-3)
  - ADDED: list_issues now filters fields based on permission level
  - UPDATED: id field hidden for levels below 70 (Admin lvl 2+)
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Body, status as http_status, Form, UploadFile, File, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from datetime import datetime
from io import BytesIO, StringIO
import csv
import zipfile
import uuid
import logging
import json

from app.database import get_db_safe
from app.models import Issue, IssueType, IssueSeverity, IssueCategory, IssueStatus, IssuePriority, DeletionAudit, DeletionStatus
from app.schemas import (
    IssueCreateUserBasic,
    IssueCreateUserStandard,
    IssueCreateUserAdvance,
    IssueCreateSystem,
    IssueUpdate,
    IssueAssign,
    IssueResolve,
    IssueClose,
    IssueResponse,
    DeletionAuditResponse,
    BulkAttachmentDeleteRequest,
    BulkAttachmentDeleteResponse,
    AttachmentDeleteResult,
    # Locking schemas
    LockRequest,
    LockResponse,
    # Export schemas
    IssueExportRequest,
)
from app.services.issue_service import generate_issue_code, validate_status_transition
from app.events.producer import publish_event
from app.api.rest.sse import broadcast_cache_invalidation
from app.services.minio_client import minio_client, MinIOConnectionError
from app.permissions import (
    validate_update_fields,
    filter_issue_response,
    validate_update_fields_by_frontend_level,
    filter_issue_response_by_frontend_level,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/issues", tags=["Issues"])


# ============================================================
# LIST ISSUES (with 8 filters)
# ============================================================

@router.get("/")
async def list_issues(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(100, ge=1, le=500, description="Pagination limit"),

    # Filters
    type: Optional[IssueType] = Query(None, description="Filter by issue type"),
    severity: Optional[IssueSeverity] = Query(None, description="Filter by severity"),
    status: Optional[IssueStatus] = Query(None, description="Filter by status"),
    category: Optional[IssueCategory] = Query(None, description="Filter by category"),
    priority: Optional[IssuePriority] = Query(None, description="Filter by priority"),
    assignee_id: Optional[str] = Query(None, description="Filter by assignee UUID"),
    reporter_id: Optional[str] = Query(None, description="Filter by reporter UUID"),
    search: Optional[str] = Query(None, description="Search in title and description"),

    include_deleted: bool = Query(False, description="Include soft-deleted issues"),

    db: Session = Depends(get_db_safe),
    # Permission level (0-100 scale) - controls field visibility
    # SECURITY: Default to 0 (no access) - frontend MUST send actual level
    x_permission_level: int = Header(default=0, alias="X-Permission-Level", description="Permission level (0-100 scale)"),
):
    """
    Get list of issues with optional filters and field-level permission filtering.

    Headers:
        X-Permission-Level: Permission level (0-100 scale)
        - 0-29 (Basic): id hidden, limited fields visible
        - 30-59 (Standard): id hidden, more fields visible
        - 60-69 (Admin lvl 1): id hidden, technical fields visible
        - 70-99 (Admin lvl 2-3): id visible, full access
        - 100 (Super Admin): all fields visible

    Filters:
    - type, severity, status, category, priority (enum filters)
    - assignee_id, reporter_id (UUID filters)
    - search (full-text search in title and description)
    - include_deleted (include soft-deleted issues)
    """
    query = db.query(Issue)

    # Soft delete filter (default: exclude deleted)
    if not include_deleted:
        query = query.filter(Issue.deleted_at == None)  # noqa: E711

    # Apply enum filters
    if type:
        query = query.filter(Issue.type == type)
    if severity:
        query = query.filter(Issue.severity == severity)
    if status:
        query = query.filter(Issue.status == status)
    if category:
        query = query.filter(Issue.category == category)
    if priority:
        query = query.filter(Issue.priority == priority)

    # Apply UUID filters
    if assignee_id:
        query = query.filter(Issue.assignee_id == uuid.UUID(assignee_id))
    if reporter_id:
        query = query.filter(Issue.reporter_id == uuid.UUID(reporter_id))

    # Full-text search (title OR description)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Issue.title.ilike(search_pattern),
                Issue.description.ilike(search_pattern)
            )
        )

    # Pagination and ordering
    issues = query.order_by(Issue.created_at.desc()).offset(skip).limit(limit).all()

    # Convert issues to dicts and filter fields based on permission level
    filtered_issues = []
    for issue in issues:
        issue_dict = {
            "id": str(issue.id),
            "issue_code": issue.issue_code,
            "title": issue.title,
            "description": issue.description,
            "type": issue.type.value if issue.type else None,
            "severity": issue.severity.value if issue.severity else None,
            "status": issue.status.value if issue.status else None,
            "priority": issue.priority.value if issue.priority else None,
            "category": issue.category.value if issue.category else None,
            "resolution": issue.resolution,
            "error_type": issue.error_type,
            "error_message": issue.error_message,
            "system_info": issue.system_info,
            "reporter_id": str(issue.reporter_id) if issue.reporter_id else None,
            "assignee_id": str(issue.assignee_id) if issue.assignee_id else None,
            "attachments": issue.attachments,
            "created_at": issue.created_at.isoformat() if issue.created_at else None,
            "updated_at": issue.updated_at.isoformat() if issue.updated_at else None,
            "resolved_at": issue.resolved_at.isoformat() if issue.resolved_at else None,
            "closed_at": issue.closed_at.isoformat() if issue.closed_at else None,
            "deleted_at": issue.deleted_at.isoformat() if issue.deleted_at else None,
            "deletion_audit_id": issue.deletion_audit_id,
        }
        # Filter response based on permission level
        filtered_issue = filter_issue_response_by_frontend_level(issue_dict, x_permission_level)
        filtered_issues.append(filtered_issue)

    return filtered_issues


# ============================================================
# GET SINGLE ISSUE
# ============================================================

@router.get("/{issue_id}")
async def get_issue(
    issue_id: str,
    db: Session = Depends(get_db_safe),
    # Permission level (0-100 scale) - controls field visibility
    # SECURITY: Default to 0 (no access) - frontend MUST send actual level
    x_permission_level: int = Header(default=0, alias="X-Permission-Level", description="Permission level (0-100 scale)"),
):
    """
    Get single issue by UUID with field-level permission filtering.

    Headers:
        X-Permission-Level: Permission level (0-100 scale)
        - 0-29 (Basic): id hidden, limited fields visible
        - 30-59 (Standard): id hidden, more fields visible
        - 60-69 (Admin lvl 1): id hidden, technical fields visible
        - 70-99 (Admin lvl 2-3): id visible, full access
        - 100 (Super Admin): all fields visible
    """
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Convert issue to dict for filtering
    issue_dict = {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
        "title": issue.title,
        "description": issue.description,
        "type": issue.type.value if issue.type else None,
        "severity": issue.severity.value if issue.severity else None,
        "status": issue.status.value if issue.status else None,
        "priority": issue.priority.value if issue.priority else None,
        "category": issue.category.value if issue.category else None,
        "resolution": issue.resolution,
        "error_type": issue.error_type,
        "error_message": issue.error_message,
        "system_info": issue.system_info,
        "reporter_id": str(issue.reporter_id) if issue.reporter_id else None,
        "assignee_id": str(issue.assignee_id) if issue.assignee_id else None,
        "attachments": issue.attachments,
        "created_at": issue.created_at.isoformat() if issue.created_at else None,
        "updated_at": issue.updated_at.isoformat() if issue.updated_at else None,
        "resolved_at": issue.resolved_at.isoformat() if issue.resolved_at else None,
        "closed_at": issue.closed_at.isoformat() if issue.closed_at else None,
        "deleted_at": issue.deleted_at.isoformat() if issue.deleted_at else None,
        "deletion_audit_id": issue.deletion_audit_id,
    }

    # Filter response based on permission level
    filtered_response = filter_issue_response_by_frontend_level(issue_dict, x_permission_level)

    logger.debug(f"Get issue {issue.issue_code} with permission level {x_permission_level}")

    return filtered_response


# ============================================================
# CREATE ISSUE (Role-Based)
# ============================================================

@router.post("/", response_model=IssueResponse, status_code=http_status.HTTP_201_CREATED)
async def create_issue(
    data: str = Form(..., description="JSON string with issue data"),
    role: str = Form(..., description="User role: user_basic | user_standard | user_advance"),
    files: List[UploadFile] = File(default=[], description="Optional file attachments"),
    db: Session = Depends(get_db_safe),
):
    """
    Create new issue - role-based schema validation with file attachments.

    Roles:
    - user_basic: Minimal fields (title, description, type, 1 screenshot)
    - user_standard: Basic fields (+ severity, optional attachments)
    - user_advance: Full fields (+ category, developer data, logs)

    Form fields:
    - data: JSON string with issue data
    - role: user_basic | user_standard | user_advance
    - files: Optional file attachments (multipart/form-data)
    """
    # Parse JSON data
    try:
        request_data = json.loads(data)
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON data: {str(e)}"
        )

    # Validate request data based on role
    try:
        if role == "user_basic":
            validated_data = IssueCreateUserBasic(**request_data)
            issue_data = validated_data.model_dump()
            # Set defaults for user_basic
            issue_data['severity'] = IssueSeverity.MODERATE
            issue_data['priority'] = IssuePriority.MEDIUM

        elif role == "user_standard":
            validated_data = IssueCreateUserStandard(**request_data)
            issue_data = validated_data.model_dump()
            # Set defaults for user_standard
            issue_data['priority'] = IssuePriority.MEDIUM

        elif role == "user_advance":
            validated_data = IssueCreateUserAdvance(**request_data)
            issue_data = validated_data.model_dump()

        else:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role: {role}"
            )
    except Exception as e:
        logger.error(f"Validation error for role {role}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {str(e)}"
        )

    # Generate issue_code
    issue_code = generate_issue_code(db, issue_data['type'])

    # TODO: Get reporter_id from JWT token (for now, use dummy UUID)
    reporter_id = uuid.uuid4()

    # Create Issue entity (without attachments for now)
    issue = Issue(
        issue_code=issue_code,
        reporter_id=reporter_id,
        status=IssueStatus.OPEN,
        **issue_data
    )

    db.add(issue)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        logger.error(f"IntegrityError creating issue {issue_code}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_409_CONFLICT,
            detail=f"Duplicate issue code '{issue_code}'. A deleted issue with this code may exist. Please try again."
        )
    db.refresh(issue)

    # Process file attachments if provided
    attachments_metadata = []
    if files:
        # Check MinIO availability BEFORE processing files
        if not minio_client.check_health():
            # MinIO is down - return 503 so frontend can offer to create without files
            # Note: Issue is already created in DB, but we'll delete it
            db.delete(issue)
            db.commit()
            logger.warning(f"MinIO unavailable - cannot upload {len(files)} files, issue creation aborted")
            raise HTTPException(
                status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={
                    "error": "minio_unavailable",
                    "message": "File storage (MinIO) is currently unavailable. Cannot upload attachments.",
                    "files_count": len(files),
                    "suggestion": "Create issue without attachments, or try again later."
                }
            )

        logger.info(f"Processing {len(files)} file attachments for issue {issue.issue_code}")
        for file in files:
            try:
                # Read file content
                file_content = await file.read()
                file_size = len(file_content)

                # Generate unique object name: {uuid}/{filename}
                object_name = f"{issue.id}/{file.filename}"

                # Upload to MinIO
                minio_client.upload_file(
                    file_data=file_content,
                    object_name=object_name,
                    content_type=file.content_type or "application/octet-stream"
                )

                # Create attachment metadata
                attachment_meta = {
                    "file_name": file.filename,
                    "file_size": file_size,
                    "content_type": file.content_type or "application/octet-stream",
                    "object_name": object_name,
                    "uploaded_at": datetime.utcnow().isoformat()
                }
                attachments_metadata.append(attachment_meta)

                logger.info(f"Uploaded attachment: {file.filename} ({file_size} bytes)")

            except Exception as e:
                logger.error(f"Error processing attachment {file.filename}: {str(e)}")
                # Continue with other files, don't fail entire request

        # Update issue with attachments metadata
        if attachments_metadata:
            issue.attachments = attachments_metadata
            db.commit()
            db.refresh(issue)
            logger.info(f"Saved {len(attachments_metadata)} attachment metadata records")

    # Publish Kafka event
    await publish_event("issue.created", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
        "type": issue.type.value,
        "reporter_id": str(issue.reporter_id),
        "attachments_count": len(attachments_metadata) if attachments_metadata else 0,
    })

    logger.info(f"Created Issue {issue.issue_code} (role={role}, attachments={len(attachments_metadata) if attachments_metadata else 0})")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "created", str(issue.id))

    return issue


# ============================================================
# CREATE ISSUE (System-Generated)
# ============================================================

# SYSTEM_USER_ID for auto-generated issues (must match frontend constant)
SYSTEM_USER_ID = uuid.UUID("00000000-0000-4000-8000-000000000001")

@router.post("/system", response_model=IssueResponse, status_code=http_status.HTTP_201_CREATED)
async def create_system_issue(
    issue_data: IssueCreateSystem,
    db: Session = Depends(get_db_safe),
    x_permission_level: int = Header(default=0, alias="X-Permission-Level"),
):
    """
    Create system-generated issue (JSON body, no file attachments).

    Used by: Data integrity handlers, automated monitoring, cron jobs.
    Requires: X-Permission-Level: 100 (Super Admin)

    Key differences from user endpoints:
    - Accepts JSON body (not Form/multipart data)
    - reporter_id can be set directly (defaults to SYSTEM_USER_ID)
    - No file attachments (system issues are text-only)

    Headers:
        X-Permission-Level: 100 (required - Super Admin only)
    """
    # Security check - only Super Admin (level 100) can use this endpoint
    if x_permission_level < 100:
        logger.warning(f"Unauthorized system issue creation attempt (level={x_permission_level})")
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="System issue creation requires Super Admin permissions (level 100)"
        )

    # Generate issue_code
    issue_code = generate_issue_code(db, issue_data.type.value)

    # Use provided reporter_id or default to SYSTEM_USER_ID
    reporter_id = issue_data.reporter_id or SYSTEM_USER_ID

    # Prepare issue data (convert enums to model-compatible values)
    issue_dict = issue_data.model_dump(exclude={'reporter_id'})

    # Create Issue entity
    issue = Issue(
        issue_code=issue_code,
        reporter_id=reporter_id,
        status=IssueStatus.OPEN,
        **issue_dict
    )

    db.add(issue)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        logger.error(f"IntegrityError creating system issue {issue_code}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_409_CONFLICT,
            detail=f"Duplicate issue code '{issue_code}'. Please try again."
        )
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.created", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
        "type": issue.type.value,
        "reporter_id": str(issue.reporter_id),
        "system_generated": True,
        "source": issue_data.system_info.get("source_service") if issue_data.system_info else "unknown",
    })

    logger.info(f"Created system issue {issue.issue_code} (reporter={reporter_id}, source={issue_data.system_info})")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "created", str(issue.id))

    return issue


# ============================================================
# UPDATE ISSUE
# ============================================================

@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: str,
    update_data: IssueUpdate,
    db: Session = Depends(get_db_safe),
    # Permission level (0-100 scale) - controls which fields can be edited
    # SECURITY: Default to 0 (no edit access) - frontend MUST send actual level
    x_permission_level: int = Header(default=0, alias="X-Permission-Level", description="Permission level (0-100 scale)"),
):
    """
    Update existing issue (partial update) with field-level permission check.

    SECURITY: Each field has required permission level for editing.
    Fields the user cannot edit will be rejected with 403 Forbidden.

    Headers:
        X-Permission-Level: Permission level (0-100 scale)
        - 0-29 (Basic): Cannot edit any fields (view only)
        - 30-59 (Standard): Can edit description only
        - 60-69 (Admin lvl 1): Limited edit (assignee, resolution, etc.)
        - 70-99 (Admin lvl 2-3): Full edit except type, status, issue_code
        - 100 (Super Admin): Can edit all fields (except id - NEVER editable)
    """
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Get fields being updated
    update_dict = update_data.model_dump(exclude_unset=True)

    # === FIELD-LEVEL PERMISSION CHECK ===
    # Validate user has permission to edit each field based on frontend level
    forbidden_fields = validate_update_fields_by_frontend_level(update_dict, x_permission_level)
    if forbidden_fields:
        logger.warning(
            f"Permission denied: user (level={x_permission_level}) "
            f"tried to edit forbidden fields {forbidden_fields} on issue {issue_id}"
        )
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail={
                "error": "field_permission_denied",
                "message": f"Insufficient permission to edit fields: {', '.join(forbidden_fields)}",
                "forbidden_fields": forbidden_fields,
                "permission_level": x_permission_level,
            }
        )

    # Update only provided (and permitted) fields
    for key, value in update_dict.items():
        setattr(issue, key, value)

    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.updated", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
        "updated_fields": list(update_dict.keys()),
    })

    logger.info(f"Updated Issue {issue.issue_code} (fields: {list(update_dict.keys())}, permission_level={x_permission_level})")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "updated", str(issue.id))

    return issue


# ============================================================
# DELETE ISSUE (Soft Delete)
# ============================================================

@router.delete("/{issue_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_issue(
    issue_id: str,
    db: Session = Depends(get_db_safe),
):
    """Soft delete issue (set deleted_at timestamp)."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Soft delete
    issue.deleted_at = datetime.utcnow()
    db.commit()

    # Publish Kafka event
    await publish_event("issue.deleted", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
    })

    logger.info(f"Soft-deleted Issue {issue.issue_code}")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "deleted", str(issue.id))

    return None


# ============================================================
# RESTORE SOFT-DELETED ISSUE
# ============================================================

@router.post("/{issue_id}/restore", response_model=IssueResponse)
async def restore_issue(
    issue_id: str,
    db: Session = Depends(get_db_safe),
):
    """Restore soft-deleted issue (clear deleted_at timestamp)."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at != None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Soft-deleted issue {issue_id} not found"
        )

    # Restore (clear deleted_at)
    issue.deleted_at = None
    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.restored", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
    })

    logger.info(f"Restored Issue {issue.issue_code}")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "restored", str(issue.id))

    return issue


# ============================================================
# HARD DELETE ISSUE (Permanent)
# ============================================================

@router.delete("/{issue_id}/permanent", status_code=http_status.HTTP_204_NO_CONTENT)
async def hard_delete_issue(
    issue_id: str,
    force: bool = Query(False, description="If true, mark for deletion even if MinIO is unavailable (skip file deletion)"),
    db: Session = Depends(get_db_safe),
):
    """
    Permanently delete issue (hard delete from DB + MinIO files with audit trail).

    Args:
        force: If False (default), checks MinIO first and returns 503 if unavailable (no changes made).
               If True, marks issue for eventual deletion even if MinIO is down.

    Deletion order (CRITICAL):
    1. Delete external resources (MinIO files) → Track each deletion
    2. Verify deletion (Check files actually deleted)
    3. Create audit log (Record what was deleted)
    4. Delete from database (Only if all previous steps succeed)
    5. Publish Kafka event (Notification + future async processing foundation)

    If any step fails:
    - Create audit log with status='failed' or 'partial'
    - Raise HTTPException (rollback database changes)
    """

    # Find issue (including soft-deleted)
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id)
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # === PRE-CHECK: If not force, check MinIO availability FIRST (before any DB changes) ===
    if not force:
        if not minio_client.check_health():
            # MinIO unavailable - return 503 WITHOUT making any changes
            # Frontend will show dialog asking user to confirm or cancel
            db_attachments = issue.attachments or []
            logger.warning(f"MinIO unavailable (pre-check) for issue {issue.issue_code}, files_expected={len(db_attachments)}")
            raise HTTPException(
                status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={
                    "error": "minio_unavailable",
                    "message": f"File storage (MinIO) is currently unavailable.",
                    "issue_code": issue.issue_code,
                    "files_count": len(db_attachments),
                    "suggestion": "Click 'Mark for deletion' to schedule cleanup when storage becomes available, or 'Cancel' to abort."
                }
            )

    # === FORCE MODE: Skip MinIO, mark for eventual deletion ===
    if force:
        db_attachments = issue.attachments or []

        # Create audit record for eventual deletion
        audit = DeletionAudit(
            item_id=issue.id,
            item_code=issue.issue_code,
            item_type="issue",
            status=DeletionStatus.PENDING,
            started_at=datetime.utcnow(),
            files_found=len(db_attachments),
            error_message="Force mode - MinIO skipped, marked for cleanup service"
        )
        db.add(audit)
        db.commit()
        db.refresh(audit)

        # Link issue to audit record (marks item for deletion)
        issue.deletion_audit_id = audit.id
        db.commit()

        logger.info(f"Force delete: issue {issue.issue_code} marked for cleanup (audit_id={audit.id}, files_expected={len(db_attachments)})")

        # Return success - item is now marked for deletion
        return None

    # === NORMAL MODE: Try to delete files from MinIO ===
    # Create audit record
    audit = DeletionAudit(
        item_id=issue.id,
        item_code=issue.issue_code,
        item_type="issue",
        status=DeletionStatus.PENDING,
        started_at=datetime.utcnow()
    )
    db.add(audit)
    db.commit()  # Commit audit record immediately
    db.refresh(audit)

    # Track deletion results
    files_failed = []

    try:
        # === STEP 1: Delete external resources (MinIO files) ===
        folder_prefix = f"{issue.id}/"

        # List files first (for audit)
        files = minio_client.list_files(prefix=folder_prefix)
        audit.files_found = len(files)

        # Delete each file and track failures
        deleted_count = 0
        for file_name in files:
            try:
                success = minio_client.delete_file(file_name)
                if success:
                    deleted_count += 1
                else:
                    files_failed.append({
                        "file_name": file_name,
                        "error": "MinIO delete_file returned False"
                    })
            except MinIOConnectionError:
                # Re-raise connection errors - let outer handler return 503
                raise
            except Exception as e:
                logger.error(f"Failed to delete file {file_name}: {str(e)}")
                files_failed.append({
                    "file_name": file_name,
                    "error": str(e)
                })

        audit.files_deleted = deleted_count
        audit.files_failed = files_failed if files_failed else None

        # === STEP 2: Check if any files failed ===
        if files_failed:
            # Partial deletion - some files failed
            audit.status = DeletionStatus.PARTIAL
            audit.error_message = f"Failed to delete {len(files_failed)} files"
            audit.completed_at = datetime.utcnow()

            # Link issue to failed deletion audit (for frontend red warning icon)
            issue.deletion_audit_id = audit.id
            db.commit()

            logger.error(f"Partial deletion for issue {issue.issue_code}: {len(files_failed)} files failed")
            raise HTTPException(
                status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Partial deletion: {len(files_failed)} files failed to delete. Audit ID: {audit.id}"
            )

        # === STEP 3: All external resources deleted successfully ===
        if deleted_count > 0:
            logger.info(f"Deleted {deleted_count} files from MinIO folder: {folder_prefix}")
        else:
            logger.warning(f"No files found in MinIO folder: {folder_prefix}")

        # === STEP 4: Delete from database (only after external cleanup succeeds) ===
        issue_code = issue.issue_code
        db.delete(issue)
        db.commit()

        # === STEP 5: Update audit record ===
        audit.status = DeletionStatus.COMPLETED
        audit.completed_at = datetime.utcnow()
        db.commit()

        # === STEP 6: Publish Kafka event ===
        await publish_event("issue.permanently_deleted", {
            "id": str(issue_id),
            "issue_code": issue_code,
            "files_deleted": deleted_count,
            "audit_id": audit.id
        })

        logger.info(f"Permanently deleted issue {issue_code} (audit_id={audit.id})")

        # Broadcast cache invalidation to SSE clients
        await broadcast_cache_invalidation("issues", "deleted", str(issue_id))

        return None

    except HTTPException:
        # Re-raise HTTP exceptions (already handled above)
        raise

    except MinIOConnectionError as e:
        # MinIO storage service unavailable - mark for later cleanup (PENDING status)
        # Get expected file count from database attachments (works without MinIO)
        db_attachments = issue.attachments or []
        audit.files_found = len(db_attachments)
        audit.status = DeletionStatus.PENDING  # Will be retried by cleanup service
        audit.error_message = f"MinIO unavailable - marked for cleanup: {str(e)}"
        # Don't set completed_at - deletion is still pending

        # Link issue to audit record (marks item for deletion)
        issue.deletion_audit_id = audit.id
        db.commit()

        logger.warning(f"MinIO unavailable - issue {issue.issue_code} marked for cleanup (audit_id={audit.id}, files_expected={len(db_attachments)})")
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"File storage unavailable. Issue {issue.issue_code} marked for deletion - cleanup service will retry later."
        )

    except Exception as e:
        # Unexpected error - mark as failed
        audit.status = DeletionStatus.FAILED
        audit.error_message = str(e)
        audit.completed_at = datetime.utcnow()
        db.commit()

        logger.error(f"Failed to delete issue {issue.issue_code}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Deletion failed: {str(e)}"
        )


# ============================================================
# GET: DELETION AUDIT DETAILS
# ============================================================

@router.get("/{issue_id}/deletion-audit", response_model=DeletionAuditResponse)
async def get_deletion_audit(
    issue_id: str,
    db: Session = Depends(get_db_safe),
):
    """
    Get deletion audit details for an issue.

    Used by frontend to show audit log modal when deletion failed (partial status).
    Shows: files_found, files_deleted, files_failed, error_message, timestamps.

    Args:
        issue_id: Issue UUID

    Returns:
        DeletionAuditResponse with audit details

    Raises:
        404: Issue not found or no deletion audit exists
    """
    # Find issue
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()
    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check if issue has deletion audit
    if not issue.deletion_audit_id:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue.issue_code} has no deletion audit record"
        )

    # Fetch deletion audit
    audit = db.query(DeletionAudit).filter(DeletionAudit.id == issue.deletion_audit_id).first()
    if not audit:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Deletion audit {issue.deletion_audit_id} not found"
        )

    logger.info(f"Fetched deletion audit {audit.id} for issue {issue.issue_code}")
    return audit


# ============================================================
# ACTION: ASSIGN ISSUE
# ============================================================

@router.post("/{issue_id}/assign", response_model=IssueResponse)
async def assign_issue(
    issue_id: str,
    assign_data: IssueAssign,
    db: Session = Depends(get_db_safe),
):
    """Assign issue to developer."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Validate status transition
    if not validate_status_transition(issue.status, IssueStatus.ASSIGNED):
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot assign issue in status {issue.status.value}"
        )

    # Update issue
    issue.assignee_id = assign_data.assignee_id
    issue.status = IssueStatus.ASSIGNED
    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.assigned", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
        "assignee_id": str(issue.assignee_id),
    })

    logger.info(f"Assigned Issue {issue.issue_code} to {issue.assignee_id}")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "updated", str(issue.id))

    return issue


# ============================================================
# ACTION: RESOLVE ISSUE
# ============================================================

@router.post("/{issue_id}/resolve", response_model=IssueResponse)
async def resolve_issue(
    issue_id: str,
    resolve_data: IssueResolve,
    db: Session = Depends(get_db_safe),
):
    """Mark issue as resolved."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Validate status transition
    if not validate_status_transition(issue.status, IssueStatus.RESOLVED):
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot resolve issue in status {issue.status.value}"
        )

    # Update issue
    issue.resolution = resolve_data.resolution
    issue.status = IssueStatus.RESOLVED
    issue.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.resolved", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
    })

    logger.info(f"Resolved Issue {issue.issue_code}")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "updated", str(issue.id))

    return issue


# ============================================================
# ACTION: CLOSE ISSUE
# ============================================================

@router.post("/{issue_id}/close", response_model=IssueResponse)
async def close_issue(
    issue_id: str,
    close_data: IssueClose,
    db: Session = Depends(get_db_safe),
):
    """Close issue."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Validate status transition
    if not validate_status_transition(issue.status, IssueStatus.CLOSED):
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot close issue in status {issue.status.value}"
        )

    # Update issue
    issue.status = IssueStatus.CLOSED
    issue.closed_at = datetime.utcnow()

    # Optionally add comment to resolution
    if close_data.comment:
        if issue.resolution:
            issue.resolution += f"\n\nClosure comment: {close_data.comment}"
        else:
            issue.resolution = f"Closure comment: {close_data.comment}"

    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.closed", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
    })

    logger.info(f"Closed Issue {issue.issue_code}")

    # Broadcast cache invalidation to SSE clients
    await broadcast_cache_invalidation("issues", "updated", str(issue.id))

    return issue


# ============================================================
# HEALTH CHECK: MinIO
# ============================================================

@router.get("/health/minio")
async def health_minio():
    """
    Check MinIO (file storage) availability.

    Returns:
        200 OK with status='healthy' if MinIO is available
        503 Service Unavailable if MinIO is down
    """
    if minio_client.check_health():
        return {"status": "healthy", "service": "minio"}
    else:
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "unhealthy", "service": "minio", "message": "MinIO storage is unavailable"}
        )


# ============================================================
# LIST ATTACHMENTS (Compare DB vs MinIO)
# ============================================================

@router.get("/{issue_id}/attachments")
async def list_attachments(
    issue_id: str,
    db: Session = Depends(get_db_safe),
):
    """
    List attachments for an issue - compare DB metadata vs actual MinIO files.

    Returns:
        - db_attachments: What's recorded in database
        - minio_files: What's actually in MinIO storage
        - missing_in_minio: Files in DB but not in MinIO (deleted manually)
        - orphaned_in_minio: Files in MinIO but not in DB
    """
    # Find issue
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()
    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Get DB metadata
    db_attachments = issue.attachments or []
    db_filenames = {a.get('file_name') for a in db_attachments}

    # Get actual MinIO files
    minio_files = []
    missing_in_minio = []
    orphaned_in_minio = []

    if minio_client.check_health():
        folder_prefix = f"{issue_id}/"
        minio_objects = minio_client.list_files(prefix=folder_prefix)
        minio_filenames = {obj.split('/')[-1] for obj in minio_objects}
        minio_files = list(minio_filenames)

        # Compare
        missing_in_minio = list(db_filenames - minio_filenames)
        orphaned_in_minio = list(minio_filenames - db_filenames)
    else:
        minio_files = ["MinIO unavailable"]

    return {
        "issue_code": issue.issue_code,
        "db_attachments": db_attachments,
        "minio_files": minio_files,
        "missing_in_minio": missing_in_minio,
        "orphaned_in_minio": orphaned_in_minio,
        "status": "synced" if not missing_in_minio and not orphaned_in_minio else "out_of_sync"
    }


# ============================================================
# DOWNLOAD ATTACHMENT
# ============================================================

from fastapi.responses import StreamingResponse
from io import BytesIO

@router.head("/{issue_id}/attachments/{filename}")
async def check_attachment_exists(
    issue_id: str,
    filename: str,
    db: Session = Depends(get_db_safe),
):
    """
    Check if attachment exists (HEAD request - no download).

    Returns:
        200: File exists
        404: Issue not found, attachment not in metadata, or file missing in MinIO
        503: MinIO unavailable
    """
    # Find issue (including soft-deleted)
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check if attachment exists in issue metadata
    attachments = issue.attachments or []
    attachment_meta = next((a for a in attachments if a.get('file_name') == filename), None)

    if not attachment_meta:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Attachment '{filename}' not found in issue {issue.issue_code}"
        )

    # Check MinIO availability
    if not minio_client.check_health():
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) is currently unavailable"
        )

    # Check if file exists in MinIO
    object_name = attachment_meta.get('object_name', f"{issue_id}/{filename}")
    try:
        file_data = minio_client.download_file(object_name)
        if file_data is None:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail=f"File '{filename}' not found in storage"
            )
        # File exists - return 200 OK with metadata headers
        return {
            "exists": True,
            "file_name": filename,
            "file_size": attachment_meta.get('file_size'),
            "content_type": attachment_meta.get('content_type'),
        }
    except MinIOConnectionError:
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) connection failed"
        )


# ============================================================
# UPLOAD ATTACHMENTS TO EXISTING ISSUE
# ============================================================

@router.post("/{issue_id}/attachments", status_code=http_status.HTTP_201_CREATED)
async def upload_attachments(
    issue_id: str,
    files: List[UploadFile] = File(..., description="Files to upload"),
    db: Session = Depends(get_db_safe),
):
    """
    Upload attachments to an existing issue.

    Args:
        issue_id: Issue UUID
        files: List of files to upload

    Returns:
        201 Created with list of uploaded attachment metadata

    Raises:
        404: Issue not found
        400: Attachment limit exceeded (max 5)
        503: MinIO unavailable
    """
    # Find issue (including soft-deleted - allow attachment management)
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check attachment limit (max 5)
    existing_attachments = issue.attachments or []
    total_after_upload = len(existing_attachments) + len(files)
    if total_after_upload > 5:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Attachment limit exceeded. Maximum 5 attachments allowed. Current: {len(existing_attachments)}, Trying to add: {len(files)}"
        )

    # Check MinIO availability
    if not minio_client.check_health():
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) is currently unavailable"
        )

    uploaded_attachments = []
    try:
        for file in files:
            # Read file content
            file_content = await file.read()
            file_size = len(file_content)

            # Generate object name (issue_id/filename)
            object_name = f"{issue_id}/{file.filename}"

            # Upload to MinIO
            minio_client.upload_file(
                file_data=file_content,
                object_name=object_name,
                content_type=file.content_type or "application/octet-stream"
            )

            # Create attachment metadata
            attachment_meta = {
                "file_name": file.filename,
                "file_path": f"/issues/{issue_id}/attachments/{file.filename}",
                "file_size": file_size,
                "content_type": file.content_type or "application/octet-stream",
                "object_name": object_name,
                "uploaded_at": datetime.utcnow().isoformat()
            }
            uploaded_attachments.append(attachment_meta)
            logger.info(f"Uploaded attachment '{file.filename}' ({file_size} bytes) to issue {issue.issue_code}")

        # Update issue attachments in DB
        issue.attachments = existing_attachments + uploaded_attachments
        db.commit()

        logger.info(f"Successfully uploaded {len(uploaded_attachments)} attachments to issue {issue.issue_code}")

        # Publish Kafka event
        await publish_event("issue.attachments_uploaded", {
            "id": str(issue.id),
            "issue_code": issue.issue_code,
            "attachments": [a["file_name"] for a in uploaded_attachments],
        })

        return {"uploaded": uploaded_attachments}

    except MinIOConnectionError:
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) connection failed"
        )
    except Exception as e:
        logger.error(f"Error uploading attachments: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading files: {str(e)}"
        )


# ============================================================
# BULK DELETE ATTACHMENTS
# ============================================================

@router.post("/{issue_id}/attachments/bulk-delete", response_model=BulkAttachmentDeleteResponse)
async def bulk_delete_attachments(
    issue_id: str,
    request: BulkAttachmentDeleteRequest,
    db: Session = Depends(get_db_safe),
):
    """
    Delete multiple attachments from an issue in a single request.

    Returns detailed results for each file:
    - deleted: Successfully deleted from both DB and MinIO
    - not_found_db: File not found in issue's attachment metadata
    - not_found_minio: File found in DB but missing in MinIO (orphaned record - cleaned up)
    - error: Deletion failed due to an error

    Note: Files marked as 'not_found_minio' are orphaned records. The DB metadata
    is cleaned up, but this indicates a data integrity issue that should be investigated.
    The frontend's serviceWorkflow will auto-create an Issue with category=DATA_INTEGRITY.

    Args:
        issue_id: Issue UUID
        request: List of filenames to delete

    Returns:
        BulkAttachmentDeleteResponse with counts and per-file results

    Raises:
        404: Issue not found
        503: MinIO unavailable
    """
    # Find issue (including soft-deleted - allow attachment management)
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check MinIO availability
    if not minio_client.check_health():
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) is currently unavailable"
        )

    attachments = issue.attachments or []
    results: List[AttachmentDeleteResult] = []
    deleted_count = 0
    not_found_db_count = 0
    not_found_minio_count = 0
    error_count = 0
    files_to_remove = []

    for filename in request.filenames:
        # Check if attachment exists in issue metadata
        attachment_meta = next((a for a in attachments if a.get('file_name') == filename), None)

        if not attachment_meta:
            # File not in database metadata
            results.append(AttachmentDeleteResult(
                filename=filename,
                status="not_found_db",
                error=None
            ))
            not_found_db_count += 1
            continue

        # Get object name from metadata
        object_name = attachment_meta.get('object_name', f"{issue_id}/{filename}")

        try:
            # Try to delete from MinIO
            success = minio_client.delete_file(object_name)

            if success:
                # Successfully deleted from MinIO
                results.append(AttachmentDeleteResult(
                    filename=filename,
                    status="deleted",
                    error=None
                ))
                deleted_count += 1
                files_to_remove.append(filename)
            else:
                # MinIO returned False - file doesn't exist (orphaned DB record)
                logger.warning(
                    f"Orphaned attachment record: {filename} in issue {issue.issue_code} "
                    f"- DB metadata exists but MinIO file missing"
                )
                results.append(AttachmentDeleteResult(
                    filename=filename,
                    status="not_found_minio",
                    error="File exists in database but not in storage (orphaned record)"
                ))
                not_found_minio_count += 1
                files_to_remove.append(filename)  # Still clean up DB metadata

        except MinIOConnectionError as e:
            logger.error(f"MinIO connection error deleting {filename}: {str(e)}")
            results.append(AttachmentDeleteResult(
                filename=filename,
                status="error",
                error="Storage connection failed"
            ))
            error_count += 1
        except Exception as e:
            logger.error(f"Error deleting attachment {filename}: {str(e)}")
            results.append(AttachmentDeleteResult(
                filename=filename,
                status="error",
                error=str(e)
            ))
            error_count += 1

    # Update DB metadata - remove all successfully processed files
    if files_to_remove:
        updated_attachments = [a for a in attachments if a.get('file_name') not in files_to_remove]
        issue.attachments = updated_attachments if updated_attachments else None
        db.commit()

        logger.info(
            f"Bulk deleted {len(files_to_remove)} attachments from issue {issue.issue_code}: "
            f"deleted={deleted_count}, orphaned={not_found_minio_count}"
        )

        # Publish Kafka event for bulk deletion
        await publish_event("issue.attachments_bulk_deleted", {
            "id": str(issue.id),
            "issue_code": issue.issue_code,
            "deleted_count": deleted_count,
            "orphaned_count": not_found_minio_count,
            "filenames": files_to_remove,
        })

    return BulkAttachmentDeleteResponse(
        total=len(request.filenames),
        deleted=deleted_count,
        not_found_db=not_found_db_count,
        not_found_minio=not_found_minio_count,
        errors=error_count,
        results=results
    )


# ============================================================
# DELETE SINGLE ATTACHMENT
# ============================================================

@router.delete("/{issue_id}/attachments/{filename}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_attachment(
    issue_id: str,
    filename: str,
    db: Session = Depends(get_db_safe),
):
    """
    Delete a single attachment from an issue.

    Args:
        issue_id: Issue UUID
        filename: Attachment filename to delete

    Returns:
        204 No Content on success

    Raises:
        404: Issue not found or attachment not found
        503: MinIO unavailable
    """
    # Find issue (including soft-deleted - allow attachment management)
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check if attachment exists in issue metadata
    attachments = issue.attachments or []
    attachment_meta = next((a for a in attachments if a.get('file_name') == filename), None)

    if not attachment_meta:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Attachment '{filename}' not found in issue {issue.issue_code}"
        )

    # Check MinIO availability
    if not minio_client.check_health():
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) is currently unavailable"
        )

    # Get object name from metadata or construct it
    object_name = attachment_meta.get('object_name', f"{issue_id}/{filename}")

    try:
        # Delete file from MinIO
        success = minio_client.delete_file(object_name)

        if not success:
            logger.warning(f"MinIO delete_file returned False for {object_name}")
            # File might already be deleted - continue with DB cleanup

        # Remove attachment from issue metadata
        updated_attachments = [a for a in attachments if a.get('file_name') != filename]
        issue.attachments = updated_attachments if updated_attachments else None
        db.commit()

        logger.info(f"Deleted attachment '{filename}' from issue {issue.issue_code}")

        # Publish Kafka event
        await publish_event("issue.attachment_deleted", {
            "id": str(issue.id),
            "issue_code": issue.issue_code,
            "filename": filename,
        })

        return None

    except MinIOConnectionError:
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) connection failed"
        )
    except Exception as e:
        logger.error(f"Error deleting attachment {filename}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )


# ============================================================
# DOWNLOAD ATTACHMENT
# ============================================================

@router.get("/{issue_id}/attachments/{filename}")
async def download_attachment(
    issue_id: str,
    filename: str,
    db: Session = Depends(get_db_safe),
):
    """
    Download attachment file from MinIO.

    Args:
        issue_id: Issue UUID
        filename: Attachment filename

    Returns:
        File stream with proper content-type

    Raises:
        404: Issue not found or attachment not found
        503: MinIO unavailable
    """
    # Find issue (including soft-deleted - attachments should still be downloadable)
    issue = db.query(Issue).filter(Issue.id == uuid.UUID(issue_id)).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check if attachment exists in issue metadata
    attachments = issue.attachments or []
    attachment_meta = next((a for a in attachments if a.get('file_name') == filename), None)

    if not attachment_meta:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Attachment '{filename}' not found in issue {issue.issue_code}"
        )

    # Check MinIO availability
    if not minio_client.check_health():
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) is currently unavailable"
        )

    # Get object name from metadata or construct it
    object_name = attachment_meta.get('object_name', f"{issue_id}/{filename}")

    try:
        # Download file from MinIO
        file_data = minio_client.download_file(object_name)

        if file_data is None:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail=f"File '{filename}' not found in storage"
            )

        # Get content type from metadata
        content_type = attachment_meta.get('content_type', 'application/octet-stream')

        logger.info(f"Downloaded attachment: {filename} for issue {issue.issue_code}")

        return StreamingResponse(
            BytesIO(file_data),
            media_type=content_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(len(file_data))
            }
        )

    except MinIOConnectionError:
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="File storage (MinIO) connection failed"
        )
    except Exception as e:
        logger.error(f"Error downloading attachment {filename}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error downloading file: {str(e)}"
        )


# ============================================================
# PESSIMISTIC LOCKING
# ============================================================
# Lock is acquired when user opens edit modal.
# Lock is released when user closes modal (or saves).
#
# Unlock permission rules:
# 1. Same user who locked → always allowed
# 2. Super Admin (level 100) → always allowed (force unlock)
# 3. Cleanup service (SYSTEM_USER_ID) → always allowed (stale lock cleanup)
# 4. Other users → 403 Forbidden

# Super Admin permission level
SUPER_ADMIN_LEVEL = 100

# Cleanup service user ID (same as SYSTEM_USER_ID)
CLEANUP_SERVICE_USER_ID = uuid.UUID("00000000-0000-4000-8000-000000000001")


@router.get("/{issue_id}/lock")
async def check_lock_status(
    issue_id: str,
    x_user_id: str = Header(..., alias="X-User-ID", description="UUID of the user checking lock"),
    db: Session = Depends(get_db_safe),
):
    """
    Check lock status for an issue (without acquiring it).

    Used for polling to check if lock is still held and by whom.

    Returns:
        200 OK + is_locked: false → No lock on this issue
        200 OK + is_locked: true, is_mine: true → Lock held by current user
        200 OK + is_locked: true, is_mine: false, locked_by → Lock held by another user
        404 Not Found → Issue not found
    """
    # Validate issue_id
    try:
        issue_uuid = uuid.UUID(issue_id)
    except ValueError:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid issue ID format"
        )

    # Validate user_id
    try:
        user_uuid = uuid.UUID(x_user_id)
    except ValueError:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format in X-User-ID header"
        )

    # Get issue
    issue = db.query(Issue).filter(Issue.id == issue_uuid).first()
    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check lock status
    if issue.locked_by_id is None:
        return {
            "is_locked": False,
            "is_mine": False,
            "locked_by": None,
        }

    is_mine = issue.locked_by_id == user_uuid
    return {
        "is_locked": True,
        "is_mine": is_mine,
        "locked_by": {
            "id": str(issue.locked_by_id),
            "locked_at": issue.locked_at.isoformat() if issue.locked_at else None,
        } if not is_mine else None,  # Only return locked_by info if not mine
    }


@router.post("/{issue_id}/lock", response_model=LockResponse)
async def acquire_lock(
    issue_id: str,
    lock_request: LockRequest = Body(...),
    db: Session = Depends(get_db_safe),
):
    """
    Acquire a lock on an issue for editing.

    Called when user opens an edit modal.
    Prevents concurrent editing by other users.

    Returns:
        200 OK + success: true → Lock acquired successfully
        409 Conflict + locked_by → Lock held by another user (conflict info returned)
        404 Not Found → Issue not found
    """
    # Validate issue_id
    try:
        issue_uuid = uuid.UUID(issue_id)
    except ValueError:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid issue ID format"
        )

    # Get issue
    issue = db.query(Issue).filter(Issue.id == issue_uuid).first()
    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Check if already locked
    if issue.locked_by_id is not None:
        # Check if same user - allow re-lock (idempotent)
        if issue.locked_by_id == lock_request.user_id:
            logger.debug(f"Lock re-acquired by same user for issue {issue.issue_code}")
            return LockResponse(success=True)

        # Locked by someone else - return 409 Conflict (frontend does name lookup by ID)
        logger.info(
            f"Lock conflict for issue {issue.issue_code}: "
            f"requested by {lock_request.user_id}, held by {issue.locked_by_id}"
        )
        raise HTTPException(
            status_code=http_status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "locked_by": {
                    "id": str(issue.locked_by_id),
                    "locked_at": issue.locked_at.isoformat() if issue.locked_at else None,
                }
            }
        )

    # Acquire lock (only ID and timestamp, no name)
    issue.locked_by_id = lock_request.user_id
    issue.locked_at = datetime.utcnow()

    try:
        db.commit()
        logger.info(f"Lock acquired for issue {issue.issue_code} by user {lock_request.user_id}")
        return LockResponse(success=True)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to acquire lock for issue {issue.issue_code}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to acquire lock"
        )


@router.delete("/{issue_id}/lock", response_model=LockResponse)
async def release_lock(
    issue_id: str,
    x_user_id: str = Header(..., alias="X-User-ID", description="UUID of the user releasing the lock"),
    x_permission_level: int = Header(default=0, alias="X-Permission-Level", description="Permission level (0-100)"),
    db: Session = Depends(get_db_safe),
):
    """
    Release a lock on an issue.

    Called when user closes edit modal (save or cancel).

    Permission rules for unlock:
    1. Same user who locked → always allowed
    2. Super Admin (level 100) → always allowed (force unlock)
    3. Cleanup service (SYSTEM_USER_ID) → always allowed (stale lock cleanup)
    4. Other users → 403 Forbidden

    Returns:
        200 OK + success: true → Lock released successfully
        200 OK + success: true → Issue was not locked (no-op)
        403 Forbidden → Not authorized to release this lock
        404 Not Found → Issue not found
    """
    # Validate issue_id
    try:
        issue_uuid = uuid.UUID(issue_id)
    except ValueError:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid issue ID format"
        )

    # Validate user_id
    try:
        user_uuid = uuid.UUID(x_user_id)
    except ValueError:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format in X-User-ID header"
        )

    # Get issue
    issue = db.query(Issue).filter(Issue.id == issue_uuid).first()
    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # If not locked, return success (no-op)
    if issue.locked_by_id is None:
        logger.debug(f"Release lock called on unlocked issue {issue.issue_code} - no-op")
        return LockResponse(success=True)

    # Check unlock permission
    is_same_user = issue.locked_by_id == user_uuid
    is_super_admin = x_permission_level >= SUPER_ADMIN_LEVEL
    is_cleanup_service = user_uuid == CLEANUP_SERVICE_USER_ID

    if not (is_same_user or is_super_admin or is_cleanup_service):
        logger.warning(
            f"Unauthorized unlock attempt for issue {issue.issue_code}: "
            f"requested by {x_user_id}, locked by {issue.locked_by_id}"
        )
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Not authorized to release this lock",
                "locked_by": {
                    "id": str(issue.locked_by_id),
                    "locked_at": issue.locked_at.isoformat() if issue.locked_at else None,
                }
            }
        )

    # Log unlock reason
    if is_same_user:
        unlock_reason = "same user"
    elif is_super_admin:
        unlock_reason = "super admin force unlock"
    else:
        unlock_reason = "cleanup service"

    # Release lock
    locked_by_id = issue.locked_by_id  # Save for logging
    issue.locked_by_id = None
    issue.locked_at = None

    try:
        db.commit()
        logger.info(
            f"Lock released for issue {issue.issue_code} ({unlock_reason}), "
            f"was held by user {locked_by_id}"
        )
        return LockResponse(success=True)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to release lock for issue {issue.issue_code}: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to release lock"
        )


# ============================================================
# BULK EXPORT
# ============================================================

@router.post("/export")
async def export_issues(
    format: str = Query(..., regex="^(csv|json|zip)$", description="Export format: csv, json, or zip"),
    request: IssueExportRequest = Body(...),
    db: Session = Depends(get_db_safe),
):
    """
    Export multiple issues to CSV, JSON, or ZIP format.

    Returns complete issue data (all fields) unlike frontend DataGrid export
    which only includes visible columns.

    **Query parameters:**
    - format: Export format ('csv', 'json', or 'zip')

    **Request body:**
    ```json
    {
      "issue_ids": ["uuid-1", "uuid-2", "uuid-3"],
      "skip_attachments": false  // Optional, for ZIP exports only
    }
    ```

    **Returns:**
    - CSV: StreamingResponse with text/csv content
    - JSON: StreamingResponse with application/json content
    - ZIP: StreamingResponse with application/zip content

    **Error codes:**
    - 400: Invalid format parameter
    - 404: One or more issues not found
    - 500: Export generation failed
    """
    logger.info(f"[Export] Exporting {len(request.issue_ids)} issues as {format}")

    # Fetch issues from database
    try:
        issue_uuids = [uuid.UUID(issue_id) for issue_id in request.issue_ids]
        issues = db.query(Issue).filter(Issue.id.in_(issue_uuids)).all()

        if len(issues) != len(request.issue_ids):
            found_ids = {str(issue.id) for issue in issues}
            missing_ids = [id for id in request.issue_ids if id not in found_ids]
            logger.warning(f"[Export] Issues not found: {missing_ids}")
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail=f"Issues not found: {', '.join(missing_ids)}"
            )

        logger.info(f"[Export] Found {len(issues)} issues in database")

    except ValueError as e:
        logger.error(f"[Export] Invalid UUID format: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid UUID format in issue_ids"
        )

    # Generate export based on format
    try:
        if format == "csv":
            return _generate_csv_export(issues)
        elif format == "json":
            return _generate_json_export(issues)
        elif format == "zip":
            return await _generate_zip_export(issues, request.skip_attachments)
        else:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported format: {format}"
            )
    except Exception as e:
        logger.error(f"[Export] Failed to generate {format} export: {str(e)}")
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Export generation failed: {str(e)}"
        )


def _generate_csv_export(issues: List[Issue]) -> StreamingResponse:
    """
    Generate CSV export with all issue fields.

    Returns StreamingResponse with CSV content.
    """
    logger.info(f"[Export] Generating CSV for {len(issues)} issues")

    # CSV headers (all fields)
    headers = [
        'ID', 'Kód', 'Názov', 'Popis', 'Typ', 'Závažnosť', 'Stav', 'Priorita',
        'Kategória', 'Reporter ID', 'Assignee ID', 'Riešenie',
        'Vytvorené', 'Aktualizované', 'Vyriešené', 'Uzatvorené', 'Vymazané',
        'Typ chyby', 'Chybová správa',
        'Prehliadač', 'OS', 'URL', 'Viewport', 'Screen', 'Timestamp', 'User Agent',
        'Počet príloh',
    ]

    # Generate CSV content
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(headers)

    for issue in issues:
        row = [
            str(issue.id),
            issue.issue_code,
            issue.title,
            issue.description or '',
            issue.type.value,
            issue.severity.value,
            issue.status.value,
            issue.priority.value,
            issue.category.value if issue.category else '',
            str(issue.reporter_id),
            str(issue.assignee_id) if issue.assignee_id else '',
            issue.resolution or '',
            issue.created_at.isoformat(),
            issue.updated_at.isoformat() if issue.updated_at else '',
            issue.resolved_at.isoformat() if issue.resolved_at else '',
            issue.closed_at.isoformat() if issue.closed_at else '',
            issue.deleted_at.isoformat() if issue.deleted_at else '',
            issue.error_type or '',
            issue.error_message or '',
            issue.system_info.get('browser', '') if issue.system_info else '',
            issue.system_info.get('os', '') if issue.system_info else '',
            issue.system_info.get('url', '') if issue.system_info else '',
            issue.system_info.get('viewport', '') if issue.system_info else '',
            issue.system_info.get('screen', '') if issue.system_info else '',
            issue.system_info.get('timestamp', '') if issue.system_info else '',
            issue.system_info.get('userAgent', '') if issue.system_info else '',
            len(issue.attachments) if issue.attachments else 0,
        ]
        writer.writerow(row)

    # Create streaming response - encode to bytes for correct Content-Length
    csv_string = output.getvalue()
    output.close()
    csv_content = csv_string.encode('utf-8')

    filename = f"issues_export_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.csv"
    logger.info(f"[Export] CSV generated: {filename} ({len(csv_content)} bytes)")

    return StreamingResponse(
        BytesIO(csv_content),
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(csv_content))
        }
    )


def _generate_json_export(issues: List[Issue]) -> StreamingResponse:
    """
    Generate JSON export with all issue fields.

    Returns StreamingResponse with JSON content.
    """
    logger.info(f"[Export] Generating JSON for {len(issues)} issues")

    # Convert issues to JSON-serializable format
    issues_data = []
    for issue in issues:
        issue_dict = {
            "id": str(issue.id),
            "issue_code": issue.issue_code,
            "title": issue.title,
            "description": issue.description,
            "type": issue.type.value,
            "severity": issue.severity.value,
            "status": issue.status.value,
            "priority": issue.priority.value,
            "category": issue.category.value if issue.category else None,
            "reporter_id": str(issue.reporter_id),
            "assignee_id": str(issue.assignee_id) if issue.assignee_id else None,
            "resolution": issue.resolution,
            "created_at": issue.created_at.isoformat(),
            "updated_at": issue.updated_at.isoformat() if issue.updated_at else None,
            "resolved_at": issue.resolved_at.isoformat() if issue.resolved_at else None,
            "closed_at": issue.closed_at.isoformat() if issue.closed_at else None,
            "deleted_at": issue.deleted_at.isoformat() if issue.deleted_at else None,
            "error_type": issue.error_type,
            "error_message": issue.error_message,
            "system_info": issue.system_info,
            "attachments": issue.attachments,
        }
        issues_data.append(issue_dict)

    # Generate JSON content - encode to bytes for correct Content-Length
    json_string = json.dumps(issues_data, indent=2, ensure_ascii=False)
    json_content = json_string.encode('utf-8')

    filename = f"issues_export_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.json"
    logger.info(f"[Export] JSON generated: {filename} ({len(json_content)} bytes)")

    return StreamingResponse(
        BytesIO(json_content),
        media_type="application/json",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(json_content))
        }
    )


async def _generate_zip_export(issues: List[Issue], skip_attachments: bool = False) -> StreamingResponse:
    """
    Generate ZIP export with issue data and attachments.

    Creates ZIP structure:
    - ISS-001_uuid/
      - issue.json
      - issue.csv
      - attachments/ (if not skipped)
        - file1.png
        - file2.pdf

    Returns StreamingResponse with ZIP content.
    """
    logger.info(f"[Export] Generating ZIP for {len(issues)} issues (skip_attachments={skip_attachments})")

    # Create ZIP in memory
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # CSV headers for individual issue export
        csv_headers = [
            'ID', 'Kód', 'Názov', 'Popis', 'Typ', 'Závažnosť', 'Stav', 'Priorita',
            'Kategória', 'Reporter ID', 'Assignee ID', 'Riešenie',
            'Vytvorené', 'Aktualizované', 'Vyriešené', 'Uzatvorené', 'Vymazané',
            'Typ chyby', 'Chybová správa',
            'Prehliadač', 'OS', 'URL', 'Viewport', 'Screen', 'Timestamp', 'User Agent',
            'Počet príloh',
        ]

        for issue in issues:
            # Folder name: issue_code_uuid
            folder_name = f"{issue.issue_code}_{issue.id}"

            # Generate JSON content for this issue
            issue_dict = {
                "id": str(issue.id),
                "issue_code": issue.issue_code,
                "title": issue.title,
                "description": issue.description,
                "type": issue.type.value,
                "severity": issue.severity.value,
                "status": issue.status.value,
                "priority": issue.priority.value,
                "category": issue.category.value if issue.category else None,
                "reporter_id": str(issue.reporter_id),
                "assignee_id": str(issue.assignee_id) if issue.assignee_id else None,
                "resolution": issue.resolution,
                "created_at": issue.created_at.isoformat(),
                "updated_at": issue.updated_at.isoformat() if issue.updated_at else None,
                "resolved_at": issue.resolved_at.isoformat() if issue.resolved_at else None,
                "closed_at": issue.closed_at.isoformat() if issue.closed_at else None,
                "deleted_at": issue.deleted_at.isoformat() if issue.deleted_at else None,
                "error_type": issue.error_type,
                "error_message": issue.error_message,
                "system_info": issue.system_info,
                "attachments": issue.attachments,
            }
            json_content = json.dumps(issue_dict, indent=2, ensure_ascii=False)
            zip_file.writestr(f"{folder_name}/issue.json", json_content)

            # Generate CSV content for this issue
            csv_output = StringIO()
            csv_writer = csv.writer(csv_output)
            csv_writer.writerow(csv_headers)
            csv_row = [
                str(issue.id),
                issue.issue_code,
                issue.title,
                issue.description or '',
                issue.type.value,
                issue.severity.value,
                issue.status.value,
                issue.priority.value,
                issue.category.value if issue.category else '',
                str(issue.reporter_id),
                str(issue.assignee_id) if issue.assignee_id else '',
                issue.resolution or '',
                issue.created_at.isoformat(),
                issue.updated_at.isoformat() if issue.updated_at else '',
                issue.resolved_at.isoformat() if issue.resolved_at else '',
                issue.closed_at.isoformat() if issue.closed_at else '',
                issue.deleted_at.isoformat() if issue.deleted_at else '',
                issue.error_type or '',
                issue.error_message or '',
                issue.system_info.get('browser', '') if issue.system_info else '',
                issue.system_info.get('os', '') if issue.system_info else '',
                issue.system_info.get('url', '') if issue.system_info else '',
                issue.system_info.get('viewport', '') if issue.system_info else '',
                issue.system_info.get('screen', '') if issue.system_info else '',
                issue.system_info.get('timestamp', '') if issue.system_info else '',
                issue.system_info.get('userAgent', '') if issue.system_info else '',
                len(issue.attachments) if issue.attachments else 0,
            ]
            csv_writer.writerow(csv_row)
            csv_content = csv_output.getvalue()
            csv_output.close()
            zip_file.writestr(f"{folder_name}/issue.csv", csv_content)

            # Download and add attachments (if not skipping)
            if not skip_attachments and issue.attachments:
                for attachment in issue.attachments:
                    try:
                        # Check MinIO health
                        if not minio_client.check_health():
                            logger.warning(f"[Export] MinIO unavailable, skipping attachment: {attachment['file_name']}")
                            continue

                        # Download file from MinIO
                        object_name = attachment.get('object_name', f"{issue.id}/{attachment['file_name']}")
                        file_data = minio_client.download_file(object_name)

                        if file_data:
                            zip_file.writestr(
                                f"{folder_name}/attachments/{attachment['file_name']}",
                                file_data
                            )
                            logger.info(f"[Export] ✅ Added attachment: {attachment['file_name']}")
                        else:
                            logger.warning(f"[Export] ⚠️ Attachment not found: {attachment['file_name']}")

                    except MinIOConnectionError:
                        logger.warning(f"[Export] MinIO connection error, skipping: {attachment['file_name']}")
                    except Exception as e:
                        logger.error(f"[Export] Error downloading attachment {attachment['file_name']}: {str(e)}")

    # Get ZIP content
    zip_buffer.seek(0)
    zip_content = zip_buffer.read()

    filename = f"issues_export_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.zip"
    logger.info(f"[Export] ZIP generated: {filename} ({len(zip_content)} bytes)")

    return StreamingResponse(
        BytesIO(zip_content),
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(zip_content))
        }
    )
