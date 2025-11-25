"""
================================================================
Issues Service - Seed Data Script
================================================================
File: services/lkms105-issues/app/utils/seed_data.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Seed database with mock Issue data for development and testing.
================================================================
"""

import uuid
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Issue, IssueType, IssueSeverity, IssueCategory, IssueStatus, IssuePriority

logger = logging.getLogger(__name__)


# Mock UUIDs for reporters/assignees (will be replaced with real Contact service UUIDs)
MOCK_REPORTER_1 = uuid.UUID("550e8400-e29b-41d4-a716-446655440010")
MOCK_REPORTER_2 = uuid.UUID("550e8400-e29b-41d4-a716-446655440011")
MOCK_ASSIGNEE_1 = uuid.UUID("550e8400-e29b-41d4-a716-446655440020")
MOCK_ASSIGNEE_2 = uuid.UUID("550e8400-e29b-41d4-a716-446655440021")


def create_mock_issues(db: Session) -> None:
    """Create mock issues for development and testing."""

    # Check if issues already exist
    existing_count = db.query(Issue).count()
    if existing_count > 0:
        logger.info(f"Database already has {existing_count} issues. Skipping seed.")
        return

    logger.info("Seeding database with mock Issues...")

    # Issue 1: BUG - Login button not responding (OPEN)
    issue1 = Issue(
        id=uuid.UUID("550e8400-e29b-41d4-a716-446655440001"),
        issue_code="BUG-2511-0001",
        title="Login button not responding",
        description=(
            "The login button becomes completely unresponsive after a failed login attempt. "
            "Users need to refresh the entire page to attempt login again. This affects approximately 15% of login attempts."
        ),
        type=IssueType.BUG,
        severity=IssueSeverity.MAJOR,
        status=IssueStatus.OPEN,
        priority=IssuePriority.HIGH,
        category=IssueCategory.UI,
        reporter_id=MOCK_REPORTER_1,
        error_message='TypeError: Cannot read property "disabled" of undefined',
        error_type="TypeError",
        browser="Chrome 120.0.6099.109",
        os="Windows 11 Pro",
        url="https://app.example.com/login",
        attachments=[
            {"name": "screenshot-error.png", "size": 245678, "url": "/attachments/screenshot-error.png"},
            {"name": "console-log.txt", "size": 12345, "url": "/attachments/console-log.txt"},
        ],
        created_at=datetime.utcnow() - timedelta(hours=3),
        updated_at=datetime.utcnow() - timedelta(hours=3),
        is_deleted=False,
    )

    # Issue 2: FEATURE - Dark mode support (IN_PROGRESS)
    issue2 = Issue(
        id=uuid.UUID("550e8400-e29b-41d4-a716-446655440002"),
        issue_code="FEA-2511-0001",
        title="Dark mode support for application",
        description=(
            "Users have requested a dark mode option for the application to reduce eye strain during night-time usage. "
            "Should include toggle in settings and persist user preference."
        ),
        type=IssueType.FEATURE,
        severity=IssueSeverity.MINOR,
        status=IssueStatus.IN_PROGRESS,
        priority=IssuePriority.MEDIUM,
        category=IssueCategory.UI,
        reporter_id=MOCK_REPORTER_1,
        assignee_id=MOCK_ASSIGNEE_1,
        created_at=datetime.utcnow() - timedelta(days=2),
        updated_at=datetime.utcnow() - timedelta(hours=1),
        is_deleted=False,
    )

    # Issue 3: BUG - Database timeout (RESOLVED)
    issue3 = Issue(
        id=uuid.UUID("550e8400-e29b-41d4-a716-446655440003"),
        issue_code="BUG-2511-0002",
        title="Database connection timeout after 30 seconds",
        description=(
            "Database queries are timing out after 30 seconds on production server. "
            "This affects large data exports and report generation."
        ),
        type=IssueType.BUG,
        severity=IssueSeverity.BLOCKER,
        status=IssueStatus.RESOLVED,
        priority=IssuePriority.CRITICAL,
        category=IssueCategory.DATABASE,
        reporter_id=MOCK_REPORTER_2,
        assignee_id=MOCK_ASSIGNEE_2,
        resolution=(
            "Increased database connection pool size from 10 to 50 and added query timeout configuration. "
            "Also optimized slow queries with proper indexes."
        ),
        error_message="TimeoutError: Database query exceeded 30 seconds",
        error_type="TimeoutError",
        created_at=datetime.utcnow() - timedelta(days=5),
        updated_at=datetime.utcnow() - timedelta(days=1),
        resolved_at=datetime.utcnow() - timedelta(days=1),
        is_deleted=False,
    )

    # Issue 4: IMPROVEMENT - Performance optimization (ASSIGNED)
    issue4 = Issue(
        id=uuid.UUID("550e8400-e29b-41d4-a716-446655440004"),
        issue_code="IMP-2511-0001",
        title="Optimize API response time for contact list",
        description=(
            "Contact list endpoint takes 3-4 seconds to respond with 1000+ contacts. "
            "Should implement pagination and reduce response time to under 500ms."
        ),
        type=IssueType.IMPROVEMENT,
        severity=IssueSeverity.MODERATE,
        status=IssueStatus.ASSIGNED,
        priority=IssuePriority.MEDIUM,
        category=IssueCategory.PERFORMANCE,
        reporter_id=MOCK_REPORTER_1,
        assignee_id=MOCK_ASSIGNEE_1,
        created_at=datetime.utcnow() - timedelta(days=1),
        updated_at=datetime.utcnow() - timedelta(hours=2),
        is_deleted=False,
    )

    # Issue 5: QUESTION - API documentation (OPEN)
    issue5 = Issue(
        id=uuid.UUID("550e8400-e29b-41d4-a716-446655440005"),
        issue_code="QUE-2511-0001",
        title="How to implement file upload with progress tracking?",
        description=(
            "Need guidance on implementing file upload with progress bar for attachments feature. "
            "Should support multiple files and show individual progress for each file."
        ),
        type=IssueType.QUESTION,
        severity=IssueSeverity.MINOR,
        status=IssueStatus.OPEN,
        priority=IssuePriority.LOW,
        category=IssueCategory.DOCS,
        reporter_id=MOCK_REPORTER_2,
        created_at=datetime.utcnow() - timedelta(hours=6),
        updated_at=datetime.utcnow() - timedelta(hours=6),
        is_deleted=False,
    )

    # Add all issues to session
    db.add_all([issue1, issue2, issue3, issue4, issue5])
    db.commit()

    logger.info("✅ Successfully seeded 5 mock Issues")
    logger.info(f"  - {issue1.issue_code}: {issue1.title}")
    logger.info(f"  - {issue2.issue_code}: {issue2.title}")
    logger.info(f"  - {issue3.issue_code}: {issue3.title}")
    logger.info(f"  - {issue4.issue_code}: {issue4.title}")
    logger.info(f"  - {issue5.issue_code}: {issue5.title}")


def main():
    """Main entry point for seed script."""
    logging.basicConfig(level=logging.INFO)

    db = SessionLocal()
    try:
        create_mock_issues(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
