# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 9.2.0
# Created: 2025-10-13
# Updated: 2025-12-10
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Architecture: Domain-Driven Microservices (Bounded Context)
# Previous Version: 9.1.0
#
# Key Changes from v9.1.0:
# - 🌍 Task 1.200.2: Added <Trans> Component for React component interpolation in translations
# - 🔗 Enable legal texts with embedded links (GDPR consent, Terms of Service, Privacy Policy)
# - 📝 Authentication pages will use <Trans> for forgot password links, registration consent, email formatting
# - ⏱️ Task 1.200 estimate updated: 25-30h → 28-33h (+3h for translation infrastructure)
# - 🎯 Lightweight implementation (~50 lines) without external dependencies
#
# Key Changes from v9.0.0:
# - 📝 TODO Audit: Added all codebase TODO comments to roadmap sections
# - 📝 Task 1.60: Added 7 TODO items from Issues.tsx, IssueEditModal.tsx, IssueViewModal.tsx, AssignIssueModal.tsx
# - 📝 Task 1.200: Added 5 TODO items for mock auth replacement (useAuth, AuthContext, AuthRoleSwitcher)
# - 📝 Task 3.40: Added ESLint config fix + DataGrid keyboard navigation TODO
# - 📝 Task 1.30.9: Added Page Generator enhancement TODO (CSV/PDF export, auto translation keys)
#
# Key Changes from v8.9.0:
# - ✨ Task 1.204 Realtime Gateway Service ADDED (Phase 1, OPTIONAL - NOT REQUIRED FOR MVP)
# - 🔌 Centralized WebSocket Gateway with Redis Pub/Sub (15-20h estimate)
# - 📡 Single endpoint for all real-time notifications (locks, chat, updates)
# - 📝 TODO: Return to Issues Service for unlock notifications after gateway
# - 🎯 Priority: Orders & Price Quotes (1.140 Sales Service) - MVP focus
# - ⚠️ Pessimistic Locking UI implemented (Modal v4.0.0), backend template ready
#
# Key Changes from v8.8.0:
# - ✨ useEntityLookup hook IMPLEMENTED - universal entity fetch with health check workflow
# - 🔗 Contacts Service integration PREPARED for Issues (mock API, ready for real service)
# - 🎯 People section now shows contact name + position (with loading/error states)
# - 🪝 Hook features: health check, caching (TTL), retry logic, batch support
# - 📁 Files: hooks/useEntityLookup, services/contactsService.ts, IssueViewModal.tsx
# - 🚀 Pattern ready for: MinIO export, any external service integration
#
# Key Changes from v8.7.0:
# - ✨ Field-Level Permissions IMPLEMENTED for Issues Service
# - 🔐 Frontend: useFieldPermission hook, disabled/blurred fields based on user level
# - 🔐 Backend: PUT endpoint validates per-field permissions (403 if forbidden)
# - 📊 Permission matrix: viewLevel + editLevel per field (0-100 numeric levels)
# - 🎯 Files: permissions/types.ts, issueFieldPermissions.ts, fieldPermissions.ts
# - 🪝 New hook: useIssueFieldPermissions (batch permission check for UI)
#
# Key Changes from v8.6.0:
# - ✨ Task 1.60.4 Manager Issue Dashboard ADDED (Phase 1, 15-20h)
# - 📊 Kanban board view, bulk operations, team management, statistics
# - 🔐 Manager-only access (permission level ≥50)
# - 🎯 Separate route: /dashboard/issues (distinct from user /issues page)
#
# Key Changes from v8.5.0:
# - ✨ Task 1.90.3 Deletion Cleanup Service ADDED (Phase 1, 3-4h, cron job)
# - 🔄 Eventual Deletion Pattern implemented in Issues Service (frontend + backend)
# - 📊 Cleanup cron job: Daily 02:00, calls /cleanup/retry on all services
# - 🎯 Phase 1 simplified cleanup (REST endpoints), Phase 2 adds Celery + alerting
#
# Key Changes from v8.4.0:
# - ✨ Task 2.07 Async Background Cleanup & Deletion Retry ADDED (Phase 2, 40-50h)
# - 📚 Deletion Audit Workflow documentation added to backend-standards.md (v2.1.0)
# - 🏗️ Hybrid architecture: Audit Table (queryable logs) + Kafka Events (async processing)
# - 🔄 Soft delete: deleted_at timestamp, keep MinIO files for recovery
# - 🔁 Hard delete: External resources → Audit → Database (with retry logic in Phase 2)
# - 📊 Phase 2 progress: 0/12 tasks (includes 2.05 optional, 2.07 new)
# - 🎯 Foundation for robust deletion workflow: Phase 1 = sync, Phase 2 = async + retry
#
# Key Changes from v8.3.0:
# - 🔧 L-KERN Control Panel ENHANCED v1.11.3 → v1.13.1 (UI improvements + timing system)
# - 🔧 Orchestrators REWRITTEN v2.x → v3.0.0 (comprehensive timing system, live updates)
# - ✨ Startup Orchestrator: Live timer (MM:SS:MS), parallel health checks, 50-entry statistics
# - ✨ Shutdown Orchestrator: Live timer, per-service timing, sequential verification
# - ✨ Cleanup Orchestrator: Two-step confirmation, live timer, destructive cleanup
# - ✨ Control Panel: Terminal wrapping controls, Docker-All button layout (2 rows), hover styling
# - ✨ Central Services Registry: services_registry.json (single source of truth for all services)
# - 📚 Documentation: 3 orchestrator .md files (startup, shutdown, cleanup) - comprehensive guides
# - ⚡ Performance: Startup 2-8x faster (parallel health checks), shutdown 20s avg, cleanup 30s avg
#
# Key Changes from v8.2.0:
# - ✨ Timezone configuration ADDED to Configuration Service (LKMS199) scope
# - 🐛 Issues Service: Fixed issue_code generation bug (duplicate key violation)
# - 🧹 Issues Service frontend: Debug console logs removed
#
# Key Changes from v8.1.0:
# - ✨ Task 1.55 System Operations Service (LKMS801) ADDED (6-8h, native Windows gRPC service)
# - 🔧 L-KERN Control Panel ENHANCED (3 buttons: START/STOP/CLEAN, window height 1130px)
# - 📊 Progress: 6/26 tasks complete (~23%, up from 5/25 tasks)
#
# Key Changes from v8.0.0:
# - 📈 Task 2.01 Event Store UPDATED (80-100h → 120-150h, +30h learning curve, +20h security)
# - ✨ Task 2.05 Blockchain Integration Extension ADDED (OPTIONAL, 40-50h, full Hyperledger)
# - ✨ Task 2.06 Advanced Health Monitoring ADDED (Phase 2, 35-45h, service-specific metrics)
# - 📝 Part 3 Security & Honeypot Layer ADDED (section 3.7, tamper detection, fake endpoints)
# - 📝 Part 4 External Events Admin Workflow ADDED (section 4.6.6, weekly/quarterly review)
# - 📝 Part 4 Rate Limiting & Queue Management ADDED (section 4.7, concurrent job limits)
# - ⚠️ Testing Strategy warnings added to Tasks 2.01, 2.05, 2.06, 2.10
# - 📊 Phase 2 total updated: 345-435h (265-335h if 2.05 skipped), Grand Total: 450-565h
# - 🔍 Task 1.40 review: Basic health checks sufficient for MVP, Phase 2 expansion added
#
# Key Changes from v7.2.0:
# - 🎯 Extended Architecture Implementation Plan Complete (8 parts, 335-425h estimate)
# - ✨ Task 1.155 Calendar Service ADDED (Phase 1, 40-50h, Office 365-like calendar)
# - ✨ Task 1.205 Messaging Service ADDED (Phase 1, 30-40h, WebSocket real-time chat)
# - 📈 Task 1.60 Issues Service UPDATED (18-23h → 35-45h, extended features)
# - ✨ Task 2.01 Event Store + Blockchain ADDED (Phase 2, 80-100h, Hyperledger Fabric)
# - ✨ Task 2.02 Temporal Analytics ADDED (Phase 2, 60-80h, time-travel queries)
# - ✨ Task 2.03 Graph Visualization ADDED (Phase 2, 40-50h, Neo4j + D3.js)
# - ✨ Task 2.04 Dashboard Phase 2 ADDED (Phase 2, 50-60h, multi-service aggregation)
# - ✨ Task 3.05 Dashboard Phase 3 ADDED (Phase 3, 40-50h, SharePoint-like widgets)
# - 📊 Progress updated: Phase 1 (5/25 tasks, ~20%), Phase 2 (+4 tasks), Phase 3 (+1 task)
# - 📄 Complete implementation plans in docs/temp/ (8 separate files + master index)
#
# Key Changes from v7.1.0:
# - ✅ Task 1.60.2 Issues Service Frontend - PARTIAL COMPLETION (2025-11-09)
# - ✅ IssueTypeSelectModal completed (two-step workflow, DRY compliance)
# - ✅ CreateIssueModal refactored (FormField + Input + Select components)
# - ✅ Real-time validation (Title: min 3 chars, Description: min 3 chars)
# - ✅ Type-based screenshot validation (required ONLY for BUG type)
# - ✅ Browser context auto-population (browser, OS, URL, viewport, timestamp)
# - ⚠️ WARNING: Frontend 80% complete but missing documentation and tests
# - ⚠️ Missing: Component docs, 50 unit/integration/CRUD/E2E tests
# - ⚠️ Many bugs in filtering, sorting, validation logic
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
**Progress:** 6/27 complete (~22%)
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

**⚠️ Generator Enhancement TODO (Future versions):**
- **TODO:** Export CSV/PDF feature (page-generator/README.md:227)
- **TODO:** Automatic translation keys generation (page-generator/README.md:301)
- **TODO:** Replace mock API implementations in TemplatePageDatagrid with actual API calls (TemplatePageDatagrid.tsx:613-846)

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

### **1.55 System Operations Service (LKMS801)** ✅ COMPLETED (2025-11-23)
**Started:** 2025-11-23
**Completed:** 2025-11-23
**Duration:** 1 day
**Dependencies:** 1.50 (Microservice Template - structure reference only)
**Estimated:** 6-8h
**Actual:** ~5h
**Type:** Native Windows Service (NOT Docker)
**Architecture:** gRPC + FastAPI (native Windows, no database)

**Ports:** 5801 (REST), 6801 (gRPC)
**Storage:** None (operates on host file system)
**Network:** Runs on host machine (outside Docker network)

