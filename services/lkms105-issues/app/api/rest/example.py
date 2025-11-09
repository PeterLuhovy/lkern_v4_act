"""
================================================================
Issues Service - Example REST API
================================================================
File: services/lkms105-issues/app/api/rest/example.py
Version: v1.0.0
Created: 2025-11-08
Description:
  FastAPI router for Issue CRUD operations.
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Issue
from app.schemas import IssueCreate, IssueUpdate, IssueResponse
from app.events.producer import publish_event

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/issues", tags=["Issue"])


@router.get("/", response_model=List[IssueResponse])
async def list_issues(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get list of all Issue entities."""
    items = db.query(Issue).offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model=IssueResponse)
async def get_issue(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Get single Issue by ID."""
    item = db.query(Issue).filter(Issue.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Issue with id {item_id} not found",
        )
    return item


@router.post("/", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
async def create_issue(
    item_data: IssueCreate,
    db: Session = Depends(get_db),
):
    """Create new Issue."""
    item = Issue(**item_data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("issue.created", {"id": item.id, "name": item.name})

    logger.info(f"Created Issue id={item.id}")
    return item


@router.put("/{item_id}", response_model=IssueResponse)
async def update_issue(
    item_id: int,
    item_data: IssueUpdate,
    db: Session = Depends(get_db),
):
    """Update existing Issue."""
    item = db.query(Issue).filter(Issue.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Issue with id {item_id} not found",
        )

    # Update only provided fields
    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("issue.updated", {"id": item.id, "name": item.name})

    logger.info(f"Updated Issue id={item.id}")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_issue(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Delete Issue."""
    item = db.query(Issue).filter(Issue.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Issue with id {item_id} not found",
        )

    db.delete(item)
    db.commit()

    # Publish Kafka event
    await publish_event("issue.deleted", {"id": item_id})

    logger.info(f"Deleted Issue id={item_id}")
    return None
