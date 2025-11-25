"""
================================================================
FILE: grpc_server.py
PATH: /services/lkms801-system-ops/app/grpc_server.py
DESCRIPTION: gRPC server implementation for system operations
VERSION: v1.0.0
UPDATED: 2025-11-23 12:00:00
================================================================
"""

# === IMPORTS ===
import grpc
from concurrent import futures
import logging

# Import generated proto files (will be generated from .proto)
# NOTE: Run compile script first: python -m grpc_tools.protoc ...
import sys
from pathlib import Path

# Add app directory to sys.path so generated proto files can import each other
app_dir = Path(__file__).parent
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

try:
    from . import system_ops_pb2
    from . import system_ops_pb2_grpc
except ImportError as e:
    import traceback
    print("=" * 60)
    print("ERROR: Failed to import proto files!")
    print(f"Exception: {e}")
    print("-" * 60)
    traceback.print_exc()
    print("=" * 60)
    print("Proto files not compiled! Run:")
    print("python -m grpc_tools.protoc -I./proto --python_out=./app --grpc_python_out=./app ./proto/system_ops.proto")
    print("=" * 60)
    sys.exit(1)

from app.config import settings
from app.security.auth import check_auth, validate_path
from app.services.file_operations import (
    open_folder,
    copy_file,
    move_file,
    delete_file,
    rename_file,
    list_folder,
    get_file_info
)

# === LOGGING ===
logger = logging.getLogger(__name__)


# === GRPC SERVICER ===
class SystemOpsServicer(system_ops_pb2_grpc.SystemOpsServiceServicer):
    """gRPC servicer implementation for system operations."""

    def OpenFolder(self, request, context):
        """Open folder in Windows Explorer."""
        # Check authentication
        if not check_auth(context):
            return system_ops_pb2.StatusResponse(success=False, error="Unauthenticated")

        # Execute operation
        success, message = open_folder(request.folder_path)

        if success:
            return system_ops_pb2.StatusResponse(success=True, message=message)
        else:
            return system_ops_pb2.StatusResponse(success=False, error=message)

    def CopyFile(self, request, context):
        """Copy file or folder."""
        # Check authentication
        if not check_auth(context):
            return system_ops_pb2.StatusResponse(success=False, error="Unauthenticated")

        # Execute operation
        success, message = copy_file(request.source_path, request.destination_path)

        if success:
            return system_ops_pb2.StatusResponse(success=True, message=message)
        else:
            return system_ops_pb2.StatusResponse(success=False, error=message)

    def MoveFile(self, request, context):
        """Move file or folder."""
        # Check authentication
        if not check_auth(context):
            return system_ops_pb2.StatusResponse(success=False, error="Unauthenticated")

        # Execute operation
        success, message = move_file(request.source_path, request.destination_path)

        if success:
            return system_ops_pb2.StatusResponse(success=True, message=message)
        else:
            return system_ops_pb2.StatusResponse(success=False, error=message)

    def DeleteFile(self, request, context):
        """Delete file or folder."""
        # Check authentication
        if not check_auth(context):
            return system_ops_pb2.StatusResponse(success=False, error="Unauthenticated")

        # Execute operation
        success, message = delete_file(request.file_path)

        if success:
            return system_ops_pb2.StatusResponse(success=True, message=message)
        else:
            return system_ops_pb2.StatusResponse(success=False, error=message)

    def RenameFile(self, request, context):
        """Rename file or folder."""
        # Check authentication
        if not check_auth(context):
            return system_ops_pb2.StatusResponse(success=False, error="Unauthenticated")

        # Execute operation
        success, message = rename_file(request.old_path, request.new_path)

        if success:
            return system_ops_pb2.StatusResponse(success=True, message=message)
        else:
            return system_ops_pb2.StatusResponse(success=False, error=message)

    def ListFolder(self, request, context):
        """List folder contents."""
        # Check authentication
        if not check_auth(context):
            return system_ops_pb2.FileListResponse(success=False, error="Unauthenticated")

        # Execute operation
        success, files, error = list_folder(request.folder_path, request.include_hidden)

        if success:
            # Convert to proto messages
            file_infos = [
                system_ops_pb2.FileInfo(
                    path=f['path'],
                    size_bytes=f['size_bytes'],
                    modified_at=f['modified_at'],
                    is_directory=f['is_directory']
                )
                for f in files
            ]

            return system_ops_pb2.FileListResponse(
                files=file_infos,
                success=True,
                error=""
            )
        else:
            return system_ops_pb2.FileListResponse(success=False, error=error)

    def GetFileInfo(self, request, context):
        """Get file/folder information."""
        # Check authentication
        if not check_auth(context):
            context.set_code(grpc.StatusCode.UNAUTHENTICATED)
            context.set_details("Invalid API key")
            return system_ops_pb2.FileInfo()

        # Execute operation
        success, info, error = get_file_info(request.file_path)

        if success:
            return system_ops_pb2.FileInfo(
                path=info['path'],
                size_bytes=info['size_bytes'],
                modified_at=info['modified_at'],
                is_directory=info['is_directory']
            )
        else:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(error)
            return system_ops_pb2.FileInfo()


# === SERVER ===
def serve():
    """Start gRPC server."""
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=settings.GRPC_MAX_WORKERS)
    )

    # Register servicer
    system_ops_pb2_grpc.add_SystemOpsServiceServicer_to_server(
        SystemOpsServicer(),
        server
    )

    # Listen on port
    server_address = f"{settings.HOST}:{settings.GRPC_PORT}"
    server.add_insecure_port(server_address)

    logger.info(f"🚀 gRPC server starting on {server_address}")
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    # Configure logging
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=settings.LOG_FORMAT
    )

    # Start server
    serve()
