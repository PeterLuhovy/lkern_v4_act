"""
================================================================
FILE: shutdown_orchestrator.py
PATH: /tools/lkern-control-panel/shutdown_orchestrator.py
DESCRIPTION: L-KERN system shutdown orchestrator with live timing (MM:SS:MS) + per-service stats
VERSION: v3.0.0
UPDATED: 2025-11-24 13:45:00
================================================================
"""

# === IMPORTS ===
import subprocess
import time
import json
import sys
import threading
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import ttk

# === CONSTANTS ===
STATS_FILE = Path(__file__).parent / "shutdown_stats.json"
REGISTRY_FILE = Path(__file__).parent / "services_registry.json"
WORKING_DIR = Path("L:/system/lkern_codebase_v4_act")

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

    # Build services list ordered by LKMS number (for display)
    services = []
    for service in sorted(registry["services"], key=lambda s: s["order"]):
        if service["type"] == "docker":
            services.append({
                "name": service["code"],
                "display": service["name_sk"],
                "docker_name": service["container"]
            })

    return services


def load_stats():
    """Load shutdown statistics from JSON file."""
    if STATS_FILE.exists():
        with open(STATS_FILE, 'r') as f:
            return json.load(f)
    return {
        "history": [],
        "average": 0,
        "last": 0
    }


def save_stats(duration):
    """Save shutdown statistics."""
    stats = load_stats()

    # Add current duration
    stats["history"].append({
        "timestamp": datetime.now().isoformat(),
        "duration": duration
    })

    # Keep only last 50 shutdowns
    stats["history"] = stats["history"][-50:]

    # Calculate average
    stats["average"] = sum(h["duration"] for h in stats["history"]) / len(stats["history"])

    # Update last
    stats["last"] = duration

    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f, indent=2)

    return stats


def stop_native_service():
    """Stop LKMS801 native service."""
    try:
        # Kill process by command-line pattern matching (both python and pythonw)
        subprocess.run(
            [
                'powershell', '-Command',
                "Get-Process python,pythonw -ErrorAction SilentlyContinue | "
                "Where-Object {$_.CommandLine -like '*lkms801-system-ops*'} | "
                "Stop-Process -Force"
            ],
            check=False,
            capture_output=True,
            timeout=10
        )

        # Wait and verify process is stopped
        time.sleep(1)
        result = subprocess.run(
            [
                'powershell', '-Command',
                "(Get-Process python,pythonw -ErrorAction SilentlyContinue | "
                "Where-Object {$_.CommandLine -like '*lkms801-system-ops*'}).Count"
            ],
            capture_output=True,
            text=True,
            timeout=5
        )

        # If count is 0 or empty, service is stopped
        count = result.stdout.strip()
        return count == '' or count == '0'

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
                timeout=5
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
            timeout=60
        )
        return True
    except Exception:
        return False


# === GUI CLASS ===
class ShutdownOrchestratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("🛑 L-KERN Shutdown Orchestrator")
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
        if stats["last"] > 0:
            last_time = format_time(stats['last'])
            avg_time = format_time(stats['average'])
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

        # Service list
        services_frame = tk.Frame(progress_frame, bg=COLORS['bg'])
        services_frame.pack(fill=tk.BOTH, expand=True)

        # Native service
        self.native_label = self.create_service_row(
            services_frame,
            "LKMS801 System Operations Service"
        )

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

    def run_shutdown(self):
        """Run shutdown sequence with live timing and per-service stats."""
        self.start_time = time.time()
        total_steps = 2 + len(self.services)  # Native + Docker stop + N services
        current_step = 0

        # Load stats for display
        stats = load_stats()

        # Start live timer update
        def update_live_timer():
            """Update live timer on stats label."""
            if current_step < total_steps:
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

            native_start = time.time()
            if stop_native_service():
                native_duration = time.time() - native_start
                self.native_label['time'].config(text=format_time(native_duration), fg=COLORS['success'])
                self.update_service_status(self.native_label, 'success', 'Stopped')
            else:
                native_duration = time.time() - native_start
                self.native_label['time'].config(text=format_time(native_duration), fg=COLORS['error'])
                self.update_service_status(self.native_label, 'error', 'Not Stopped')

            current_step += 1
            self.progress_bar['value'] = (current_step / total_steps) * 100

            time.sleep(0.5)

            # Step 2: Stop Docker Compose
            self.status_label.config(text="📦 Stopping Docker containers...")

            if stop_docker_compose():
                current_step += 1
                self.progress_bar['value'] = (current_step / total_steps) * 100

            time.sleep(0.5)

            # Step 3: Wait for each service to stop
            self.status_label.config(text="⏳ Verifying services stopped...")

            all_stopped = True
            for service in self.services:
                label = self.service_labels[service["docker_name"]]
                self.update_service_status(label, 'working', 'Checking...')

                service_start = time.time()
                if check_container_stopped(service["docker_name"]):
                    service_duration = time.time() - service_start
                    label['time'].config(text=format_time(service_duration), fg=COLORS['success'])
                    self.update_service_status(label, 'success', 'Stopped')
                else:
                    service_duration = time.time() - service_start
                    label['time'].config(text=format_time(service_duration), fg=COLORS['error'])
                    self.update_service_status(label, 'error', 'Not Stopped')
                    all_stopped = False

                current_step += 1
                self.progress_bar['value'] = (current_step / total_steps) * 100

            # Calculate duration
            duration = time.time() - self.start_time

            # Save stats
            stats = save_stats(duration)

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
