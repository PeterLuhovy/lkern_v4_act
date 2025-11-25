"""
================================================================
FILE: main.py
PATH: /services/lkms801-system-ops/app/main.py
DESCRIPTION: FastAPI + gRPC server for system operations service
VERSION: v1.1.0
UPDATED: 2025-11-24 15:30:00
================================================================
"""

# === IMPORTS ===
from fastapi import FastAPI, Header, HTTPException
import uvicorn
import logging
import threading
from datetime import datetime

from app.config import settings
from app.grpc_server import serve as grpc_serve

# === LOGGING ===
# Create logs directory if not exists
import os
from pathlib import Path
log_dir = Path(__file__).parent.parent / 'logs'
log_dir.mkdir(exist_ok=True)
log_file = log_dir / 'service.log'

# Configure logging to FILE ONLY (no console spam in main terminal)
# Logs visible via Log button in Control Panel
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format=settings.LOG_FORMAT,
    handlers=[
        logging.FileHandler(log_file, mode='a', encoding='utf-8')  # File output only
    ]
)
logger = logging.getLogger(__name__)

# === FASTAPI APP ===
app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.SERVICE_VERSION,
    description="Native Windows service for file system operations via gRPC",
    docs_url="/docs",
    redoc_url="/redoc"
)


# === STARTUP EVENT ===
@app.on_event("startup")
async def startup_event():
    """Start gRPC server in background thread."""
    logger.info(f"🚀 {settings.SERVICE_NAME} v{settings.SERVICE_VERSION} starting...")

    # Start gRPC server in separate thread
    grpc_thread = threading.Thread(target=grpc_serve, daemon=True)
    grpc_thread.start()
    logger.info(f"✅ gRPC server started on port {settings.GRPC_PORT}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info(f"🛑 {settings.SERVICE_NAME} shutting down...")


# === HEALTH CHECK ===
@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        Service status and version
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    logger.info(f"💓 Health check - {timestamp}")

    return {
        "status": "healthy",
        "service": settings.SERVICE_CODE,
        "version": settings.SERVICE_VERSION,
        "grpc_port": settings.GRPC_PORT,
        "timestamp": timestamp
    }


# === ROOT ENDPOINT ===
@app.get("/")
async def root():
    """
    Root endpoint with service info.

    Returns:
        Service information
    """
    return {
        "service": settings.SERVICE_NAME,
        "code": settings.SERVICE_CODE,
        "version": settings.SERVICE_VERSION,
        "description": "Native Windows service for file system operations",
        "api": {
            "rest": f"http://localhost:{settings.REST_PORT}",
            "grpc": f"localhost:{settings.GRPC_PORT}",
            "docs": f"http://localhost:{settings.REST_PORT}/docs"
        },
        "operations": [
            "OpenFolder - Open folder in Windows Explorer",
            "CopyFile - Copy file or folder",
            "MoveFile - Move file or folder",
            "DeleteFile - Delete file or folder",
            "RenameFile - Rename file or folder",
            "ListFolder - List folder contents",
            "GetFileInfo - Get file information"
        ]
    }


# === PROTECTED ENDPOINT EXAMPLE ===
@app.get("/status")
async def status(api_key: str = Header(None, alias="X-API-Key")):
    """
    Protected status endpoint (requires API key).

    Args:
        api_key: API key from X-API-Key header

    Returns:
        Detailed service status

    Raises:
        HTTPException 401: Invalid API key
    """
    if api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return {
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "status": "running",
        "allowed_paths": settings.ALLOWED_PATHS,
        "grpc_port": settings.GRPC_PORT,
        "rest_port": settings.REST_PORT
    }


# === MAIN ===
if __name__ == "__main__":
    logger.info(f"🚀 Starting {settings.SERVICE_NAME} v{settings.SERVICE_VERSION}")
    logger.info(f"📡 REST API: http://{settings.HOST}:{settings.REST_PORT}")
    logger.info(f"🔌 gRPC API: {settings.HOST}:{settings.GRPC_PORT}")
    logger.info(f"📁 Allowed paths: {settings.ALLOWED_PATHS}")

    # Uvicorn log configuration with timestamps
    uvicorn_log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": settings.LOG_FORMAT,  # Use our LOG_FORMAT with timestamps
            },
            "access": {
                "format": settings.LOG_FORMAT,  # Use our LOG_FORMAT with timestamps
            },
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.FileHandler",
                "filename": log_file,
                "mode": "a",
                "encoding": "utf-8",
            },
            "access": {
                "formatter": "access",
                "class": "logging.FileHandler",
                "filename": log_file,
                "mode": "a",
                "encoding": "utf-8",
            },
        },
        "loggers": {
            "uvicorn": {"handlers": ["default"], "level": settings.LOG_LEVEL.upper()},
            "uvicorn.error": {"level": settings.LOG_LEVEL.upper()},
            "uvicorn.access": {"handlers": ["access"], "level": settings.LOG_LEVEL.upper(), "propagate": False},
        },
    }

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.REST_PORT,
        reload=False,  # No hot-reload for native service
        log_level=settings.LOG_LEVEL.lower(),
        log_config=uvicorn_log_config  # Apply our log config with timestamps
    )
