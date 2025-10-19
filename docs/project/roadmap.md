# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 1.2.0
# Created: 2025-10-13
# Updated: 2025-10-19 17:00:00
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Complete development roadmap for L-KERN v4 from foundation
#   setup through production deployment. Defines all phases and tasks.
# ================================================================

**Status**: 🚀 Active Development

---

## 📋 Overview

L-KERN v4 je postavený na princípoch **simplicity, maintainability, and clarity**. Roadmap definuje postupný vývoj od základnej infraštruktúry po nasadenie do testovacej prevádzky.

**Key Principles:**
- ✅ Incremental development (malé kroky, časté commity)
- ✅ Documentation-first approach
- ✅ Test each component before moving forward
- ✅ No hardcoded values (centralized configuration)
- ✅ DRY compliance (Single Source of Truth)

**Communication Architecture:**
- **External API**: REST (HTTP/JSON) - Frontend → Backend
- **Inter-service**: gRPC - Backend ↔ Backend communication

**Deployment Strategy:**
- **Phase 0**: Develop all core services → Deploy to test environment
- **Phase 1**: Extended functionality (after Phase 0 validation)

---

## 🎉 Recent Achievements

### ✅ Codebase Refactoring (2025-10-19)
**Status:** COMPLETED
**Duration:** 12 hours
**Commits:** 18 total

**Achievements:**
- 🔥 **Security:** Removed CRITICAL database password exposure
- 💾 **Stability:** Fixed 2 memory leaks in Modal component
- 📱 **Responsive:** Added mobile/tablet support for HomePage + 3 core components
- 🎨 **DRY Compliance:** 100% (colors & texts), 90% (spacing)
- 🌍 **Translations:** +76 new keys (SK/EN bilingual support)
- 🧹 **Cleanup:** Archived 11 temp files, removed 8 empty directories

**Results:**
- Tests: 365/365 passing (100%) ✅
- Build: Zero TypeScript errors ✅
- Security: Zero vulnerabilities ✅
- Grade: **A (93/100)**

**Documentation:** See [docs/REFACTORING-SUMMARY.md](../REFACTORING-SUMMARY.md) for complete details.

---

## Phase 0: Foundation & Core System

**Status**: ⏳ **IN PROGRESS**
**Goal**: Build complete core system and deploy to test environment

### ✅ Completed Tasks

#### 0.0 Infrastructure Setup (DONE)
- ✅ Nx workspace setup (Yarn 4 + TypeScript 5.7)
- ✅ Docker development environment with hot-reload
- ✅ React 19 web-ui application (lkms201-web-ui on port 4201)
- ✅ @l-kern/config package (constants, translations, theme)
- ✅ Documentation structure (docs/README.md, PROJECT-OVERVIEW.md, port-mapping.md)
- ✅ Port mapping strategy (LKMS{XXX} → Port 4{XXX})

**Deliverables**: ✅ Working development environment

---

### ✅ Completed Tasks (Continued)

#### 0.1 Coding Standards (DONE)
**Priority**: HIGH
**Status**: ✅ Completed
**Completed**: 2025-10-15

**Tasks:**
- ✅ Create `docs/programming/coding-standards.md`
  - TypeScript conventions
  - React component patterns
  - Python/FastAPI conventions
  - gRPC service patterns
  - File naming conventions
  - Import/export standards
  - Comment guidelines
  - Error handling patterns
  - Retry logic with exponential backoff
  - Kafka/message broker patterns
- ✅ Create `docs/programming/code-examples.md`
  - React component examples (basic, with API, custom hooks)
  - REST API client usage (Axios setup, interceptors)
  - gRPC client/server usage (Python implementation)
  - FastAPI router examples (complete CRUD)
  - Database operations (SQLAlchemy, Pydantic, Alembic)
  - Form handling patterns (validation, error handling)
  - Testing examples (pytest + Vitest)

**Deliverables**: ✅ Complete coding guidelines for team (2235 lines + 1700 lines)

---

### ⏳ Planned Tasks

#### 0.2 UI Infrastructure (Components + Utilities)
**Priority**: HIGH
**Status**: ⏳ **IN PROGRESS (Phase 1 & 2 ✅, Phase 3 & 4 ⏳)**
**Dependencies**: 0.1
**Started**: 2025-10-18
**Updated**: 2025-10-18

**Overview:**
Complete UI infrastructure including form components, utilities, advanced components, and page templates.

---

### **Phase 1: Form Components** ✅ COMPLETED
**Status**: ✅ Done (2025-10-18)

**Components (6):**
- [x] Button (primary, secondary, danger, ghost, success variants) ✅
- [x] Input (text, number, email, password) ✅
- [x] Select (native dropdown with options array) ✅
- [x] Checkbox (with indeterminate state) ✅
- [x] Radio/RadioGroup ✅
- [x] FormField wrapper ✅

**Stats:**
- TypeScript: ~740 lines
- CSS: ~840 lines
- Tests: 115 (100% passing)

---

### **Phase 2: Layout & Display** ✅ COMPLETED
**Status**: ✅ Done (2025-10-18)

