"""
================================================================
FILE: main.py
PATH: /tools/lkern-control-panel/main.py
DESCRIPTION: L-KERN Control Panel - Tkinter GUI application with ANSI color support
VERSION: v1.6.4
UPDATED: 2025-11-08 21:30:00
================================================================
"""

import tkinter as tk
from tkinter import ttk, scrolledtext
import json
import os
from datetime import datetime
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

        # Container list (hardcoded - could be dynamic later)
        self.containers = [
            {'name': 'lkms201-web-ui', 'label': 'Web-UI (v4)'},
        ]

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
                  expand=[('selected', [1, 1, 1, 0])])

    def create_ui(self):
        """Create main UI layout"""
        # Top toolbar
        self.create_toolbar()

        # Main content (split panel)
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))

        # Left panel - Tabbed interface (wider for Docker controls)
        left_notebook = ttk.Notebook(main_frame, width=380)
        left_notebook.pack(side=tk.LEFT, fill=tk.BOTH, padx=(0, 10))
        left_notebook.pack_propagate(False)

        # Commands tab (first tab)
        commands_tab = ttk.Frame(left_notebook)
        left_notebook.add(commands_tab, text="🔧 Build & Test")
        self.create_command_buttons(commands_tab)

        # Docker tab (second tab)
        docker_tab = ttk.Frame(left_notebook)
        left_notebook.add(docker_tab, text="🐳 Docker")
        self.create_docker_buttons(docker_tab)

        # Right panel - Terminal + History (75%)
        right_frame = ttk.Frame(main_frame)
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.create_terminal_panel(right_frame)
        self.create_history_panel(right_frame)

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
        container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

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
        # Scrollable container
        canvas = tk.Canvas(parent, bg=COLORS['bg'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True, padx=(20, 0), pady=20)
        scrollbar.pack(side="right", fill="y", pady=20, padx=(0, 20))

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
            text="📦 Containers",
            font=('Segoe UI', 12, 'bold'),
            foreground=COLORS['fg']
        )
        containers_label.pack(pady=(0, 10))

        # Create container rows
        for container_info in self.containers:
            self.create_container_row(scrollable_frame, container_info)

    def create_container_row(self, parent, container_info):
        """Create a row for a single container with status and menu"""
        container_name = container_info['name']
        container_label = container_info['label']

        # Container frame
        row_frame = tk.Frame(parent, bg=COLORS['bg'])
        row_frame.pack(fill=tk.X, pady=3)

        # Container name and status label (combined)
        name_status_label = tk.Label(
            row_frame,
            text=f"{container_label}",
            font=('Segoe UI', 10),
            bg=COLORS['bg'],
            fg=COLORS['fg'],
            anchor='w',
            width=20
        )
        name_status_label.pack(side=tk.LEFT)

        # Status text label (small font, like superscript)
        status_label = tk.Label(
            row_frame,
            text="checking...",
            font=('Arial', 8),
            bg=COLORS['bg'],
            fg=COLORS['text_muted'],
            anchor='w',
            width=11
        )
        status_label.pack(side=tk.LEFT, padx=(0, 3))

        # Menubutton with dropdown
        menu_btn = tk.Menubutton(
            row_frame,
            text="⚙️ Actions ▼",
            relief=tk.RAISED,
            bg=COLORS['button_bg'],
            fg=COLORS['fg'],
            font=('Arial', 9),
            cursor='hand2',
            activebackground=COLORS['button_hover'],
            bd=1
        )
        menu_btn.pack(side=tk.LEFT, padx=5)

        # Create dropdown menu
        menu = tk.Menu(menu_btn, tearoff=0, bg=COLORS['button_bg'], fg=COLORS['fg'], font=('Arial', 9))
        menu_btn['menu'] = menu

        # Add menu items
        menu.add_command(
            label="▶️  Start",
            command=lambda: self.execute_command(
                f"docker-compose start {container_name}",
                f"Start {container_label}"
            )
        )
        menu.add_command(
            label="⏸️  Stop",
            command=lambda: self.execute_command(
                f"docker-compose stop {container_name}",
                f"Stop {container_label}"
            )
        )
        menu.add_command(
            label="🔁 Restart",
            command=lambda: self.execute_command(
                f"docker-compose restart {container_name}",
                f"Restart {container_label}"
            )
        )
        menu.add_separator()
        menu.add_command(
            label="🔧 Rebuild",
            command=lambda: self.execute_command(
                f"docker-compose up --build -d {container_name}",
                f"Rebuild {container_label}"
            )
        )
        menu.add_command(
            label="📜 Logs (200)",
            command=lambda: self.execute_command(
                f"docker logs --tail=200 {container_name}",
                f"Logs {container_label}"
            )
        )
        menu.add_separator()
        menu.add_command(
            label="🗑️  Remove",
            command=lambda: self.execute_command(
                f"docker-compose rm -f {container_name}",
                f"Remove {container_label}"
            )
        )

        # Refresh status button
        refresh_btn = tk.Button(
            row_frame,
            text="🔄",
            command=lambda: self.check_container_status(container_name, status_label),
            bg=COLORS['button_bg'],
            fg=COLORS['fg'],
            font=('Arial', 9),
            relief=tk.RAISED,
            bd=1,
            width=2,
            cursor='hand2'
        )
        refresh_btn.pack(side=tk.LEFT, padx=(0, 2))

        # Add tooltip to refresh button
        self.create_tooltip(refresh_btn, "Refresh status")

        # Follow logs button (live terminal)
        logs_btn = tk.Button(
            row_frame,
            text="🔍",
            command=lambda: self.execute_command(
                f"docker logs --follow --tail=50 {container_name}",
                f"Live Logs {container_label}"
            ),
            bg=COLORS['button_bg'],
            fg=COLORS['fg'],
            font=('Arial', 9),
            relief=tk.RAISED,
            bd=1,
            width=2,
            cursor='hand2'
        )
        logs_btn.pack(side=tk.LEFT)

        # Add tooltip to logs button
        self.create_tooltip(logs_btn, "Follow logs (live)")

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
        """Check container status and update status indicator with proper state"""
        try:
            import subprocess

            # Get both status and health status
            result = subprocess.run(
                f'docker inspect -f "{{{{.State.Status}}}}|{{{{.State.Health.Status}}}}" {container_name}',
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

                # Map Docker states to colors with health check
                if status == 'running':
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
            else:
                status_label.config(text="not found", fg=COLORS['text_muted'])

            # Schedule next check in 1 second (auto-refresh)
            self.root.after(1000, lambda: self.check_container_status(container_name, status_label))

        except Exception:
            status_label.config(text="unknown", fg=COLORS['text_muted'])
            # Still schedule next check even on error
            self.root.after(1000, lambda: self.check_container_status(container_name, status_label))

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

    def on_command_complete(self, exit_code: int, duration: float):
        """Called when command completes"""
        self.stop_button.config(state='disabled')

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
