"""
================================================================
Contact Service (MDM) - Kafka Producer
================================================================
File: services/lkms101-contacts/app/events/producer.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Kafka producer for publishing events to event bus.
================================================================
"""

from kafka import KafkaProducer
import json
import logging
from typing import Any, Dict

from app.config import settings

logger = logging.getLogger(__name__)

# Global producer instance
_producer: KafkaProducer | None = None


def get_producer() -> KafkaProducer:
    """Get or create Kafka producer instance."""
    global _producer

    if _producer is None:
        try:
            _producer = KafkaProducer(
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS.split(","),
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                key_serializer=lambda k: k.encode("utf-8") if k else None,
            )
            logger.info(f"Kafka producer connected to {settings.KAFKA_BOOTSTRAP_SERVERS}")
        except Exception as e:
            logger.error(f"Failed to connect to Kafka: {e}")
            raise

    return _producer


async def publish_event(event_type: str, data: Dict[str, Any]) -> None:
    """
    Publish event to Kafka topic.

    Args:
        event_type: Event type (e.g., "item.created", "item.updated")
        data: Event payload data

    Example:
        await publish_event("item.created", {"id": 123, "name": "Item"})
    """
    topic = f"{settings.KAFKA_TOPIC_PREFIX}.{event_type}"

    try:
        producer = get_producer()
        future = producer.send(
            topic,
            value=data,
            key=str(data.get("id", "")) if data.get("id") else None,
        )
        # Wait for acknowledgment
        record_metadata = future.get(timeout=10)

        logger.info(
            f"Published event to {topic}: "
            f"partition={record_metadata.partition}, offset={record_metadata.offset}"
        )
    except Exception as e:
        logger.error(f"Failed to publish event to {topic}: {e}")
        # Don't raise - event publishing should not break main flow
