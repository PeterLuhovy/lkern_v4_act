"""
================================================================
Issues Service - Enum Types
================================================================
File: services/lkms105-issues/app/models/enums.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Enum types for Issue classification and status management.
================================================================
"""

from enum import Enum


class IssueType(str, Enum):
    """
    Issue type classification.

    Values:
        BUG: Software defect or error
        FEATURE: New feature request
        IMPROVEMENT: Enhancement to existing feature
        QUESTION: User question or clarification
    """
    BUG = "bug"
    FEATURE = "feature"
    IMPROVEMENT = "improvement"
    QUESTION = "question"


class IssueSeverity(str, Enum):
    """
    Issue severity level.

    Values:
        MINOR: Low impact, cosmetic issues
        MODERATE: Medium impact, workaround exists
        MAJOR: High impact, affects functionality
        BLOCKER: Critical, blocks workflow
    """
    MINOR = "minor"
    MODERATE = "moderate"
    MAJOR = "major"
    BLOCKER = "blocker"


class IssueCategory(str, Enum):
    """
    Issue category for technical classification.

    Values:
        UI: User interface issues
        BACKEND: Backend/API issues
        DATABASE: Database-related issues
        INTEGRATION: Third-party integration issues
        DOCS: Documentation issues
        PERFORMANCE: Performance optimization
        SECURITY: Security vulnerabilities
        DATA_INTEGRITY: Auto-generated data integrity issues (orphaned files, mismatches)
    """
    UI = "ui"
    BACKEND = "backend"
    DATABASE = "database"
    INTEGRATION = "integration"
    DOCS = "docs"
    PERFORMANCE = "performance"
    SECURITY = "security"
    DATA_INTEGRITY = "data_integrity"


class IssueStatus(str, Enum):
    """
    Issue status lifecycle.

    State Machine:
        OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
                      ↓
                  REJECTED

    Values:
        OPEN: New issue, not assigned
        ASSIGNED: Assigned to developer
        IN_PROGRESS: Work in progress
        RESOLVED: Fixed, awaiting verification
        CLOSED: Verified and closed
        REJECTED: Rejected (not a bug, won't fix, etc.)
    """
    OPEN = "open"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"


class IssuePriority(str, Enum):
    """
    Issue priority level.

    Values:
        LOW: Can wait, nice to have
        MEDIUM: Normal priority
        HIGH: Should be fixed soon
        CRITICAL: Must be fixed immediately
    """
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
