# ================================================================
# L-KERN v4 - Project Overview
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\overview.md
# Version: 8.3.0
# Created: 2025-10-13
# Updated: 2025-11-06
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
**Roadmap:** v5.1.0 (Updated 2025-11-06 - DataGrid component added)
**Progress:** 2.88/23 tasks complete (~13%)
**Started:** 2025-10-13
**Target MVP Completion:** 2026-06-30

**Current Task:** 1.30 UI Infrastructure (~88% complete)
**Next Milestone:** Complete FilterAndSearch component by 2025-11-12

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
- @l-kern/ui-components (18 production components)

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
| 1.0 Infrastructure | ✅ COMPLETED | 2025-10-15 |
| 1.1 Coding Standards | ✅ COMPLETED | 2025-10-15 |
| 1.2 UI Infrastructure | ⏳ IN PROGRESS | 2025-10-25 |
| 1.3 Backend Infrastructure + Kafka | ⏸️ PLANNED | 2025-11-05 |
| 1.4 Contact (MDM) | ⏸️ PLANNED | 2025-11-26 |
| 1.5 Configuration | ⏸️ PLANNED | 2025-12-10 |
| 1.6 HR/Payroll | ⏸️ PLANNED | 2026-01-07 |
| 1.7 Inventory/Logistics | ⏸️ PLANNED | 2026-01-28 |
| 1.8 Purchasing (AP) | ⏸️ PLANNED | 2026-02-18 |
| 1.9 Sales (AR) | ⏸️ PLANNED | 2026-03-11 |
| 1.10 Manufacturing | ⏸️ PLANNED | 2026-04-01 |
| 1.11 PPQ (Production Planning) | ⏸️ PLANNED | 2026-04-15 |
| 1.12 Operations (BPM) | ⏸️ PLANNED | 2026-04-29 |
| 1.13 Finance (GL) | ⏸️ PLANNED | 2026-05-13 |
| 1.14 Cash & Bank | ⏸️ PLANNED | 2026-05-27 |
| 1.15 Authentication | ⏸️ PLANNED | 2026-06-03 |
| 1.16 Testing & QA | ⏸️ PLANNED | 2026-06-10 |
| 1.17 Production Prep | ⏸️ PLANNED | 2026-06-17 |
| 1.18 Deploy to Production | ⏸️ PLANNED | 2026-06-30 |

**Progress:** 2.7/18 tasks (~15%)

**Deferred to Phase 2 (v4.1.x):**
- Issues Service
- Inquiries Service
- Mail Client (partial - authentication remains)
- Documents Service

---

## ⏳ Current Work (Task 1.30)

### **1.30 UI Infrastructure (@l-kern/ui-components)**

**Started:** 2025-10-18
**Target:** 2025-11-08 (~2 days remaining)
**Progress:** ~88% complete

**Completed:**
- ✅ Form Components (6/6) - Button, Input, FormField, Select, Checkbox, Radio/RadioGroup
- ✅ Layout Components (4/4) - Card, Badge, Spinner, EmptyState
- ✅ Utility Functions (22/22) - phone, email, date, validation utils
- ✅ Modal System v3.0 (13 items) - Modal, 4 core modals, WizardProgress, WizardNavigation, DebugBar, Toast, DashboardCard + 6 hooks
- ✅ Navigation Components (2/2) - Sidebar, BasePage (with sidebar integration)
- ✅ Icons test page - Professional icon set v3.1.0 (109 icons across 7 categories)
- ✅ DataGrid (v1.0.0) - Production-ready data grid with 40+ features, 40 tests passing

**Remaining:**
- ⏸️ FilterAndSearch (2-3h) - ⚠️ IMPORTANT

**Current Stats:**
- Components: 18 production ✅
- Hooks: 6 ✅
- Utilities: 22 functions ✅
- Tests: 434/434 passing (100%) ✅ (394 existing + 40 DataGrid)
- Build: Zero TypeScript errors ✅

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

**DRY Compliance:** 100% ✅
**Translation Coverage:** 100% ✅
**Test Coverage:** 100% (434/434 tests) ✅
**Accessibility:** WCAG AA compliant ✅
**Documentation:** 30/30 items documented (100%) ✅

---

## 📞 Quick Links

- **Roadmap:** [roadmap.md](roadmap.md) - v4.0.0 Domain-driven microservices plan
- **Microservices Architecture:** [architecture/microservices-architecture.md](../architecture/microservices-architecture.md) - Complete specification
- **Documentation Map:** [docs/README.md](../README.md) - All documentation indexed
- **Coding Standards:** [programming/coding-standards.md](../programming/coding-standards.md)
- **Testing Guide:** [programming/testing-overview.md](../programming/testing-overview.md)

---

## 🔄 Recent Changes

**v8.3.0 (2025-11-06):**
- DataGrid component created (v1.0.0) - Production-ready data grid
- 40+ features: sorting, resizing, selection, expansion, actions, accessibility
- 40 tests implemented and passing (100% coverage)
- Fixed first column rendering bug
- Complete documentation (1490 lines)
- 100% DRY compliance (ZERO hardcoded values)
- Full ARIA attributes and keyboard navigation
- Updated roadmap to v5.1.0

**v8.2.0 (2025-11-02):**
- Icons test page created (professional icon set v3.1.0)
- 109 icons across 7 categories (Navigation, Actions, Status, Data, Business, System, Shapes)
- Modern colorful emoji design (clean, professional)
- Click-to-copy functionality with toast notifications
- Added to sidebar navigation and testing dashboard
- Updated roadmap to v4.4.1

**v8.1.0 (2025-11-02):**
- Completed Phase 4 Modal Enhancements (roadmap v4.4.0)
- Card accent variant added (v1.2.0)
- DashboardCard hover effects enhanced (v1.0.1)
- Toast test page created with full translations
- TypeScript errors fixed (usePageAnalytics, Modal maxWidth)
- All tests passing (37/37 for Card + DashboardCard)

**v7.0.0 (2025-10-30):**
- Updated to reflect roadmap v4.0.0 restructuring
- Added microservices architecture overview (14 services in 4 phases)
- Updated task count: 21 → 18 tasks
- Extended MVP timeline: Mar 2026 → Jun 2026
- Added Kafka event-driven architecture
- Added deferred services list (Phase 2)
- Added architecture comparison (v3.0.0 → v4.0.0)

---

**Last Updated:** 2025-11-06
**Maintainer:** BOSSystems s.r.o.
**Next Review:** After Task 1.30 completion (2025-11-08)
