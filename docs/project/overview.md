# ================================================================
# L-KERN v4 - Project Overview
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\overview.md
# Version: 11.1.0
# Created: 2025-10-13
# Updated: 2025-11-24
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   High-level project overview with current status snapshot.
# ================================================================

---

## 🎯 Project Vision

**L-KERN v4** je **clean slate ERP system** postavený na lekciách z v3.

### **Why Clean Slate?**

**L-KERN v3 archived** (2025-10-13):
- Excessive complexity
- Poor maintainability
- Technical debt

**L-KERN v4 principles:**
- ✅ Simplicity First
- ✅ Clear Architecture
- ✅ Incremental Development
- ✅ Quality over Speed

---

## 📊 Current Status

**Version:** 4.0.0 (Phase 1 - MVP Development)
**Roadmap:** v7.0.0 (Updated 2025-11-08 - Backend Infrastructure complete)
**Progress:** 6/23 tasks complete (~26%)
**Started:** 2025-10-13
**Target MVP Completion:** 2026-06-30

**Recently Completed:**
- ✅ Task 1.40 Backend Infrastructure (Kafka + Universal Dockerfile + gRPC)
- ✅ Task 1.50 Microservice Template (25+ files + generator script)
- ✅ Task 1.60 Issues Service (Internal Ticketing System)
**Next Tasks:** 1.70 Contact MDM, 1.80 Configuration

---

## 🏗️ Architecture

### **Monorepo Structure:**

```
L-KERN v4/
├── apps/
│   └── web-ui/                    # React 19 frontend (port 4201)
├── packages/
│   ├── config/                    # Shared config, hooks, utils
│   └── ui-components/             # UI component library
├── services/                      # Backend microservices (planned)
├── infrastructure/docker/         # Docker configs
├── docs/                          # Documentation
│   ├── README.md                  # Documentation map
│   ├── project/                   # Project docs
│   ├── architecture/              # Architecture docs
│   ├── programming/               # Standards & guides
│   └── packages/                  # Package docs
└── tools/                         # Dev tools
```

### **Microservices Architecture:**

**Architecture Style:** Domain-Driven Design (Bounded Context)
**Event Bus:** Apache Kafka (async communication)
**Data Strategy:** One PostgreSQL DB per service

**14 Microservices in 4 Phases:**
- PHASE I Foundation: Contact (MDM), Configuration, HR/Payroll
- PHASE II Core Operations: Inventory/Logistics, Purchasing (AP), Sales (AR), Manufacturing
- PHASE III Planning & Finance: PPQ, Operations (BPM), Finance (GL), Cash & Bank
- PHASE IV Supporting: Authentication, Mail Client

**See full specification:** [architecture/microservices-architecture.md](../architecture/microservices-architecture.md)

**Communication Architecture:**

**REST API (External):**
- Frontend → Backend
- HTTP/JSON
- Ports: 41XX (e.g., 4101, 4102)

**gRPC API (Internal):**
- Backend ↔ Backend
- gRPC/Protobuf
- Ports: 51XX (e.g., 5101, 5102)

**Kafka Events (Async):**
- Service → Event Bus → Consumers
- Event-driven workflows
- GDPR-compliant data propagation

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- @l-kern/config (hooks, utils, theme, translations)
- @l-kern/ui-components (20 production components)

**Backend** (Planned - Task 1.3+):
- Python 3.11 + FastAPI
- PostgreSQL 15 (one DB per service)
- Apache Kafka (event-driven architecture)
- REST API (external) + gRPC (inter-service)
- SQLAlchemy + Alembic (ORM + migrations)
- Pydantic (validation)

**DevOps:**
- Docker + Docker Compose (development)
- Nginx (REST proxy, production)
- Envoy (gRPC proxy, production)
- Nx + Yarn 4 (monorepo)

---

## 📝 Phase 1 Progress (MVP Development)

**Goal:** Build MVP and deploy to production
**Timeline:** Oct 2025 - Jun 2026
**Architecture:** Domain-driven microservices (v4.0.0 roadmap)

**Key Changes from v3.0.0 → v4.0.0:**
- Reduced from 17 fragmented services → 14 cohesive services
- Bounded Context pattern (Sales, Purchasing domains)
- Apache Kafka event-driven architecture
- GDPR-compliant sensitive data strategy
- Reduced tasks: 21 → 18 (more efficient structure)

