"""
================================================================
FILE: config.py
PATH: /services/lkms801-system-ops/app/config.py
DESCRIPTION: Configuration settings for system operations service
VERSION: v1.0.0
UPDATED: 2025-11-23 12:00:00
================================================================
"""

# === IMPORTS ===
from pydantic_settings import BaseSettings
from typing import List
import os


# === SETTINGS ===
class Settings(BaseSettings):
    """
    System Operations Service Configuration.

    All settings loaded from environment variables with fallback defaults.
    """

    # === SERVICE INFO ===
    SERVICE_NAME: str = "System Operations Service"
    SERVICE_VERSION: str = "1.0.0"
    SERVICE_CODE: str = "lkms801"

    # === SERVER PORTS ===
    REST_PORT: int = 5801  # FastAPI REST API (health check)
    GRPC_PORT: int = 6801  # gRPC server port
    HOST: str = "0.0.0.0"

    # === SECURITY ===
    API_KEY: str = "lkern_dev_api_key_2024"  # TODO: Change in production!
    ALLOWED_PATHS: List[str] = [
        "L:\\system",
        "L:\\data",
        "C:\\Users\\PeterLuhový",
    ]

    # === LOGGING ===
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # === GRPC SETTINGS ===
    GRPC_MAX_WORKERS: int = 10

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# === SINGLETON INSTANCE ===
settings = Settings()