**Goal:** Native Windows service for file system operations that Docker containers cannot perform.

**Why Native (not Docker)?**
- Docker containers have limited access to host file system
- Need to open folders in Windows Explorer (os.startfile)
- Need to copy/move files on host system with full permissions
- Native service has complete Windows API access

#### **Service Structure:**
```
services/lkms801-system-ops/
├── proto/
│   └── system_ops.proto           # gRPC protocol definitions (7 operations)
├── app/
│   ├── main.py                    # FastAPI + gRPC server (dual server)
│   ├── config.py                  # Pydantic settings (API key, path whitelist)
│   ├── grpc_server.py             # gRPC servicer implementation
│   ├── services/
│   │   └── file_operations.py    # File system operations logic
│   └── security/
│       └── auth.py                # API key + path validation
├── requirements.txt               # Python dependencies (gRPC, FastAPI)
├── compile-proto.bat              # Windows proto compilation script
├── start-service.bat              # Windows service startup script
├── .env.example                   # Configuration template
└── README.md                      # Comprehensive documentation (10KB)
```

#### **Operations Implemented (7):**
1. **OpenFolder** - Open folder in Windows Explorer (os.startfile)
2. **CopyFile** - Copy file or folder (shutil.copy2 / shutil.copytree)
3. **MoveFile** - Move file or folder (shutil.move)
4. **DeleteFile** - Delete file or folder (os.remove / shutil.rmtree)
5. **RenameFile** - Rename file or folder (os.rename)
6. **ListFolder** - List folder contents (os.scandir)
7. **GetFileInfo** - Get file metadata (os.stat)

#### **Security Features:**
- ✅ **API Key Authentication** - gRPC metadata: `api-key`
- ✅ **Path Whitelist** - Only allowed directories (`L:\system`, `L:\data`, etc.)
- ✅ **Audit Logging** - All operations logged (INFO/WARNING levels)
- ✅ **Path Validation** - Prevents directory traversal attacks
- ✅ **Error Handling** - Graceful failures with detailed error messages

#### **Communication:**
- **REST API (port 5801):** Health check, status endpoint
- **gRPC API (port 6801):** Main file operations (7 RPC methods)
- **Authentication:** API key in gRPC metadata
- **Response:** StatusResponse (success, message, error)

#### **Configuration (Pydantic Settings):**
```python
API_KEY = "lkern_dev_api_key_2024"  # Change in production!
ALLOWED_PATHS = ["L:\\system", "L:\\data", "C:\\Users\\PeterLuhový"]
LOG_LEVEL = "INFO"
REST_PORT = 5801
GRPC_PORT = 6801
```

#### **Startup:**
```cmd
cd services/lkms801-system-ops
pip install -r requirements.txt
compile-proto.bat
start-service.bat
```

**Success Criteria:**
- ✅ gRPC proto compiled (system_ops_pb2.py, system_ops_pb2_grpc.py)
- ✅ All 7 operations implemented and working
- ✅ API key authentication functional
- ✅ Path whitelist validation working
- ✅ Health check endpoint responding (GET /health)
- ✅ Comprehensive README (usage, setup, security, troubleshooting)
- ✅ Windows batch files for easy startup

**Use Cases:**
- Open project folders from web UI
- Copy/move generated reports to shared drives
- Delete temporary files from build processes
- List backup directories
- Get file sizes for upload validation

---

### **1.60 Issues Service Extended** ⏸️ PLANNED
**Dependencies:** 1.40 (Backend Infrastructure), 1.50 (Microservice Template)
**Estimated:** 35-45h (8-10 days) ↑ from 18-23h
**Target:** 2025-11-21 - 2025-12-02
**Ports:** 4105 (REST), 5105 (gRPC)
**Database:** lkms105_issues (PostgreSQL)
**Storage:** MinIO bucket: `lkern-issues`

📄 **Implementation Plan:** [docs/temp/part-02-issues-service-extended.md](../temp/part-02-issues-service-extended.md) (comprehensive)

**Role-Based Ticketing System with Extended Collaboration Features**

#### Key Features:
- 🎭 **Role-Based UI** - Dynamic forms based on user role (PROGRAMMER/USER/SCANNER)
- 🔢 **Human-Readable Codes** - BUG-00042, FEAT-00123, IMPR-00008, QUES-00015
- 📸 **File Attachments** - Screenshots, logs, PDFs (max 10MB, MinIO storage)
- 🐛 **Developer Fields** - error_message, browser, os, url (variant C only)
- 🏷️ **Rich Classification** - type + severity + category (optional)
- ✅ **No Auto-Actions** - No auto-assign, no auto-close (manual control)

#### **Extended Collaboration Features (NEW):**
- 📝 **Edit History Tracking** - Who created, who can edit, baseline + diff snapshots
- 👍 **"Affects Me Too" Voting** - Voting system with counter, prevent duplicates
- 💬 **Developer Q&A Comments** - Thread-based comments (max 2-level depth)
- 📢 **Broadcast Notifications** - Critical issue alerts to all users/teams
- 🔍 **Duplicate Detection** - AI-powered or full-text search similarity matching

**See Part 2 implementation plan for complete specifications.**

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

#### **1.60.2 Frontend** ⚠️ IN PROGRESS (80% complete, needs tests & docs)
**Status:** Functional but incomplete - many bugs, missing tests, missing documentation

- 🟡 **Issues Page** (`/issues`) - PARTIAL
  - ✅ FilteredDataGrid with basic columns
  - ✅ Filters: type, severity, status
  - ✅ Search by title/description
  - ⚠️ Role-based category column NOT implemented
  - ⚠️ Many bugs in filtering/sorting logic
  - ⚠️ Click → detail view NOT implemented

- 🟢 **IssueTypeSelectModal** ✅ COMPLETED (2025-11-09)
  - ✅ Two-step workflow (type selection → create form)
  - ✅ 4 issue types (BUG, FEATURE, IMPROVEMENT, QUESTION)
  - ✅ FormField + Select components (DRY compliance)
  - ✅ Translation support (SK/EN)

- 🟡 **CreateIssueModal** ✅ REFACTORED (2025-11-09) - needs tests
  - ✅ Role tabs (Basic/Standard/Advanced) - temporary until auth
  - ✅ Refactored to use FormField + Input + Select components
  - ✅ Real-time validation (Title: min 3 chars, Description: min 3 chars)
  - ✅ Type-based screenshot validation (required ONLY for BUG)
  - ✅ Browser context auto-population (browser, OS, URL, viewport, timestamp)
  - ✅ Conditional fields based on role/type
  - ⚠️ **Missing:** Component documentation (.md file)
  - ⚠️ **Missing:** Unit tests (0/20 created)
  - ⚠️ **Missing:** Integration tests (0/15 created)
  - ⚠️ **Missing:** CRUD tests (0/10 created)
  - ⚠️ **Missing:** Playwright E2E tests (0/5 created)

- ⏸�� **Issue Detail Modal** - NOT STARTED
  - Display all fields (role-based visibility)
  - Show attachments gallery (images preview, download links)
  - Show developer fields only if populated
  - Actions: Assign, Resolve, Close
  - Status transitions validation

- ⏸️ **File Upload Component** - NOT STARTED
  - Drag-and-drop support
  - Multiple file selection (max 5 files)
  - File type validation (images, PDFs, logs)
  - File size validation (max 10MB per file)
  - Upload progress indicator
  - Preview thumbnails for images

**⚠️ Known Issues:**
- Frontend has many bugs in filtering, sorting, validation
- No integration with backend API yet (mocked data)
- No file upload implementation
- No role-based permissions (using temporary tabs)
- Missing comprehensive test coverage
- **TODO:** Add `?role=user_basic` query parameter to GET `/issues/` endpoint for role-based data filtering (currently only POST has role parameter)
- **TODO:** Implement file download from MinIO attachments (Issues.tsx:876)
- **TODO:** Add toast notifications for CRUD operations (Issues.tsx:1542, 1545, 1569, 1572)
- **TODO:** Get assignee ID from auth context instead of hardcoded UUID (Issues.tsx:466)
- **TODO:** Lookup user name by ID when Contacts Service available (Issues.tsx:535)
- **TODO:** Replace mock contacts data with Contact Service API (IssueEditModal.tsx:192, 849)
- **TODO:** Re-enable per-field permissions when needed (IssueViewModal.tsx:249)
- **TODO:** Replace mock user data in AssignIssueModal with Contact/Employee service (AssignIssueModal.tsx:25)

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

#### **1.60.4 Manager Issue Dashboard** ⏸️ PLANNED
**Estimated:** 15-20h (4-5 days)

**Separate dashboard for managers to manage all issues across the organization**

- ⏸️ **Route:** `/dashboard/issues` (separate from user `/issues` page)
- ⏸️ **Kanban Board View:**
  - Columns: Open → Assigned → In Progress → Resolved → Closed
  - Drag & drop to change status
  - Visual indicators (priority colors, severity badges)
- ⏸️ **Bulk Operations:**
  - Bulk assign to team member
  - Bulk status change
  - Bulk priority update
- ⏸️ **Team Management:**
  - Filter by assignee/team
  - Workload distribution view
  - Unassigned issues queue
- ⏸️ **Statistics Panel:**
  - Open/closed ratio
  - Average resolution time
  - Issues by type/severity charts
  - Trend over time
- ⏸️ **Permissions:**
  - Only accessible to Manager+ roles (permission level ≥50)
  - Edit all issues (not just own)
  - Assign to any team member

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

**🔗 Integration Prepared (v8.9.0):**
- ✅ `useEntityLookup` hook - Universal service fetch with health check, caching, retry
- ✅ Mock ContactsService API - Ready to replace with real API when service is built
- ✅ Issues Service integration - People section shows contact name + position
- ⏸️ Remaining: Build actual service, replace mock with real API endpoints

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

#### Integration Requirements (Cross-Service Dependencies):

**🔗 Frontend Integration Hooks:**
- ⏸️ **useGrpcService hook** - First gRPC hook for frontend (gRPC-web client)
  - Required for: Contact lookup in Issues (assignee_id → contact info)
  - Pattern: Health check → gRPC call → error handling (unavailable, notFound)
  - Implementation: packages/config/src/hooks/useGrpcService/
  - Note: useServiceFetch (REST version) already exists, gRPC version needed

