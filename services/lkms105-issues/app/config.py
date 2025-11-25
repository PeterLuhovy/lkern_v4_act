"""
================================================================
Issues Service - Configuration
================================================================
File: services/lkms105-issues/app/config.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Environment configuration for Issues Service microservice.
================================================================
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    All values can be overridden via .env file or environment.
    """

    # Service Information
    SERVICE_NAME: str = "Issues Service"
    SERVICE_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("LKERN_ENVIRONMENT", "development")

    # Server Configuration
    REST_HOST: str = "0.0.0.0"
    REST_PORT: int = 4105  # Changed from 4105 to avoid WSL relay conflict
    GRPC_HOST: str = "0.0.0.0"
    GRPC_PORT: int = 5105

    SERVER_RELOAD: bool = True
    LOG_LEVEL: str = "info"
    DEBUG: bool = True

    # Database Configuration
    DB_HOST: str = "lkms105-issues-db"
    DB_PORT: int = 5432
    DB_NAME: str = "lkern_issues"
    DB_USER: str = "lkern_admin"
    DB_PASSWORD: str = "lkern_dev_password_2024"

    @property
    def DATABASE_URL(self) -> str:
        """Construct PostgreSQL connection URL."""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Kafka Configuration
    KAFKA_BOOTSTRAP_SERVERS: str = "lkms504-kafka:9092"
    KAFKA_TOPIC_PREFIX: str = "issues"

    # MinIO Configuration (S3-compatible object storage)
    MINIO_HOST: str = "lkms105-minio"
    MINIO_PORT: int = 9000
    MINIO_ACCESS_KEY: str = "lkern_admin"
    MINIO_SECRET_KEY: str = "lkern_dev_password_2024"
    MINIO_BUCKET: str = "issues-attachments"
    MINIO_SECURE: bool = False  # Use HTTPS (False for development)

    # CORS Configuration
    CORS_ORIGINS: list[str] = [
        "http://localhost:4201",
        "http://127.0.0.1:4201",
        "http://localhost:3003",
        "http://127.0.0.1:3003",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 0  # Disable CORS cache for development debugging

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
