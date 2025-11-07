# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 5.2.0
# Created: 2025-10-13
# Updated: 2025-11-06
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Architecture: Domain-Driven Microservices (Bounded Context)
# Previous Version: v4.4.2 (archived to docs/temp/roadmap-v4.4.2-obsolete.md)
#
# Key Changes from v4.4.2:
# - ✅ Numbering changed from 1.1, 1.2, 1.3... to 1.10, 1.20, 1.30... (increments of 10)
# - ✅ Added: 1.50 Microservice Template (FastAPI + PostgreSQL + Kafka + gRPC)
# - ✅ Added: 1.60 Issues Service (moved from Phase 2.5, before Contact MDM)
# - ✅ Renumbered all tasks to allow inserting new tasks between existing ones
# - ✅ Architecture reference: docs/architecture/microservices-architecture.md
# ================================================================

---

## 📖 How to Use This Roadmap

**Purpose:** Complete development plan from MVP to production-ready system

**How to work with it:**
1. **Find current task** - Look for ⏳ IN PROGRESS status (always exactly ONE task)
2. **Complete task** - Change status to ✅ COMPLETED, add completion date
3. **Move to next** - Change next task from ⏸️ PLANNED to ⏳ IN PROGRESS
4. **Add new tasks** - Insert between existing tasks (e.g., 1.25 between 1.20 and 1.30)
5. **Update version** - Increment version (5.0.0 → 5.1.0) after changes
6. **Update dates** - Adjust target dates when delays occur

**Status symbols:**
- ✅ COMPLETED - Task finished (with date)
- ⏳ IN PROGRESS - Currently working (only ONE at a time!)
- ⏸️ PLANNED - Not started yet

**Numbering system:**
- Phase 1: 1.10, 1.20, 1.30... (increments of 10)
- New tasks: Insert with intermediate numbers (e.g., 1.25, 1.35, 1.55)
- Allows flexibility without renumbering entire roadmap

**Quick scan tip:** Čítaj len názvy taskov a statusy - za 5 sekúnd vidíš čo je hotové a čo ďalej!

**Architecture Reference:** See [microservices-architecture.md](../architecture/microservices-architecture.md) for complete design

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
**Timeline:** Oct 2025 - Jun 2026
**Progress:** 3.0/23 tasks (~13%)
**Architecture:** Domain-Driven Microservices

---

### **1.10 Infrastructure Setup** ✅ COMPLETED (2025-10-15)
- ✅ Nx workspace (Yarn 4 + TypeScript 5.7)
- ✅ Docker development environment
- ✅ React 19 web-ui (port 4201)
- ✅ @l-kern/config package
- ✅ Documentation structure
- ✅ Port mapping strategy (LKMS{XXX} → 4{XXX})

---

### **1.20 Coding Standards** ✅ COMPLETED (2025-10-15)
- ✅ coding-standards.md (2235 lines)
- ✅ code-examples.md (1700 lines)
- ✅ TypeScript, React, Python conventions
- ✅ Testing standards (pytest + Vitest)

---

### **1.30 UI Infrastructure (@l-kern/ui-components)** ✅ COMPLETED (2025-11-06)
**Started:** 2025-10-18
**Completed:** 2025-11-06

#### **1.30.1 Form Components** ✅ COMPLETED
- ✅ Button (primary, secondary, danger, danger-subtle, ghost, success)
- ✅ Input, FormField (controlled + uncontrolled)
- ✅ Select, Checkbox, Radio/RadioGroup
- ✅ 115 tests passing

#### **1.30.2 Layout Components** ✅ COMPLETED
- ✅ Card, Badge, Spinner, EmptyState
- ✅ 67 tests passing

#### **1.30.3 Utility Functions** ✅ COMPLETED
- ✅ phoneUtils, emailUtils, dateUtils, validation
- ✅ 148 tests passing

#### **1.30.4 Modal System v3.0** ⏳ IN PROGRESS (~85%)
**Reference:** See [implementation-plan-modal-system-v3.md](../temp/implementation-plan-modal-system-v3.md) for detailed specs (6 phases, 60-90h)

**1.30.4.1 Base Infrastructure** ✅ COMPLETED
- ✅ Modal component (centered, drag & drop, nested modals) - 46 tests
- ✅ ModalContext, WizardProgress, WizardNavigation
- ✅ Toast, DashboardCard, DebugBar
- ✅ modalStack utility (Modal stack management)

**1.30.4.2 Modal Hooks** ✅ COMPLETED
- ✅ useModal, useModalWizard (wizard workflows)
- ✅ useFormDirty (unsaved changes detection)
- ✅ useConfirm (promise-based confirmation API)
- ✅ useToast, usePageAnalytics

**1.30.4.3 Core Modals** ✅ COMPLETED (4/4 complete)
- ✅ **ConfirmModal** (15 tests, v1.0.0)
  - Simple mode (Yes/No confirmation)
  - Danger mode (keyword confirmation "ano")
  - SK/EN translations
- ✅ **EditItemModal** (20 tests, v1.0.0, 2025-10-30)
  - Generic add/edit wrapper
  - useFormDirty integration
  - Clear button (🧹 danger-subtle variant)
  - Unsaved changes confirmation
- ✅ **ManagementModal** (33 tests, v1.0.0, 2025-11-01)
  - Generic list management wrapper
  - Delete all with danger confirmation
  - Empty state support
  - Primary item support (star marking + sorting)
  - Dirty tracking (hasUnsavedChanges prop)
- ✅ **SectionEditModal** (60 tests, v1.0.0, 2025-11-02)
  - Form builder with FieldDefinition system
  - Dynamic field rendering (text, email, number, date, select, textarea)
  - HTML5 validation + custom validation
  - Clear form button with confirmation
  - Unsaved changes detection (useFormDirty + useConfirm)

**1.30.4.4 Modal Enhancements** ✅ COMPLETED (2025-11-02)
- ✅ Card accent variant (purple border + glow, v1.2.0)
- ✅ DashboardCard hover effects (purple glow shadow, v1.0.1)
- ✅ Toast test page (visual testing UI + translations)
- ✅ Icons test page (professional icon set v3.1.0, 109 icons)
  - 7 categories: Navigation, Actions, Status, Data, Business, System, Shapes
  - Click-to-copy functionality
  - Added to sidebar, testing dashboard, and routes
- ✅ Documentation updates (Card.md, DashboardCard.md updated by agent)
- ✅ TypeScript fixes (usePageAnalytics, Modal maxWidth)
- ✅ Tests: 37/37 passing (22 Card + 15 DashboardCard)

**Progress:** ~58h done / 60-90h total (~90% complete) | Remaining: Data Display (~5-10h)

#### **1.30.5 Data Display** ✅ COMPLETED (2025-11-06)
- ✅ **DataGrid** (v1.0.0, 2025-11-06) - 40 tests passing
  - Column configuration (sortable, width, flex, custom render)
  - Sorting (asc/desc, visual indicators)
  - Column resizing (drag to resize, localStorage persistence)
  - Checkbox selection (Ctrl+Click, Shift+Click, Select All)
  - Row expansion (custom content, nested grids)
  - Built-in actions column (auto-generated, dynamic width)
  - Compact mode (0.9x font, reduced padding)
  - Theme support (light/dark mode)
  - Status colors (row backgrounds)
  - Accessibility (ARIA attributes, keyboard navigation)
  - 100% DRY compliance (ZERO hardcoded values)
  - Documentation (1490 lines)
- ✅ **FilterPanel** (v1.0.0, 2025-11-06) - 30 tests (pending Docker rebuild)
  - Search input (full-width, 🔍 icon, focus state)
  - Quick filters (rounded pills, active highlighting, Clear All)
  - Filter groups (STATUS, PRIORITY - button/checkbox modes)
  - Items per page dropdown (5, 10, 20, 50, 100)
  - New Item button (brand gradient, shadow, hover lift)
  - Result count display (filtered/total)
  - Show Inactive toggle (optional)
  - Custom children support
  - Translations (SK + EN, 6 keys)
  - Documentation (1080 lines)
- ✅ **FilteredDataGrid** (v1.0.0, 2025-11-06) - Wrapper component
  - Internal state management (search, filters, pagination)
  - Combines FilterPanel + DataGrid
  - Automatic filtering logic (useMemo)
  - Auto "Clear All" button
  - Props passthrough to DataGrid
  - Demo page (/testing/filtered-grid) with 25 mock orders
  - Documentation (770 lines)

---

### **1.30.6 Navigation Components** ✅ COMPLETED (2025-11-02)
**Estimated:** 8-10h
**Actual:** ~10h

