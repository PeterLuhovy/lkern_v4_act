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

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import datetime
import uuid
import logging

from app.database import get_db
from app.models import Issue, IssueType, IssueSeverity, IssueCategory, IssueStatus, IssuePriority
from app.schemas import (
    IssueCreateUserBasic,
    IssueCreateUserStandard,
    IssueCreateUserAdvance,
    IssueUpdate,
    IssueAssign,
    IssueResolve,
    IssueClose,
    IssueResponse,
)
from app.services.issue_service import generate_issue_code, validate_status_transition
from app.events.producer import publish_event

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
        query = query.filter(Issue.is_deleted == False)  # noqa: E712

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
        Issue.is_deleted == False  # noqa: E712
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
    role: str = Query(..., regex="^(user_basic|user_standard|user_advance)$", description="User role"),

    # Accept all 3 schema variants (FastAPI will validate based on role)
    basic_data: Optional[IssueCreateUserBasic] = None,
    standard_data: Optional[IssueCreateUserStandard] = None,
    advance_data: Optional[IssueCreateUserAdvance] = None,

    db: Session = Depends(get_db),
):
    """
    Create new issue - role-based schema validation.

    Roles:
    - user_basic: Minimal fields (title, description, type, 1 screenshot)
    - user_standard: Basic fields (+ severity, optional attachments)
    - user_advance: Full fields (+ category, developer data, logs)

    Query parameter:
    - role: user_basic | user_standard | user_advance
    """
    # Determine which schema to use based on role
    if role == "user_basic":
        if not basic_data:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail="user_basic role requires IssueCreateUserBasic schema"
            )
        data = basic_data.model_dump()
        # Set defaults for user_basic
        data['severity'] = IssueSeverity.MODERATE
        data['priority'] = IssuePriority.MEDIUM

    elif role == "user_standard":
        if not standard_data:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail="user_standard role requires IssueCreateUserStandard schema"
            )
        data = standard_data.model_dump()
        # Set defaults for user_standard
        data['priority'] = IssuePriority.MEDIUM

    elif role == "user_advance":
        if not advance_data:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail="user_advance role requires IssueCreateUserAdvance schema"
            )
        data = advance_data.model_dump()

    else:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role: {role}"
        )

    # Generate issue_code
    issue_code = generate_issue_code(db, data['type'])

    # TODO: Get reporter_id from JWT token (for now, use dummy UUID)
    reporter_id = uuid.uuid4()

    # Create Issue entity
    issue = Issue(
        issue_code=issue_code,
        reporter_id=reporter_id,
        status=IssueStatus.OPEN,
        **data
    )

    db.add(issue)
    db.commit()
    db.refresh(issue)

    # Publish Kafka event
    await publish_event("issue.created", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
        "type": issue.type.value,
        "reporter_id": str(issue.reporter_id),
    })

    logger.info(f"Created Issue {issue.issue_code} (role={role})")

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
        Issue.is_deleted == False  # noqa: E712
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
    """Soft delete issue (set is_deleted=True)."""
    issue = db.query(Issue).filter(
        Issue.id == uuid.UUID(issue_id),
        Issue.is_deleted == False  # noqa: E712
    ).first()

    if not issue:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found"
        )

    # Soft delete
    issue.is_deleted = True
    db.commit()

    # Publish Kafka event
    await publish_event("issue.deleted", {
        "id": str(issue.id),
        "issue_code": issue.issue_code,
    })

    logger.info(f"Soft-deleted Issue {issue.issue_code}")

    return None


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
        Issue.is_deleted == False  # noqa: E712
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
        Issue.is_deleted == False  # noqa: E712
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
        Issue.is_deleted == False  # noqa: E712
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
