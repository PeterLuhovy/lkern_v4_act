"""
================================================================
FILE: startup_orchestrator.py
PATH: /tools/lkern-control-panel/startup_orchestrator.py
DESCRIPTION: L-KERN system startup orchestrator with live timing (MM:SS:MS) + per-service stats
VERSION: v3.0.0
UPDATED: 2025-11-24 13:30:00
================================================================
"""

# === IMPORTS ===
import subprocess
import time
import json
import webbrowser
import sys
import threading
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

# === GUI COLORS ===
COLORS = {
    'bg': '#1e1e1e',
    'panel_bg': '#2d2d2d',
    'text': '#e0e0e0',
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


def load_services_registry():
    """Load services from central registry."""
    with open(REGISTRY_FILE, 'r', encoding='utf-8') as f:
        registry = json.load(f)

    # Build services list using startup_order from registry
    services = []
    for service_code in registry["startup_order"]:
        # Find service in registry
        service_info = next((s for s in registry["services"] if s["code"] == service_code), None)
        if service_info and service_info["type"] == "docker":
            # Build health check URL if port is available
            health_check = None
            if service_info["health_check"]:
                health_check = service_info["health_check"]

            services.append({
                "name": service_info["code"],
                "display": service_info["name_sk"],
                "health_check": health_check,
                "docker_name": service_info["container"]
            })

    return services


def load_stats():
    """Load startup statistics from JSON file."""
    if STATS_FILE.exists():
        with open(STATS_FILE, 'r') as f:
            return json.load(f)
    return {
        "history": [],
        "average": 0,
        "last": 0
    }


def save_stats(duration):
    """Save startup statistics."""
    stats = load_stats()

    # Add current duration
    stats["history"].append({
        "timestamp": datetime.now().isoformat(),
        "duration": duration
    })

    # Keep only last 50 startups
    stats["history"] = stats["history"][-50:]

    # Calculate average
    stats["average"] = sum(h["duration"] for h in stats["history"]) / len(stats["history"])

    # Update last
    stats["last"] = duration

    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f, indent=2)

    return stats


def check_docker_health(container_name, timeout=120):
    """Check Docker container health status."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            result = subprocess.run(
                ['docker', 'inspect', '--format={{.State.Health.Status}}', container_name],
                capture_output=True,
                text=True,
                timeout=5
            )

            if result.returncode == 0:
                health = result.stdout.strip()
                if health == "healthy":
                    return True
                elif health == "unhealthy":
                    return False
                # "starting" - continue waiting

            time.sleep(2)

        except Exception:
            time.sleep(2)

    return False


def check_http_health(url, timeout=120):
    """Check HTTP health endpoint."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(url, timeout=3)
            if response.status_code == 200:
                return True
        except Exception:
            pass

        time.sleep(2)

    return False


def start_docker_compose():
    """Start docker-compose services (non-blocking, returns immediately)."""
    try:
        subprocess.Popen(
            ['docker-compose', 'up', '-d'],
            cwd=WORKING_DIR,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return True
    except Exception:
        return False


def check_service_status(service):
    """Check if service is healthy."""
    # If HTTP health check available, use it
    if service.get("health_check"):
        return check_http_health(service["health_check"])

    # Otherwise use Docker health check
    if service.get("docker_name"):
        return check_docker_health(service["docker_name"])

    return False


# === GUI CLASS ===
class StartupOrchestratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("🚀 L-KERN Startup Orchestrator")
        self.root.geometry("700x500")
        self.root.configure(bg=COLORS['bg'])
        self.root.resizable(False, False)

        # Center window
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (700 // 2)
        y = (self.root.winfo_screenheight() // 2) - (500 // 2)
        self.root.geometry(f"700x500+{x}+{y}")

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
        if stats["last"] > 0:
            last_time = format_time(stats['last'])
            avg_time = format_time(stats['average'])
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

        # Service list
        services_frame = tk.Frame(progress_frame, bg=COLORS['bg'])
        services_frame.pack(fill=tk.BOTH, expand=True)

        # Docker services (loaded from registry)
        for service in self.services:
            label = self.create_service_row(services_frame, service["display"])
            self.service_labels[service["docker_name"]] = label

        # Overall progress bar
        progress_bar_frame = tk.Frame(self.root, bg=COLORS['bg'])
        progress_bar_frame.pack(fill=tk.X, padx=20, pady=15)

        self.progress_bar = ttk.Progressbar(
            progress_bar_frame,
            mode='determinate',
            length=660,
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

    def create_service_row(self, parent, service_name):
        """Create a row for service status with time display."""
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

        name_label = tk.Label(
            row,
            text=service_name,
            font=('Segoe UI', 10),
            fg=COLORS['text'],
            bg=COLORS['bg'],
            anchor='w'
        )
        name_label.pack(side=tk.LEFT, fill=tk.X, expand=True)

        # Time label (shows how long this service took)
        time_label = tk.Label(
            row,
            text="--:--:---",
            font=('Consolas', 9),
            fg=COLORS['text_muted'],
            bg=COLORS['bg'],
            width=10,
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

        # Load stats for display
        stats = load_stats()

        # Start live timer update
        def update_live_timer():
            """Update live timer on stats label."""
            if completed_steps < total_steps:
                current_duration = time.time() - self.start_time
                current_time = format_time(current_duration)

                if stats["last"] > 0:
                    last_time = format_time(stats['last'])
                    avg_time = format_time(stats['average'])
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

            # Step 2: Immediately start checking all services in parallel
            self.status_label.config(text="⏳ Checking services health...")

            # Mark all services as "Starting..." immediately and record start time
            service_start_times = {}
            for service in self.services:
                label = self.service_labels[service["docker_name"]]
                self.update_service_status(label, 'working', 'Starting...')
                service_start_times[service["docker_name"]] = time.time()

            # Create thread for each service to check health
            import concurrent.futures
            results = {}

            def check_and_update(service):
                """Check service and return result with timing."""
                service_start = service_start_times[service["docker_name"]]
                is_healthy = check_service_status(service)
                service_duration = time.time() - service_start
                return (service, is_healthy, service_duration)

            # Start all checks in parallel
            with concurrent.futures.ThreadPoolExecutor(max_workers=len(self.services)) as executor:
                future_to_service = {executor.submit(check_and_update, service): service for service in self.services}

                for future in concurrent.futures.as_completed(future_to_service):
                    service, is_healthy, service_duration = future.result()
                    label = self.service_labels[service["docker_name"]]

                    # Update time label for this service
                    service_time = format_time(service_duration)
                    label['time'].config(text=service_time)

                    if is_healthy:
                        self.update_service_status(label, 'success', 'Ready')
                        label['time'].config(fg=COLORS['success'])
                    else:
                        self.update_service_status(label, 'error', 'Not Ready')
                        label['time'].config(fg=COLORS['error'])

                    results[service["docker_name"]] = is_healthy

                    # Update progress bar
                    completed_steps += 1
                    self.progress_bar['value'] = (completed_steps / total_steps) * 100

                    # Update time label live
                    current_duration = time.time() - self.start_time
                    self.time_label.config(
                        text=f"⏱️  Elapsed: {format_time(current_duration)}  |  {completed_steps}/{total_steps} services ready"
                    )

            # Calculate final duration
            duration = time.time() - self.start_time

            # Save stats
            stats = save_stats(duration)

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
                text=f"⏱️  Total: {format_time(duration)}  |  Average: {format_time(stats['average'])}"
            )

            # Update final stats label
            last_time = format_time(stats['last'])
            avg_time = format_time(stats['average'])
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
