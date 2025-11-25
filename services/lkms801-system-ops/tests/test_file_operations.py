"""
================================================================
FILE: test_file_operations.py
PATH: /services/lkms801-system-ops/tests/test_file_operations.py
DESCRIPTION: Unit tests for file system operations
VERSION: v1.0.0
UPDATED: 2025-11-23 14:30:00
================================================================
"""

# === IMPORTS ===
import pytest
import os
import shutil
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add parent directory to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.file_operations import (
    open_folder,
    copy_file,
    move_file,
    delete_file,
    rename_file,
    list_folder,
    get_file_info
)


# === FIXTURES ===
@pytest.fixture
def temp_dir():
    """Create temporary directory for tests."""
    temp_path = tempfile.mkdtemp()
    yield temp_path
    # Cleanup
    if os.path.exists(temp_path):
        shutil.rmtree(temp_path)


@pytest.fixture
def test_file(temp_dir):
    """Create a test file."""
    file_path = os.path.join(temp_dir, "test_file.txt")
    with open(file_path, 'w') as f:
        f.write("Test content")
    return file_path


@pytest.fixture
def test_folder(temp_dir):
    """Create a test subfolder with files."""
    folder_path = os.path.join(temp_dir, "test_folder")
    os.makedirs(folder_path)

    # Create some files in folder
    for i in range(3):
        file_path = os.path.join(folder_path, f"file_{i}.txt")
        with open(file_path, 'w') as f:
            f.write(f"Content {i}")

    return folder_path


@pytest.fixture
def mock_validate_path():
    """Mock path validation to allow temp paths."""
    with patch('app.services.file_operations.validate_path') as mock:
        mock.return_value = True
        yield mock


# === TESTS: open_folder ===
class TestOpenFolder:
    """Tests for open_folder function."""

    @patch('app.services.file_operations.os.startfile')
    def test_open_existing_folder_success(self, mock_startfile, temp_dir, mock_validate_path):
        """Test opening existing folder successfully."""
        success, message = open_folder(temp_dir)

        assert success is True
        assert "opened" in message.lower()
        mock_startfile.assert_called_once_with(temp_dir)
        mock_validate_path.assert_called_once_with(temp_dir)

    def test_open_nonexistent_folder_fails(self, mock_validate_path):
        """Test opening nonexistent folder fails."""
        fake_path = "C:\\NonExistent\\Folder"
        success, message = open_folder(fake_path)

        assert success is False
        assert "not found" in message.lower()

    def test_open_folder_path_validation_fails(self):
        """Test opening folder with invalid path fails."""
        with patch('app.services.file_operations.validate_path') as mock:
            mock.return_value = False

            success, message = open_folder("C:\\Windows")

            assert success is False
            assert "access denied" in message.lower()


# === TESTS: copy_file ===
class TestCopyFile:
    """Tests for copy_file function."""

    def test_copy_file_success(self, test_file, temp_dir, mock_validate_path):
        """Test copying file successfully."""
        dest_path = os.path.join(temp_dir, "copied_file.txt")

        success, message = copy_file(test_file, dest_path)

        assert success is True
        assert "copied" in message.lower()
        assert os.path.exists(dest_path)

        # Verify content
        with open(dest_path, 'r') as f:
            assert f.read() == "Test content"

    def test_copy_folder_success(self, test_folder, temp_dir, mock_validate_path):
        """Test copying folder successfully."""
        dest_path = os.path.join(temp_dir, "copied_folder")

        success, message = copy_file(test_folder, dest_path)

        assert success is True
        assert "copied" in message.lower()
        assert os.path.isdir(dest_path)

        # Verify files copied
        assert os.path.exists(os.path.join(dest_path, "file_0.txt"))
        assert os.path.exists(os.path.join(dest_path, "file_1.txt"))

    def test_copy_nonexistent_file_fails(self, temp_dir, mock_validate_path):
        """Test copying nonexistent file fails."""
        source = "C:\\NonExistent\\file.txt"
        dest = os.path.join(temp_dir, "dest.txt")

        success, message = copy_file(source, dest)

        assert success is False
        assert "not found" in message.lower()


# === TESTS: move_file ===
class TestMoveFile:
    """Tests for move_file function."""

    def test_move_file_success(self, test_file, temp_dir, mock_validate_path):
        """Test moving file successfully."""
        dest_path = os.path.join(temp_dir, "moved_file.txt")

        success, message = move_file(test_file, dest_path)

        assert success is True
        assert "moved" in message.lower()
        assert not os.path.exists(test_file)  # Original gone
        assert os.path.exists(dest_path)       # New exists

    def test_move_folder_success(self, test_folder, temp_dir, mock_validate_path):
        """Test moving folder successfully."""
        dest_path = os.path.join(temp_dir, "moved_folder")

        success, message = move_file(test_folder, dest_path)

        assert success is True
        assert not os.path.exists(test_folder)
        assert os.path.isdir(dest_path)


