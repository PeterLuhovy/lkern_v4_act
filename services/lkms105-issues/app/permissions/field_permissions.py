"""
================================================================
FILE: field_permissions.py
PATH: /services/lkms105-issues/app/permissions/field_permissions.py
DESCRIPTION: Field-level permission system for Issues
VERSION: v1.0.0
CREATED: 2025-11-29

Backend field permissions - mirrors frontend issueFieldPermissions.ts
CRITICAL: This is the security layer - frontend can be bypassed!
================================================================
"""

from typing import Dict, List, Optional, Set
from dataclasses import dataclass
from enum import Enum


class FieldAccess(Enum):
    """Field access levels"""
    HIDDEN = "hidden"      # User cannot see the field
    READONLY = "readonly"  # User can see but not edit
    EDITABLE = "editable"  # User can see and edit


@dataclass
class FieldPermission:
    """Single field permission definition"""
    field: str
    view_level: int        # 0-100, minimum level to VIEW
    edit_level: Optional[int]  # 0-100, minimum level to EDIT (None = never editable)


# ============================================================
# ISSUE FIELD PERMISSIONS
# Mirrors: packages/config/src/permissions/issueFieldPermissions.ts
# ============================================================

ISSUE_FIELD_PERMISSIONS: List[FieldPermission] = [
    # === IDENTIFIERS ===
    # id: Always visible (needed for frontend logic), NEVER editable
    FieldPermission(field="id", view_level=0, edit_level=None),
    # issue_code: Visible to all, Super Admin only can edit
    FieldPermission(field="issue_code", view_level=1, edit_level=100),

    # === BASIC FIELDS (viewable by all, Admin lvl 2+ (70+) can edit) ===
    FieldPermission(field="title", view_level=1, edit_level=70),
    FieldPermission(field="description", view_level=1, edit_level=30),
    FieldPermission(field="type", view_level=1, edit_level=100),  # Super Admin only
    FieldPermission(field="priority", view_level=1, edit_level=70),
    FieldPermission(field="category", view_level=1, edit_level=70),

    # === SEVERITY (Admin lvl 2+ (70+) can edit) ===
    FieldPermission(field="severity", view_level=1, edit_level=70),

    # === STATUS (Super Admin only) ===
    FieldPermission(field="status", view_level=1, edit_level=100),  # Super Admin only

    # === PEOPLE FIELDS ===
    FieldPermission(field="reporter_id", view_level=60, edit_level=None),  # System field
    FieldPermission(field="assignee_id", view_level=30, edit_level=70),  # Admin lvl 2+ (70+) can assign

    # === RESOLUTION ===
    FieldPermission(field="resolution", view_level=1, edit_level=70),  # Everyone sees, Admin lvl 2+ (70+) edits

    # === DEVELOPER/TECHNICAL FIELDS (sensitive) ===
    FieldPermission(field="error_type", view_level=60, edit_level=70),  # Admin lvl 2+ (70+) can edit
    FieldPermission(field="error_message", view_level=60, edit_level=70),  # Admin lvl 2+ (70+) can edit
    FieldPermission(field="system_info", view_level=60, edit_level=80),  # Admin lvl 3 (80+) can edit

    # === ATTACHMENTS ===
    FieldPermission(field="attachments", view_level=30, edit_level=70),  # Admin lvl 2+ (70+) can manage

    # === TIMESTAMPS (readonly for all) ===
    FieldPermission(field="created_at", view_level=1, edit_level=None),
    FieldPermission(field="updated_at", view_level=1, edit_level=None),
    FieldPermission(field="resolved_at", view_level=1, edit_level=None),  # Everyone sees
    FieldPermission(field="closed_at", view_level=1, edit_level=None),    # Everyone sees
    FieldPermission(field="deleted_at", view_level=60, edit_level=None),  # Admin+ only
]


# Build lookup dict for O(1) access
_FIELD_PERMISSIONS_MAP: Dict[str, FieldPermission] = {
    fp.field: fp for fp in ISSUE_FIELD_PERMISSIONS
}


def get_field_permission(field: str) -> Optional[FieldPermission]:
    """Get permission config for a field"""
    return _FIELD_PERMISSIONS_MAP.get(field)


def can_view_field(field: str, user_level: int) -> bool:
    """Check if user can view this field"""
    perm = get_field_permission(field)
    if not perm:
        return True  # Unknown field - allow (might be computed field)
    return user_level >= perm.view_level


def can_edit_field(field: str, user_level: int) -> bool:
    """Check if user can edit this field"""
    perm = get_field_permission(field)
    if not perm:
        return False  # Unknown field - deny edit
    if perm.edit_level is None:
        return False  # Field is never editable
    return user_level >= perm.edit_level


def get_viewable_fields(user_level: int) -> Set[str]:
    """Get set of field names user can view"""
    return {fp.field for fp in ISSUE_FIELD_PERMISSIONS if user_level >= fp.view_level}


def get_editable_fields(user_level: int) -> Set[str]:
    """Get set of field names user can edit"""
    return {
        fp.field for fp in ISSUE_FIELD_PERMISSIONS
        if fp.edit_level is not None and user_level >= fp.edit_level
    }


def filter_issue_response(issue_dict: dict, user_level: int) -> dict:
    """
    Filter issue response - remove fields user cannot view.

    CRITICAL: Call this before returning any issue data!

    Args:
        issue_dict: Issue data as dict
        user_level: User's permission level (0-100)

    Returns:
        Filtered dict with only viewable fields
    """
    viewable = get_viewable_fields(user_level)

    # Always include basic identifiers
    always_include = {"id", "issue_code"}

    return {
        key: value
        for key, value in issue_dict.items()
        if key in viewable or key in always_include
    }


