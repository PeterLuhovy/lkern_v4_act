"""
================================================================
Contact Service (MDM) - gRPC API
================================================================
File: services/lkms101-contacts/app/api/grpc/__init__.py
Version: v1.0.0
Description:
  gRPC service exports for inter-service communication.
================================================================
"""

from app.api.grpc.contacts_service import ContactGrpcService

__all__ = [
    "ContactGrpcService",
]
