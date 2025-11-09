# ================================================================
# Proto Compiler - gRPC Protocol Buffers Compilation
# ================================================================
# Version: v1.0.0
# Updated: 2025-11-08
# Project: L-KERN v4 - Business Operating System Service
# ================================================================

---

## 📖 Overview

Scripts for compiling `.proto` files to Python gRPC code.

### **What It Does**

Automatically finds all `.proto` files in `proto/` directory and compiles them to Python using `grpcio-tools`.

**Output:** Python gRPC code in `generated/` directory

---

## 🚀 Usage

### **Linux/macOS**

```bash
# From project root
./scripts/proto-compiler/compile-proto.sh
```

### **Windows**

```cmd
# From project root
scripts\proto-compiler\compile-proto.cmd
```

---

## 📁 Directory Structure

```
proto/
├── common/
│   └── health.proto          # Standard health check service
└── services/
    └── (service-specific .proto files)

generated/                     # Output directory (auto-created)
├── health_pb2.py             # Generated Python code
└── health_pb2_grpc.py        # Generated gRPC stubs
```

---

## 🔧 How It Works

### **Linux Script** (`compile-proto.sh`)

1. Finds project root directory
2. Searches for all `.proto` files recursively
3. Compiles each file using `python -m grpc_tools.protoc`
4. Outputs to `generated/` directory

### **Windows Script** (`compile-proto.cmd`)

Same logic, adapted for Windows batch syntax.

---

## 📝 Example

### **Create New Proto File**

```proto
// proto/services/example.proto
syntax = "proto3";
package lkern.services.example;

service ExampleService {
  rpc GetExample (ExampleRequest) returns (ExampleResponse);
}

message ExampleRequest {
  int32 id = 1;
}

message ExampleResponse {
  int32 id = 1;
  string name = 2;
}
```

### **Compile**

```bash
./scripts/proto-compiler/compile-proto.sh
```

### **Output**

```
generated/
├── example_pb2.py            # Message classes
└── example_pb2_grpc.py       # Service stubs
```

### **Use in Python**

```python
# Import generated code
from generated import example_pb2
from generated import example_pb2_grpc

# Create request
request = example_pb2.ExampleRequest(id=123)

# Use in gRPC service
class ExampleServiceImpl(example_pb2_grpc.ExampleServiceServicer):
    def GetExample(self, request, context):
        return example_pb2.ExampleResponse(
            id=request.id,
            name="Example Item"
        )
```

---

## 🚨 Troubleshooting

### **Error: "grpc_tools.protoc not found"**

**Problem:** `grpcio-tools` not installed.

**Solution:**
```bash
pip install grpcio-tools
```

### **Error: "No .proto files found"**

**Problem:** Script not finding proto files.

**Solution:** Check that proto files are in `proto/` directory (not `protos/`).

### **Error: "Permission denied"**

**Problem:** Script not executable (Linux/macOS).

**Solution:**
```bash
chmod +x scripts/proto-compiler/compile-proto.sh
```

---

## 📚 Additional Resources

- **gRPC Python Documentation:** https://grpc.io/docs/languages/python/
- **Protocol Buffers Guide:** https://developers.google.com/protocol-buffers
- **Health Check Proto:** `proto/common/health.proto` (standard gRPC health check)

---

**Last Updated:** 2025-11-08
**Version:** v1.0.0
**Maintainer:** BOSSystems s.r.o.
