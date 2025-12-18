"""
================================================================
{{SERVICE_NAME}} - Enums
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/models/enums.py
Version: v1.0.0
Created: 2025-12-16
Updated: 2025-12-16
Description:
  Enum definitions for {{MODEL_NAME}} entity.
  Customize these enums based on your service requirements.

  Usage:
    from app.models.enums import {{MODEL_NAME}}Type, {{MODEL_NAME}}Status, {{MODEL_NAME}}Priority
================================================================
"""

from enum import Enum


class {{MODEL_NAME}}Type(str, Enum):
    """
    Entity type classification.

    Used for:
    - Human-readable code prefix selection
    - Filtering and categorization
    - Business logic branching

    Customize values per service:
    - Issues: BUG, FEATURE, IMPROVEMENT, QUESTION
    - Orders: SALES_ORDER, PURCHASE_ORDER, QUOTE
    - Invoices: INVOICE, CREDIT_NOTE, PROFORMA

    Example:
        item.type = {{MODEL_NAME}}Type.TYPE_A
    """
    TYPE_A = "type_a"
    TYPE_B = "type_b"
    TYPE_C = "type_c"


class {{MODEL_NAME}}Status(str, Enum):
    """
    Entity lifecycle status.

    State Machine:
        OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
                          \\-> REJECTED

    Transitions:
    - OPEN: Initial state after creation
    - IN_PROGRESS: Work has started
    - RESOLVED: Work completed, pending verification
    - CLOSED: Final state (verified complete)
    - REJECTED: Declined or cancelled

    Example:
        item.status = {{MODEL_NAME}}Status.IN_PROGRESS
    """
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"


class {{MODEL_NAME}}Priority(str, Enum):
    """
    Priority levels for ordering and urgency.

    Levels:
    - LOW: Can wait, no deadline pressure
    - MEDIUM: Normal priority (default)
    - HIGH: Important, should be addressed soon
    - CRITICAL: Urgent, requires immediate attention

    Example:
        item.priority = {{MODEL_NAME}}Priority.HIGH
    """
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ================================================================
# TYPE TO CODE PREFIX MAPPING
# ================================================================
# Used by code_generator.py to determine human-readable code prefix
#
# Customize this mapping per service:
#   Issues: {"bug": "BUG", "feature": "FEA", ...}
#   Orders: {"sales_order": "SO", "purchase_order": "PO", ...}
#   Invoices: {"invoice": "INV", "credit_note": "CN", ...}

TYPE_CODE_PREFIXES = {
    {{MODEL_NAME}}Type.TYPE_A: "TYA",
    {{MODEL_NAME}}Type.TYPE_B: "TYB",
    {{MODEL_NAME}}Type.TYPE_C: "TYC",
}
