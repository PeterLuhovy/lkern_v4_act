@echo off
REM ================================================================
REM FILE: start-service.bat
REM PATH: /services/lkms801-system-ops/start-service.bat
REM DESCRIPTION: Start LKMS801 System Operations Service
REM VERSION: v1.0.0
REM UPDATED: 2025-11-23 12:00:00
REM ================================================================

echo ================================================================
echo LKMS801 - System Operations Service
echo ================================================================
echo.
echo 🚀 Starting service...
echo.
echo REST API: http://localhost:5801
echo gRPC API: localhost:6801
echo.
echo Press CTRL+C to stop
echo.
echo ================================================================
echo.

REM Start service
python -m app.main

pause
