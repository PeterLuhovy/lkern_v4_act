@echo off
REM ================================================================
REM L-KERN Control Panel - Debug Mode (Visible Terminal)
REM ================================================================
REM Launches Control Panel with visible terminal window.
REM Terminal stays open and shows all output/errors.
REM Press Ctrl+C or close window to exit.
REM ================================================================

echo ================================================================
echo L-KERN Control Panel - Debug Mode
echo ================================================================
echo Terminal window will remain open to show output and errors.
echo Press Ctrl+C or close this window to exit.
echo ================================================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Launch Control Panel with python (console visible)
REM From scripts/ folder, main.py is one level up
python ..\main.py

REM Keep terminal open if Control Panel crashes
echo.
echo ================================================================
echo Control Panel exited.
echo ================================================================
pause
