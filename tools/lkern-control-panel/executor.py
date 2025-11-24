"""
================================================================
FILE: executor.py
PATH: /tools/lkern-control-panel/executor.py
DESCRIPTION: Command execution with threading and live output streaming
VERSION: v1.2.2
UPDATED: 2025-11-22 16:45:00
================================================================
"""

import subprocess
import threading
import time
import re
from typing import Optional, Callable, List, Tuple
from datetime import datetime


class CommandExecutor:
    """
    Execute shell commands asynchronously with live output streaming.

    Features:
    - Non-blocking execution via threading
    - Real-time stdout/stderr streaming
    - Process control (stop/kill)
    - Exit code tracking
    - ANSI color code parsing and formatting
    """

    # ANSI escape code pattern
    ANSI_ESCAPE_PATTERN = re.compile(r'\033\[([0-9;]+)m')

    # ANSI to Tkinter tag mapping
    ANSI_COLOR_MAP = {
        '0': 'reset',           # Reset
        '1': 'bold',            # Bold
        '30': 'black',          # Black
        '31': 'red',            # Red
        '32': 'green',          # Green
        '33': 'yellow',         # Yellow
        '34': 'blue',           # Blue
        '35': 'magenta',        # Magenta
        '36': 'cyan',           # Cyan
        '37': 'white',          # White
        '90': 'bright_black',   # Bright Black (Gray)
        '91': 'bright_red',     # Bright Red
        '92': 'bright_green',   # Bright Green
        '93': 'bright_yellow',  # Bright Yellow
        '94': 'bright_blue',    # Bright Blue
        '95': 'bright_magenta', # Bright Magenta
        '96': 'bright_cyan',    # Bright Cyan
        '97': 'bright_white',   # Bright White
    }

    def __init__(self, working_dir: str):
        """
        Initialize command executor.

        Args:
            working_dir: Working directory for command execution
        """
        self.working_dir = working_dir
        self.process: Optional[subprocess.Popen] = None
        self.is_running = False
        self.exit_code: Optional[int] = None
        self.stop_reading = False  # Flag to stop reader threads immediately

    @staticmethod
    def parse_ansi(text: str) -> List[Tuple[str, List[str]]]:
        """
        Parse ANSI escape codes from text and return formatted segments.

        Args:
            text: Text with ANSI escape codes

        Returns:
            List of (text, tags) tuples where tags are Tkinter text tags
        """
        segments = []
        current_tags = []
        last_end = 0

        for match in CommandExecutor.ANSI_ESCAPE_PATTERN.finditer(text):
            # Add text before this escape code
            if match.start() > last_end:
                text_segment = text[last_end:match.start()]
                segments.append((text_segment, current_tags.copy()))

            # Parse escape code
            code = match.group(1)
            codes = code.split(';')

            for c in codes:
                if c == '0':
                    # Reset all formatting
                    current_tags = []
                elif c in CommandExecutor.ANSI_COLOR_MAP:
                    tag = CommandExecutor.ANSI_COLOR_MAP[c]
                    if tag == 'reset':
                        current_tags = []
                    elif tag not in current_tags:
                        current_tags.append(tag)

            last_end = match.end()

        # Add remaining text
        if last_end < len(text):
            segments.append((text[last_end:], current_tags.copy()))

        return segments

    def execute(self, command: str, output_callback: Callable,
                completion_callback: Callable[[int, float], None]):
        """
        Execute command asynchronously with live output.

        Args:
            command: Shell command to execute
            output_callback: Called for each output line
                - For plain text: (line: str, type: str)
                - For ANSI formatted: (segments: List[Tuple[str, List[str]]], type: str)
                type: 'stdout' | 'stderr' | 'info' | 'success' | 'error'
            completion_callback: Called when command completes (exit_code, duration)
        """
        if self.is_running:
            output_callback("⚠️ Command already running. Stop it first.", "error")
            return

        # Reset stop flag for new command
        self.stop_reading = False

        # Start execution in separate thread
        thread = threading.Thread(
            target=self._execute_thread,
            args=(command, output_callback, completion_callback),
            daemon=True
        )
        thread.start()

    def _execute_thread(self, command: str, output_callback: Callable[[str, str], None],
                        completion_callback: Callable[[int, float], None]):
        """
        Thread worker for command execution.
        """
        self.is_running = True
        self.exit_code = None
        start_time = time.time()

        try:
            # Log command start
            timestamp = datetime.now().strftime("%H:%M:%S")
            output_callback(f"[{timestamp}] $ {command}", "info")
            output_callback("", "info")  # Empty line

            # Start process
            self.process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=self.working_dir,
                text=True,
                encoding='utf-8',  # Force UTF-8 encoding for Docker output
                errors='replace',  # Replace invalid UTF-8 chars instead of crashing
                bufsize=1  # Line buffered
            )

            # Read stdout and stderr simultaneously
            def read_stdout():
                if self.process and self.process.stdout:
                    for line in self.process.stdout:
                        # Stop reading if flag is set
                        if self.stop_reading:
                            break
                        if line.strip():
                            # Parse ANSI codes and send formatted segments
                            segments = CommandExecutor.parse_ansi(line.rstrip())
                            output_callback(segments, "stdout")

            def read_stderr():
                if self.process and self.process.stderr:
                    for line in self.process.stderr:
                        # Stop reading if flag is set
                        if self.stop_reading:
                            break
                        if line.strip():
                            # Parse ANSI codes and send formatted segments
                            segments = CommandExecutor.parse_ansi(line.rstrip())
                            output_callback(segments, "stderr")

            # Start reader threads
            stdout_thread = threading.Thread(target=read_stdout, daemon=True)
            stderr_thread = threading.Thread(target=read_stderr, daemon=True)

            stdout_thread.start()
            stderr_thread.start()

            # Wait for process to complete
            self.process.wait()

            # Wait for readers to finish
            stdout_thread.join(timeout=1.0)
            stderr_thread.join(timeout=1.0)

            # Get exit code
            self.exit_code = self.process.returncode
            duration = time.time() - start_time

            # Log completion
            output_callback("", "info")  # Empty line
            if self.exit_code == 0:
                output_callback(f"✓ Success (completed in {duration:.1f}s)", "success")
            else:
                output_callback(f"✗ Failed with exit code {self.exit_code} ({duration:.1f}s)", "error")

            # Notify completion
            completion_callback(self.exit_code, duration)

        except Exception as e:
            duration = time.time() - start_time
            output_callback(f"✗ Error: {str(e)}", "error")
            completion_callback(-1, duration)

        finally:
            self.is_running = False
            self.process = None

    def stop(self) -> bool:
        """
        Stop running process gracefully (SIGTERM).

        Returns:
            True if process was stopped, False if no process running
        """
        if not self.is_running or not self.process:
            return False

        # Signal reader threads to stop immediately
        self.stop_reading = True

        try:
            self.process.terminate()
            # Wait up to 5 seconds for graceful termination
            self.process.wait(timeout=5.0)
            return True
        except subprocess.TimeoutExpired:
            # Force kill if still running
            return self.kill()
        except Exception:
            return False

    def kill(self) -> bool:
        """
        Force kill running process (SIGKILL).

        Returns:
            True if process was killed, False if no process running
        """
        if not self.is_running or not self.process:
            return False

        # Signal reader threads to stop immediately
        self.stop_reading = True

        try:
            self.process.kill()
            self.process.wait()
            return True
        except Exception:
            return False

    def get_status(self) -> dict:
        """
        Get current executor status.

        Returns:
            Dictionary with status information
        """
        return {
            "is_running": self.is_running,
            "has_process": self.process is not None,
            "exit_code": self.exit_code
        }
