"""
================================================================
Issues Service - Database Configuration
================================================================
File: services/lkms105-issues/app/database.py
Version: v1.1.0
Created: 2025-11-08
Updated: 2025-11-30
Description:
  SQLAlchemy database engine, session management, and base model.
Changelog:
  v1.1.0 - Added resilient connection pool settings (pool_recycle, pool_size, etc.)
================================================================
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy engine with resilient connection pool
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # Verify connections before using (auto-reconnect)
    pool_recycle=300,        # Recycle connections every 5 minutes
    pool_size=5,             # Number of persistent connections
    max_overflow=10,         # Max additional connections when pool is exhausted
    pool_timeout=30,         # Timeout waiting for connection from pool
    echo=settings.DEBUG,     # Log SQL queries in debug mode
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI to get database session.

    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db_safe() -> Generator[Session, None, None]:
    """
    Safe database dependency that returns 503 if DB is unavailable.

    This prevents stack traces when database is down.
    Use this for API endpoints that require database access.

    IMPORTANT: Only catches connection-related exceptions during initial check.
    Business logic exceptions (UniqueViolation, etc.) are NOT caught here
    and will propagate to the endpoint handler normally.
    """
    from fastapi import HTTPException, status
    from sqlalchemy import text
    from sqlalchemy.exc import OperationalError, InterfaceError, DatabaseError

    # Check if DB is available (set by main.py startup)
    try:
        from app.main import is_db_available
        if not is_db_available():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database service unavailable. Please try again later."
            )
    except ImportError:
        # If main not loaded yet, try connection directly
        pass

    db = SessionLocal()
    try:
        # Quick connection test - only catch connection errors here
        db.execute(text("SELECT 1"))
    except (OperationalError, InterfaceError, DatabaseError) as e:
        db.close()
        logger.warning(f"Database connection failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable. Please try again later."
        )
    except Exception as e:
        # Log unexpected errors during connection check but don't hide them
        db.close()
        logger.error(f"Unexpected error during DB connection check: {e}")
        raise

    # Yield session - business logic exceptions will propagate normally
    try:
        yield db
    finally:
        db.close()


def init_db(max_retries: int = 5, retry_delay: float = 2.0) -> bool:
    """
    Initialize database (create tables) with retry logic.
    Called on application startup.

    Args:
        max_retries: Maximum number of connection attempts (default: 5)
        retry_delay: Delay between retries in seconds (default: 2.0)

    Returns:
        True if database initialized successfully, False otherwise
    """
    import time

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Initializing database (attempt {attempt}/{max_retries})...")
            Base.metadata.create_all(bind=engine)
            logger.info("Database initialized successfully")
            return True
        except Exception as e:
            logger.warning(f"Database connection failed (attempt {attempt}/{max_retries}): {e}")
            if attempt < max_retries:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                # Exponential backoff
                retry_delay = min(retry_delay * 1.5, 30.0)
            else:
                logger.error(f"Database initialization failed after {max_retries} attempts")
                return False

    return False