**🔗 Issues Service Integration:**
- ⏸️ **Assignee Contact Lookup** - IssueViewModal needs contact info
  - Field: `assignee_id` (UUID) → Contact name, work position, avatar
  - Workflow: Check Contact Service health → Fetch contact → Handle errors
  - Error states: Service unavailable (503), Contact not found (404/deleted)
  - UI: Show assignee name + position, fallback to "Unknown" if service down

**🔗 Universal Service Fetch Pattern:**
Already implemented in `useServiceFetch` hook (packages/config/src/hooks/useServiceFetch/):
- Health check before data fetch
- Status states: idle, checking, unavailable, loading, success, notFound, error
- Pre-defined service configs (SERVICES.contacts, SERVICES.issues, etc.)
- TODO: Add gRPC version for services that prefer gRPC over REST

---

### **1.80 Configuration Service** ⏸️ PLANNED
**Dependencies:** 1.50 complete (uses microservice template), 1.70 complete (Contact Service - countries)
**Estimated:** 24-36h (4-5 days)
**Target:** 2025-11-25 - 2025-11-30 (parallel with 1.70)
**Ports:** 4199 (REST), 5199 (gRPC)
**Database:** lkms199_config
**Implementation Plan:** [docs/temp/config-service-implementation-plan.md](../temp/config-service-implementation-plan.md)

**Shared regulatory and global configuration data (VAT rates, exchange rates, travel allowances, meal deductions, global settings, analytics settings)**

**Scope:**
- ✅ VAT/Tax rates (SK/CZ/PL) - Used by Sales Service
- ✅ Exchange rates (ECB integration) - Used by Sales, Purchasing, Finance
- ✅ Travel allowances (domestic + foreign 27 countries) - Used by Sales, HR, Finance
- ✅ Meal deductions - Used by HR, Finance
- ✅ Global settings (company info, defaults, timezone configuration) - Used by all services
- ✅ Analytics settings (usePageAnalytics configuration) - Used by frontend
- ⏸️ Timezone configuration (UTC offset, DST handling) - Used by all services for timestamp display
- ❌ NOT in scope: Chart of Accounts (→ Finance Service), Accounting Periods (→ Finance Service), Document Numbering (→ each service owns), Countries (→ Contact Service MDM)

**Key Design:**
- Centralized ConfigurationPage UI with 8 tabs (distributed backend calls)
- No cross-service foreign keys (ISO codes only)
- Frontend joins country names via Contact Service API
- Read-heavy service (no Kafka events)

#### **1.80.1 Database & Core Backend** (6-8h)
- ⏸️ Create database lkms199_config
- ⏸️ Create 7 tables: vat_codes, exchange_rates, travel_allowances_domestic, travel_allowances_foreign, meal_deductions, global_settings, analytics_settings
- ⏸️ Seed initial data (VAT SK/CZ/PL, travel allowances, meal deductions)
- ⏸️ Implement SQLAlchemy models + Pydantic schemas
- ⏸️ Implement repositories (data access layer)
- ⏸️ 30 backend tests

