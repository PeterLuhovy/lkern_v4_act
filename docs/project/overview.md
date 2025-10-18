# ================================================================
# L-KERN v4 - Project Overview
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\overview.md
# Version: 4.0.0
# Created: 2025-10-13
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   High-level project overview, goals, architecture summary,
#   current status, and progress tracker for L-KERN v4.
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

**Completed**:
- Task 0.0 (Infrastructure Setup) ✅
- Task 0.1 (Coding Standards) ✅
- Task 0.2 (Phase 1 - Core form components) ✅ 100% (6/6 done)

**Next**: Task 0.3 (Backend Infrastructure - PostgreSQL, gRPC)

**Full Roadmap**: [ROADMAP.md](ROADMAP.md)

---

## 🏗️ Architecture

### **Folder Structure:**

```
L-KERN v4/
├── apps/
│   └── web-ui/                    # React 19 frontend (lkms201, port 4201)
├── packages/
│   └── config/                    # @l-kern/config (constants, translations, theme)
├── services/                      # Backend microservices (lkms10X)
├── infrastructure/
│   └── docker/                    # Dockerfiles, docker-compose.yml
├── tools/                         # Dev tools
└── docs/
    ├── README.md                  # Documentation hub
    ├── PROJECT-OVERVIEW.md        # This file
    ├── ROADMAP.md                 # Development roadmap
    ├── architecture/              # Architecture docs
    ├── packages/                  # Package-specific docs
    └── programming/               # Coding standards (planned)
```

### **Tech Stack:**

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- REST API communication

**Backend:**
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

## ✅ Completed Tasks

### **Task 0.0: Infrastructure Setup** ✅

**Development Environment:**
- ✅ Nx workspace (Yarn 4 + TypeScript 5.7)
- ✅ Docker Compose with hot-reload (CHOKIDAR_USEPOLLING)
- ✅ React 19 app (lkms201-web-ui on port 4201)
- ✅ Vite 6 with HMR working

**@l-kern/config Package:**
- ✅ Constants (PORTS, API_ENDPOINTS, COLORS, SPACING)
- ✅ Translations (SK/EN with useTranslation hook)
- ✅ Theme system (light/dark with useTheme hook)
- ✅ Dynamic CSS generation from design tokens
- ✅ Tested and verified in web-ui

**Documentation:**
- ✅ PROJECT-OVERVIEW.md
- ✅ ROADMAP.md (Phase 0 with 21 tasks)
- ✅ docs/README.md (documentation hub)
- ✅ docs/packages/config.md
- ✅ docs/architecture/port-mapping.md

**Git:**
- ✅ Initial commit (60 files, 42,456 insertions)
- ✅ Pushed to repository

---

### **Task 0.1: Coding Standards** ✅

**Completed**: 2025-10-15

**Coding Standards (2235 lines):**
- ✅ Language & communication guidelines
- ✅ Development workflow (educational approach)
- ✅ File headers & code structure
- ✅ Constants management with documentation
- ✅ TypeScript/React 19 conventions
- ✅ Python/FastAPI conventions
- ✅ SQLAlchemy + Alembic patterns
- ✅ gRPC service patterns (.proto, server, client)
- ✅ REST API standards (endpoints, error handling)
- ✅ Retry logic with exponential backoff
- ✅ Kafka/message broker patterns
- ✅ Testing standards (pytest + Vitest)
- ✅ Docker & DevOps best practices
- ✅ DRY principle & code reuse
- ✅ UI standards (notifications)
- ✅ Backup workflow
- ✅ Git standards

**Code Examples (1700 lines):**
- ✅ React components (basic, with API, custom hooks)
- ✅ REST API client (Axios setup, interceptors, API services)
- ✅ gRPC server & client (Python implementation)
- ✅ FastAPI routers (complete CRUD operations)
- ✅ Database operations (SQLAlchemy models, Pydantic schemas, Alembic migrations)
- ✅ Form handling (validation, error handling, submission)
- ✅ Testing (pytest backend tests + Vitest frontend tests)

---

### **Task 0.2: @l-kern/ui-components** ✅

**Status**: Phase 1 COMPLETED
**Started**: 2025-10-18
**Completed**: 2025-10-18

**Completed Components (Phase 1 - 6/6):**
- ✅ **Button** (v1.0.0) - 16 tests, 100% coverage
  - 5 variants, 3 sizes, loading state, icon support
  - 121 lines TS + 184 lines CSS
- ✅ **Input** (v1.0.0) - 15 tests, 100% coverage
  - Error/helper text, fullWidth, all HTML input types
  - 92 lines TS + 114 lines CSS
- ✅ **FormField** (v1.0.0) - 11 tests, 100% coverage
  - Label wrapper, required indicator, error display
  - 103 lines TS + 72 lines CSS
- ✅ **Select** (v1.0.0) - 21 tests, 100% coverage
  - Native select, options array, placeholder, error handling
  - 134 lines TS + 144 lines CSS
- ✅ **Checkbox** (v1.0.0) - 19 tests, 100% coverage
  - Label, error/helper text, indeterminate state
  - 113 lines TS + 143 lines CSS
- ✅ **Radio/RadioGroup** (v1.0.0) - 33 tests, 100% coverage
  - Single selection, vertical/horizontal layout, error states
  - 177 lines TS (2 files) + 169 lines CSS (2 files)