- ✅ **Sidebar** component (collapsible tree navigation, v1.0.0) - 38 tests
  - Collapsible (240px / 24px) with localStorage persistence
  - Tree navigation with vertical lines (half-height on last item)
  - Resizable width (120-400px) with drag handle
  - Active path highlighting, disabled state support
  - Recursive Expand/Collapse All functionality
  - Middle-click support, badge display
  - Theme/language toggles integration
  - CSS variable: `--sidebar-bg` (#1a1a1a dark, #ffffff light)
- ✅ **BasePage** v4.0.1 (sidebar integration) - 22 tests
  - Automatic activePath detection (`activePath || location.pathname`)
  - localStorage polling for sidebar width sync (100ms)
  - Icons test page added to default sidebar items
- ✅ **Documentation**: Sidebar.md (950 lines), BasePage.md updated (+125 lines)
- ✅ **TypeScript fixes**: usePageAnalytics (6 null checks), ManagementModal (2 prop fixes)
- ✅ **All tests passing**: 225/225 (100%)

---

### **1.30.7 Design System Refactor** ✅ COMPLETED (2025-11-07)
**Dependencies:** None (can run parallel with 1.30.5)
**Estimated:** 35-40h (1 week full-time)
**Actual:** ~32h (Phase 0-2.3 complete, Phase 4 documentation pending)

**Goal:** Eliminate ALL hardcoded values from CSS. Everything via design tokens.

**Implementation Plan:** [implementation-plan-design-refactor.md](../temp/implementation-plan-design-refactor.md)
**Standards:** [design-standards.md](../design/design-standards.md) - Single source of truth

#### **Phase 0: Audit & Baseline** ✅ COMPLETED (4h)
- ✅ Automated audit (grep script - found 579 violations across 15 components)
- ✅ Component priority matrix (LOW/MEDIUM/HIGH risk classification)
- ✅ Gap analysis (identified 50+ missing tokens)
- ✅ Migration checklists (created per-component tracking)

#### **Phase 1: Design Token Enhancement** ✅ COMPLETED (6h)
- ✅ Added 67 new tokens (shadows, gradients, animations, hover effects)
- ✅ Generated 124 CSS variables (theme-setup.ts)
- ✅ Verified variables accessible in browser
- ✅ New token categories: hover rings, checkbox/radio shadows, sidebar duration

#### **Phase 2: Component Migration** ✅ COMPLETED (18h)
- ✅ **Round 1: Low-risk** (Badge, Spinner, EmptyState) - 4h, 95 violations fixed
- ✅ **Round 2: Medium-risk** (FormField, Select, Toast, ToastContainer) - 8h, 157 violations fixed
- ✅ **Round 3: High-risk** (Input, FilterPanel, DataGrid, Checkbox, Radio, Modal) - 6h, 175 violations fixed
  - Input v2.0.2: 19 violations → 0 (new hover ring tokens added)
  - FilterPanel v1.1.1: 18+10 violations → 0
  - DataGrid v1.1.0: 17 violations → 0
  - Checkbox v1.2.2: 15 violations → 0
  - Radio v1.2.1: 12 violations → 0
  - Modal v1.1.2: 6+6 violations → 0
  - Button v3.1.1: 1 violation → 0 (font-size in .button--xs)
  - Sidebar v3.1.1: NEW --duration-sidebar token (350ms smooth animation)

**Migration Pattern:**
- Replace colors → `var(--color-brand-primary)`
- Replace spacing → `var(--spacing-md)`
- Replace shadows → `var(--shadow-sm)`
- Replace transitions → `var(--duration-hover) var(--ease-out)`
- Use calc() for edge cases → `calc(var(--spacing-md) - var(--spacing-xs))`

#### **Phase 3: Verification & Testing** (3-4h)
- ⏸️ Automated hardcoded value checks (grep script)
- ⏸️ Run all tests (486/486 must pass)
- ⏸️ Visual regression testing (manual)

#### **Phase 4: Documentation & Cleanup** (2-3h)
- ⏸️ Update all 15 component .md files (design tokens used)
- ⏸️ Delete obsolete design files (component-design-system.md, design-system-unified.md)
- ⏸️ Update design-standards.md (implementation status)

**Success Criteria:**
- ✅ ZERO hardcoded values (verified via automated checks)
- ✅ ALL tests passing (486/486)
- ✅ ZERO visual regressions
- ✅ WCAG AA compliance (contrast fix: #9e9e9e → #757575)

**Key Benefits:**
- 🎨 Unified design system with modifier pattern (base ± offset)
- ⚡ Performance optimized (max 2 shadows on hover, max 2 transition properties)
- 🧘 Calm UX (150ms hover, 220ms state changes, no bounce on hover)
- ♿ WCAG AA compliant (all text contrast ≥ 4.5:1)
- 📚 Single source of truth (design-standards.md)

---

### **1.40 Backend Infrastructure** ⏸️ PLANNED
**Dependencies:** 1.30 complete
**Estimated:** 12-16h (3-4 days)
**Target:** 2025-11-13 - 2025-11-17

#### **1.40.1 PostgreSQL Setup**
- ⏸️ PostgreSQL 15 (port 4501)
- ⏸️ Database per service strategy

#### **1.40.2 Alembic Migrations**
- ⏸️ Install + configure

#### **1.40.3 gRPC Infrastructure**
- ⏸️ grpcio + proto compilation

#### **1.40.4 Apache Kafka**
- ⏸️ Kafka + Zookeeper (port 9092)
- ⏸️ Topic setup

#### **1.40.5 Adminer UI**
- ⏸️ Add to docker-compose (port 4901)

---

### **1.50 Microservice Template** ⏸️ PLANNED
**Dependencies:** 1.40 complete
**Estimated:** 8-12h (2-3 days)
**Target:** 2025-11-18 - 2025-11-20

**Goal:** Reusable template for all microservices - copy, rename, configure, run.

**Template Location:** `services/template/`

#### **1.50.1 Backend Template Structure**
- ⏸️ **FastAPI Service Boilerplate**
  - `main.py` - FastAPI app entry point
  - `models.py` - SQLAlchemy models template
  - `schemas.py` - Pydantic schemas template
  - `crud.py` - CRUD operations template
  - `api/v1/endpoints/` - REST API endpoints template
  - `grpc/` - gRPC server template
  - `kafka/` - Kafka producer/consumer template
- ⏸️ **Database Setup**
  - `alembic/` - Migration templates
  - `database.py` - PostgreSQL connection
  - `.env.template` - Environment variables template
- ⏸️ **Docker Configuration**
  - `Dockerfile` - Python 3.11 + FastAPI
  - `docker-compose.service.yml` - Service-specific compose
  - `requirements.txt` - Python dependencies
- ⏸️ **Testing Templates**
  - `tests/test_api.py` - REST API test template
  - `tests/test_grpc.py` - gRPC test template
  - `tests/test_crud.py` - Database test template
  - `pytest.ini` - pytest configuration
- ⏸️ **Documentation**
  - `README.md` - Setup instructions, port mapping, API docs
  - `TEMPLATE_INSTRUCTIONS.md` - How to use this template

#### **1.50.2 Copy-Rename-Configure Workflow**
- ⏸️ **Setup Script:** `scripts/create_microservice.sh`
  - Input: Service name (e.g., "Issues")
  - Input: Port numbers (REST, gRPC)
  - Input: Database name
  - Actions:
    1. Copy `services/template/` to `services/lkms{XXX}-{name}/`
    2. Replace placeholders: `{{SERVICE_NAME}}`, `{{PORT_REST}}`, `{{PORT_GRPC}}`, `{{DB_NAME}}`
    3. Generate `.env` from `.env.template`
    4. Update `docker-compose.yml` with new service
    5. Create database in PostgreSQL
    6. Run Alembic migrations
    7. Print: "Service ready! Run: docker-compose up lkms{XXX}-{name}"

#### **1.50.3 Template Features**
- ⏸️ **REST API:** Health check, CRUD endpoints
- ⏸️ **gRPC API:** Service definition, server implementation
- ⏸️ **Kafka:** Producer (emit events), Consumer (listen to events)
- ⏸️ **Database:** SQLAlchemy models, Alembic migrations
- ⏸️ **Logging:** Structured logging (JSON format)
- ⏸️ **Error Handling:** Standardized error responses
- ⏸️ **Validation:** Pydantic schemas for request/response
- ⏸️ **Testing:** Unit tests, integration tests, fixtures

**Success Criteria:**
- ✅ Template tested with dummy service (lkms999-test)
- ✅ Copy script works end-to-end (< 5 minutes)
- ✅ Generated service runs without modifications
- ✅ All tests passing in generated service

**Time Saved:**
- Without template: 6-8h per microservice (setup + boilerplate)
- With template: 15-30 minutes (copy + rename + configure)
- ROI: 10-15x time savings for 14 microservices

---

### **1.60 Issues Service** ⏸️ PLANNED
**Dependencies:** 1.50 complete (uses microservice template)
**Estimated:** 12-16h (3-4 days)
**Target:** 2025-11-21 - 2025-11-24
**Ports:** 4105 (REST), 5105 (gRPC)
**Database:** lkms105_issues

**Internal ticketing system - bug reports, feature requests, improvements**

#### **1.60.1 Backend**
- ⏸️ **Copy from template:** `scripts/create_microservice.sh Issues 4105 5105 lkms105_issues`
- ⏸️ **Issue Model** (SQLAlchemy):
  - `id` (UUID, primary key)
  - `title` (String 200, required)
  - `description` (Text, optional)
  - `type` (Enum: bug, feature, improvement, question)
  - `priority` (Enum: low, medium, high, critical)
  - `status` (Enum: open, in_progress, resolved, closed, wont_fix)
  - `reporter_id` (UUID, FK to users)
  - `assignee_id` (UUID, FK to users, nullable)
  - `created_at`, `updated_at`, `resolved_at`, `closed_at`
  - `tags` (Array[String], optional)
  - `attachments` (JSON, optional)
- ⏸️ **REST API Endpoints:**
  - `GET /api/v1/issues` - List issues (with filters)
  - `GET /api/v1/issues/{id}` - Get issue detail
  - `POST /api/v1/issues` - Create issue
  - `PUT /api/v1/issues/{id}` - Update issue
  - `DELETE /api/v1/issues/{id}` - Delete issue
  - `POST /api/v1/issues/{id}/assign` - Assign to user
  - `POST /api/v1/issues/{id}/resolve` - Mark as resolved
  - `POST /api/v1/issues/{id}/close` - Close issue
- ⏸️ **gRPC API:** Same operations for inter-service communication
- ⏸️ **Kafka Events:**
  - `IssueCreated` - New issue reported
  - `IssueAssigned` - Assigned to user
  - `IssueStatusChanged` - Status updated
  - `IssueResolved` - Marked as resolved
  - `IssueClosed` - Issue closed
- ⏸️ **Business Logic:**
  - Auto-assign to admin if priority = critical
  - Email notification on issue created (to assignee)
  - Auto-close if resolved for 7+ days

#### **1.60.2 Frontend**
- ⏸️ **Issues Page** (`/issues`)
  - List view with filters (type, priority, status, assignee)
  - Search by title/description
  - Sort by created_at, priority
  - Click → detail view
- ⏸️ **Issue Detail Modal**
  - Display all fields
  - Edit button → EditItemModal
  - Assign button → dropdown of users
  - Resolve/Close buttons
  - Comment section (future Phase 2)
- ⏸️ **Create Issue Modal**
  - SectionEditModal with FieldDefinition:
    - title (text, required)
    - description (textarea, optional)
    - type (select: bug/feature/improvement/question)
    - priority (select: low/medium/high/critical)
    - tags (text, comma-separated)

#### **1.60.3 Testing**
- ⏸️ **Backend Tests (pytest):**
  - 15 unit tests (CRUD operations)
  - 10 integration tests (REST API endpoints)
  - 5 gRPC tests (service calls)
  - 5 Kafka tests (event emission)
- ⏸️ **Frontend Tests (Vitest):**
  - 10 component tests (Issues page, detail modal, create modal)
  - 5 integration tests (API calls, state management)

**Success Criteria:**
- ✅ All tests passing (50 tests total)
- ✅ REST API functional (all endpoints work)
- ✅ gRPC API functional (inter-service calls work)
- ✅ Kafka events emitted correctly
- ✅ Frontend connected to backend

---

### **1.70 Contact (MDM) Service** ⏸️ PLANNED
**Dependencies:** 1.50 complete (uses microservice template)
**Estimated:** 25-30h (6-7 days)
**Target:** 2025-11-25 - 2025-12-02
**Ports:** 4101 (REST), 5101 (gRPC)
**Database:** lkms101_contacts

**Master Data Management - Single Source of Truth**

#### **1.70.1 Backend**
- ⏸️ Copy from template: `scripts/create_microservice.sh Contact 4101 5101 lkms101_contacts`
- ⏸️ Contact model (UUID, Name, Address, Tax ID)
- ⏸️ **NO sensitive data** (NO bank accounts, NO salaries)
- ⏸️ REST + gRPC APIs
- ⏸️ Kafka: ContactCreated/Updated/Deleted

#### **1.70.2 Frontend**
- ⏸️ Contacts page (with Table)
- ⏸️ List, detail, add/edit views

---

### **1.80 Configuration Service** ⏸️ PLANNED
**Dependencies:** 1.50 complete (uses microservice template)
**Estimated:** 15-20h (4-5 days)
**Target:** 2025-11-25 - 2025-11-30 (parallel with 1.70)
**Ports:** 4199 (REST), 5199 (gRPC)
**Database:** lkms199_config

**Global settings (COA, VAT, currencies)**

#### **1.80.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: COA, VAT, currencies, periods

#### **1.80.2 Frontend**
- ⏸️ Configuration page

---

### **1.90 System Health & Backup API** ⏸️ PLANNED
**Dependencies:** 1.70, 1.80 complete
**Estimated:** 2-3h
**Target:** 2025-12-02

#### **1.90.1 Health Monitoring**
- ⏸️ GET /api/v1/system/health

#### **1.90.2 Backup Management**
- ⏸️ POST /api/v1/system/backup
- ⏸️ GET /api/v1/system/backup/status

---

### **1.100 Page Templates (StatusBar)** ⏸️ PLANNED
**Dependencies:** 1.90 complete
**Estimated:** 5-7h
**Target:** 2025-12-03 - 2025-12-05

#### **1.100.1 StatusBar Component** (3-4h)
- ⏸️ Port from v3 (v2.1.0)
- ⏸️ System monitoring, backup UI
- ⏸️ Theme/language toggles
- ⏸️ 20 unit tests

#### **1.100.2 StatusBadge Component** (1h)
- ⏸️ Port from v3
- ⏸️ 8 unit tests

#### **1.100.3 BaseLayout Integration** (1-2h)
- ⏸️ BaseLayout + BaseLayoutDataContext
- ⏸️ 10 integration tests

---

### **1.110 HR / Payroll Service** ⏸️ PLANNED
**Dependencies:** 1.70 complete
**Estimated:** 20-25h (5-6 days)
**Target:** 2025-12-06 - 2025-12-11
**Ports:** 4108 (REST), 5108 (gRPC)
**Database:** lkms108_employees

**GDPR-protected sensitive employee data**

#### **1.110.1 Backend**
- ⏸️ Copy from template
- ⏸️ **SENSITIVE:** Salaries, Personal IDs, Bank accounts (employees only)
- ⏸️ **Production data:** Work roles, qualifications
- ⏸️ Kafka: EmployeeCreated/RoleChanged/Absent/Available

#### **1.110.2 Frontend**
- ⏸️ Employees page

**Security:** STRICT access control, GDPR audit logging

---

### **1.120 Inventory / Logistics Service** ⏸️ PLANNED
**Dependencies:** 1.70, 1.80, 1.110 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2025-12-12 - 2025-12-18
**Ports:** 4111 (REST), 5111 (gRPC)
**Database:** lkms111_warehouse

#### **1.120.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: Products, stock, goods receipts/issues
- ⏸️ Kafka: GoodsReceived/Issued, StockLevelCritical

#### **1.120.2 Frontend**
- ⏸️ Inventory page

---

### **1.130 Purchasing (AP) Service** ⏸️ PLANNED
**Dependencies:** 1.70, 1.80, 1.120 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2025-12-19 - 2025-12-29
**Ports:** 4106 (REST), 5106 (gRPC)
**Database:** lkms106_purchasing

**Vendors + PO + Invoices AP + 3-Way Match**

#### **1.130.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: Vendor data, RFQ, PO, Received Invoices
- ⏸️ **Vendor bank accounts stored HERE**
- ⏸️ **3-Way Match:** PO → Goods Receipt → Invoice
- ⏸️ Kafka: PO events, Consume GoodsReceived

#### **1.130.2 Frontend**
- ⏸️ Purchasing page
- ⏸️ 3-Way match dashboard

---

### **1.140 Sales (AR) Service** ⏸️ PLANNED
**Dependencies:** 1.70, 1.80, 1.120 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2025-12-30 - 2026-01-09
**Ports:** 4103 (REST), 5103 (gRPC)
**Database:** lkms103_sales

**Customers + SO + Invoices AR + Overdue Tracking**

#### **1.140.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: Customer data, Quotations, SO, Issued Invoices
- ⏸️ **Customer bank accounts stored HERE**
- ⏸️ **Overdue tracking:** Daily job → InvoiceOverdue event
- ⏸️ Kafka: SO events, Consume GoodsIssued

#### **1.140.2 Frontend**
- ⏸️ Sales page
- ⏸️ Overdue dashboard

---

### **1.150 Manufacturing Service** ⏸️ PLANNED
**Dependencies:** 1.120, 1.140 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2026-01-10 - 2026-01-16
**Ports:** 4112 (REST), 5112 (gRPC)
**Database:** lkms112_manufacturing

#### **1.150.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: BOM, work centers, machines, work orders
- ⏸️ Kafka: WorkOrderCompleted, MachineDown/Available

#### **1.150.2 Frontend**
- ⏸️ Manufacturing page

---

### **1.160 Production Planning & Quality (PPQ)** ⏸️ PLANNED
**Dependencies:** 1.110, 1.140, 1.150 complete
**Estimated:** 40-50h (10-12 days)
**Target:** 2026-01-17 - 2026-01-29
**Ports:** TBD
**Database:** lkms_ppq

**Simple priority rules first, advanced optimization later**

#### **1.160.1 Backend (MVP)**
- ⏸️ Copy from template
- ⏸️ **Simple rules:** Quality → best accuracy, Speed → fastest
- ⏸️ Models: Production calendar, resource assignments
- ⏸️ Kafka: Consume SalesOrderCreated, MachineDown, EmployeeAbsent

#### **1.160.2 Frontend**
- ⏸️ Planning dashboard

---

### **1.170 Operations (BPM)** ⏸️ PLANNED
**Dependencies:** 1.110, 1.130, 1.140, 1.150, 1.160 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2026-01-30 - 2026-02-09
**Ports:** TBD
**Database:** lkms_operations

**Workflow orchestration - end-to-end process management**

#### **1.170.1 Backend**
- ⏸️ Copy from template
- ⏸️ Workflow definitions: CustomerQuote, PO Approval, MonthEnd, OrderFulfillment
- ⏸️ Models: Workflows, job queue, assignments
- ⏸️ **Dynamic job assignment:** Query HR by role
- ⏸️ Kafka: Consume multiple events

#### **1.170.2 Frontend**
- ⏸️ Operations dashboard
- ⏸️ My Jobs page

---

### **1.180 Finance (GL) Service** ⏸️ PLANNED
**Dependencies:** 1.80, 1.130, 1.140, 1.150 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2026-02-10 - 2026-02-20
**Ports:** TBD
**Database:** lkms_finance

**Accounting backbone - consolidates all transactions**

#### **1.180.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: COA, GL entries, balances, periods
- ⏸️ **Automatic posting:** Events → GL entries
- ⏸️ **Tax compliance:** VAT reporting (SK)
- ⏸️ Kafka: Consume InvoiceIssued/Received, GoodsIssued, PaymentReceived

#### **1.180.2 Frontend**
- ⏸️ Finance dashboard
- ⏸️ GL viewer, reports, VAT returns

---

### **1.190 Cash & Bank Service** ⏸️ PLANNED
**Dependencies:** 1.120, 1.130, 1.170 complete
**Estimated:** 20-25h (5-6 days)
**Target:** 2026-02-21 - 2026-02-26
**Ports:** TBD
**Database:** lkms_cash_bank

#### **1.190.1 Backend**
- ⏸️ Copy from template
- ⏸️ Models: Bank accounts, statements, payment orders
- ⏸️ **Payment matching:** Auto-match with AR/AP invoices
- ⏸️ Kafka: PaymentReceived/Sent, PaymentMatched

#### **1.190.2 Frontend**
- ⏸️ Cash & Bank dashboard

---

### **1.200 Authentication Service** ⏸️ PLANNED
**Dependencies:** 1.180 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2026-02-27 - 2026-03-05
**Ports:** 4107 (REST), 5107 (gRPC)
**Database:** lkms107_auth

#### **1.200.1 Backend**
- ⏸️ Copy from template
- ⏸️ User model, JWT, bcrypt, RBAC
- ⏸️ REST + gRPC APIs

#### **1.200.2 Frontend**
- ⏸️ Login page
- ⏸️ Auth context + protected routes

---

### **1.210 Testing & QA** ⏸️ PLANNED
**Dependencies:** 1.200 complete
**Estimated:** 50-70h (12-17 days)
**Target:** 2026-03-06 - 2026-03-23

- ⏸️ **Backend:** Unit, integration, gRPC, Kafka tests (>80%)
- ⏸️ **Frontend:** Component, E2E tests (>70%)
- ⏸️ **Integration:** Full workflows, 3-Way match, overdue tracking
- ⏸️ **CI/CD:** GitHub Actions

---

### **1.220 Production Deployment Prep** ⏸️ PLANNED
**Dependencies:** 1.210 complete
**Estimated:** 35-45h (8-11 days)
**Target:** 2026-03-24 - 2026-04-04

- ⏸️ **Server:** Docker, firewall, SSL
- ⏸️ **Kafka Production:** Cluster config
- ⏸️ **Nginx:** Reverse proxy
- ⏸️ **Monitoring:** Logging, health checks

---

### **1.230 Deploy MVP to Production** ⏸️ PLANNED
**Dependencies:** 1.220 complete
**Estimated:** 15-25h (4-6 days)
**Target:** 2026-04-05 - 2026-04-11

- ⏸️ Deploy all 15+ microservices
- ⏸️ Verify REST, gRPC, Kafka
- ⏸️ Run smoke tests
- ⏸️ Test workflows
- ⏸️ Fix critical bugs

**Success Criteria:**
- ✅ All services running
- ✅ Workflows complete
- ✅ System stable 2 weeks

**→ When complete: Upgrade to v4.1.0 and start Phase 2**

---

## 📋 PHASE 2: Security & Stability (v4.1.x)

**Goal:** Harden security, fix bugs, stabilize for production
**Start:** After Phase 1 complete (target: Apr 2026)
**Status:** ⏸️ PLANNED

---

### **2.10 Security Hardening** ⏸️ PLANNED
**Estimated:** 30-40h

- ⏸️ Dependency updates
- ⏸️ Penetration testing
- ⏸️ GDPR compliance audit
- ⏸️ Authentication hardening
- ⏸️ API rate limiting
- ⏸️ Input validation review

---

### **2.20 Performance Optimization** ⏸️ PLANNED
**Estimated:** 25-35h

- ⏸️ Database query optimization
- ⏸️ Kafka optimization
- ⏸️ Load testing
- ⏸️ Caching strategy
- ⏸️ Bundle size optimization
- ⏸️ API response time tuning

---

### **2.30 Bug Fixes & Stability** ⏸️ PLANNED
**Estimated:** 40-50h

- ⏸️ Production bug fixes
- ⏸️ Error handling improvements
- ⏸️ Logging improvements
- ⏸️ Monitoring dashboard
- ⏸️ User feedback implementation

---

### **2.40 PPQ Advanced Algorithms** ⏸️ PLANNED
**Estimated:** 30-40h

- ⏸️ Multi-criteria optimization (quality + speed + cost)
- ⏸️ Constraint-based scheduling
- ⏸️ Machine learning predictions
- ⏸️ Real-time rescheduling

---

### **2.50 Optional Services** ⏸️ PLANNED
**Estimated:** 40-60h

**Note:** Issues Service moved to Phase 1 (task 1.60)

- ⏸️ Notification Service (email/SMS/push)
- ⏸️ Gamification / Loyalty Service
- ⏸️ Inquiries Service (customer quotes tracking)
- ⏸️ Mail Client Service (SMTP/IMAP)
- ⏸️ Documents Service (file upload/download)

**→ When complete: Upgrade to v4.2.0 and start Phase 3**

---

## 📋 PHASE 3: Production Hardening (v4.2.x)

**Goal:** Create stable foundation for future development
**Start:** After Phase 2 complete
**Status:** ⏸️ PLANNED

---

### **3.10 High Availability** ⏸️ PLANNED
**Estimated:** 40-50h

- ⏸️ Database replication
- ⏸️ Kafka cluster HA
- ⏸️ Load balancing
- ⏸️ Failover strategies
- ⏸️ Multi-region deployment

---

### **3.20 Disaster Recovery** ⏸️ PLANNED
**Estimated:** 30-40h

- ⏸️ Automated backups
- ⏸️ Backup testing
- ⏸️ Recovery procedures
- ⏸️ Rollback mechanisms
- ⏸️ Incident response plan

---

### **3.30 Advanced Monitoring** ⏸️ PLANNED
**Estimated:** 25-35h

- ⏸️ APM (Application Performance Monitoring)
- ⏸️ Distributed tracing
- ⏸️ Alerting system
- ⏸️ Capacity planning
- ⏸️ SLA monitoring

---

### **3.40 Technical Debt Reduction** ⏸️ PLANNED
**Estimated:** 40-60h

- ⏸️ Code refactoring
- ⏸️ Documentation refinement
- ⏸️ Test coverage improvements
- ⏸️ Dependency cleanup
- ⏸️ Architecture simplification

---

### **3.50 Team Training** ⏸️ PLANNED
**Estimated:** 20-30h

- ⏸️ Training materials
- ⏸️ Onboarding documentation
- ⏸️ Architecture workshops
- ⏸️ Best practices guide

**→ When complete: Upgrade to v4.3.0 and start Phase 4**

---

## 📋 PHASE 4+: Feature Development (v4.3.x+)

**Goal:** Add competitive features and expand functionality
**Start:** After Phase 3 complete
**Status:** ⏸️ PLANNED

---

### **4.10 Advanced Reporting & Analytics** ⏸️ PLANNED
- Custom report builder
- Data visualization dashboards
- Export to Excel/PDF
- Scheduled reports
- Real-time analytics
- KPI tracking

---

### **4.20 Mobile Application** ⏸️ PLANNED
- React Native mobile app
- Offline mode support
- Push notifications
- Mobile-optimized workflows
- Camera integration

---

### **4.30 External Integrations** ⏸️ PLANNED
- Accounting software (Pohoda, Money S3)
- CRM systems
- E-commerce platforms
- Payment gateways
- Shipping providers

---

### **4.40 AI/ML Features** ⏸️ PLANNED
- Predictive analytics
- Anomaly detection
- Document classification
- OCR for invoices
- Chatbot support
- **PPQ machine learning:** Predict optimal resources

---

### **4.50 Business Intelligence** ⏸️ PLANNED
- Executive dashboard
- Trend analysis
- Forecasting
- Inventory optimization
- Sales pipeline analytics

---

### **4.60 Customer & Supplier Portals** ⏸️ PLANNED
- Self-service portal
- Order tracking (from Operations service)
- Invoice downloads
- Support tickets
- Document uploads

---

### **4.70 Multi-tenancy** ⏸️ PLANNED
- Support multiple companies
- Isolated data per tenant
- Shared infrastructure
- Custom branding per tenant

---

### **4.80 Advanced Features** ⏸️ PLANNED
- Multi-language support (DE, HU, PL)
- Multi-currency support
- Audit logging
- Version history
- Data archiving

---

### **4.90 Collaboration Tools** ⏸️ PLANNED
- Comments & mentions
- Task assignments
- Team chat
- File sharing
- Notifications

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- @l-kern/config (constants, translations, theme, hooks, utils)
- @l-kern/ui-components (19+ production components)

**Backend:**
- Python 3.11 + FastAPI
- PostgreSQL 15 (one DB per service)
- Apache Kafka (event-driven architecture)
- REST API (external) + gRPC (inter-service)
- SQLAlchemy + Alembic (ORM + migrations)

**DevOps:**
- Docker + Docker Compose
- Nginx (reverse proxy)
- Kafka + Zookeeper
- Nx + Yarn 4 (monorepo)

---

## 📊 Quick Progress Overview

**Phase 1 Progress:** 2.85/23 tasks complete (~12%)

| Task | Status | Target | Architecture |
|------|--------|--------|--------------|
| 1.10 Infrastructure | ✅ COMPLETED | 2025-10-15 | Foundation |
| 1.20 Coding Standards | ✅ COMPLETED | 2025-10-15 | Foundation |
| 1.30 UI Infrastructure | ⏳ IN PROGRESS | 2025-11-08 | Frontend |
| 1.40 Backend Infrastructure | ⏸️ PLANNED | 2025-11-17 | Backend + Kafka |
| **1.50 Microservice Template** | ⏸️ PLANNED | 2025-11-20 | **Template System** |
| **1.60 Issues Service** | ⏸️ PLANNED | 2025-11-24 | **Internal Ticketing** |
| 1.70 Contact (MDM) | ⏸️ PLANNED | 2025-12-02 | Master Data |
| 1.80 Configuration | ⏸️ PLANNED | 2025-11-30 | Settings |
| 1.90 System Health API | ⏸️ PLANNED | 2025-12-02 | Monitoring |
| 1.100 Page Templates | ⏸️ PLANNED | 2025-12-05 | Frontend |
| 1.110 HR / Payroll | ⏸️ PLANNED | 2025-12-11 | GDPR Protected |
| 1.120 Inventory | ⏸️ PLANNED | 2025-12-18 | Physical Stock |
| 1.130 Purchasing (AP) | ⏸️ PLANNED | 2025-12-29 | Vendors + PO + AP |
| 1.140 Sales (AR) | ⏸️ PLANNED | 2026-01-09 | Customers + SO + AR |
| 1.150 Manufacturing | ⏸️ PLANNED | 2026-01-16 | Production |
| 1.160 PPQ | ⏸️ PLANNED | 2026-01-29 | Planning + Quality |
| 1.170 Operations (BPM) | ⏸️ PLANNED | 2026-02-09 | Workflow Orchestration |
| 1.180 Finance (GL) | ⏸️ PLANNED | 2026-02-20 | Accounting |
| 1.190 Cash & Bank | ⏸️ PLANNED | 2026-02-26 | Payment Processing |
| 1.200 Authentication | ⏸️ PLANNED | 2026-03-05 | Security |
| 1.210 Testing & QA | ⏸️ PLANNED | 2026-03-23 | Quality Assurance |
| 1.220 Production Prep | ⏸️ PLANNED | 2026-04-04 | Deployment |
| 1.230 Deploy MVP | ⏸️ PLANNED | 2026-04-11 | Production Launch |

**Phase 2:** 2.10-2.50 (Security & Stability)
**Phase 3:** 3.10-3.50 (Production Hardening)
**Phase 4:** 4.10-4.90 (Feature Development)

---

**Last Updated:** 2025-11-06
**Version:** 5.1.0
**Next Review:** After Task 1.30 completion (UI Infrastructure)