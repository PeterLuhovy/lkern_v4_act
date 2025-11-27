"""
================================================================
Issues Service - Cleanup REST API
================================================================
File: services/lkms105-issues/app/api/rest/cleanup.py
Version: v1.0.0
Created: 2025-11-27
Description:
  Cleanup service endpoints for retrying failed/pending deletions.

  Pattern: "Eventual Deletion" with retry mechanism.
  - Items marked for deletion (deletion_audit_id set)
  - Cleanup service retries when external storage available
  - Each retry attempt is logged in audit record

  Endpoints:
  - GET /cleanup/pending - List all pending deletions
  - POST /cleanup/retry - Retry all pending deletions
  - POST /cleanup/retry/{audit_id} - Retry specific deletion
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from app.database import get_db
from app.models import Issue, DeletionAudit, DeletionStatus
from app.schemas import DeletionAuditResponse
from app.services.minio_client import minio_client, MinIOConnectionError
from app.events.producer import publish_event

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/cleanup", tags=["Cleanup"])


# ============================================================
# LIST PENDING DELETIONS
# ============================================================

@router.get("/pending", response_model=List[DeletionAuditResponse])
async def list_pending_deletions(
    db: Session = Depends(get_db),
):
    """
    List all pending deletion audits (items waiting for cleanup).

    Returns audit records with status=PENDING that need to be retried.
    Used by cleanup service or admin dashboard.
    """
    pending_audits = db.query(DeletionAudit).filter(
        DeletionAudit.status == DeletionStatus.PENDING
    ).order_by(DeletionAudit.started_at.asc()).all()

    logger.info(f"Found {len(pending_audits)} pending deletions")
    return pending_audits


# ============================================================
# RETRY ALL PENDING DELETIONS
# ============================================================

@router.post("/retry")
async def retry_all_pending_deletions(
    db: Session = Depends(get_db),
):
    """
    Retry all pending deletions.

    Called by cleanup service (cron job or manual trigger).
    Processes each pending audit and attempts to delete files from MinIO.

    Returns:
        Summary of retry results (succeeded, failed, skipped)
    """
    pending_audits = db.query(DeletionAudit).filter(
        DeletionAudit.status == DeletionStatus.PENDING
    ).all()

    if not pending_audits:
        logger.info("No pending deletions to retry")
        return {
            "message": "No pending deletions",
            "processed": 0,
            "succeeded": 0,
            "failed": 0
        }

    logger.info(f"Starting cleanup retry for {len(pending_audits)} pending deletions")

    results = {
        "processed": 0,
        "succeeded": 0,
        "failed": 0,
        "details": []
    }

    for audit in pending_audits:
        result = await _retry_single_deletion(audit, db)
        results["processed"] += 1
        if result["success"]:
            results["succeeded"] += 1
        else:
            results["failed"] += 1
        results["details"].append(result)

    logger.info(f"Cleanup retry complete: {results['succeeded']} succeeded, {results['failed']} failed")

    return {
        "message": f"Processed {results['processed']} pending deletions",
        **results
    }


# ============================================================
# RETRY SINGLE DELETION
# ============================================================

@router.post("/retry/{audit_id}")
async def retry_single_deletion(
    audit_id: int,
    db: Session = Depends(get_db),
):
    """
    Retry a specific pending deletion by audit ID.

    Args:
        audit_id: DeletionAudit record ID

    Returns:
        Result of retry attempt
    """
    audit = db.query(DeletionAudit).filter(DeletionAudit.id == audit_id).first()

    if not audit:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Deletion audit {audit_id} not found"
        )

    if audit.status != DeletionStatus.PENDING:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail=f"Audit {audit_id} is not pending (status={audit.status.value})"
        )

    result = await _retry_single_deletion(audit, db)

    if result["success"]:
        return {
            "message": f"Successfully deleted {audit.item_code}",
            **result
        }
    else:
        return {
            "message": f"Retry failed for {audit.item_code}",
            **result
        }


# ============================================================
# HELPER: Retry single deletion logic
# ============================================================

async def _retry_single_deletion(audit: DeletionAudit, db: Session) -> dict:
    """
    Internal helper to retry a single pending deletion.

    Logic:
    1. Find linked issue (by item_id)
    2. Try to list files from MinIO
    3. If MinIO available: delete files, then delete issue from DB
    4. Update audit record with result

    Returns:
        Dict with success status, files deleted, and any error message
    """
    result = {
        "audit_id": audit.id,
        "item_code": audit.item_code,
        "success": False,
        "files_deleted": 0,
        "error": None,
        "retry_count": audit.retry_count + 1
    }

    # Update retry tracking
    audit.retry_count += 1
    audit.last_retry_at = datetime.utcnow()
    db.commit()

    logger.info(f"Retry #{audit.retry_count} for {audit.item_code} (audit_id={audit.id})")

    # Find the issue
    issue = db.query(Issue).filter(Issue.id == audit.item_id).first()

    if not issue:
        # Issue already deleted (shouldn't happen, but handle gracefully)
        audit.status = DeletionStatus.COMPLETED
        audit.completed_at = datetime.utcnow()
        audit.error_message = "Issue already deleted from database"
        db.commit()

        result["success"] = True
        result["error"] = "Issue already deleted"
        logger.warning(f"Issue {audit.item_code} not found in DB - marking as completed")
        return result

    try:
        # Try to list and delete files from MinIO
        folder_prefix = f"{issue.id}/"
        files = minio_client.list_files(prefix=folder_prefix)
        audit.files_found = len(files)

        # Delete each file
        deleted_count = 0
        files_failed = []

        for file_name in files:
            try:
                success = minio_client.delete_file(file_name)
                if success:
                    deleted_count += 1
                else:
                    files_failed.append({
                        "file_name": file_name,
                        "error": "delete_file returned False"
                    })
            except MinIOConnectionError:
                # Still unavailable - re-raise
                raise
            except Exception as e:
                files_failed.append({
                    "file_name": file_name,
                    "error": str(e)
                })

        audit.files_deleted = deleted_count
        result["files_deleted"] = deleted_count

        # Check if all files deleted
        if files_failed:
            audit.status = DeletionStatus.PARTIAL
            audit.files_failed = files_failed
            audit.error_message = f"Retry #{audit.retry_count}: {len(files_failed)} files failed"
            audit.completed_at = datetime.utcnow()
            db.commit()

            result["error"] = f"{len(files_failed)} files failed to delete"
            logger.error(f"Partial deletion on retry for {audit.item_code}")
            return result

        # All files deleted - now delete from database
        issue_code = issue.issue_code
        db.delete(issue)

        # Update audit to completed
        audit.status = DeletionStatus.COMPLETED
        audit.completed_at = datetime.utcnow()
        audit.error_message = f"Completed on retry #{audit.retry_count}"
        db.commit()

        # Publish event
        await publish_event("issue.permanently_deleted", {
            "id": str(audit.item_id),
            "issue_code": issue_code,
            "files_deleted": deleted_count,
            "audit_id": audit.id,
            "retry_count": audit.retry_count
        })

        result["success"] = True
        logger.info(f"Successfully deleted {issue_code} on retry #{audit.retry_count}")
        return result

    except MinIOConnectionError as e:
        # Still unavailable - keep as pending
        audit.error_message = f"Retry #{audit.retry_count} failed: MinIO unavailable - {str(e)}"
        db.commit()

        result["error"] = "MinIO still unavailable"
        logger.warning(f"MinIO still unavailable for {audit.item_code} on retry #{audit.retry_count}")
        return result

    except Exception as e:
        # Unexpected error
        audit.error_message = f"Retry #{audit.retry_count} failed: {str(e)}"
        db.commit()

        result["error"] = str(e)
        logger.error(f"Unexpected error on retry for {audit.item_code}: {str(e)}")
        return result