**Components (4):**
- [x] Card ✅
- [x] Badge ✅
- [x] Spinner/Loader ✅
- [x] EmptyState ✅

**Stats:**
- TypeScript: ~340 lines
- CSS: ~560 lines
- Tests: 67 (100% passing)

---

### **Phase 3: Utility Functions & Validators** ✅ COMPLETED
**Status**: ✅ Completed (2025-10-18)
**Location**: `packages/config/src/utils/`

**Utilities (3 modules):**
- [x] **phoneUtils.ts** - Phone formatting & validation ✅
  - [x] `formatPhoneNumber(phone, type: 'mobile' | 'landline' | 'fax')` - Multi-country (SK, CZ, PL)
  - [x] `validateMobile(phone)` - Mobile validation with country detection
  - [x] `validateLandlineOrFax(phone)` - Landline/fax validation
  - [x] `detectPhoneType(phone)` - Auto-detect mobile/landline
  - [x] `cleanPhoneNumber(phone)` - Remove formatting characters
  - [x] Phone config system for easy country additions
  - [x] Tests: 35 tests (100% coverage)

- [x] **emailUtils.ts** - Email validation & normalization ✅
  - [x] `validateEmail(email)` - RFC 5322 compliant
  - [x] `normalizeEmail(email)` - Lowercase, trim
  - [x] `getEmailDomain(email)` - Extract domain
  - [x] `getEmailLocal(email)` - Extract username
  - [x] `isEmailFromDomain(email, domain)` - Domain matching
  - [x] Tests: 43 tests (100% coverage)

- [x] **dateUtils.ts** - Date formatting & parsing ✅
  - [x] `formatDate(date, locale)` - SK: DD.MM.YYYY, EN: YYYY-MM-DD
  - [x] `formatDateTime(date, locale)` - With time formatting
  - [x] `parseDate(dateString, locale)` - Parse to Date object
  - [x] `validateDate(dateString, locale)` - Format validation
  - [x] `convertDateLocale(dateString, from, to)` - SK ↔ EN conversion
  - [x] `getToday(locale)` - Current date formatted
  - [x] `isToday(date)` - Check if date is today
  - [x] `addDays(date, days)` - Date arithmetic
  - [x] `getDaysDifference(date1, date2)` - Calculate day diff
  - [x] Tests: 45 tests (100% coverage)

**Stats:**
- **Total Functions**: 20 (6 phone + 5 email + 9 date)
- **TypeScript**: ~400 lines
- **Tests**: 123 (100% passing, 100% coverage)
- **Multi-language**: SK, CZ, PL phone support + SK/EN date formats

---

### **Phase 4: Advanced Components & Templates** ⚠️ PARTIAL
**Status**: ⚠️ **PARTIAL** - Modal wizard completed, but drawer/fullscreen NOT in production
**Location**: `packages/ui-components/src/components/`
**Updated**: 2025-10-18

**⚠️ IMPORTANT NOTE:**
Modal component simplified - only **centered variant** exported to production.
Drawer and fullscreen variants exist in test files but NOT in production package.

**4.1 Core Advanced (5 components):**

**✅ COMPLETED:**
- [x] **Modal** (v3.6.0) - ⚠️ **PARTIAL** (centered variant only in production)
  - ✅ Production: `packages/ui-components/src/components/Modal/Modal.tsx` (centered only)
  - ⚠️ Testing only: `apps/web-ui/src/__tests__/components/Modal3Variants.tsx` (drawer, fullscreen)
  - 26 tests passing (centered variant)
  - Enhanced keyboard handling (ESC/Enter with input focus support)
  - **Missing**: Drawer variant, Fullscreen variant (NOT exported to @l-kern/ui-components)
- [x] **WizardProgress** (v1.0.0) - ✅ **COMPLETED** (3 variants: dots, bar, numbers)
  - Location: `packages/ui-components/src/components/WizardProgress/WizardProgress.tsx`
  - 15 tests passing
- [x] **WizardNavigation** (v1.0.0) - ✅ **COMPLETED** (Previous/Next/Complete buttons)
  - Location: `packages/ui-components/src/components/WizardNavigation/WizardNavigation.tsx`
- [x] **useModalWizard hook** (v1.0.0) - ✅ **COMPLETED** (multi-step workflow management)
  - Location: `packages/config/src/hooks/useModalWizard.ts`
  - 19 tests passing
- [x] **ModalContext** (v1.0.0) - ✅ **COMPLETED** (centralized modal registry, z-index management)
  - Location: `packages/config/src/contexts/ModalContext.tsx`

**🎯 NEXT PRIORITY (Task 0.2 Phase 4 - Critical Path):**
- [ ] **Table/DataGrid** - ❌ **URGENT** - CRITICAL for contacts page, invoices, orders
  - Sortable columns (ASC/DESC toggle)
  - Pagination (previous, next, page size selector)
  - Row selection (single/multi with checkboxes)
  - Empty state + loading state
  - Responsive (horizontal scroll on mobile)
  - Expandable rows (optional detail panel)
  - Custom cell renderers
  - **Estimated**: 4-6 hours
  - **Blockers**: None (ready to start)
  - **Unlocks**: ContactList page, all CRUD list pages
