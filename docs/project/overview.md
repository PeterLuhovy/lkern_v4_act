# ================================================================
# L-KERN v4 - Project Overview
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\overview.md
# Version: 6.0.0
# Created: 2025-10-13
# Updated: 2025-10-22
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
**Progress:** 2.7/21 tasks complete (~12%)
**Started:** 2025-10-13
**Target MVP Completion:** 2026-03-10

**Current Task:** 1.2 UI Infrastructure (~70% complete)
**Next Milestone:** Complete Task 1.2 by 2025-10-25

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

### **Communication Architecture:**

**REST API (External):**
- Frontend → Backend
- HTTP/JSON
- Ports: 41XX (e.g., 4101, 4102)

**gRPC API (Internal):**
- Backend ↔ Backend
- gRPC/Protobuf
- Ports: 51XX (e.g., 5101, 5102)

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- @l-kern/config (hooks, utils, theme, translations)
- @l-kern/ui-components (17 production components)

**Backend** (Planned - Task 1.3+):
- Python 3.11 + FastAPI
- PostgreSQL 15 (one DB per service)
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
**Timeline:** Oct 2025 - Mar 2026

| Task | Status | Target Completion |
|------|--------|-------------------|
| 1.0 Infrastructure | ✅ COMPLETED | 2025-10-15 |
| 1.1 Coding Standards | ✅ COMPLETED | 2025-10-15 |
| 1.2 UI Infrastructure | ⏳ IN PROGRESS | 2025-10-25 |
| 1.3 Backend Infrastructure | ⏸️ PLANNED | 2025-10-28 |
| 1.4 Contacts Service | ⏸️ PLANNED | 2025-11-05 |
| 1.5 Employees Service | ⏸️ PLANNED | 2025-11-11 |
| 1.6 Issues Service | ⏸️ PLANNED | 2025-11-17 |
| 1.7 Customers Service | ⏸️ PLANNED | 2025-11-23 |
| 1.8 Parts Service | ⏸️ PLANNED | 2025-11-29 |
| 1.9 Orders Service | ⏸️ PLANNED | 2025-12-06 |
| 1.10 Logistics | ⏸️ PLANNED | 2025-12-12 |
| 1.11 Suppliers | ⏸️ PLANNED | 2025-12-18 |
| 1.12 Warehouse | ⏸️ PLANNED | 2025-12-25 |
| 1.13 Mail Client | ⏸️ PLANNED | 2026-01-01 |
| 1.14 Documents | ⏸️ PLANNED | 2026-01-08 |
| 1.15 Invoicing | ⏸️ PLANNED | 2026-01-16 |
| 1.16 Inquiries | ⏸️ PLANNED | 2026-01-22 |
| 1.17 Operations | ⏸️ PLANNED | 2026-01-29 |
| 1.18 Authentication | ⏸️ PLANNED | 2026-02-06 |
| 1.19 Testing & QA | ⏸️ PLANNED | 2026-02-21 |
| 1.20 Production Prep | ⏸️ PLANNED | 2026-03-04 |
| 1.21 Deploy to Production | ⏸️ PLANNED | 2026-03-10 |

**Progress:** 2.7/21 tasks (~12%)

---

## ⏳ Current Work (Task 1.2)

### **1.2 UI Infrastructure (@l-kern/ui-components)**

**Started:** 2025-10-18
**Target:** 2025-10-25 (~3 days remaining)
**Progress:** ~70% complete

**Completed:**
- ✅ Form Components (6/6) - Button, Input, FormField, Select, Checkbox, Radio/RadioGroup
- ✅ Layout Components (4/4) - Card, Badge, Spinner, EmptyState
- ✅ Utility Functions (22/22) - phone, email, date, validation utils
- ✅ Modal & Wizard (13 items) - Modal, WizardProgress, WizardNavigation, DebugBar, Toast, DashboardCard + 6 hooks

**Remaining:**
- ⏳ Table/DataGrid (4-6h) - 🔴 CRITICAL
- ⏸️ FilterAndSearch (2-3h) - ⚠️ IMPORTANT
- ⏸️ Page Templates (3-4h) - 💡 NICE TO HAVE

**Current Stats:**
- Components: 17 production ✅
- Hooks: 6 ✅
- Utilities: 22 functions ✅
- Tests: 394/394 passing (100%) ✅
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
**Test Coverage:** 100% (394/394 tests) ✅
**Accessibility:** WCAG AA compliant ✅
**Documentation:** 29/29 items documented (100%) ✅

---

## 📞 Quick Links

- **Roadmap:** [roadmap.md](roadmap.md) - Complete phase plan with dates
- **Documentation Map:** [docs/README.md](../README.md) - All documentation indexed
- **Coding Standards:** [programming/coding-standards.md](../programming/coding-standards.md)
- **Testing Guide:** [programming/testing-overview.md](../programming/testing-overview.md)

---

**Last Updated:** 2025-10-22
**Maintainer:** BOSSystems s.r.o.
**Next Review:** After Task 1.2 completion (2025-10-25)
