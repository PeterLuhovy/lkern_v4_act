"""
================================================================
FILE: main.py
PATH: /tools/lkern-control-panel/main.py
DESCRIPTION: L-KERN Control Panel - Tkinter GUI with background threading (uses central services registry)
VERSION: v1.18.0
UPDATED: 2025-11-25 11:20:00
CHANGELOG:
  v1.18.0 - Unified status check logic: Now uses shared docker_utils.py functions
         - check_container_status() now uses check_docker_status() from docker_utils
         - check_native_status() now uses check_native_status() from docker_utils
         - Ensures consistent status detection with orchestrators
  v1.17.0 - Fixed LKMS801 not starting: Changed WorkingDirectory to absolute path (was relative, failed to start)
  v1.16.0 - Removed ALL wait times from BOSS START - orchestrator checks longer until services respond
  v1.15.0 - Added pulsing animation to status labels (bold/normal) when services are starting/restarting
  v1.14.2 - Removed emoji from Docker-All button labels in config.json (cleaner UI)
  v1.14.1 - Removed emoji processing from Docker-All buttons: Using labels as-is from config.json
  v1.14.0 - Fixed emoji removal in Docker-All buttons: Using proper Unicode ranges instead of simple regex
  v1.13.9 - Changed tab order: Microservices tab is now first (default), Build & Test second
  v1.13.8 - Fixed BOSS Start input redirection error: Changed from "start /b" to PowerShell Start-Process
  v1.13.7 - Fixed BOSS Start input redirection error: Added empty window title "" before /B and /b flags (didn't work)
  v1.13.6 - Fixed UTF-8 BOM handling in config.json (use utf-8-sig encoding)
  v1.13.5 - Faster status refresh: Changed interval from 1000ms to 500ms (2x faster updates)
  v1.13.4 - Fixed BOSS buttons: Added /B flag to prevent console windows (BOSS Start, Stop, Clean)
  v1.13.3 - Fixed native service CommandLine filter (*app.main*) + pythonw for hidden execution
================================================================
"""

import tkinter as tk
from tkinter import ttk, scrolledtext
import json
import os
import webbrowser
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from executor import CommandExecutor

# Dark theme colors (VSCode inspired)
COLORS = {
    'bg': '#1e1e1e',  # Window background
    'fg': '#d4d4d4',  # Text
    'text_muted': '#9e9e9e',  # Muted text
    'button_bg': '#3c3c3c',  # Button default
    'button_hover': '#505050',  # Button hover
    'button_active': '#007acc',  # Button active/pressed
    'terminal_bg': '#0d0d0d',  # Terminal background
    'terminal_fg': '#d4d4d4',  # Terminal text
    'success': '#00ff00',  # Success messages
    'error': '#ff5555',  # Error messages
    'info': '#569cd6',  # Info messages
    'warning': '#FFA500',  # Warning (starting/restarting)
    'checkbox': '#007acc',  # Checkbox accent
    'border': '#3c3c3c',  # Borders
}

FONTS = {
    'terminal': ('Consolas', 10),
    'ui': ('Segoe UI', 9),
    'button': ('Arial', 10),  # Changed to Arial - Segoe UI may have centering issues
}

# === CONSTANTS ===
REGISTRY_FILE = os.path.join(os.path.dirname(__file__), 'services_registry.json')


# === HELPER FUNCTIONS ===
def load_services_registry():
    """Load services from central registry and convert to Control Panel format."""
    with open(REGISTRY_FILE, 'r', encoding='utf-8') as f:
        registry = json.load(f)

    # Build containers list in LKMS order
    containers = []
    for service in sorted(registry["services"], key=lambda s: s["order"]):
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

        # Build ports string
        ports_list = []
        if service.get("ports"):
            for port_type, port_num in service["ports"].items():
                ports_list.append(f":{port_num}")
        ports_str = "/".join(ports_list) if ports_list else ""

        # Build container entry
        container = {
            'name': service["container"] if service["container"] else service["code"],
            'lkms_id': service["code"],
            'service_name': service["name_sk"],
            'ports': ports_str,
            'category': category
        }

        # Add native service specific fields
        if service["type"] == "native":
            container['is_native'] = True
            container['health_url'] = service.get("health_check")

        containers.append(container)

    return containers


