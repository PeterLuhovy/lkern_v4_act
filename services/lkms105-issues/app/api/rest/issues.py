"""
================================================================
Issues Service - Issues REST API
================================================================
File: services/lkms105-issues/app/api/rest/issues.py
Version: v1.0.0
Created: 2025-11-08
Description:
  FastAPI router for Issue CRUD operations with:
  - Role-based create (user_basic, user_standard, user_advance)
  - 8 filters (type, severity, status, category, priority, assignee, reporter, search)
  - Soft delete
  - Actions (assign, resolve, close)
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Body, status as http_status, Form, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from datetime import datetime
import uuid
import logging
import json

from app.database import get_db
from app.models import Issue, IssueType, IssueSeverity, IssueCategory, IssueStatus, IssuePriority, DeletionAudit, DeletionStatus
from app.schemas import (
    IssueCreateUserBasic,
    IssueCreateUserStandard,
    IssueCreateUserAdvance,
    IssueUpdate,
    IssueAssign,
    IssueResolve,
    IssueClose,
    IssueResponse,
    DeletionAuditResponse,
)
from app.services.issue_service import generate_issue_code, validate_status_transition
from app.events.producer import publish_event
from app.services.minio_client import minio_client, MinIOConnectionError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/issues", tags=["Issues"])


# ============================================================
# LIST ISSUES (with 8 filters)
# ============================================================

@router.get("/", response_model=List[IssueResponse])
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

    db: Session = Depends(get_db),
):
    """
    Get list of issues with optional filters.

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

    return issues


# ============================================================
# GET SINGLE ISSUE
# ============================================================

@router.get("/{issue_id}", response_model=IssueResponse)
async def get_issue(
    issue_id: str,
    db: Session = Depends(get_db),
):
    """Get single issue by UUID."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    return issue


# ============================================================
# CREATE ISSUE (Role-Based)
# ============================================================

@router.post("/", response_model=IssueResponse, status_code=http_status.HTTP_201_CREATED)
async def create_issue(
    data: str = Form(..., description="JSON string with issue data"),
    role: str = Form(..., description="User role: user_basic | user_standard | user_advance"),
    files: List[UploadFile] = File(default=[], description="Optional file attachments"),
    db: Session = Depends(get_db),
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

    return issue


# ============================================================
# UPDATE ISSUE
# ============================================================

@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: str,
    update_data: IssueUpdate,
    db: Session = Depends(get_db),
):
    """Update existing issue (partial update)."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.deleted_at == None  # noqa: E711
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Update only provided fields
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(issue, key, value)

    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.updated", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
    })

    logger.info(f"Updated Issue {issue.issue_code}")

    return issue


# ============================================================
# DELETE ISSUE (Soft Delete)
# ============================================================

@router.delete("/{issue_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_issue(
    issue_id: str,
    db: Session = Depends(get_db),
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

    return None


# ============================================================
# RESTORE SOFT-DELETED ISSUE
# ============================================================

@router.post("/{issue_id}/restore", response_model=IssueResponse)
async def restore_issue(
    issue_id: str,
    db: Session = Depends(get_db),
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

    return issue


# ============================================================
# HARD DELETE ISSUE (Permanent)
# ============================================================

@router.delete("/{issue_id}/permanent", status_code=http_status.HTTP_204_NO_CONTENT)
async def hard_delete_issue(
    issue_id: str,
    force: bool = Query(False, description="If true, mark for deletion even if MinIO is unavailable (skip file deletion)"),
    db: Session = Depends(get_db),
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
    db: Session = Depends(get_db),
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
    db: Session = Depends(get_db),
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

    return issue


# ============================================================
# ACTION: RESOLVE ISSUE
# ============================================================

@router.post("/{issue_id}/resolve", response_model=IssueResponse)
async def resolve_issue(
    issue_id: str,
    resolve_data: IssueResolve,
    db: Session = Depends(get_db),
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

    return issue


# ============================================================
# ACTION: CLOSE ISSUE
# ============================================================

@router.post("/{issue_id}/close", response_model=IssueResponse)
async def close_issue(
    issue_id: str,
    close_data: IssueClose,
    db: Session = Depends(get_db),
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

    return issue
