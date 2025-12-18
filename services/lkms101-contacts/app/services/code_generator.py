"""
================================================================
FILE: code_generator.py
PATH: /services/lkms101-contacts/app/services/code_generator.py
DESCRIPTION: Human-readable contact code generator (CON-RRMM-NNNN)
VERSION: v2.0.0
UPDATED: 2025-12-18
================================================================

Format: CON-RRMM-NNNN
  CON: Contact prefix (lowercase: con)
  RR: Year (25 = 2025)
  MM: Month (01-12)
  NNNN: Sequential number (0001-9999)

Example: con-2512-0001 (December 2025, #1)
"""

from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
import logging

from app.models import Contact

logger = logging.getLogger(__name__)

# Contact code prefix (lowercase)
CONTACT_CODE_PREFIX = "con"


def generate_contact_code(db: Session) -> str:
    """
    Generate human-readable contact code: con-RRMM-NNNN

    Args:
        db: Database session

    Returns:
        str: Generated code (e.g., "con-2512-0001")
    """
    now = datetime.utcnow()
    year_month = now.strftime("%y%m")  # e.g., "2512" for Dec 2025
    code_pattern = f"{CONTACT_CODE_PREFIX}-{year_month}-%"

    # Get max sequence for this month
    max_code = db.query(func.max(Contact.contact_code))\
        .filter(Contact.contact_code.like(code_pattern))\
        .scalar()

    if max_code:
        try:
            current_seq = int(max_code.split("-")[-1])
            next_seq = current_seq + 1
        except (ValueError, IndexError):
            logger.warning(f"Invalid code format found: {max_code}, starting from 1")
            next_seq = 1
    else:
        next_seq = 1

    generated_code = f"{CONTACT_CODE_PREFIX}-{year_month}-{next_seq:04d}"
    logger.info(f"Generated contact code: {generated_code}")

    return generated_code


def parse_contact_code(code: str) -> dict:
    """
    Parse contact code into components.

    Args:
        code: Contact code string (e.g., "con-2512-0042")

    Returns:
        dict: Parsed components
    """
    parts = code.split("-")

    if len(parts) != 3:
        raise ValueError(f"Invalid code format: {code}. Expected PREFIX-RRMM-NNNN")

    prefix = parts[0]
    year_month = parts[1]
    sequence_str = parts[2]

    year = 2000 + int(year_month[:2])
    month = int(year_month[2:])
    sequence = int(sequence_str)

    return {
        "prefix": prefix,
        "year": year,
        "month": month,
        "sequence": sequence,
        "year_month": year_month,
    }
