# ================================================================
# LKMS801 - System Operations Service
# ================================================================
# Version: 1.0.0
# Created: 2025-11-23
# Updated: 2025-11-23
# Type: Native Windows Service (NOT Docker)
# ================================================================

---

## 📋 Overview

**LKMS801 - System Operations Service** je natívna Windows služba pre file system operácie.

**Prečo natívna služba (nie Docker)?**
- Docker kontajnery majú obmedzenýprístup k host file systému
- Potrebujeme otvárať foldery v Windows Exploreri
- Potrebujeme kopírovať/presúvať súbory na host systéme
- Natívna služba má plný prístup k Windows API

---

## 🏗️ Architecture

### **Communication:**
- **REST API** (port 5801): Health check, status endpoint
- **gRPC API** (port 6801): File operations (main API)

### **Security:**
- API key authentication (gRPC metadata: `api-key`)
- Path whitelist (only allowed directories)
- Audit logging (all operations logged)

### **Operations:**
1. `OpenFolder` - Open folder in Windows Explorer
2. `CopyFile` - Copy file or folder
3. `MoveFile` - Move file or folder
4. `DeleteFile` - Delete file or folder
5. `RenameFile` - Rename file or folder
6. `ListFolder` - List folder contents
7. `GetFileInfo` - Get file information

---

## 📂 Directory Structure

```
services/lkms801-system-ops/
├── proto/
│   └── system_ops.proto           # gRPC protocol definitions
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI + gRPC server
│   ├── config.py                  # Pydantic settings
│   ├── grpc_server.py             # gRPC servicer implementation
│   ├── services/
│   │   ├── __init__.py
│   │   └── file_operations.py    # File system operations
│   └── security/
│       ├── __init__.py
│       └── auth.py                # API key + path validation
├── tests/
│   └── __init__.py
├── requirements.txt               # Python dependencies
├── compile-proto.bat              # Proto compilation script (Windows)
├── start-service.bat              # Service startup script (Windows)
├── .env.example                   # Example environment variables
└── README.md                      # This file
```

---

## 🚀 Setup

### **1. Install Python Dependencies:**

```bash
cd L:\system\lkern_codebase_v4_act\services\lkms801-system-ops
pip install -r requirements.txt
```

### **2. Compile gRPC Proto Files:**

**Windows:**
```cmd
compile-proto.bat
```

**Manual (if script fails):**
```bash
python -m grpc_tools.protoc ^
  -I./proto ^
  --python_out=./app ^
  --grpc_python_out=./app ^
  ./proto/system_ops.proto
```

**Generated files:**
- `app/system_ops_pb2.py` - Protocol Buffer messages
- `app/system_ops_pb2_grpc.py` - gRPC service stubs

### **3. Configure Environment:**

Create `.env` file:

```env
# Service Configuration
SERVICE_NAME=System Operations Service
SERVICE_VERSION=1.0.0
SERVICE_CODE=lkms801

# Server Ports
REST_PORT=5801
GRPC_PORT=6801
HOST=0.0.0.0

# Security
API_KEY=your_secure_api_key_here
ALLOWED_PATHS=["L:\\system", "L:\\data", "C:\\Users\\PeterLuhový"]

# Logging
LOG_LEVEL=INFO
```

**⚠️ SECURITY WARNING:**
- Change `API_KEY` in production!
- Configure `ALLOWED_PATHS` carefully (whitelist only safe directories)

---

## 🏃 Running the Service

### **Option 1: Windows Batch File (Recommended)**

```cmd
start-service.bat
```

### **Option 2: Manual Start**

```bash
cd L:\system\lkern_codebase_v4_act\services\lkms801-system-ops
python -m app.main
```

### **Service Startup Output:**

```
🚀 Starting System Operations Service v1.0.0
📡 REST API: http://0.0.0.0:5801
🔌 gRPC API: 0.0.0.0:6801
📁 Allowed paths: ['L:\\system', 'L:\\data', 'C:\\Users\\PeterLuhový']
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
🚀 gRPC server starting on 0.0.0.0:6801
✅ gRPC server started on port 6801
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:5801 (Press CTRL+C to quit)
```

---

## 🧪 Testing

### **1. Health Check (REST API):**

```bash
curl http://localhost:5801/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "lkms801",
  "version": "1.0.0",
  "grpc_port": 6801
}
```

### **2. Status Endpoint (Protected):**

```bash
curl -H "X-API-Key: your_api_key" http://localhost:5801/status
```

**Response:**
```json
{
  "service": "System Operations Service",
  "version": "1.0.0",
  "status": "running",
  "allowed_paths": ["L:\\system", "L:\\data"],
  "grpc_port": 6801,
  "rest_port": 5801
}
```

### **3. gRPC Operations (Python Client Example):**

```python
import grpc
import system_ops_pb2
import system_ops_pb2_grpc

# Create channel
channel = grpc.insecure_channel('localhost:6801')
stub = system_ops_pb2_grpc.SystemOpsServiceStub(channel)

# Set metadata (API key)
metadata = [('api-key', 'your_api_key')]

# List folder
request = system_ops_pb2.ListFolderRequest(
    folder_path='L:\\system',
    include_hidden=False
)
response = stub.ListFolder(request, metadata=metadata)

print(f"Success: {response.success}")
for file in response.files:
    print(f"  - {file.path} ({file.size_bytes} bytes)")

# Open folder in Explorer
request = system_ops_pb2.OpenFolderRequest(folder_path='L:\\system')
response = stub.OpenFolder(request, metadata=metadata)
print(f"Open folder: {response.message}")
```

