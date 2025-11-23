"""
================================================================
FILE: main.py
PATH: /tools/lkern-control-panel/main.py
DESCRIPTION: L-KERN Control Panel - Tkinter GUI with background threading
VERSION: v1.9.1
UPDATED: 2025-11-22 14:15:00
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

        # Container list with categories (LKMS numbering: 100-199 Business, 200-299 Frontend, 500-599 Data, 900-999 Dev Tools)
        # Columns: lkms_id | service_name | ports | status | actions
        self.containers = [
            # === LKMS 100-199: BUSINESS MICROSERVICES ===
            {
                'name': 'lkms105-issues',
                'lkms_id': 'lkms105-issues',
                'service_name': 'Issues Service',
                'ports': ':4105/:5105',
                'category': '100-199 Business'
            },

            # === LKMS 200-299: FRONTEND APPLICATIONS ===
            {
                'name': 'lkms201-web-ui',
                'lkms_id': 'lkms201-web-ui',
                'service_name': 'Web-UI (v4)',
                'ports': ':4201',
                'category': '200-299 Frontend'
            },

            # === LKMS 500-599: DATA & STORAGE ===
            {
                'name': 'lkms105-issues-db',
                'lkms_id': 'lkms105-issues-db',
                'service_name': 'Issues DB',
                'ports': ':5432',
                'category': '500-599 Data'
            },
            {
                'name': 'lkms105-minio',
                'lkms_id': 'lkms105-minio',
                'service_name': 'MinIO Storage',
                'ports': ':9105/:9106',
                'category': '500-599 Data'
            },
            {
                'name': 'lkms503-zookeeper',
                'lkms_id': 'lkms503-zookeeper',
                'service_name': 'Zookeeper',
                'ports': ':2181',
                'category': '500-599 Data'
            },
            {
                'name': 'lkms504-kafka',
                'lkms_id': 'lkms504-kafka',
                'service_name': 'Kafka Broker',
                'ports': ':4503/:9092',
                'category': '500-599 Data'
            },

            # === LKMS 900-999: DEVELOPMENT TOOLS ===
            {
                'name': 'lkms901-adminer',
                'lkms_id': 'lkms901-adminer',
                'service_name': 'Adminer (DB UI)',
                'ports': ':4901',
                'category': '900-999 Dev Tools'
            },
        ]

        # UI components
        self.paned_window = None  # Store reference for sash position

        # Background thread pool for container status checks (non-blocking)
        self.status_thread_pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix="status_check")

        # Setup window
        self.setup_window()
        self.setup_styles()
        self.create_ui()

    def load_config(self):
        """Load configuration from config.json"""
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
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

        # Commands tab (first tab)
        commands_tab = ttk.Frame(left_notebook)
        left_notebook.add(commands_tab, text="🔧 Build & Test")
        self.create_command_buttons(commands_tab)

        # Docker tab (second tab)
        docker_tab = ttk.Frame(left_notebook)
        left_notebook.add(docker_tab, text="🐳 Docker")
        self.create_docker_buttons(docker_tab)

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
            text="🚀 START",
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
            text="⏸️ STOP",
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
            text="🗑️ CLEAN",
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
        """Start entire L-KERN system (all containers)"""
        self.execute_command("docker-compose up -d", "🚀 BOSS START")

    def boss_stop_system(self):
        """Stop entire L-KERN system (keeps containers)"""
        self.execute_command("docker-compose stop", "⏸️ BOSS STOP")

    def boss_clean_system(self):
        """Clean L-KERN system (remove containers, keep data)"""
        self.execute_command("docker-compose down", "🗑️ BOSS CLEAN")

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

    def create_docker_buttons(self, parent):
        """Create Docker container list with status and dropdown menus"""
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

        # Global control buttons in grid
        global_frame = ttk.Frame(scrollable_frame)
        global_frame.pack(pady=(0, 15))

        global_commands = [
            ('🚀 Start All', 'docker-compose up -d'),
            ('🛑 Stop All', 'docker-compose stop'),
            ('🔄 Restart All', 'docker-compose restart'),
            ('🔨 Rebuild All', 'docker-compose up --build -d'),
            ('📋 List All', 'docker ps -a'),
            ('🗑️ Down', 'docker-compose down'),
        ]

        row = 0
        col = 0
        for label, cmd in global_commands:
            btn = tk.Button(
                global_frame,
                text=label,
                command=lambda c=cmd, l=label: self.execute_command(c, l),
                bg=COLORS['button_bg'],
                fg=COLORS['fg'],
                font=('Arial', 9),
                relief=tk.RAISED,
                bd=1,
                width=12,
                cursor='hand2',
                activebackground=COLORS['button_hover']
            )
            btn.grid(row=row, column=col, padx=3, pady=2)
            col += 1
            if col >= 2:
                col = 0
                row += 1

        ttk.Separator(scrollable_frame, orient='horizontal').pack(fill=tk.X, pady=15)

        # --- INDIVIDUAL CONTAINERS SECTION ---
        containers_label = ttk.Label(
            scrollable_frame,
            text="📦 Containers by Category",
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
        category_order = ['100-199 Business', '200-299 Frontend', '500-599 Data', '900-999 Dev Tools', 'Other']
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
            width=22,
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

        # Add menu items with spacing
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
            label="📜 Logs (200)",
            command=lambda: self.execute_command(
                f"docker logs --tail=200 {container_name}",
                f"Logs {service_name}"
            )
        )

        # Refresh status button
        refresh_btn = tk.Button(
            row_frame,
            text="Refresh",
            command=lambda: self.check_container_status(container_name, status_label),
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

        # Database UI button (only for database containers)
        if container_name in ['lkms105-issues-db', 'lkms105-minio', 'lkms901-adminer']:
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

        # Configure logs button command and pack it
        logs_btn.config(command=lambda btn=logs_btn: self.toggle_log_follow(container_name, service_name, btn))
        logs_btn.pack(side=tk.LEFT, padx=5)

        # Add tooltip to logs button
        self.create_tooltip(logs_btn, "Toggle log follow")

        # Auto-check status on creation
        self.root.after(500, lambda: self.check_container_status(container_name, status_label))

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

    def check_container_status(self, container_name, status_label):
        """
        Check container status in background thread (non-blocking).

        This runs docker inspect in a separate thread to avoid blocking
        the main UI thread during window resize operations.
        """

        def _check_status_background():
            """Background task: run docker inspect (runs in thread pool)"""
            try:
                import subprocess

                # Get both status and health status (conditional health check)
                result = subprocess.run(
                    f'docker inspect -f "{{{{.State.Status}}}}|{{{{if .State.Health}}}}{{{{.State.Health.Status}}}}{{{{end}}}}" {container_name}',
                    shell=True,
                    capture_output=True,
                    text=True,
                    timeout=2
                )

                if result.returncode == 0:
                    output = result.stdout.strip()
                    parts = output.split('|')
                    status = parts[0].lower()
                    health = parts[1].lower() if len(parts) > 1 and parts[1] else None
                    return (status, health, None)
                else:
                    return (None, None, "not found")

            except Exception:
                return (None, None, "unknown")

        def _update_ui_from_result(future):
            """Update UI with result from background thread (runs in main thread)"""
            try:
                status, health, error = future.result()

                if error:
                    status_label.config(text=error, fg=COLORS['text_muted'])
                elif status == 'running':
                    # Check health status if available
                    if health == 'starting':
                        status_label.config(text="starting", fg=COLORS['warning'])
                    elif health == 'unhealthy':
                        status_label.config(text="unhealthy", fg=COLORS['error'])
                    elif health == 'healthy':
                        status_label.config(text="running", fg=COLORS['success'])
                    else:
                        # No health check configured, assume running is ready
                        status_label.config(text="running", fg=COLORS['success'])
                elif status in ['starting', 'restarting']:
                    status_label.config(text=status, fg=COLORS['warning'])
                elif status in ['exited', 'stopped']:
                    status_label.config(text=status, fg=COLORS['error'])
                elif status in ['paused', 'dead']:
                    status_label.config(text=status, fg=COLORS['text_muted'])
                else:
                    # Unknown status - show it anyway
                    status_label.config(text=status, fg=COLORS['text_muted'])

            except Exception:
                status_label.config(text="unknown", fg=COLORS['text_muted'])

            # Schedule next check in 1 second (back to fast refresh!)
            # Background threads prevent UI lag during resize
            self.root.after(1000, lambda: self.check_container_status(container_name, status_label))

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
        """Create terminal output panel with auto-scroll checkbox"""
        # Header with auto-scroll checkbox
        header = ttk.Frame(parent)
        header.pack(fill=tk.X, pady=(0, 5))

        ttk.Label(header, text="Terminal Output", font=FONTS['button']).pack(side=tk.LEFT)

        auto_scroll_cb = ttk.Checkbutton(
            header,
            text="☑ Auto-scroll",
            variable=self.auto_scroll_enabled
        )
        auto_scroll_cb.pack(side=tk.RIGHT)

        # Terminal text widget
        terminal_frame = tk.Frame(parent, bg=COLORS['terminal_bg'], relief=tk.SUNKEN, bd=2)
        terminal_frame.pack(fill=tk.BOTH, expand=True)

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
        self.terminal.tag_config('stderr', foreground=COLORS['error'])

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
        """Execute command with visual feedback (orange button during execution)"""
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

    def toggle_log_follow(self, container_name: str, service_name: str, button):
        """Toggle log follow on/off with green highlight (manual follow only)"""
        # Check if this container is currently being followed
        if container_name in self.active_log_buttons:
            _, is_auto = self.active_log_buttons[container_name]

            # If auto-follow, don't allow manual toggle
            if is_auto:
                self.append_terminal("⚠️ Auto-follow active from restart command. Wait for completion.", "error")
                return

            # Manual follow - stop it
            if self.executor.is_running and "docker logs --follow" in self.current_command:
                self.executor.stop()
                self.append_terminal(f"⏹ Stopped following logs for {service_name}", "info")

            # Reset button color and enable it
            button.config(bg=COLORS['button_bg'], state='normal')

            # Remove from active tracking
            del self.active_log_buttons[container_name]
        else:
            # Not active - start following
            if self.executor.is_running:
                self.append_terminal("⚠️ Command already running. Stop it first.", "error")
                return

            # Set button to green (Material Design green) for manual follow
            button.config(bg='#4CAF50')

            # Add to active tracking (manual follow)
            self.active_log_buttons[container_name] = (button, False)

            # Start log follow
            self.execute_command(
                f"docker logs --follow --tail=50 {container_name}",
                f"Live Logs {service_name}"
            )

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

        # Reset visual feedback button if any
        if self.pending_visual_feedback is not None:
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
