# ================================================================
# L-KERN v4 - Project Overview
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\overview.md
# Version: 5.0.0
# Created: 2025-10-13
# Updated: 2025-10-22
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   High-level project overview showing CURRENT status only.
#   Historical achievements archived to conversation_history.
# ================================================================

---

## 🎯 Project Goal

L-KERN v4 is a **clean slate ERP system** built with lessons learned from v3. Focus on **simplicity, maintainability, and clarity**.

### **Why Clean Slate?**

L-KERN v3 archived due to:
- Excessive complexity
- Poor maintainability
- Technical debt

L-KERN v4 principles:
- ✅ **Simplicity First**
- ✅ **Clear Architecture**
- ✅ **Incremental Development**
- ✅ **Quality Code**

---

## 📋 Current Phase

**Phase 0: Foundation & Core System** - ⏳ IN PROGRESS

**Current Task:** Task 0.2 - UI Infrastructure (~70% complete)

**See:** [roadmap.md](roadmap.md) for complete phase plan

---

## 🏗️ Architecture

### **Folder Structure:**

```
L-KERN v4/
├── apps/
│   └── web-ui/                    # React 19 frontend (lkms201, port 4201)
├── packages/
│   ├── config/                    # @l-kern/config (hooks, utils, theme, translations)
│   └── ui-components/             # @l-kern/ui-components (17 production components)
├── services/                      # Backend microservices (planned - Task 0.3+)
├── infrastructure/
│   └── docker/                    # Dockerfiles, docker-compose.yml
├── tools/                         # Dev tools
└── docs/
    ├── README.md                  # Documentation hub
    ├── project/
    │   ├── overview.md            # This file
    │   └── roadmap.md             # Development roadmap
    ├── architecture/              # Architecture docs
    ├── programming/               # Coding standards, testing guides
    └── packages/                  # Package-specific docs
```

### **Tech Stack:**

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- REST API communication (planned)

**Backend:** (Planned - Task 0.3+)
- Python 3.11 + FastAPI
- PostgreSQL 15 (one DB per service)
- REST API (external) + gRPC (inter-service)

**Monorepo:**
- Nx + Yarn 4

**DevOps:**
- Docker + Docker Compose (development)
- Nginx (REST proxy) + Envoy (gRPC proxy) (production)

---

## 🚀 Communication Architecture

### **REST API (External)**
- **Purpose**: Frontend → Backend
- **Protocol**: HTTP/JSON
- **Ports**: 41XX (e.g., 4101, 4102, ...)
- **Usage**: All user-facing operations

### **gRPC API (Internal)**
- **Purpose**: Backend ↔ Backend
- **Protocol**: gRPC/Protobuf
- **Ports**: 51XX (e.g., 5101, 5102, ...)
- **Usage**: Inter-service communication

---

## ✅ Last Completed Task

### **Task 0.2 Phase 1.3: Validation Utilities**

**Completed**: 2025-10-21
**Duration**: 3 hours

**What was delivered:**
- ✅ `debounce()` function - Generic delay utility
- ✅ `validateField()` function - Universal field validation
- ✅ Complete testing (150+ tests for dateUtils, phoneUtils, validation)
- ✅ Bug fixes (2 critical bugs in dateUtils)
- ✅ All 394/394 tests passing (100%)
- ✅ Complete documentation (validation.md - 957 lines)

**Files created:**
- `packages/config/src/utils/validation/validation.ts` (142 lines)
- `packages/config/src/utils/validation/validation.test.ts` (40 tests)
- `packages/config/src/utils/validation/validation.md` (957 lines)

---

## ⏳ Current Task

### **Task 0.2 Phase 4: Advanced Components**

**Status**: ⏳ IN PROGRESS (~70% complete)
**Started**: 2025-10-18

**What's Done:**
- ✅ 17 production components (Button, Input, FormField, Select, Checkbox, Radio/RadioGroup, Card, Badge, Spinner, EmptyState, Modal, WizardProgress, WizardNavigation, DebugBar, Toast, ToastContainer, DashboardCard)
- ✅ 6 hooks (useModal, useModalWizard, usePageAnalytics, useToast, useFormDirty, useConfirm)
- ✅ 22 utility functions (phone, email, date, validation)
- ✅ 394/394 tests passing (100%)
- ✅ Toast notification system complete
- ✅ Form dirty tracking complete
- ✅ Confirmation dialogs complete

**What's Missing:**
- [ ] Table/DataGrid component (CRITICAL - needed for contacts page)
- [ ] FilterAndSearch component
- [ ] Page layout templates (BasePageLayout, TableTemplate, DashboardTemplate)

**Next Action:** Complete Table/DataGrid component (4-6 hours)

---

## 📊 Progress Tracker

**Phase 0 Progress**: 2.7/21 tasks completed (~12%)

| Task | Status | Description |
|------|--------|-------------|
| 0.0 | ✅ Done | Infrastructure Setup |
| 0.1 | ✅ Done | Coding Standards |
| 0.2 | ⏳ In Progress | @l-kern/ui-components (~70% done) |
| 0.3 | ⏳ Planned | Backend Infrastructure |
| 0.4-0.17 | ⏳ Planned | Microservices Development |
| 0.18 | ⏳ Planned | Authentication Service |
| 0.19 | ⏳ Planned | Testing & QA |
| 0.20 | ⏳ Planned | Production Prep |
| 0.21 | ⏳ Planned | Deploy to Test Environment |

---

## 📝 Project Stats

**Current Stats:**
- **Components**: 17 production ✅
- **Hooks**: 6 ✅
- **Utilities**: 22 functions ✅
- **Tests**: 394/394 passing (100%) ✅
- **Build**: Zero TypeScript errors ✅
- **Documentation**: 29/29 items documented (100%) ✅

**Code Quality:**
- DRY Compliance: 100% ✅
- Translation Coverage: 100% ✅
- Test Coverage: 100% ✅
- Accessibility: WCAG AA compliant ✅

---

**Last Updated**: 2025-10-22 10:00:00
**Maintainer**: BOSSystems s.r.o.
**See**: [roadmap.md](roadmap.md) for detailed development plan
