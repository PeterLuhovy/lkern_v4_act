"""
================================================================
FILE: startup_orchestrator.py
PATH: /tools/lkern-control-panel/startup_orchestrator.py
DESCRIPTION: L-KERN system startup orchestrator with live timing (MM:SS:MS) + per-service stats
VERSION: v3.12.0
UPDATED: 2025-11-25 14:30:00
CHANGELOG:
  v3.12.0 - Increased window size: 700x500 → 875x1000 (width +25%, height 2x)
          - Increased progress bar: 660 → 825 (proportional to width)
  v3.11.0 - Fixed Windows console windows opening: Added CREATE_NO_WINDOW flag to subprocess calls
          - Refactored to use global constant (consistent with shutdown/cleanup orchestrators)
  v3.10.0 - Restructured service display: Services now grouped by category (Business, Frontend, Data, System, Dev Tools)
          - Two-column layout: LKMS code (e.g., "lkms105-issues") + service name (e.g., "Issues Service")
          - Services sorted ascending by LKMS number within each category
          - Matches Microservices tab display format
  v3.9.0 - Unified status check logic: Now uses shared docker_utils.py functions (same as Microservices tab)
         - check_docker_health() now wraps wait_for_docker_healthy() from docker_utils
         - check_http_health() now wraps wait_for_native_healthy() from docker_utils
         - Ensures consistent status detection across all components
  v3.8.0 - Fixed Kafka "Starting" false negative: Changed check_docker_health to use State.Status + Health.Status (same as Microservices tab)
         - If container is running after timeout, consider it healthy even if healthcheck not complete yet
         - Handles containers without healthcheck (running + empty health = healthy)
  v3.7.0 - Fixed Web UI "Ready" false positive: Changed priority to use Docker health check (returns "starting" state) instead of HTTP check (only returns healthy/not_found)
         - Docker services now use Docker health check first (more accurate), HTTP check only for native services
  v3.6.0 - Fixed Kafka "starting" status: Increased timeout to 120s (Kafka needs 80s for health checks)
         - Added timeout logic for messaging services (Kafka, Zookeeper) - 2 minutes
  v3.5.0 - Fixed premature "unhealthy" status: Docker services continue waiting even if temporarily unhealthy
         - Increased LKMS801 timeout to 180s (3 min) for native Python service startup
         - Timer keeps running until service becomes healthy or timeout expires (NO fixed delays)
  v3.4.0 - Smart status detection: "Not Ready" (container not created yet) → "Starting" (exists but not healthy) → "Ready" (healthy)
         - No fixed delays - health check waits dynamically for container creation
         - check_docker_health now returns status string ("healthy", "starting", "unhealthy", "not_found")
  v3.3.0 - Removed fixed 10s wait after docker-compose up - health checks start immediately
         - Services will be marked "Not Ready" if they fail health check (expected behavior)
  v3.2.1 - Fixed "Not Ready" false positives: Added 10s wait after docker-compose up before health checks
         - Containers need time to initialize before health checks start
  v3.2.0 - Added dynamic timeout based on service stats (2x average time)
         - Web UI timeout now adjusts to 6 min if average is 3 min (prevents false "Not Ready")
         - Added calculate_dynamic_timeout() function
  v3.1.2 - Fixed thread safety: Changed live timers from worker threads to self.root.after() (main GUI thread)
  v3.1.1 - Changed format_three_times() to display milliseconds
  v3.1.0 - Fixed progress counter (count ready services, not checked)
         - Added live per-service timers (update every 100ms during checks)
         - Included native services (LKMS801) in display
         - Native services marked as "Running" instead of "Ready"
  v3.0.0 - Initial parallel execution with health checks
================================================================
"""

# === IMPORTS ===
import subprocess
import time
import json
import webbrowser
import sys
import threading
import platform
from datetime import datetime
from pathlib import Path
import requests
import tkinter as tk
from tkinter import ttk

# === CONSTANTS ===
STATS_FILE = Path(__file__).parent / "startup_stats.json"
REGISTRY_FILE = Path(__file__).parent / "services_registry.json"
WORKING_DIR = Path("L:/system/lkern_codebase_v4_act")
WEB_UI_URL = "http://localhost:4201"

# Windows flag to prevent console windows from opening
CREATE_NO_WINDOW = 0x08000000 if platform.system() == 'Windows' else 0