# === TESTS: delete_file ===
class TestDeleteFile:
    """Tests for delete_file function."""

    def test_delete_file_success(self, test_file, mock_validate_path):
        """Test deleting file successfully."""
        assert os.path.exists(test_file)

        success, message = delete_file(test_file)

        assert success is True
        assert "deleted" in message.lower()
        assert not os.path.exists(test_file)

    def test_delete_folder_success(self, test_folder, mock_validate_path):
        """Test deleting folder successfully."""
        assert os.path.exists(test_folder)

        success, message = delete_file(test_folder)

        assert success is True
        assert not os.path.exists(test_folder)

    def test_delete_nonexistent_file_fails(self, mock_validate_path):
        """Test deleting nonexistent file fails."""
        success, message = delete_file("C:\\NonExistent\\file.txt")

        assert success is False
        assert "not found" in message.lower()


# === TESTS: rename_file ===
class TestRenameFile:
    """Tests for rename_file function."""

    def test_rename_file_success(self, test_file, temp_dir, mock_validate_path):
        """Test renaming file successfully."""
        new_path = os.path.join(temp_dir, "renamed_file.txt")

        success, message = rename_file(test_file, new_path)

        assert success is True
        assert "renamed" in message.lower()
        assert not os.path.exists(test_file)
        assert os.path.exists(new_path)

    def test_rename_folder_success(self, test_folder, temp_dir, mock_validate_path):
        """Test renaming folder successfully."""
        new_path = os.path.join(temp_dir, "renamed_folder")

        success, message = rename_file(test_folder, new_path)

        assert success is True
        assert not os.path.exists(test_folder)
        assert os.path.isdir(new_path)


# === TESTS: list_folder ===
class TestListFolder:
    """Tests for list_folder function."""

    def test_list_folder_success(self, test_folder, mock_validate_path):
        """Test listing folder contents successfully."""
        success, files, error = list_folder(test_folder)

        assert success is True
        assert len(files) == 3
        assert all('name' in f for f in files)
        assert all('path' in f for f in files)
        assert all('size_bytes' in f for f in files)
        assert all('is_directory' in f for f in files)

    def test_list_folder_include_hidden(self, temp_dir, mock_validate_path):
        """Test listing folder with hidden files."""
        # Create hidden file
        hidden_file = os.path.join(temp_dir, ".hidden_file")
        with open(hidden_file, 'w') as f:
            f.write("hidden")

        # Test without hidden
        success, files, _ = list_folder(temp_dir, include_hidden=False)
        assert success is True
        assert not any(f['name'].startswith('.') for f in files)

        # Test with hidden
        success, files, _ = list_folder(temp_dir, include_hidden=True)
        assert success is True
        assert any(f['name'] == '.hidden_file' for f in files)

    def test_list_nonexistent_folder_fails(self, mock_validate_path):
        """Test listing nonexistent folder fails."""
        success, files, error = list_folder("C:\\NonExistent")

        assert success is False
        assert len(files) == 0
        assert error


# === TESTS: get_file_info ===
class TestGetFileInfo:
    """Tests for get_file_info function."""

    def test_get_file_info_success(self, test_file, mock_validate_path):
        """Test getting file info successfully."""
        success, info, error = get_file_info(test_file)

        assert success is True
        assert info['path'] == test_file
        assert info['size_bytes'] == 12  # "Test content" = 12 bytes
        assert 'modified_at' in info
        assert info['is_directory'] is False

    def test_get_folder_info_success(self, test_folder, mock_validate_path):
        """Test getting folder info successfully."""
        success, info, error = get_file_info(test_folder)

        assert success is True
        assert info['is_directory'] is True

    def test_get_info_nonexistent_fails(self, mock_validate_path):
        """Test getting info for nonexistent file fails."""
        success, info, error = get_file_info("C:\\NonExistent\\file.txt")

        assert success is False
        assert info == {}
        assert "not found" in error.lower()


# === EDGE CASES ===
class TestEdgeCases:
    """Tests for edge cases and error handling."""

    def test_path_with_spaces(self, temp_dir, mock_validate_path):
        """Test handling paths with spaces."""
        file_with_spaces = os.path.join(temp_dir, "file with spaces.txt")
        with open(file_with_spaces, 'w') as f:
            f.write("content")

        success, info, error = get_file_info(file_with_spaces)
        assert success is True

    def test_unicode_filename(self, temp_dir, mock_validate_path):
        """Test handling unicode filenames."""
        unicode_file = os.path.join(temp_dir, "súbor_š_ť_ž.txt")
        with open(unicode_file, 'w', encoding='utf-8') as f:
            f.write("obsah")

        success, info, error = get_file_info(unicode_file)
        assert success is True
