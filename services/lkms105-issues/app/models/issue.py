"""
================================================================
Issues Service - Issue Model
================================================================
File: services/lkms105-issues/app/models/issue.py
Version: v1.0.0
Created: 2025-11-08
Description:
  SQLAlchemy model for enterprise ticketing system.

  ID Systems:
    - id (UUID): Internal primary key for database relations
    - issue_code (String): User-visible code (TYP-RRMM-NNNN)
      Examples: BUG-2511-0042, FEAT-2512-0123
================================================================
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base
from app.models.enums import (
    IssueType,
    IssueSeverity,
    IssueCategory,
    IssueStatus,
    IssuePriority,
)


class Issue(Base):
    """
    Issue entity for enterprise ticketing system.

    Supports 3-tier role system:
    - BASIC_USER: Minimal fields (title, description, type, 1 screenshot)
    - USER: Basic fields (+ severity, optional attachments)
    - PROGRAMMER: Full fields (+ category, developer data, logs)
    """
    __tablename__ = "issues"

    # ============================================================
    # ID SYSTEMS
    # ============================================================

    # 1) UUID - Internal primary key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="Internal UUID primary key"
    )

    # 2) issue_code - User-visible identifier
    issue_code = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True,
        comment="User-visible code: TYP-RRMM-NNNN (e.g., BUG-2511-0042)"
    )

    # ============================================================
    # CORE FIELDS (All Roles)
    # ============================================================

    title = Column(
        String(200),
        nullable=False,
        index=True,
        comment="Issue title/summary"
    )

    description = Column(
        Text,
        nullable=False,
        comment="Issue description"
    )

    type = Column(
        SQLEnum(IssueType, name="issue_type"),
        nullable=False,
        index=True,
        comment="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION"
    )

    # ============================================================
    # BASIC FIELDS (USER + PROGRAMMER)
    # ============================================================

    severity = Column(
        SQLEnum(IssueSeverity, name="issue_severity"),
        nullable=False,
        index=True,
        comment="Severity: MINOR, MODERATE, MAJOR, BLOCKER"
    )

    # ============================================================
    # ADVANCED FIELDS (PROGRAMMER Only)
    # ============================================================

    category = Column(
        SQLEnum(IssueCategory, name="issue_category"),
        nullable=True,
        index=True,
        comment="Category: UI, BACKEND, DATABASE, INTEGRATION, DOCS, PERFORMANCE, SECURITY"
    )

    # ============================================================
    # STATUS & WORKFLOW
    # ============================================================

    status = Column(
        SQLEnum(IssueStatus, name="issue_status"),
        default=IssueStatus.OPEN,
        nullable=False,
        index=True,
        comment="Status: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED"
    )

    priority = Column(
        SQLEnum(IssuePriority, name="issue_priority"),
        default=IssuePriority.MEDIUM,
        nullable=False,
        index=True,
        comment="Priority: LOW, MEDIUM, HIGH, CRITICAL"
    )

    # ============================================================
    # PEOPLE (Future: FK to Contact Service)
    # ============================================================

    reporter_id = Column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
        comment="Reporter UUID (future FK to Contact service)"
    )

    assignee_id = Column(
        UUID(as_uuid=True),
        nullable=True,
        index=True,
        comment="Assignee UUID (future FK to Contact service)"
    )

    # ============================================================
    # RESOLUTION
    # ============================================================

    resolution = Column(
        Text,
        nullable=True,
        comment="Resolution description"
    )

    # ============================================================
    # DEVELOPER FIELDS (PROGRAMMER Role Only)
    # ============================================================

    error_message = Column(
        Text,
        nullable=True,
        comment="Error message from logs"
    )

    error_type = Column(
        String(100),
        nullable=True,
        comment="Error type/exception class"
    )

    browser = Column(
        String(100),
        nullable=True,
        comment="Browser name and version"
    )

    os = Column(
        String(100),
        nullable=True,
        comment="Operating system"
    )

    url = Column(
        String(500),
        nullable=True,
        comment="URL where issue occurred"
    )

    # ============================================================
    # ATTACHMENTS
    # ============================================================

    attachments = Column(
        JSON,
        nullable=True,
        comment="Array of file metadata: [{filename, size, mime_type, uploaded_at}]"
    )

    # ============================================================
    # TIMESTAMPS
    # ============================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Creation timestamp"
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
        comment="Last update timestamp"
    )

    resolved_at = Column(
        DateTime,
        nullable=True,
        comment="Resolution timestamp"
    )

    closed_at = Column(
        DateTime,
        nullable=True,
        comment="Closure timestamp"
    )

    # ============================================================
    # SOFT DELETE
    # ============================================================

    is_deleted = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
        comment="Soft delete flag"
    )

    def __repr__(self):
        return f"<Issue {self.issue_code}: {self.title}>"