| Task | Status | Target Completion |
|------|--------|-------------------|
| 1.10 Infrastructure | ✅ COMPLETED | 2025-10-15 |
| 1.20 Coding Standards | ✅ COMPLETED | 2025-10-15 |
| 1.30 UI Infrastructure | ✅ COMPLETED | 2025-11-08 |
| 1.40 Backend Infrastructure + Kafka | ✅ COMPLETED | 2025-11-08 |
| 1.50 Microservice Template | ✅ COMPLETED | 2025-11-08 |
| 1.60 Issues Service | ✅ COMPLETED | 2025-12-18 |
| 1.70 Contact (MDM) | ⏸️ PLANNED | 2025-12-02 |
| 1.80 Configuration | ⏸️ PLANNED | 2025-11-30 |
| 1.90 System Health API | ⏸️ PLANNED | 2025-12-02 |
| 1.100 Page Templates | ⏸️ PLANNED | 2025-12-05 |
| 1.110 HR / Payroll | ⏸️ PLANNED | 2025-12-11 |
| 1.120 Inventory | ⏸️ PLANNED | 2025-12-18 |
| 1.130 Purchasing (AP) | ⏸️ PLANNED | 2025-12-29 |
| 1.140 Sales (AR) | ⏸️ PLANNED | 2026-01-09 |
| 1.150 Manufacturing | ⏸️ PLANNED | 2026-01-16 |
| 1.160 PPQ | ⏸️ PLANNED | 2026-01-29 |
| 1.170 Operations (BPM) | ⏸️ PLANNED | 2026-02-09 |
| 1.180 Finance (GL) | ⏸️ PLANNED | 2026-02-20 |
| 1.190 Cash & Bank | ⏸️ PLANNED | 2026-02-26 |
| 1.200 Authentication | ⏸️ PLANNED | 2026-03-05 |
| 1.210 Testing & QA | ⏸️ PLANNED | 2026-03-23 |
| 1.220 Production Prep | ⏸️ PLANNED | 2026-04-04 |
| 1.230 Deploy MVP | ⏸️ PLANNED | 2026-04-11 |

**Progress:** 5/23 tasks (~22%)

**Deferred to Phase 2 (v4.1.x):**
- Inquiries Service
- Mail Client (partial - authentication remains)
- Documents Service

---

## ✅ Completed: Tasks 1.40, 1.50 - Backend Infrastructure

### **1.40 Backend Infrastructure + Kafka**

**Started:** 2025-11-08
**Completed:** 2025-11-08
**Duration:** 1 day

**Delivered:**
- ✅ Universal Dockerfile.backend.dev (DRY principle for all Python services)
- ✅ Kafka + Zookeeper infrastructure (lkms503-504, ports 2181/4503)
- ✅ Adminer database UI (lkms901, port 4901)
- ✅ gRPC infrastructure (proto files + Linux/Windows compile scripts)
- ✅ Documentation updates (port-mapping v2.0.0)

**Bugfixes:**
- Fixed Dockerfile PORT → REST_PORT environment variable

### **1.50 Microservice Template**

**Started:** 2025-11-08
**Completed:** 2025-11-08
**Duration:** 1 day

**Delivered:**
- ✅ Complete template (25+ files: app/, tests/, alembic/, proto/)
- ✅ Placeholder system (11 variables for code generation)
- ✅ Full CRUD REST API + gRPC + Kafka integration
- ✅ Generator script (scripts/microservice-generator/generate-microservice.js)
- ✅ 3 example configs (test, issues, contacts services)
- ✅ Comprehensive documentation (15KB README)

**Template Structure:**
```
services/lkms-template/
├── app/
│   ├── main.py                  # FastAPI + gRPC server
│   ├── config.py                # Pydantic settings (11 env vars)
│   ├── database.py              # SQLAlchemy + async session
│   ├── models/example.py        # Database models
│   ├── schemas/example.py       # Pydantic request/response schemas
│   ├── api/
│   │   ├── rest/example.py      # CRUD REST endpoints
│   │   └── grpc/example_service.py  # gRPC services
│   └── events/
│       ├── producer.py          # Kafka producer (create/update/delete events)
│       └── consumer.py          # Kafka consumer skeleton
├── alembic/                     # Database migrations
├── tests/test_api.py            # 13 comprehensive tests
├── requirements.txt             # Python dependencies
└── README.md                    # Service documentation
```

