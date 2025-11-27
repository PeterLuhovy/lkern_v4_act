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
from app.api.rest import config as config_api
from app.api.rest import cleanup

# Configure logging - level from settings (can be changed at runtime)
def get_log_level(level_str: str) -> int:
    """Convert string log level to logging constant."""
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }
    return levels.get(level_str.lower(), logging.INFO)

logging.basicConfig(
    level=get_log_level(settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Silence noisy third-party loggers (only show WARNING+)
logging.getLogger("alembic").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

# FastAPI application
app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.SERVICE_VERSION,
    description="L-KERN v4 Microservice",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS middleware (MUST be first to handle preflight)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=settings.CORS_MAX_AGE,
)

# ============================================================
# REQUEST LOGGING MIDDLEWARE - Clear operation context
# ============================================================

def get_operation_info(method: str, path: str) -> tuple[str, str, str]:
    """
    Get human-readable operation info based on HTTP method and path.

    Returns: (emoji, operation_name, description)
    """
    # Health checks - minimal logging
    if path in ["/health", "/"]:
        return ("💓", "HEALTH", "System health check")

    # OpenAPI docs
    if path in ["/docs", "/redoc", "/openapi.json"]:
        return ("📖", "DOCS", "API documentation")

    # Issues endpoints
    if "/issues" in path:
        # Parse issue operations
        if method == "GET":
            if path == "/issues/" or path == "/issues":
                return ("📋", "LIST ISSUES", "Fetch list of all issues")
            elif "/deletion-audit" in path:
                return ("📜", "GET AUDIT", "Fetch deletion audit log")
            else:
                return ("🔍", "GET ISSUE", "Fetch single issue details")

        elif method == "POST":
            if "/assign" in path:
                return ("👤", "ASSIGN", "Assign issue to developer")
            elif "/resolve" in path:
                return ("✅", "RESOLVE", "Mark issue as resolved")
            elif "/close" in path:
                return ("🔒", "CLOSE", "Close issue")
            elif "/restore" in path:
                return ("♻️", "RESTORE", "Restore deleted issue")
            else:
                return ("➕", "CREATE ISSUE", "Create new issue")

        elif method == "PUT":
            return ("✏️", "UPDATE ISSUE", "Update issue details")

        elif method == "DELETE":
            if "/permanent" in path:
                return ("🗑️💀", "PERMANENT DELETE", "Hard delete issue + files")
            else:
                return ("🗑️", "SOFT DELETE", "Soft delete issue")

    # Unknown endpoint
    return ("❓", f"{method}", f"Unknown: {path}")


def get_caller_info(headers: dict) -> str:
    """Identify who is making the request."""
    origin = headers.get("origin", "")
    user_agent = headers.get("user-agent", "")

    if "localhost:4201" in origin:
        return "🌐 Web UI"
    elif "curl" in user_agent.lower():
        return "🔧 curl"
    elif "python" in user_agent.lower():
        return "🐍 Python (health check)"
    elif "postman" in user_agent.lower():
        return "📮 Postman"
    else:
        return "❓ Unknown"


@app.middleware("http")
async def log_requests(request, call_next):
    """Request logging middleware - INFO: single line, DEBUG: verbose."""
    import time

    method = request.method
    path = request.url.path
    query = str(request.url.query) if request.url.query else ""
    headers = dict(request.headers)

    emoji, operation, description = get_operation_info(method, path)
    caller = get_caller_info(headers)

    # Skip logging for health checks and docs
    skip_logging = path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]

    start_time = time.time()

    # DEBUG: verbose multi-line logging
    if not skip_logging and logger.isEnabledFor(logging.DEBUG):
        logger.debug("=" * 50)
        logger.debug(f"{emoji} {operation} | {caller}")
        logger.debug(f"   {method} {path}{'?' + query if query else ''}")

    try:
        response = await call_next(request)
        duration_ms = (time.time() - start_time) * 1000

        if not skip_logging:
            status_emoji = "✅" if response.status_code < 400 else "❌"
            # INFO: single line log
            logger.info(f"{status_emoji} {method} {path} → {response.status_code} ({duration_ms:.0f}ms)")

        return response

    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        logger.error(f"💥 {method} {path} → ERROR: {str(e)} ({duration_ms:.0f}ms)")
        raise

# Include routers
app.include_router(issues.router)
app.include_router(config_api.router)
app.include_router(cleanup.router)


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info(f"Starting {settings.SERVICE_NAME} v{settings.SERVICE_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"REST API: http://{settings.REST_HOST}:{settings.REST_PORT}")
    logger.info(f"gRPC API: {settings.GRPC_HOST}:{settings.GRPC_PORT}")

    # Apply persisted runtime config (log level, etc.)
    config_api.apply_persisted_config()

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
