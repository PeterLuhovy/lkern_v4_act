"""
================================================================
Issues Service - Issue Schemas
================================================================
File: services/lkms105-issues/app/schemas/issue.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Pydantic schemas for Issue validation and serialization.

  Role-based create schemas:
    - user_basic: Minimal fields (title, description, type, 1 screenshot)
    - user_standard: Basic fields (+ severity, optional attachments)
    - user_advance: Full fields (+ category, developer data, logs)
================================================================
"""

from pydantic import BaseModel, Field, UUID4, field_validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.models.enums import (
    IssueType,
    IssueSeverity,
    IssueCategory,
    IssueStatus,
    IssuePriority,
)


# ============================================================
# CREATE SCHEMAS (Role-Based)
# ============================================================

class IssueCreateUserBasic(BaseModel):
    """
    Schema for creating Issue - user_basic role.

    All fields available, basic user fills only: title, description, type.
    Other fields will be null if not provided.
    """
    title: str = Field(..., min_length=5, max_length=200, description="Issue title/summary")
    description: str = Field(..., min_length=10, description="Issue description")
    type: IssueType = Field(..., description="Issue type: bug, feature, improvement, question")

    severity: Optional[IssueSeverity] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None
    error_message: Optional[str] = None
    error_type: Optional[str] = Field(None, max_length=100)
    system_info: Optional[Dict[str, Any]] = None
    attachments: Optional[List[Dict[str, Any]]] = Field(None, max_length=5)


class IssueCreateUserStandard(BaseModel):
    """
    Schema for creating Issue - user_standard role.

    All fields available, standard user fills: title, description, type, severity, attachments.
    Other fields will be null if not provided.
    """
    title: str = Field(..., min_length=5, max_length=200, description="Issue title/summary")
    description: str = Field(..., min_length=10, description="Issue description")
    type: IssueType = Field(..., description="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION")

    severity: Optional[IssueSeverity] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None
    error_message: Optional[str] = None
    error_type: Optional[str] = Field(None, max_length=100)
    system_info: Optional[Dict[str, Any]] = None
    attachments: Optional[List[Dict[str, Any]]] = Field(None, max_length=5)


class IssueCreateUserAdvance(BaseModel):
    """
    Schema for creating Issue - user_advance role.

    All fields available, advance user can fill all.
    Other fields will be null if not provided.
    """
    title: str = Field(..., min_length=5, max_length=200, description="Issue title/summary")
    description: str = Field(..., min_length=10, description="Issue description")
    type: IssueType = Field(..., description="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION")

    severity: Optional[IssueSeverity] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None
    error_message: Optional[str] = None
    error_type: Optional[str] = Field(None, max_length=100)
    system_info: Optional[Dict[str, Any]] = None
    attachments: Optional[List[Dict[str, Any]]] = Field(None, max_length=5)


class IssueCreateSystem(BaseModel):
    """
    Schema for programmatic issue creation (system-generated).

    Used by: Data integrity handlers, automated monitoring, cron jobs.
    Requires: X-Permission-Level: 100 (Super Admin)

    Key differences from user schemas:
    - Accepts JSON body (not Form data)
    - reporter_id can be set directly (e.g., SYSTEM_USER_ID)
    - No file attachments (system issues are text-only)
    """
    title: str = Field(..., min_length=5, max_length=200, description="Issue title/summary")
    description: str = Field(..., min_length=10, description="Issue description")
    type: IssueType = Field(..., description="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION")

    severity: Optional[IssueSeverity] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None
    reporter_id: Optional[UUID4] = Field(None, description="Reporter UUID (SYSTEM_USER for auto-generated)")
    error_message: Optional[str] = None
    error_type: Optional[str] = Field(None, max_length=100)
    system_info: Optional[Dict[str, Any]] = Field(None, description="Metadata about auto-generation")


# ============================================================
# UPDATE SCHEMA
# ============================================================

class IssueUpdate(BaseModel):
    """Schema for updating existing Issue.

    NOTE: status field added for Admin-level direct editing (v1.1.0).
    NOTE: issue_code added for Super Admin editing (v1.2.0).
    Permission check in endpoint validates field access by permission level.

    IMMUTABLE FIELDS (not in this schema):
    - id: Primary key, NEVER editable (foreign key integrity)
    """

    # Business identifier (Super Admin only - level 100)
    issue_code: Optional[str] = Field(
        None,
        min_length=5,
        max_length=20,
        description="User-visible code (e.g., BUG-2511-0042). Super Admin only!"
    )

    title: Optional[str] = Field(
        None,
        min_length=5,
        max_length=200
    )
    description: Optional[str] = Field(
        None,
        min_length=10
    )
    type: Optional[IssueType] = None
    severity: Optional[IssueSeverity] = None
    status: Optional[IssueStatus] = None  # Admin-only via permission check
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None

    # Developer fields
    error_message: Optional[str] = None
    error_type: Optional[str] = None

    # System info
    system_info: Optional[Dict[str, Any]] = None

    # People (can be updated via PUT with appropriate permissions)
    reporter_id: Optional[UUID4] = Field(
        None,
        description="UUID of reporter (Super Admin only - level 100)"
    )
    assignee_id: Optional[UUID4] = Field(
        None,
        description="UUID of assignee (Admin lvl 2+ - level 70)"
    )

    # Timestamps (Super Admin only - level 100)
    created_at: Optional[datetime] = Field(
        None,
        description="Creation timestamp (Super Admin only)"
    )
    updated_at: Optional[datetime] = Field(
        None,
        description="Last update timestamp (Super Admin only)"
    )
    resolved_at: Optional[datetime] = Field(
        None,
        description="Resolution timestamp (Super Admin only)"
    )
    closed_at: Optional[datetime] = Field(
        None,
        description="Closure timestamp (Super Admin only)"
    )


