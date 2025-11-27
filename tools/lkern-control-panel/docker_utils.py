"""
================================================================
FILE: docker_utils.py
PATH: /tools/lkern-control-panel/docker_utils.py
DESCRIPTION: Shared Docker and native service status check functions
VERSION: v1.0.2
UPDATED: 2025-11-25 13:15:00
CHANGELOG:
  v1.0.2 - Fixed Docker inspect template: Now handles containers without healthcheck (Adminer)
         - Changed format to use {{if .State.Health}} conditional
  v1.0.1 - Fixed Windows console windows opening: Added CREATE_NO_WINDOW flag to subprocess calls
  v1.0.0 - Initial version with shared status check functions
================================================================
"""

import subprocess
import requests
import platform

# Windows flag to prevent console windows from opening
CREATE_NO_WINDOW = 0x08000000 if platform.system() == 'Windows' else 0


def is_docker_running():
    """Check if Docker daemon is running.

    Returns:
        bool: True if Docker is running and responsive, False otherwise
    """
    try:
        result = subprocess.run(
            ['docker', 'info'],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=CREATE_NO_WINDOW
        )
        return result.returncode == 0
    except Exception:
        return False


def check_docker_status(container_name):
    """Check Docker container status (single check, no waiting).

    This is the CANONICAL function used everywhere:
    - Microservices tab (main.py)
    - Startup orchestrator
    - Shutdown orchestrator
    - Cleanup orchestrator

    Args:
        container_name: Docker container name

    Returns:
        tuple: (state_status, health_status, error)
            state_status: "running", "exited", "stopped", "restarting", "paused", "dead", or "unknown"
            health_status: "healthy", "starting", "unhealthy", or None (if no healthcheck)
            error: Error message or None
    """
    try:
        result = subprocess.run(
            ['docker', 'inspect', '--format={{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{end}}', container_name],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=CREATE_NO_WINDOW
        )

        if result.returncode == 0:
            output = result.stdout.strip().split('|')
            state_status = output[0] if len(output) > 0 else 'unknown'
            # Health status can be empty string if no healthcheck - treat as None
            health_status = output[1] if len(output) > 1 and output[1] else None
            return state_status, health_status, None
        else:
            return 'stopped', None, 'not found'
    except Exception as e:
        return 'unknown', None, str(e)


def check_native_status(health_url):
    """Check native service status via HTTP health endpoint (single check, no waiting).

    This is the CANONICAL function used everywhere for native services.

    Args:
        health_url: HTTP health check URL (e.g., "http://localhost:5801/health")

    Returns:
        tuple: (status, error)
            status: "running" if healthy, "stopped" if not
            error: Error message or None
    """
    try:
        response = requests.get(health_url, timeout=3)
        if response.status_code == 200:
            return 'running', None
        else:
            return 'stopped', f'HTTP {response.status_code}'
    except requests.exceptions.RequestException as e:
        return 'stopped', 'not responding'
    except Exception as e:
        return 'unknown', str(e)


def is_service_healthy(state_status, health_status):
    """Determine if service is healthy based on state and health status.

    Args:
        state_status: State.Status from Docker inspect
        health_status: Health.Status from Docker inspect (or None if no healthcheck)

    Returns:
        bool: True if service is healthy/ready
    """
    # If health check exists and is healthy, service is ready
    if health_status == "healthy":
        return True

    # If no health check and container is running, consider it healthy
    if state_status == "running" and health_status is None:
        return True

    return False


def wait_for_docker_healthy(container_name, timeout=120):
    """Wait for Docker container to become healthy (used by orchestrators).

    This function calls check_docker_status() in a loop until healthy or timeout.

    Args:
        container_name: Docker container name
        timeout: Maximum time to wait in seconds

    Returns:
        str: "healthy" if ready, "starting" if timeout expired but container exists,
             "not_found" if container doesn't exist after timeout
    """
    import time
    start = time.time()

    while time.time() - start < timeout:
        state_status, health_status, error = check_docker_status(container_name)

        # If error (container doesn't exist yet), keep waiting - docker-compose is creating it
        if error:
            time.sleep(2)
            continue

        # Check if service is healthy
        if is_service_healthy(state_status, health_status):
            return "healthy"

        # Container exists but not healthy yet - keep waiting (even if exited/stopped)
        # Docker-compose might be restarting it or it's still initializing
        time.sleep(2)

    # Timeout expired - check final state
    state_status, health_status, error = check_docker_status(container_name)

    if error:
        # Container never appeared
        return "not_found"

    if is_service_healthy(state_status, health_status):
        return "healthy"

    if state_status == "running":
        # Running but healthcheck not done yet
        return "starting"

    # Container exists but stopped/exited after timeout
    return "not_found"


def wait_for_native_healthy(health_url, timeout=120):
    """Wait for native service to become healthy (used by orchestrators).

    This function calls check_native_status() in a loop.

    Args:
        health_url: HTTP health check URL
        timeout: Maximum time to wait in seconds

    Returns:
        bool: True if healthy, False if timeout
    """
    import time
    start = time.time()

    while time.time() - start < timeout:
        status, error = check_native_status(health_url)

        if status == "running":
            return True

        time.sleep(2)

    return False