# === GUI COLORS ===
COLORS = {
    'bg': '#1e1e1e',
    'panel_bg': '#2d2d2d',
    'text': '#e0e0e0',
    'text_muted': '#757575',
    'success': '#4CAF50',
    'error': '#f44336',
    'warning': '#FF9800',
    'info': '#2196F3',
    'progress_bg': '#424242',
    'progress_fg': '#4CAF50'
}


# === HELPER FUNCTIONS ===
def format_time(seconds):
    """Format time as MM:SS:MS (Minutes:Seconds:Milliseconds)."""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    milliseconds = int((seconds % 1) * 1000)
    return f"{minutes:02d}:{secs:02d}:{milliseconds:03d}"


def format_time_short(seconds):
    """Format time as MM:SS (no milliseconds) for compact display."""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"


def format_three_times(current, last, average):
    """Format 3 times for service row display: C:MM:SS:MS L:MM:SS:MS A:MM:SS:MS"""
    current_str = format_time(current)
    last_str = format_time(last) if last > 0 else "--:--:---"
    avg_str = format_time(average) if average > 0 else "--:--:---"
    return f"C:{current_str} L:{last_str} A:{avg_str}"


def load_services_registry():
    """Load services from central registry with categories."""
    with open(REGISTRY_FILE, 'r', encoding='utf-8') as f:
        registry = json.load(f)

    # Build services list using startup_order from registry (including native services)
    services = []
    for service_code in registry["startup_order"]:
        # Find service in registry
        service_info = next((s for s in registry["services"] if s["code"] == service_code), None)
        if service_info:
            # Include both docker and native services
            is_native = (service_info["type"] == "native")

            # Build health check URL if port is available
            health_check = None
            if service_info.get("health_check"):
                health_check = service_info["health_check"]

            # Determine category based on LKMS range
            lkms_num = service_info["order"]
            if 100 <= lkms_num < 200:
                category = '100-199 Business'
            elif 200 <= lkms_num < 300:
                category = '200-299 Frontend'
            elif 500 <= lkms_num < 600:
                category = '500-599 Data'
            elif 800 <= lkms_num < 900:
                category = '800-899 System'
            elif 900 <= lkms_num < 1000:
                category = '900-999 Dev Tools'
            else:
                category = 'Other'

            services.append({
                "name": service_info["code"],
                "display": service_info["name_sk"],
                "health_check": health_check,
                "docker_name": service_info.get("container") or service_info["code"],  # Use code as identifier for native services
                "is_native": is_native,
                "category": category,
                "order": lkms_num
            })

    return services


def load_stats():
    """Load startup statistics from JSON file."""
    if STATS_FILE.exists():
        with open(STATS_FILE, 'r') as f:
            return json.load(f)
    return {
        "total": {
            "history": [],
            "average": 0,
            "last": 0
        },
        "services": {}
    }


def save_stats(duration, service_times):
    """Save startup statistics with per-service times.

    Args:
        duration: Total startup duration
        service_times: Dict mapping service names to their durations
    """
    stats = load_stats()

    # Update total stats
    if "total" not in stats:
        stats["total"] = {"history": [], "average": 0, "last": 0}

    stats["total"]["history"].append({
        "timestamp": datetime.now().isoformat(),
        "duration": duration
    })
    stats["total"]["history"] = stats["total"]["history"][-50:]
    stats["total"]["average"] = sum(h["duration"] for h in stats["total"]["history"]) / len(stats["total"]["history"])
    stats["total"]["last"] = duration

    # Update per-service stats
    if "services" not in stats:
        stats["services"] = {}

    for service_name, service_duration in service_times.items():
        if service_name not in stats["services"]:
            stats["services"][service_name] = {"history": [], "average": 0, "last": 0}

        stats["services"][service_name]["history"].append(service_duration)
        stats["services"][service_name]["history"] = stats["services"][service_name]["history"][-50:]
        stats["services"][service_name]["average"] = sum(stats["services"][service_name]["history"]) / len(stats["services"][service_name]["history"])
        stats["services"][service_name]["last"] = service_duration

    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f, indent=2)

    return stats