---

## 🔐 Security

### **Authentication:**
- gRPC requests must include `api-key` in metadata
- Invalid API key → `UNAUTHENTICATED` error

### **Path Whitelist:**
- All paths validated against `ALLOWED_PATHS` config
- Attempts to access non-whitelisted paths → `Access denied` error
- Prevents directory traversal attacks

### **Audit Logging:**
- All operations logged (INFO level for success, WARNING for security events)
- Log format: `%(asctime)s - %(name)s - %(levelname)s - %(message)s`
- Logs include: operation type, paths, success/failure

**Example logs:**
```
2025-11-23 12:00:00 - app.services.file_operations - INFO - Opened folder: L:\system
2025-11-23 12:01:00 - app.security.auth - WARNING - Access denied to path: C:\Windows\System32
2025-11-23 12:02:00 - app.services.file_operations - WARNING - Deleted file: L:\system\temp\test.txt
```

---

## 🔧 Configuration

### **Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVICE_NAME` | System Operations Service | Service display name |
| `SERVICE_VERSION` | 1.0.0 | Service version |
| `SERVICE_CODE` | lkms801 | LKMS service code |
| `REST_PORT` | 5801 | FastAPI REST API port |
| `GRPC_PORT` | 6801 | gRPC server port |
| `HOST` | 0.0.0.0 | Server bind address |
| `API_KEY` | lkern_dev_api_key_2024 | API authentication key |
| `ALLOWED_PATHS` | ["L:\\system", ...] | Path whitelist (JSON array) |
| `LOG_LEVEL` | INFO | Logging level (DEBUG, INFO, WARNING, ERROR) |
| `GRPC_MAX_WORKERS` | 10 | gRPC thread pool size |

---

## 📊 Port Mapping

| Service | REST Port | gRPC Port | Description |
|---------|-----------|-----------|-------------|
| **lkms801-system-ops** | 5801 | 6801 | System operations (native Windows) |

**Port ranges:**
- **58XX** - REST API (FastAPI)
- **68XX** - gRPC API (internal communication)

---

## 🐛 Troubleshooting

### **Problem: Proto files not compiled**

**Error:**
```
ImportError: cannot import name 'system_ops_pb2'
```

**Solution:**
```bash
# Compile proto files
cd services/lkms801-system-ops
python -m grpc_tools.protoc -I./proto --python_out=./app --grpc_python_out=./app ./proto/system_ops.proto
```

### **Problem: Access denied to path**

**Error:**
```
Access denied: C:\Windows is not in allowed paths
```

**Solution:**
- Add path to `ALLOWED_PATHS` in `.env`:
```env
ALLOWED_PATHS=["L:\\system", "L:\\data", "C:\\Windows"]
```

### **Problem: API key authentication failed**

**Error:**
```
grpc.RpcError: UNAUTHENTICATED - Invalid API key
```

**Solution:**
- Include `api-key` in gRPC metadata:
```python
metadata = [('api-key', 'your_api_key')]
stub.OpenFolder(request, metadata=metadata)
```

---

## 📝 Development

### **Adding New Operations:**

1. **Update proto file:** `proto/system_ops.proto`
2. **Compile proto:** `compile-proto.bat`
3. **Implement logic:** `app/services/file_operations.py`
4. **Add servicer method:** `app/grpc_server.py`
5. **Test operation**

### **Testing Changes:**

```bash
# 1. Restart service
python -m app.main

# 2. Test via Python client or gRPC tool (grpcurl)
```

---

## 🚀 Production Deployment

### **1. Configure for Production:**

```env
# .env.production
API_KEY=<generate_strong_random_key>
LOG_LEVEL=WARNING
ALLOWED_PATHS=["L:\\production\\data"]
```

### **2. Run as Windows Service:**

**Option A: NSSM (Non-Sucking Service Manager)**
```cmd
nssm install LKMS801 "C:\Python311\python.exe" "-m app.main"
nssm set LKMS801 AppDirectory "L:\system\lkern_codebase_v4_act\services\lkms801-system-ops"
nssm start LKMS801
```

**Option B: Task Scheduler** (run at startup)

### **3. Monitor Logs:**

```bash
# Check service status
curl http://localhost:5801/health

# View logs (redirect stdout to file)
python -m app.main > lkms801.log 2>&1
```

---

## 📚 API Reference

See generated documentation:
- **REST API:** http://localhost:5801/docs (Swagger UI)
- **gRPC API:** `proto/system_ops.proto` (Protocol Buffer definitions)

---

## 🔗 Related Services

| Service | Type | Purpose |
|---------|------|---------|
| **lkms201-web-ui** | Docker | Frontend React application |
| **lkms101-contacts** | Docker | Contacts microservice |
| **lkms801-system-ops** | Native | File system operations (THIS) |

**Why native vs Docker?**
- Docker: Isolated, reproducible, easy deployment
- Native: Full OS access, Windows API, file system operations

---

## 📞 Support

**Issues:** Contact development team
**Documentation:** L:\system\lkern_codebase_v4_act\docs\
**Logs:** Check console output or lkms801.log file

---

**Last Updated:** 2025-11-23
**Maintainer:** BOSSystems s.r.o.
**Version:** 1.0.0
