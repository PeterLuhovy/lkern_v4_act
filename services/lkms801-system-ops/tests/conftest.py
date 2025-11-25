"""
================================================================
FILE: conftest.py
PATH: /services/lkms801-system-ops/tests/conftest.py
DESCRIPTION: Pytest configuration and shared fixtures
VERSION: v1.0.0
UPDATED: 2025-11-23 14:40:00
================================================================
"""

# === IMPORTS ===
import pytest
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))


# === PYTEST CONFIGURATION ===
def pytest_configure(config):
    """Pytest configuration hook."""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
