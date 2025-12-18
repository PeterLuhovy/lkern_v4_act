"""
================================================================
Contact Service (MDM) - Configuration
================================================================
File: services/lkms101-contacts/app/config.py
Version: v1.1.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  Environment configuration for Contact Service (MDM) microservice.
  Includes Pessimistic Locking settings.
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
    SERVICE_NAME: str = "Contact Service (MDM)"
    SERVICE_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("LKERN_ENVIRONMENT", "development")

    # Server Configuration
    REST_HOST: str = "0.0.0.0"
    REST_PORT: int = 4101
    GRPC_HOST: str = "0.0.0.0"
    GRPC_PORT: int = 5101

    SERVER_RELOAD: bool = True
    LOG_LEVEL: str = "info"
    DEBUG: bool = True

    # Database Configuration
    DB_HOST: str = "lkms101-contacts-db"
    DB_PORT: int = 5432
    DB_NAME: str = "lkern_contacts"
    DB_USER: str = "lkern_admin"
    DB_PASSWORD: str = "lkern_dev_password_2024"

    @property
    def DATABASE_URL(self) -> str:
        """Construct PostgreSQL connection URL."""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Kafka Configuration
    KAFKA_BOOTSTRAP_SERVERS: str = "lkms504-kafka:9092"
    KAFKA_TOPIC_PREFIX: str = "contacts"

    # CORS Configuration
    CORS_ORIGINS: list[str] = ["http://localhost:4201", "http://127.0.0.1:4201"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 3600

    # Pessimistic Locking Configuration
    LOCK_TIMEOUT_MINUTES: int = 30  # Auto-unlock after 30 minutes of inactivity

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