def calculate_dynamic_timeout(service_name, service_stats, min_timeout=60, max_timeout=600):
    """Calculate dynamic timeout based on service average time (2x average).

    Args:
        service_name: Name of the service
        service_stats: Stats dict containing service history
        min_timeout: Minimum timeout in seconds (default: 60s)
        max_timeout: Maximum timeout in seconds (default: 600s = 10min)

    Returns:
        Timeout in seconds
    """
    svc_stats = service_stats.get(service_name, {})
    avg_time = svc_stats.get("average", 0)

    if avg_time > 0:
        # Use 2x average time as timeout
        dynamic_timeout = avg_time * 2
        # Clamp between min and max
        return max(min_timeout, min(dynamic_timeout, max_timeout))
    else:
        # No history - use default based on service type
        # System services (LKMS801) need time to start
        if "system-ops" in service_name.lower() or "lkms801" in service_name.lower():
            return 180  # 3 minutes for system services (native Python startup)
        # Web UI and Issues need more time
        elif "web-ui" in service_name.lower() or "issues" in service_name.lower():
            return 300  # 5 minutes for web apps
        # Messaging services (Kafka, Zookeeper) need time for health checks
        elif "kafka" in service_name.lower() or "zookeeper" in service_name.lower():
            return 120  # 2 minutes for messaging (Kafka needs 80s: 30s start_period + 50s health checks)
        else:
            return min_timeout  # 60s for databases/infra


def check_docker_health(container_name, timeout=120):
    """Wait for Docker container to become healthy (wrapper for docker_utils).

    Returns:
        "healthy" - Container is healthy (or running without healthcheck)
        "unhealthy" - Container is unhealthy (permanent failure)
        "starting" - Container exists but not healthy yet (transitioning)
        "not_found" - Container not found (timeout expired)
    """
    # Use shared function from docker_utils (same logic as Microservices tab)
    from docker_utils import wait_for_docker_healthy
    return wait_for_docker_healthy(container_name, timeout)


def check_http_health(url, timeout=120):
    """Wait for HTTP health endpoint (wrapper for docker_utils)."""
    # Use shared function from docker_utils (same logic as Microservices tab)
    from docker_utils import wait_for_native_healthy
    return wait_for_native_healthy(url, timeout)


def start_docker_compose():
    """Start docker-compose services (non-blocking, returns immediately)."""
    try:
        subprocess.Popen(
            ['docker-compose', 'up', '-d'],
            cwd=WORKING_DIR,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=CREATE_NO_WINDOW
        )
        return True
    except Exception:
        return False


def check_service_status(service, timeout=120):
    """Check if service is healthy.

    Args:
        service: Service dict with health_check and docker_name
        timeout: Timeout in seconds for health check

    Returns:
        Status string: "healthy", "unhealthy", "starting", "not_found"
    """
    # Prefer Docker health check for Docker services (more accurate - returns all states: healthy, starting, unhealthy, not_found)
    if service.get("docker_name") and not service.get("is_native"):
        return check_docker_health(service["docker_name"], timeout)

    # Fallback to HTTP health check for native services or services without docker_name
    # (HTTP check only returns 2 states: healthy or not_found, cannot detect "starting")
    if service.get("health_check"):
        result = check_http_health(service["health_check"], timeout)
        return "healthy" if result else "not_found"

    return "not_found"


