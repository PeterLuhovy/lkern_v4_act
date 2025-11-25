"""
================================================================
Issues Service - Issue Business Logic
================================================================
File: services/lkms105-issues/app/services/issue_service.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Business logic for Issue operations.

  Key functions:
  - generate_issue_code(): Generate user-visible issue code (TYP-RRMM-NNNN)
  - validate_status_transition(): Validate status state machine
================================================================
"""

from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Issue, IssueType, IssueStatus


# ============================================================
# ISSUE CODE GENERATION
# ============================================================

def generate_issue_code(db: Session, issue_type: IssueType) -> str:
    """
    Generate unique issue_code: TYP-RRMM-NNNN.

    Format:
    - TYP: Issue type prefix (BUG, FEA, IMP, QUE) - always 3 letters
    - RRMM: Year-Month (e.g., 2511 = November 2025)
    - NNNN: Sequential number per type per month (0001, 0002, ...)

    Examples:
    - BUG-2511-0001  (first bug in November 2025)
    - FEA-2511-0042 (42nd feature in November 2025)
    - IMP-2512-0003 (3rd improvement in December 2025)

    Args:
        db: SQLAlchemy session
        issue_type: Issue type enum

    Returns:
        Unique issue_code string
    """
    # Get current year-month
    now = datetime.utcnow()
    year_month = now.strftime("%y%m")  # "2511" for November 2025

    # Type prefix mapping (always 3 letters)
    type_prefix = {
        IssueType.BUG: "BUG",
        IssueType.FEATURE: "FEA",
        IssueType.IMPROVEMENT: "IMP",
        IssueType.QUESTION: "QUE",
    }
    prefix = type_prefix[issue_type]

    # Find max sequential number for this type in current month
    # Pattern: "BUG-2511-%"
    pattern = f"{prefix}-{year_month}-%"
    existing_issues = db.query(Issue.issue_code).filter(
        Issue.issue_code.like(pattern),
        Issue.deleted_at.is_(None)  # Only count non-deleted issues
    ).all()

    # Extract sequential numbers and find max
    max_num = 0
    for (code,) in existing_issues:
        # Extract last 4 digits from code (e.g., "BUG-2511-0042" → 42)
        try:
            seq_num = int(code.split('-')[-1])
            if seq_num > max_num:
                max_num = seq_num
        except (ValueError, IndexError):
            continue

    # Generate code with next sequential number
    issue_code = f"{prefix}-{year_month}-{max_num + 1:04d}"

    return issue_code


# ============================================================
# STATUS VALIDATION
# ============================================================

def validate_status_transition(
    current_status: IssueStatus,
    new_status: IssueStatus
) -> bool:
    """
    Validate status transition according to state machine.

    State Machine:
        OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
                      ↓
                  REJECTED

    Allowed transitions:
    - OPEN → ASSIGNED, REJECTED
    - ASSIGNED → IN_PROGRESS, OPEN, REJECTED
    - IN_PROGRESS → RESOLVED, ASSIGNED, REJECTED
    - RESOLVED → CLOSED, IN_PROGRESS
    - CLOSED → (terminal state, no transitions)
    - REJECTED → (terminal state, no transitions)

    Args:
        current_status: Current issue status
        new_status: Target status

    Returns:
        True if transition is valid, False otherwise
    """
    # Define allowed transitions
    transitions = {
        IssueStatus.OPEN: [IssueStatus.ASSIGNED, IssueStatus.REJECTED],
        IssueStatus.ASSIGNED: [IssueStatus.IN_PROGRESS, IssueStatus.OPEN, IssueStatus.REJECTED],
        IssueStatus.IN_PROGRESS: [IssueStatus.RESOLVED, IssueStatus.ASSIGNED, IssueStatus.REJECTED],
        IssueStatus.RESOLVED: [IssueStatus.CLOSED, IssueStatus.IN_PROGRESS],
        IssueStatus.CLOSED: [],  # Terminal state
        IssueStatus.REJECTED: [],  # Terminal state
    }

    # Allow staying in same status
    if current_status == new_status:
        return True

    # Check if transition is allowed
    allowed = transitions.get(current_status, [])
    return new_status in allowed
