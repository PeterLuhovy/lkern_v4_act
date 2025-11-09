"""
================================================================
Issues Service - Main Application
================================================================
File: services/lkms105-issues/app/main.py
Version: v1.0.0
Created: 2025-11-08
Description:
  FastAPI application entry point with REST + gRPC servers.
================================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

from app.config import settings
from app.database import init_db
from app.api.rest import issues

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# FastAPI application
app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.SERVICE_VERSION,
    description="L-KERN v4 Microservice",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=settings.CORS_MAX_AGE,
)

# Include routers
app.include_router(issues.router)


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info(f"Starting {settings.SERVICE_NAME} v{settings.SERVICE_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"REST API: http://{settings.REST_HOST}:{settings.REST_PORT}")
    logger.info(f"gRPC API: {settings.GRPC_HOST}:{settings.GRPC_PORT}")

    # Initialize database
    init_db()

    logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("Shutting down application...")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "status": "running",
    }


@app.get("/health")
async def health():
    """
    Health check endpoint.

    Returns:
        200 OK if service is healthy
    """
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
    }


if __name__ == "__main__":
    # Run FastAPI server (development mode)
    uvicorn.run(
        "app.main:app",
        host=settings.REST_HOST,
        port=settings.REST_PORT,
        reload=settings.SERVER_RELOAD,
        log_level=settings.LOG_LEVEL,
    )

    # TODO: Run gRPC server in separate thread/process
    # gRPC server implementation goes here
