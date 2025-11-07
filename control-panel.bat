@echo off
REM ================================================================
REM FILE: control-panel.bat
REM PATH: /control-panel.bat
REM DESCRIPTION: Launch L-KERN Control Panel (Python GUI)
REM VERSION: v1.0.0
REM UPDATED: 2025-11-06 16:50:00
REM ================================================================

echo.
echo ================================================================
echo   L-KERN Control Panel Launcher
echo ================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo.
    echo Please install Python 3.8+ from:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

REM Show Python version
echo [OK] Python detected:
python --version
echo.

REM Change to control panel directory
cd /d "%~dp0tools\lkern-control-panel"

REM Check if main.py exists
if not exist "main.py" (
    echo [ERROR] main.py not found in tools/lkern-control-panel/
    echo.
    pause
    exit /b 1
)

REM Launch GUI
echo [INFO] Launching L-KERN Control Panel...
echo.
python main.py

REM If GUI closes with error, show message
if errorlevel 1 (
    echo.
    echo [ERROR] Application exited with error code %errorlevel%
    echo.
    pause
)
