#!/bin/bash
# ================================================================
# L-KERN v4 - Protocol Buffers Compilation Script
# ================================================================
# File: scripts/compile-proto.sh
# Version: v1.0.0
# Created: 2025-11-08
# Description:
#   Compiles .proto files to Python gRPC code.
#   Uses grpc_tools.protoc for compilation.
# ================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}L-KERN v4 - Proto Compilation${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════${NC}"

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_DIR="${PROJECT_ROOT}/proto"
OUTPUT_DIR="${PROJECT_ROOT}/generated"

echo -e "${GREEN}Project root:${NC} ${PROJECT_ROOT}"
echo -e "${GREEN}Proto directory:${NC} ${PROTO_DIR}"
echo -e "${GREEN}Output directory:${NC} ${OUTPUT_DIR}"

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

# Check if proto directory exists
if [ ! -d "${PROTO_DIR}" ]; then
  echo -e "${RED}Error: Proto directory not found: ${PROTO_DIR}${NC}"
  exit 1
fi

# Find all .proto files
PROTO_FILES=$(find "${PROTO_DIR}" -name "*.proto")

if [ -z "${PROTO_FILES}" ]; then
  echo -e "${YELLOW}No .proto files found in ${PROTO_DIR}${NC}"
  exit 0
fi

echo -e "${GREEN}Found proto files:${NC}"
echo "${PROTO_FILES}"

# Compile each proto file
for PROTO_FILE in ${PROTO_FILES}; do
  echo -e "${GREEN}Compiling:${NC} ${PROTO_FILE}"

  python -m grpc_tools.protoc \
    --proto_path="${PROTO_DIR}" \
    --python_out="${OUTPUT_DIR}" \
    --grpc_python_out="${OUTPUT_DIR}" \
    "${PROTO_FILE}"

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Success${NC}"
  else
    echo -e "${RED}✗ Failed${NC}"
    exit 1
  fi
done

# Create __init__.py files for Python package structure
find "${OUTPUT_DIR}" -type d -exec touch {}/__init__.py \;

echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Proto compilation completed successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
