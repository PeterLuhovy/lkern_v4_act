# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 3.0.0
# Created: 2025-10-13
# Updated: 2025-10-22
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
# ================================================================

---

## 📖 How to Use This Roadmap

**Purpose:** Complete development plan from MVP to production-ready system

**How to work with it:**
1. **Find current task** - Look for ⏳ IN PROGRESS status (always exactly ONE task)
2. **Complete task** - Change status to ✅ COMPLETED, add completion date
3. **Move to next** - Change next task from ⏸️ PLANNED to ⏳ IN PROGRESS
4. **Add new tasks** - When bugs/features arise, add under appropriate phase
5. **Update version** - Increment version (3.0.0 → 3.1.0) after changes
6. **Update dates** - Adjust target dates when delays occur

**Status symbols:**
- ✅ COMPLETED - Task finished (with date)
- ⏳ IN PROGRESS - Currently working (only ONE at a time!)
- ⏸️ PLANNED - Not started yet
- 🔴 CRITICAL - Blocker, must be done ASAP
- ⚠️ IMPORTANT - High priority
- 💡 NICE TO HAVE - Can wait

**Quick scan tip:** Čítaj len názvy taskov a statusy - za 5 sekúnd vidíš čo je hotové a čo ďalej!

---

## 🎯 CURRENT PRIORITY: Modal System v3.0 Implementation

**⚠️ ACTIVE WORK:** Modal System má PRIORITU pred Table/DataGrid!

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

### **Phase 2 Details: Core Modals (3 components)** ⏳ NEXT

**What to build:**

**1. ConfirmModal** (5-6h) - 🔴 FIRST
- Replaces MiniConfirmModal from v3
- Reusable confirmation dialog component
- Uses Modal + useConfirm hook internally
- SK/EN translations support
- Variants: delete, warning, info, success
- 15 unit tests
- Complete documentation (ConfirmModal.md)

**2. EditItemModal** (4-6h)
- Generic add/edit wrapper from v3
- Form validation integration
- useFormDirty integration (unsaved changes detection)
- Customizable fields via props
- 15 unit tests
- Documentation (EditItemModal.md)

**3. ManagementModal** (4-6h)
- List management wrapper from v3
- CRUD operations support
- Integrates with EditItemModal
- Add/Edit/Delete functionality
- 12 unit tests
- Documentation (ManagementModal.md)

**Deliverables:**
- 3 production-ready modal components ✅
- Complete documentation for each ✅
- 42 tests passing (15+15+12) ✅
- Export from @l-kern/ui-components ✅

**After Phase 2 → Continue to Phase 3 (Advanced Modals)**
**After Modal System complete (Phase 7) → Resume Table/DataGrid**

---

## 🎯 Version Strategy

**Current Version:** 4.0.0 (MVP Development)

| Version | Phase | Goal | Target Date | Status |
|---------|-------|------|-------------|--------|
| **4.0.x** | Phase 1 | MVP - Core functionality | 2026-03-10 | ⏳ IN PROGRESS |
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
**Timeline:** Oct 2025 - Mar 2026
**Progress:** 2.7/21 tasks (~12%)

---

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
**Target Completion:** 2025-10-27 (~5 days - Modal System v3.0 complete)

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
- ⏳ **ConfirmModal** - 🔴 NEXT (5-6h)
  - Replaces MiniConfirmModal from v3
  - Variants: delete, warning, info, success
  - SK/EN translations
  - 15 unit tests
- ⏸️ **EditItemModal** (4-6h)
  - Generic add/edit wrapper from v3
  - Form validation integration
  - useFormDirty integration
  - 15 unit tests
- ⏸️ **ManagementModal** (4-6h)
  - List management wrapper from v3
  - CRUD operations support
  - 12 unit tests

**Phase 3: Advanced Modals** (30-40h, target: 2025-11-01)
- ⏸️ **SectionEditModal** (12-16h)
  - Form builder with FieldDefinition system from v3
  - Dynamic field rendering
  - Validation framework
  - 20 unit tests
