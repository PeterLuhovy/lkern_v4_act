"""
================================================================
FILE: test_security.py
PATH: /services/lkms801-system-ops/tests/test_security.py
DESCRIPTION: Security tests for API key auth and path validation
VERSION: v1.0.0
UPDATED: 2025-11-23 14:35:00
================================================================
"""

# === IMPORTS ===
import pytest
from unittest.mock import MagicMock
import grpc

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.security.auth import validate_api_key, validate_path, check_auth
from app.config import settings


# === TESTS: validate_api_key ===
class TestValidateApiKey:
    """Tests for API key validation."""

    def test_valid_api_key(self):
        """Test valid API key returns True."""
        assert validate_api_key(settings.API_KEY) is True

    def test_invalid_api_key(self):
        """Test invalid API key returns False."""
        assert validate_api_key("wrong_key") is False

    def test_empty_api_key(self):
        """Test empty API key returns False."""
        assert validate_api_key("") is False

    def test_none_api_key(self):
        """Test None API key returns False."""
        assert validate_api_key(None) is False  # type: ignore


# === TESTS: validate_path ===
class TestValidatePath:
    """Tests for path whitelist validation."""

    def test_allowed_path(self):
        """Test path in allowed list returns True."""
        # Use first allowed path from config
        allowed_path = settings.ALLOWED_PATHS[0]
        test_path = f"{allowed_path}\\test_file.txt"

        assert validate_path(test_path) is True

    def test_subpath_of_allowed(self):
        """Test subpath of allowed directory returns True."""
        allowed_path = settings.ALLOWED_PATHS[0]
        test_path = f"{allowed_path}\\subfolder\\deep\\file.txt"

        assert validate_path(test_path) is True

    def test_disallowed_path(self):
        """Test path NOT in allowed list returns False."""
        disallowed_path = "C:\\Windows\\System32\\file.txt"

        assert validate_path(disallowed_path) is False

    def test_path_traversal_attempt(self):
        """Test path traversal attack is blocked."""
        allowed_path = settings.ALLOWED_PATHS[0]
        # Try to escape allowed path using ../
        malicious_path = f"{allowed_path}\\..\\..\\Windows\\System32\\cmd.exe"

        assert validate_path(malicious_path) is False

    def test_absolute_path_normalization(self):
        """Test paths are normalized to absolute paths."""
        # Use relative path that resolves to allowed location
        allowed_path = settings.ALLOWED_PATHS[0]
        assert validate_path(allowed_path) is True

    def test_empty_path(self):
        """Test empty path returns False."""
        assert validate_path("") is False

    def test_nonexistent_path_validation(self):
        """Test validation works even if path doesn't exist yet."""
        allowed_path = settings.ALLOWED_PATHS[0]
        nonexistent = f"{allowed_path}\\nonexistent\\file.txt"

        # Should be allowed (within whitelist) even if doesn't exist
        assert validate_path(nonexistent) is True


# === TESTS: check_auth (gRPC) ===
class TestCheckAuth:
    """Tests for gRPC authentication check."""

    def test_auth_with_valid_key(self):
        """Test authentication succeeds with valid API key."""
        context = MagicMock()
        context.invocation_metadata.return_value = [
            ('api-key', settings.API_KEY)
        ]

        result = check_auth(context)

        assert result is True
        context.set_code.assert_not_called()
        context.set_details.assert_not_called()

    def test_auth_with_invalid_key(self):
        """Test authentication fails with invalid API key."""
        context = MagicMock()
        context.invocation_metadata.return_value = [
            ('api-key', 'wrong_key')
        ]

        result = check_auth(context)

        assert result is False
        context.set_code.assert_called_once_with(grpc.StatusCode.UNAUTHENTICATED)
        context.set_details.assert_called_once_with("Invalid API key")

    def test_auth_with_missing_key(self):
        """Test authentication fails when API key missing."""
        context = MagicMock()
        context.invocation_metadata.return_value = []

        result = check_auth(context)

        assert result is False
        context.set_code.assert_called_once()
        context.set_details.assert_called_once()

    def test_auth_with_empty_key(self):
        """Test authentication fails with empty API key."""
        context = MagicMock()
        context.invocation_metadata.return_value = [
            ('api-key', '')
        ]

        result = check_auth(context)

        assert result is False


# === INTEGRATION TESTS ===
class TestSecurityIntegration:
    """Integration tests for combined security checks."""

    def test_full_auth_flow(self):
        """Test complete authentication and path validation flow."""
        # 1. Check API key
        assert validate_api_key(settings.API_KEY) is True

        # 2. Check path
        allowed_path = settings.ALLOWED_PATHS[0]
        test_file = f"{allowed_path}\\test.txt"
        assert validate_path(test_file) is True

        # 3. gRPC context check
        context = MagicMock()
        context.invocation_metadata.return_value = [
            ('api-key', settings.API_KEY)
        ]
        assert check_auth(context) is True

    def test_attack_scenarios(self):
        """Test various attack scenarios are blocked."""
        # Scenario 1: Wrong API key + valid path
        assert validate_api_key("hacker_key") is False

        # Scenario 2: Valid API key + disallowed path
        assert validate_path("C:\\Windows\\System32\\cmd.exe") is False

        # Scenario 3: Path traversal
        allowed_path = settings.ALLOWED_PATHS[0]
        malicious = f"{allowed_path}\\..\\..\\..\\etc\\passwd"
        assert validate_path(malicious) is False


# === EDGE CASES ===
class TestSecurityEdgeCases:
    """Edge case tests for security functions."""

    def test_case_sensitive_api_key(self):
        """Test API key is case-sensitive."""
        correct_key = settings.API_KEY
        wrong_case = correct_key.upper() if correct_key.islower() else correct_key.lower()

        if correct_key != wrong_case:
            assert validate_api_key(wrong_case) is False

    def test_whitespace_in_api_key(self):
        """Test API key with leading/trailing whitespace fails."""
        key_with_spaces = f" {settings.API_KEY} "
        assert validate_api_key(key_with_spaces) is False

    def test_path_with_forward_slashes(self):
        """Test paths with forward slashes are handled."""
        allowed_path = settings.ALLOWED_PATHS[0]
        # Convert backslashes to forward slashes
        unix_style_path = allowed_path.replace('\\', '/') + "/file.txt"

        # Should still work (Path normalizes)
        result = validate_path(unix_style_path)
        # May or may not work depending on OS, just test it doesn't crash
        assert isinstance(result, bool)

    def test_very_long_path(self):
        """Test very long path doesn't crash validation."""
        allowed_path = settings.ALLOWED_PATHS[0]
        very_long_path = allowed_path + "\\" + ("subdir\\" * 100) + "file.txt"

        # Should not crash, return True or False
        result = validate_path(very_long_path)
        assert isinstance(result, bool)