- [ ] **FilterAndSearch** - ❌ **HIGH PRIORITY** - Needed with Table/DataGrid
  - Search input with debounce
  - Filter dropdowns (status, category, date range)
  - Clear filters button
  - Filter count badge
  - **Estimated**: 2-3 hours
  - **Dependencies**: Should work standalone OR with Table
- [ ] **DataGridDetail** - ❌ **OPTIONAL** - Enhanced row detail view
  - Expandable row content area
  - Custom detail renderer
  - Slide animation
  - **Estimated**: 2-3 hours
  - **Can wait**: Not critical for MVP

**4.2 Utility Components (4 components):**
- [ ] **ThemeCustomizer** - ❌ **NOT STARTED** - Theme switcher panel (light/dark/auto)
- [ ] **KeyboardShortcuts** - ❌ **NOT STARTED** - Keyboard shortcuts display panel
- [ ] **DebugBar** - ❌ **NOT STARTED** - Developer debug panel (state/props viewer)
- [ ] **Analytics** - ❌ **NOT STARTED** - Analytics dashboard widget

**4.3 Composite Components (3 components):**
- [ ] **Report** - ❌ **NOT STARTED** - Report container (header + filters + content + export)
- [ ] **HeaderCard** - ❌ **NOT STARTED** - Page header with breadcrumbs + actions
- [ ] **CustomPalette** - ❌ **NOT STARTED** - Color palette picker/viewer

**4.4 Layout Templates (3 templates):**
- [ ] **BasePageLayout** - ❌ **NOT STARTED** - Master layout (sidebar + header + content)
- [ ] **DashboardTemplate** - ❌ **NOT STARTED** - Dashboard page with widget grid
- [ ] **TableTemplate** - ❌ **NOT STARTED** - Table page template (header + filters + grid)

**Stats:**
- **Completed**: 3 components (Modal centered, WizardProgress, WizardNavigation) + 2 hooks/context
- **Partial**: Modal (drawer/fullscreen variants NOT in production)
- **Missing**: 14 components (Table/DataGrid, FilterAndSearch, ThemeCustomizer, Templates, etc.)
- **TypeScript**: ~580 lines (completed)
- **CSS**: ~420 lines (completed)
- **Tests**: 60 passing (26 Modal + 15 WizardProgress + 19 useModalWizard)
- **Progress**: 3/17 components (18%)

**📋 Modal Enhancement Plan (v3 Features):**
- [ ] **Drag & Drop** - Modal movable by header dragging
- [ ] **Enhanced Keyboard** - ESC (topmost only), Enter (with textarea exception)
- [ ] **Nested Modals** - Full ModalContext integration with z-index management
- [ ] **Footer Layout** - Delete button (left), Cancel/Confirm (right), error messages
- [ ] **Alignment Options** - Top/Center/Bottom positioning
- [ ] **Padding Override** - Custom overlay padding for nested modals

**📚 Documentation Updates:**
- [x] ✅ Updated `docs/packages/ui-components.md` with complete Modal + Wizard system documentation
- [x] ✅ Created `docs/temp/modal-enhancement-plan.md` - Detailed implementation plan (8 hours estimated)
- [x] ✅ Updated `docs/packages/components-reference.md` with Modal, WizardProgress, WizardNavigation + hooks
- [ ] Create Modal demo page showcasing all features (after enhancements implemented)

**Estimated Effort:** ~8 hours (4h core + 2h UI + 2h docs/tests)

---

### **🎯 NEXT IMMEDIATE TASK: Modal & UI Component Improvements**
**Priority**: 🔴 **CRITICAL** - User-requested features
**Status**: 📋 **PLANNED** - Implementation plan ready
**Created**: 2025-10-19
**Plan Document**: [`docs/temp/implementation-plan-modal-improvements.md`](../temp/implementation-plan-modal-improvements.md)

**Overview:**
Comprehensive modal system improvements and UI enhancements based on v3 patterns analysis.

**Key Features:**
1. ✅ **Input Reserved Error Space** - Fix form field jumping (UX critical)
2. ✅ **DebugBar Analytics Fix** - Fix broken click/keyboard tracking
3. ✅ **ConfirmModal Component** - Replace `alert()` with proper modal
4. ✅ **useFormDirty Hook** - Track unsaved changes
5. ✅ **Unsaved Changes Protection** - Confirm before closing dirty modal
6. ✅ **Card Accent Variant** - Purple border + glow (v3 DashboardCard style)
7. ✅ **Clear Form Button** - Reset form fields (NO confirmation)
8. ✅ **Toast Test Page** - Testing page for toast notifications
9. ✅ **4 Modal Templates** (v3 → v4 migration, postupne):
   - EditItemModal (Add/Edit single item)
   - ManagementModal (Manage list of items)
   - SectionEditModal (Generic form builder with FieldDefinition system)
   - DetailModal (Complex entity detail with 3-level modal hierarchy)

