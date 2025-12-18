#!/bin/bash
# ================================================================
# FILE: compile-proto.sh
# PATH: /infrastructure/proto/compile-proto.sh
# DESCRIPTION: Compile proto files to Python stubs
# VERSION: v1.0.0
# UPDATED: 2025-12-18
# ================================================================

set -e

PROTO_DIR="$(dirname "$0")"
OUTPUT_DIR="${PROTO_DIR}/../../services/lkms101-contacts/app/grpc"

echo "Compiling proto files..."
echo "Proto directory: ${PROTO_DIR}"
echo "Output directory: ${OUTPUT_DIR}"

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

# Compile contacts.proto
python -m grpc_tools.protoc \
    --proto_path="${PROTO_DIR}" \
    --python_out="${OUTPUT_DIR}" \
    --grpc_python_out="${OUTPUT_DIR}" \
    "${PROTO_DIR}/contacts.proto"

echo "Proto files compiled successfully!"
echo ""
echo "Generated files:"
ls -la "${OUTPUT_DIR}"/*.py 2>/dev/null || echo "No Python files generated (check for errors)"