**Test Results:**
- ✅ **115 tests total** - 100% passing
- ✅ 7 test suites - all green
- ✅ 100% code coverage on all components

**Test Infrastructure Setup:**
- ✅ Vitest + React Testing Library
- ✅ @testing-library/jest-dom matchers
- ✅ @testing-library/user-event
- ✅ vitest.setup.ts configuration
- ✅ CSS Modules test patterns
- ✅ Docker container testing workflow

**Testing Documentation:**
- ✅ [testing.md](setup/testing.md) - Complete testing guide
- ✅ Docker volume troubleshooting
- ✅ Test dependency setup instructions
- ✅ Common issues & solutions

**Completed Components (Phase 2 - 4/4):**
- ✅ **Card** (v1.0.0) - 18 tests, 100% coverage
  - 3 variants (default, outlined, elevated), clickable, hover effects
  - 84 lines TS + 162 lines CSS
- ✅ **Badge** (v1.0.0) - 19 tests, 100% coverage
  - 7 variants (default, primary, success, warning, error, info, neutral)
  - 88 lines TS + 158 lines CSS
- ✅ **Spinner** (v1.0.0) - 14 tests, 100% coverage
  - 4 sizes (sm, md, lg, xl), customizable color
  - 74 lines TS + 89 lines CSS
- ✅ **EmptyState** (v1.0.0) - 16 tests, 100% coverage
  - Icon, title, description, action button, 3 sizes
  - 88 lines TS + 146 lines CSS

**Total Components:** 10/10 (Phase 1 + Phase 2 complete)
**Total Tests:** 182 tests, 100% passing
**Total Test Suites:** 11 suites, all green

---

### **Task 0.2 Phase 3: Utility Functions** ✅

**Status**: COMPLETED
**Completed**: 2025-10-18

**Phone Utilities (SK, CZ, PL support):**
- ✅ `validateMobile()` - Multi-country mobile validation
- ✅ `validateLandlineOrFax()` - Landline/fax validation
- ✅ `formatPhoneNumber()` - International formatting
- ✅ `detectPhoneType()` - Auto-detect mobile/landline
- ✅ `cleanPhoneNumber()` - Remove formatting chars
- ✅ Phone config system for easy country additions
- **35 tests, 100% coverage**

**Email Utilities:**
- ✅ `validateEmail()` - RFC 5322 compliant
- ✅ `normalizeEmail()` - Lowercase + trim
- ✅ `getEmailDomain()` - Extract domain
- ✅ `getEmailLocal()` - Extract username
- ✅ `isEmailFromDomain()` - Domain matching
- **43 tests, 100% coverage**

**Date Utilities (SK/EN locales):**
- ✅ `formatDate()` - SK: DD.MM.YYYY, EN: YYYY-MM-DD
- ✅ `formatDateTime()` - With time formatting
- ✅ `parseDate()` - String to Date object
- ✅ `validateDate()` - Format validation
- ✅ `convertDateLocale()` - SK ↔ EN conversion
- ✅ `getToday()` - Current date formatted
- ✅ `isToday()` - Check if date is today
- ✅ `addDays()` - Date arithmetic
- ✅ `getDaysDifference()` - Calculate day diff
- **45 tests, 100% coverage**

**Utility Test Page:**
- ✅ `/utility-test` - Interactive demo page
- ✅ Real-time validation feedback
- ✅ Multi-country phone testing
- ✅ Click-to-try examples
- ✅ Fully translated (SK/EN)

**Total Utilities:** 20 functions (6 phone + 5 email + 9 date)
**Total Tests:** 123 tests, 100% passing

**Documentation:**
- ✅ [components-reference.md](../packages/components-reference.md) - Complete component catalog
- ✅ [utilities-reference.md](../packages/utilities-reference.md) - Complete utility reference

---

## ⏳ Next Steps

**Immediate Priorities (from ROADMAP.md):**

1. **Task 0.2**: Build @l-kern/ui-components package ⏳ **NEXT**
   - Base components (Button, Input, Table, Modal, etc.)
   - Storybook setup
   - Integration with @l-kern/config (design tokens)

2. **Task 0.3**: Backend infrastructure
   - PostgreSQL setup
   - gRPC infrastructure
   - Alembic migrations

3. **Task 0.4**: First microservice (lkms101-contacts)
   - REST + gRPC APIs
   - Database setup
   - Frontend integration

**See [ROADMAP.md](ROADMAP.md) for complete Phase 0 plan (21 tasks).**

---

## 📊 Progress Tracker

**Phase 0 Progress**: 3/21 tasks completed (14%)

| Task | Status | Description |
|------|--------|-------------|
| 0.0 | ✅ Done | Infrastructure Setup |
| 0.1 | ✅ Done | Coding Standards |
| 0.2 | ✅ Done | @l-kern/ui-components (Phase 1: 6/6 components, 115 tests) |
| 0.3 | ⏳ Planned | Backend Infrastructure |
| 0.4-0.17 | ⏳ Planned | Microservices Development |
| 0.18 | ⏳ Planned | Authentication Service |
| 0.19 | ⏳ Planned | Testing & QA |
| 0.20 | ⏳ Planned | Production Prep (Nginx + Envoy) |
| 0.21 | ⏳ Planned | Deploy to Test Environment |

---

**Last Updated**: 2025-10-18 13:40:00