class LKernControlPanel:
    """
    L-KERN Control Panel - Development workflow automation tool.
    """

    def __init__(self, root):
        self.root = root
        self.config = self.load_config()
        self.executor = CommandExecutor(self.config['app']['working_directory'])
        self.command_history = []
        self.auto_scroll_enabled = tk.BooleanVar(value=self.config['ui'].get('auto_scroll_default', True))

        # Track current command
        self.current_command = None
        self.current_command_label = None

        # Track active log follow buttons (container_name -> (button, is_auto))
        # is_auto: True = auto-follow from restart (orange, disabled), False = manual (green, toggleable)
        self.active_log_buttons = {}

        # Track pending button reset after command completion (button to reset to normal color)
        self.pending_visual_feedback = None

        # Track terminal tabs (container_name -> tab data)
        # Tab data: {'frame': Frame, 'terminal': ScrolledText, 'executor': CommandExecutor, 'button': Button, 'service_name': str}
        self.terminal_tabs = {}

        # Load container list from central registry
        self.containers = load_services_registry()

        # UI components
        self.paned_window = None  # Store reference for sash position

        # Background thread pool for container status checks (non-blocking)
        self.status_thread_pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix="status_check")

        # Track status label animations (label -> after_id)
        self.status_animations = {}

        # Setup window
        self.setup_window()
        self.setup_styles()
        self.create_ui()

    def load_config(self):
        """Load configuration from config.json"""
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')
        try:
            with open(config_path, 'r', encoding='utf-8-sig') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default config if file not found
            return {
                'app': {
                    'name': 'L-KERN Control Panel',
                    'version': '1.0.0',
                    'working_directory': os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
                },
                'ui': {
                    'window_width': 1200,
                    'window_height': 700,
                    'auto_scroll_default': True,
                    'max_history': 20
                },
                'commands': {}
            }

    def setup_window(self):
        """Configure main window"""
        app_name = self.config['app']['name']
        app_version = self.config['app']['version']
        self.root.title(f"{app_name} v{app_version}")

        width = self.config['ui']['window_width']
        height = self.config['ui']['window_height']
        self.root.geometry(f"{width}x{height}")
        self.root.minsize(800, 600)
        self.root.configure(bg=COLORS['bg'])

        # Bring window to front
        self.root.lift()
        self.root.focus_force()

    def setup_styles(self):
        """Configure ttk styles for dark theme"""
        style = ttk.Style()
        style.theme_use('clam')

        # Configure colors
        style.configure('.', background=COLORS['bg'], foreground=COLORS['fg'])
        style.configure('TFrame', background=COLORS['bg'])
        style.configure('TLabel', background=COLORS['bg'], foreground=COLORS['fg'], font=FONTS['ui'])
        style.configure('TLabelframe', background=COLORS['bg'], foreground=COLORS['fg'], bordercolor=COLORS['border'])
        style.configure('TLabelframe.Label', font=FONTS['button'])
        style.configure('TCheckbutton', background=COLORS['bg'], foreground=COLORS['fg'], font=FONTS['ui'])

        # Checkbutton hover/active states
        style.map('TCheckbutton',
                  background=[('active', COLORS['bg']), ('pressed', COLORS['bg'])],
                  foreground=[('active', COLORS['success']), ('pressed', COLORS['success'])])

        # Button style
        style.configure('TButton',
                       background=COLORS['button_bg'],
                       foreground=COLORS['fg'],
                       bordercolor=COLORS['border'],
                       font=FONTS['button'],
                       padding=(10, 8))

        # CRITICAL: Force text centering by modifying button layout
        # On Windows, ttk.Button ignores anchor parameter, so we must modify layout
        style.layout('TButton', [
            ('Button.border', {
                'sticky': 'nswe',
                'border': '1',
                'children': [
                    ('Button.focus', {
                        'sticky': 'nswe',
                        'children': [
                            ('Button.padding', {
                                'sticky': 'nswe',
                                'children': [
                                    ('Button.label', {'sticky': ''})  # Empty sticky = CENTER text
                                ]
                            })
                        ]
                    })
                ]
            })
        ])

        style.map('TButton',
                  background=[('active', COLORS['button_hover']), ('pressed', COLORS['button_active'])],
                  foreground=[('disabled', '#666666')])

        # Notebook (tabs) style
        style.configure('TNotebook', background=COLORS['bg'], borderwidth=0)
        style.configure('TNotebook.Tab',
                       background=COLORS['button_bg'],
                       foreground=COLORS['fg'],
                       padding=(15, 8),
                       font=FONTS['button'])
        style.map('TNotebook.Tab',
                  background=[('selected', COLORS['button_active'])],
                  foreground=[('selected', '#ffffff')],
                  padding=[])

    def start_status_animation(self, label):
        """Start pulsing animation for status label (bold <-> normal)."""
        if label in self.status_animations:
            return  # Animation already running

        bold_state = [True]  # Mutable state for closure

        def animate():
            try:
                if bold_state[0]:
                    label.config(font=('Segoe UI', 9, 'bold'))
                else:
                    label.config(font=('Segoe UI', 9))
                bold_state[0] = not bold_state[0]

                # Schedule next update
                after_id = self.root.after(500, animate)
                self.status_animations[label] = after_id
            except:
                # Label destroyed or error - stop animation
                self.stop_status_animation(label)

        animate()

    def stop_status_animation(self, label):
        """Stop pulsing animation for status label."""
        if label in self.status_animations:
            self.root.after_cancel(self.status_animations[label])
            del self.status_animations[label]
            try:
                # Reset to normal font
                label.config(font=('Segoe UI', 9))
            except:
                pass

    def create_ui(self):
        """Create main UI layout"""
        # Top toolbar
        self.create_toolbar()

        # Main content (split panel)
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))

        # Create PanedWindow for resizable split (replaces fixed-width layout)
        # Using tk.PanedWindow (not ttk) because it supports minsize parameter
        self.paned_window = tk.PanedWindow(
            main_frame,
            orient=tk.HORIZONTAL,
            sashwidth=5,
            sashrelief=tk.RAISED,
            bg=COLORS['bg'],
            bd=0
        )
        self.paned_window.pack(fill=tk.BOTH, expand=True)

        # Left panel - Tabbed interface (resizable, initial width ~693px)
        left_panel = ttk.Frame(self.paned_window)

        # === L-KERN BOSS CONTROL PANEL (above tabs) ===
        self.create_boss_control_panel(left_panel)

        left_notebook = ttk.Notebook(left_panel)
        left_notebook.pack(fill=tk.BOTH, expand=True)

        # Microservices tab (first tab) - includes Docker and Native services
        microservices_tab = ttk.Frame(left_notebook)
        left_notebook.add(microservices_tab, text="⚙️ Microservices")
        self.create_microservices_buttons(microservices_tab)

        # Commands tab (second tab)
        commands_tab = ttk.Frame(left_notebook)
        left_notebook.add(commands_tab, text="🔧 Build & Test")
        self.create_command_buttons(commands_tab)

        # Right panel - Terminal + History
        right_panel = ttk.Frame(self.paned_window)
        self.create_terminal_panel(right_panel)
        self.create_history_panel(right_panel)

        # Add panels to PanedWindow
        # Left panel: minsize=800px, width=800px sets initial size
        # Right panel: no width specified, takes remaining space
        self.paned_window.add(left_panel, minsize=800, width=800)
        self.paned_window.add(right_panel)

    def create_boss_control_panel(self, parent):
        """Create L-KERN BOSS system control panel with START/STOP buttons"""
        # Main panel frame with border and background
        panel = tk.Frame(
            parent,
            bg='#2c3e50',
            relief=tk.RAISED,
            bd=2
        )
        panel.pack(fill=tk.X, padx=10, pady=10)

        # Title section
        title_frame = tk.Frame(panel, bg='#2c3e50')
        title_frame.pack(pady=(10, 5))

        title_label = tk.Label(
            title_frame,
            text="⚙️ L-KERN BOSS",
            font=('Segoe UI', 14, 'bold'),
            fg='#ecf0f1',
            bg='#2c3e50'
        )
        title_label.pack()

        subtitle_label = tk.Label(
            title_frame,
            text="Business Operating System Service",
            font=('Segoe UI', 9),
            fg='#95a5a6',
            bg='#2c3e50'
        )
        subtitle_label.pack()

        # Buttons section
        buttons_frame = tk.Frame(panel, bg='#2c3e50')
        buttons_frame.pack(pady=(5, 10), padx=20)

        # START button (green)
        start_button = tk.Button(
            buttons_frame,
            text="🚀 BOSS START",
            font=('Segoe UI', 11, 'bold'),
            bg='#27ae60',
            fg='#ffffff',
            activebackground='#229954',
            activeforeground='#ffffff',
            relief=tk.RAISED,
            bd=2,
            padx=15,
            pady=10,
            cursor='hand2',
            command=lambda: self.boss_start_system()
        )
        start_button.pack(side=tk.LEFT, padx=5)

        # STOP button (orange)
        stop_button = tk.Button(
            buttons_frame,
            text="⏸️ BOSS STOP",
            font=('Segoe UI', 11, 'bold'),
            bg='#f39c12',
            fg='#ffffff',
            activebackground='#e67e22',
            activeforeground='#ffffff',
            relief=tk.RAISED,
            bd=2,
            padx=15,
            pady=10,
            cursor='hand2',
            command=lambda: self.boss_stop_system()
        )
        stop_button.pack(side=tk.LEFT, padx=5)

        # CLEAN button (red)
        clean_button = tk.Button(
            buttons_frame,
            text="🗑️ BOSS CLEAN",
            font=('Segoe UI', 11, 'bold'),
            bg='#c0392b',
            fg='#ffffff',
            activebackground='#a93226',
            activeforeground='#ffffff',
            relief=tk.RAISED,
            bd=2,
            padx=15,
            pady=10,
            cursor='hand2',
            command=lambda: self.boss_clean_system()
        )
        clean_button.pack(side=tk.LEFT, padx=5)

        # Status info section
        info_frame = tk.Frame(panel, bg='#34495e', relief=tk.SUNKEN, bd=1)
        info_frame.pack(fill=tk.X, padx=10, pady=(0, 10))

        info_label = tk.Label(
            info_frame,
            text="💡 START: Spustí kontajnery | STOP: Zastaví (data zostanú) | CLEAN: Odstráni kontajnery (data zostanú)",
            font=('Segoe UI', 9),
            fg='#bdc3c7',
            bg='#34495e',
            pady=5
        )
        info_label.pack()

    def boss_start_system(self):
        """Start entire L-KERN system with orchestrator"""
        working_dir = self.config['app']['working_directory']
        lkms801_dir = f"{working_dir}\\services\\lkms801-system-ops"
        self.execute_command(
            f'powershell -Command "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {{($_.Name -eq \'python.exe\' -or $_.Name -eq \'pythonw.exe\') -and $_.CommandLine -like \'*app.main*\'}} | ForEach-Object {{ Stop-Process -Id $_.ProcessId -Force }}; Start-Sleep -Seconds 1; Start-Process pythonw -ArgumentList \'-m\',\'app.main\' -WindowStyle Hidden -WorkingDirectory \'{lkms801_dir}\'; Start-Process pythonw -ArgumentList \'tools\\lkern-control-panel\\startup_orchestrator.py\' -WindowStyle Hidden"',
            "🚀 BOSS START"
        )

    def boss_stop_system(self):
        """Stop entire L-KERN system with orchestrator"""
        self.execute_command(
            'powershell -Command "Start-Process pythonw -ArgumentList \'tools\\lkern-control-panel\\shutdown_orchestrator.py\' -WindowStyle Hidden"',
            "⏸️ BOSS STOP"
        )

    def boss_clean_system(self):
        """Clean L-KERN system with orchestrator (remove containers and volumes)"""
        self.execute_command(
            'powershell -Command "Start-Process pythonw -ArgumentList \'tools\\lkern-control-panel\\cleanup_orchestrator.py\' -WindowStyle Hidden"',
            "🗑️ BOSS CLEAN"
        )

    def create_toolbar(self):
        """Create top toolbar with Stop and Clear buttons"""
        toolbar = ttk.Frame(self.root)
        toolbar.pack(fill=tk.X, padx=10, pady=10)

        # App title
        title_label = ttk.Label(toolbar, text="🔧 L-KERN Control Panel", font=('Segoe UI', 12, 'bold'))
        title_label.pack(side=tk.LEFT)

        # Stop button
        self.stop_button = ttk.Button(toolbar, text="⏹ Stop", command=self.stop_command, state='disabled')
        self.stop_button.pack(side=tk.RIGHT, padx=5)

        # Clear Terminal button
        clear_button = ttk.Button(toolbar, text="🗑️ Clear", command=self.clear_terminal)
        clear_button.pack(side=tk.RIGHT, padx=5)

    def create_command_buttons(self, parent):
        """Create preset command buttons - COMPLETE REBUILD"""
        # Simple container frame
        container = ttk.Frame(parent)
        container.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

        # Workflow hint box at the top
        hint_label = ttk.Label(
            container,
            text="💡 Recommended Workflow",
            font=('Segoe UI', 11, 'bold'),
            foreground=COLORS['info']
        )
        hint_label.pack(pady=(0, 5))

        hint_text = tk.Text(
            container,
            height=4,
            width=30,
            wrap=tk.WORD,
            bg=COLORS['bg'],
            fg=COLORS['info'],
            font=FONTS['ui'],
            relief=tk.SOLID,
            bd=1,
            state='disabled'
        )
        hint_text.pack(pady=(0, 15))

        # Insert workflow hint
        hint_text.config(state='normal')
        hint_text.insert('1.0', "1. Clean cache\n2. Lint All (1-3s)\n3. Test All (10-20s)\n4. Build All (30-60s)")
        hint_text.config(state='disabled')

        # Group commands by category
        categories = {}
        for cmd_id, cmd_data in self.config['commands'].items():
            category = cmd_data.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append((cmd_id, cmd_data))

        # Define category display order
        category_order = ['Lint', 'Build', 'Test', 'Other']

        # Create each category section
        for category in category_order:
            if category in categories:
                commands = categories[category]

                # Category label
                cat_label = ttk.Label(
                    container,
                    text=category,
                    font=('Segoe UI', 11, 'bold'),
                    foreground=COLORS['fg']
                )
                cat_label.pack(pady=(10, 5))

                # Create buttons for this category
                for cmd_id, cmd_data in commands:
                    # Use tk.Button with explicit width in pixels
                    btn = tk.Button(
                        container,
                        text=cmd_data['label'],
                        command=lambda c=cmd_data['command'], l=cmd_data['label']: self.execute_command(c, l),
                        bg=COLORS['button_bg'],
                        fg=COLORS['fg'],
                        font=FONTS['button'],
                        relief=tk.RAISED,
                        bd=2,
                        width=20,  # Characters width
                        height=1,
                        cursor='hand2',
                        activebackground=COLORS['button_hover'],
                        activeforeground=COLORS['fg']
                    )
                    btn.pack(pady=2)

                # Separator after category
                ttk.Separator(container, orient='horizontal').pack(fill=tk.X, pady=10)

    def create_microservices_buttons(self, parent):
        """Create microservices list with Docker containers and Native services"""
        # Container frame
        container_frame = ttk.Frame(parent)
        container_frame.pack(fill=tk.BOTH, expand=True)

        # Scrollable container
        canvas = tk.Canvas(container_frame, bg=COLORS['bg'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        def update_scrollregion(event=None):
            """Update scroll region and show/hide scrollbar based on content size"""
            canvas.configure(scrollregion=canvas.bbox("all"))
            # Show scrollbar only if content exceeds canvas height
            if scrollable_frame.winfo_reqheight() > canvas.winfo_height():
                scrollbar.pack(side=tk.RIGHT, fill=tk.Y, pady=20, padx=(0, 20))
            else:
                scrollbar.pack_forget()

        scrollable_frame.bind("<Configure>", update_scrollregion)
        canvas.bind("<Configure>", update_scrollregion)

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(20, 0), pady=10)

        # --- GLOBAL CONTROLS SECTION ---
        global_label = ttk.Label(
            scrollable_frame,
            text="🐳 All Containers",
            font=('Segoe UI', 12, 'bold'),
            foreground=COLORS['info']
        )
        global_label.pack(pady=(0, 10))

        # Global control buttons in single row (from config.json Docker-All category)
        global_frame = ttk.Frame(scrollable_frame)
        global_frame.pack(pady=(0, 15))

        # Load Docker-All commands from config.json
        docker_all_commands = []
        for cmd_id, cmd_data in self.config['commands'].items():
            if cmd_data.get('category') == 'Docker-All':
                label_text = cmd_data['label']
                docker_all_commands.append((label_text, cmd_data['command'], cmd_data['label']))

        # Sort by specific order for consistent layout
        command_order = ['Start All', 'Stop All', 'Restart All', 'Rebuild All', 'List Containers', 'Down (Remove)', 'Clean (+ Volumes)']
        docker_all_commands.sort(key=lambda x: command_order.index(x[2]) if x[2] in command_order else 999)

        # Create buttons in two rows (4 buttons per row) with wider width (~33% increase from 15 to 20)
        row = 0
        col = 0
        buttons_per_row = 4
        for label_text, cmd, original_label in docker_all_commands:
            btn = tk.Button(
                global_frame,
                text=label_text,
                command=lambda c=cmd, l=original_label: self.execute_command(c, l),
                bg=COLORS['button_bg'],
                fg=COLORS['fg'],
                font=('Arial', 9),
                relief=tk.RAISED,
                bd=1,
                width=20,  # Increased from 15 to 20 (~33% wider)
                cursor='hand2',
                activebackground=COLORS['button_hover']
            )
            btn.grid(row=row, column=col, padx=3, pady=2)
            col += 1
            if col >= buttons_per_row:
                col = 0
                row += 1

        ttk.Separator(scrollable_frame, orient='horizontal').pack(fill=tk.X, pady=15)

        # --- INDIVIDUAL CONTAINERS SECTION ---
        containers_label = ttk.Label(
            scrollable_frame,
            text="📦 Containers & Microservices by Category",
            font=('Segoe UI', 12, 'bold'),
            foreground=COLORS['fg']
        )
        containers_label.pack(pady=(0, 10))

        # Group containers by category
        categories = {}
        for container in self.containers:
            category = container.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append(container)

        # Display containers grouped by category
        category_order = ['100-199 Business', '200-299 Frontend', '500-599 Data', '800-899 System', '900-999 Dev Tools', 'Other']
        for category_name in category_order:
            if category_name in categories:
                # Category header
                category_label = ttk.Label(
                    scrollable_frame,
                    text=f"📁 {category_name}",
                    font=('Segoe UI', 11, 'bold'),
                    foreground=COLORS['info']
                )
                category_label.pack(pady=(10, 5))

                # Create container rows for this category
                for container_info in categories[category_name]:
                    self.create_container_row(scrollable_frame, container_info)

                # Separator after category (except last)
                if category_name != category_order[-1]:
                    ttk.Separator(scrollable_frame, orient='horizontal').pack(fill=tk.X, pady=10)

    def create_container_row(self, parent, container_info):
        """Create a row for a single container with 4 columns: lkms_id | service_name | ports | status | actions"""
        container_name = container_info['name']
        lkms_id = container_info.get('lkms_id', container_name)
        service_name = container_info.get('service_name', 'Unknown')
        ports = container_info.get('ports', '')
        is_native = container_info.get('is_native', False)
        health_url = container_info.get('health_url', None)

        # Container frame
        row_frame = tk.Frame(parent, bg=COLORS['bg'])
        row_frame.pack(fill=tk.X, pady=3)

        # === COLUMN 1: LKMS ID (selectable text) ===
        lkms_entry = tk.Entry(
            row_frame,
            font=('Consolas', 9),
            bg=COLORS['bg'],
            fg=COLORS['text_muted'],
            width=18,
            relief=tk.FLAT,
            readonlybackground=COLORS['bg'],
            insertwidth=0,  # Hide cursor
            highlightthickness=0,
            borderwidth=0
        )
        lkms_entry.insert(0, lkms_id)
        lkms_entry.config(state='readonly')
        lkms_entry.pack(side=tk.LEFT, padx=(0, 5))

        # === COLUMN 2: SERVICE NAME (selectable text) ===
        service_entry = tk.Entry(
            row_frame,
            font=('Segoe UI', 10),
            bg=COLORS['bg'],
            fg=COLORS['fg'],
            width=30,
            relief=tk.FLAT,
            readonlybackground=COLORS['bg'],
            insertwidth=0,  # Hide cursor
            highlightthickness=0,
            borderwidth=0
        )
        service_entry.insert(0, service_name)
        service_entry.config(state='readonly')
        service_entry.pack(side=tk.LEFT, padx=(0, 5))

        # === COLUMN 3: PORTS (selectable text) ===
        ports_entry = tk.Entry(
            row_frame,
            font=('Consolas', 9),
            bg=COLORS['bg'],
            fg=COLORS['info'],
            width=12,
            relief=tk.FLAT,
            readonlybackground=COLORS['bg'],
            insertwidth=0,  # Hide cursor
            highlightthickness=0,
            borderwidth=0
        )
        ports_entry.insert(0, ports)
        ports_entry.config(state='readonly')
        ports_entry.pack(side=tk.LEFT, padx=(0, 5))

        # === COLUMN 4: STATUS ===
        status_label = tk.Label(
            row_frame,
            text="checking...",
            font=('Arial', 8),
            bg=COLORS['bg'],
            fg=COLORS['text_muted'],
            anchor='center',
            width=10
        )
        status_label.pack(side=tk.LEFT, padx=(0, 8))

        # === ACTION BUTTONS (same height, text only) ===
        # Button specs: height=1 (text lines), font=Arial 9, padx=5
        BUTTON_FONT = ('Arial', 9)

        # Create logs button first (needed for restart/rebuild auto-follow)
        logs_btn = tk.Button(
            row_frame,
            text="Logs",
            bg=COLORS['button_bg'],
            fg=COLORS['fg'],
            font=BUTTON_FONT,
            relief=tk.RAISED,
            bd=1,
            height=1,
            cursor='hand2',
            activebackground=COLORS['button_hover']
        )
        # Configure command after menu is created

        # Menubutton with dropdown
        menu_btn = tk.Menubutton(
            row_frame,
            text="Actions ▼",
            relief=tk.RAISED,
            bg=COLORS['button_bg'],
            fg=COLORS['fg'],
            font=BUTTON_FONT,
            cursor='hand2',
            activebackground=COLORS['button_hover'],
            bd=1,
            height=1
        )
        menu_btn.pack(side=tk.LEFT, padx=5)

        # Create dropdown menu
        menu = tk.Menu(menu_btn, tearoff=0, bg=COLORS['button_bg'], fg=COLORS['fg'], font=('Arial', 9))
        menu_btn['menu'] = menu

        # Add menu items with spacing (different commands for native vs Docker)
        if is_native:
            # === NATIVE SERVICE COMMANDS ===
            menu.add_command(
                label="▶️  Start",
                command=lambda btn=logs_btn: self.execute_with_auto_follow(
                    f'powershell -Command "Write-Host \'🔍 Checking for running service on port 5801...\' -ForegroundColor Cyan; $conn = Get-NetTCPConnection -LocalPort 5801 -ErrorAction SilentlyContinue; if ($conn) {{ Write-Host \'⏹ Stopping existing service (PID: \'$conn.OwningProcess\')\' -ForegroundColor Yellow; Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host \'✅ Service stopped\' -ForegroundColor Green }} else {{ Write-Host \'ℹ No running service found\' -ForegroundColor Gray }}; Write-Host \'🚀 Starting {service_name}...\' -ForegroundColor Cyan; Start-Sleep -Seconds 1" & cd services\\{container_name} && start /b cmd /c "python -m app.main > logs\\console.log 2>&1" & powershell -Command "Start-Sleep -Seconds 2; $conn = Get-NetTCPConnection -LocalPort 5801 -ErrorAction SilentlyContinue; if ($conn) {{ Write-Host \'✅ Service started (PID: \'$conn.OwningProcess\')\' -ForegroundColor Green }} else {{ Write-Host \'⚠ Service may not have started\' -ForegroundColor Yellow }}"',
                    f"Start {service_name}",
                    container_name,
                    service_name,
                    btn
                )
            )
            menu.add_separator()

            menu.add_command(
                label="⏸️  Stop",
                command=lambda btn=logs_btn: self.execute_with_auto_follow(
                    f'powershell -Command "Write-Host \'🔍 Searching for service on port 5801...\' -ForegroundColor Cyan; $conn = Get-NetTCPConnection -LocalPort 5801 -ErrorAction SilentlyContinue; if ($conn) {{ Write-Host \'⏹ Stopping service (PID: \'$conn.OwningProcess\')\' -ForegroundColor Yellow; Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host \'✅ Service stopped successfully\' -ForegroundColor Green }} else {{ Write-Host \'⚠ Service not running\' -ForegroundColor Gray }}"',
                    f"Stop {service_name}",
                    container_name,
                    service_name,
                    btn
                )
            )
            menu.add_separator()

            menu.add_command(
                label="🔁 Restart",
                command=lambda btn=logs_btn: self.execute_with_auto_follow(
                    f'powershell -Command "Write-Host \'🔍 Checking for running service on port 5801...\' -ForegroundColor Cyan; $conn = Get-NetTCPConnection -LocalPort 5801 -ErrorAction SilentlyContinue; if ($conn) {{ Write-Host \'⏹ Stopping service (PID: \'$conn.OwningProcess\')\' -ForegroundColor Yellow; Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host \'✅ Service stopped\' -ForegroundColor Green }} else {{ Write-Host \'ℹ No running service found\' -ForegroundColor Gray }}; Write-Host \'🚀 Starting {service_name}...\' -ForegroundColor Cyan; Start-Sleep -Seconds 2" & cd services\\{container_name} && start /b cmd /c "python -m app.main > logs\\console.log 2>&1" & powershell -Command "Start-Sleep -Seconds 2; $conn = Get-NetTCPConnection -LocalPort 5801 -ErrorAction SilentlyContinue; if ($conn) {{ Write-Host \'✅ Service restarted (PID: \'$conn.OwningProcess\')\' -ForegroundColor Green }} else {{ Write-Host \'⚠ Service may not have started\' -ForegroundColor Yellow }}"',
                    f"Restart {service_name}",
                    container_name,
                    service_name,
                    btn
                )
            )
            menu.add_separator()

            menu.add_command(
                label="📜 Recent (100 lines)",
                command=lambda: self.execute_command(
                    f'powershell -Command "Get-Content services\\{container_name}\\logs\\console.log -Tail 100 -Encoding UTF8 2>$null; if (!$?) {{ Write-Host \'No logs found\' }}"',
                    f"Recent Logs {service_name}"
                )
            )
        else:
            # === DOCKER COMMANDS ===
            menu.add_command(
                label="▶️  Start",
                command=lambda: self.execute_command(
                    f"docker-compose start {container_name}",
                    f"Start {service_name}"
                )
            )
            menu.add_separator()

            menu.add_command(
                label="⏸️  Stop",
                command=lambda: self.execute_command(
                    f"docker-compose stop {container_name}",
                    f"Stop {service_name}"
                )
            )
            menu.add_separator()

            menu.add_command(
                label="🔁 Restart",
                command=lambda btn=logs_btn: self.execute_with_auto_follow(
                    f"docker-compose restart {container_name}",
                    f"Restart {service_name}",
                    container_name,
                    service_name,
                    btn
                )
            )
            menu.add_separator()

            menu.add_command(
                label="🔧 Rebuild",
                command=lambda btn=logs_btn: self.execute_with_auto_follow(
                    f"docker-compose up --build -d {container_name}",
                    f"Rebuild {service_name}",
                    container_name,
                    service_name,
                    btn
                )
            )
            menu.add_separator()

            menu.add_command(
                label="📜 Recent (100 lines)",
                command=lambda: self.execute_command(
                    f"docker logs --tail=100 {container_name}",
                    f"Recent Logs {service_name}"
                )
            )

        # Refresh status button
        refresh_btn = tk.Button(
            row_frame,
            text="Refresh",
            command=lambda: self.check_service_status(container_name, status_label, is_native, health_url),
            bg=COLORS['button_bg'],
            fg=COLORS['fg'],
            font=BUTTON_FONT,
            relief=tk.RAISED,
            bd=1,
            height=1,
            cursor='hand2',
            activebackground=COLORS['button_hover']
        )
        refresh_btn.pack(side=tk.LEFT, padx=5)

        # Add tooltip to refresh button
        self.create_tooltip(refresh_btn, "Refresh status")

        # Logs button - for all services (Docker and Native)
        if not is_native:
            # Docker: toggle log follow
            logs_btn.config(command=lambda btn=logs_btn: self.toggle_log_follow(container_name, service_name, btn, is_native=False))
            logs_btn.pack(side=tk.LEFT, padx=5)
            self.create_tooltip(logs_btn, "Toggle log follow")
        else:
            # Native: toggle log follow from file
            logs_btn.config(command=lambda btn=logs_btn: self.toggle_log_follow(container_name, service_name, btn, is_native=True))
            logs_btn.pack(side=tk.LEFT, padx=5)
            self.create_tooltip(logs_btn, "Toggle log follow")

        # Database UI button (only for database containers, not native) - AFTER Logs button
        if not is_native and container_name in ['lkms105-issues-db', 'lkms105-minio', 'lkms901-adminer']:
            db_ui_btn = tk.Button(
                row_frame,
                text="DB",
                command=lambda cn=container_name: self.open_database_ui(cn),
                bg=COLORS['button_bg'],
                fg=COLORS['fg'],
                font=BUTTON_FONT,
                relief=tk.RAISED,
                bd=1,
                height=1,
                cursor='hand2',
                activebackground=COLORS['button_hover']
            )
            db_ui_btn.pack(side=tk.LEFT, padx=5)

            # Different tooltip based on container type
            if container_name == 'lkms901-adminer':
                self.create_tooltip(db_ui_btn, "Open Adminer in browser")
            elif container_name == 'lkms105-minio':
                self.create_tooltip(db_ui_btn, "Open MinIO Console")
            elif container_name == 'lkms105-issues-db':
                self.create_tooltip(db_ui_btn, "Open Adminer with prefilled credentials")
            else:
                self.create_tooltip(db_ui_btn, "Show database connection info")

        # Auto-check status on creation
        self.root.after(500, lambda: self.check_service_status(container_name, status_label, is_native, health_url))

    def create_tooltip(self, widget, text):
        """Create a tooltip that appears on hover"""
        tooltip = None

        def show_tooltip(event):
            nonlocal tooltip
            x = event.x_root + 10
            y = event.y_root + 10

            tooltip = tk.Toplevel(widget)
            tooltip.wm_overrideredirect(True)
            tooltip.wm_geometry(f"+{x}+{y}")

            label = tk.Label(
                tooltip,
                text=text,
                background=COLORS['button_active'],
                foreground='#ffffff',
                relief=tk.SOLID,
                borderwidth=1,
                font=('Arial', 8),
                padx=5,
                pady=2
            )
            label.pack()

        def hide_tooltip(event):
            nonlocal tooltip
            if tooltip:
                tooltip.destroy()
                tooltip = None

        widget.bind('<Enter>', show_tooltip)
        widget.bind('<Leave>', hide_tooltip)

    def check_service_status(self, service_name, status_label, is_native, health_url):
        """Wrapper function to check status for both Docker and Native services"""
        if is_native:
            self.check_native_status(service_name, status_label, health_url)
        else:
            self.check_container_status(service_name, status_label)

    def check_native_status(self, service_name, status_label, health_url):
        """
        Check native service status via health endpoint (non-blocking).

        This runs curl health check in a separate thread to avoid blocking
        the main UI thread.
        """

        def _check_health_background():
            """Background task: run health check (runs in thread pool)"""
            # Use shared function from docker_utils (same logic as orchestrators)
            from docker_utils import check_native_status
            status, error = check_native_status(health_url)
            return (status, error)

        def _update_ui_from_result(future):
            """Update UI with result from background thread (runs in main thread)"""
            try:
                status, _error = future.result()

                if status == 'running':
                    status_label.config(text="running", fg=COLORS['success'])
                    self.start_status_animation(status_label)
                else:
                    status_label.config(text="stopped", fg=COLORS['error'])
                    self.stop_status_animation(status_label)

            except Exception:
                status_label.config(text="unknown", fg=COLORS['text_muted'])
                self.stop_status_animation(status_label)

            # Schedule next check in 500ms (faster refresh)
            self.root.after(500, lambda: self.check_native_status(service_name, status_label, health_url))

        # Submit background task to thread pool (non-blocking)
        future = self.status_thread_pool.submit(_check_health_background)

        # Poll for completion and update UI when ready (runs in main thread)
        def _check_done():
            if future.done():
                _update_ui_from_result(future)
            else:
                # Not done yet, check again in 50ms (lightweight polling)
                self.root.after(50, _check_done)

        # Start polling after 50ms
        self.root.after(50, _check_done)

    def check_container_status(self, container_name, status_label):
        """
        Check container status in background thread (non-blocking).

        This runs docker inspect in a separate thread to avoid blocking
        the main UI thread during window resize operations.
        """

        def _check_status_background():
            """Background task: run docker inspect (runs in thread pool)"""
            # Use shared function from docker_utils (same logic as orchestrators)
            from docker_utils import check_docker_status
            state_status, health_status, error = check_docker_status(container_name)
            return (state_status, health_status, error)

        def _update_ui_from_result(future):
            """Update UI with result from background thread (runs in main thread)"""
            try:
                status, health, error = future.result()

                if error:
                    status_label.config(text=error, fg=COLORS['text_muted'])
                    self.stop_status_animation(status_label)
                elif status == 'running':
                    # Check health status if available
                    if health == 'starting':
                        status_label.config(text="starting", fg=COLORS['warning'])
                        self.start_status_animation(status_label)
                    elif health == 'unhealthy':
                        status_label.config(text="unhealthy", fg=COLORS['error'])
                        self.stop_status_animation(status_label)
                    elif health == 'healthy':
                        status_label.config(text="running", fg=COLORS['success'])
                        self.start_status_animation(status_label)
                    else:
                        # No health check configured, assume running is ready
                        status_label.config(text="running", fg=COLORS['success'])
                        self.start_status_animation(status_label)
                elif status in ['starting', 'restarting']:
                    status_label.config(text=status, fg=COLORS['warning'])
                    self.start_status_animation(status_label)
                elif status in ['exited', 'stopped']:
                    status_label.config(text=status, fg=COLORS['error'])
                    self.stop_status_animation(status_label)
                elif status in ['paused', 'dead']:
                    status_label.config(text=status, fg=COLORS['text_muted'])
                    self.stop_status_animation(status_label)
                else:
                    # Unknown status - show it anyway
                    status_label.config(text=status, fg=COLORS['text_muted'])
                    self.stop_status_animation(status_label)

            except Exception:
                status_label.config(text="unknown", fg=COLORS['text_muted'])
                self.stop_status_animation(status_label)

            # Schedule next check in 500ms (faster refresh)
            # Background threads prevent UI lag during resize
            self.root.after(500, lambda: self.check_container_status(container_name, status_label))

        # Submit background task to thread pool (non-blocking)
        future = self.status_thread_pool.submit(_check_status_background)

        # Poll for completion and update UI when ready (runs in main thread)
        def _check_done():
            if future.done():
                _update_ui_from_result(future)
            else:
                # Not done yet, check again in 50ms (lightweight polling)
                self.root.after(50, _check_done)

        # Start polling after 50ms
        self.root.after(50, _check_done)

    def create_terminal_panel(self, parent):
        """Create split terminal panel - Main terminal (left) + Log tabs (right)"""
        # Header with auto-scroll checkbox
        header = ttk.Frame(parent)
        header.pack(fill=tk.X, pady=(0, 5))

        ttk.Label(header, text="Terminal Output", font=FONTS['button']).pack(side=tk.LEFT)

        # Auto-scroll checkbox
        auto_scroll_cb = ttk.Checkbutton(
            header,
            text="☑ Auto-scroll",
            variable=self.auto_scroll_enabled
        )
        auto_scroll_cb.pack(side=tk.RIGHT, padx=10)

        # Log tabs wrap checkbox
        self.log_terminal_wrap_var = tk.BooleanVar(value=True)  # Default: wrap enabled
        log_wrap_cb = ttk.Checkbutton(
            header,
            text="☑ Zalamovanie logs",
            variable=self.log_terminal_wrap_var,
            command=self.toggle_all_log_terminals_wrap
        )
        log_wrap_cb.pack(side=tk.RIGHT, padx=10)

        # Main terminal wrap checkbox
        self.main_terminal_wrap_var = tk.BooleanVar(value=True)  # Default: wrap enabled
        main_wrap_cb = ttk.Checkbutton(
            header,
            text="☑ Zalamovanie main",
            variable=self.main_terminal_wrap_var,
            command=self.toggle_main_terminal_wrap
        )
        main_wrap_cb.pack(side=tk.RIGHT, padx=10)

        # Create PanedWindow for split layout (Main | Logs)
        paned = tk.PanedWindow(
            parent,
            orient=tk.HORIZONTAL,
            sashwidth=5,
            bg=COLORS['border'],
            relief=tk.FLAT
        )
        paned.pack(fill=tk.BOTH, expand=True)

        # Left side: Main terminal (always visible)
        main_frame = ttk.LabelFrame(paned, text="📟 Main Terminal", padding=5)
        self.create_main_terminal(main_frame)
        paned.add(main_frame, minsize=400)

        # Right side: Log tabs notebook
        logs_frame = ttk.LabelFrame(paned, text="📜 Log Tabs", padding=5)
        self.terminal_notebook = ttk.Notebook(logs_frame)
        self.terminal_notebook.pack(fill=tk.BOTH, expand=True)
        paned.add(logs_frame, minsize=400)

        # Set initial sash position (1/3 main - 2/3 logs split)
        paned.update()
        paned.sash_place(0, paned.winfo_width() // 3, 0)

    def create_main_terminal(self, parent):
        """Create main terminal (left side, always visible)"""
        # Terminal text widget frame
        terminal_frame = tk.Frame(parent, bg=COLORS['terminal_bg'], relief=tk.SUNKEN, bd=2)
        terminal_frame.pack(fill=tk.BOTH, expand=True)

        # Create terminal widget
        self.terminal = scrolledtext.ScrolledText(
            terminal_frame,
            wrap=tk.WORD,
            font=FONTS['terminal'],
            bg=COLORS['terminal_bg'],
            fg=COLORS['terminal_fg'],
            insertbackground=COLORS['fg'],
            state='disabled',
            height=20
        )
        self.terminal.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        # Configure text tags for colored output
        self.terminal.tag_config('success', foreground=COLORS['success'])
        self.terminal.tag_config('error', foreground=COLORS['error'])
        self.terminal.tag_config('info', foreground=COLORS['info'])
        self.terminal.tag_config('stdout', foreground=COLORS['terminal_fg'])
        self.terminal.tag_config('stderr', foreground=COLORS['terminal_fg'])

        # Configure ANSI color tags
        self.terminal.tag_config('black', foreground='#000000')
        self.terminal.tag_config('red', foreground='#ff5555')
        self.terminal.tag_config('green', foreground='#50fa7b')
        self.terminal.tag_config('yellow', foreground='#f1fa8c')
        self.terminal.tag_config('blue', foreground='#569cd6')
        self.terminal.tag_config('magenta', foreground='#bd93f9')
        self.terminal.tag_config('cyan', foreground='#8be9fd')
        self.terminal.tag_config('white', foreground='#f8f8f2')
        self.terminal.tag_config('bright_black', foreground='#6272a4')
        self.terminal.tag_config('bright_red', foreground='#ff6e6e')
        self.terminal.tag_config('bright_green', foreground='#69ff94')
        self.terminal.tag_config('bright_yellow', foreground='#ffffa5')
        self.terminal.tag_config('bright_blue', foreground='#d6acff')
        self.terminal.tag_config('bright_magenta', foreground='#ff92df')
        self.terminal.tag_config('bright_cyan', foreground='#a4ffff')
        self.terminal.tag_config('bright_white', foreground='#ffffff')
        self.terminal.tag_config('bold', font=('Consolas', 10, 'bold'))

    def create_log_tab(self, container_name: str, service_name: str, button):
        """
        Create new tab for log following.

        Args:
            container_name: Container name (unique identifier)
            service_name: Display name for tab label
            button: Logs button (for green highlight)
        """
        # Create tab frame with close button
        tab_frame = tk.Frame(self.terminal_notebook)

        # Tab header with close button
        tab_header_frame = tk.Frame(tab_frame, bg=COLORS['bg'])
        tab_header_frame.pack(fill=tk.X, pady=(2, 2))

        ttk.Label(tab_header_frame, text=f"📜 {service_name}", font=FONTS['button']).pack(side=tk.LEFT, padx=5)

        # Close button (X)
        close_btn = tk.Button(
            tab_header_frame,
            text="✖",
            font=('Arial', 10, 'bold'),
            bg=COLORS['error'],
            fg='#ffffff',
            width=3,
            relief=tk.FLAT,
            cursor='hand2',
            command=lambda: self.close_log_tab(container_name)
        )
        close_btn.pack(side=tk.RIGHT, padx=5)

        # Terminal widget frame
        terminal_frame = tk.Frame(tab_frame, bg=COLORS['terminal_bg'], relief=tk.SUNKEN, bd=2)
        terminal_frame.pack(fill=tk.BOTH, expand=True)

        # Create terminal widget
        terminal = scrolledtext.ScrolledText(
            terminal_frame,
            wrap=tk.WORD,
            font=FONTS['terminal'],
            bg=COLORS['terminal_bg'],
            fg=COLORS['terminal_fg'],
            insertbackground=COLORS['fg'],
            state='disabled',
            height=20
        )
        terminal.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        # Configure text tags
        terminal.tag_config('success', foreground=COLORS['success'])
        terminal.tag_config('error', foreground=COLORS['error'])
        terminal.tag_config('info', foreground=COLORS['info'])
        terminal.tag_config('stdout', foreground=COLORS['terminal_fg'])
        terminal.tag_config('stderr', foreground=COLORS['terminal_fg'])

        # Configure ANSI color tags
        terminal.tag_config('black', foreground='#000000')
        terminal.tag_config('red', foreground='#ff5555')
        terminal.tag_config('green', foreground='#50fa7b')
        terminal.tag_config('yellow', foreground='#f1fa8c')
        terminal.tag_config('blue', foreground='#569cd6')
        terminal.tag_config('magenta', foreground='#bd93f9')
        terminal.tag_config('cyan', foreground='#8be9fd')
        terminal.tag_config('white', foreground='#f8f8f2')
        terminal.tag_config('bright_black', foreground='#6272a4')
        terminal.tag_config('bright_red', foreground='#ff6e6e')
        terminal.tag_config('bright_green', foreground='#69ff94')
        terminal.tag_config('bright_yellow', foreground='#ffffa5')
        terminal.tag_config('bright_blue', foreground='#d6acff')
        terminal.tag_config('bright_magenta', foreground='#ff92df')
        terminal.tag_config('bright_cyan', foreground='#a4ffff')
        terminal.tag_config('bright_white', foreground='#ffffff')
        terminal.tag_config('bold', font=('Consolas', 10, 'bold'))

        # Create dedicated executor for this tab
        executor = CommandExecutor(self.config['app']['working_directory'])

        # Store tab data
        self.terminal_tabs[container_name] = {
            'frame': tab_frame,
            'terminal': terminal,
            'executor': executor,
            'button': button,
            'service_name': service_name
        }

        # Add tab to notebook
        self.terminal_notebook.add(tab_frame, text=f"📜 {service_name}")

        # Switch to new tab
        self.terminal_notebook.select(tab_frame)

        return terminal, executor

    def close_log_tab(self, container_name: str):
        """
        Close log tab and stop its executor.

        Args:
            container_name: Container name (unique identifier)
        """
        if container_name not in self.terminal_tabs:
            return

        tab_data = self.terminal_tabs[container_name]

        # Stop executor if running
        if tab_data['executor'].is_running:
            tab_data['executor'].stop()

        # Reset button color
        tab_data['button'].config(bg=COLORS['button_bg'], state='normal')

        # Remove from active log buttons
        if container_name in self.active_log_buttons:
            del self.active_log_buttons[container_name]

        # Remove tab from notebook
        self.terminal_notebook.forget(tab_data['frame'])

        # Remove from tracking
        del self.terminal_tabs[container_name]

        # Switch to main tab
        self.terminal_notebook.select(0)

    def append_to_tab_terminal(self, container_name: str, line, line_type: str = 'stdout'):
        """
        Append line to specific tab's terminal.

        Args:
            container_name: Container name (unique identifier)
            line: Either string or list of (text, tags) tuples for ANSI formatted output
            line_type: Type of output ('stdout', 'stderr', 'info', 'success', 'error')
        """
        if container_name not in self.terminal_tabs:
            return

        terminal = self.terminal_tabs[container_name]['terminal']
        terminal.config(state='normal')

        # Check if line is ANSI formatted segments
        if isinstance(line, list):
            # Process formatted segments
            for text, ansi_tags in line:
                if text:
                    # Combine ANSI tags with line_type tag
                    tags = ansi_tags + [line_type] if ansi_tags else [line_type]
                    terminal.insert(tk.END, text, tuple(tags))
            terminal.insert(tk.END, '\n')
        else:
            # Plain text
            terminal.insert(tk.END, f"{line}\n", (line_type,))

        terminal.config(state='disabled')

        # Auto-scroll if enabled
        if self.auto_scroll_enabled.get():
            terminal.see(tk.END)

    def create_history_panel(self, parent):
        """Create command history panel"""
        history_frame = ttk.LabelFrame(parent, text="Command History", padding=10)
        history_frame.pack(fill=tk.BOTH, pady=(10, 0))

        # History listbox
        self.history_listbox = tk.Listbox(
            history_frame,
            height=5,
            bg=COLORS['bg'],
            fg=COLORS['fg'],
            selectbackground=COLORS['button_hover'],
            font=FONTS['ui']
        )
        self.history_listbox.pack(fill=tk.BOTH, expand=True, pady=(0, 5))

        # Clear button
        clear_btn = ttk.Button(history_frame, text="Clear History", command=self.clear_history)
        clear_btn.pack(side=tk.RIGHT)

    def execute_command(self, command: str, label: str = None):
        """Execute a command via executor"""
        if self.executor.is_running:
            self.append_terminal("⚠️ Command already running. Stop it first.", "error")
            return

        # Track current command
        self.current_command = command
        self.current_command_label = label or command

        # Enable stop button
        self.stop_button.config(state='normal')

        # Execute command
        self.executor.execute(
            command,
            output_callback=self.append_terminal,
            completion_callback=self.on_command_complete
        )

    def stop_command(self):
        """Stop running command"""
        if self.executor.stop():
            self.append_terminal("⏹ Process stopped by user", "info")
            self.stop_button.config(state='disabled')

    def open_database_ui(self, container_name: str):
        """Open database management UI in browser or show connection info"""
        if container_name == 'lkms901-adminer':
            # Adminer - Open in browser
            url = "http://localhost:4901"
            self.append_terminal(f"🗄️ Opening Adminer...", "info")
            self.append_terminal(f"   URL: {url}", "info")
            webbrowser.open(url)
        elif container_name == 'lkms105-issues-db':
            # PostgreSQL (Issues) - Open Adminer with prefilled credentials
            password = "lkern_dev_password_2024"
            url = "http://localhost:4901/?pgsql=lkms105-issues-db&username=lkern_admin&db=lkern_issues"

            # Copy password to clipboard
            self.root.clipboard_clear()
            self.root.clipboard_append(password)

            self.append_terminal(f"🗄️ Opening Adminer (Issues DB)...", "info")
            self.append_terminal(f"   Server: lkms105-issues-db", "info")
            self.append_terminal(f"   Database: lkern_issues", "info")
            self.append_terminal(f"   User: lkern_admin", "info")
            self.append_terminal(f"   Password: ••••• (copied to clipboard)", "success")
            webbrowser.open(url)
        elif container_name == 'lkms105-minio':
            # MinIO - Open MinIO Console
            password = "lkern_dev_password_2024"
            url = "http://localhost:9106"

            # Copy password to clipboard
            self.root.clipboard_clear()
            self.root.clipboard_append(password)

            self.append_terminal(f"🗄️ Opening MinIO Console...", "info")
            self.append_terminal(f"   User: lkern_admin", "info")
            self.append_terminal(f"   Password: ••••• (copied to clipboard)", "success")
            webbrowser.open(url)
        else:
            self.append_terminal(f"⚠️ No database UI available for {container_name}", "error")

    def execute_with_auto_follow(self, command: str, label: str, container_name: str, service_name: str, button):
        """
        Execute command with visual feedback (orange button during execution).
        No longer stops log follows - they run in separate tabs.
        """
        # Set button to orange immediately (visual feedback that command is running)
        button.config(bg='#FF9800')

        # Track button for reset after command completes
        self.pending_visual_feedback = button

        self.execute_command(command, label)

    def start_auto_log_follow(self, container_name: str, service_name: str, button):
        """Start automatic log follow (from restart/rebuild) with orange highlight and disabled button"""
        if self.executor.is_running:
            # Command already running (the restart command), will start log follow after it completes
            return

        # Set button to orange (Material Design orange) and disable it
        button.config(bg='#FF9800', state='disabled')

        # Add to active tracking (auto-follow mode)
        self.active_log_buttons[container_name] = (button, True)

        # Start log follow
        self.execute_command(
            f"docker logs --follow --tail=50 {container_name}",
            f"Auto-follow Logs {service_name}"
        )

    def toggle_main_terminal_wrap(self):
        """Toggle word wrapping in main terminal."""
        if self.main_terminal_wrap_var.get():
            # Checkbox is checked - enable word wrap
            self.terminal.config(wrap=tk.WORD)
        else:
            # Checkbox is unchecked - disable word wrap (show horizontal scrollbar)
            self.terminal.config(wrap=tk.NONE)

    def toggle_all_log_terminals_wrap(self):
        """Toggle word wrapping in all log tab terminals."""
        wrap_mode = tk.WORD if self.log_terminal_wrap_var.get() else tk.NONE

        # Apply to all open log tabs
        for container_name, tab_data in self.terminal_tabs.items():
            terminal = tab_data['terminal']
            terminal.config(wrap=wrap_mode)

    def toggle_log_follow(self, container_name: str, service_name: str, button, is_native=False):
        """
        Toggle log follow on/off using tabbed terminal.
        Creates a new tab for each log follow with dedicated executor.
        """
        # Check if tab already exists
        if container_name in self.terminal_tabs:
            # Tab exists - close it
            self.close_log_tab(container_name)
            return

        # Create new tab for this log follow
        terminal, executor = self.create_log_tab(container_name, service_name, button)

        # Set button to green (Material Design green)
        button.config(bg='#4CAF50')

        # Add to active tracking (manual follow)
        self.active_log_buttons[container_name] = (button, False)

        # Start log follow on tab's executor
        if is_native:
            # Native service: follow console.log file
            command = f'powershell -Command "Get-Content services\\{container_name}\\logs\\console.log -Wait -Tail 50 -Encoding UTF8"'
        else:
            # Docker container: use docker logs --follow
            command = f"docker logs --follow --tail=50 {container_name}"

        # Execute command on tab's executor with tab's terminal as output
        executor.execute(
            command,
            output_callback=lambda line, line_type='stdout': self.append_to_tab_terminal(container_name, line, line_type),
            completion_callback=lambda exit_code, duration: self.on_tab_command_complete(container_name, exit_code, duration)
        )

        # Show info message in tab
        self.append_to_tab_terminal(container_name, f"🔄 Starting log follow for {service_name}...", "info")

    def on_tab_command_complete(self, container_name: str, exit_code: int, duration: float):
        """Called when tab command completes"""
        # Note: Tab stays open even after command completes
        # User must manually close tab using X button
        if container_name in self.terminal_tabs:
            self.append_to_tab_terminal(container_name, f"⏹ Log follow stopped (exit code: {exit_code})", "info")

    def on_command_complete(self, exit_code: int, duration: float):
        """Called when command completes"""
        self.stop_button.config(state='disabled')

        # Reset all active log buttons when command completes
        for _, (button, _) in list(self.active_log_buttons.items()):
            button.config(bg=COLORS['button_bg'], state='normal')
        self.active_log_buttons.clear()

        # Add to history
        timestamp = datetime.now().strftime("%H:%M")
        status_emoji = "✅" if exit_code == 0 else "❌"
        status_text = "success" if exit_code == 0 else "failed"

        # Format: ✅ 17:39 - Build Web-UI - success (5.2s)
        history_entry = f"{status_emoji} {timestamp} - {self.current_command_label} - {status_text} ({duration:.1f}s)"

        self.command_history.append(history_entry)
        self.history_listbox.insert(tk.END, history_entry)

        # Keep only last N entries
        max_history = self.config['ui'].get('max_history', 20)
        if len(self.command_history) > max_history:
            self.command_history.pop(0)
            self.history_listbox.delete(0)

        # Reset visual feedback button (orange -> green if log tab active, otherwise normal)
        if self.pending_visual_feedback is not None:
            # Check if this button has an active log tab running
            button_has_active_tab = False
            for container_name, tab_data in self.terminal_tabs.items():
                if tab_data['button'] == self.pending_visual_feedback:
                    # Tab exists and is running - keep button green
                    self.pending_visual_feedback.config(bg='#4CAF50')
                    button_has_active_tab = True
                    break

            if not button_has_active_tab:
                # No active tab - reset to normal
                self.pending_visual_feedback.config(bg=COLORS['button_bg'])

            self.pending_visual_feedback = None

    def append_terminal(self, line, line_type: str = 'stdout'):
        """
        Append line to terminal output.

        Args:
            line: Either string or list of (text, tags) tuples for ANSI formatted output
            line_type: Type of output ('stdout', 'stderr', 'info', 'success', 'error')
        """
        self.terminal.config(state='normal')

        # Check if line is ANSI formatted segments
        if isinstance(line, list):
            # Process formatted segments
            for text, ansi_tags in line:
                if text:
                    # Combine ANSI tags with line_type tag
                    tags = ansi_tags + [line_type] if ansi_tags else [line_type]
                    self.terminal.insert(tk.END, text, tuple(tags))
            self.terminal.insert(tk.END, '\n')
        else:
            # Plain text
            self.terminal.insert(tk.END, line + '\n', line_type)

        self.terminal.config(state='disabled')

        # Auto-scroll if enabled
        if self.auto_scroll_enabled.get():
            self.terminal.see(tk.END)

    def clear_terminal(self):
        """Clear terminal output"""
        self.terminal.config(state='normal')
        self.terminal.delete('1.0', tk.END)
        self.terminal.config(state='disabled')

    def clear_history(self):
        """Clear command history"""
        self.command_history.clear()
        self.history_listbox.delete(0, tk.END)

    def run(self):
        """Start the application"""
        self.root.mainloop()


def main():
    """Main entry point"""
    root = tk.Tk()
    app = LKernControlPanel(root)
    app.run()


if __name__ == '__main__':
    main()
