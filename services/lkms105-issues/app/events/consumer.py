"""
================================================================
Issues Service - Kafka Consumer
================================================================
File: services/lkms105-issues/app/events/consumer.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Kafka consumer for processing events from other services.
  Run as background task.
================================================================
"""

from kafka import KafkaConsumer
import json
import logging
from typing import Callable, Dict, Any

from app.config import settings

logger = logging.getLogger(__name__)


class EventConsumer:
    """
    Kafka event consumer with handler registration.

    Usage:
        consumer = EventConsumer()
        consumer.register("other-service.item.created", handle_item_created)
        await consumer.start()
    """

    def __init__(self):
        self.handlers: Dict[str, Callable] = {}
        self.consumer: KafkaConsumer | None = None

    def register(self, event_type: str, handler: Callable) -> None:
        """
        Register event handler.

        Args:
            event_type: Full event type (e.g., "other-service.item.created")
            handler: Async function to handle event
        """
        self.handlers[event_type] = handler
        logger.info(f"Registered handler for {event_type}")

    async def start(self) -> None:
        """Start consuming events (blocking operation)."""
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
            )
            logger.info(f"Kafka consumer started, subscribed to: {topics}")

            # Process messages
            for message in self.consumer:
                await self._process_message(message)

        except Exception as e:
            logger.error(f"Kafka consumer error: {e}")
            raise

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


# Example event handler (replace with actual business logic)
async def handle_example_event(data: Dict[str, Any]) -> None:
    """
    Example event handler.

    Args:
        data: Event payload from Kafka
    """
    logger.info(f"Received example event: {data}")
    # TODO: Implement actual business logic here
