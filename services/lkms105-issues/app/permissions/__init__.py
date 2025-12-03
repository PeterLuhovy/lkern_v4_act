"""
================================================================
FILE: __init__.py
PATH: /services/lkms105-issues/app/permissions/__init__.py
DESCRIPTION: Permissions module exports
VERSION: v1.0.0
CREATED: 2025-11-29
================================================================
"""

from .field_permissions import (
    FieldAccess,
    FieldPermission,
    ISSUE_FIELD_PERMISSIONS,
    get_field_permission,
    can_view_field,
    can_edit_field,
    get_viewable_fields,
    get_editable_fields,
    filter_issue_response,
    validate_update_fields,
    # Frontend permission level functions
    PERMISSION_LEVEL_MAP,
    map_frontend_permission_level,
    can_view_field_by_frontend_level,
    can_edit_field_by_frontend_level,
    filter_issue_response_by_frontend_level,
    validate_update_fields_by_frontend_level,
)

__all__ = [
    "FieldAccess",
    "FieldPermission",
    "ISSUE_FIELD_PERMISSIONS",
    "get_field_permission",
    "can_view_field",
    "can_edit_field",
    "get_viewable_fields",
    "get_editable_fields",
    "filter_issue_response",
    "validate_update_fields",
    # Frontend permission level functions
    "PERMISSION_LEVEL_MAP",
    "map_frontend_permission_level",
    "can_view_field_by_frontend_level",
    "can_edit_field_by_frontend_level",
    "filter_issue_response_by_frontend_level",
    "validate_update_fields_by_frontend_level",
]
