"""
================================================================
Issues Service - Kafka Consumer
================================================================
File: services/lkms105-issues/app/events/consumer.py
Version: v2.1.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  Kafka consumer for async issue creation from external systems.

  Use cases:
  - Production systems (PLC, SCADA, IoT) reporting errors
  - Backend services reporting async errors
  - Any system that needs guaranteed delivery (buffering when Issues service down)

  For frontend/sync use cases, use REST endpoint: POST /issues/system

Changelog:
  v2.1.0 - Clarified use case: Kafka for production/backend async events
  v2.0.0 - Added data integrity event handler for auto-creating Issues
================================================================
"""

from kafka import KafkaConsumer
import json
import logging
import uuid
from typing import Callable, Dict, Any
from datetime import datetime

from app.config import settings
from app.database import SessionLocal
from app.models import Issue, IssueType, IssueSeverity, IssueCategory, IssueStatus, IssuePriority
from app.services.issue_service import generate_issue_code

logger = logging.getLogger(__name__)

# System User ID - matches frontend SYSTEM_USER_ID constant
# Used for auto-generated Issues (data integrity, system events)
SYSTEM_USER_ID = uuid.UUID("00000000-0000-4000-8000-000000000001")


class EventConsumer:
    """
    Kafka event consumer with handler registration.

    Usage:
        consumer = EventConsumer()
        consumer.register("system.data_integrity", handle_data_integrity_event)
        await consumer.start()
    """

    def __init__(self):
        self.handlers: Dict[str, Callable] = {}
        self.consumer: KafkaConsumer | None = None

    def register(self, event_type: str, handler: Callable) -> None:
        """
        Register event handler.

        Args:
            event_type: Full event type (e.g., "system.data_integrity")
            handler: Async function to handle event
        """
        self.handlers[event_type] = handler
        logger.info(f"Registered handler for {event_type}")

    async def start(self) -> None:
        """Start consuming events (runs blocking consumer in thread pool)."""
        import asyncio

        if not self.handlers:
            logger.warning("No event handlers registered, skipping consumer")
            return

        # Subscribe to topics from handlers
        topics = [f"{event_type}" for event_type in self.handlers.keys()]

        try:
            self.consumer = KafkaConsumer(
                *topics,
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS.split(","),
                value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                group_id=f"{settings.SERVICE_NAME}-consumer",
                auto_offset_reset="earliest",
                enable_auto_commit=True,
                consumer_timeout_ms=5000,  # Poll timeout - allows checking for shutdown
            )
            logger.info(f"Kafka consumer started, subscribed to: {topics}")

            # Run blocking consumer in thread pool
            loop = asyncio.get_event_loop()
            while True:
                # Poll for messages with timeout (non-blocking for asyncio)
                messages = await loop.run_in_executor(
                    None, lambda: self.consumer.poll(timeout_ms=1000)
                )
                for topic_partition, msgs in messages.items():
                    for message in msgs:
                        await self._process_message(message)

        except Exception as e:
            logger.error(f"Kafka consumer error: {e}")
            raise
        finally:
            if self.consumer:
                self.consumer.close()

    async def _process_message(self, message: Any) -> None:
        """Process single Kafka message."""
        topic = message.topic
        data = message.value

        handler = self.handlers.get(topic)
        if handler:
            try:
                await handler(data)
                logger.info(f"Processed event from {topic}")
            except Exception as e:
                logger.error(f"Error processing event from {topic}: {e}")
        else:
            logger.warning(f"No handler for topic {topic}")


# ============================================================
# DATA INTEGRITY EVENT HANDLER
# ============================================================

async def handle_data_integrity_event(data: Dict[str, Any]) -> None:
    """
    Handle data integrity events and auto-create Issues.

    Expected event structure:
    {
        "event_type": "data_integrity.orphaned_attachment",
        "source_service": "lkms101-contacts",
        "source_entity": {
            "type": "contact",
            "id": "uuid-here",
            "code": "CON-001"
        },
        "detected_at": "2025-12-07T14:00:00Z",
        "details": {
            "orphaned_files": ["file1.png", "file2.pdf"],
            "expected_location": "minio/contacts/uuid/"
        },
        "issue_data": {
            "title": "Orphaned attachments in Contact CON-001",
            "description": "Found 2 file(s) in database but missing in MinIO...",
            "type": "BUG",
            "severity": "MODERATE",
            "category": "DATA_INTEGRITY",
            "priority": "MEDIUM"
        }
    }

    Args:
        data: Event payload from Kafka
    """
    logger.info(f"Processing data integrity event: {data.get('event_type')}")

    # Validate required fields
    if "issue_data" not in data:
        logger.error("Missing 'issue_data' in event payload")
        return

    issue_data = data["issue_data"]

    # Get database session
    db = SessionLocal()
    try:
        # Parse issue data with defaults (enum values are lowercase)
        issue_type = IssueType(issue_data.get("type", "bug").lower())
        severity = IssueSeverity(issue_data.get("severity", "moderate").lower())
        category = IssueCategory(issue_data.get("category", "data_integrity").lower())
        priority = IssuePriority(issue_data.get("priority", "medium").lower())

        # Generate issue code
        issue_code = generate_issue_code(db, issue_type)

        # Build description with event context
        description = issue_data.get("description", "Auto-generated data integrity issue")
        if "source_service" in data:
            description += f"\n\n---\n**Source Service:** {data['source_service']}"
        if "source_entity" in data:
            entity = data["source_entity"]
            description += f"\n**Entity:** {entity.get('type', 'unknown')} ({entity.get('code', entity.get('id', 'N/A'))})"
        if "detected_at" in data:
            description += f"\n**Detected:** {data['detected_at']}"
        if "details" in data:
            details = data["details"]
            if "orphaned_files" in details:
                description += f"\n**Orphaned Files:** {', '.join(details['orphaned_files'])}"

        # Create Issue
        issue = Issue(
            issue_code=issue_code,
            title=issue_data.get("title", f"Data Integrity Issue - {issue_code}"),
            description=description,
            type=issue_type,
            severity=severity,
            category=category,
            priority=priority,
            status=IssueStatus.OPEN,
            reporter_id=SYSTEM_USER_ID,
            system_info={
                "auto_generated": True,
                "event_type": data.get("event_type"),
                "source_service": data.get("source_service"),
                "source_entity": data.get("source_entity"),
                "details": data.get("details"),
            }
        )

        db.add(issue)
        db.commit()
        db.refresh(issue)

        logger.info(f"Auto-created Issue {issue_code} for data integrity event")

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create Issue from data integrity event: {e}")
        raise
    finally:
        db.close()


# ============================================================
# CONSUMER INITIALIZATION
# ============================================================

def create_consumer() -> EventConsumer:
    """
    Create and configure the event consumer with all handlers.

    Returns:
        Configured EventConsumer instance
    """
    consumer = EventConsumer()

    # Register data integrity handler
    consumer.register("system.data_integrity", handle_data_integrity_event)

    return consumer
