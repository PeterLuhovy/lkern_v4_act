"""
================================================================
Issues Service - Configuration API
================================================================
File: services/lkms105-issues/app/api/rest/config.py
Version: v1.0.0
Created: 2025-11-27
Description:
  Runtime configuration endpoints for Issues Service.
  Allows changing log level without restart.
================================================================
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import json
import os

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/config", tags=["Configuration"])

# Runtime config file path (persists between restarts)
CONFIG_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
RUNTIME_CONFIG_FILE = os.path.join(CONFIG_DIR, "runtime_config.json")

# Valid log levels
VALID_LOG_LEVELS = ["debug", "info", "warning", "error", "critical"]


class LogLevelRequest(BaseModel):
    """Request body for setting log level."""
    level: str


class LogLevelResponse(BaseModel):
    """Response with current log level."""
    level: str
    valid_levels: list[str] = VALID_LOG_LEVELS


class ConfigResponse(BaseModel):
    """Full runtime configuration response."""
    log_level: str
    valid_log_levels: list[str] = VALID_LOG_LEVELS


def load_runtime_config() -> dict:
    """Load runtime configuration from file."""
    if os.path.exists(RUNTIME_CONFIG_FILE):
        try:
            with open(RUNTIME_CONFIG_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Failed to load runtime config: {e}")
    return {}


def save_runtime_config(config: dict) -> None:
    """Save runtime configuration to file."""
    try:
        with open(RUNTIME_CONFIG_FILE, "w") as f:
            json.dump(config, f, indent=2)
        logger.info(f"Runtime config saved to {RUNTIME_CONFIG_FILE}")
    except Exception as e:
        logger.error(f"Failed to save runtime config: {e}")
        raise


def get_current_log_level() -> str:
    """Get current log level from root logger."""
    root_logger = logging.getLogger()
    level = root_logger.level
    level_name = logging.getLevelName(level).lower()
    return level_name


def set_log_level(level: str) -> None:
    """Set log level for all loggers at runtime."""
    level_upper = level.upper()
    numeric_level = getattr(logging, level_upper, None)

    if numeric_level is None:
        raise ValueError(f"Invalid log level: {level}")

    # Set root logger level
    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)

    # Also set level for all existing loggers
    for name in logging.root.manager.loggerDict:
        logging.getLogger(name).setLevel(numeric_level)

    logger.info(f"Log level changed to: {level_upper}")


@router.get("/", response_model=ConfigResponse)
async def get_config():
    """
    Get current runtime configuration.

    Returns all configurable runtime settings.
    """
    return ConfigResponse(
        log_level=get_current_log_level()
    )


@router.get("/log-level", response_model=LogLevelResponse)
async def get_log_level():
    """
    Get current log level.

    Returns:
        Current log level and list of valid levels.
    """
    return LogLevelResponse(
        level=get_current_log_level()
    )


@router.put("/log-level", response_model=LogLevelResponse)
async def set_log_level_endpoint(request: LogLevelRequest):
    """
    Set log level at runtime.

    Changes take effect immediately without restart.
    Setting is persisted and will be restored on next startup.

    Valid levels: debug, info, warning, error, critical
    """
    level = request.level.lower()

    if level not in VALID_LOG_LEVELS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid log level: {level}. Valid levels: {VALID_LOG_LEVELS}"
        )

    # Set log level at runtime
    set_log_level(level)

    # Persist to config file
    config = load_runtime_config()
    config["log_level"] = level
    save_runtime_config(config)

    return LogLevelResponse(level=level)


def apply_persisted_config():
    """
    Apply persisted configuration on startup.

    Call this from main.py startup event to restore settings.
    """
    config = load_runtime_config()

    if "log_level" in config:
        level = config["log_level"]
        if level in VALID_LOG_LEVELS:
            set_log_level(level)
            logger.info(f"Restored log level from config: {level}")
