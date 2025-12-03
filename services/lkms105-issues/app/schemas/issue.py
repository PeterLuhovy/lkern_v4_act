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

    # People (assignee can be updated via PUT)
    assignee_id: Optional[UUID4] = Field(
        None,
        description="UUID of assignee (from Contact service)"
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

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)