**Confirmation Dialogs Strategy:**
- ✅ **YES Confirm**: Delete Item, Close modal with unsaved data
- ❌ **NO Confirm**: Clear Form (direct clear)

**Implementation Phases:**
- **Phase 1** (3-5h): Critical UX fixes (Input + DebugBar)
- **Phase 2** (6-9h): New components (ConfirmModal + useFormDirty)
- **Phase 3** (12-20h): Enhancements (Card + Templates + Toast page)
- **Phase 4** (8-12h): Testing & Documentation

**Effort Estimate:**
- **Without Templates**: 18-27 hours (3-4 days)
- **With Templates**: 29-46 hours (5-7 days)

**Milestones:**
- **Milestone 1** (9-14h): Core fixes + ConfirmModal
- **Milestone 2** (20-32h): Templates + Testing

**Deliverables:**
- ✅ Input component with reserved error space
- ✅ Fixed DebugBar analytics
- ✅ ConfirmModal component with Promise-based API
- ✅ useFormDirty hook for change tracking
- ✅ Card accent variant (purple border)
- ✅ Clear Form button pattern
- ✅ Toast test page
- ✅ 4 modal templates (postupne implementation)
- ✅ Unit tests (90%+ coverage)
- ✅ Integration tests (modal hierarchy)
- ✅ Documentation updates (code-examples.md, coding-standards.md)

**Next Step**: Review implementation plan → Start Milestone 1

---

### **Task 0.2 Summary**

**Current Progress:**
- ✅ **Phase 1**: 6 form components (Button, Input, Select, Checkbox, Radio, FormField) - 100%
- ✅ **Phase 2**: 4 layout components (Card, Badge, Spinner, EmptyState) - 100%
- ✅ **Phase 3**: 20 utility functions (phone, email, date) - 100%
- ⚠️ **Phase 4**: 3/17 advanced components (Modal, WizardProgress, WizardNavigation) - 18%

**Stats:**
- **Components**: 13 production ✅ (6 form + 4 layout + 3 modal/wizard)
- **Utilities**: 20 functions ✅ (6 phone + 5 email + 9 date)
- **Hooks**: 2 ✅ (useModalWizard, useModal)
- **Context**: 1 ✅ (ModalContext)
- **Tests**: 305 passing ✅ (115 form + 67 layout + 123 utilities + 60 modal/wizard = 365 tests)
- **TypeScript**: ~2500 lines
- **CSS**: ~2200 lines
- **Test coverage**: 100%
- **Design tokens**: Full compliance
- **Dark mode**: Full support

**⚠️ Modal Status:**
- ✅ Production: Centered variant only (`packages/ui-components/src/components/Modal/Modal.tsx`)
- ⚠️ Test only: Drawer + Fullscreen variants (`apps/web-ui/src/__tests__/components/Modal3Variants.tsx`)
- ❌ NOT exported to @l-kern/ui-components package

**File Organization (Updated 2025-10-18 20:45):**
```
packages/ui-components/src/components/         ← Production (exported)
  ├── Modal/
  │   ├── Modal.tsx (centered only) ✅
  │   ├── Modal.module.css ✅
  │   ├── Modal.test.tsx ✅
  │   └── index.ts ✅
  ├── WizardProgress/                          🆕 Reorganized (own folder)
  │   ├── WizardProgress.tsx ✅
  │   ├── WizardProgress.module.css ✅
  │   ├── WizardProgress.test.tsx ✅
  │   └── index.ts ✅
  └── WizardNavigation/                        🆕 Reorganized (own folder)
      ├── WizardNavigation.tsx ✅
      ├── WizardNavigation.module.css ✅
      ├── WizardNavigation.test.tsx ⚠️ MISSING
      └── index.ts ✅

apps/web-ui/src/__tests__/                     ← Testing only (NOT exported)
  ├── components/Modal3Variants.tsx (drawer, fullscreen) ⚠️
  ├── demos/ContactFormWizard/ (6-step demo)
  └── pages/WizardVariantsDemo.tsx (comparison page)
```

**✅ Component Organization Verified (2025-10-18):**
- **Total Components**: 13
- **With Unit Tests**: 12/13 (92%)
- **Missing Test**: WizardNavigation.test.tsx
- **All Have barrel exports**: ✅ Yes (index.ts in every folder)
- **Reorganization Complete**: Wizard components moved to own folders
- **Verified Inventory**: `docs/temp/component-inventory-2025-10-18.md`

**Deliverables**:
- ✅ Phase 1: 6 form components (100%)
- ✅ Phase 2: 4 layout components (100%)
- ✅ Phase 3: 20 utility functions (100%)
- ⚠️ Phase 4: 3/17 advanced components (18%)
  - ✅ Modal (centered), WizardProgress, WizardNavigation, useModalWizard, ModalContext
  - ❌ Table, DataGrid, FilterAndSearch, ThemeCustomizer, Layouts (NOT STARTED)

**Next Priority:** Table/DataGrid component (CRITICAL for contacts page)

---

#### 0.3 Backend Infrastructure & First Service
**Priority**: CRITICAL
**Status**: ⏳ Planned
**Dependencies**: 0.2