**Generator Features:**
- Copies template → services/lkms{code}-{slug}/
- Replaces 11 placeholders in all files
- Injects services into docker-compose.yml
- Injects configuration into .env
- Generated in ~5 seconds (vs 4-6 hours manual)

**Bugfixes:**
- Fixed alembic/env.py sys.path import issue (added to template)

---

## ✅ Completed: Task 1.30 UI Infrastructure

### **1.30 UI Infrastructure (@l-kern/ui-components)**

**Started:** 2025-10-18
**Completed:** 2025-11-08
**Duration:** 3 weeks

**Delivered:**
- ✅ Form Components (6/6) - Button, Input, FormField, Select, Checkbox, Radio/RadioGroup
- ✅ Layout Components (4/4) - Card, Badge, Spinner, EmptyState
- ✅ Utility Functions (22/22) - phone, email, date, validation utils
- ✅ Modal System v3.0 - Modal, 4 core modals, WizardProgress, WizardNavigation, DebugBar, Toast, DashboardCard + 6 hooks
- ✅ Navigation Components (2/2) - Sidebar, BasePage
- ✅ Data Display (3/3) - DataGrid, FilterPanel, FilteredDataGrid
- ✅ Page Layout (1/1) - PageHeader
- ✅ Design System Refactor - ZERO hardcoded values, 100% design tokens
- ✅ Page Generator - TemplatePageDatagrid + scripts/generate-page.js
- ✅ Icons test page - Professional icon set v3.1.0 (109 icons)

**Final Stats:**
- Components: 20 production ✅
- Hooks: 6 ✅
- Utilities: 22 functions ✅
- Tests: 1179/1179 passing (100%) ✅
- Lint: 0 errors, 0 warnings ✅
- Build: Zero TypeScript errors ✅
- DRY Compliance: 100% (ZERO hardcoded values) ✅

---

## 🎯 Version Strategy

| Version | Phase | Goal | Status |
|---------|-------|------|--------|
| **4.0.x** | Phase 1 | MVP - Core functionality | ⏳ IN PROGRESS |
| **4.1.x** | Phase 2 | Security, stability | ⏸️ PLANNED |
| **4.2.x** | Phase 3 | Production hardening | ⏸️ PLANNED |
| **4.3.x+** | Phase 4+ | Features, competitiveness | ⏸️ PLANNED |

**Version Upgrades:**
- **4.0.x → 4.1.0** - Phase 1 complete, MVP deployed (Mar 2026)
- **4.1.x → 4.2.0** - Phase 2 complete, security hardened
- **4.2.x → 4.3.0** - Phase 3 complete, production stable
- **4.x.0 → 4.x.1** - Minor fixes within phase

---

## 📊 Code Quality Metrics

**DRY Compliance:** 100% (579 violations → 0) ✅
**Translation Coverage:** 100% ✅
**Test Coverage:** 100% (1179/1179 tests passing) ✅
**Accessibility:** WCAG AA compliant ✅
**Documentation:** 100% (all components documented) ✅
**Lint Status:** 0 errors, 0 warnings ✅

---

## 📞 Quick Links

- **Roadmap:** [roadmap.md](roadmap.md) - v4.0.0 Domain-driven microservices plan
- **Microservices Architecture:** [architecture/microservices-architecture.md](../architecture/microservices-architecture.md) - Complete specification
- **Documentation Map:** [docs/README.md](../README.md) - All documentation indexed
- **Coding Standards:** [programming/coding-standards.md](../programming/coding-standards.md)
- **Testing Guide:** [programming/testing-overview.md](../programming/testing-overview.md)

---

## 🔄 Recent Changes

**v11.1.0 (2025-11-24):**
- 🔧 **L-KERN Control Panel ENHANCED v1.11.3 → v1.13.1**
- 🔧 **Orchestrators REWRITTEN v2.x → v3.0.0**
- Timing System Implementation:
  - ✅ Live timer with MM:SS:MS format (100ms updates)
  - ✅ Statistics tracking (Last 50 executions, rolling average)
  - ✅ Per-service timing breakdowns with color coding
  - ✅ Startup Orchestrator: Parallel health checks (2-8x faster)
  - ✅ Shutdown Orchestrator: Sequential verification with timing
  - ✅ Cleanup Orchestrator: Two-step confirmation + destructive cleanup