#### **1.80.2 REST API Endpoints** (4-6h)
- ⏸️ Implement all REST API routes (/api/v1/vat-codes, /exchange-rates, /travel-allowances/*, /meal-deductions, /settings, /analytics-settings)
- ⏸️ Implement business logic in service layer
- ⏸️ Implement ECB integration for exchange rates
- ⏸️ Add input validation and error handling
- ⏸️ 15 API endpoint tests
- ⏸️ OpenAPI/Swagger documentation

#### **1.80.3 gRPC API** (3-4h)
- ⏸️ Define protobuf schema (config_service.proto)
- ⏸️ Implement gRPC servicers
- ⏸️ 5 gRPC tests

#### **1.80.4 Docker & Deployment** (2-3h)
- ⏸️ Create Dockerfile
- ⏸️ Add to docker-compose.yml
- ⏸️ Configure environment variables
- ⏸️ Verify REST (4199) + gRPC (5199) ports accessible

#### **1.80.5 Frontend - ConfigurationPage Structure** (3-4h)
- ⏸️ Create ConfigurationPage component with tabs
- ⏸️ Implement 8 tab sections: VAT & Tax, Chart of Accounts (placeholder), Travel Allowances, Meal Deductions, Exchange Rates, Accounting Periods (placeholder), Global Settings, Analytics
- ⏸️ Add routing (/configuration)
- ⏸️ Add navigation menu item
- ⏸️ 3 page structure tests

#### **1.80.6 Frontend - Sections Implementation** (4-6h)
- ⏸️ Implement VATTaxSection (forms + table)
- ⏸️ Implement TravelAllowancesSection (domestic + foreign)
- ⏸️ Implement MealDeductionsSection
- ⏸️ Implement ExchangeRatesSection (ECB sync button)
- ⏸️ Implement GlobalSettingsSection
- ⏸️ Implement AnalyticsSection (usePageAnalytics configuration)
- ⏸️ Create shared components (CountrySelector, ConfigurationCard)
- ⏸️ Implement useConfigurationService hook (API calls)
- ⏸️ Implement useCountryNames hook (Contact Service join)
- ⏸️ 12 frontend tests

#### **1.80.7 Translation Keys & Documentation** (2-3h)
- ⏸️ Add translation keys to packages/config/src/translations/types.ts
- ⏸️ Add Slovak translations (sk.ts) - 60+ keys
- ⏸️ Add English translations (en.ts) - 60+ keys
- ⏸️ Test language switching
- ⏸️ Create service README.md

#### Success Criteria:
- ✅ All 7 database tables created and seeded
- ✅ 50 backend tests passing (100% coverage)
- ✅ All REST API endpoints functional
- ✅ All gRPC methods functional
- ✅ ECB exchange rate sync working
- ✅ Docker container running and accessible
- ✅ ConfigurationPage with 8 tabs accessible at /configuration
- ✅ 6 active sections functional (VAT, Travel, Meals, Exchange, Global, Analytics)
- ✅ 2 placeholder sections (COA, Accounting Periods) display "Available after Finance Service"
- ✅ Country names joined from Contact Service API
- ✅ 65 total tests passing (50 backend + 15 frontend)
- ✅ All text uses translations (no hardcoded strings)
- ✅ Code follows coding-standards.md (DRY, no hardcoded values)

---

### **1.90 System Health, Backup & Cleanup API** ⏸️ PLANNED
**Dependencies:** 1.70, 1.80 complete
**Estimated:** 5-7h
**Target:** 2025-12-02 - 2025-12-03

#### **1.90.1 Health Monitoring**
- ⏸️ GET /api/v1/system/health

#### **1.90.2 Backup Management**
- ⏸️ POST /api/v1/system/backup
- ⏸️ GET /api/v1/system/backup/status

#### **1.90.3 Deletion Cleanup Service** (3-4h)
**Purpose:** Retry pending deletions when MinIO unavailable during hard delete

**Why this is needed (Phase 1 foundation):**
- ✅ Eventual Deletion Pattern implemented in Issues Service (2025-11-27)
- ✅ When MinIO unavailable → Item marked with `deletion_audit_id` (status=PENDING)
- ✅ REST endpoints exist: GET /cleanup/pending, POST /cleanup/retry, POST /cleanup/retry/{id}
- ⏸️ Need automated retry mechanism (cron job)

**Implementation:**
- ⏸️ **Cron Job Container:** `lkern-cleanup-cron` (Alpine + curl)
- ⏸️ **Schedule:** Daily at 02:00 (after backup at 01:00)
- ⏸️ **Logic:**
  1. Call GET /cleanup/pending for each microservice
  2. If pending items found → Call POST /cleanup/retry
  3. Log results to cleanup.log
  4. On failure after 5 retries → Alert (Phase 2: Slack/Email)
- ⏸️ **Docker Compose:** Add cleanup-cron service
- ⏸️ **Environment:** CLEANUP_SERVICES=lkms105-issues,lkms101-contacts,...

**Endpoints per microservice (already implemented pattern):**
```
GET  /cleanup/pending        - List pending deletions
POST /cleanup/retry          - Retry all pending
POST /cleanup/retry/{id}     - Retry specific deletion
```

**Workflow:**
```
02:00 Daily → Cron triggers
  → For each service in CLEANUP_SERVICES:
    → GET http://{service}:port/cleanup/pending
    → If count > 0:
      → POST http://{service}:port/cleanup/retry
      → Log: "Service X: Y items retried, Z succeeded, W failed"
  → Summary log: "Cleanup complete: Total X items processed"
```

**Audit Record Retention (cleanup old audit logs):**
- ⏸️ **PENDING:** Never delete (waiting for cleanup to complete)
- ⏸️ **COMPLETED:** Delete after 90 days (historical, no longer needed)
- ⏸️ **FAILED/PARTIAL:** Delete after 180 days (longer for investigation)
- ⏸️ **Endpoint:** DELETE /cleanup/audit?older_than=90&status=completed
- ⏸️ **Schedule:** Weekly (Sunday 03:00) - after daily cleanup

**Workflow for audit cleanup:**
```
03:00 Sunday → Audit retention cleanup
  → For each service:
    → DELETE completed audits older than 90 days
    → DELETE failed/partial audits older than 180 days
  → Log: "Audit cleanup: X completed, Y failed/partial removed"
```

**Success Criteria:**
- ✅ Cron job runs daily at 02:00 (pending deletions retry)
- ✅ Cron job runs weekly Sunday 03:00 (audit record cleanup)
- ✅ All services with deletion_audit support are called
- ✅ Pending deletions retried automatically
- ✅ Old audit records cleaned up per retention policy
- ✅ Results logged to /var/log/lkern/cleanup.log
- ✅ Failed items remain in PENDING status for next retry

**Note:** This is simplified Phase 1 approach. Phase 2 (Task 2.07) will add Celery workers, exponential backoff, and alerting.

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

### **1.155 Calendar Service** ⏸️ PLANNED (NEW)
**Dependencies:** 1.150 complete, Authentication (1.200) for user context
**Estimated:** 40-50h (10-12 days)
**Target:** 2026-01-17 - 2026-01-28
**Ports:** 4806 (REST), 5806 (gRPC)
**Database:** lkms806_calendar

📄 **Implementation Plan:** [docs/temp/part-06-calendar-service.md](../temp/part-06-calendar-service.md)

**Office 365-Like Calendar System with Event Management**

#### Key Features:
- 📅 **Multiple Calendars** - Personal, Work, Project-specific per user
- 🔄 **Recurring Events** - Daily, weekly, monthly, yearly with RRULE (RFC 5545)
- 👥 **Meeting Invitations** - RSVP system (Accept/Decline/Tentative)
- 🔗 **Calendar Sharing** - Granular permissions (READ, WRITE, ADMIN)
- 📤 **iCal/ICS Support** - Import/export events (RFC 5545 compliant)
- ⏰ **Reminders** - Configurable notifications before events
- 🌍 **Time Zone Support** - Proper handling of different time zones
- 🎨 **Drag-and-Drop** - Visual event rescheduling (frontend)
- ⚠️ **Conflict Detection** - Prevent double-booking

#### **1.155.1 Backend (25-30h)**
- ⏸️ Generate from template: `scripts/microservice-generator/generate-microservice.js`
- ⏸️ Database Tables:
  - `calendars` (owner, type, color, visibility)
  - `calendar_events` (title, start/end, recurrence_rule, status)
  - `event_attendees` (RSVP status, notifications)
  - `calendar_shares` (permission levels)
- ⏸️ REST API: 25+ endpoints (calendars, events, RSVPs, sharing)
- ⏸️ Recurring Events: RRULE parser (python-dateutil)
- ⏸️ iCal/ICS Export/Import (RFC 5545)
- ⏸️ 50+ backend tests

#### **1.155.2 Frontend (15-20h)**
- ⏸️ CalendarView component (month/week/day views)
- ⏸️ EventCreateModal with recurrence builder
- ⏸️ Meeting invitation workflow
- ⏸️ Drag-and-drop rescheduling
- ⏸️ 40+ translation keys (SK/EN)

**Success Criteria:**
- ✅ All calendar operations working (create, read, update, delete)
- ✅ Recurring events expanding correctly
- ✅ Meeting invitations with RSVP functional
- ✅ iCal/ICS import/export working
- ✅ Calendar sharing with permissions working
- ✅ 90+ tests passing (50+ backend + 40+ frontend)

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
- ⏸️ **Configuration Page Updates:**
  - Replace "Chart of Accounts" placeholder with functional ChartOfAccountsSection (API calls to Finance Service)
  - Replace "Accounting Periods" placeholder with functional AccountingPeriodsSection (API calls to Finance Service)
  - Update ConfigurationPage tabs to call Finance Service endpoints

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
**Estimated:** 28-33h (7-8 days) ↑ Updated from 25-30h (+3h for Trans component)
**Target:** 2026-02-27 - 2026-03-05
**Ports:** 4107 (REST), 5107 (gRPC)
**Database:** lkms107_auth

**🚨 TEMPORARY AUTH STRATEGY (Until 1.200 is complete):**
- **Frontend:** Mock `useAuth()` hook returns hardcoded admin user
  - Location: `packages/config/src/hooks/useAuth/useAuth.ts`
  - Returns: `{ user: { role: 'admin' }, hasPermission() }` (always returns true for admin)
  - Purpose: Enable permission-based UI features (disable delete buttons, etc.)
- **Backend Microservices:** NO authentication yet - accept all requests
  - All endpoints currently public (no JWT validation)
  - Rate limiting and security will be added in Phase 1.200
- **Migration Plan:**
  - Replace mock `useAuth()` with real implementation (read JWT from localStorage)
  - Add JWT validation middleware to all microservices
  - Update all API calls to include `Authorization: Bearer <token>` header

#### **1.200.1 Backend (12-15h)**
- ⏸️ Copy from template
- ⏸️ User model, JWT, bcrypt, RBAC
- ⏸️ REST + gRPC APIs
- ⏸️ JWT token generation and validation
- ⏸️ Shared auth middleware for other microservices

#### **1.200.2 Translation Infrastructure - `<Trans>` Component (3-4h)** ⭐ NEW
**Why now:** Authentication pages require legal texts with embedded links (GDPR consent, Terms of Service, Privacy Policy). The `<Trans>` component enables React components inside translated strings without XSS risks.

**Implementation:**
- ⏸️ **Create `<Trans>` component** (~50 lines)
  - File: `packages/config/src/translations/Trans.tsx`
  - Support tags: `<link>`, `<strong>`, `<email>`, `<button>`
  - Parse translation text and replace tags with React components
  - Preserve type safety (TypeScript integration)
- ⏸️ **Add unit tests**
  - File: `packages/config/src/translations/Trans.test.tsx`
  - Test cases: link interpolation, multiple components, nested tags, parameter replacement
  - Coverage: 100% (basic parsing, edge cases)
- ⏸️ **Add translation keys for authentication**
  - `auth.login.*` - Login page (15 keys)
    - Example: `forgotPassword: "Forgot password? <link>Reset it here</link>"`
  - `auth.register.*` - Registration page (20 keys)
    - Example: `termsAccept: "I agree to <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>"`
  - `auth.passwordReset.*` - Password reset (10 keys)
    - Example: `emailSent: "Reset link sent to <email>{{userEmail}}</email>"`
  - `auth.legal.*` - Legal texts (GDPR, terms, privacy)
- ⏸️ **Update documentation**
  - File: `docs/programming/coding-standards.md`
  - Add section: "Translation System - React Component Interpolation"
  - Examples: When to use `<Trans>` vs `t()`, type safety, security notes
  - Export from `packages/config/src/index.ts`

**Use cases:**
```tsx
// Login page - Forgot password link
<Trans
  i18nKey="auth.login.forgotPassword"
  components={{ link: <Link to="/auth/reset" /> }}
/>
// Output: "Forgot password? <Link>Reset it here</Link>"

// Registration - Legal consent
<Trans
  i18nKey="auth.register.legalConsent"
  components={{
    terms: <Link to="/legal/terms" />,
    privacy: <Link to="/legal/privacy" />,
    gdpr: <Link to="/legal/gdpr" />
  }}
/>
// Output: "I agree to <Link>Terms</Link>, <Link>Privacy Policy</Link>, and <Link>GDPR</Link>"

// Password reset - Email confirmation
<Trans
  i18nKey="auth.passwordReset.emailSent"
  values={{ userEmail: email }}
  components={{ email: <strong className={styles.highlight} /> }}
/>
// Output: "Reset link sent to <strong>user@example.com</strong>"
```

#### **1.200.3 Frontend (13-14h)** ↑ Updated from 1.200.2
- ⏸️ **Login page** with `<Trans>` for links
  - Forgot password link using `<Trans>`
  - Registration link using `<Trans>`
  - Error messages with support links
- ⏸️ **Registration form** with GDPR consent
  - Checkbox with legal links: Terms, Privacy, GDPR
  - All legal texts use `<Trans>` component
  - Email verification message with formatted email
- ⏸️ **Password reset flow** with email formatting
  - Reset request page with `<Trans>` for instructions
  - Email sent confirmation with highlighted email address
  - Success message with login link
- ⏸️ **Auth context + protected routes**
- ⏸️ **Replace mock `useAuth()`** with real implementation
- ⏸️ **Token storage** (localStorage) and refresh logic

**Success Criteria:**
- ✅ `<Trans>` component functional and tested (100% coverage)
- ✅ Login page: "Forgot password? <link>Click here</link>" renders correctly
- ✅ Registration page: GDPR consent with 3 clickable links (Terms, Privacy, GDPR)
- ✅ Password reset: Email address highlighted with `<email>` tag
- ✅ Zero `dangerouslySetInnerHTML` usage in authentication pages
- ✅ All legal texts use `<Trans>` (no hardcoded HTML)
- ✅ 45+ translation keys (SK/EN) for complete auth flow
- ✅ Type safety: `i18nKey` prop has IntelliSense autocomplete
- ✅ Documentation updated with `<Trans>` usage examples
- ✅ JWT authentication working (login, logout, token refresh)
- ✅ Protected routes redirect to login when unauthenticated

**⚠️ Mock Auth TODO (to be replaced when 1.200 complete):**
- **TODO:** Replace mock `useAuth()` hook (useAuth.ts:44) with real JWT authentication
- **TODO:** Replace mock `AuthContext` (AuthContext.tsx:168, 275) with real auth provider
- **TODO:** Remove `AuthRoleSwitcher` component (AuthRoleSwitcher.tsx:53) - dev-only component
- **TODO:** Update `isAuthenticated: true` hardcoded value (AuthContext.tsx:275) with real check
- **TODO:** Replace mock contacts service (contactsService.ts:21-23, 54, 110) with real API calls

---

### **1.204 Realtime Gateway Service (LKMS808)** ⏸️ PLANNED (OPTIONAL - NOT REQUIRED FOR MVP)
**Dependencies:** 1.200 complete (Authentication required for WebSocket auth)
**Estimated:** 15-20h (4-5 days)
**Target:** TBD (after MVP stabilization)
**Ports:** 4808 (REST + WebSocket), 5808 (gRPC), 6379 (Redis shared with 1.205)
**Database:** None (stateless gateway)

📄 **Implementation Plan:** To be created in `docs/temp/part-08-realtime-gateway.md`

**⚠️ OPTIONAL SERVICE - NOT BLOCKING MVP:**
This service enables real-time notifications across the system but is NOT required for initial production deployment. Priority is Orders and Price Quotes (Task 1.140 Sales Service).

**Centralized WebSocket Gateway with Redis Pub/Sub**

#### Key Features:
- 🔌 **Single WebSocket Endpoint** - All clients connect to one gateway
- 📡 **Redis Pub/Sub** - Microservices publish events, gateway broadcasts to clients
- 🔐 **JWT Authentication** - WebSocket connections authenticated via token
- 🏷️ **Topic Subscriptions** - Clients subscribe to specific topics (e.g., `issues.{id}`)
- 📊 **Connection Management** - Track connected users, heartbeat, reconnection
- 🔄 **Horizontal Scaling** - Multiple gateway instances via Redis coordination

#### Architecture:
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Issues Service │     │  Sales Service  │     │ Other Services  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │ Redis Pub/Sub         │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Redis (Pub/Sub Channel)                      │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
                          ┌───────────▼───────────┐
                          │  Realtime Gateway     │
                          │  (WebSocket Server)   │
                          └───────────┬───────────┘
                                      │ WebSocket
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
         ┌─────────┐             ┌─────────┐             ┌─────────┐
         │ Browser │             │ Browser │             │ Browser │
         │ Client  │             │ Client  │             │ Client  │
         └─────────┘             └─────────┘             └─────────┘
```

#### Use Cases:
- 🔓 **Pessimistic Lock Notifications** - User gets notified when force-unlocked
- 💬 **Chat Messages** - Real-time message delivery (used by 1.205 Messaging)
- 📋 **Issue Updates** - Status changes, new comments in real-time
- 📦 **Order Status** - Customer sees order progress live
- 🔔 **System Notifications** - Broadcast alerts, maintenance windows

#### **1.204.1 Backend (10-14h)**
- ⏸️ FastAPI WebSocket server with JWT auth
- ⏸️ Redis Pub/Sub subscriber (listen to all `lkern.*` events)
- ⏸️ Topic routing (parse event type → broadcast to subscribed clients)
- ⏸️ Connection registry (userId → WebSocket connections)
- ⏸️ Health check endpoint
- ⏸️ 25+ backend tests

#### **1.204.2 Frontend (5-6h)**
- ⏸️ `useRealtimeConnection` hook (connect, reconnect, heartbeat)
- ⏸️ `useRealtimeSubscription` hook (subscribe to topics)
- ⏸️ Integration with existing Toast system for notifications
- ⏸️ 15+ translation keys (SK/EN)

**Success Criteria:**
- ✅ WebSocket connections authenticated via JWT
- ✅ Redis Pub/Sub receiving events from microservices
- ✅ Clients receive events for subscribed topics
- ✅ Automatic reconnection on connection loss
- ✅ 40+ tests passing (25+ backend + 15+ frontend)

**📝 TODO - Return to Issues Service (Task 1.60):**
After implementing this gateway, return to Issues Service to add:
- Force unlock notifications (when superadmin unlocks a record)
- User modal automatically disabled + toast notification
- Update `SectionEditModal` to subscribe to `issues.{id}.unlocked` topic

**📝 TODO - Locking UX Phase 2 (after WebSocket):**
When WebSocket Gateway is ready, enhance locking UX:
- Real-time notification via WebSocket when force-unlocked
- Side-by-side comparison modal (user's draft vs server state)
- "Copy my changes" button to preserve user's work
- Option to re-acquire lock after viewing server changes
- Current Phase 1: 409 conflict on Save → read-only mode + toast

---

### **1.205 Messaging Service** ⏸️ PLANNED (NEW)
**Dependencies:** 1.200 complete, 1.204 optional (can share Redis)
**Estimated:** 30-40h (7-10 days)
**Target:** 2026-03-06 - 2026-03-15
**Ports:** 4807 (REST + WebSocket), 5807 (gRPC), 6379 (Redis)
**Database:** lkms807_messaging

📄 **Implementation Plan:** [docs/temp/part-07-messaging-service.md](../temp/part-07-messaging-service.md)

**Real-Time Chat System with WebSocket and Redis Pub/Sub**

#### Key Features:
- 💬 **Direct Messages** - 1-on-1 chat channels
- 👥 **Group Channels** - Multi-user team conversations
- 🔴 **Real-Time WebSocket** - Bidirectional instant messaging
- ⌨️ **Typing Indicators** - "User is typing..." with 5-second TTL
- ✔️ **Read Receipts** - Track message read status
- 📜 **Message History** - Persistent storage with pagination
- 📎 **File Attachments** - Share files in conversations (future phase)
- 🔄 **Redis Pub/Sub** - Horizontal scaling across multiple servers

#### **1.205.1 Backend (18-24h)**
- ⏸️ Generate from template
- ⏸️ Database Tables:
  - `channels` (DIRECT, GROUP types)
  - `channel_members` (group membership)
  - `messages` (text, attachments, reply threading)
  - `message_read_receipts` (read tracking)
- ⏸️ WebSocket Server: FastAPI WebSocket + JWT auth
- ⏸️ Redis Pub/Sub: Message distribution across servers
- ⏸️ REST API: 10+ endpoints (channels, messages, read receipts)
- ⏸️ Typing indicators (Redis TTL 5s)
- ⏸️ 45+ backend tests

#### **1.205.2 Frontend (12-16h)**
- ⏸️ ChatWindow component (message list + input)
- ⏸️ WebSocket integration (send/receive messages)
- ⏸️ Typing indicators display
- ⏸️ Read receipts display
- ⏸️ Message history pagination
- ⏸️ 30+ translation keys (SK/EN)

**Success Criteria:**
- ✅ WebSocket connections authenticated via JWT
- ✅ Direct messages working (1-on-1 channels)
- ✅ Group channels working (multi-user)
- ✅ Real-time message delivery via Redis Pub/Sub
- ✅ Typing indicators functional (5-second TTL)
- ✅ Read receipts tracking working
- ✅ 75+ tests passing (45+ backend + 30+ frontend)

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

**Goal:** Harden security, fix bugs, stabilize for production, add advanced features
**Start:** After Phase 1 complete (target: Apr 2026)
**Progress:** 0/12 tasks (~0%, includes 2.05 optional)
**Status:** ⏸️ PLANNED

---

### **2.01 Event Store + Blockchain Microservice** ⏸️ PLANNED (NEW)
**Dependencies:** All Phase 1 services complete (needs event consumers from all services)
**Estimated:** 120-150h (30-37 days) ↑ Updated from 80-100h
**Target:** Apr 2026 (Phase 2 start)
**Ports:** 4901 (REST), 5901 (gRPC), 7050 (Orderer), 7051 (Peer)
**Database:** Hyperledger Fabric + PostgreSQL

📄 **Implementation Plan:** [docs/temp/part-03-event-store-blockchain.md](../temp/part-03-event-store-blockchain.md)

⚠️ **Testing Strategy Required:** Before implementation, define:
- Unit tests (hash chain, CRUD operations, data anonymization)
- Integration tests (Kafka consumer, blockchain invocation, GDPR deletion)
- E2E tests (complete audit trail workflow, integrity verification)
- Manual testing checklist (blockchain health, event archival, access control)

**Immutable Audit Trail with GDPR-Compliant 3-Database Architecture**

**Why estimate increased:**
- Hyperledger Fabric complexity (certificate management, chaincode deployment)
- Learning curve (+30h for first-time setup)
- Debugging time (crypto issues, network configuration)
- Security & Honeypot layer implementation (+20h, see Part 3 section 3.7)

#### Key Features:
- ⛓️ **Hyperledger Fabric Blockchain** - Private blockchain for audit trail (NO PII)
- 🗄️ **3-Database Pattern** - DB1 (blockchain metadata), DB2 (deletable PII), DB3 (query layer)
- 📡 **Kafka Consumer** - Archives ALL events from all microservices
- 🔒 **GDPR Compliant** - Blockchain stores ONLY IDs/timestamps, PII in deletable DB2
- 🔗 **Hash Chain Integrity** - SHA-256 tamper detection
- 🔍 **Audit Trail API** - Query complete history with access control
- 🛡️ **Security & Honeypot Layer** - Tamper detection, fake endpoints, behavioral monitoring
- ⏳ **Event Retention** - Configurable policies for data lifecycle

#### **2.01.1 Hyperledger Fabric Setup (35-45h)** ↑ Updated from 20-25h
- ⏸️ Install Hyperledger Fabric 2.5 binaries
- ⏸️ Generate crypto materials (certificates, keys)
- ⏸️ Docker containers: Orderer, Peer, CouchDB, CA
- ⏸️ Create channel: lkern-audit-channel
- ⏸️ Deploy chaincode (lkern-event-store) in Go
- ⏸️ Test chaincode invocation/query
- ⏸️ Debugging & troubleshooting (crypto, network issues)
- ⏸️ Learning curve buffer (+15h)

#### **2.01.2 Database Setup (12-15h)** ↑ Updated from 10-12h
- ⏸️ DB2 (PostgreSQL): sensitive_event_payloads table
- ⏸️ DB3 (PostgreSQL): audit_trail_view materialized view
- ⏸️ Schedule REFRESH MATERIALIZED VIEW (every 5 min)
- ⏸️ Security tables: honeypot_events, suspicious_user_flags, security_logs

#### **2.01.3 Kafka Consumer (18-25h)** ↑ Updated from 15-20h
- ⏸️ Subscribe to ALL microservice topics (lkern.*.events)
- ⏸️ Extract metadata (NO PII) for blockchain
- ⏸️ Store full payload in DB2 (with PII)
- ⏸️ Invoke chaincode to store in blockchain (DB1)
- ⏸️ Error handling & retry logic

#### **2.01.4 REST API (20-25h)** ↑ Updated from 15-18h
- ⏸️ GET /api/audit-trail/{entity_type}/{entity_id} (with access control)
- ⏸️ POST /api/audit-trail/verify-integrity
- ⏸️ GET /api/blockchain/stats
- ⏸️ Fake endpoints (tamper detection - PUT/DELETE)
- ⏸️ Honeypot redirection middleware

#### **2.01.5 Security & Honeypot Layer (20-25h)** NEW
- ⏸️ Honeypot database & fake data generator
- ⏸️ Suspicious user flagging system
- ⏸️ Behavioral analysis (Celery background job)
- ⏸️ Silent alerting (email/Slack webhooks)
- ⏸️ Security dashboard (web-ui page)

#### **2.01.6 GDPR Compliance (15-18h)** ↑ Updated from 10-13h
- ⏸️ GDPR deletion consumer (*.gdpr_deleted events)
- ⏸️ Soft delete in DB2, blockchain unchanged
- ⏸️ Aggregation view returns payload=NULL for deleted
- ⏸️ Testing GDPR workflows

**Success Criteria:**
- ✅ Hyperledger Fabric running (Orderer, Peer, CouchDB)
- ✅ Chaincode deployed and functional
- ✅ Kafka consumer archiving events from all services
- ✅ 3-database architecture working (DB1 + DB2 + DB3)
- ✅ Audit trail API with access control
- ✅ GDPR deletion workflow functional
- ✅ Hash chain integrity verification working

---

### **2.02 Temporal Analytics Service** ⏸️ PLANNED (NEW)
**Dependencies:** 2.01 complete (Event Store data source)
**Estimated:** 60-80h (15-20 days)
**Target:** May 2026
**Ports:** 4902 (REST), 5902 (gRPC)
**Database:** PostgreSQL + TimescaleDB

📄 **Implementation Plan:** [docs/temp/part-04-temporal-analytics.md](../temp/part-04-temporal-analytics.md)

⚠️ **Testing Strategy Required:** Before implementation, define timeline reconstruction tests (accuracy, performance), cache tests (hit rate, staleness), rate limiting tests (concurrent jobs, queue overflow), external events integration tests.

**Time-Travel Queries and Timeline Reconstruction**

#### Key Features:
- ⏮️ **Time-Travel Queries** - "Show me entity state on 2025-10-15"
- 📅 **On-Demand Reconstruction** - User-triggered, not real-time
- ⏱️ **TimescaleDB Caching** - Performance-optimized time-series storage
- 🔄 **Background Jobs** - Celery workers for timeline reconstruction
- 🎚️ **Timeline Slider** - Interactive UI for browsing history
- 📊 **Historical Analysis** - Trend analysis across entities

#### **2.02.1 TimescaleDB Setup (10-12h)**
- ⏸️ Install TimescaleDB extension
- ⏸️ Create temporal_cache hypertable (partitioned by time)
- ⏸️ Create timeline_jobs table (job queue)
- ⏸️ Configure data retention policies

#### **2.02.2 Background Jobs (20-25h)**
- ⏸️ Set up Celery worker with Redis broker
- ⏸️ Implement reconstruct_timeline task
- ⏸️ Generate timestamps (hourly/daily/weekly/on_change)
- ⏸️ Reconstruct state from events (baseline + diffs)
- ⏸️ Cache results in TimescaleDB

#### **2.02.3 REST API (15-18h)**
- ⏸️ POST /api/timeline/reconstruct (trigger job)
- ⏸️ GET /api/timeline/jobs/{job_id} (job status)
- ⏸️ GET /api/timeline/{entity_type}/{entity_id} (cached timeline)
- ⏸️ GET /api/timeline/{entity_type}/{entity_id}/at/{timestamp} (time-travel)

#### **2.02.4 Frontend (10-13h)**
- ⏸️ TimelineSlider component (React + D3.js)
- ⏸️ Job status polling
- ⏸️ Visual timeline with change indicators

#### **2.02.5 Event Store Integration (5-7h)**
- ⏸️ EventStoreClient (query events from lkms901)
- ⏸️ Parse baseline + diff events

**Success Criteria:**
- ✅ TimescaleDB hypertable created
- ✅ Background jobs reconstructing timelines
- ✅ Time-travel queries working
- ✅ Timeline slider UI functional
- ✅ Performance acceptable (< 5s for 1-month timeline)

---

### **2.03 Graph Visualization Service** ⏸️ PLANNED (NEW)
**Dependencies:** 2.02 complete
**Estimated:** 40-50h (10-12 days)
**Target:** June 2026
**Ports:** 4903 (REST), 5903 (gRPC), 7474 (Neo4j HTTP), 7687 (Neo4j Bolt)
**Database:** Neo4j 5.x

📄 **Implementation Plan:** [docs/temp/part-05-graph-visualization.md](../temp/part-05-graph-visualization.md)

⚠️ **Testing Strategy Required:** Before implementation, define Neo4j sync tests (Kafka to graph lag, CRUD operations), graph query tests (shortest path, centrality algorithms), visualization tests (D3.js rendering, performance with large graphs), data consistency tests.

**Organizational Hierarchies and Relationship Networks**

#### Key Features:
- 🏢 **Organizational Hierarchy** - Company → Departments → Teams → Employees
- 🤝 **Contact Networks** - Who knows whom, collaboration history
- 🔧 **Manufacturing Graphs** - BOM tree, part dependencies
- 📊 **D3.js Visualization** - Interactive drag-and-drop graphs
- 🔍 **Graph Queries** - Shortest path, centrality, clustering

#### **2.03.1 Neo4j Setup (8-10h)**
- ⏸️ Install Neo4j 5.x (Docker)
- ⏸️ Create node labels (Company, Department, Team, Employee, Contact, Product, Component)
- ⏸️ Create relationships (BELONGS_TO, REPORTS_TO, KNOWS, REQUIRES)
- ⏸️ Set up indexes

#### **2.03.2 Data Synchronization (12-15h)**
- ⏸️ Kafka consumer for entity sync to Neo4j
- ⏸️ Handle entity.created → CREATE node
- ⏸️ Handle entity.updated → UPDATE properties
- ⏸️ Handle entity.deleted → DELETE node

#### **2.03.3 REST API (12-15h)**
- ⏸️ GET /api/graph/organization/{company_id} (org chart)
- ⏸️ GET /api/graph/contacts/{contact_id}/network (relationship network)
- ⏸️ GET /api/graph/bom/{product_id} (BOM tree)
- ⏸️ POST /api/graph/shortest-path (find path between entities)

#### **2.03.4 Frontend (8-10h)**
- ⏸️ GraphVisualization component (D3.js + React)
- ⏸️ Force-directed layout
- ⏸️ Drag, zoom, pan interactions

**Success Criteria:**
- ✅ Neo4j running and syncing data from Kafka
- ✅ Organizational hierarchy queries working
- ✅ Contact network visualization functional
- ✅ BOM tree rendering correctly
- ✅ Interactive D3.js graphs working

---

### **2.04 Dashboard Microservice (Phase 2)** ⏸️ PLANNED (NEW)
**Dependencies:** 2.03 complete, all Phase 1 services for data aggregation
**Estimated:** 50-60h (12-15 days)
**Target:** July 2026
**Ports:** 4904 (REST), 5904 (gRPC)
**Database:** PostgreSQL + Redis (caching)

📄 **Implementation Plan:** [docs/temp/part-08-dashboard-microservice.md](../temp/part-08-dashboard-microservice.md) (Phase 2 sections)

⚠️ **Testing Strategy Required:** Before implementation, define data aggregation tests (gRPC client calls, cache invalidation), widget tests (KPI calculations, chart rendering), layout tests (drag-and-drop, save/load), performance tests (multi-service query latency).

**Multi-Service Data Aggregation Dashboards**

#### Key Features:
- 📊 **KPI Widgets** - Issues, Sales, Inventory, HR metrics
- 🔄 **Real-Time Updates** - WebSocket push, auto-refresh every 30s
- 📐 **Custom Layouts** - Drag-and-drop widget positioning (react-grid-layout)
- 👥 **Role-Based Templates** - Executive, Sales Manager, Inventory Manager, HR Manager
- 📈 **Charts** - Line, bar, pie charts (Recharts library)

#### **2.04.1 Core Dashboard (15-18h)**
- ⏸️ Database tables: dashboards, dashboard_widgets
- ⏸️ CRUD operations, widget management

#### **2.04.2 Data Aggregation (20-25h)**
- ⏸️ gRPC clients for all microservices
- ⏸️ Widget data queries (Issues, Sales, Inventory, HR)
- ⏸️ KPI calculations (totals, averages, trends)
- ⏸️ Redis caching for performance

#### **2.04.3 Frontend (15-17h)**
- ⏸️ Dashboard component (react-grid-layout)
- ⏸️ Widget components (KPICounter, LineChart, BarChart, PieChart)
- ⏸️ Drag-and-drop layout editor
- ⏸️ Save/load user layouts

**Success Criteria:**
- ✅ Dashboards created and customizable
- ✅ Widgets aggregating data from multiple services
- ✅ Real-time updates working (WebSocket or polling)
- ✅ Drag-and-drop layout functional
- ✅ Role-based templates working

---

### **2.05 Blockchain Integration Extension** ⏸️ OPTIONAL (NEW)
**Dependencies:** 2.01 complete (Event Store with PostgreSQL + hash chain working)
**Estimated:** 40-50h (10-12 days)
**Target:** Phase 2 (after 2.01, if needed)
**Status:** ⏸️ OPTIONAL - Can be SKIPPED if hash chain sufficient

📄 **Implementation Plan:** [docs/temp/part-03-event-store-blockchain.md](../temp/part-03-event-store-blockchain.md) (Hyperledger sections)

⚠️ **Testing Strategy Required:** Before implementation, define Hyperledger Fabric chaincode tests, blockchain integrity tests, performance benchmarks.

**Upgrade Event Store with Full Hyperledger Fabric Blockchain**

**Why this is OPTIONAL:**
- Task 2.01 already provides **immutable audit trail** via PostgreSQL + hash chain
- Hash chain integrity = **90% of blockchain benefits** at **50% of the cost**
- Hyperledger Fabric adds: Distributed consensus, multi-organization trust
- **Use case:** If you need multi-company audit trail (e.g., supply chain with partners)

#### Key Features:
- ⛓️ **Full Hyperledger Fabric** - Replace PostgreSQL hash chain with blockchain
- 🔗 **Distributed Ledger** - Multi-peer consensus for tamper-proof audit
- 📜 **Chaincode Smart Contracts** - Programmable audit logic
- 🌐 **Multi-Organization** - Support for partner companies joining network

#### **2.05.1 Hyperledger Fabric Infrastructure (15-20h)**
- ⏸️ Multi-peer network setup (3+ peers for consensus)
- ⏸️ Orderer service configuration
- ⏸️ Certificate Authority for each organization
- ⏸️ Channel policies & endorsement policies

#### **2.05.2 Chaincode Development (15-18h)**
- ⏸️ Migrate hash chain logic to Go chaincode
- ⏸️ Implement StoreEvent, GetEvent, VerifyIntegrity functions
- ⏸️ Chaincode unit tests
- ⏸️ Deploy & upgrade chaincode

#### **2.05.3 Integration & Testing (10-12h)**
- ⏸️ Replace PostgreSQL hash chain with blockchain calls
- ⏸️ Performance testing (throughput, latency)
- ⏸️ Consensus testing (peer failures, Byzantine scenarios)

**Success Criteria:**
- ✅ Multi-peer Hyperledger Fabric network running
- ✅ Chaincode deployed and functional
- ✅ Event Store API using blockchain (not PostgreSQL hash chain)
- ✅ Performance acceptable (< 500ms per event)
- ✅ Consensus working (survives 1 peer failure)

**Decision Point:**
- If PostgreSQL + hash chain is **sufficient** → SKIP this task
- If you need **multi-organization trust** → IMPLEMENT this task

---

### **2.06 Advanced Health Monitoring & Alerting** ⏸️ PLANNED (NEW)
**Dependencies:** 2.01-2.05 complete (all new microservices operational)
**Estimated:** 35-45h (9-11 days)
**Target:** August 2026 (after Dashboard Phase 2)
**Ports:** 4906 (REST), 5906 (gRPC)
**Database:** PostgreSQL (metrics history) + Redis (real-time metrics)

⚠️ **Testing Strategy Required:** Before implementation, define health check test scenarios, alerting thresholds, false positive rate testing, monitoring dashboard E2E tests.

**Advanced Health Metrics Collection and Alerting for New Microservices**

**Why this task is needed:**
- Task 1.40 Phase 4 provides **basic gRPC health checks** (up/down status)
- New microservices (Event Store, Temporal Analytics, Graph Viz, Calendar, Messaging, Dashboard) need **advanced health metrics**
- Proactive monitoring prevents production outages (detect issues before users complain)
- Historical metrics enable capacity planning and performance trend analysis

#### Key Features:
- 📊 **Service-Specific Metrics** - Custom health checks for each microservice
- 🚨 **Alerting System** - Slack/Email notifications for threshold breaches
- 📈 **Monitoring Dashboard** - Real-time metrics UI (web-ui page)
- 📜 **Historical Metrics** - 30-day metric retention for trend analysis
- ⏱️ **Polling System** - Background Celery job (every 30s) to collect metrics
- 🎯 **Threshold Configuration** - Admin-configurable alert thresholds

#### **2.06.1 Health Metrics Collection (12-15h)**

**lkms901 (Event Store + Blockchain):**
- ⏸️ Blockchain block height (current block number)
- ⏸️ Peer status (if Hyperledger: peer count, orderer status)
- ⏸️ Kafka consumer lag (events queued vs processed)
- ⏸️ Hash chain integrity status (last verification timestamp)
- ⏸️ DB2 payload count, DB3 materialized view last refresh

**lkms902 (Temporal Analytics):**
- ⏸️ Celery queue depth (pending jobs, running jobs)
- ⏸️ Job processing time (avg duration, max duration)
- ⏸️ TimescaleDB hypertable size (disk usage)
- ⏸️ Cache hit rate (% of queries served from TimescaleDB cache)
- ⏸️ Failed job count (last 24h)

**lkms903 (Graph Visualization):**
- ⏸️ Neo4j sync lag (Kafka events to Neo4j latency)
- ⏸️ Graph query performance (avg query time, P95, P99)
- ⏸️ Node count, edge count (graph size metrics)
- ⏸️ Neo4j memory usage, disk usage

**lkms806 (Calendar Service):**
- ⏸️ iCal sync status (last sync timestamp, errors)
- ⏸️ Recurring event processor status (jobs running, backlog)
- ⏸️ Event count (total events, upcoming events count)
- ⏸️ RSVP pending count

**lkms807 (Messaging Service):**
- ⏸️ WebSocket connection count (active connections)
- ⏸️ Redis pub/sub status (channels active, messages/sec)
- ⏸️ Message queue depth (undelivered messages)
- ⏸️ Active users count (online users)

**lkms904 (Dashboard Service):**
- ⏸️ Widget refresh lag (time since last data update)
- ⏸️ Data aggregation performance (avg query time)
- ⏸️ Cache status (Redis hit rate)
- ⏸️ Active dashboard count (users with dashboards open)

#### **2.06.2 REST API (10-12h)**
- ⏸️ GET /api/health/metrics (all services health summary)
- ⏸️ GET /api/health/metrics/{service_id} (specific service details)
- ⏸️ GET /api/health/history/{service_id}?metric={metric_name}&days={days} (historical data)
- ⏸️ POST /api/health/thresholds (admin config for alert thresholds)
- ⏸️ GET /api/health/alerts (active alerts, alert history)

#### **2.06.3 Alerting System (8-10h)**
- ⏸️ Threshold monitoring (background Celery job every 30s)
- ⏸️ Slack webhook integration (send alerts to #ops-alerts channel)
- ⏸️ Email alerting (SMTP integration for critical alerts)
- ⏸️ Alert rules engine (IF metric > threshold FOR duration THEN alert)
- ⏸️ Alert deduplication (don't spam same alert multiple times)

**Example Alert Rules:**
```
Celery Queue Depth > 50 for 5 minutes → ALERT: "Temporal Analytics job backlog"
WebSocket Connections > 10000 → ALERT: "Messaging Service high load"
Kafka Consumer Lag > 1000 events → ALERT: "Event Store consumer falling behind"
Neo4j Sync Lag > 10 minutes → ALERT: "Graph Visualization sync degraded"
```

#### **2.06.4 Monitoring Dashboard UI (5-7h)**
- ⏸️ Health Overview page (all services status grid)
- ⏸️ Real-time metrics (auto-refresh every 30s)
- ⏸️ Status indicators (green = healthy, yellow = degraded, red = critical)
- ⏸️ Historical charts (line charts for metric trends)
- ⏸️ Alert notifications (toast alerts for new issues)
- ⏸️ Admin: Threshold configuration UI

**Success Criteria:**
- ✅ All 6 new microservices reporting health metrics
- ✅ Monitoring dashboard showing real-time status
- ✅ Alerts firing correctly for threshold breaches
- ✅ Slack/Email notifications working
- ✅ Historical metrics stored for 30 days
- ✅ Admin can configure alert thresholds via UI
- ✅ No false positives in alerting (< 5% false positive rate)

---

### **2.07 Async Background Cleanup & Deletion Retry** ⏸️ PLANNED (NEW)
**Dependencies:** Phase 1 complete (deletion audit workflow implemented in all microservices)
**Estimated:** 40-50h (10-13 days)
**Target:** September 2026 (after Advanced Health Monitoring)

⚠️ **Testing Strategy Required:** Before implementation, define retry logic tests (exponential backoff, max retries), failed deletion recovery scenarios, MinIO connection failure simulation, Kafka consumer offset management tests.

**Async Background Jobs for Robust Deletion with Retry Logic**

**Why this task is needed:**
- Phase 1 implements **synchronous deletion** (user waits for MinIO files to delete)
- If MinIO is down or slow, user experiences long wait times or errors
- Background jobs enable: Delete database → User sees instant success → Cleanup happens later
- Retry logic handles transient failures (MinIO temporarily unavailable)

**Context from Phase 1:**
- ✅ Deletion Audit Workflow implemented (see `docs/programming/backend-standards.md`)
- ✅ Soft delete (sets `deleted_at` timestamp, keeps MinIO files)
- ✅ Hard delete (deletes MinIO files → database, with audit trail)
- ✅ DeletionAudit table tracks: status (pending, completed, failed, partial), files_found, files_deleted, files_failed
- ✅ Kafka events published: `item.deleted`, `item.restored`, `item.permanently_deleted`

**What Phase 2 adds:**
- 🔄 **Async Cleanup** - Soft delete instant → Background job handles MinIO cleanup
- 🔁 **Retry Logic** - Exponential backoff for failed deletions (3 retries max)
- 📊 **Admin Dashboard** - View failed deletions, manually trigger retry
- 🚨 **Alerting** - Slack/Email notification if deletion fails after all retries

#### Key Features:
- 🔄 **Celery Background Workers** - Process deletion jobs asynchronously
- 📡 **Kafka Consumer** - Listen to `*.deleted` events → schedule cleanup jobs
- 🔁 **Retry Logic** - Exponential backoff (30s, 2min, 10min) with max 3 retries
- 📊 **Admin Dashboard** - Failed deletion queue, manual retry, audit log viewer
- 🚨 **Alerting Integration** - Notify ops team if deletion permanently fails
- 🗄️ **DeletionAudit Enhancement** - Track retry attempts, last_retry_at, retry_count

#### **2.07.1 Celery Worker Setup (10-12h)**
- ⏸️ Install Celery + Redis (task queue backend)
- ⏸️ Docker container: lkern-celery-worker
- ⏸️ Configure Celery app (broker=Redis, result_backend=Redis)
- ⏸️ Task definition: `async_delete_external_resources(item_id, item_type)`
- ⏸️ Retry decorator: `@task(bind=True, max_retries=3, default_retry_delay=30)`
- ⏸️ Exponential backoff logic (30s, 2min, 10min)

#### **2.07.2 Kafka Consumer for Deletion Events (8-10h)**
- ⏸️ Subscribe to `lkern.*.deleted` events (all microservices)
- ⏸️ Extract metadata: item_id, item_type, service_name
- ⏸️ Schedule Celery task: `async_delete_external_resources.apply_async()`
- ⏸️ Update DeletionAudit: status='pending', scheduled_at=now()
- ⏸️ Error handling: If Celery unavailable, log warning + keep item soft-deleted

#### **2.07.3 Async Cleanup Task Implementation (12-15h)**
- ⏸️ Task logic:
  1. Fetch item from database (by item_id)
  2. List MinIO files (prefix=`{item_id}/`)
  3. Delete each file, track failures
  4. Update DeletionAudit: files_found, files_deleted, files_failed
  5. If all files deleted → Delete from database + status='completed'
  6. If some files failed → status='partial', raise exception to trigger retry
  7. If all retries exhausted → status='failed', publish `item.deletion.failed` event
- ⏸️ Idempotency: Handle case where item already deleted (no-op)
- ⏸️ Logging: Detailed logs for each retry attempt

#### **2.07.4 DeletionAudit Table Enhancements (5-6h)**
- ⏸️ Add columns:
  - `retry_count` (Integer, default=0)
  - `last_retry_at` (DateTime, nullable)
  - `scheduled_at` (DateTime, nullable) - when Celery task scheduled
  - `celery_task_id` (String, nullable) - Celery task UUID
- ⏸️ Alembic migration for new columns
- ⏸️ Update schemas: DeletionAuditResponse includes retry info

#### **2.07.5 Admin Dashboard for Failed Deletions (8-10h)**
- ⏸️ Backend API:
  - GET /api/admin/deletion-audit?status=failed (list failed deletions)
  - GET /api/admin/deletion-audit?status=partial (list partial deletions)
  - POST /api/admin/deletion-audit/{audit_id}/retry (manually trigger retry)
  - GET /api/admin/deletion-audit/{audit_id} (detailed audit log)
- ⏸️ Frontend UI (web-ui):
  - Failed Deletions page (/admin/failed-deletions)
  - Table: item_code, item_type, status, retry_count, last_retry_at, error_message
  - Actions: "Retry Now", "View Details"
  - Pagination + filtering (by service, by date range)

#### **2.07.6 Alerting Integration (5-7h)**
- ⏸️ Publish Kafka event: `item.deletion.failed` (after all retries exhausted)
- ⏸️ Alerting Service (2.06) consumes event
- ⏸️ Send Slack notification: "#ops-alerts - Deletion Failed: {item_code} after 3 retries"
- ⏸️ Send Email notification (critical alert)
- ⏸️ Admin dashboard shows notification badge (unread failed deletions count)

**Updated Workflow:**

**Phase 1 (Current - Synchronous):**
1. User clicks "Permanently Delete"
2. Backend deletes MinIO files (user waits 5-10s)
3. Backend deletes database record
4. User sees success message

**Phase 2 (New - Asynchronous):**
1. User clicks "Permanently Delete"
2. Backend sets `deleted_at` timestamp (instant - 100ms)
3. User sees success message immediately
4. Backend publishes Kafka event: `item.deleted`
5. Kafka consumer schedules Celery task
6. Background worker deletes MinIO files (5-10s, user already moved on)
7. If success → Delete database record + audit status='completed'
8. If failure → Retry 3 times with backoff → If still fails, alert ops team

**Success Criteria:**
- ✅ Celery worker running and processing deletion tasks
- ✅ Kafka consumer scheduling tasks on `*.deleted` events
- ✅ Retry logic working (exponential backoff, max 3 retries)
- ✅ DeletionAudit tracks retry attempts and task IDs
- ✅ Admin dashboard shows failed deletions with retry button
- ✅ Manual retry from admin dashboard triggers new Celery task
- ✅ Alerting fires on permanent failure (Slack + Email)
- ✅ User experience improved (instant deletion feedback, no waiting)
- ✅ Failed deletions < 1% (due to retry logic handling transient failures)

**Benefits:**
- ⚡ **Instant user feedback** - No waiting for MinIO cleanup
- 🔁 **Resilient to failures** - Transient MinIO issues auto-retry
- 📊 **Observability** - Admin can see and retry failed deletions
- 🚨 **Proactive alerts** - Ops team notified of persistent failures
- 🎯 **Production-ready** - Robust deletion workflow for high-scale systems

---

### **2.10 Security Hardening** ⏸️ PLANNED
**Estimated:** 30-40h

⚠️ **Testing Strategy Required:** Before implementation, define penetration testing scope, vulnerability scanning tools, compliance audit checklist.

- ⏸️ Dependency updates
- ⏸️ Penetration testing
- ⏸️ GDPR compliance audit
- ⏸️ Authentication hardening
- ⏸️ API rate limiting
- ⏸️ Input validation review

---

### **2.20 Performance Optimization** ⏸️ PLANNED
**Estimated:** 25-35h

⚠️ **Testing Strategy Required:** Before implementation, define performance benchmarks (response time targets, throughput goals), load testing scenarios (concurrent users, peak load), database optimization metrics (query execution time, index effectiveness).

- ⏸️ Database query optimization
- ⏸️ Kafka optimization
- ⏸️ Load testing
- ⏸️ Caching strategy
- ⏸️ Bundle size optimization
- ⏸️ API response time tuning

---

### **2.30 Bug Fixes & Stability** ⏸️ PLANNED
**Estimated:** 40-50h

⚠️ **Testing Strategy Required:** Before implementation, define regression test suite (prevent fixed bugs from reappearing), stability tests (long-running processes, memory leaks), error handling tests (edge cases, network failures).

- ⏸️ Production bug fixes
- ⏸️ Error handling improvements
- ⏸️ Logging improvements
- ⏸️ Monitoring dashboard
- ⏸️ User feedback implementation

---

### **2.40 PPQ Advanced Algorithms** ⏸️ PLANNED
**Estimated:** 30-40h

⚠️ **Testing Strategy Required:** Before implementation, define algorithm correctness tests (scheduling accuracy, constraint satisfaction), performance tests (optimization time vs problem size), comparison tests (advanced vs basic algorithm results).

- ⏸️ Multi-criteria optimization (quality + speed + cost)
- ⏸️ Constraint-based scheduling
- ⏸️ Machine learning predictions
- ⏸️ Real-time rescheduling

---

### **2.50 Optional Services** ⏸️ PLANNED
**Estimated:** 40-60h

⚠️ **Testing Strategy Required:** Before implementation, define service-specific test plans for each optional service (Notification delivery tests, Gamification point calculation, Inquiries workflow E2E, Mail client SMTP/IMAP tests, Documents upload/download tests).

**Note:** Issues Service moved to Phase 1 (task 1.60)

- ⏸️ Notification Service (email/SMS/push)
- ⏸️ Gamification / Loyalty Service
- ⏸️ Inquiries Service (customer quotes tracking)
- ⏸️ Mail Client Service (SMTP/IMAP)
- ⏸️ Documents Service (file upload/download)

---

### **2.55 Issues Service Advanced** ⏸️ PLANNED (NEW)
**Dependencies:** 1.60 complete (Issues Service MVP)
**Estimated:** 8-12h (2-3 days)
**Target:** Phase 2 (after MVP)

📄 **Implementation Plan:** [docs/temp/part-02-issues-service-extended.md](../temp/part-02-issues-service-extended.md) (section "Roadmap Phase 2: Advanced Features")

**Advanced comment threading and UX improvements**

#### Key Features:
- 🌳 **3-Level Tree Threading** - Comments nested up to 3 levels deep (0, 1, 2, 3)
- 📋 **Flat After Level 3** - Replies beyond level 3 appear flat (no more nesting)
- 🔄 **Recursive Query** - WITH RECURSIVE CTE for efficient tree loading
- 📐 **Visual Indentation** - Clear depth indicators in UI (padding per level)

#### **2.55.1 Backend (4-6h)**
- ⏸️ Remove `CHECK (thread_depth <= 1)` constraint
- ⏸️ Change to `CHECK (thread_depth >= 0)` (unlimited, display handles it)
- ⏸️ Add `is_flat_continuation` column
- ⏸️ Implement recursive CTE query for tree structure
- ⏸️ API: Return `is_flat_display` flag for level 4+ replies
- ⏸️ 10 unit tests (tree loading, depth limits)

#### **2.55.2 Frontend (4-6h)**
- ⏸️ CommentThread component with recursive rendering
- ⏸️ Visual indentation (levels 0-3: 24px per level)
- ⏸️ Flat display for level 4+ (no indent, "↩️ replied to @user" prefix)
- ⏸️ Collapse/expand subtrees
- ⏸️ 8 component tests

**Success Criteria:**
- ✅ Comments nest correctly up to 3 levels (visual tree)
- ✅ Level 4+ replies appear flat with "↩️ replied to @user" indicator
- ✅ Tree loads efficiently (single recursive CTE query)
- ✅ 18 tests passing (10 backend + 8 frontend)

---

**→ When complete: Upgrade to v4.2.0 and start Phase 3**

---

## 📋 PHASE 3: Production Hardening (v4.2.x)

**Goal:** Create stable foundation for future development
**Start:** After Phase 2 complete
**Status:** ⏸️ PLANNED

---

### **3.05 Dashboard Phase 3: SharePoint-Like Features** ⏸️ PLANNED (NEW)
**Dependencies:** 2.04 complete (Dashboard Phase 2), Multi-service ecosystem operational
**Estimated:** 40-50h (8-10 days)
**Target:** Phase 3 timeline
**Service:** lkms904 Dashboard Microservice (existing)

📄 **Implementation Plan:** [docs/temp/part-08-dashboard-microservice.md](../temp/part-08-dashboard-microservice.md) (Phase 3)

⚠️ **Testing Strategy Required:** Before implementation, define widget library tests (widget rendering, data binding), dashboard sharing tests (permissions, access control), mobile responsive tests (layout adaptation, touch interactions), alert tests (threshold triggers, notifications).

**Advanced Dashboard Features: Widget Library & Dashboard Sharing**

#### Key Features:
- 📊 **Advanced Widget Library** - Pre-built KPI widgets (revenue, inventory, orders, contacts)
- 🎨 **Widget Marketplace** - Discover, preview, and install community widgets
- 🔗 **Dashboard Sharing** - Share dashboards with view-only or edit permissions
- 📱 **Mobile-Responsive Layouts** - Auto-adjust widget layouts for mobile devices
- 🔔 **Widget Alerts** - Set thresholds and receive notifications
- 📈 **Widget Export** - Export widget data to CSV/Excel
- 🎛️ **Advanced Customization** - Custom color schemes, widget templates

#### Implementation Phases:

**3.05.1 Widget Library (15-20h):**
- ⏸️ Pre-built widgets: Revenue chart, Top products, Order count, Contact count
- ⏸️ Widget preview modal with live data samples
- ⏸️ One-click widget installation
- ⏸️ Widget version management
- ⏸️ Widget configuration templates

**3.05.2 Dashboard Sharing (10-15h):**
- ⏸️ Share dashboard with specific users
- ⏸️ Role-based permissions (view-only, edit, admin)
- ⏸️ Public dashboard URLs (read-only, optional password)
- ⏸️ Dashboard cloning (fork shared dashboard)
- ⏸️ Activity log (who viewed/edited when)

**3.05.3 Mobile & Advanced Features (15-20h):**
- ⏸️ Responsive grid layouts for mobile (1-column, 2-column)
- ⏸️ Touch-optimized drag-and-drop
- ⏸️ Widget alert system (threshold notifications)
- ⏸️ CSV/Excel export per widget
- ⏸️ Custom color schemes (light/dark themes)
- ⏸️ Widget templates library

#### Success Criteria:
- ✅ 10+ pre-built widgets available in library
- ✅ Dashboard sharing works with permissions (view/edit/admin)
- ✅ Public dashboard URLs accessible without login
- ✅ Mobile layouts auto-adjust to screen size
- ✅ Widget alerts trigger notifications when thresholds crossed
- ✅ CSV/Excel export working for all widget types
- ✅ 30+ translation keys (SK/EN)
- ✅ 25+ integration tests

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
- ⏸️ **Docker Production Optimization**
  - Enable Nx daemon for CI/CD pipelines (`NX_DAEMON=true`)
  - Keep disabled for local development (`NX_DAEMON=false` in docker-compose.yml)
  - Configure daemon settings for production builds
  - Document daemon usage in deployment guide
- ⏸️ **ESLint Configuration Fix**
  - Set `@nx/enforce-module-boundaries` back to `'error'` (currently `'warn'`)
  - Location: `eslint.config.mjs` (line 17)
  - Location: `packages/ui-components/eslint.config.mjs` (line 11)
  - Requires: Making `@l-kern/config` buildable first
- ⏸️ **DataGrid Keyboard Navigation**
  - Implement Arrow Right/Left navigation between header cells
  - Location: `packages/ui-components/src/components/DataGrid/`
  - Documented in DataGrid.md (line 951)

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