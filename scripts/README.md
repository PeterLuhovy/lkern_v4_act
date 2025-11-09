# ================================================================
# L-KERN v4 - Scripts Directory
# ================================================================
# Version: v1.0.0
# Updated: 2025-11-08
# Project: BOSS (Business Operating System Service)
# ================================================================

---

## 📖 Overview

Automation scripts for L-KERN v4 development.

---

## 📁 Directory Structure

```
scripts/
├── page-generator/              # Frontend page generator
│   ├── generate-page.js         # Generator script
│   ├── configs/                 # JSON configuration files
│   │   └── orders-page.json     # Example config
│   └── README.md                # Full documentation
│
├── microservice-generator/      # Backend microservice generator
│   ├── generate-microservice.js # Generator script
│   ├── configs/                 # JSON configuration files
│   │   ├── test-service.json    # Test service config
│   │   ├── issues-service.json  # Issues service config
│   │   └── contacts-service.json # Contacts service config
│   └── README.md                # Full documentation
│
└── proto-compiler/              # gRPC proto compiler
    ├── compile-proto.sh         # Linux/macOS script
    ├── compile-proto.cmd        # Windows script
    └── README.md                # Full documentation
```

---

## 🚀 Quick Start

### **1. Generate Frontend Page**

Creates a new DataGrid-based page (Orders, Contacts, Products, etc.)

```bash
# Create config
cat > scripts/page-generator/configs/products-page.json <<EOF
{
  "entityName": "Products",
  "entityNameSingular": "Product",
  "path": "/products",
  "columns": [...]
}
EOF

# Run generator
node scripts/page-generator/generate-page.js scripts/page-generator/configs/products-page.json
```

**Output:** `apps/web-ui/src/pages/Products/` (TSX + CSS + tests)

**See:** [page-generator/README.md](page-generator/README.md)

---

### **2. Generate Backend Microservice**

Creates a new FastAPI microservice (REST API + gRPC + Kafka + PostgreSQL)

```bash
# Create config
cat > scripts/microservice-generator/configs/products-service.json <<EOF
{
  "serviceCode": "120",
  "serviceName": "Products Service",
  "serviceSlug": "products",
  "restPort": 4120,
  "grpcPort": 5120,
  ...
}
EOF

# Run generator
node scripts/microservice-generator/generate-microservice.js scripts/microservice-generator/configs/products-service.json
```

**Output:** `services/lkms120-products/` (25+ files ready to use)

**See:** [microservice-generator/README.md](microservice-generator/README.md)

---

### **3. Compile gRPC Proto Files**

Converts `.proto` files to Python gRPC code

```bash
# Linux/macOS
./scripts/proto-compiler/compile-proto.sh

# Windows
scripts\proto-compiler\compile-proto.cmd
```

**Output:** `generated/` (Python gRPC stubs)

**See:** [proto-compiler/README.md](proto-compiler/README.md)

---

## 📊 Generator Comparison

| Feature | Page Generator | Microservice Generator |
|---------|---------------|----------------------|
| **Language** | TypeScript/React | Python/FastAPI |
| **Output** | Frontend page | Backend service |
| **Files Created** | 3-5 files | 25+ files |
| **Time Savings** | 15-20 min → 30 sec | 4-6 hours → 30 sec |
| **Config Format** | JSON | JSON |
| **Dependencies** | Node.js | Node.js (generator only) |

---

## 🎯 When to Use Each Tool

### **Page Generator**
- ✅ Creating new CRUD pages (Orders, Contacts, Products)
- ✅ DataGrid-based list views
- ✅ Standard filtering, sorting, pagination
- ❌ Complex custom layouts (use manual approach)

### **Microservice Generator**
- ✅ Creating new backend services
- ✅ Standard CRUD operations
- ✅ Database migrations with Alembic
- ✅ Kafka event streaming
- ❌ Non-standard service architectures

### **Proto Compiler**
- ✅ After creating/modifying `.proto` files
- ✅ Before running gRPC services
- ✅ During development (re-compile after changes)

---

## 🔧 Prerequisites

### **All Scripts**
- Node.js 18+ (for generators)
- Access to project root directory

### **Page Generator**
- React 19 + TypeScript project
- @l-kern/ui-components package
- @l-kern/config package

### **Microservice Generator**
- Docker + Docker Compose
- Python 3.11+ (for generated services)
- Kafka + Zookeeper (lkms503-504)

### **Proto Compiler**
- Python 3.11+
- `grpcio-tools` installed (`pip install grpcio-tools`)

---

## 📝 Best Practices

### **Before Generating**
1. ✅ Read the specific generator's README
2. ✅ Create JSON config file first
3. ✅ Validate config format
4. ✅ Check that target doesn't already exist

### **After Generating**
1. ✅ Review generated code
2. ✅ Customize as needed
3. ✅ Add business logic
4. ✅ Write additional tests
5. ✅ Update documentation

### **Version Control**
- ✅ Commit generators (scripts/*/generate-*.js)
- ✅ Commit configs (scripts/*/configs/*.json)
- ✅ Commit generated code (apps/, services/)
- ❌ Don't commit node_modules or __pycache__

---

## 🐛 Known Issues

### **Microservice Generator v1.0.1**
- ⚠️ docker-compose.yml injection works correctly (fixed in v1.0.1)
- ✅ All placeholders replaced correctly
- ✅ Services inject into correct `services:` section

### **Page Generator v1.0.1**
- ✅ All features working
- ✅ Translation injection working
- ✅ Route registration working

---

## 📚 Documentation

- **Page Generator:** [page-generator/README.md](page-generator/README.md) (8KB)
- **Microservice Generator:** [microservice-generator/README.md](microservice-generator/README.md) (15KB)
- **Proto Compiler:** [proto-compiler/README.md](proto-compiler/README.md) (3KB)

---

## 🔗 Related Documentation

- **Project Overview:** `docs/project/overview.md`
- **Coding Standards:** `docs/programming/coding-standards.md`
- **Architecture:** `docs/architecture/microservices-architecture.md`
- **Port Mapping:** `docs/architecture/port-mapping.md`

---

**Last Updated:** 2025-11-08
**Version:** v1.0.0
**Maintainer:** BOSSystems s.r.o.