- Control Panel UI Improvements:
  - ✅ Terminal wrapping controls (checkboxes for main + logs)
  - ✅ Docker-All buttons reorganized (2 rows × 4 buttons, width +33%)
  - ✅ Emoji icons removed from button labels
  - ✅ Checkbox hover styling (green text on hover)
  - ✅ Window size increased (1650 → 2200px width)
- Infrastructure:
  - ✅ Central services registry (services_registry.json - single source of truth)
  - ✅ Comprehensive documentation (3 orchestrator .md files)
  - ✅ Statistics files (startup_stats.json, shutdown_stats.json, cleanup_stats.json)
- Updated roadmap to v8.4.0
- Performance: Startup 15-40s (avg 25s), Shutdown 10-30s (avg 20s), Cleanup 15-40s (avg 30s)

**v11.0.0 (2025-11-08):**
- ✅ **Tasks 1.40, 1.50 Backend Infrastructure COMPLETED**
- Task 1.40 Backend Infrastructure:
  - ✅ Universal Dockerfile.backend.dev (DRY principle for all services)
  - ✅ Kafka + Zookeeper infrastructure (lkms503-504)
  - ✅ Adminer database UI (lkms901)
  - ✅ gRPC infrastructure (proto files + compilation scripts)
  - ✅ Documentation updated (port-mapping v2.0.0)
  - 🔧 Fixed Dockerfile PORT → REST_PORT bug
- Task 1.50 Microservice Template:
  - ✅ Complete template structure (25+ files)
  - ✅ Placeholder system (11 variables for generator)
  - ✅ Full CRUD REST API + gRPC + Kafka integration
  - ✅ Alembic migrations + comprehensive tests
  - ✅ Generator script (scripts/microservice-generator/generate-microservice.js)
  - ✅ 3 example configs + 15KB documentation
  - 🔧 Fixed alembic/env.py sys.path import issue
  - Generator tested: Generated Issues Service skeleton in 30 seconds (vs 4-6 hours manual)
- Updated roadmap to v7.0.0
- Progress: 5/23 tasks complete (22%)

**v10.0.0 (2025-11-08):**
- ⏳ Tasks 1.40 & 1.50 Backend Infrastructure started
- Backend Infrastructure (80% complete at end of day)
- Microservice Template (95% complete at end of day)

**v9.0.0 (2025-11-08):**
- ✅ **Task 1.30 UI Infrastructure COMPLETED**
- Design System Refactor complete (Phase 3 & 4)
  - ZERO hardcoded values (579 violations → 0)
  - All 1179 tests passing (100%)
  - Clean lint (0 errors, 0 warnings)
  - Visual regression testing complete
- FilterPanel & FilteredDataGrid added (v1.0.0)
  - Integrated search, filters, pagination
  - Complete wrapper component for DataGrid
- PageHeader component added (v1.0.0)
  - Breadcrumb navigation, logo support
  - Purple gradient design, responsive
- Page Generator System complete
  - TemplatePageDatagrid reference template
  - scripts/generate-page.js automation
  - JSON config-based generation
- Test fixes: app.spec.tsx (ToastProvider), UtilityTestPage (emoji hydration)
- Updated roadmap to v5.5.0
- Ready to start Task 1.40 (Backend Infrastructure)

**v8.3.0 (2025-11-06):**
- DataGrid component created (v1.0.0)
- 40+ features: sorting, resizing, selection, expansion, actions
- 40 tests passing, complete documentation (1490 lines)

**v8.2.0 (2025-11-02):**
- Icons test page (109 icons, 7 categories)
- Click-to-copy functionality with toasts

**v8.1.0 (2025-11-02):**
- Modal Enhancements complete (Card accent, DashboardCard hover)
- Toast test page with translations

---

**Last Updated:** 2025-11-24
**Maintainer:** BOSSystems s.r.o.
**Next Review:** Before starting Task 1.70 (Contact MDM)
