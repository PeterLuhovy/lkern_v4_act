@echo off
REM ================================================================
REM FILE: compile-proto.bat
REM PATH: /services/lkms801-system-ops/compile-proto.bat
REM DESCRIPTION: Compile gRPC proto files for Windows
REM VERSION: v1.0.0
REM UPDATED: 2025-11-23 12:00:00
REM ================================================================

echo ================================================================
echo LKMS801 - Compiling gRPC Proto Files
echo ================================================================
echo.

REM Compile proto file
python -m grpc_tools.protoc ^
  -I./proto ^
  --python_out=./app ^
  --grpc_python_out=./app ^
  ./proto/system_ops.proto

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Proto files compiled successfully!
    echo.
    echo Generated files:
    echo   - app\system_ops_pb2.py
    echo   - app\system_ops_pb2_grpc.py
    echo.
) else (
    echo.
    echo ❌ Proto compilation failed!
    echo.
    echo Make sure grpcio-tools is installed:
    echo   pip install grpcio-tools
    echo.
)

pause