# ============================================================
# ACTION SCHEMAS
# ============================================================

class IssueAssign(BaseModel):
    """Schema for assigning Issue to developer."""

    assignee_id: UUID4 = Field(
        ...,
        description="UUID of assignee (from Contact service)"
    )


class IssueResolve(BaseModel):
    """Schema for resolving Issue."""

    resolution: str = Field(
        ...,
        min_length=10,
        description="Resolution description"
    )


class IssueClose(BaseModel):
    """Schema for closing Issue."""

    comment: Optional[str] = Field(
        None,
        description="Optional closure comment"
    )


# ============================================================
# RESPONSE SCHEMA
# ============================================================

class IssueResponse(BaseModel):
    """Schema for Issue response (includes all database fields)."""

    # IDs
    id: UUID4
    issue_code: str

    # Core fields
    title: str
    description: str
    type: IssueType
    severity: IssueSeverity
    category: Optional[IssueCategory] = None

    # Status & workflow
    status: IssueStatus
    priority: IssuePriority

    # People
    reporter_id: UUID4
    assignee_id: Optional[UUID4] = None

    # Resolution
    resolution: Optional[str] = None

    # Developer fields
    error_message: Optional[str] = None
    error_type: Optional[str] = None

    # System info
    system_info: Optional[Dict[str, Any]] = None

    # Attachments
    attachments: Optional[List[Dict[str, Any]]] = None

    # Timestamps
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None

    # Soft delete
    deleted_at: Optional[datetime] = None

    # Deletion audit
    deletion_audit_id: Optional[int] = Field(
        None,
        description="Link to deletion_audit record if hard delete failed (partial status)"
    )

    # Locking (name not stored - frontend does lookup by ID)
    locked_by_id: Optional[UUID4] = Field(
        None,
        description="UUID of user who holds the lock (null = unlocked)"
    )
    locked_at: Optional[datetime] = Field(
        None,
        description="Timestamp when lock was acquired"
    )

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


# ============================================================
# BULK ATTACHMENT DELETE SCHEMAS
# ============================================================

class BulkAttachmentDeleteRequest(BaseModel):
    """Request schema for bulk attachment deletion."""
    filenames: List[str] = Field(
        ...,
        min_length=1,
        max_length=20,
        description="List of filenames to delete (max 20)"
    )


class AttachmentDeleteResult(BaseModel):
    """Result for a single attachment deletion."""
    filename: str = Field(..., description="Filename that was processed")
    status: str = Field(
        ...,
        description="Result status: 'deleted', 'not_found_db', 'not_found_minio', 'error'"
    )
    error: Optional[str] = Field(None, description="Error message if status is 'error'")


class BulkAttachmentDeleteResponse(BaseModel):
    """Response schema for bulk attachment deletion."""
    total: int = Field(..., description="Total files requested for deletion")
    deleted: int = Field(..., description="Successfully deleted count")
    not_found_db: int = Field(..., description="Files not found in database metadata")
    not_found_minio: int = Field(..., description="Files found in DB but not in MinIO (orphaned records)")
    errors: int = Field(..., description="Files that failed to delete due to errors")
    results: List[AttachmentDeleteResult] = Field(..., description="Detailed results per file")


# ============================================================
# LOCKING SCHEMAS
# ============================================================

class LockRequest(BaseModel):
    """
    Request schema for acquiring a lock.

    Lock is acquired when user opens an edit modal.
    Only user_id is needed - name lookup is done by frontend.
    """
    user_id: UUID4 = Field(..., description="UUID of the user requesting the lock")


class LockResponse(BaseModel):
    """
    Response schema for lock operations.

    Returns success status and lock info for conflict handling.
    """
    success: bool = Field(..., description="Whether the lock was acquired/released")
    locked_by: Optional[Dict[str, Any]] = Field(
        None,
        description="Info about who holds the lock (if locked by someone else)"
    )


class LockInfo(BaseModel):
    """
    Schema for lock information in conflict responses.

    Returned when lock is held by another user (HTTP 409 Conflict).
    Note: name is NOT included - frontend does lookup by ID.
    """
    id: Optional[str] = Field(None, description="UUID of user who holds the lock")
    locked_at: Optional[str] = Field(None, description="ISO timestamp when lock was acquired")


class IssueExportRequest(BaseModel):
    """
    Schema for bulk export request.

    Request body for POST /issues/export endpoint.
    Format is specified as query parameter (?format=csv|json|zip).
    """
    issue_ids: List[str] = Field(..., description="List of issue IDs to export")
    skip_attachments: bool = Field(False, description="Skip attachments in ZIP export (ignored for csv/json)")

    class Config:
        json_schema_extra = {
            "example": {
                "issue_ids": ["uuid-1", "uuid-2", "uuid-3"],
                "skip_attachments": False
            }
        }
