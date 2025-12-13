"""
================================================================
{{SERVICE_NAME}} - Lock Cleanup Job
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/jobs/lock_cleanup.py
Version: v1.0.0
Created: 2025-12-07
Description:
  Background job that periodically cleans up expired/forgotten locks.
  Runs every 5 minutes to remove locks older than LOCK_TIMEOUT_MINUTES.
================================================================
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy import text

from app.database import SessionLocal
from app.config import settings

logger = logging.getLogger(__name__)

# Global flag to control the cleanup task
_cleanup_task_running = False


async def cleanup_expired_locks() -> int:
    """
    Remove expired locks from the database.

    Locks expire after LOCK_TIMEOUT_MINUTES (default: 30 minutes).
    This handles cases where users close their browser without
    properly releasing the lock (closing modal).

    Returns:
        Number of expired locks that were cleaned up.
    """
    db = SessionLocal()

    try:
        # Calculate expiry threshold
        expiry_threshold = datetime.now(timezone.utc) - timedelta(
            minutes=settings.LOCK_TIMEOUT_MINUTES
        )

        # Clean expired locks from the main table
        # Note: Replace {{TABLE_NAME}} with actual table name when generating service
        result = db.execute(
            text("""
                UPDATE {{TABLE_NAME}}
                SET locked_by_id = NULL,
                    locked_by_name = NULL,
                    locked_at = NULL
                WHERE locked_at IS NOT NULL
                  AND locked_at < :expiry_threshold
            """),
            {"expiry_threshold": expiry_threshold}
        )

        cleaned_count = result.rowcount
        db.commit()

        if cleaned_count > 0:
            logger.info(
                f"Lock cleanup: Removed {cleaned_count} expired lock(s) "
                f"(older than {settings.LOCK_TIMEOUT_MINUTES} minutes)"
            )

        return cleaned_count

    except Exception as e:
        logger.error(f"Lock cleanup failed: {e}")
        db.rollback()
        return 0

    finally:
        db.close()


async def start_lock_cleanup_task(interval_seconds: int = 300) -> None:
    """
    Start the background lock cleanup task.

    This runs indefinitely, cleaning up expired locks every `interval_seconds`.
    Default interval is 300 seconds (5 minutes).

    Args:
        interval_seconds: How often to run cleanup (default: 300 = 5 minutes)
    """
    global _cleanup_task_running

    if _cleanup_task_running:
        logger.warning("Lock cleanup task is already running")
        return

    _cleanup_task_running = True
    logger.info(
        f"Lock cleanup task started (interval: {interval_seconds}s, "
        f"timeout: {settings.LOCK_TIMEOUT_MINUTES}min)"
    )

    while _cleanup_task_running:
        try:
            # Wait for the interval
            await asyncio.sleep(interval_seconds)

            # Run cleanup
            await cleanup_expired_locks()

        except asyncio.CancelledError:
            logger.info("Lock cleanup task cancelled")
            break
        except Exception as e:
            logger.error(f"Lock cleanup task error: {e}")
            # Continue running despite errors

    _cleanup_task_running = False
    logger.info("Lock cleanup task stopped")


def stop_lock_cleanup_task() -> None:
    """
    Stop the background lock cleanup task.
    """
    global _cleanup_task_running
    _cleanup_task_running = False
