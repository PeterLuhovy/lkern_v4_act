"""
================================================================
Issues Service - Server-Sent Events (SSE) API
================================================================
File: services/lkms105-issues/app/api/rest/sse.py
Version: v1.0.0
Created: 2025-12-10
Updated: 2025-12-10
Description:
  SSE endpoint for real-time cache invalidation events.
  Publishes events on POST/PUT/PATCH/DELETE operations to notify
  all connected clients to invalidate their cache.

  Event Format:
    event: cache-invalidate
    data: {"resource": "issues", "action": "created", "id": "uuid"}

  Usage:
    Frontend connects via EventSource: GET /api/issues/events
    Backend publishes via broadcast_cache_invalidation()
================================================================
"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import asyncio
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/issues", tags=["SSE"])

# ============================================================
# SSE EVENT BROADCASTER
# ============================================================

class SSEBroadcaster:
    """
    In-memory broadcaster for SSE events.
    Maintains list of connected clients and broadcasts events to all.
    """

    def __init__(self):
        self.clients: list[asyncio.Queue] = []

    def add_client(self, queue: asyncio.Queue):
        """Register new SSE client."""
        self.clients.append(queue)
        logger.info(f"✅ SSE client connected (total: {len(self.clients)})")

    def remove_client(self, queue: asyncio.Queue):
        """Unregister SSE client."""
        if queue in self.clients:
            self.clients.remove(queue)
            logger.info(f"❌ SSE client disconnected (total: {len(self.clients)})")

    async def broadcast(self, event_type: str, data: dict):
        """
        Broadcast event to all connected clients.

        Args:
            event_type: SSE event type (e.g., "cache-invalidate")
            data: Event payload
        """
        if not self.clients:
            return  # No clients connected

        # Format SSE message
        message = f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

        # Send to all clients
        disconnected = []
        for queue in self.clients:
            try:
                await queue.put(message)
            except Exception as e:
                logger.error(f"Failed to send to client: {e}")
                disconnected.append(queue)

        # Remove disconnected clients
        for queue in disconnected:
            self.remove_client(queue)

        logger.info(f"📡 Broadcast '{event_type}' to {len(self.clients) - len(disconnected)} clients")


# Global broadcaster instance
broadcaster = SSEBroadcaster()


# ============================================================
# PUBLIC API - BROADCAST CACHE INVALIDATION
# ============================================================

async def broadcast_cache_invalidation(resource: str, action: str, id: str = None):
    """
    Broadcast cache invalidation event to all SSE clients.

    Args:
        resource: Resource type (e.g., "issues")
        action: Action performed (e.g., "created", "updated", "deleted")
        id: Optional resource ID

    Example:
        await broadcast_cache_invalidation("issues", "created", issue_id)
    """
    data = {
        "resource": resource,
        "action": action,
        "timestamp": datetime.utcnow().isoformat(),
    }
    if id:
        data["id"] = id

    await broadcaster.broadcast("cache-invalidate", data)


# ============================================================
# SSE ENDPOINT
# ============================================================

async def event_stream(request: Request) -> AsyncGenerator[str, None]:
    """
    SSE event stream generator.
    Yields SSE-formatted messages to client.
    """
    # Create queue for this client
    queue: asyncio.Queue = asyncio.Queue()
    broadcaster.add_client(queue)

    try:
        # Send initial connection message
        yield f"event: connected\ndata: {json.dumps({'status': 'connected', 'timestamp': datetime.utcnow().isoformat()})}\n\n"

        # Stream events
        while True:
            # Check if client disconnected
            if await request.is_disconnected():
                break

            try:
                # Wait for event with timeout (30s heartbeat)
                message = await asyncio.wait_for(queue.get(), timeout=30.0)
                yield message
            except asyncio.TimeoutError:
                # Send heartbeat to keep connection alive
                yield f"event: heartbeat\ndata: {json.dumps({'timestamp': datetime.utcnow().isoformat()})}\n\n"

    except asyncio.CancelledError:
        logger.info("SSE client cancelled connection")
    finally:
        broadcaster.remove_client(queue)


@router.get("/events")
async def sse_endpoint(request: Request):
    """
    SSE endpoint for real-time cache invalidation events.

    Frontend usage:
        const eventSource = new EventSource('/api/issues/events');
        eventSource.addEventListener('cache-invalidate', (event) => {
            const data = JSON.parse(event.data);
            // Invalidate cache based on data.resource, data.action, data.id
        });

    Returns:
        StreamingResponse with text/event-stream content type
    """
    return StreamingResponse(
        event_stream(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )
