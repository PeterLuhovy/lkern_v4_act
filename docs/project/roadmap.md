# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 4.0.0
# Created: 2025-10-13
# Updated: 2025-10-30
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Architecture: Domain-Driven Microservices (Bounded Context)
# Previous Version: v3.0.0 (archived to docs/temp/roadmap-v3.0.0-obsolete.md)
#
# Key Changes from v3.0.0:
# - ✅ Microservices reorganized: Sales (AR), Purchasing (AP), Finance (GL)
# - ✅ Added: Production Planning & Quality (PPQ), Operations (BPM)
# - ✅ Added: Configuration service, Event-Driven Architecture (Kafka)
# - ✅ GDPR compliance: Sensitive data strategy defined
# - ✅ Architecture reference: docs/architecture/microservices-architecture.md
# ================================================================

---

## 📖 How to Use This Roadmap

**Purpose:** Complete development plan from MVP to production-ready system

**How to work with it:**
1. **Find current task** - Look for ⏳ IN PROGRESS status (always exactly ONE task)
2. **Complete task** - Change status to ✅ COMPLETED, add completion date
3. **Move to next** - Change next task from ⏸️ PLANNED to ⏳ IN PROGRESS
4. **Add new tasks** - When bugs/features arise, add under appropriate phase
5. **Update version** - Increment version (4.0.0 → 4.1.0) after changes
6. **Update dates** - Adjust target dates when delays occur

**Status symbols:**
- ✅ COMPLETED - Task finished (with date)
- ⏳ IN PROGRESS - Currently working (only ONE at a time!)
- ⏸️ PLANNED - Not started yet
- 🔴 CRITICAL - Blocker, must be done ASAP
- ⚠️ IMPORTANT - High priority
- 💡 NICE TO HAVE - Can wait

**Quick scan tip:** Čítaj len názvy taskov a statusy - za 5 sekúnd vidíš čo je hotové a čo ďalej!

**Architecture Reference:** See [microservices-architecture.md](../architecture/microservices-architecture.md) for complete design

---

## 🎯 CURRENT PRIORITY: Modal System v3.0 Implementation

**⚠️ ACTIVE WORK:** Modal System má PRIORITU pred backend mikroservismi!

**Status**: ⏳ IN PROGRESS (Phase 1.3 ✅ DONE, Phase 2 NEXT)
**Started**: 2025-10-20
**Plan Document**: [implementation-plan-modal-system-v3.md](../temp/implementation-plan-modal-system-v3.md)

### **Scope:**
- **Components**: 22 modal components from v3 project to port
- **Tests**: 150+ unit tests + 20+ integration tests
- **Effort**: 100-130 hours total (20-26 days @ 5h/day)
- **Risk**: ⚠️ HIGH (complex dependencies, backend API integration)

### **Implementation Phases:**

| Phase | Description | Effort | Status | Target |
|-------|-------------|--------|--------|--------|
| Phase 1.1 | useFormDirty hook | 2-3h | ✅ DONE (2025-10-20) | - |
| Phase 1.2 | useConfirm hook | 4-5h | ✅ DONE (2025-10-20) | - |
| Phase 1.3 | Validation utilities | 2h | ✅ DONE (2025-10-21) | - |
| **Phase 2** | **Core Modals (3)** | 15-20h | ⏳ **NEXT** | 2025-10-25 |
| Phase 3 | Advanced Modals (2) | 30-40h | ⏸️ Pending | 2025-11-01 |
| Phase 4 | List Editors (6) | 20-25h | ⏸️ Pending | 2025-11-05 |
| Phase 5 | Smart Autocomplete (6) | 15-20h | ⏸️ Pending | 2025-11-08 |
| Phase 6 | Supporting Components (4) | 8-12h | ⏸️ Pending | 2025-11-10 |
| Phase 7 | Testing & Validation | 8-12h | ⏸️ Pending | 2025-11-12 |

### **Phase 2 Details: Core Modals (3 components)** ⏳ IN PROGRESS

**What to build:**