- ⏸️ **ModalDetailContact** (15-20h)
  - 3-level contact detail modal from v3
  - Section-based editing
  - Multi-value fields (emails, phones, addresses)
  - Backend API integration required
  - 25+ unit tests

**Phase 4: List Editors** (20-25h, target: 2025-11-05)
- ⏸️ **EmailListEditor** (3-4h) - Multi-email management
- ⏸️ **PhoneListEditor** (3-4h) - Multi-phone management
- ⏸️ **AddressListEditor** (4-5h) - Multi-address management
- ⏸️ **RoleListEditor** (2-3h) - Role management
- ⏸️ **WebsiteListEditor** (2-3h) - Website management
- ⏸️ **SocialNetworkListEditor** (3-4h) - Social media links
- Each with validation, uniqueness checks, tests

**Phase 5: Smart Autocomplete Components** (15-20h, target: 2025-11-08)
- ⏸️ **CountrySelect** (2-3h) - Country autocomplete with flags
- ⏸️ **LanguageSelect** (2-3h) - Language selection
- ⏸️ **TitleSelect** (2h) - Person title (Mr., Mrs., Dr., etc.)
- ⏸️ **RoleSelect** (2-3h) - Role/position autocomplete
- ⏸️ **CompanyAutocomplete** (3-4h) - Company search with API
- ⏸️ **AddressAutocomplete** (4-5h) - Address autofill integration

**Phase 6: Supporting Components** (8-12h, target: 2025-11-10)
- ⏸️ **ValidatedInput** (3-4h) - Universal validated input
- ⏸️ **ListManager** (3-4h) - Generic list management component
- ⏸️ **ModalButton** (2-3h) - Styled modal buttons from v3
- ⏸️ **ModalDebugHeader** (1-2h) - Development debug header

**Phase 7: Testing & Validation** (8-12h, target: 2025-11-12)
- ⏸️ Integration tests (15+)
- ⏸️ E2E scenarios
- ⏸️ Performance testing
- ⏸️ Accessibility audit

**Total Effort:** 100-130 hours (20-26 days @ 5h/day)
**Components to Port:** 22 modal components from v3

**1.2.4.2 Data Display** ⏸️ DEFERRED (After Modal System v3.0)
**Priority:** 🔴 CRITICAL - Next after modals

- ⏸️ **Table/DataGrid** - 🔴 CRITICAL (4-6h, target: 2025-10-28)
  - Sortable columns (ASC/DESC toggle)
  - Pagination (prev/next/page size)
  - Row selection (single/multi checkboxes)
  - Empty state + loading state
  - Responsive (horizontal scroll)
  - **Blocks:** ContactList page, all CRUD list pages

- ⏸️ **FilterAndSearch** - ⚠️ IMPORTANT (2-3h, target: 2025-10-29)
  - Search input with debounce
  - Filter dropdowns (status, category, date)
  - Clear filters button
  - Filter count badge

**1.2.4.3 Page Templates** ⏸️ DEFERRED
**Priority:** 💡 NICE TO HAVE

- ⏸️ **Page Layout Templates** (3-4h, target: 2025-10-30)
  - BasePageLayout (sidebar + header + content)
  - TableTemplate (header + filters + grid)
  - DashboardTemplate (widget grid)

**Current Stats:**
- Components: 17 production ✅
- Hooks: 6 ✅
- Utilities: 22 functions ✅
- Tests: 394/394 passing (100%) ✅

---

### **1.3 Backend Infrastructure** ⏸️ PLANNED
**Dependencies:** Task 1.2 complete
**Estimated:** 8-12 hours (2-3 days)
**Target Start:** 2025-10-31
**Target Completion:** 2025-11-02

#### **1.3.1 PostgreSQL Setup**
- ⏸️ Add PostgreSQL 15 to docker-compose.yml
- ⏸️ Configure on port 4501
- ⏸️ Setup database volume
- ⏸️ Configure health checks
- ⏸️ Test connection

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

#### **1.3.4 Adminer UI**
- ⏸️ Add Adminer to docker-compose.yml
- ⏸️ Configure on port 4901
- ⏸️ Test database access

