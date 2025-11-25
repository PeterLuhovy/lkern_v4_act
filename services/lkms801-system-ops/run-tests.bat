@echo off
REM ================================================================
REM FILE: run-tests.bat
REM PATH: /services/lkms801-system-ops/run-tests.bat
REM DESCRIPTION: Run pytest tests for LKMS801
REM VERSION: v1.0.0
REM UPDATED: 2025-11-23 14:50:00
REM ================================================================

echo ================================================================
echo LKMS801 - Running Tests
echo ================================================================
echo.

REM Run pytest with verbose output
pytest -v

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ All tests passed!
    echo.
) else (
    echo.
    echo ❌ Some tests failed!
    echo.
)

pause
