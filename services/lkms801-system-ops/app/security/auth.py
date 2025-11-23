"""
================================================================
FILE: auth.py
PATH: /services/lkms801-system-ops/app/security/auth.py
DESCRIPTION: Security validation (API key, path whitelist)
VERSION: v1.0.0
UPDATED: 2025-11-23 12:00:00
================================================================
"""

# === IMPORTS ===
import logging
from pathlib import Path
from typing import List
import grpc

from app.config import settings

# === LOGGING ===
logger = logging.getLogger(__name__)


# === AUTHENTICATION ===
def validate_api_key(api_key: str) -> bool:
    """
    Validate API key.

    Args:
        api_key: API key from request metadata

    Returns:
        True if valid, False otherwise
    """
    is_valid = api_key == settings.API_KEY

    if not is_valid:
        logger.warning(f"Invalid API key attempt: {api_key[:10]}...")

    return is_valid


def validate_path(path: str) -> bool:
    """
    Validate path is within allowed paths (security whitelist).

    Args:
        path: File or folder path to validate

    Returns:
        True if path is allowed, False otherwise
    """
    try:
        # Normalize path
        normalized_path = Path(path).resolve()

        # Check against whitelist
        for allowed_path in settings.ALLOWED_PATHS:
            allowed_normalized = Path(allowed_path).resolve()
            try:
                # Check if path is within allowed directory
                normalized_path.relative_to(allowed_normalized)
                return True
            except ValueError:
                # Not within this allowed path, try next
                continue

        # Path not in any allowed location
        logger.warning(f"Access denied to path: {path}")
        return False

    except Exception as e:
        logger.error(f"Path validation error for '{path}': {str(e)}")
        return False


def check_auth(context: grpc.ServicerContext) -> bool:
    """
    Check gRPC request authentication.

    Args:
        context: gRPC context with metadata

    Returns:
        True if authenticated, False otherwise (sets error in context)
    """
    # Get metadata
    metadata = dict(context.invocation_metadata())
    api_key = metadata.get("api-key", "")

    # Validate API key
    if not validate_api_key(api_key):
        context.set_code(grpc.StatusCode.UNAUTHENTICATED)
        context.set_details("Invalid API key")
        return False

    return True
