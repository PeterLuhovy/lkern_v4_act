"""
================================================================
Issues Service - Main Application
================================================================
File: services/lkms105-issues/app/main.py
Version: v1.2.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  FastAPI application entry point with REST + gRPC servers.
Changelog:
  v1.2.0 - Clarified Kafka consumer purpose (production/backend async events)
         - Added POST /issues/system endpoint for sync issue creation
  v1.1.0 - Added Kafka consumer for data integrity events (auto-create Issues)
  v1.0.1 - /health returns HTTP 503 when unhealthy OR degraded (for Docker healthcheck)
  v1.0.0 - Initial version
================================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import logging
import uvicorn
import time
from sqlalchemy import text

from app.config import settings
from app.database import init_db, SessionLocal
from app.api.rest import issues
from app.api.rest import config as config_api
from app.api.rest import cleanup
from app.api.rest import sse
from app.services.minio_client import minio_client
from app.events.consumer import create_consumer

# Global state for graceful degradation
_db_available = False
_minio_available = False
_reconnect_task = None
_kafka_consumer_task = None


def is_db_available() -> bool:
    """Check if database is available (for graceful degradation)."""
    return _db_available


def is_minio_available() -> bool:
    """Check if MinIO is available (for graceful degradation)."""
    return _minio_available


async def _run_kafka_consumer(consumer):
    """
    Wrapper to run Kafka consumer with error handling and auto-reconnect.
    Restarts consumer after connection failures.
    """
    retry_delay = 30  # seconds between reconnect attempts

    while True:
        try:
            await consumer.start()
        except Exception as e:
            logger.error(f"Kafka consumer error: {e}")
            logger.info(f"Retrying Kafka connection in {retry_delay}s...")
            await asyncio.sleep(retry_delay)


async def _dependency_reconnect_loop():
    """
    Background task that periodically tries to reconnect to unavailable dependencies.
    Runs every 60 seconds for each unavailable dependency.
    """
    import asyncio
    global _db_available, _minio_available

    while True:
        await asyncio.sleep(60)  # Wait 1 minute between attempts

        # Try to reconnect to database
        if not _db_available:
            logger.info("Attempting to reconnect to database...")
            try:
                from app.database import Base, engine
                Base.metadata.create_all(bind=engine)
                _db_available = True
                logger.info("✅ Database reconnection successful!")
            except Exception as e:
                logger.warning(f"Database reconnection failed: {e}")

        # Try to reconnect to MinIO
        if not _minio_available:
            logger.info("Attempting to reconnect to MinIO...")
            try:
                if minio_client.check_health():
                    _minio_available = True
                    logger.info("✅ MinIO reconnection successful!")
                else:
                    logger.warning("MinIO health check failed")
            except Exception as e:
                logger.warning(f"MinIO reconnection failed: {e}")

        # Log overall status
        if _db_available and _minio_available:
            logger.info("All dependencies available - service fully operational")
        elif not _db_available or not _minio_available:
            missing = []
            if not _db_available:
                missing.append("Database")
            if not _minio_available:
                missing.append("MinIO")
            logger.info(f"Will retry {', '.join(missing)} in 60 seconds...")

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
# IMPORTANT: SSE router MUST be before issues router to avoid /issues/events being matched as /issues/{issue_id}
app.include_router(sse.router)
app.include_router(issues.router)
app.include_router(config_api.router)
app.include_router(cleanup.router)


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    import asyncio
    global _db_available, _minio_available, _reconnect_task

    logger.info(f"Starting {settings.SERVICE_NAME} v{settings.SERVICE_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"REST API: http://{settings.REST_HOST}:{settings.REST_PORT}")
    logger.info(f"gRPC API: {settings.GRPC_HOST}:{settings.GRPC_PORT}")

    # Apply persisted runtime config (log level, etc.)
    config_api.apply_persisted_config()

    # Initialize database with retry logic
    _db_available = init_db(max_retries=5, retry_delay=2.0)

    # Check MinIO availability
    try:
        if minio_client.check_health():
            _minio_available = True
            logger.info("MinIO connection successful")
        else:
            _minio_available = False
            logger.warning("MinIO health check failed")
    except Exception as e:
        _minio_available = False
        logger.warning(f"MinIO connection failed: {e}")

    # Start background reconnect task if any dependency is unavailable
    if not _db_available or not _minio_available:
        missing = []
        if not _db_available:
            missing.append("Database")
        if not _minio_available:
            missing.append("MinIO")
        logger.warning(f"Application started in DEGRADED mode ({', '.join(missing)} unavailable)")
        logger.info("Background reconnection task started - will retry every 60 seconds")
        _reconnect_task = asyncio.create_task(_dependency_reconnect_loop())
    else:
        logger.info("Application startup complete - all dependencies available")

    # Start Kafka consumer for async issue creation (production systems, backend errors)
    # For frontend/sync use cases, use REST endpoint: POST /issues/system
    if _db_available:
        try:
            consumer = create_consumer()
            _kafka_consumer_task = asyncio.create_task(_run_kafka_consumer(consumer))
            logger.info("Kafka consumer started (production systems, backend async events)")
        except Exception as e:
            logger.warning(f"Failed to start Kafka consumer (will retry): {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    global _reconnect_task, _kafka_consumer_task

    logger.info("Shutting down application...")

    # Cancel Kafka consumer task if running
    if _kafka_consumer_task and not _kafka_consumer_task.done():
        _kafka_consumer_task.cancel()
        try:
            await _kafka_consumer_task
        except asyncio.CancelledError:
            pass
        logger.info("Kafka consumer task cancelled")

    # Cancel reconnect task if running
    if _reconnect_task and not _reconnect_task.done():
        _reconnect_task.cancel()
        try:
            await _reconnect_task
        except asyncio.CancelledError:
            pass
        logger.info("Background reconnect task cancelled")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "status": "running",
    }


@app.get("/ping")
async def ping():
    """
    Lightweight ping endpoint - responds immediately.
    Use this to check if the service is alive without waiting for dependency checks.

    Returns:
        200 OK with service info (no dependency checks)
    """
    return {
        "status": "alive",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
    }


@app.get("/health")
async def health():
    """
    Comprehensive health check endpoint.

    Checks all dependencies IN PARALLEL:
    - SQL Database (PostgreSQL)
    - MinIO (Object Storage)

    Returns:
        200 OK - status: "healthy" (all dependencies OK)
        503 Service Unavailable - status: "degraded" or "unhealthy" (any dependency down)

    Note: HTTP status code is important for Docker healthcheck!
    - Docker healthcheck only checks HTTP status, not JSON content
    - 503 = Docker marks container as "unhealthy"
    - 200 = Docker marks container as "healthy"
    """
    start_time = time.time()

    # ============================================================
    # RUN DEPENDENCY CHECKS IN PARALLEL
    # ============================================================

    async def check_sql():
        """Check SQL database connectivity."""
        sql_start = time.time()
        sql_status = "healthy"
        sql_error = None

        try:
            # Run DB check in thread pool to not block event loop
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, _sync_sql_check)
            sql_response_time = int((time.time() - sql_start) * 1000)
        except Exception as e:
            sql_status = "unhealthy"
            sql_error = str(e)
            sql_response_time = int((time.time() - sql_start) * 1000)
            logger.error(f"SQL health check failed: {e}")

        return {
            "status": sql_status,
            "responseTime": sql_response_time,
            **({"error": sql_error} if sql_error else {}),
        }

    async def check_minio():
        """Check MinIO connectivity with timeout."""
        minio_start = time.time()
        minio_status = "healthy"
        minio_error = None

        try:
            # Run MinIO check in thread pool with 5 second timeout
            loop = asyncio.get_event_loop()
            await asyncio.wait_for(
                loop.run_in_executor(None, _sync_minio_check),
                timeout=5.0  # 5 second timeout for MinIO check
            )
            minio_response_time = int((time.time() - minio_start) * 1000)
        except asyncio.TimeoutError:
            minio_status = "unhealthy"
            minio_error = "MinIO check timeout (5s)"
            minio_response_time = 5000
            logger.warning("MinIO health check timed out after 5s")
        except Exception as e:
            minio_status = "unhealthy"
            minio_error = str(e)
            minio_response_time = int((time.time() - minio_start) * 1000)
            logger.warning(f"MinIO health check failed: {e}")

        return {
            "status": minio_status,
            "responseTime": minio_response_time,
            **({"error": minio_error} if minio_error else {}),
        }

    # Run both checks in parallel
    sql_result, minio_result = await asyncio.gather(
        check_sql(),
        check_minio()
    )

    dependencies = {
        "sql": sql_result,
        "minio": minio_result,
    }

    # ============================================================
    # DETERMINE OVERALL STATUS
    # ============================================================
    # Logic:
    # - SQL down = unhealthy (critical - nothing works without DB)
    # - MinIO down = degraded (can still create issues, just no attachments)
    # - All OK = healthy

    if sql_result["status"] == "unhealthy":
        overall_status = "unhealthy"
    elif minio_result["status"] == "unhealthy":
        overall_status = "degraded"
    else:
        overall_status = "healthy"

    total_time = int((time.time() - start_time) * 1000)

    response_data = {
        "status": overall_status,
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "dependencies": dependencies,
        "totalCheckTime": total_time,
    }

    # Return HTTP 503 if any dependency is down (unhealthy or degraded)
    # This is important for Docker healthcheck - it only checks HTTP status code
    # Docker healthcheck is binary: 2xx = healthy, anything else = unhealthy
    # Control Panel then shows "degraded" (orange) for Docker "unhealthy" state
    if overall_status in ("unhealthy", "degraded"):
        return JSONResponse(content=response_data, status_code=503)

    return response_data


def _sync_sql_check():
    """Synchronous SQL check (runs in thread pool)."""
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
    finally:
        db.close()


def _sync_minio_check():
    """Synchronous MinIO check (runs in thread pool)."""
    if minio_client.client:
        minio_client.client.list_buckets()
    else:
        raise Exception("MinIO client not initialized")


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
