@echo off
REM ================================================================
REM FILE: create-shortcuts.bat
REM PATH: /create-shortcuts.bat
REM DESCRIPTION: Run PowerShell script to create desktop shortcuts
REM VERSION: v1.0.0
REM UPDATED: 2025-11-23 15:45:00
REM ================================================================

echo.
echo ================================================================
echo   L-KERN Control Panel - Shortcut Creator
echo ================================================================
echo   This will create desktop shortcuts with L-KERN icon.
echo ================================================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Run PowerShell script
echo [INFO] Running PowerShell script...
echo.
powershell -ExecutionPolicy Bypass -File "create-shortcuts.ps1"

echo.
echo Done!
pause