---

### **1.4 Contacts Service (lkms101)** ⏸️ PLANNED
**Dependencies:** Task 1.3 complete
**Estimated:** 20-30 hours (5-7 days)
**Target Start:** 2025-11-03
**Target Completion:** 2025-11-10
**Ports:** 4101 (REST), 5101 (gRPC)
**Database:** lkms101_contacts

#### **1.4.1 Backend**
- ⏸️ Create FastAPI service structure
- ⏸️ Setup gRPC server
- ⏸️ Define Contact model
- ⏸️ Create database migration
- ⏸️ REST API: POST/GET/PUT/DELETE /api/v1/contacts
- ⏸️ REST API: GET /api/v1/contacts/search
- ⏸️ gRPC API: GetContact, GetContactsByIds, ValidateContact
- ⏸️ Create .proto file
- ⏸️ Validation (Pydantic schemas)
- ⏸️ Unit tests (pytest)

#### **1.4.2 Frontend**
- ⏸️ Contacts page
- ⏸️ Contact list view (with Table component)
- ⏸️ Contact detail view
- ⏸️ Contact form (add/edit)
- ⏸️ Search functionality
- ⏸️ Pagination
- ⏸️ Loading states
- ⏸️ Error handling

---

### **1.5 Employees Service (lkms108)** ⏸️ PLANNED
**Dependencies:** Task 1.4 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-11-11
**Target Completion:** 2025-11-16
**Ports:** 4108 (REST), 5108 (gRPC)
**Database:** lkms108_employees

#### **1.5.1 Backend**
- ⏸️ FastAPI service
- ⏸️ gRPC server
- ⏸️ Employee model
- ⏸️ Database migration
- ⏸️ REST API: CRUD /api/v1/employees
- ⏸️ gRPC API: GetEmployee, GetEmployeesByIds
- ⏸️ Role management
- ⏸️ Tests

#### **1.5.2 Frontend**
- ⏸️ Employees page
- ⏸️ Employee list view
- ⏸️ Employee detail view
- ⏸️ Add/Edit employee form

---

### **1.6 Issues Service (lkms109)** ⏸️ PLANNED
**Dependencies:** Task 1.5 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-11-17
**Target Completion:** 2025-11-22
**Ports:** 4109 (REST), 5109 (gRPC)
**Database:** lkms109_issues

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Issue model + database migration
- ⏸️ REST API: CRUD /api/v1/issues
- ⏸️ gRPC API: GetIssue, GetIssuesByAssignee
- ⏸️ Status workflow
- ⏸️ Frontend: Issues page + list + detail + form

---

### **1.7 Customers Service (lkms103)** ⏸️ PLANNED
**Dependencies:** Task 1.6 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-11-23
**Target Completion:** 2025-11-28
**Ports:** 4103 (REST), 5103 (gRPC)
**Database:** lkms103_customers

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Customer model + migration
- ⏸️ REST API: CRUD /api/v1/customers
- ⏸️ gRPC API: GetCustomer, ValidateCustomer
- ⏸️ Frontend: Customers page + list + detail

---

### **1.8 Parts Library Service (lkms104)** ⏸️ PLANNED
**Dependencies:** Task 1.7 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-11-29
**Target Completion:** 2025-12-04
**Ports:** 4104 (REST), 5104 (gRPC)
**Database:** lkms104_parts

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Part model + migration
- ⏸️ REST API: CRUD /api/v1/parts
- ⏸️ gRPC API: GetPart, CheckPartAvailability
- ⏸️ Frontend: Parts library page + list + detail

---

### **1.9 Orders Service (lkms102)** ⏸️ PLANNED
**Dependencies:** Task 1.8 complete
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2025-12-05
**Target Completion:** 2025-12-11
**Ports:** 4102 (REST), 5102 (gRPC)
**Database:** lkms102_orders

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Order model + migration
- ⏸️ REST API: CRUD /api/v1/orders
- ⏸️ gRPC API: GetOrder, GetOrdersByCustomer, UpdateOrderStatus
- ⏸️ **gRPC calls:** lkms103-customers (validate), lkms104-parts (check availability)
- ⏸️ Status workflow
- ⏸️ Frontend: Orders page + list + detail + form

