"""
================================================================
FILE: shutdown_orchestrator.py
PATH: /tools/lkern-control-panel/shutdown_orchestrator.py
DESCRIPTION: L-KERN system shutdown orchestrator with live timing (MM:SS:MS) + PARALLEL stops + per-service stats
VERSION: v3.6.0
UPDATED: 2025-11-25 14:30:00
CHANGELOG:
  v3.6.0 - Increased window size: 700x500 → 875x1000 (width +25%, height 2x)
         - Increased progress bar: 660 → 825 (proportional to width)
  v3.5.0 - Fixed Windows console windows opening: Added CREATE_NO_WINDOW flag to all subprocess calls
  v3.4.0 - Restructured service display: Services now grouped by category (Business, Frontend, Data, System, Dev Tools)
         - Two-column layout: LKMS code (e.g., "lkms105-issues") + service name (e.g., "Issues Service")
         - Services sorted ascending by LKMS number within each category
         - Matches Microservices tab display format
  v3.3.0 - Fixed native service live timer (runs in background thread, updates every 100ms)
  v3.2.0 - Added live per-service timers (update every 100ms during stops)
         - Changed format_three_times() to display milliseconds
  v3.1.1 - Fixed native service CommandLine filter (*app.main*)
  v3.1.0 - Initial parallel stops with per-service timing
================================================================
"""

# === IMPORTS ===
import subprocess
import time
import json
import sys
import threading
import platform
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import ttk

# === CONSTANTS ===
STATS_FILE = Path(__file__).parent / "shutdown_stats.json"
REGISTRY_FILE = Path(__file__).parent / "services_registry.json"
WORKING_DIR = Path("L:/system/lkern_codebase_v4_act")

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

    # Build services list ordered by LKMS number (for display)
    services = []
    for service in sorted(registry["services"], key=lambda s: s["order"]):
        if service["type"] == "docker":
            # Determine category based on LKMS range
            lkms_num = service["order"]
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
                "name": service["code"],
                "display": service["name_sk"],
                "docker_name": service["container"],
                "category": category,
                "order": lkms_num
            })

    return services


def load_stats():
    """Load shutdown statistics from JSON file."""
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
    """Save shutdown statistics with per-service times.

    Args:
        duration: Total shutdown duration
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


def stop_native_service():
    """Stop LKMS801 native service."""
    try:
        # Kill process by command-line pattern matching (both python and pythonw)
        # Using Get-CimInstance because Get-Process doesn't have CommandLine property
        # Filter: *app.main* matches service launch command (pythonw -m app.main)
        subprocess.run(
            [
                'powershell', '-Command',
                "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | "
                "Where-Object {($_.Name -eq 'python.exe' -or $_.Name -eq 'pythonw.exe') -and $_.CommandLine -like '*app.main*'} | "
                "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
            ],
            check=False,
            capture_output=True,
            timeout=10,
            creationflags=CREATE_NO_WINDOW
        )

        # Wait and verify process is stopped
        time.sleep(1)
        result = subprocess.run(
            [
                'powershell', '-Command',
                "(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | "
                "Where-Object {($_.Name -eq 'python.exe' -or $_.Name -eq 'pythonw.exe') -and $_.CommandLine -like '*app.main*'}).Count"
            ],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=CREATE_NO_WINDOW
        )

        # If count is 0 or empty, service is stopped
        count = result.stdout.strip()
        return count == '' or count == '0'

    except Exception:
        return False


def stop_docker_service(service_name):
    """Stop a single Docker service via docker-compose stop."""
    try:
        subprocess.run(
            ['docker-compose', 'stop', service_name],
            cwd=WORKING_DIR,
            check=True,
            capture_output=True,
            timeout=60,
            creationflags=CREATE_NO_WINDOW
        )
        return True
    except Exception:
        return False


def check_container_stopped(container_name, timeout=30):
    """Check if Docker container is stopped."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            result = subprocess.run(
                ['docker', 'inspect', '--format={{.State.Status}}', container_name],
                capture_output=True,
                text=True,
                timeout=5,
                creationflags=CREATE_NO_WINDOW
            )

            if result.returncode != 0:
                # Container not found = stopped/removed
                return True

            status = result.stdout.strip()
            if status in ["exited", "stopped", "created"]:
                return True

            time.sleep(1)

        except Exception:
            time.sleep(1)

    return False