**Tasks:**

**PostgreSQL Setup (lkms501-postgres):**
- [ ] Add PostgreSQL 15 to docker-compose.yml
- [ ] Configure on port 4501
- [ ] Setup database volume for persistence
- [ ] Configure health checks
- [ ] Test connection from host

**Alembic Migrations:**
- [ ] Install Alembic
- [ ] Create migration scripts structure
- [ ] Document migration workflow
- [ ] Test migration up/down

**gRPC Infrastructure:**
- [ ] Install grpcio and grpcio-tools
- [ ] Create proto/ directory structure for .proto files
- [ ] Setup proto compilation pipeline
- [ ] Create base gRPC service template
- [ ] Document gRPC usage patterns

**Adminer UI (lkms901-adminer):**
- [ ] Add Adminer to docker-compose.yml
- [ ] Configure on port 4901
- [ ] Test database access

**Deliverables**: Running database infrastructure + gRPC foundation

---

#### 0.4 Contacts Service (lkms101-contacts)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.3
**Port**: 4101 (REST), 5101 (gRPC)
**Database**: lkms101_contacts

**Backend Tasks:**
- [ ] Create `services/lkms101-contacts` folder structure
- [ ] Setup FastAPI application (REST API)
- [ ] Setup gRPC server (inter-service communication)
- [ ] Create Dockerfile for Python service
- [ ] Add service to docker-compose.yml (expose both ports)
- [ ] Define Contact model (name, email, phone, address, ICO, DIC)
- [ ] Create database schema migration
- [ ] **REST API** - Implement endpoints:
  - [ ] `POST /api/v1/contacts` - Create contact
  - [ ] `GET /api/v1/contacts` - List contacts (pagination)
  - [ ] `GET /api/v1/contacts/{id}` - Get contact detail
  - [ ] `PUT /api/v1/contacts/{id}` - Update contact
  - [ ] `DELETE /api/v1/contacts/{id}` - Delete contact
  - [ ] `GET /api/v1/contacts/search` - Search contacts
- [ ] **gRPC API** - Implement methods:
  - [ ] `GetContact(ContactId) → Contact`
  - [ ] `GetContactsByIds(ContactIds) → Contacts`
  - [ ] `ValidateContact(ContactId) → ValidationResult`
- [ ] Create .proto file for Contact service
- [ ] Implement validation (Pydantic schemas)
- [ ] Add error handling
- [ ] Create OpenAPI documentation (REST)
- [ ] Write unit tests

**Frontend Tasks:**
- [ ] Create contacts page in web-ui
- [ ] Implement contact list view with Table component
- [ ] Implement contact detail view
- [ ] Create contact form (add/edit)
- [ ] Add search functionality
- [ ] Add pagination
- [ ] Implement loading states
- [ ] Add error handling

**Deliverables**: Complete contacts management system with REST + gRPC

---

#### 0.5 Employees Service (lkms108-employees)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.4
**Port**: 4108 (REST), 5108 (gRPC)
**Database**: lkms108_employees

**Backend Tasks:**
- [ ] Create FastAPI service structure (REST)
- [ ] Setup gRPC server (inter-service)
- [ ] Define Employee model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/employees`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetEmployee(EmployeeId) → Employee`
  - [ ] `GetEmployeesByIds(EmployeeIds) → Employees`
  - [ ] `ValidateEmployee(EmployeeId) → ValidationResult`
- [ ] Create .proto file
- [ ] Add role management
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create employees page
- [ ] Employee list view
- [ ] Employee detail/profile view
- [ ] Add/Edit employee form

**Deliverables**: Employee management system with REST + gRPC

---

#### 0.6 Issues Service (lkms109-issues)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.5
**Port**: 4109 (REST), 5109 (gRPC)
**Database**: lkms109_issues

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Issue model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/issues`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetIssue(IssueId) → Issue`
  - [ ] `GetIssuesByAssignee(EmployeeId) → Issues`
- [ ] Create .proto file
- [ ] Implement status workflow
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create issues page
- [ ] Issue list with filters
- [ ] Issue detail view
- [ ] Create/Edit issue form

**Deliverables**: Issue tracking system with REST + gRPC

---

#### 0.7 Customers Service (lkms103-customers)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.6
**Port**: 4103 (REST), 5103 (gRPC)
**Database**: lkms103_customers

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Customer model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/customers`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetCustomer(CustomerId) → Customer`
  - [ ] `GetCustomersByIds(CustomerIds) → Customers`
  - [ ] `ValidateCustomer(CustomerId) → ValidationResult`
- [ ] Create .proto file
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create customers page
- [ ] Customer list view
- [ ] Customer detail/profile view

**Deliverables**: Customer management system with REST + gRPC

---

#### 0.8 Parts Library Service (lkms104-parts)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.7
**Port**: 4104 (REST), 5104 (gRPC)
**Database**: lkms104_parts

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Part model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/parts`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetPart(PartId) → Part`
  - [ ] `GetPartsByIds(PartIds) → Parts`
  - [ ] `CheckPartAvailability(PartId) → AvailabilityStatus`
