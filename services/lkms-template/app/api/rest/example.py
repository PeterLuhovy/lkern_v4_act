"""
================================================================
{{SERVICE_NAME}} - Example REST API
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/api/rest/example.py
Version: v1.0.0
Created: 2025-11-08
Description:
  FastAPI router for {{MODEL_NAME}} CRUD operations.
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import {{MODEL_NAME}}
from app.schemas import {{MODEL_NAME}}Create, {{MODEL_NAME}}Update, {{MODEL_NAME}}Response
from app.events.producer import publish_event

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/{{ROUTE_PREFIX}}", tags=["{{MODEL_NAME}}"])


@router.get("/", response_model=List[{{MODEL_NAME}}Response])
async def list_{{ROUTE_PREFIX}}(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get list of all {{MODEL_NAME}} entities."""
    items = db.query({{MODEL_NAME}}).offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model={{MODEL_NAME}}Response)
async def get_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Get single {{MODEL_NAME}} by ID."""
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )
    return item


@router.post("/", response_model={{MODEL_NAME}}Response, status_code=status.HTTP_201_CREATED)
async def create_{{ROUTE_SINGULAR}}(
    item_data: {{MODEL_NAME}}Create,
    db: Session = Depends(get_db),
):
    """Create new {{MODEL_NAME}}."""
    item = {{MODEL_NAME}}(**item_data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.created", {"id": item.id, "name": item.name})

    logger.info(f"Created {{MODEL_NAME}} id={item.id}")
    return item


@router.put("/{item_id}", response_model={{MODEL_NAME}}Response)
async def update_{{ROUTE_SINGULAR}}(
    item_id: int,
    item_data: {{MODEL_NAME}}Update,
    db: Session = Depends(get_db),
):
    """Update existing {{MODEL_NAME}}."""
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    # Update only provided fields
    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.updated", {"id": item.id, "name": item.name})

    logger.info(f"Updated {{MODEL_NAME}} id={item.id}")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_{{ROUTE_SINGULAR}}(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Delete {{MODEL_NAME}}."""
    item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{{MODEL_NAME}} with id {item_id} not found",
        )

    db.delete(item)
    db.commit()

    # Publish Kafka event
    await publish_event("{{ROUTE_SINGULAR}}.deleted", {"id": item_id})

    logger.info(f"Deleted {{MODEL_NAME}} id={item_id}")
    return None
