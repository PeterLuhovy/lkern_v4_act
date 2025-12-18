"""
================================================================
{{SERVICE_NAME}} - Human-Readable Code Generator
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/services/code_generator.py
Version: v1.0.0
Created: 2025-12-16
Updated: 2025-12-16
Description:
  Generates human-readable entity codes in PREFIX-RRMM-NNNN format.

  Format:
    PREFIX: 2-4 character type prefix (from TYPE_CODE_PREFIXES)
    RR: Year (25 = 2025)
    MM: Month (01-12)
    NNNN: Sequential number within the month (0001-9999)

  Examples:
    TYA-2512-0001 (Type A, December 2025, #1)
    TYB-2601-0042 (Type B, January 2026, #42)

  Usage:
    from app.services.code_generator import generate_entity_code
    from app.models.enums import {{MODEL_NAME}}Type

    code = generate_entity_code(db, {{MODEL_NAME}}Type.TYPE_A, {{MODEL_NAME}})
    # Returns: "TYA-2512-0001"
================================================================
"""

from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
import logging

from app.models.enums import TYPE_CODE_PREFIXES


logger = logging.getLogger(__name__)


def generate_entity_code(
    db: Session,
    entity_type,
    model_class,
    code_column_name: str = "entity_code"
) -> str:
    """
    Generate human-readable entity code: PREFIX-RRMM-NNNN

    Args:
        db: Database session
        entity_type: Enum value for entity type (e.g., {{MODEL_NAME}}Type.TYPE_A)
        model_class: SQLAlchemy model class
        code_column_name: Name of the code column (default: "entity_code")

    Returns:
        str: Generated code (e.g., "TYA-2512-0042")

    Thread Safety:
        Uses SELECT MAX for sequence - works for single-instance services.
        For high-concurrency multi-instance deployments, consider:
        - Database sequence
        - Distributed ID generator (Snowflake)
        - Optimistic locking with retry

    Example:
        >>> code = generate_entity_code(db, IssueType.BUG, Issue)
        >>> print(code)  # "BUG-2512-0001"
    """
    # Get prefix from type (default: {{CODE_PREFIX}} configured in generator)
    prefix = TYPE_CODE_PREFIXES.get(entity_type, "{{CODE_PREFIX}}")

    # Get year-month suffix (RRMM format)
    now = datetime.utcnow()
    year_month = now.strftime("%y%m")  # e.g., "2512" for Dec 2025

    # Build pattern for LIKE query
    code_pattern = f"{prefix}-{year_month}-%"

    # Get the code column from model
    code_column = getattr(model_class, code_column_name)

    # Get max sequence for this prefix+month
    max_code = db.query(func.max(code_column))\
        .filter(code_column.like(code_pattern))\
        .scalar()

    if max_code:
        # Extract sequence number and increment
        try:
            current_seq = int(max_code.split("-")[-1])
            next_seq = current_seq + 1
        except (ValueError, IndexError):
            logger.warning(f"Invalid code format found: {max_code}, starting from 1")
            next_seq = 1
    else:
        next_seq = 1

    # Format: PREFIX-RRMM-NNNN (4 digit sequence)
    generated_code = f"{prefix}-{year_month}-{next_seq:04d}"

    logger.info(f"Generated entity code: {generated_code}")

    return generated_code


def parse_entity_code(code: str) -> dict:
    """
    Parse entity code into components.

    Args:
        code: Entity code string (e.g., "TYA-2512-0042")

    Returns:
        dict: Parsed components
            {
                "prefix": "TYA",
                "year": 2025,
                "month": 12,
                "sequence": 42,
                "year_month": "2512"
            }

    Raises:
        ValueError: If code format is invalid

    Example:
        >>> info = parse_entity_code("BUG-2512-0042")
        >>> print(info["sequence"])  # 42
    """
    parts = code.split("-")

    if len(parts) != 3:
        raise ValueError(f"Invalid code format: {code}. Expected PREFIX-RRMM-NNNN")

    prefix = parts[0]
    year_month = parts[1]
    sequence_str = parts[2]

    if len(year_month) != 4:
        raise ValueError(f"Invalid year_month format: {year_month}. Expected RRMM (4 digits)")

    try:
        year = 2000 + int(year_month[:2])
        month = int(year_month[2:])
        sequence = int(sequence_str)
    except ValueError as e:
        raise ValueError(f"Invalid numeric values in code: {code}") from e

    if not 1 <= month <= 12:
        raise ValueError(f"Invalid month: {month}. Expected 01-12")

    return {
        "prefix": prefix,
        "year": year,
        "month": month,
        "sequence": sequence,
        "year_month": year_month,
    }


def get_next_sequence_number(
    db: Session,
    model_class,
    prefix: str,
    year_month: str,
    code_column_name: str = "entity_code"
) -> int:
    """
    Get the next sequence number for a given prefix and year_month.

    Useful for displaying "next code will be" in UI.

    Args:
        db: Database session
        model_class: SQLAlchemy model class
        prefix: Code prefix (e.g., "BUG")
        year_month: Year-month string (e.g., "2512")
        code_column_name: Name of the code column

    Returns:
        int: Next sequence number

    Example:
        >>> next_seq = get_next_sequence_number(db, Issue, "BUG", "2512")
        >>> print(f"Next bug code will be: BUG-2512-{next_seq:04d}")
    """
    code_pattern = f"{prefix}-{year_month}-%"
    code_column = getattr(model_class, code_column_name)

    max_code = db.query(func.max(code_column))\
        .filter(code_column.like(code_pattern))\
        .scalar()

    if max_code:
        try:
            current_seq = int(max_code.split("-")[-1])
            return current_seq + 1
        except (ValueError, IndexError):
            return 1
    return 1