def stop_docker_compose():
    """Stop docker-compose services."""
    try:
        subprocess.run(
            ['docker-compose', 'stop'],
            cwd=WORKING_DIR,
            check=True,
            capture_output=True,
            timeout=60,
            creationflags=CREATE_NO_WINDOW
        )
        return True
    except Exception:
        return False


# === GUI CLASS ===
class ShutdownOrchestratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("🛑 L-KERN Shutdown Orchestrator")
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
        self.root.attributes('-topmost', True)  # Stay on top during shutdown
        # Don't disable topmost - keep window visible during process termination

        # Variables
        self.start_time = None
        self.service_labels = {}
        self.services = load_services_registry()  # Load from central registry

        # Create UI
        self.create_ui()

        # Start shutdown in background thread
        threading.Thread(target=self.run_shutdown, daemon=True).start()

    def create_ui(self):
        """Create GUI layout."""
        # Header
        header_frame = tk.Frame(self.root, bg=COLORS['panel_bg'], relief=tk.RAISED, bd=2)
        header_frame.pack(fill=tk.X, padx=10, pady=10)

        title = tk.Label(
            header_frame,
            text="🛑 L-KERN SYSTEM SHUTDOWN",
            font=('Segoe UI', 16, 'bold'),
            fg=COLORS['warning'],
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
            stats_text = "⏱️  Current: 00:00:000  |  📊 First shutdown - no statistics yet"

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
            text="⏳ Starting shutdown...",
            font=('Segoe UI', 11, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['bg'],
            anchor='w'
        )
        self.status_label.pack(fill=tk.X, pady=(0, 15))

        # Service list (grouped by category)
        services_frame = tk.Frame(progress_frame, bg=COLORS['bg'])
        services_frame.pack(fill=tk.BOTH, expand=True)

        # Native service (displayed first in System category)
        system_label = tk.Label(
            services_frame,
            text="📁 800-899 System",
            font=('Segoe UI', 10, 'bold'),
            fg=COLORS['info'],
            bg=COLORS['bg']
        )
        system_label.pack(pady=(10, 5), anchor='w')

        self.native_label = self.create_service_row(
            services_frame,
            "lkms801-system-ops",
            "System Operations Service"
        )

        # Group Docker services by category
        categories = {}
        for service in self.services:
            category = service.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append(service)

        # Sort services within each category by order (ascending)
        for category in categories:
            categories[category].sort(key=lambda s: s['order'])

        # Display Docker services grouped by category
        category_order = ['100-199 Business', '200-299 Frontend', '500-599 Data', '900-999 Dev Tools', 'Other']
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

    def run_shutdown(self):
        """Run shutdown sequence with PARALLEL service stops and per-service timing."""
        self.start_time = time.time()
        total_steps = 1 + len(self.services)  # Native + N Docker services
        completed_steps = 0

        # Load stats for display (both total and per-service)
        stats = load_stats()
        total_stats = stats.get("total", {"last": 0, "average": 0})
        service_stats = stats.get("services", {})

        # Track per-service times for this shutdown
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
                        text=f"⏱️  Current: {current_time}  |  📊 First shutdown - no statistics yet"
                    )

                # Schedule next update
                self.root.after(100, update_live_timer)

        # Start timer
        update_live_timer()

        try:
            # Step 1: Stop native service
            self.status_label.config(text="🛑 Stopping LKMS801 System Operations Service...")
            self.update_service_status(self.native_label, 'working', 'Stopping...')

            service_name = "lkms801-native"
            service_last = service_stats.get(service_name, {}).get("last", 0)
            service_avg = service_stats.get(service_name, {}).get("average", 0)

            native_start = time.time()
            native_finished = [False]  # Mutable flag for closure

            # Start live timer for native service
            def update_native_timer():
                """Update native service timer live every 100ms."""
                if not native_finished[0]:
                    current_time = time.time() - native_start
                    time_text = format_three_times(current_time, service_last, service_avg)
                    self.native_label['time'].config(text=time_text)
                    # Schedule next update
                    self.root.after(100, update_native_timer)

            # Start timer
            update_native_timer()

            # Stop native service in background thread (non-blocking)
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(stop_native_service)
                native_success = future.result()  # Wait for result

            # Mark as finished (stops live timer)
            native_finished[0] = True

            # Calculate final time and display
            native_duration = time.time() - native_start
            service_times[service_name] = native_duration
            time_text = format_three_times(native_duration, service_last, service_avg)

            if native_success:
                self.native_label['time'].config(text=time_text, fg=COLORS['success'])
                self.update_service_status(self.native_label, 'success', 'Stopped')
            else:
                self.native_label['time'].config(text=time_text, fg=COLORS['error'])
                self.update_service_status(self.native_label, 'error', 'Not Stopped')

            completed_steps += 1
            self.progress_bar['value'] = (completed_steps / total_steps) * 100

            time.sleep(0.5)

            # Step 2: Stop all Docker services in PARALLEL
            self.status_label.config(text="📦 Stopping all Docker containers in parallel...")

            # Mark all services as "Stopping..." immediately and record start time
            service_start_times = {}
            service_finished = {}  # Track which services finished stopping

            for service in self.services:
                label = self.service_labels[service["docker_name"]]
                self.update_service_status(label, 'working', 'Stopping...')
                service_start_times[service["docker_name"]] = time.time()
                service_finished[service["docker_name"]] = False

            # Start live timer updates for all services (runs in main GUI thread)
            def update_all_service_timers():
                """Update all service timers live every 100ms (thread-safe)."""
                for service in self.services:
                    service_name = service["docker_name"]

                    # Only update timers for services still stopping
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

            # Create thread for each service to stop
            import concurrent.futures
            results = {}

            def stop_and_check(service):
                """Stop service and check if stopped, return result with timing."""
                service_name = service["docker_name"]
                service_start = service_start_times[service_name]

                # Stop the service
                stop_success = stop_docker_service(service_name)

                # Check if stopped
                is_stopped = check_container_stopped(service_name) if stop_success else False

                service_duration = time.time() - service_start
                return (service, is_stopped, service_duration)

            # Start all stops in parallel
            with concurrent.futures.ThreadPoolExecutor(max_workers=len(self.services)) as executor:
                future_to_service = {executor.submit(stop_and_check, service): service for service in self.services}

                for future in concurrent.futures.as_completed(future_to_service):
                    service, is_stopped, service_duration = future.result()
                    service_name = service["docker_name"]
                    label = self.service_labels[service_name]

                    # Mark service as finished (stops live timer for this service)
                    service_finished[service_name] = True

                    # Track service time for stats
                    service_times[service_name] = service_duration

                    # Get historical stats for this service
                    service_last = service_stats.get(service_name, {}).get("last", 0)
                    service_avg = service_stats.get(service_name, {}).get("average", 0)

                    # Display final time: Current, Last, Average
                    time_text = format_three_times(service_duration, service_last, service_avg)
                    label['time'].config(text=time_text)

                    if is_stopped:
                        label['time'].config(text=time_text, fg=COLORS['success'])
                        self.update_service_status(label, 'success', 'Stopped')
                        results[service_name] = True
                    else:
                        label['time'].config(text=time_text, fg=COLORS['error'])
                        self.update_service_status(label, 'error', 'Not Stopped')
                        results[service_name] = False

                    # Update progress bar
                    completed_steps += 1
                    self.progress_bar['value'] = (completed_steps / total_steps) * 100

                    # Update time label live
                    current_duration = time.time() - self.start_time
                    self.time_label.config(
                        text=f"⏱️  Elapsed: {format_time(current_duration)}  |  {completed_steps}/{total_steps} services stopped"
                    )

            # Calculate duration
            duration = time.time() - self.start_time

            # Save stats (both total and per-service)
            stats = save_stats(duration, service_times)
            total_stats = stats.get("total", {"last": 0, "average": 0})

            # Check if all stopped
            all_stopped = all(results.values())

            # Show result
            if all_stopped:
                self.status_label.config(
                    text="✅ All services stopped successfully!",
                    fg=COLORS['success']
                )
            else:
                self.status_label.config(
                    text="⚠️  Some services not stopped",
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
    app = ShutdownOrchestratorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        sys.exit(1)
