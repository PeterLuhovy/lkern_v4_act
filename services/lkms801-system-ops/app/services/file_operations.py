"""
================================================================
FILE: file_operations.py
PATH: /services/lkms801-system-ops/app/services/file_operations.py
DESCRIPTION: File system operations (copy, move, delete, open, list)
VERSION: v1.0.0
UPDATED: 2025-11-23 12:00:00
================================================================
"""

# === IMPORTS ===
import os
import shutil
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

from app.security.auth import validate_path

# === LOGGING ===
logger = logging.getLogger(__name__)


# === FILE OPERATIONS ===
def open_folder(folder_path: str) -> Tuple[bool, str]:
    """
    Open folder in Windows Explorer.

    Args:
        folder_path: Path to folder

    Returns:
        (success, message) tuple
    """
    try:
        # Validate path
        if not validate_path(folder_path):
            return False, f"Access denied: {folder_path} is not in allowed paths"

        # Check if folder exists
        if not os.path.isdir(folder_path):
            return False, f"Folder not found: {folder_path}"

        # Open in Explorer (Windows-specific)
        os.startfile(folder_path)

        logger.info(f"Opened folder: {folder_path}")
        return True, f"Folder opened: {folder_path}"

    except Exception as e:
        logger.error(f"Error opening folder '{folder_path}': {str(e)}")
        return False, f"Error opening folder: {str(e)}"


def copy_file(source_path: str, destination_path: str) -> Tuple[bool, str]:
    """
    Copy file or folder.

    Args:
        source_path: Source file/folder path
        destination_path: Destination path

    Returns:
        (success, message) tuple
    """
    try:
        # Validate paths
        if not validate_path(source_path):
            return False, f"Access denied: {source_path} is not in allowed paths"

        if not validate_path(destination_path):
            return False, f"Access denied: {destination_path} is not in allowed paths"

        # Check if source exists
        if not os.path.exists(source_path):
            return False, f"Source not found: {source_path}"

        # Copy file or directory
        if os.path.isfile(source_path):
            shutil.copy2(source_path, destination_path)
            logger.info(f"Copied file: {source_path} → {destination_path}")
            return True, f"File copied: {source_path} → {destination_path}"
        elif os.path.isdir(source_path):
            shutil.copytree(source_path, destination_path)
            logger.info(f"Copied folder: {source_path} → {destination_path}")
            return True, f"Folder copied: {source_path} → {destination_path}"
        else:
            return False, f"Invalid source: {source_path}"

    except Exception as e:
        logger.error(f"Error copying '{source_path}' to '{destination_path}': {str(e)}")
        return False, f"Error copying: {str(e)}"


def move_file(source_path: str, destination_path: str) -> Tuple[bool, str]:
    """
    Move file or folder.

    Args:
        source_path: Source file/folder path
        destination_path: Destination path

    Returns:
        (success, message) tuple
    """
    try:
        # Validate paths
        if not validate_path(source_path):
            return False, f"Access denied: {source_path} is not in allowed paths"

        if not validate_path(destination_path):
            return False, f"Access denied: {destination_path} is not in allowed paths"

        # Check if source exists
        if not os.path.exists(source_path):
            return False, f"Source not found: {source_path}"

        # Move file or directory
        shutil.move(source_path, destination_path)

        logger.info(f"Moved: {source_path} → {destination_path}")
        return True, f"Moved: {source_path} → {destination_path}"

    except Exception as e:
        logger.error(f"Error moving '{source_path}' to '{destination_path}': {str(e)}")
        return False, f"Error moving: {str(e)}"


def delete_file(file_path: str) -> Tuple[bool, str]:
    """
    Delete file or folder.

    Args:
        file_path: Path to file/folder to delete

    Returns:
        (success, message) tuple
    """
    try:
        # Validate path
        if not validate_path(file_path):
            return False, f"Access denied: {file_path} is not in allowed paths"

        # Check if exists
        if not os.path.exists(file_path):
            return False, f"Not found: {file_path}"

        # Delete file or directory
        if os.path.isfile(file_path):
            os.remove(file_path)
            logger.warning(f"Deleted file: {file_path}")
            return True, f"File deleted: {file_path}"
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
            logger.warning(f"Deleted folder: {file_path}")
            return True, f"Folder deleted: {file_path}"
        else:
            return False, f"Invalid path: {file_path}"

    except Exception as e:
        logger.error(f"Error deleting '{file_path}': {str(e)}")
        return False, f"Error deleting: {str(e)}"


def rename_file(old_path: str, new_path: str) -> Tuple[bool, str]:
    """
    Rename file or folder.

    Args:
        old_path: Current path
        new_path: New path

    Returns:
        (success, message) tuple
    """
    try:
        # Validate paths
        if not validate_path(old_path):
            return False, f"Access denied: {old_path} is not in allowed paths"

        if not validate_path(new_path):
            return False, f"Access denied: {new_path} is not in allowed paths"

        # Check if source exists
        if not os.path.exists(old_path):
            return False, f"Not found: {old_path}"

        # Rename
        os.rename(old_path, new_path)

        logger.info(f"Renamed: {old_path} → {new_path}")
        return True, f"Renamed: {old_path} → {new_path}"

    except Exception as e:
        logger.error(f"Error renaming '{old_path}' to '{new_path}': {str(e)}")
        return False, f"Error renaming: {str(e)}"


def list_folder(folder_path: str, include_hidden: bool = False) -> Tuple[bool, List[Dict], str]:
    """
    List folder contents.

    Args:
        folder_path: Path to folder
        include_hidden: Include hidden files/folders

    Returns:
        (success, files_list, error_message) tuple
    """
    try:
        # Validate path
        if not validate_path(folder_path):
            return False, [], f"Access denied: {folder_path} is not in allowed paths"

        # Check if folder exists
        if not os.path.isdir(folder_path):
            return False, [], f"Folder not found: {folder_path}"

        # List contents
        files = []
        for entry in os.scandir(folder_path):
            # Skip hidden files if not requested
            if not include_hidden and entry.name.startswith('.'):
                continue

            # Get file info
            stat = entry.stat()
            files.append({
                'path': entry.path,
                'name': entry.name,
                'size_bytes': stat.st_size,
                'modified_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'is_directory': entry.is_dir()
            })

        logger.info(f"Listed folder: {folder_path} ({len(files)} items)")
        return True, files, ""

    except Exception as e:
        logger.error(f"Error listing folder '{folder_path}': {str(e)}")
        return False, [], f"Error listing folder: {str(e)}"


def get_file_info(file_path: str) -> Tuple[bool, Dict, str]:
    """
    Get file/folder information.

    Args:
        file_path: Path to file/folder

    Returns:
        (success, info_dict, error_message) tuple
    """
    try:
        # Validate path
        if not validate_path(file_path):
            return False, {}, f"Access denied: {file_path} is not in allowed paths"

        # Check if exists
        if not os.path.exists(file_path):
            return False, {}, f"Not found: {file_path}"

        # Get info
        stat = os.stat(file_path)
        info = {
            'path': file_path,
            'size_bytes': stat.st_size,
            'modified_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'is_directory': os.path.isdir(file_path)
        }

        logger.info(f"Got file info: {file_path}")
        return True, info, ""

    except Exception as e:
        logger.error(f"Error getting info for '{file_path}': {str(e)}")
        return False, {}, f"Error getting file info: {str(e)}"