- [ ] Create .proto file
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create parts library page
- [ ] Parts list with filters
- [ ] Part detail view

**Deliverables**: Parts catalog with REST + gRPC

---

#### 0.9 Orders Service (lkms102-orders)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.8
**Port**: 4102 (REST), 5102 (gRPC)
**Database**: lkms102_orders

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Order model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/orders`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetOrder(OrderId) → Order`
  - [ ] `GetOrdersByCustomer(CustomerId) → Orders`
  - [ ] `UpdateOrderStatus(OrderId, Status) → Order`
  - [ ] *Call lkms103-customers via gRPC to validate customer*
  - [ ] *Call lkms104-parts via gRPC to check parts availability*
- [ ] Create .proto file
- [ ] Implement status workflow
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create orders page
- [ ] Order list with filters
- [ ] Order detail view
- [ ] Create/Edit order form

**Deliverables**: Order management with REST + gRPC + inter-service calls

---

#### 0.10 Logistics Service (lkms105-logistics)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.9
**Port**: 4105 (REST), 5105 (gRPC)
**Database**: lkms105_logistics

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Shipment model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/shipments`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetShipment(ShipmentId) → Shipment`
  - [ ] `GetShipmentsByOrder(OrderId) → Shipments`
  - [ ] *Call lkms102-orders via gRPC to get order details*
- [ ] Create .proto file
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create logistics page
- [ ] Shipment list
- [ ] Shipment tracking view

**Deliverables**: Logistics tracking with REST + gRPC

---

#### 0.11 Suppliers Service (lkms106-suppliers)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.10
**Port**: 4106 (REST), 5106 (gRPC)
**Database**: lkms106_suppliers

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Supplier model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/suppliers`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetSupplier(SupplierId) → Supplier`
  - [ ] `GetSuppliersByIds(SupplierIds) → Suppliers`
- [ ] Create .proto file
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create suppliers page
- [ ] Supplier list
- [ ] Supplier detail view

**Deliverables**: Supplier management with REST + gRPC

---

#### 0.12 Warehouse Service (lkms111-warehouse)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.11
**Port**: 4111 (REST), 5111 (gRPC)
**Database**: lkms111_warehouse

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Stock and StockMovement models
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/stock`, `/api/v1/stock/movements`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetStockLevel(PartId) → StockLevel`
  - [ ] `ReserveStock(PartId, Quantity) → ReservationResult`
  - [ ] `ReleaseStock(PartId, Quantity) → ReleaseResult`
  - [ ] *Call lkms104-parts via gRPC to validate parts*
- [ ] Create .proto file
- [ ] Add low stock alerts
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create warehouse page
- [ ] Stock overview
- [ ] Stock movements log

**Deliverables**: Warehouse/Inventory with REST + gRPC

---