# === GUI CLASS ===
class StartupOrchestratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("🚀 L-KERN Startup Orchestrator")
        self.root.geometry("875x1000")
        self.root.configure(bg=COLORS['bg'])
        self.root.resizable(False, False)

        # Center window
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (875 // 2)
        y = (self.root.winfo_screenheight() // 2) - (1000 // 2)
        self.root.geometry(f"875x1000+{x}+{y}")

        # Bring window to front and KEEP IT THERE
        self.root.lift()
        self.root.focus_force()
        self.root.attributes('-topmost', True)  # Stay on top during startup

        # Variables
        self.start_time = None
        self.service_labels = {}
        self.services = load_services_registry()  # Load from central registry

        # Create UI
        self.create_ui()

        # Start startup in background thread
        threading.Thread(target=self.run_startup, daemon=True).start()

    def create_ui(self):
        """Create GUI layout."""
        # Header
        header_frame = tk.Frame(self.root, bg=COLORS['panel_bg'], relief=tk.RAISED, bd=2)
        header_frame.pack(fill=tk.X, padx=10, pady=10)

        title = tk.Label(
            header_frame,
            text="🚀 L-KERN SYSTEM STARTUP",
            font=('Segoe UI', 16, 'bold'),
            fg=COLORS['success'],
            bg=COLORS['panel_bg']
        )
        title.pack(pady=10)

        # Stats section (always shown) - Live timer + Last + Average
        stats_frame = tk.Frame(self.root, bg=COLORS['bg'])
        stats_frame.pack(fill=tk.X, padx=20, pady=(0, 10))

        stats = load_stats()
        total_stats = stats.get("total", {"last": 0, "average": 0})
        if total_stats["last"] > 0:
            last_time = format_time(total_stats['last'])
            avg_time = format_time(total_stats['average'])
            stats_text = f"⏱️  Current: 00:00:000  |  📊 Last: {last_time}  |  Average: {avg_time}"
        else:
            stats_text = "⏱️  Current: 00:00:000  |  📊 First startup - no statistics yet"

        self.stats_label = tk.Label(
            stats_frame,
            text=stats_text,
            font=('Segoe UI', 10, 'bold'),
            fg=COLORS['info'],
            bg=COLORS['bg']
        )
        self.stats_label.pack()

        # Progress section
        progress_frame = tk.Frame(self.root, bg=COLORS['bg'])
        progress_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

        # Status label
        self.status_label = tk.Label(
            progress_frame,
            text="⏳ Starting services...",
            font=('Segoe UI', 11, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['bg'],
            anchor='w'
        )
        self.status_label.pack(fill=tk.X, pady=(0, 15))

        # Service list (grouped by category)
        services_frame = tk.Frame(progress_frame, bg=COLORS['bg'])
        services_frame.pack(fill=tk.BOTH, expand=True)

        # Group services by category
        categories = {}
        for service in self.services:
            category = service.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append(service)

        # Sort services within each category by order (ascending)
        for category in categories:
            categories[category].sort(key=lambda s: s['order'])

        # Display services grouped by category
        category_order = ['100-199 Business', '200-299 Frontend', '500-599 Data', '800-899 System', '900-999 Dev Tools', 'Other']
        for category_name in category_order:
            if category_name in categories:
                # Category header
                category_label = tk.Label(
                    services_frame,
                    text=f"📁 {category_name}",
                    font=('Segoe UI', 10, 'bold'),
                    fg=COLORS['info'],
                    bg=COLORS['bg']
                )
                category_label.pack(pady=(10, 5), anchor='w')

                # Create service rows for this category
                for service in categories[category_name]:
                    label = self.create_service_row(services_frame, service["name"], service["display"])
                    self.service_labels[service["docker_name"]] = label

        # Overall progress bar
        progress_bar_frame = tk.Frame(self.root, bg=COLORS['bg'])
        progress_bar_frame.pack(fill=tk.X, padx=20, pady=15)

        self.progress_bar = ttk.Progressbar(
            progress_bar_frame,
            mode='determinate',
            length=825,
            maximum=100
        )
        self.progress_bar.pack()

        # Time label
        self.time_label = tk.Label(
            self.root,
            text="",
            font=('Segoe UI', 10),
            fg=COLORS['info'],
            bg=COLORS['bg']
        )
        self.time_label.pack(pady=(0, 10))

        # Close button (initially disabled)
        self.close_button = tk.Button(
            self.root,
            text="Close",
            font=('Segoe UI', 10, 'bold'),
            bg=COLORS['panel_bg'],
            fg=COLORS['text'],
            state='disabled',
            command=self.root.destroy,
            relief=tk.RAISED,
            bd=2,
            padx=20,
            pady=8
        )
        self.close_button.pack(pady=(0, 15))

    def create_service_row(self, parent, service_code, service_name):
        """Create a row for service status with two columns (code + name) and 3-time display."""
        row = tk.Frame(parent, bg=COLORS['bg'])
        row.pack(fill=tk.X, pady=3)

        icon_label = tk.Label(
            row,
            text="⏳",
            font=('Segoe UI', 10),
            fg=COLORS['text'],
            bg=COLORS['bg'],
            width=2
        )
        icon_label.pack(side=tk.LEFT, padx=(0, 10))

        # COLUMN 1: Service code (LKMS ID) - fixed width
        code_label = tk.Label(
            row,
            text=service_code,
            font=('Consolas', 9),
            fg=COLORS['text_muted'],
            bg=COLORS['bg'],
            anchor='w',
            width=20
        )
        code_label.pack(side=tk.LEFT, padx=(0, 10))

        # COLUMN 2: Service name - expandable
        name_label = tk.Label(
            row,
            text=service_name,
            font=('Segoe UI', 10),
            fg=COLORS['text'],
            bg=COLORS['bg'],
            anchor='w'
        )
        name_label.pack(side=tk.LEFT, fill=tk.X, expand=True)

        # Time label showing 3 times: Current | Last | Average
        time_label = tk.Label(
            row,
            text="C:--:-- L:--:-- A:--:--",
            font=('Consolas', 8),
            fg=COLORS['text_muted'],
            bg=COLORS['bg'],
            width=35,
            anchor='e'
        )
        time_label.pack(side=tk.RIGHT, padx=(10, 0))

        status_label = tk.Label(
            row,
            text="Pending",
            font=('Segoe UI', 9),
            fg=COLORS['text'],
            bg=COLORS['bg'],
            width=12,
            anchor='e'
        )
        status_label.pack(side=tk.RIGHT)

        return {'icon': icon_label, 'status': status_label, 'time': time_label}

    def update_service_status(self, label_dict, status, message):
        """Update service status display."""
        if status == 'success':
            label_dict['icon'].config(text="✓", fg=COLORS['success'])
            label_dict['status'].config(text=message, fg=COLORS['success'])
        elif status == 'error':
            label_dict['icon'].config(text="✗", fg=COLORS['error'])
            label_dict['status'].config(text=message, fg=COLORS['error'])
        elif status == 'working':
            label_dict['icon'].config(text="⏳", fg=COLORS['warning'])
            label_dict['status'].config(text=message, fg=COLORS['warning'])

    def run_startup(self):
        """Run startup sequence with parallel health checks and per-service timing."""
        self.start_time = time.time()
        total_steps = len(self.services)
        completed_steps = 0
        ready_count = 0  # Track only healthy services

        # Load stats for display (both total and per-service)
        stats = load_stats()
        total_stats = stats.get("total", {"last": 0, "average": 0})
        service_stats = stats.get("services", {})

        # Track per-service times for this startup
        service_times = {}

        # Start live timer update
        def update_live_timer():
            """Update live timer on stats label."""
            if completed_steps < total_steps:
                current_duration = time.time() - self.start_time
                current_time = format_time(current_duration)

                if total_stats["last"] > 0:
                    last_time = format_time(total_stats['last'])
                    avg_time = format_time(total_stats['average'])
                    self.stats_label.config(
                        text=f"⏱️  Current: {current_time}  |  📊 Last: {last_time}  |  Average: {avg_time}"
                    )
                else:
                    self.stats_label.config(
                        text=f"⏱️  Current: {current_time}  |  📊 First startup - no statistics yet"
                    )

                # Schedule next update
                self.root.after(100, update_live_timer)

        # Start timer
        update_live_timer()

        try:
            # Step 1: Start Docker Compose (non-blocking)
            self.status_label.config(text="📦 Starting Docker containers...")

            if not start_docker_compose():
                self.status_label.config(text="✗ Failed to start Docker Compose", fg=COLORS['error'])
                self.close_button.config(state='normal')
                return

            # Step 2: Start checking all services in parallel
            self.status_label.config(text="⏳ Checking services health...")

            # Mark all services as "Starting..." immediately and record start time
            service_start_times = {}
            service_finished = {}  # Track which services finished checking

            for service in self.services:
                label = self.service_labels[service["docker_name"]]
                self.update_service_status(label, 'working', 'Starting...')
                service_start_times[service["docker_name"]] = time.time()
                service_finished[service["docker_name"]] = False

            # Start live timer updates for all services (runs in main GUI thread)
            def update_all_service_timers():
                """Update all service timers live every 100ms (thread-safe)."""
                for service in self.services:
                    service_name = service["docker_name"]

                    # Only update timers for services still checking
                    if not service_finished[service_name]:
                        current_time = time.time() - service_start_times[service_name]

                        # Get historical stats
                        svc_stats = service_stats.get(service_name, {})
                        svc_last = svc_stats.get("last", 0)
                        svc_avg = svc_stats.get("average", 0)

                        # Update display
                        time_text = format_three_times(current_time, svc_last, svc_avg)
                        label = self.service_labels[service_name]
                        label['time'].config(text=time_text)

                # Schedule next update if not all services finished
                if not all(service_finished.values()):
                    self.root.after(100, update_all_service_timers)

            # Start live timer updates
            update_all_service_timers()

            # Calculate dynamic timeouts for each service (2x average)
            service_timeouts = {}
            for service in self.services:
                service_name = service["docker_name"]
                timeout = calculate_dynamic_timeout(service_name, service_stats)
                service_timeouts[service_name] = timeout

            # Create thread for each service to check health
            import concurrent.futures
            results = {}

            def check_and_update(service):
                """Check service and return result with timing."""
                service_start = service_start_times[service["docker_name"]]
                service_name = service["docker_name"]

                # Check all services including native ones
                # Use dynamic timeout based on service stats
                timeout = service_timeouts[service_name]
                status = check_service_status(service, timeout)
                service_duration = time.time() - service_start

                return (service, status, service_duration)

            # Start all checks in parallel
            with concurrent.futures.ThreadPoolExecutor(max_workers=len(self.services)) as executor:
                future_to_service = {executor.submit(check_and_update, service): service for service in self.services}

                for future in concurrent.futures.as_completed(future_to_service):
                    service, status, service_duration = future.result()
                    service_name = service["docker_name"]
                    label = self.service_labels[service_name]

                    # Mark service as finished (stops live timer for this service)
                    service_finished[service_name] = True

                    # Track service time for stats
                    service_times[service_name] = service_duration

                    # Get historical stats for this service (for final display)
                    service_last = service_stats.get(service_name, {}).get("last", 0)
                    service_avg = service_stats.get(service_name, {}).get("average", 0)

                    # Set final time display
                    time_text = format_three_times(service_duration, service_last, service_avg)
                    label['time'].config(text=time_text)

                    # Update status based on health check result
                    if status == "healthy":
                        # Different status text for native vs docker services
                        status_text = 'Running' if service.get("is_native") else 'Ready'
                        self.update_service_status(label, 'success', status_text)
                        label['time'].config(fg=COLORS['success'])
                        ready_count += 1  # Count only healthy services
                    elif status == "starting":
                        # Container exists but not healthy yet (timeout expired)
                        self.update_service_status(label, 'working', 'Starting')
                        label['time'].config(fg=COLORS['warning'])
                    elif status == "unhealthy":
                        # Container is unhealthy (permanent failure)
                        self.update_service_status(label, 'error', 'Unhealthy')
                        label['time'].config(fg=COLORS['error'])
                    else:  # "not_found"
                        # Container was never created
                        self.update_service_status(label, 'error', 'Not Ready')
                        label['time'].config(fg=COLORS['error'])

                    results[service_name] = (status == "healthy")

                    # Update progress bar
                    completed_steps += 1
                    self.progress_bar['value'] = (completed_steps / total_steps) * 100

                    # Update time label live - show READY count, not CHECKED count
                    current_duration = time.time() - self.start_time
                    self.time_label.config(
                        text=f"⏱️  Elapsed: {format_time(current_duration)}  |  {ready_count}/{total_steps} services ready"
                    )

            # Calculate final duration
            duration = time.time() - self.start_time

            # Save stats (both total and per-service)
            stats = save_stats(duration, service_times)
            total_stats = stats.get("total", {"last": 0, "average": 0})

            # Show result
            all_healthy = all(results.values())
            if all_healthy:
                self.status_label.config(
                    text="✅ All services started successfully!",
                    fg=COLORS['success']
                )

                # Open browser
                try:
                    webbrowser.open(WEB_UI_URL)
                except Exception:
                    pass
            else:
                self.status_label.config(
                    text="⚠️  Some services not ready",
                    fg=COLORS['warning']
                )

            self.time_label.config(
                text=f"⏱️  Total: {format_time(duration)}  |  Average: {format_time(total_stats['average'])}"
            )

            # Update final stats label
            last_time = format_time(total_stats['last'])
            avg_time = format_time(total_stats['average'])
            self.stats_label.config(
                text=f"⏱️  Current: {format_time(duration)}  |  📊 Last: {last_time}  |  Average: {avg_time}"
            )

            # Enable close button
            self.close_button.config(state='normal')

        except Exception as e:
            self.status_label.config(
                text=f"✗ Error: {str(e)}",
                fg=COLORS['error']
            )
            self.close_button.config(state='normal')


def main():
    """Main entry point."""
    root = tk.Tk()
    app = StartupOrchestratorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        sys.exit(1)