---

### **1.10 Logistics Service (lkms105)** ⏸️ PLANNED
**Dependencies:** Task 1.9 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-12-12
**Target Completion:** 2025-12-17
**Ports:** 4105 (REST), 5105 (gRPC)
**Database:** lkms105_logistics

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Shipment model + migration
- ⏸️ REST API: CRUD /api/v1/shipments
- ⏸️ gRPC API: GetShipment, GetShipmentsByOrder
- ⏸️ **gRPC call:** lkms102-orders (get order details)
- ⏸️ Frontend: Logistics page + shipment list + tracking

---

### **1.11 Suppliers Service (lkms106)** ⏸️ PLANNED
**Dependencies:** Task 1.10 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2025-12-18
**Target Completion:** 2025-12-23
**Ports:** 4106 (REST), 5106 (gRPC)
**Database:** lkms106_suppliers

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Supplier model + migration
- ⏸️ REST API: CRUD /api/v1/suppliers
- ⏸️ gRPC API: GetSupplier, GetSuppliersByIds
- ⏸️ Frontend: Suppliers page + list + detail

---

### **1.12 Warehouse Service (lkms111)** ⏸️ PLANNED
**Dependencies:** Task 1.11 complete
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2025-12-24
**Target Completion:** 2025-12-30
**Ports:** 4111 (REST), 5111 (gRPC)
**Database:** lkms111_warehouse

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Stock + StockMovement models + migration
- ⏸️ REST API: /api/v1/stock, /api/v1/stock/movements
- ⏸️ gRPC API: GetStockLevel, ReserveStock, ReleaseStock
- ⏸️ **gRPC call:** lkms104-parts (validate parts)
- ⏸️ Low stock alerts
- ⏸️ Frontend: Warehouse page + stock overview + movements log

---

### **1.13 Mail Client Service (lkms113)** ⏸️ PLANNED
**Dependencies:** Task 1.12 complete
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2025-12-31
**Target Completion:** 2026-01-06
**Ports:** 4113 (REST), 5113 (gRPC)
**Database:** lkms113_mailclient

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Email model + migration
- ⏸️ REST API: /api/v1/emails
- ⏸️ gRPC API: SendEmail
- ⏸️ SMTP/IMAP integration
- ⏸️ Frontend: Mail client page + inbox/sent + compose form

---

### **1.14 Documents Service (lkms114)** ⏸️ PLANNED
**Dependencies:** Task 1.13 complete
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2026-01-07
**Target Completion:** 2026-01-13
**Ports:** 4114 (REST), 5114 (gRPC)
**Database:** lkms114_documents

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Document model + migration
- ⏸️ REST API: CRUD /api/v1/documents
- ⏸️ gRPC API: GetDocument
- ⏸️ **gRPC call:** lkms106-suppliers (get supplier details)
- ⏸️ File upload/download
- ⏸️ Frontend: Documents page + list + upload/download

---

### **1.15 Invoices & Delivery Notes (lkms115)** ⏸️ PLANNED
**Dependencies:** Task 1.14 complete
**Estimated:** 25-30 hours (6-7 days)
**Target Start:** 2026-01-14
**Target Completion:** 2026-01-21
**Ports:** 4115 (REST), 5115 (gRPC)
**Database:** lkms115_invoicing

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Invoice + DeliveryNote models + migration
- ⏸️ REST API: /api/v1/invoices, /api/v1/delivery-notes
- ⏸️ gRPC API: GetInvoice, GenerateInvoiceFromOrder
- ⏸️ **gRPC calls:** lkms102-orders, lkms103-customers
- ⏸️ PDF generation
- ⏸️ Frontend: Invoicing page + invoice list + generation

---

