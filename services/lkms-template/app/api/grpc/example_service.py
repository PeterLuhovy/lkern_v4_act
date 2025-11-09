"""
================================================================
{{SERVICE_NAME}} - Example gRPC Service
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/api/grpc/example_service.py
Version: v1.0.0
Created: 2025-11-08
Description:
  gRPC service implementation for inter-service communication.
  NOTE: Requires compiled .proto files from proto/ directory.
================================================================
"""

import logging
from typing import Any

# TODO: Import generated proto files after running compile-proto.sh
# from generated.lkern.common.health import health_pb2, health_pb2_grpc

logger = logging.getLogger(__name__)


class HealthService:
    """
    Health check service implementation (gRPC).

    Implements health check protocol for Kubernetes/monitoring.
    """

    async def Check(self, request: Any, context: Any) -> Any:
        """
        Check service health status.

        Returns:
            HealthCheckResponse with SERVING status
        """
        logger.info("Health check requested via gRPC")

        # TODO: Implement actual health checks (database, kafka, etc.)
        # For now, always return SERVING
        return {
            "status": "SERVING",  # UNKNOWN, SERVING, NOT_SERVING
            "message": "{{SERVICE_NAME}} is healthy",
        }

    async def Watch(self, request: Any, context: Any) -> Any:
        """
        Stream health status updates.

        Yields health status whenever it changes.
        """
        # TODO: Implement streaming health updates
        while True:
            yield await self.Check(request, context)


class {{MODEL_NAME}}Service:
    """
    {{MODEL_NAME}} gRPC service for internal communication.

    Example methods for inter-service calls.
    """

    async def Get{{MODEL_NAME}}(self, request: Any, context: Any) -> Any:
        """
        Get {{MODEL_NAME}} by ID (gRPC call).

        Args:
            request: Get{{MODEL_NAME}}Request with id field
            context: gRPC context

        Returns:
            {{MODEL_NAME}}Response
        """
        # TODO: Implement actual gRPC method
        # item_id = request.id
        # db = get_db()
        # item = db.query({{MODEL_NAME}}).filter({{MODEL_NAME}}.id == item_id).first()
        # return {{MODEL_NAME}}Response(...)

        logger.info("gRPC Get{{MODEL_NAME}} called")
        return {}