**1. ConfirmModal** (5-6h) - ✅ FULLY COMPLETED (2025-10-30)
- ✅ Replaces MiniConfirmModal from v3
- ✅ Reusable confirmation dialog component with two modes (simple + danger)
- ✅ Uses Modal component internally
- ✅ SK/EN translations support with localized keyword validation
- ✅ Variants: simple (yes/no), danger (keyword confirmation)
- ✅ Fixed danger mode validation (FormField controlled mode support added)
- ✅ Dark mode compatibility fixed
- ✅ **15/15 unit tests passing (100%)** - All tests fixed and enhanced
- ✅ **useConfirm hook: 26/26 tests passing** - Enhanced with v2.0.0 API
- ✅ **FormField v3.1.0: 33/33 tests passing** - Added controlled mode tests
- ✅ Complete documentation (ConfirmModal.md)
- ✅ Tested on TestModalV3Page (http://localhost:4201/testing/modal-v3)

**2. EditItemModal** (4-6h) - ✅ **COMPLETED (2025-10-30)**
- ✅ Generic add/edit wrapper with controlled FormField integration
- ✅ Form validation integration (real-time validation)
- ✅ useFormDirty integration (unsaved changes detection with confirmation)
- ✅ Optional clear button with danger-subtle variant (🧹 emoji)
- ✅ Customizable footer buttons (save/cancel/clear)
- ✅ SK/EN translations support
- ✅ 20/20 unit tests passing (100%)
- ✅ Complete documentation (EditItemModal.md)
- ✅ Tested on TestModalV3Page (Test 12: Add/Edit Item)

**3. ManagementModal** (4-6h)
- List management wrapper from v3
- CRUD operations support
- Integrates with EditItemModal
- Add/Edit/Delete functionality
- 12 unit tests
- Documentation (ManagementModal.md)

**Deliverables:**
- 3 production-ready modal components (2/3 done ✅)
- Complete documentation for each (2/3 done ✅)
- 55 tests passing (15+20+20) - **35/55 done ✅** (ConfirmModal + EditItemModal complete)
- Export from @l-kern/ui-components ✅

**Additional Improvements (Phase 2.1):**
- ✅ **FormField v3.1.0** - Added controlled mode support (value + onChange props)
  - Supports both controlled and uncontrolled modes
  - Enables parent components to manage FormField state (critical for ConfirmModal danger mode)
  - Updated documentation with controlled mode examples
  - 33/33 tests passing (added 7 new controlled mode tests)
- ✅ **Button v1.2.0** - Added danger-subtle variant (2025-10-30)
  - New danger-subtle variant for less critical destructive actions
  - Theme-aware colors (light: #c97575, dark: #904040) via design tokens
  - Used in EditItemModal clear button with 🧹 emoji
  - Updated Button.md documentation with examples
  - 20/20 tests passing (added danger-subtle test)
- ✅ **Modal v3.8.1** - Fixed useEffect dependencies (2025-10-30)
  - Removed onClose/onConfirm from dependencies array (line 361)
  - Prevents unmount/remount cycles when parent re-renders
  - Improves performance and prevents stale closure bugs
  - Updated Modal.md documentation with changelog
- ✅ **Test Refactoring Specialist Agent v1.2.0** - Updated (2025-10-30)
  - Added communication rules (write before/after every tool use)
  - Added "NO unnecessary mocks" rule
  - Check for real components before creating mocks
  - Use real components from @l-kern/ui-components instead of mocking

**After Phase 2 → Continue to Phase 3 (Advanced Modals)**
**After Modal System complete (Phase 7) → Resume Backend Development (Task 1.3)**

---

## 🎯 Version Strategy

**Current Version:** 4.0.0 (MVP Development)

| Version | Phase | Goal | Target Date | Status |
|---------|-------|------|-------------|--------|
| **4.0.x** | Phase 1 | MVP - Core functionality | 2026-06-30 | ⏳ IN PROGRESS |
| **4.1.x** | Phase 2 | Security, bug fixes | TBD | ⏸️ PLANNED |
| **4.2.x** | Phase 3 | Production hardening | TBD | ⏸️ PLANNED |
| **4.3.x+** | Phase 4+ | Features, competitiveness | TBD | ⏸️ PLANNED |

**Version Increments:**
- **4.0.x → 4.1.0** - Phase 1 complete, MVP deployed to production
- **4.1.x → 4.2.0** - Phase 2 complete, security hardened
- **4.2.x → 4.3.0** - Phase 3 complete, production stable
- **4.x.0 → 4.x.1** - Minor fixes within phase

---

## 📋 PHASE 1: MVP Development (v4.0.x)

**Goal:** Build minimum viable product and deploy to production
**Timeline:** Oct 2025 - Jun 2026 (extended due to PPQ and Operations additions)
**Progress:** 2.7/19 tasks (~14%)
**Architecture:** Domain-Driven Microservices (see [microservices-architecture.md](../architecture/microservices-architecture.md))

---

## ✅ COMPLETED TASKS

### **1.0 Infrastructure Setup** ✅ COMPLETED (2025-10-15)
- ✅ Nx workspace (Yarn 4 + TypeScript 5.7)
- ✅ Docker development environment
- ✅ React 19 web-ui (port 4201)
- ✅ @l-kern/config package
- ✅ Documentation structure (docs/README.md, overview.md, roadmap.md)
- ✅ Port mapping strategy (LKMS{XXX} → 4{XXX})

---

### **1.1 Coding Standards** ✅ COMPLETED (2025-10-15)
- ✅ Created coding-standards.md (2235 lines)
- ✅ Created code-examples.md (1700 lines)
- ✅ TypeScript conventions
- ✅ React component patterns
- ✅ Python/FastAPI conventions
- ✅ Testing standards (pytest + Vitest)

---

### **1.2 UI Infrastructure (@l-kern/ui-components)** ⏳ IN PROGRESS (~75%)
**Started:** 2025-10-18
**Target Completion:** 2025-11-12 (Modal System v3.0 complete)

#### **1.2.1 Form Components** ✅ COMPLETED (2025-10-18)
- ✅ Button (primary, secondary, danger, ghost, success)
- ✅ Input (text, number, email, password)
- ✅ FormField wrapper
- ✅ Select (dropdown)
- ✅ Checkbox (with indeterminate)
- ✅ Radio/RadioGroup
- ✅ 115 tests passing

#### **1.2.2 Layout Components** ✅ COMPLETED (2025-10-18)
- ✅ Card
- ✅ Badge
- ✅ Spinner/Loader
- ✅ EmptyState
- ✅ 67 tests passing

#### **1.2.3 Utility Functions** ✅ COMPLETED (2025-10-21)
- ✅ phoneUtils (6 functions - SK/CZ/PL support)
- ✅ emailUtils (5 functions)
- ✅ dateUtils (9 functions - SK/EN formats)
- ✅ validation (debounce, validateField)
- ✅ 148 tests passing
- ✅ Bug fixes (2 critical bugs in dateUtils)

#### **1.2.4 Advanced Components** ⏳ IN PROGRESS (~50%)

**1.2.4.1 Modal System** ⏳ IN PROGRESS (~60%)
**Priority:** 🔴 CRITICAL - Active work

**Completed:**
- ✅ Modal (centered variant) - 26 tests
- ✅ WizardProgress - 15 tests
- ✅ WizardNavigation
- ✅ DebugBar
- ✅ Toast + ToastContainer
- ✅ DashboardCard
- ✅ useModalWizard hook - 19 tests
- ✅ useModal hook
- ✅ usePageAnalytics hook
- ✅ useToast hook + ToastContext
- ✅ useFormDirty hook - 12 tests (2025-10-20)
- ✅ useConfirm hook - 17 tests (2025-10-20)
- ✅ ModalContext (z-index management)
- ✅ validation utilities (debounce, validateField)

**Next (Modal System v3.0 - Complete Port from v3):**

**Phase 2: Core Modals** (15-20h, target: 2025-10-25)
- ✅ **ConfirmModal** - COMPLETED (2025-10-30) - 15/15 tests passing (100%), docs complete
- ⏳ **EditItemModal** - 🔴 IN PROGRESS (4-6h) - **CURRENT TASK**
- ⏸️ **ManagementModal** (4-6h)

**Phase 3-7:** See CURRENT PRIORITY section above

**1.2.4.2 Data Display** ⏸️ DEFERRED (After Modal System v3.0)
**Priority:** 🔴 CRITICAL - Next after modals

- ⏸️ **Table/DataGrid** - 🔴 CRITICAL (4-6h, target: 2025-11-15)
  - Sortable columns (ASC/DESC toggle)
  - Pagination (prev/next/page size)
  - Row selection (single/multi checkboxes)
  - Empty state + loading state
  - Responsive (horizontal scroll)
  - **Blocks:** ContactList page, all CRUD list pages

- ⏸️ **FilterAndSearch** - ⚠️ IMPORTANT (2-3h, target: 2025-11-16)
  - Search input with debounce
  - Filter dropdowns (status, category, date)
  - Clear filters button
  - Filter count badge

**Current Stats:**
- Components: 17 production ✅
- Hooks: 6 ✅
- Utilities: 22 functions ✅
- Tests: 394/394 passing (100%) ✅

---

## 🏗️ BACKEND MICROSERVICES ARCHITECTURE

**Architecture Change (v4.0.0):**
- ❌ **OLD (v3.0.0):** Data-centric services (Customers, Suppliers, Orders, Invoices)
- ✅ **NEW (v4.0.0):** Domain-centric services (Sales AR, Purchasing AP, Finance GL)

**Reference:** See [microservices-architecture.md](../architecture/microservices-architecture.md) for:
- Bounded Context principles
- Sensitive data strategy (GDPR)
- Event-driven architecture (Kafka)
- Complete API specifications

---

### **1.3 Backend Infrastructure** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.2 complete
**Estimated:** 12-16 hours (3-4 days)
**Target Start:** 2025-11-13
**Target Completion:** 2025-11-17

#### **1.3.1 PostgreSQL Setup**
- ⏸️ Add PostgreSQL 15 to docker-compose.yml
- ⏸️ Configure on port 4501
- ⏸️ Setup database volume
- ⏸️ Configure health checks
- ⏸️ Test connection
- ⏸️ Create database per service strategy

#### **1.3.2 Alembic Migrations**
- ⏸️ Install Alembic
- ⏸️ Create migration scripts structure
- ⏸️ Document migration workflow
- ⏸️ Test migration up/down

#### **1.3.3 gRPC Infrastructure**
- ⏸️ Install grpcio + grpcio-tools
- ⏸️ Create proto/ directory
- ⏸️ Setup proto compilation pipeline
- ⏸️ Create base gRPC service template
- ⏸️ Document gRPC patterns

#### **1.3.4 Apache Kafka Setup** ✨ NEW
- ⏸️ Add Kafka + Zookeeper to docker-compose.yml
- ⏸️ Configure Kafka on port 9092
- ⏸️ Setup Kafka topics (ContactUpdated, InvoiceIssued, etc.)
- ⏸️ Create Python Kafka producer/consumer utilities
- ⏸️ Document event-driven patterns

#### **1.3.5 Adminer UI**
- ⏸️ Add Adminer to docker-compose.yml
- ⏸️ Configure on port 4901
- ⏸️ Test database access

---

### **1.3.6 System Health & Backup API** ⏸️ PLANNED - ⚠️ IMPORTANT
**Dependencies:** Task 1.3.1-1.3.5 complete
**Estimated:** 2-3 hours
**Target Start:** 2025-11-17
**Target Completion:** 2025-11-17
**Purpose:** API endpoints for StatusBar monitoring

#### **Health Monitoring Endpoint**
- ⏸️ Create GET /api/v1/system/health endpoint
- ⏸️ Return ServiceStatus[] (name, status, critical, response_time)
- ⏸️ Check PostgreSQL connection health
- ⏸️ Check Kafka connection health
- ⏸️ Check Adminer availability
- ⏸️ Mark critical vs non-critical services

#### **Backup Management Endpoints**
- ⏸️ Create POST /api/v1/system/backup endpoint
- ⏸️ Create GET /api/v1/system/backup/status endpoint
- ⏸️ Implement database backup logic (pg_dump)
- ⏸️ Return BackupInfo (completed_at, files, status)
- ⏸️ Document backup restore procedure

---

### **1.4 Page Templates (StatusBar)** ⏸️ PLANNED - ⚠️ IMPORTANT
**Dependencies:** Task 1.3.6 complete (Health & Backup API)
**Estimated:** 5-7 hours
**Target Start:** 2025-11-18
**Target Completion:** 2025-11-20
**Analysis Document:** [statusbar-analysis-v3-to-v4.md](../temp/statusbar-analysis-v3-to-v4.md)

**Purpose:** System monitoring UI at bottom of every page

#### **1.4.1 StatusBar Component** (3-4h)
- ⏸️ Port StatusBar.tsx from v3 (v2.1.0)
  - Source: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBar\StatusBar.tsx`
- ⏸️ Port StatusBar.css with DRY compliance (CSS Modules)
  - Source: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBar\StatusBar.css`
- ⏸️ System service monitoring display (healthy/unhealthy/down/unknown)
- ⏸️ Database backup management UI (one-click backup with progress)
- ⏸️ Theme/language toggle controls (light/dark, SK/EN)
- ⏸️ Drag-resize capability (150-600px height range)
- ⏸️ LocalStorage persistence (expanded height)
- ⏸️ Integration with real backend services (health API)
- ⏸️ Critical vs non-critical service categorization
- ⏸️ Current user info display (avatar, name, position)
- ⏸️ Data source indicator (orchestrator/mock/error modes)
- ⏸️ Click outside to collapse
- ⏸️ Response time metrics display
- ⏸️ 20 unit tests
- ⏸️ Documentation (StatusBar.md)

#### **1.4.2 StatusBadge Component** (1h)
- ⏸️ Port StatusBadge.tsx from v3 (v1.0.0)
  - Source: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBadge\StatusBadge.tsx`
- ⏸️ Order/item status inline badges
- ⏸️ Color-coded status display (PENDING/IN_PRODUCTION/COMPLETED/etc.)
- ⏸️ Compact and default variants
- ⏸️ Translation support
- ⏸️ 8 unit tests
- ⏸️ Documentation (StatusBadge.md)

#### **1.4.3 BaseLayout Integration** (1-2h)
- ⏸️ Create BaseLayout component (extends BasePage)
  - Reference: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\layouts\BaseLayout.tsx`
- ⏸️ Integrate StatusBar at bottom of layout
- ⏸️ Create BaseLayoutDataContext for StatusBar data
  - Reference: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\contexts\BaseLayoutDataContext.tsx`
- ⏸️ Wire up service health API (GET /api/v1/system/health)
- ⏸️ Wire up backup API (POST /api/v1/system/backup)
- ⏸️ Add error handling for API failures
- ⏸️ Add loading states
- ⏸️ 10 integration tests
- ⏸️ Update app to use BaseLayout

**Deliverables:**
- 2 production-ready components (StatusBar + StatusBadge)
- BaseLayout template with StatusBar integrated
- Complete documentation for each
- 38 tests passing (20+8+10)
- Export from @l-kern/ui-components

**API Endpoints Required:**
- ✅ GET /api/v1/system/health → ServiceStatus[] (Task 1.3.6)
- ✅ POST /api/v1/system/backup → BackupInfo (Task 1.3.6)
- ✅ GET /api/v1/system/backup/status → BackupInfo (Task 1.3.6)

**V3 Source Files:**
- StatusBar.tsx: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBar\StatusBar.tsx` (v2.1.0, 651 lines)
- StatusBar.css: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBar\StatusBar.css` (v2.0.0, ~300 lines)
- StatusBadge.tsx: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBadge\StatusBadge.tsx` (v1.0.0, ~150 lines)
- BaseLayout.tsx: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\layouts\BaseLayout.tsx` (v2.3.0)
- statusHelpers.ts: `l:\system\lkern_codebase_v3_act\packages\page-templates\src\utils\statusHelpers.ts` (v2.0.0)

---

## 📦 PHASE I: Foundation Services (Master Data & Configuration)

These services MUST be completed FIRST - they provide reference data for all other services.

---

### **1.5 Contact (MDM) Service** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.3 complete
**Estimated:** 25-30 hours (6-7 days)
**Target Start:** 2025-11-18
**Target Completion:** 2025-11-25
**Ports:** 4101 (REST), 5101 (gRPC)
**Database:** lkms101_contacts

**Architecture Note:** Master Data Management - Single Source of Truth for identity

#### **1.4.1 Backend**
- ⏸️ Create FastAPI service structure
- ⏸️ Setup gRPC server
- ⏸️ Define Contact model (UUID v4, Name, Address, Tax ID)
- ⏸️ **IMPORTANT:** ONLY non-sensitive data (NO bank accounts, NO salaries)
- ⏸️ Create database migration
- ⏸️ REST API: POST/GET/PUT/DELETE /api/v1/contacts
- ⏸️ REST API: GET /api/v1/contacts/search
- ⏸️ gRPC API: GetContact, GetContactsByIds, ValidateContact
- ⏸️ Create .proto file
- ⏸️ **Kafka integration:** Emit ContactCreated, ContactUpdated, ContactDeleted events
- ⏸️ Validation (Pydantic schemas)
- ⏸️ Unit tests (pytest)

#### **1.4.2 Frontend**
- ⏸️ Contacts page (with Table component)
- ⏸️ Contact list view
- ⏸️ Contact detail view
- ⏸️ Contact form (add/edit)
- ⏸️ Search functionality
- ⏸️ Pagination
- ⏸️ Loading states
- ⏸️ Error handling

**GDPR Compliance:**
- ✅ NO bank accounts stored here
- ✅ NO personal employee data (salaries, personal IDs)
- ✅ ONLY public business information

---

### **1.6 Configuration Service** ⏸️ PLANNED - 🔴 CRITICAL ✨ NEW
**Dependencies:** Task 1.3 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-11-18 (parallel with 1.5)
**Target Completion:** 2025-11-23
**Ports:** 4199 (REST), 5199 (gRPC)
**Database:** lkms199_config

**Architecture Note:** Global and localized settings for all services

#### **Backend**
- ⏸️ Create FastAPI service structure
- ⏸️ Setup gRPC server
- ⏸️ Define Configuration models:
  - Chart of Accounts (COA) - localized (SK/CZ/PL)
  - VAT codes and rates
  - Currency exchange rates
  - Accounting periods (fiscal year)
  - Document numbering sequences
  - Country-specific regulations
- ⏸️ Create database migration
- ⏸️ REST API: GET /api/v1/config/coa, /api/v1/config/vat, /api/v1/config/currencies
- ⏸️ gRPC API: GetCOA, GetVATCodes, GetExchangeRate
- ⏸️ Create .proto file
- ⏸️ Validation (Pydantic schemas)
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Configuration settings page
- ⏸️ COA management
- ⏸️ VAT rate configuration
- ⏸️ Currency exchange rate updates
- ⏸️ Accounting period setup

**Provides For:** Finance, Sales, Purchasing

---

### **1.7 HR / Payroll Service** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.5 complete (Contact MDM)
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2025-11-26
**Target Completion:** 2025-12-02
**Ports:** 4108 (REST), 5108 (gRPC)
**Database:** lkms108_employees

**Architecture Note:** GDPR-protected sensitive employee data

#### **1.6.1 Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Employee model (UUID reference to Contact MDM)
- ⏸️ **SENSITIVE DATA (GDPR protected):**
  - ✅ Salaries
  - ✅ Personal IDs (rodné číslo)
  - ✅ Bank accounts of EMPLOYEES
  - ✅ Personal contracts
- ⏸️ **Production Planning data:** ✨ NEW
  - ✅ Work roles (for Operations job assignment)
  - ✅ Qualification levels (for PPQ optimization)
  - ✅ Quality metrics (accuracy, speed, error rate)
  - ✅ Employee availability calendar
- ⏸️ Database migration
- ⏸️ REST API: CRUD /api/v1/employees
- ⏸️ REST API: GET /api/v1/employees/by-role (for Operations)
- ⏸️ gRPC API: GetEmployee, GetEmployeesByIds, GetEmployeesByRole
- ⏸️ **Kafka integration:** Emit EmployeeCreated, EmployeeRoleChanged, EmployeeAbsent, EmployeeAvailable
- ⏸️ Role management
- ⏸️ Tests (pytest)

#### **1.6.2 Frontend**
- ⏸️ Employees page
- ⏸️ Employee list view
- ⏸️ Employee detail view
- ⏸️ Add/Edit employee form
- ⏸️ Role assignment interface
- ⏸️ Qualification tracking

**Security:**
- ✅ STRICT access control (HR Manager, Finance Director only)
- ✅ GDPR audit logging
- ✅ Encrypted at rest

**Provides For:**
- Operations (job assignment)
- Production Planning & Quality (resource allocation)
- Finance (payroll accounting)

---

## 📦 PHASE II: Core Operations (Transactional Services)

These modules manage main business transactions and create source documents.

---

### **1.8 Inventory / Logistics Service** ⏸️ PLANNED - ⚠️ IMPORTANT
**Dependencies:** Tasks 1.5, 1.6, 1.7 complete
**Estimated:** 25-30 hours (6-7 days)
**Target Start:** 2025-12-03
**Target Completion:** 2025-12-10
**Ports:** 4111 (REST), 5111 (gRPC)
**Database:** lkms111_warehouse

**Architecture Note:** Merged Parts + Warehouse + Logistics from v3.0.0

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Models:
  - Product catalog (SKU)
  - Warehouse locations
  - Stock levels (physical quantity)
  - Goods receipts (príjem tovaru)
  - Goods issues (výdaj tovaru)
  - **Delivery notes** ✅ (NOT accounting documents!)
  - Product characteristics (precision requirements, etc.)
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/products, /api/v1/stock, /api/v1/stock/movements
- ⏸️ REST API: /api/v1/delivery-notes
- ⏸️ gRPC API: GetStockLevel, ReserveStock, ReleaseStock, GetProduct
- ⏸️ **Kafka integration:** Emit GoodsReceived, GoodsIssued, StockLevelCritical
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Inventory page (with Table component)
- ⏸️ Product catalog management
- ⏸️ Stock overview
- ⏸️ Goods receipt/issue forms
- ⏸️ Delivery note generation
- ⏸️ Low stock alerts

**Provides For:**
- Purchasing (3-way match)
- Sales (stock availability)
- Manufacturing (BOM)
- Finance (inventory valuation)

---

### **1.9 Purchasing (AP) Service** ⏸️ PLANNED - 🔴 CRITICAL ✨ NEW ARCHITECTURE
**Dependencies:** Tasks 1.5, 1.6, 1.8 complete
**Estimated:** 35-40 hours (8-10 days)
**Target Start:** 2025-12-11
**Target Completion:** 2025-12-21
**Ports:** 4106 (REST), 5106 (gRPC)
**Database:** lkms106_purchasing

**Architecture Note:** Replaces Suppliers + Orders + Invoices (AP part) from v3.0.0

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Models:
  - **Vendor data** (business context):
    - Approval status (Qualified, Preferred, Blocked)
    - Payment terms
    - **Bank account of VENDOR** ✅ (stored HERE, not in Contact!)
    - Gamification data (supplier loyalty program)
  - **Received RFQ** (Request for Quote - prijatý dopyt) ✅
  - **Purchase Orders (PO)** (prijatá objednávka) ✅
  - **Received Invoices (AP)** ✅
  - 3-Way Match logic (PO → Goods Receipt → Invoice)
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/vendors, /api/v1/rfq, /api/v1/purchase-orders, /api/v1/invoices/received
- ⏸️ gRPC API: GetVendor, GetPO, ValidateVendor, Get3WayMatchStatus
- ⏸️ **Kafka integration:**
  - Emit: PurchaseOrderCreated, PurchaseOrderApprovalRequired, InvoiceReceived, VendorPaymentSent
  - Consume: GoodsReceived (from Inventory for 3-way match)
- ⏸️ **3-Way Match implementation:** ✨ NEW
  - Step 1: PO created
  - Step 2: Goods Receipt received (from Inventory)
  - Step 3: Invoice received
  - Validation: Amount, quantity, vendor match
  - If match → Approve payment, If mismatch → Alert
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Purchasing page (with Table component)
- ⏸️ Vendor management
- ⏸️ RFQ tracking
- ⏸️ Purchase order creation/approval
- ⏸️ Received invoice tracking
- ⏸️ 3-Way match dashboard
- ⏸️ Payment scheduling

**GDPR Compliance:**
- ✅ Bank accounts of VENDORS stored HERE (used for payments)
- ✅ NOT in Contact (MDM)

**Provides For:**
- Finance (AP entries)
- Cash & Bank (payment processing)
- Operations (approval workflows)

---

### **1.10 Sales (AR) Service** ⏸️ PLANNED - 🔴 CRITICAL ✨ NEW ARCHITECTURE
**Dependencies:** Tasks 1.5, 1.6, 1.8 complete
**Estimated:** 35-40 hours (8-10 days)
**Target Start:** 2025-12-22
**Target Completion:** 2026-01-02
**Ports:** 4103 (REST), 5103 (gRPC)
**Database:** lkms103_sales

**Architecture Note:** Replaces Customers + Orders + Invoices (AR part) from v3.0.0

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Models:
  - **Customer data** (business context):
    - Credit limits
    - Approval status (Approved, Blocked)
    - Payment terms
    - **Bank account of CUSTOMER** ✅ (stored HERE, not in Contact!)
    - Gamification data (customer loyalty program)
  - **Issued Quotations** (vydaný dopyt) ✅
  - **Sales Orders (SO)** (vydaná objednávka) ✅
  - **Issued Invoices (AR)** ✅
  - Pricing rules, discounts
  - **Overdue tracking** (invoices past due date) ✨ NEW
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/customers, /api/v1/quotations, /api/v1/sales-orders, /api/v1/invoices/issued
- ⏸️ REST API: GET /api/v1/invoices/overdue (for Operations triggers)
- ⏸️ gRPC API: GetCustomer, GetSO, ValidateCustomer, CheckCreditLimit
- ⏸️ **Kafka integration:**
  - Emit: CustomerRequestReceived, QuotationIssued, SalesOrderCreated, InvoiceIssued, InvoiceOverdue, CustomerPaymentReceived, CreditLimitBreached
  - Consume: GoodsIssued (from Inventory for order fulfillment)
- ⏸️ **Overdue tracking implementation:** ✨ NEW
  - Scheduled job (daily): Check invoices where DueDate < CurrentDate
  - If overdue: Emit InvoiceOverdue event
  - Operations consumes event → Creates reminder job
  - If overdue > 7 days: Emit CreditLimitBreached → Block new orders
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Sales page (with Table component)
- ⏸️ Customer management
- ⏸️ Quotation tracking
- ⏸️ Sales order creation
- ⏸️ Issued invoice tracking
- ⏸️ Overdue invoices dashboard
- ⏸️ Payment tracking

**GDPR Compliance:**
- ✅ Bank accounts of CUSTOMERS stored HERE (used for direct debit)
- ✅ NOT in Contact (MDM)

**Provides For:**
- Finance (AR entries)
- Cash & Bank (payment tracking)
- Operations (order fulfillment workflows)
- Production Planning (order requirements)

---

### **1.11 Manufacturing Service** ⏸️ PLANNED - ⚠️ IMPORTANT
**Dependencies:** Tasks 1.8, 1.10 complete
**Estimated:** 25-30 hours (6-7 days)
**Target Start:** 2026-01-03
**Target Completion:** 2026-01-10
**Ports:** 4112 (REST), 5112 (gRPC)
**Database:** lkms112_manufacturing

**Architecture Note:** Enhanced with machine characteristics for PPQ

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Models:
  - Bills of Materials (BOM) (kusovník)
  - Work centers (pracovné centrá - machines/stations)
  - **Machine characteristics:** ✨ NEW (for PPQ)
    - Precision level (e.g., ±5 microns)
    - Speed (units/hour)
    - Error rate / defect history
    - Current utilization (vyťaženie)
    - Maintenance status
  - Work orders (pracovné príkazy)
  - Production capacity planning
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/bom, /api/v1/work-centers, /api/v1/work-orders, /api/v1/machines
- ⏸️ REST API: GET /api/v1/machines/availability (for PPQ)
- ⏸️ gRPC API: GetBOM, GetWorkCenter, GetMachineCapabilities
- ⏸️ **Kafka integration:**
  - Emit: WorkOrderCreated, WorkOrderCompleted, MachineDown, MachineAvailable, ProductionCapacityChanged
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Manufacturing page (with Table component)
- ⏸️ BOM management
- ⏸️ Work center tracking
- ⏸️ Machine status dashboard
- ⏸️ Work order scheduling
- ⏸️ Production capacity overview

**Provides For:**
- Production Planning & Quality (resource allocation)
- Finance (production costing)
- Operations (work order tracking)

---

## 📦 PHASE III: Planning, Process Management & Finance (Orchestration)

These services process data from Phase II to generate financial data and optimized work plans.

---

### **1.12 Production Planning & Quality (PPQ)** ⏸️ PLANNED - 🔴 CRITICAL ✨ NEW SERVICE
**Dependencies:** Tasks 1.7, 1.10, 1.11 complete
**Estimated:** 40-50 hours (10-12 days) - Complex optimization logic
**Target Start:** 2026-01-11
**Target Completion:** 2026-01-23
**Ports:** 4XXX (REST), 5XXX (gRPC) - TBD
**Database:** lkms_ppq

**Architecture Note:** Advanced Planning & Scheduling with quality/speed optimization

**See:** [microservices-architecture.md](../architecture/microservices-architecture.md) section "Production Planning & Quality" for complete specification

#### **Backend - Phase 1 (MVP):**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ **Simple priority rules** (start here, NOT full optimization):
  - IF order.priority === 'Quality' → Assign best accuracy machine + qualified employee
  - IF order.priority === 'Speed' → Assign fastest machine + fastest employee
  - IF order.priority === 'Balanced' → Average selection
- ⏸️ Models:
  - Production calendar (schedule entries)
  - Resource assignments (employee + machine + timeslot)
  - Contingency plans (backup resources)
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/schedule, /api/v1/resource-allocation
- ⏸️ gRPC API: ScheduleJob, RescheduleJob, GetOptimalResources
- ⏸️ **Kafka integration:**
  - Consume: SalesOrderCreated (from Sales) → Trigger scheduling
  - Consume: MachineDown (from Manufacturing) → Trigger rescheduling
  - Consume: EmployeeAbsent (from HR) → Trigger contingency
  - Emit: JobScheduled, JobRescheduled, ResourceOverloaded
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Backend - Phase 2 (Advanced):** ⏸️ DEFERRED to v4.1.x
- Multi-criteria optimization (quality + speed + cost)
- Constraint-based scheduling
- Machine learning predictions
- Real-time rescheduling algorithms

#### **Frontend**
- ⏸️ Production planning dashboard
- ⏸️ Resource allocation interface
- ⏸️ Production calendar view
- ⏸️ Contingency plan viewer
- ⏸️ Utilization analytics

**Provides For:**
- Operations - optimized job assignments
- Manufacturing - production schedule
- Sales - realistic delivery dates

**Complexity Warning:** This is the MOST complex service. Start with simple rules, enhance later.

---

### **1.13 Operations (Workflow Orchestration / BPM)** ⏸️ PLANNED - 🔴 CRITICAL ✨ NEW SERVICE
**Dependencies:** Tasks 1.7, 1.9, 1.10, 1.11, 1.12 complete
**Estimated:** 35-40 hours (8-10 days)
**Target Start:** 2026-01-24
**Target Completion:** 2026-02-03
**Ports:** 4XXX (REST), 5XXX (gRPC) - TBD
**Database:** lkms_operations

**Architecture Note:** Business Process Management (BPM) - orchestrates end-to-end workflows

**See:** [microservices-architecture.md](../architecture/microservices-architecture.md) section "Operations" for complete specification

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ **Workflow definitions:**
  - ProcessCustomerQuote (dopyt from customer)
  - ApprovalWorkflow_PO (purchase order approval)
  - MonthEndAccounting (internal scheduled)
  - OrderFulfillment (production workflow)
- ⏸️ Models:
  - Workflow definitions
  - Job queue
  - Job assignments (employee + task + status)
  - Operation status (for customer visibility)
  - Approval history
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/workflows, /api/v1/jobs, /api/v1/operations
- ⏸️ REST API: GET /api/v1/operations/customer/:customerId (for customer portal)
- ⏸️ gRPC API: CreateJob, AssignJob, CompleteJob, GetOperationStatus
- ⏸️ **Kafka integration:**
  - Consume: CustomerRequestReceived (Sales) → Create quote job
  - Consume: PurchaseOrderApprovalRequired (Purchasing) → Create approval job
  - Consume: JobScheduled (PPQ) → Create production job
  - Consume: InvoiceOverdue (Sales) → Create reminder job
  - Emit: JobCreated, JobAssigned, JobCompleted, ApprovalRequired
- ⏸️ **Dynamic job assignment:**
  - Query HR: getEmployeesByRole(roleName)
  - Assign job to qualified employee
  - Track job status
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Operations dashboard (for managers)
- ⏸️ My Jobs page (for employees)
- ⏸️ Workflow designer (define new workflows)
- ⏸️ Operation status tracking (for customers)
- ⏸️ Approval interface

**Provides For:**
- Customer portal (status tracking)
- Employee dashboard (my jobs)
- Management (process monitoring)

---

### **1.14 Finance (GL) Service** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Tasks 1.6, 1.9, 1.10, 1.11 complete
**Estimated:** 35-40 hours (8-10 days)
**Target Start:** 2026-02-04
**Target Completion:** 2026-02-14
**Ports:** 4XXX (REST), 5XXX (gRPC) - TBD
**Database:** lkms_finance

**Architecture Note:** Accounting backbone - consolidates all financial transactions

**See:** [microservices-architecture.md](../architecture/microservices-architecture.md) section "Finance / General Ledger" for complete specification

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Models:
  - Chart of Accounts (from Configuration)
  - GL entries (journal) - Debit/Credit
  - Account balances
  - Accounting periods (open/closed)
  - Financial statements (P&L, Balance Sheet)
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/gl/entries, /api/v1/gl/accounts, /api/v1/reports
- ⏸️ REST API: GET /api/v1/reports/balance-sheet, /api/v1/reports/profit-loss
- ⏸️ gRPC API: CreateGLEntry, GetAccountBalance, ClosePeriod
- ⏸️ **Kafka integration (automatic posting):**
  - Consume: InvoiceIssued (Sales) → Create GL entry (Debit: AR, Credit: Revenue)
  - Consume: InvoiceReceived (Purchasing) → Create GL entry (Debit: Expense, Credit: AP)
  - Consume: GoodsIssued (Inventory) → Create GL entry (Debit: COGS, Credit: Inventory)
  - Consume: PaymentReceived (Cash & Bank) → Create GL entry (Debit: Bank, Credit: AR)
- ⏸️ **Tax compliance:**
  - VAT reporting (Kontrolný výkaz DPH - SK)
  - Tax calculations
  - Audit trail
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Finance dashboard
- ⏸️ GL entries viewer
- ⏸️ Account balances
- ⏸️ Financial reports (P&L, Balance Sheet)
- ⏸️ Period closing interface
- ⏸️ VAT return generation

**Provides For:**
- Management (financial reports)
- Tax authorities (VAT returns, financial statements)
- Auditors (audit trail)

---

### **1.15 Cash & Bank Service** ⏸️ PLANNED - ⚠️ IMPORTANT
**Dependencies:** Tasks 1.8, 1.9, 1.13 complete
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2026-02-15
**Target Completion:** 2026-02-21
**Ports:** 4XXX (REST), 5XXX (gRPC) - TBD
**Database:** lkms_cash_bank

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Models:
  - Bank accounts
  - Bank statements
  - Payment orders (SEPA)
  - Payment matching (AR/AP)
  - Cash register movements
- ⏸️ Database migration
- ⏸️ REST API: /api/v1/bank-accounts, /api/v1/payments, /api/v1/bank-statements
- ⏸️ gRPC API: CreatePayment, MatchPayment, GetBankBalance
- ⏸️ **Kafka integration:**
  - Emit: PaymentReceived, PaymentSent, BankStatementImported, PaymentMatched
- ⏸️ **Payment matching logic:**
  - Import bank statement
  - Match with open AR invoices (by amount, reference)
  - Match with open AP invoices
  - Auto-notify Finance on match
- ⏸️ Create .proto file
- ⏸️ Unit tests (pytest)

#### **Frontend**
- ⏸️ Cash & Bank dashboard
- ⏸️ Bank account overview
- ⏸️ Payment creation
- ⏸️ Bank statement import
- ⏸️ Payment matching interface

---

## 📦 PHASE IV: Final MVP Steps

---

### **1.16 Authentication Service (lkms107)** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.14 complete (all core services running)
**Estimated:** 25-30 hours (6-7 days)
**Target Start:** 2026-02-22
**Target Completion:** 2026-03-01
**Ports:** 4107 (REST), 5107 (gRPC)
**Database:** lkms107_auth

#### **Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ User model + migration
- ⏸️ REST API: register, login, logout, refresh, /me
- ⏸️ gRPC API: ValidateToken, GetUserByToken
- ⏸️ JWT generation/validation
- ⏸️ Password hashing (bcrypt)
- ⏸️ Role-based access control (RBAC)
- ⏸️ Tests (pytest)

#### **Frontend**
- ⏸️ Login page
- ⏸️ Auth context + protected routes
- ⏸️ API Client: @l-kern/api-client + auth interceptor + token refresh

---

### **1.17 Testing & QA** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.18 complete
**Estimated:** 50-70 hours (12-17 days) - More services = more tests
**Target Start:** 2026-03-02
**Target Completion:** 2026-03-19

- ⏸️ **Backend Testing:**
  - Unit tests for all services (pytest)
  - Integration tests for REST APIs
  - gRPC client/server tests
  - Inter-service communication tests
  - Kafka event flow tests ✨ NEW
  - Test coverage >80%
- ⏸️ **Frontend Testing:**
  - Component tests (Vitest + RTL)
  - E2E tests (Playwright)
  - Test coverage >70%
- ⏸️ **Integration Testing:**
  - Complete business workflows
  - 3-Way match validation ✨ NEW
  - Overdue tracking workflow ✨ NEW
  - Production planning scenarios ✨ NEW
  - Operations job assignment ✨ NEW
  - gRPC communication reliability
  - Performance testing
  - Security testing
- ⏸️ **CI/CD:**
  - GitHub Actions setup
  - Automated linting (ruff, mypy)

---

### **1.18 Production Deployment Prep** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.18 complete
**Estimated:** 35-45 hours (8-11 days) - More services = more config
**Target Start:** 2026-03-20
**Target Completion:** 2026-03-31

- ⏸️ **Server Setup:**
  - Prepare production servers
  - Install Docker + Docker Compose
  - Configure firewall rules (REST 41XX, gRPC 51XX, Kafka 9092, Nginx 443)
  - Setup SSL certificates (Let's Encrypt)
- ⏸️ **Kafka Production Setup:** ✨ NEW
  - Kafka cluster configuration
  - Topic replication
  - Consumer group management
- ⏸️ **Nginx Configuration (REST + static):**
  - REST reverse proxy
  - SSL/TLS termination
  - Static file serving (React build)
  - Proxy rules /api/* → microservices
  - Compression + caching
- ⏸️ **Production Configurations:**
  - Production Dockerfiles
  - Multi-stage builds
  - Production docker-compose.yml (all 14+ services)
  - Production .env files
  - Database backups
- ⏸️ **Monitoring & Logging:**
  - Structured logging
  - Health check endpoints
  - Error tracking
  - Kafka monitoring ✨ NEW
  - Monitoring dashboard

---

### **1.19 Deploy MVP to Production** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.18 complete
**Estimated:** 15-25 hours (4-6 days)
**Target Start:** 2026-04-01
**Target Completion:** 2026-04-07

- ⏸️ Deploy all 14+ microservices to production
- ⏸️ Verify REST API accessibility
- ⏸️ Verify gRPC connectivity
- ⏸️ Verify Kafka event flow ✨ NEW
- ⏸️ Run smoke tests
- ⏸️ Monitor logs for errors
- ⏸️ Test workflows:
  - ✅ Customer quote → Order → Production → Invoice → Payment
  - ✅ PO approval workflow → 3-Way match → Payment
  - ✅ Overdue invoice → Reminder job → Credit block
  - ✅ Production planning → Job scheduling → Contingency
- ⏸️ Collect user feedback
- ⏸️ Fix critical bugs
- ⏸️ Performance optimization
- ⏸️ Security audit

**Success Criteria:**
- ✅ All 14+ services running and accessible
- ✅ gRPC inter-service communication working
- ✅ Kafka event flow verified
- ✅ 3-Way match working
- ✅ Production planning functional
- ✅ Operations workflows active
- ✅ No critical bugs
- ✅ Performance acceptable
- ✅ Users can complete all core workflows
- ✅ System stable for 2 weeks

**→ When complete: Upgrade to v4.1.0 and start Phase 2**

---

## 📋 PHASE 2: Security & Stability (v4.1.x)

**Goal:** Harden security, fix bugs, stabilize for production
**Start:** After Phase 1 complete (target: Apr 2026)
**Target End:** TBD
**Status:** ⏸️ PLANNED

### **Phase 2 Tasks (To Be Defined Based on Production Feedback):**
- Security patches (dependency updates)
- Bug fixes from production feedback
- Performance optimizations
- Database query optimization
- Load testing
- Security audit (penetration testing)
- Error handling improvements
- Logging improvements
- Monitoring improvements
- Documentation updates
- User feedback implementation
- **Kafka optimization** ✨ NEW
- **PPQ advanced algorithms** ✨ NEW (multi-criteria optimization)
- Critical bug fixes
- Performance tuning

**Potential Additions:**
- ⏸️ Notification Service (email/SMS/push)
- ⏸️ Gamification / Loyalty Service
- ⏸️ Issues Service (internal ticketing)
- ⏸️ Inquiries Service (customer quotes tracking)
- ⏸️ Mail Client Service (SMTP/IMAP)
- ⏸️ Documents Service (file upload/download)

**→ When complete: Upgrade to v4.2.0 and start Phase 3**

---

## 📋 PHASE 3: Production Hardening (v4.2.x)

**Goal:** Create stable foundation for future development
**Start:** After Phase 2 complete
**Target End:** TBD
**Status:** ⏸️ PLANNED

### **Phase 3 Tasks (Infrastructure & Stability):**
- High availability setup
- Database replication
- Kafka cluster HA ✨ NEW
- Load balancing
- Automated backups
- Disaster recovery procedures
- Advanced monitoring
- Performance tuning
- Code refactoring
- Technical debt reduction
- Documentation refinement
- Team training materials
- Deployment automation
- Rollback procedures

**→ When complete: Upgrade to v4.3.0 and start Phase 4**

---

## 📋 PHASE 4+: Feature Development (v4.3.x+)

**Goal:** Add competitive features and expand functionality
**Start:** After Phase 3 complete
**Status:** ⏸️ PLANNED

### **Potential Features (To Be Prioritized Based on Business Needs):**

**Advanced Reporting & Analytics:**
- Custom report builder
- Data visualization dashboards
- Export to Excel/PDF
- Scheduled reports
- Real-time analytics
- KPI tracking

**Mobile Application:**
- React Native mobile app
- Offline mode support
- Push notifications
- Mobile-optimized workflows
- Camera integration (document scanning)

**External API Integrations:**
- Accounting software (e.g., Pohoda, Money S3)
- CRM systems
- E-commerce platforms
- Payment gateways
- Shipping providers
- Email marketing tools

**Advanced Automation:**
- Workflow automation engine
- Email templates & triggers
- Notification system
- Scheduled tasks
- Batch operations
- Data import/export automation

**AI/ML Features:**
- Predictive analytics
- Anomaly detection
- Intelligent search
- Document classification
- OCR for invoices/documents
- Chatbot support
- **PPQ machine learning** ✨ (predict optimal resources)

**Business Intelligence:**
- Executive dashboard
- Trend analysis
- Forecasting
- Inventory optimization
- Sales pipeline analytics

**Customer & Supplier Portals:**
- Self-service portal
- Order tracking (from Operations service)
- Invoice downloads
- Support tickets
- Document uploads

**Multi-tenancy:**
- Support multiple companies
- Isolated data per tenant
- Shared infrastructure
- Custom branding per tenant

**Advanced Features:**
- Multi-language support (DE, HU, PL, etc.)
- Multi-currency support
- Tax compliance (VAT, invoicing rules)
- Audit logging
- Version history
- Data archiving

**Collaboration Tools:**
- Comments & mentions
- Task assignments
- Team chat
- File sharing
- Notifications

**Note:** Exact features will be defined based on:
- User feedback from production
- Business priorities
- Market analysis
- Competitor analysis
- ROI evaluation

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- @l-kern/config (constants, translations, theme, hooks, utils)
- @l-kern/ui-components (17+ production components)

**Backend:**
- Python 3.11 + FastAPI
- PostgreSQL 15 (one DB per service)
- **Apache Kafka** ✨ NEW (event-driven architecture)
- REST API (external communication)
- gRPC (inter-service communication)
- SQLAlchemy + Alembic (ORM + migrations)
- Pydantic (validation)

**DevOps:**
- Docker + Docker Compose (development)
- Nginx (REST reverse proxy)
- Kafka + Zookeeper ✨ NEW
- Nx + Yarn 4 (monorepo)

---

## 📊 Quick Progress Overview

**Phase 1 Progress:** 2.7/18 tasks complete (~15%)

**Architecture:** Domain-Driven Microservices (Bounded Context)

| Task | Status | Target Completion | Architecture |
|------|--------|-------------------|--------------|
| 1.0 Infrastructure | ✅ COMPLETED | 2025-10-15 | Foundation |
| 1.1 Coding Standards | ✅ COMPLETED | 2025-10-15 | Foundation |
| 1.2 UI Infrastructure | ⏳ IN PROGRESS | 2025-11-12 | Frontend |
| 1.3 Backend Infrastructure | ⏸️ PLANNED | 2025-11-17 | Backend + Kafka |
| **PHASE I: Foundation** | | | |
| 1.4 Contact (MDM) | ⏸️ PLANNED | 2025-11-25 | Master Data |
| 1.5 Configuration | ⏸️ PLANNED | 2025-11-23 | Settings |
| 1.6 HR / Payroll | ⏸️ PLANNED | 2025-12-02 | GDPR Protected |
| **PHASE II: Core Operations** | | | |
| 1.7 Inventory / Logistics | ⏸️ PLANNED | 2025-12-10 | Physical Stock |
| 1.8 Purchasing (AP) | ⏸️ PLANNED | 2025-12-21 | ✨ NEW: Vendors + PO + Invoices AP |
| 1.9 Sales (AR) | ⏸️ PLANNED | 2026-01-02 | ✨ NEW: Customers + SO + Invoices AR |
| 1.10 Manufacturing | ⏸️ PLANNED | 2026-01-10 | Production |
| **PHASE III: Planning & Finance** | | | |
| 1.11 PPQ | ⏸️ PLANNED | 2026-01-23 | ✨ NEW: Quality vs Speed Optimization |
| 1.12 Operations (BPM) | ⏸️ PLANNED | 2026-02-03 | ✨ NEW: Workflow Orchestration |
| 1.13 Finance (GL) | ⏸️ PLANNED | 2026-02-14 | Accounting Backbone |
| 1.14 Cash & Bank | ⏸️ PLANNED | 2026-02-21 | Payment Processing |
| **PHASE IV: Final Steps** | | | |
| 1.15 Authentication | ⏸️ PLANNED | 2026-03-01 | Security |
| 1.16 Testing & QA | ⏸️ PLANNED | 2026-03-19 | Quality Assurance |
| 1.17 Production Prep | ⏸️ PLANNED | 2026-03-31 | Deployment |
| 1.18 Deploy MVP | ⏸️ PLANNED | 2026-04-07 | Production Launch |

---

## 🎯 Key Architectural Changes (v4.0.0)

**From v3.0.0 (OBSOLETE) → v4.0.0 (CURRENT):**

| Old Architecture (v3.0.0) | New Architecture (v4.0.0) | Reason |
|---------------------------|---------------------------|---------|
| ❌ Customers Service | ✅ **Sales (AR) Service** | Bounded Context - complete sales domain |
| ❌ Suppliers Service | ✅ **Purchasing (AP) Service** | Bounded Context - complete purchasing domain |
| ❌ Orders Service | ✅ Split: PO → Purchasing, SO → Sales | Domain separation |
| ❌ Invoices Service | ✅ Split: AR → Sales, AP → Purchasing | Domain separation |
| ❌ Issues Service | ⏸️ **Moved to Phase 2** | Not core MVP |
| ❌ Inquiries Service | ⏸️ **Moved to Phase 2** | Not core MVP |
| ❌ Mail Client | ⏸️ **Moved to Phase 2** | Not core MVP |
| ❌ Documents | ⏸️ **Moved to Phase 2** | Not core MVP |
| - | ✅ **Configuration Service** ✨ NEW | Global settings (COA, VAT, currencies) |
| - | ✅ **PPQ Service** ✨ NEW | Production planning & optimization |
| - | ✅ **Operations (BPM)** ✨ NEW | Workflow orchestration |
| - | ✅ **Kafka Integration** ✨ NEW | Event-driven architecture |

**Total Services:**
- v3.0.0: 17 services (fragmented)
- v4.0.0: 14 services (cohesive, domain-driven)

**Key Improvements:**
- ✅ GDPR compliance (sensitive data strategy)
- ✅ Event-driven architecture (Kafka)
- ✅ Production planning optimization
- ✅ Workflow orchestration
- ✅ 3-Way match (PO → GR → Invoice)
- ✅ Overdue tracking automation
- ✅ Customer operation visibility

---

**Last Updated:** 2025-10-30
**Maintainer:** BOSSystems s.r.o.
**Current Version:** 4.0.0 (Phase 1 - MVP Development)
**Architecture Document:** [microservices-architecture.md](../architecture/microservices-architecture.md)
**Next Milestone:** Complete Modal System v3.0 by 2025-11-12
**Next Backend Start:** Task 1.3 Backend Infrastructure (after Modal System complete)