### **1.16 Inquiries Service (lkms110)** ⏸️ PLANNED
**Dependencies:** Task 1.15 complete
**Estimated:** 15-20 hours (4-5 days)
**Target Start:** 2026-01-22
**Target Completion:** 2026-01-27
**Ports:** 4110 (REST), 5110 (gRPC)
**Database:** lkms110_inquiries

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Inquiry model + migration
- ⏸️ REST API: CRUD /api/v1/inquiries
- ⏸️ gRPC API: GetInquiry
- ⏸️ **gRPC call:** lkms103-customers
- ⏸️ Frontend: Inquiries page + list + response form

---

### **1.17 Operations & Jobs (lkms112)** ⏸️ PLANNED
**Dependencies:** Task 1.16 complete
**Estimated:** 20-25 hours (5-6 days)
**Target Start:** 2026-01-28
**Target Completion:** 2026-02-03
**Ports:** 4112 (REST), 5112 (gRPC)
**Database:** lkms112_operations

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ Operation + Job models + migration
- ⏸️ REST API: /api/v1/operations, /api/v1/jobs
- ⏸️ gRPC API: GetOperationsByOrder, AssignJob
- ⏸️ **gRPC calls:** lkms102-orders, lkms108-employees
- ⏸️ Frontend: Operations page + dashboard + job management

---

### **1.18 Authentication Service (lkms107)** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.17 complete
**Estimated:** 25-30 hours (6-7 days)
**Target Start:** 2026-02-04
**Target Completion:** 2026-02-11
**Ports:** 4107 (REST), 5107 (gRPC)
**Database:** lkms107_auth

- ⏸️ Backend: FastAPI + gRPC
- ⏸️ User model + migration
- ⏸️ REST API: register, login, logout, refresh, /me
- ⏸️ gRPC API: ValidateToken, GetUserByToken
- ⏸️ JWT generation/validation
- ⏸️ Password hashing (bcrypt)
- ⏸️ Tests
- ⏸️ Frontend: Login page + auth context + protected routes
- ⏸️ API Client: @l-kern/api-client + auth interceptor + token refresh

---

### **1.19 Testing & QA** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.18 complete
**Estimated:** 40-60 hours (10-14 days)
**Target Start:** 2026-02-12
**Target Completion:** 2026-02-26

- ⏸️ **Backend Testing:**
  - Unit tests for all services (pytest)
  - Integration tests for REST APIs
  - gRPC client/server tests
  - Inter-service communication tests
  - Test coverage >80%
- ⏸️ **Frontend Testing:**
  - Component tests (Vitest + RTL)
  - E2E tests (Playwright)
  - Test coverage >70%
- ⏸️ **Integration Testing:**
  - Complete business workflows
  - gRPC communication reliability
  - Performance testing
  - Security testing
- ⏸️ **CI/CD:**
  - GitHub Actions setup
  - Automated linting (ruff, mypy)

---

### **1.20 Production Deployment Prep** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.19 complete
**Estimated:** 30-40 hours (7-10 days)
**Target Start:** 2026-02-27
**Target Completion:** 2026-03-09

