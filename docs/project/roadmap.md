# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 7.1.0
# Created: 2025-10-13
# Updated: 2025-11-09
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Architecture: Domain-Driven Microservices (Bounded Context)
# Previous Version: 7.0.0
#
# Key Changes from v7.0.0:
# - ✅ Task 1.70 Contact (MDM) implementation plan created (3413 lines, 25 tables, GDPR architecture)
# - ✅ Added implementation plan link: docs/temp/contacts-mdm-implementation-plan.md
# - ✅ Database schema: 25 tables with sequential numbering (1-24 + 2a reference table)
# - ✅ Kafka events: 6 events with full payloads (created, updated, role_added, role_updated, role_removed, deleted)
# - ✅ API endpoints: 25 REST + 26 gRPC methods with universal validation and retry logic
# - ✅ Estimate updated: 25-30h → 40-50h (comprehensive GDPR MDM architecture)
#
# Key Changes from v6.1.0:
# - ✅ Task 1.40 Backend Infrastructure COMPLETED (Kafka + Universal Dockerfile + gRPC)
# - ✅ Task 1.50 Microservice Template COMPLETED (25+ files + generator script)
# - ✅ Progress: 5/23 tasks complete (22%, up from 13%)
# - ✅ Backend microservices foundation ready for rapid service generation
# - ⏸️ Task 1.60 Issues Service skeleton generated (needs customization for role-based UI + file uploads)
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
**Progress:** 5/23 complete (~22%)
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

### **1.30 UI Infrastructure (@l-kern/ui-components)** ✅ COMPLETED (2025-11-08)
**Started:** 2025-10-18
**Completed:** 2025-11-08

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

#### **1.30.4 Modal System v3.0** ✅ COMPLETED (2025-11-02)
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

#### **Phase 3: Verification & Testing** ✅ COMPLETED (2025-11-08)
- ✅ Automated hardcoded value checks (grep script - ZERO violations found)
- ✅ Run all tests (1179/1179 passing - 100%)
- ✅ Visual regression testing (manual - no regressions detected)
- ✅ Lint verification (0 errors, 0 warnings)

#### **Phase 4: Documentation & Cleanup** ✅ COMPLETED (2025-11-08)
- ✅ Update all 15 component .md files (design tokens documented by agent)
- ✅ Delete obsolete design files (cleanup complete)
- ✅ Update design-standards.md (implementation status reflected)

