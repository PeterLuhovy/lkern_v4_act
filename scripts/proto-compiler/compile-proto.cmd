@echo off
REM ================================================================
REM L-KERN v4 - Protocol Buffers Compilation Script (Windows)
REM ================================================================
REM File: scripts/compile-proto.cmd
REM Version: v1.0.0
REM Created: 2025-11-08
REM Description:
REM   Compiles .proto files to Python gRPC code (Windows version).
REM   Uses grpc_tools.protoc for compilation.
REM ================================================================

setlocal enabledelayedexpansion

echo ============================================================
echo L-KERN v4 - Proto Compilation
echo ============================================================

REM Project root directory (parent of scripts folder)
set "PROJECT_ROOT=%~dp0.."
set "PROTO_DIR=%PROJECT_ROOT%\proto"
set "OUTPUT_DIR=%PROJECT_ROOT%\generated"

echo Project root: %PROJECT_ROOT%
echo Proto directory: %PROTO_DIR%
echo Output directory: %OUTPUT_DIR%

REM Create output directory if it doesn't exist
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM Check if proto directory exists
if not exist "%PROTO_DIR%" (
  echo Error: Proto directory not found: %PROTO_DIR%
  exit /b 1
)

REM Find and compile all .proto files
echo.
echo Found proto files:
for /r "%PROTO_DIR%" %%f in (*.proto) do (
  echo %%f
  echo Compiling: %%f

  python -m grpc_tools.protoc ^
    --proto_path="%PROTO_DIR%" ^
    --python_out="%OUTPUT_DIR%" ^
    --grpc_python_out="%OUTPUT_DIR%" ^
    "%%f"

  if errorlevel 1 (
    echo Failed to compile %%f
    exit /b 1
  )
  echo Success
)

REM Create __init__.py files for Python package structure
for /d /r "%OUTPUT_DIR%" %%d in (*) do (
  type nul > "%%d\__init__.py"
)
type nul > "%OUTPUT_DIR%\__init__.py"

echo.
echo ============================================================
echo Proto compilation completed successfully!
echo ============================================================