def validate_update_fields(update_dict: dict, user_level: int) -> List[str]:
    """
    Validate that user can edit all fields in update request.

    CRITICAL: Call this before applying any update!

    Args:
        update_dict: Fields user wants to update
        user_level: User's permission level (0-100)

    Returns:
        List of forbidden field names (empty = all OK)
    """
    editable = get_editable_fields(user_level)
    forbidden = []

    for field in update_dict.keys():
        if field not in editable:
            forbidden.append(field)

    return forbidden


# ============================================================
# FRONTEND PERMISSION LEVEL MAPPING
# ============================================================
# Frontend uses simple levels 1, 2, 3
# Backend uses 0-100 scale for fine-grained control
#
# Mapping:
#   Level 1 (Basic): user_level = 25
#     - ID: hidden (blurred on frontend)
#     - All other fields: visible, not editable
#   Level 2 (Standard): user_level = 50
#     - All fields visible
#     - ID/Code/Type/Status: not editable
#     - Other fields: editable
#   Level 3 (Admin): user_level = 100
#     - All fields visible and editable

PERMISSION_LEVEL_MAP = {
    1: 25,   # Basic
    2: 50,   # Standard
    3: 100,  # Admin
}


def map_frontend_permission_level(frontend_level: int) -> int:
    """
    Convert frontend permission level (1, 2, 3) to backend level (0-100).

    Args:
        frontend_level: 1 (Basic), 2 (Standard), or 3 (Admin)

    Returns:
        Backend permission level (25, 50, or 100)
    """
    return PERMISSION_LEVEL_MAP.get(frontend_level, 25)  # Default to Basic


def can_view_field_by_frontend_level(field: str, permission_level: int) -> bool:
    """
    Check if user can view field based on permission level (0-100 scale).

    Uses ISSUE_FIELD_PERMISSIONS view_level checks.

    Special cases:
    - id: view_level=70 (Admin lvl 2+ can see)
    - All other fields use their configured view_level
    """
    return can_view_field(field, permission_level)


def can_edit_field_by_frontend_level(field: str, permission_level: int) -> bool:
    """
    Check if user can edit field based on permission level (0-100 scale).

    Uses ISSUE_FIELD_PERMISSIONS for edit_level checks.

    IMMUTABLE FIELD (NEVER editable, even by Super Admin):
    - id: Primary key, foreign key integrity would break

    SUPER ADMIN (level 100):
    - Can edit issue_code, type, status (business identifiers)
    - Can edit all other fields

    Permission ranges (edit_level from ISSUE_FIELD_PERMISSIONS):
    - 0-29 (Basic): Nothing editable (view only)
    - 30-59 (Standard): description editable
    - 60-99 (Admin): title, severity, priority, category, etc.
    - 100 (Super Admin): type, status, issue_code
    """
    # ID is NEVER editable - even by Super Admin (foreign key integrity)
    if field == 'id':
        return False

    # SUPER ADMIN (level 100) - bypass all other restrictions
    if permission_level >= 100:
        return True

    # Use permission check from ISSUE_FIELD_PERMISSIONS
    return can_edit_field(field, permission_level)


def filter_issue_response_by_frontend_level(issue_dict: dict, permission_level: int) -> dict:
    """
    Filter issue response based on permission level (0-100 scale).

    Field visibility based on view_level from ISSUE_FIELD_PERMISSIONS:
    - Fields user CAN view: return actual value
    - Fields user CANNOT view: return null (for debug + frontend can show 🔒)

    This approach:
    - Keeps consistent response structure (always same fields)
    - Frontend can detect restricted fields and show placeholder/blur
    - Easier debugging (see which fields are restricted)

    Args:
        issue_dict: Issue data as dict
        permission_level: Permission level (0-100)

    Returns:
        Dict with all fields - viewable have values, restricted have null
    """
    result = {}

    for key, value in issue_dict.items():
        if can_view_field_by_frontend_level(key, permission_level):
            # User has permission to view this field
            result[key] = value
        else:
            # User cannot view - return null (frontend shows 🔒 or blur)
            result[key] = None

    # Always include issue_code for identification (it's the public-facing ID)
    if 'issue_code' in issue_dict:
        result['issue_code'] = issue_dict['issue_code']

    return result


def validate_update_fields_by_frontend_level(update_dict: dict, permission_level: int) -> List[str]:
    """
    Validate that user can edit all fields based on permission level (0-100 scale).

    Args:
        update_dict: Fields user wants to update
        permission_level: Permission level (0-100)

    Returns:
        List of forbidden field names (empty = all OK)
    """
    forbidden = []

    for field in update_dict.keys():
        if not can_edit_field_by_frontend_level(field, permission_level):
            forbidden.append(field)

    return forbidden


# ============================================================
# TODO: Integration with Auth
# ============================================================
#
# When JWT auth is implemented:
#
# 1. Create dependency to get user level from token:
#    async def get_user_level(token: str = Depends(oauth2_scheme)) -> int:
#        payload = decode_jwt(token)
#        return payload.get("permission_level", 0)
#
# 2. In list_issues/get_issue endpoints:
#    user_level = await get_user_level(token)
#    issues = [filter_issue_response(i.to_dict(), user_level) for i in issues]
#
# 3. In update_issue endpoint:
#    user_level = await get_user_level(token)
#    forbidden = validate_update_fields(update_dict, user_level)
#    if forbidden:
#        raise HTTPException(403, f"Cannot edit fields: {forbidden}")
#