**Success Criteria:**
- ✅ ZERO hardcoded values (verified via automated checks - 579 violations → 0)
- ✅ ALL tests passing (1179/1179 - 100%)
- ✅ ZERO visual regressions
- ✅ WCAG AA compliance (contrast fix: #9e9e9e → #757575)
- ✅ Clean lint (0 errors, 0 warnings)

**Key Benefits:**
- 🎨 Unified design system with modifier pattern (base ± offset)
- ⚡ Performance optimized (max 2 shadows on hover, max 2 transition properties)
- 🧘 Calm UX (150ms hover, 220ms state changes, no bounce on hover)
- ♿ WCAG AA compliant (all text contrast ≥ 4.5:1)
- 📚 Single source of truth (design-standards.md)

---

### **1.30.8 Page Layout Components** ✅ COMPLETED (2025-11-08)
**Dependencies:** None (standalone)
**Estimated:** 4-6h
**Actual:** ~5h

**Goal:** Page-level UI components (headers, wrappers, sections)

- ✅ **PageHeader** (v1.0.0, 2025-11-08) - 27 tests passing
  - Title + optional subtitle
  - Breadcrumb navigation (href, to, onClick, active state)
  - Optional logo (image URL or custom ReactNode)
  - Custom right content slot (buttons, actions)
  - Purple gradient design (left border accent)
  - Responsive (mobile, tablet, desktop breakpoints)
  - Accessibility (semantic HTML, ARIA, keyboard nav)
  - 100% DRY compliance (translations, CSS variables)
  - Documentation (558 lines)

---

### **1.30.9 DataGrid Page Generator** ✅ COMPLETED (2025-11-08)
**Dependencies:** 1.30.5 (FilteredDataGrid), 1.30.8 (PageHeader)
**Estimated:** 6-8h
**Actual:** ~7h

**Goal:** Automated generator for DataGrid-based pages (Orders, Contacts, Invoices, etc.)

**Approach:** Hybrid system (template + generator script)

- ✅ **TemplatePageDatagrid** (v1.0.0) - Reference template
  - Complete FilteredDataGrid implementation
  - PageHeader with breadcrumbs
  - Search, filters, pagination, sorting
  - Row selection, expandable rows, bulk actions
  - Status colors, action buttons
  - 100% DRY compliance (translations, CSS variables)
  - Extensive inline documentation (customization comments)

- ✅ **Generator Script** (v1.0.0) - `scripts/generate-page.js`
  - JSON config-based generation
  - Automatic interface generation from columns
  - Smart mock data generation (types, dates, IDs)
  - Column definitions from config
  - Status colors mapping
  - Expanded content auto-generation
  - CSS file generation (grid-template-columns bug fixed)
  - Translation key placeholders

- ✅ **Configuration System**
  - JSON config format (entityName, columns, features)
  - Example config: `scripts/page-configs/orders-page.json`
  - Column types: string, number, boolean, status
  - Render functions: currency, date
  - Features flags: search, filters, bulkActions, expandable

- ✅ **Documentation** - `scripts/README-GENERATOR.md`
  - Usage instructions (config creation, generator execution)
  - Config format specification
  - Multiple examples (Orders, Contacts, Products)
  - Troubleshooting guide
  - Roadmap (v1.1.0, v1.2.0, v2.0.0 features)

- ✅ **Testing**
  - Generated Orders page (6 columns, 4 status values)
  - Verified: interface, mock data, columns, actions, expanded content
  - Bug fixes: CSS typo, duplicate fields, extra closing tags

**Time Savings:**
- Manual: ~15-20 min per page
- Generator: ~30 sec + 5 min customization
- ROI: 10+ pages = 2-3 hours saved

**Next Steps:**
1. Add translation keys to sk.ts/en.ts (manual)
2. Add route to App.tsx (manual)
3. Add sidebar item (manual)
4. Customize generated code (manual)
5. Connect to API (manual)

---

### **1.40 Backend Infrastructure + Kafka** ✅ COMPLETED (2025-11-08)
**Started:** 2025-11-08
**Completed:** 2025-11-08
**Duration:** 1 day
**Dependencies:** 1.30 complete
**Estimated:** 20h (9 phases)
**Actual:** ~15h
**Architecture:** OPTION 2 (DB per service - 2 containers per microservice)

**Implementation:** 9-phase plan completed (infrastructure → template → generator → testing)

#### **PHASE 1: Universal Dockerfile** ✅ COMPLETED (2h)
- ✅ Created `infrastructure/docker/Dockerfile.backend.dev`
  - Single Dockerfile for ALL Python backend services (DRY principle)
  - SERVICE_PATH build arg for service-specific paths
  - Python 3.11-slim base, PostgreSQL client, pip caching
- ✅ Created `infrastructure/docker/requirements.txt.template`
  - FastAPI 0.104.1, Uvicorn 0.24.0
  - SQLAlchemy 2.0.23, Alembic 1.12.1, psycopg2-binary 2.9.9
  - gRPC 1.59.3, Kafka-python 2.0.2
  - Pydantic 2.5.0, pytest 7.4.3
- ✅ Tested build successfully with test service
- ✅ Cleaned up test files

#### **PHASE 2: Kafka + Zookeeper Infrastructure** ✅ COMPLETED (1.5h)
- ✅ Added lkms503-zookeeper (port 2181 - exception to 4XXX pattern)
  - Volumes: zookeeper_data, zookeeper_logs
  - Health check: nc -z localhost 2181
  - Image: confluentinc/cp-zookeeper:7.5.0
- ✅ Added lkms504-kafka (port 4503)
  - Depends on zookeeper (health check dependency)
  - Volume: kafka_data
  - Image: confluentinc/cp-kafka:7.5.0
  - KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://lkms504-kafka:9092,PLAINTEXT_HOST://localhost:4503
- ✅ Updated .env with full Kafka/Zookeeper configuration (58 lines)
- ✅ Started services (docker-compose up -d)

#### **PHASE 3: Adminer Database UI** ✅ COMPLETED (0.5h)
- ✅ Enabled lkms901-adminer (port 4901)
- ✅ Updated .env (LKMS901_ENABLED=true)
- ✅ Database management interface for all microservices

#### **PHASE 4: gRPC Infrastructure** ✅ COMPLETED (1h)
- ✅ Created proto directory structure:
  - `proto/common/` - Shared proto files
  - `proto/services/` - Service-specific proto files
- ✅ Created `proto/common/health.proto`
  - Standard health check service (Check + Watch)
  - HealthCheckRequest/Response with ServingStatus enum
- ✅ Created `scripts/compile-proto.sh` (Linux)
- ✅ Created `scripts/compile-proto.cmd` (Windows)
  - Proto compilation to Python gRPC code
  - Recursive search for all .proto files
  - Output to generated/ directory

#### **PHASE 5: Documentation Updates** ✅ COMPLETED (0.5h)
- ✅ Updated `docs/architecture/port-mapping.md` to v2.0.0
  - Added lkms503-zookeeper (port 2181)
  - Added lkms504-kafka (port 4503)
  - Added gRPC port convention (5XXX range)
  - Added elasticsearch (lkms505 - planned)
  - Updated changelog
- ✅ Updated `docs/project/overview.md` to v10.0.0 (this update)
- ✅ Updated `docs/project/roadmap.md` to v6.0.0 (this file)

#### **PHASE 6: Template Microservice** ✅ COMPLETED (8h)
- ✅ Completed (25+ files created)
- See Task 1.50 for details

#### **PHASE 7: Generator Script** ✅ COMPLETED (4h)
- ✅ Created `scripts/microservice-generator/generate-microservice.js`
- ✅ JSON config system (11-variable placeholder system)
- ✅ Placeholder replacement engine
- ✅ docker-compose.yml injection
- ✅ .env injection
- ✅ 3 example configs (test, issues, contacts)
- ✅ Comprehensive documentation (15KB README)
- 🔧 **Bugfix:** Fixed alembic/env.py sys.path import issue

#### **PHASE 8: Testing & Validation** ✅ COMPLETED (1h)
- ✅ Generated test service (lkms999-test)
- ✅ Generated Issues Service (lkms105-issues - Task 1.60)
- ✅ Tested REST API endpoints (GET, POST, GET/{id})
- ✅ Tested health check endpoint
- ✅ Tested database migrations (alembic upgrade head)
- ✅ Tested Docker deployment (2 containers per service)
- 🔧 **Bugfix:** Fixed Dockerfile PORT → REST_PORT environment variable

#### **PHASE 9: Documentation + Commit** ✅ COMPLETED (0.5h)
- ✅ Updated overview.md to v11.0.0
- ✅ Updated roadmap.md to v7.0.0
- ✅ Ready for git commit

---

### **1.50 Microservice Template** ✅ COMPLETED (2025-11-08)
**Started:** 2025-11-08
**Completed:** 2025-11-08
**Duration:** 1 day
**Dependencies:** 1.40 (PHASES 1-5 complete)
**Estimated:** 12h (2 phases: template + generator)
**Actual:** ~12h
**Architecture:** Part of 1.40 PHASE 6-7

**Goal:** Complete microservice template with 11-variable placeholder system → Generator script → 30-second service creation

**Template Location:** `services/lkms-template/`

#### **Template Structure** ✅ COMPLETED (25+ files created)

**Core Application Files:**
- ✅ `app/__init__.py` - Package initialization
- ✅ `app/main.py` - FastAPI application entry point
  - CORS middleware, health endpoint, startup/shutdown events
  - Router inclusion, database initialization
- ✅ `app/config.py` - Pydantic Settings
  - 11 placeholders: SERVICE_NAME, SERVICE_CODE, REST_PORT, GRPC_PORT, DB_NAME, etc.
  - DATABASE_URL property, Kafka config, CORS settings
- ✅ `app/database.py` - SQLAlchemy setup
  - Engine, SessionLocal, Base, get_db() dependency

**Models & Schemas:**
- ✅ `app/models/__init__.py` - Model exports
- ✅ `app/models/example.py` - SQLAlchemy model template
  - {{MODEL_NAME}}, {{TABLE_NAME}} placeholders
  - Standard fields: id, name, description, is_active, timestamps
- ✅ `app/schemas/__init__.py` - Schema exports
- ✅ `app/schemas/example.py` - Pydantic schemas
  - Base, Create, Update, Response schemas

**REST API:**
- ✅ `app/api/__init__.py` - API package init
- ✅ `app/api/rest/__init__.py` - REST routes init
- ✅ `app/api/rest/example.py` - Complete CRUD REST API (120 lines)
  - List (GET /), Create (POST /), Get by ID (GET /{id})
  - Update (PUT /{id}), Delete (DELETE /{id})
  - Kafka event publishing (created, updated, deleted)
  - {{ROUTE_PREFIX}}, {{ROUTE_SINGULAR}} placeholders

**gRPC API:**
- ✅ `app/api/grpc/__init__.py` - gRPC package init
- ✅ `app/api/grpc/example_service.py` - gRPC service stubs
  - HealthService (health check implementation)
  - {{MODEL_NAME}}Service (service-specific RPC stubs)

**Kafka Events:**
- ✅ `app/events/__init__.py` - Events package init
- ✅ `app/events/producer.py` - Kafka producer
  - Singleton pattern, async publish_event() function
  - JSON serialization, topic prefixing
- ✅ `app/events/consumer.py` - Kafka consumer
  - EventConsumer class, handler registration
  - Async message processing

**Database Migrations:**
- ✅ `alembic.ini` - Alembic configuration
- ✅ `alembic/env.py` - Migration environment
  - Imports Base metadata, sets DATABASE_URL
  - Online/offline migration support
- ✅ `alembic/script.py.mako` - Migration template
- ✅ `alembic/README` - Migration usage guide

**Testing:**
- ✅ `tests/__init__.py` - Tests package init
- ✅ `tests/test_api.py` - Comprehensive test suite (13 tests, 140 lines)
  - Create, list, get by ID, update, delete tests
  - Validation tests (404, 422 errors)
  - In-memory SQLite for testing

**Configuration & Documentation:**
- ✅ `requirements.txt` - Python dependencies (39 lines)
  - FastAPI, SQLAlchemy, Alembic, gRPC, Kafka, pytest
- ✅ `.env.template` - Environment variables (35 lines)
  - Service info, ports, database, Kafka, CORS config
- ✅ `README.md` - Comprehensive documentation (200+ lines)
  - Quick start, API endpoints, Kafka events
  - Database schema, testing guide, configuration

**Placeholder System (11 variables):**
- Service identifiers: {{SERVICE_NAME}}, {{SERVICE_CODE}}, {{SERVICE_SLUG}}
- Ports: {{REST_PORT}}, {{GRPC_PORT}}
- Database: {{DB_NAME}}
- Models: {{MODEL_NAME}}, {{TABLE_NAME}}
- Routes: {{ROUTE_PREFIX}}, {{ROUTE_SINGULAR}}
- Descriptions: {{SERVICE_DESCRIPTION}}, {{SERVICE_LONG_DESCRIPTION}}

#### **Generator Script** ✅ COMPLETED (PHASE 7)
- ✅ Created `scripts/microservice-generator/generate-microservice.js` (v1.0.1)
- ✅ JSON config system (11 variables: service name, code, slug, ports, db, model, routes, descriptions)
- ✅ Copy lkms-template → lkms{code}-{slug}
- ✅ Replace all 11 placeholders in all files
- ✅ Inject services into docker-compose.yml (2 containers: app + db)
- ✅ Inject service config into .env
- ✅ Created example configs:
  - `scripts/microservice-generator/configs/test-service.json`
  - `scripts/microservice-generator/configs/issues-service.json` (Task 1.60)
  - `scripts/microservice-generator/configs/contacts-service.json` (Task 1.70)
- ✅ Created comprehensive documentation:
  - `scripts/README.md` (master index for all scripts)
  - `scripts/microservice-generator/README.md` (15KB detailed guide)
  - `scripts/page-generator/README.md` (page generator docs)
  - `scripts/proto-compiler/README.md` (gRPC proto compilation)
- 🔧 **Bugfixes:**
  - Fixed docker-compose injection (before # USAGE instead of # VOLUMES)
  - Fixed alembic/env.py sys.path import issue (added to template)
  - Removed `frontend` network (not defined in docker-compose.yml)

**Time Savings:**
- Manual service creation: ~4-6 hours
- Generator: ~30 seconds + 10 min customization
- ROI: 10+ services = 40-60 hours saved

---

### **1.60 Issues Service** ⏸️ PLANNED
**Dependencies:** 1.40 (Backend Infrastructure), 1.50 (Microservice Template)
**Estimated:** 18-23h (4-5 days) ↑ from 12-16h
**Target:** 2025-11-21 - 2025-11-25
**Ports:** 4105 (REST), 5105 (gRPC)
**Database:** lkms105_issues (PostgreSQL)
**Storage:** MinIO bucket: `lkern-issues`

📄 **Implementation Plan:** [docs/temp/issues-service-implementation-plan.md](../temp/issues-service-implementation-plan.md)

**Role-Based Ticketing System - Developer-focused issue tracking**

#### Key Features:
- 🎭 **Role-Based UI** - Dynamic forms based on user role (PROGRAMMER/USER/SCANNER)
- 🔢 **Human-Readable Codes** - BUG-00042, FEAT-00123, IMPR-00008, QUES-00015
- 📸 **File Attachments** - Screenshots, logs, PDFs (max 10MB, MinIO storage)
- 🐛 **Developer Fields** - error_message, browser, os, url (variant C only)
- 🏷️ **Rich Classification** - type + severity + category (optional)
- ✅ **No Auto-Actions** - No auto-assign, no auto-close (manual control)

#### **1.60.1 Backend**
- ⏸️ **Copy from template:** `scripts/create_microservice.sh Issues 4105 5105 lkms105_issues`
- ⏸️ **Issue Model** (SQLAlchemy):
  - `id` (UUID, primary key)
  - `issue_number` (Integer, sequential: 1, 2, 3...)
  - `issue_code` (String 20, unique: BUG-00042, FEAT-00123)
  - `title` (String 200, required)
  - `description` (Text, required)
  - **Classification:**
    - `type` (Enum: BUG, FEATURE, IMPROVEMENT, QUESTION)
    - `severity` (Enum: MINOR, MODERATE, MAJOR, BLOCKER) ← NEW
    - `category` (Enum: UI, BACKEND, DATABASE, INTEGRATION, DOCS, PERFORMANCE, SECURITY, nullable) ← NEW
  - **Status & Priority:**
    - `status` (Enum: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
    - `priority` (Enum: LOW, MEDIUM, HIGH, CRITICAL)
  - **Users:**
    - `reporter_id` (UUID, FK to users)
    - `assignee_id` (UUID, FK to users, nullable)
  - **Developer Fields (variant C only):** ← NEW
    - `error_message` (Text, nullable) - Stack trace, console error
    - `error_type` (String 100, nullable) - TypeError, ValueError, 500, etc.
    - `browser` (String 100, nullable) - Chrome 120.0.6099.109, etc.
    - `os` (String 100, nullable) - Windows 11, macOS 14.2, etc.
    - `url` (String 500, nullable) - URL where error occurred
  - **Attachments:** ← NEW
    - `attachments` (JSON, nullable) - Array of file metadata
      - `[{filename, url, size, type, uploaded_at, uploaded_by}]`
  - **Timestamps:**
    - `created_at`, `updated_at`, `resolved_at`, `closed_at`
  - **Soft Delete:**
    - `is_deleted` (Boolean, default=False)

- ⏸️ **REST API Endpoints:**
  - `GET /api/v1/issues` - List issues (with filters)
  - `GET /api/v1/issues/{id}` - Get issue detail
  - `POST /api/v1/issues` - Create issue
  - `PUT /api/v1/issues/{id}` - Update issue
  - `DELETE /api/v1/issues/{id}` - Delete issue (soft delete)
  - `POST /api/v1/issues/{id}/assign` - Assign to user
  - `POST /api/v1/issues/{id}/resolve` - Mark as resolved
  - `POST /api/v1/issues/{id}/close` - Close issue
  - `POST /api/v1/issues/{id}/attachments` - Upload file ← NEW
  - `DELETE /api/v1/issues/{id}/attachments/{filename}` - Delete file ← NEW

- ⏸️ **gRPC API:** Same operations for inter-service communication

- ⏸️ **Kafka Events:**
  - `lkern.issues.created` - New issue reported
  - `lkern.issues.assigned` - Assigned to user
  - `lkern.issues.resolved` - Marked as resolved
  - `lkern.issues.closed` - Issue closed

- ⏸️ **MinIO File Storage:** ← NEW
  - Bucket: `lkern-issues`
  - Path: `issues/{issue_id}/{timestamp}_{filename}`
  - Max file size: 10 MB
  - Allowed types: images, PDFs, logs (.log, .txt)
  - Multiple files per issue (max 5)

#### **1.60.2 Frontend**
- ⏸️ **Issues Page** (`/issues`)
  - FilteredDataGrid with role-based columns
  - Show `category` column only for PROGRAMMER role
  - Filters: type, severity, category (conditional), status
  - Search by title/description/error_message
  - Sort by created_at, severity, issue_code
  - Click → detail view

- ⏸️ **Create Issue Modal (Role-Based)** ← UPDATED
  - **Variant A - SCANNER (minimal):**
    - Fields: title, description, type, screenshot (required)
  - **Variant B - USER (basic):**
    - Fields: title, description, type, severity, attachments (optional)
  - **Variant C - PROGRAMMER (full detail):**
    - Fields: title, description, type, severity, category
    - Developer fields: error_message, browser, os, url
    - Auto-fill: browser (detectBrowser()), os (detectOS()), url (window.location.href)
    - Attachments: multiple files (images, PDFs, logs)
  - SectionEditModal with dynamic FieldDefinition based on user role

- ⏸️ **Issue Detail Modal**
  - Display all fields (role-based visibility)
  - Show attachments gallery (images preview, download links)
  - Show developer fields only if populated
  - Actions: Assign, Resolve, Close
  - Status transitions validation

- ⏸️ **File Upload Component** ← NEW
  - Drag-and-drop support
  - Multiple file selection (max 5 files)
  - File type validation (images, PDFs, logs)
  - File size validation (max 10MB per file)
  - Upload progress indicator
  - Preview thumbnails for images

#### **1.60.3 Testing**
- ⏸️ **Backend Tests (pytest):**
  - 20 unit tests (CRUD operations + file upload)
  - 15 integration tests (REST API endpoints)
  - 5 gRPC tests (service calls)
  - 5 Kafka tests (event emission)
  - 5 MinIO tests (file upload/delete)
  - **Total: 50 backend tests**

- ⏸️ **Frontend Tests (Vitest):**
  - 15 component tests (Issues page, 3 modal variants, file upload)
  - 5 integration tests (API calls, role-based rendering)
  - **Total: 20 frontend tests**

**Success Criteria:**
- ✅ All tests passing (70 tests total)
- ✅ REST API functional (10 endpoints including file upload)
- ✅ gRPC API functional (inter-service calls work)
- ✅ Kafka events emitted correctly (4 events)
- ✅ MinIO file storage working (upload/download/delete)
- ✅ Role-based UI working (3 variants: A/B/C)
- ✅ Issue code generation working (BUG-00042 format)
- ✅ Frontend connected to backend
- ✅ File upload end-to-end working

---

### **1.70 Contact (MDM) Service** ⏸️ PLANNED
**Dependencies:** 1.50 complete (uses microservice template)
**Estimated:** 40-50h (10-12 days)
**Target:** 2025-11-25 - 2025-12-10
**Ports:** 4101 (REST), 5101 (gRPC)
**Database:** lkms101_contacts

**📄 Implementation Plan:** [docs/temp/contacts-mdm-implementation-plan.md](../temp/contacts-mdm-implementation-plan.md) (3413 lines, fully validated)

**Master Data Management - Single Source of Truth for Contact Data**

#### Key Features:
- 🏢 **Party Model Pattern** - Base contacts table with type-specific detail tables (PERSON, COMPANY, ORGANIZATIONAL_UNIT)
- 🎭 **Multi-Role Support** - One contact can have multiple roles simultaneously (SUPPLIER + CUSTOMER + EMPLOYEE)
- 📊 **25 Database Tables** - Sequential order (1-24 + 2a reference table for dynamic role types)
- 📡 **6 Kafka Events** - Full payloads for data synchronization (created, updated, role_added, role_updated, role_removed, deleted)
- 🔐 **GDPR Least Privilege** - NO sensitive data (NO IBAN, NO salaries, NO rodné čísla)
- 🌐 **25 REST + 26 gRPC Endpoints** - Universal validation, hybrid architecture, exponential retry logic
- 🔢 **Dynamic Role Types** - Reference table allows runtime addition of new roles without schema changes

#### GDPR Data Ownership Matrix:
**Contact (MDM) Stores:**
- ✅ UUID (contact_id) - Master identifier
- ✅ Name (Person/Company) - Public data
- ✅ Work Email/Phone - Business communication
- ✅ Company Address - Public information (obchodný register)
- ✅ Personal Address - For employees only (replicated to HR if needed)

**Contact (MDM) Does NOT Store:**
- ❌ IBAN - Stored in Sales (customer), Purchasing (vendor), HR (employee)
- ❌ Salaries - Stored in HR microservice only
- ❌ Rodné čísla - Stored in HR microservice only
- ❌ Credit Limits - Stored in Sales microservice
- ❌ Payment Terms - Stored in Sales/Purchasing microservices

#### Database Schema (25 Tables):

**Core Tables (1-6):**
- Table 1: `contacts` - Base entity (UUID, type, is_deleted, audit fields)
- Table 2: `contact_roles` - M:N role assignments with validity periods
- Table 2a: `role_types` - Reference table for dynamic role management (9 pre-populated roles)
- Table 3: `contact_persons` - Person details (first_name, last_name, title, nationality, birth date)
- Table 4: `contact_companies` - Company details (legal_form_id, registration_number, tax_number, VAT)
- Table 5: `contact_organizational_units` - Organizational unit details (division, department, team)
- Table 6: `organizational_unit_types` - Reference table for unit types

**Reference Tables (7-11):**
- Table 7: `legal_forms` - Company legal forms (s.r.o., a.s., GmbH, Corp., Inc., etc.)
- Table 8: `countries` - Countries with ISO codes and phone codes
- Table 9: `languages` - Languages with ISO codes
- Table 10: `nationalities` - Nationalities reference
- Table 11: `business_focus_areas` - Business activities classification

**Address System (12-15):**
- Table 12: `addresses` - Reusable address pool
- Table 13: `person_addresses` - M:N junction for person addresses
- Table 14: `company_addresses` - M:N junction for company addresses
- Table 15: `organizational_unit_addresses` - M:N junction for org unit addresses

**Communication Tables (16-19):**
- Table 16: `contact_emails` - Work emails with type ENUM (WORK, BILLING, SUPPORT, GENERAL)
- Table 17: `contact_phones` - Work phones with type ENUM (MOBILE, FAX, FIXED_LINE)
- Table 18: `contact_websites` - Websites with type ENUM (MAIN, SHOP, BLOG, SUPPORT, PORTFOLIO)
- Table 19: `contact_social_networks` - Social network profiles

**Relations & Tags (20-24):**
- Table 20: `tags` - Tag definitions for classification
- Table 21: `contact_tags` - M:N junction for contact tagging
- Table 22: `contact_languages` - M:N junction for spoken languages
- Table 23: `contact_operating_countries` - M:N junction for countries of operation
- Table 24: `contact_business_focus_areas` - M:N junction for business activities

#### Kafka Events (6 Events):
1. **lkern.contacts.created** - New contact created (full contact data + roles + emails + phones + addresses)
2. **lkern.contacts.updated** - Contact data modified (changed_fields array with old/new values)
3. **lkern.contacts.role_added** - New role assigned (role_type_id UUID + nested role_type object + contact_summary)
4. **lkern.contacts.role_updated** - Role assignment modified (changes array with field updates)
5. **lkern.contacts.role_removed** - Role removed (role_type_id UUID + reason + contact_summary)
6. **lkern.contacts.deleted** - Contact soft-deleted (GDPR compliance with 30-day purge)

**Subscribers:**
- Sales microservice (CUSTOMER/CLIENT roles)
- Purchasing microservice (SUPPLIER/VENDOR/SERVICE_PROVIDER roles)
- HR microservice (EMPLOYEE/MANAGER roles)
- PPQ microservice (quality tracking)
- Operations microservice (job assignments)

#### REST API Endpoints (25 Total):

**Health & Info (2):**
- GET /health - Health check
- GET /info - Service information

**Contact Management (5):**
- POST /api/v1/contacts - Create contact
- GET /api/v1/contacts/{id} - Get contact by UUID
- PUT /api/v1/contacts/{id} - Update contact
- DELETE /api/v1/contacts/{id} - Soft delete
- GET /api/v1/contacts - List with filtering

**Role Management (4):**
- POST /api/v1/contacts/{id}/roles - Add role
- PUT /api/v1/contacts/{id}/roles/{role_id} - Update role
- DELETE /api/v1/contacts/{id}/roles/{role_id} - Remove role
- GET /api/v1/contacts/{id}/roles - Get all roles

**Address Management (3):**
- POST /api/v1/contacts/{id}/addresses - Add address
- PUT /api/v1/contacts/{id}/addresses/{address_id} - Update address
- DELETE /api/v1/contacts/{id}/addresses/{address_id} - Remove address

**Communication Management (4 Universal Endpoints):**
- POST /api/v1/contacts/{id}/communication?type={email|phone|website} - Add communication
- PUT /api/v1/contacts/{id}/communication/{comm_id}?type={email|phone|website} - Update communication
- DELETE /api/v1/contacts/{id}/communication/{comm_id}?type={email|phone|website} - Remove communication
- GET /api/v1/contacts/{id}/communication?type={email|phone|website} - Get all communication

**Relations Management (4 Universal Endpoints):**
- POST /api/v1/contacts/{id}/relations?type={tag|language|social_network|operating_country|business_focus_area}
- PUT /api/v1/contacts/{id}/relations/{relation_id}?type={...}
- DELETE /api/v1/contacts/{id}/relations/{relation_id}?type={...}
- GET /api/v1/contacts/{id}/relations?type={...}

**Universal Validation (1):**
- GET /api/v1/contacts/validate?type={email|phone|website|registration_number|tax_number|vat_number}&value=...

**Search & Filter (2):**
- GET /api/v1/contacts/search?query=... - Full-text search
- GET /api/v1/contacts/filter?role=...&type=...&tag=... - Advanced filtering

#### gRPC API Methods (26 Total):
- 10 Contact CRUD operations (Create, Get, Update, Delete, List, Search, Filter, etc.)
- 4 Role management (AddRole, UpdateRole, RemoveRole, GetRoles)
- 3 Address management (AddAddress, UpdateAddress, RemoveAddress)
- 4 Communication management (AddCommunication, UpdateCommunication, RemoveCommunication, GetCommunication)
- 4 Relations management (AddRelation, UpdateRelation, RemoveRelation, GetRelations)
- 1 Validation (ValidateUnique)

#### Error Handling & Retry Logic:

**Backend Validation BEFORE INSERT:**
- Validate all foreign keys (nationality_id, legal_form_id, role_type_id, country_id, language_id, tag_id, related_contact_id)
- Check for duplicate email (is_deleted = FALSE)
- Check for duplicate phone (is_deleted = FALSE)
- Check for duplicate registration_number (is_deleted = FALSE)
- Prevents database constraint violations with better error messages

**Frontend Exponential Backoff:**
- Timeline: t=0s (Attempt 1) → t=1s (Attempt 2) → t=3s (Attempt 3) → t=7s (Attempt 4)
- Max wait: 10s → Show toast error to user
- Total timeout: 20s → Final timeout with error toast
- Only retries on 500 Server Errors (not 4xx client errors)

#### **1.70.1 Backend (25-30h)**
- ⏸️ Generate from template: `node scripts/microservice-generator/generate-microservice.js scripts/microservice-configs/contacts-service.json`
- ⏸️ Create all 25 database tables with constraints, indexes, triggers
- ⏸️ Seed reference tables (countries, languages, nationalities, legal_forms, role_types, organizational_unit_types, business_focus_areas)
- ⏸️ Implement 25 REST endpoints (CRUD + universal communication + universal relations + validation)
- ⏸️ Implement 26 gRPC methods (full service integration)
- ⏸️ Implement 6 Kafka events with full payloads (producer logic)
- ⏸️ Backend validation (10 checks before INSERT)
- ⏸️ Alembic database migrations
- ⏸️ 50+ unit tests (API endpoints, validation, Kafka events)

#### **1.70.2 Frontend (15-20h)**
- ⏸️ Contacts page with FilteredDataGrid
- ⏸️ Contact detail view (tabbed interface: Basic Info, Roles, Addresses, Communication, Relations)
- ⏸️ Create/Edit modal with SectionEditModal (dynamic fields based on contact type: PERSON/COMPANY/ORGANIZATIONAL_UNIT)
- ⏸️ Role management modal (add/edit/remove roles with validity periods)
- ⏸️ Address management modal (add/edit/remove addresses)
- ⏸️ Communication management (emails, phones, websites) with type selection
- ⏸️ Relations management (tags, languages, social networks, countries, business areas)
- ⏸️ Universal validation integration (real-time duplicate checking)
- ⏸️ Exponential retry logic for 500 errors (10s toast warning, 20s timeout)
- ⏸️ 60+ translation keys (SK/EN)
- ⏸️ 40+ integration tests

#### Success Criteria:
- ✅ All 25 tables created with correct constraints and indexes
- ✅ Reference tables seeded with initial data (countries, legal forms, role types, etc.)
- ✅ All 25 REST endpoints working (CRUD + universal endpoints + validation)
- ✅ All 26 gRPC methods implemented and tested
- ✅ All 6 Kafka events publishing with correct payloads
- ✅ Backend validation prevents FK violations and detects duplicates
- ✅ Frontend exponential retry logic working (10s toast, 20s timeout)
- ✅ 90+ tests passing (50+ backend unit tests + 40+ frontend integration tests)
- ✅ GDPR data ownership matrix respected (NO sensitive data in Contact MDM)
- ✅ Multi-role support working (one contact can have multiple roles simultaneously)
- ✅ Dynamic role types working (new roles can be added without schema changes)

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

**Phase 1 Progress:** 3/23 tasks complete (~13%)

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

**Last Updated:** 2025-11-08
**Version:** 5.5.0
**Next Review:** Before starting Task 1.40 (Backend Infrastructure)