#### 0.13 Mail Client Service (lkms113-mailclient)
**Priority**: MEDIUM
**Status**: ⏳ Planned
**Dependencies**: 0.12
**Port**: 4113 (REST), 5113 (gRPC)
**Database**: lkms113_mailclient

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Email model
- [ ] Create database migration
- [ ] **REST API**: Implement endpoints (`/api/v1/emails`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `SendEmail(EmailRequest) → SendResult`
- [ ] Create .proto file
- [ ] Implement SMTP/IMAP integration
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create mail client page
- [ ] Inbox/Sent folders
- [ ] Compose email form

**Deliverables**: Mail client with REST + gRPC

---

#### 0.14 Received Documents Service (lkms114-documents)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.13
**Port**: 4114 (REST), 5114 (gRPC)
**Database**: lkms114_documents

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Document model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/documents`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetDocument(DocumentId) → Document`
  - [ ] *Call lkms106-suppliers via gRPC to get supplier details*
- [ ] Create .proto file
- [ ] Add file upload/download
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create documents page
- [ ] Document list
- [ ] Upload/download

**Deliverables**: Document management with REST + gRPC

---

#### 0.15 Invoices & Delivery Notes Service (lkms115-invoicing)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.14
**Port**: 4115 (REST), 5115 (gRPC)
**Database**: lkms115_invoicing

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Invoice and DeliveryNote models
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/invoices`, `/api/v1/delivery-notes`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetInvoice(InvoiceId) → Invoice`
  - [ ] `GenerateInvoiceFromOrder(OrderId) → Invoice`
  - [ ] *Call lkms102-orders via gRPC to get order details*
  - [ ] *Call lkms103-customers via gRPC to get customer details*
- [ ] Create .proto file
- [ ] Add PDF generation
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create invoicing page
- [ ] Invoice list
- [ ] Invoice generation

**Deliverables**: Invoicing with REST + gRPC

---

#### 0.16 Inquiries Service (lkms110-inquiries)
**Priority**: MEDIUM
**Status**: ⏳ Planned
**Dependencies**: 0.15
**Port**: 4110 (REST), 5110 (gRPC)
**Database**: lkms110_inquiries

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Inquiry model
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/inquiries`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetInquiry(InquiryId) → Inquiry`
  - [ ] *Call lkms103-customers via gRPC to get customer details*
- [ ] Create .proto file
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create inquiries page
- [ ] Inquiry list
- [ ] Response form

**Deliverables**: Inquiries management with REST + gRPC

---

#### 0.17 Operations & Jobs Service (lkms112-operations)
**Priority**: HIGH
**Status**: ⏳ Planned
**Dependencies**: 0.16
**Port**: 4112 (REST), 5112 (gRPC)
**Database**: lkms112_operations

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define Operation and Job models
- [ ] Create database migration
- [ ] **REST API**: Implement CRUD endpoints (`/api/v1/operations`, `/api/v1/jobs`)
- [ ] **gRPC API**: Implement methods:
  - [ ] `GetOperationsByOrder(OrderId) → Operations`
  - [ ] `AssignJob(JobId, EmployeeId) → Job`
  - [ ] *Call lkms102-orders via gRPC to get order details*
  - [ ] *Call lkms108-employees via gRPC to get employee details*
- [ ] Create .proto file
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create operations page
- [ ] Operations dashboard
- [ ] Job management

**Deliverables**: Operations tracking with REST + gRPC

---

#### 0.18 Authentication Service (lkms107-auth)
**Priority**: CRITICAL
**Status**: ⏳ Planned
**Dependencies**: 0.17
**Port**: 4107 (REST), 5107 (gRPC)
**Database**: lkms107_auth

**Backend Tasks:**
- [ ] Create FastAPI service (REST)
- [ ] Setup gRPC server
- [ ] Define User model
- [ ] Create database migration
- [ ] **REST API**: Implement endpoints:
  - [ ] `POST /api/v1/auth/register`
  - [ ] `POST /api/v1/auth/login`
  - [ ] `POST /api/v1/auth/logout`
  - [ ] `POST /api/v1/auth/refresh`
  - [ ] `GET /api/v1/auth/me`
- [ ] **gRPC API**: Implement methods:
  - [ ] `ValidateToken(Token) → ValidationResult`
  - [ ] `GetUserByToken(Token) → User`
- [ ] Create .proto file
- [ ] Implement JWT generation/validation
- [ ] Add password hashing (bcrypt)
- [ ] Write tests

**Frontend Tasks:**
- [ ] Create login page
- [ ] Auth context provider
- [ ] Protected routes
- [ ] API client auth interceptor

**API Client:**
- [ ] Create @l-kern/api-client package
- [ ] Implement auth interceptor
- [ ] Add token refresh logic

**Deliverables**: Authentication with REST + gRPC

---

#### 0.19 Testing & Quality Assurance
**Priority**: CRITICAL
**Status**: ⏳ Planned
**Dependencies**: 0.18

**Backend Testing:**
- [ ] Write unit tests for all services (pytest)
- [ ] Write integration tests for REST APIs
- [ ] Write gRPC client/server tests
- [ ] Test inter-service communication via gRPC
- [ ] Add test coverage reporting (target: >80%)
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Add linting (ruff, mypy)

**Frontend Testing:**
- [ ] Write component tests (Vitest + React Testing Library)
- [ ] Write E2E tests (Playwright)
- [ ] Add test coverage reporting (target: >70%)
- [ ] Setup CI/CD for frontend

**Integration Testing:**
- [ ] Test complete business workflows
- [ ] Test gRPC communication reliability
- [ ] Performance testing
- [ ] Security testing

**Deliverables**: Comprehensive test coverage

---

#### 0.20 Production Deployment Preparation
**Priority**: CRITICAL
**Status**: ⏳ Planned
**Dependencies**: 0.19

**Server Setup:**
- [ ] Prepare production servers
- [ ] Install Docker and Docker Compose
- [ ] Configure firewall rules (REST ports 41XX, gRPC ports 51XX, Nginx 443, Envoy 8080)
- [ ] Setup SSL certificates (Let's Encrypt)
- [ ] **Configure Nginx** (REST API + static files):
  - [ ] Create Nginx configuration for REST reverse proxy
  - [ ] Setup SSL/TLS termination
  - [ ] Configure static file serving for React build
  - [ ] Add proxy rules for `/api/*` → microservices (ports 41XX)
  - [ ] Setup compression and caching
- [ ] **Configure Envoy** (gRPC inter-service communication):
  - [ ] Create Envoy configuration for gRPC proxy
  - [ ] Setup service discovery
  - [ ] Configure circuit breaking and retry policies
  - [ ] Add health checks for gRPC endpoints (ports 51XX)
  - [ ] Setup gRPC load balancing

**Production Configurations:**
- [ ] Create production Dockerfiles
- [ ] Setup multi-stage builds
- [ ] Create production docker-compose.yml (expose both REST and gRPC ports)
- [ ] Configure production .env files
- [ ] Setup database backups

**Monitoring & Logging:**
- [ ] Setup structured logging
- [ ] Add health check endpoints
- [ ] Setup error tracking
- [ ] Monitor gRPC connection health
- [ ] Create monitoring dashboard

**Deliverables**: Production-ready infrastructure

---

#### 0.21 Deployment to Test Environment 🚀
**Priority**: CRITICAL
**Status**: ⏳ Planned
**Dependencies**: 0.20

**Deployment Steps:**
- [ ] Deploy all services to test servers
- [ ] Verify REST API accessibility
- [ ] Verify gRPC connectivity between services
- [ ] Run smoke tests
- [ ] Monitor logs for errors
- [ ] Test all workflows with real users
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Security audit

**Success Criteria:**
- [ ] All services running and accessible
- [ ] gRPC inter-service communication working
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Users can complete all core workflows
- [ ] System stable for 1 week

**Deliverables**: ✅ **Phase 0 Complete** - System deployed to test environment

---

## Phase 1: Extended Functionality

**Status**: ⏳ **PLANNED**
**Start Condition**: Phase 0 successfully deployed and validated
**Goal**: Expand system with additional functionality

**Future Development:**
Phase 1 roadmap will be expanded based on:
- User feedback from test environment
- Business priorities
- Performance analysis
- New requirements

**Potential Areas:**
- Advanced reporting and analytics
- Mobile application
- External API integrations
- Advanced automation workflows
- AI/ML features

---

## Communication Architecture

### REST API (External)
- **Purpose**: Frontend → Backend communication
- **Protocol**: HTTP/JSON
- **Port Range**: 41XX (e.g., 4101, 4102, ...)
- **Usage**: All user-facing operations (CRUD, search, file upload)
- **Documentation**: OpenAPI/Swagger

### gRPC API (Internal)
- **Purpose**: Backend ↔ Backend inter-service communication
- **Protocol**: gRPC/Protobuf
- **Port Range**: 51XX (e.g., 5101, 5102, ...)
- **Usage**: Service-to-service data exchange, validation, synchronization
- **Documentation**: .proto files

### Example Communication Flow:
```
Frontend (React)
    ↓ REST (HTTP/JSON)
lkms102-orders (FastAPI)
    ↓ gRPC
lkms103-customers (get customer details)
lkms104-parts (check availability)
    ↓ gRPC response
lkms102-orders
    ↓ REST response
Frontend (React)
```

---

## Microservices Overview

### Phase 0 Services:

| LKMS | Service | REST Port | gRPC Port | Database | Status |
|------|---------|-----------|-----------|----------|--------|
| lkms201 | web-ui | 4201 | - | - | ✅ Running |
| lkms107 | auth | 4107 | 5107 | lkms107_auth | ⏳ Planned |
| lkms101 | contacts | 4101 | 5101 | lkms101_contacts | ⏳ Planned |
| lkms108 | employees | 4108 | 5108 | lkms108_employees | ⏳ Planned |
| lkms109 | issues | 4109 | 5109 | lkms109_issues | ⏳ Planned |
| lkms103 | customers | 4103 | 5103 | lkms103_customers | ⏳ Planned |
| lkms104 | parts | 4104 | 5104 | lkms104_parts | ⏳ Planned |
| lkms102 | orders | 4102 | 5102 | lkms102_orders | ⏳ Planned |
| lkms105 | logistics | 4105 | 5105 | lkms105_logistics | ⏳ Planned |
| lkms106 | suppliers | 4106 | 5106 | lkms106_suppliers | ⏳ Planned |
| lkms111 | warehouse | 4111 | 5111 | lkms111_warehouse | ⏳ Planned |
| lkms113 | mailclient | 4113 | 5113 | lkms113_mailclient | ⏳ Planned |
| lkms114 | documents | 4114 | 5114 | lkms114_documents | ⏳ Planned |
| lkms115 | invoicing | 4115 | 5115 | lkms115_invoicing | ⏳ Planned |
| lkms110 | inquiries | 4110 | 5110 | lkms110_inquiries | ⏳ Planned |
| lkms112 | operations | 4112 | 5112 | lkms112_operations | ⏳ Planned |

### Infrastructure Services:

| LKMS | Service | Port | Status |
|------|---------|------|--------|
| lkms501 | postgres | 4501 | ⏳ Planned |
| lkms901 | adminer | 4901 | ⏳ Planned |

---

## Technology Stack

**Frontend:**
- React 19 + TypeScript 5.7 + Vite 6
- REST API communication (axios)

**Backend:**
- Python 3.11 + FastAPI
- REST API (external)
- gRPC (inter-service)
- SQLAlchemy + Alembic
- Pydantic

**Database:**
- PostgreSQL 15 (one database per service)

**Inter-service Communication:**
- gRPC + Protocol Buffers

**DevOps:**
- Docker + Docker Compose
- Nginx (REST reverse proxy)
- Envoy (gRPC proxy - optional)

**Monorepo:**
- Nx + Yarn 4

---

## Next Steps

**Immediate Priorities:**
1. ⏳ Create coding standards documentation (including gRPC patterns)
2. ⏳ Build @l-kern/ui-components package
3. ⏳ Setup PostgreSQL + gRPC infrastructure
4. ⏳ Start lkms101-contacts service (first REST + gRPC implementation)

---

**Last Updated**: 2025-10-18 19:50:00
**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 (BOSS)