- ⏸️ **Server Setup:**
  - Prepare production servers
  - Install Docker + Docker Compose
  - Configure firewall rules (REST 41XX, gRPC 51XX, Nginx 443, Envoy 8080)
  - Setup SSL certificates (Let's Encrypt)
- ⏸️ **Nginx Configuration (REST + static):**
  - REST reverse proxy
  - SSL/TLS termination
  - Static file serving (React build)
  - Proxy rules /api/* → microservices
  - Compression + caching
- ⏸️ **Envoy Configuration (gRPC):**
  - gRPC proxy
  - Service discovery
  - Circuit breaking + retry policies
  - Health checks (ports 51XX)
  - gRPC load balancing
- ⏸️ **Production Configurations:**
  - Production Dockerfiles
  - Multi-stage builds
  - Production docker-compose.yml (REST + gRPC ports)
  - Production .env files
  - Database backups
- ⏸️ **Monitoring & Logging:**
  - Structured logging
  - Health check endpoints
  - Error tracking
  - gRPC connection health monitoring
  - Monitoring dashboard

---

### **1.21 Deploy MVP to Production** ⏸️ PLANNED - 🔴 CRITICAL
**Dependencies:** Task 1.20 complete
**Estimated:** 10-20 hours (3-5 days)
**Target Start:** 2026-03-10
**Target Completion:** 2026-03-15

- ⏸️ Deploy all services to production
- ⏸️ Verify REST API accessibility
- ⏸️ Verify gRPC connectivity
- ⏸️ Run smoke tests
- ⏸️ Monitor logs for errors
- ⏸️ Test all workflows with real users
- ⏸️ Collect user feedback
- ⏸️ Fix critical bugs
- ⏸️ Performance optimization
- ⏸️ Security audit

**Success Criteria:**
- ✅ All services running and accessible
- ✅ gRPC inter-service communication working
- ✅ No critical bugs
- ✅ Performance acceptable
- ✅ Users can complete all core workflows
- ✅ System stable for 1 week

**→ When complete: Upgrade to v4.1.0 and start Phase 2**

---

## 📋 PHASE 2: Security & Stability (v4.1.x)

**Goal:** Harden security, fix bugs, stabilize for production
**Start:** After Phase 1 complete (target: Mar 2026)
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
- Critical bug fixes
- Performance tuning

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

**Business Intelligence:**
- Executive dashboard
- Trend analysis
- Forecasting
- Inventory optimization
- Sales pipeline analytics

**Customer & Supplier Portals:**
- Self-service portal
- Order tracking
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
- REST API (external communication)
- gRPC (inter-service communication)
- SQLAlchemy + Alembic (ORM + migrations)
- Pydantic (validation)

**DevOps:**
- Docker + Docker Compose (development)
- Nginx (REST reverse proxy)
- Envoy (gRPC proxy - optional)
- Nx + Yarn 4 (monorepo)

---

## 📊 Quick Progress Overview

**Phase 1 Progress:** 2.7/21 tasks complete (~12%)

| Task | Status | Target Completion |
|------|--------|-------------------|
| 1.0 Infrastructure | ✅ COMPLETED | 2025-10-15 |
| 1.1 Coding Standards | ✅ COMPLETED | 2025-10-15 |
| 1.2 UI Infrastructure | ⏳ IN PROGRESS | 2025-10-27 |
| 1.3 Backend Infrastructure | ⏸️ PLANNED | 2025-11-02 |
| 1.4 Contacts Service | ⏸️ PLANNED | 2025-11-10 |
| 1.5 Employees Service | ⏸️ PLANNED | 2025-11-16 |
| 1.6 Issues Service | ⏸️ PLANNED | 2025-11-22 |
| 1.7 Customers Service | ⏸️ PLANNED | 2025-11-28 |
| 1.8 Parts Service | ⏸️ PLANNED | 2025-12-04 |
| 1.9 Orders Service | ⏸️ PLANNED | 2025-12-11 |
| 1.10 Logistics | ⏸️ PLANNED | 2025-12-17 |
| 1.11 Suppliers | ⏸️ PLANNED | 2025-12-23 |
| 1.12 Warehouse | ⏸️ PLANNED | 2025-12-30 |
| 1.13 Mail Client | ⏸️ PLANNED | 2026-01-06 |
| 1.14 Documents | ⏸️ PLANNED | 2026-01-13 |
| 1.15 Invoicing | ⏸️ PLANNED | 2026-01-21 |
| 1.16 Inquiries | ⏸️ PLANNED | 2026-01-27 |
| 1.17 Operations | ⏸️ PLANNED | 2026-02-03 |
| 1.18 Authentication | ⏸️ PLANNED | 2026-02-11 |
| 1.19 Testing & QA | ⏸️ PLANNED | 2026-02-26 |
| 1.20 Production Prep | ⏸️ PLANNED | 2026-03-09 |
| 1.21 Deploy to Production | ⏸️ PLANNED | 2026-03-15 |

---

**Last Updated:** 2025-10-22
**Maintainer:** BOSSystems s.r.o.
**Current Version:** 4.0.0 (Phase 1 - MVP Development)
**Next Milestone:** Complete Modal System v3.0 (Phase 2-5) by 2025-10-27
