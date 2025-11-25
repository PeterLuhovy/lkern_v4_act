@echo off
REM ================================================================
REM FILE: control-panel.bat
REM PATH: /tools/lkern-control-panel/scripts/control-panel.bat
REM DESCRIPTION: Launch L-KERN Control Panel - Normal Mode (Hidden)
REM VERSION: v1.2.0
REM UPDATED: 2025-11-23 16:10:00
REM ================================================================
REM
REM Normal Mode: Completely hidden, runs in background.
REM Debug Mode: Use control-panel-debug.bat to see terminal output.
REM
REM ================================================================

REM Change to script directory
cd /d "%~dp0"

REM Launch Control Panel with pythonw (no console window)
REM From scripts/ folder, main.py is one level up
start "" pythonw ..\main.py

REM Exit immediately (batch window closes, pythonw runs in background)
exit
