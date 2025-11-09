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
    BUG = "BUG"
    FEATURE = "FEATURE"
    IMPROVEMENT = "IMPROVEMENT"
    QUESTION = "QUESTION"


class IssueSeverity(str, Enum):
    """
    Issue severity level.

    Values:
        MINOR: Low impact, cosmetic issues
        MODERATE: Medium impact, workaround exists
        MAJOR: High impact, affects functionality
        BLOCKER: Critical, blocks workflow
    """
    MINOR = "MINOR"
    MODERATE = "MODERATE"
    MAJOR = "MAJOR"
    BLOCKER = "BLOCKER"


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
    """
    UI = "UI"
    BACKEND = "BACKEND"
    DATABASE = "DATABASE"
    INTEGRATION = "INTEGRATION"
    DOCS = "DOCS"
    PERFORMANCE = "PERFORMANCE"
    SECURITY = "SECURITY"


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
    OPEN = "OPEN"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REJECTED = "REJECTED"


class IssuePriority(str, Enum):
    """
    Issue priority level.

    Values:
        LOW: Can wait, nice to have
        MEDIUM: Normal priority
        HIGH: Should be fixed soon
        CRITICAL: Must be fixed immediately
    """
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
