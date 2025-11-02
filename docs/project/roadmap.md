# ================================================================
# L-KERN v4 - Development Roadmap
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\project\roadmap.md
# Version: 4.3.0
# Created: 2025-10-13
# Updated: 2025-11-02
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
**Progress:** 2.85/21 tasks (~14%)
**Architecture:** Domain-Driven Microservices

---

### **1.1 Infrastructure Setup** ✅ COMPLETED (2025-10-15)
- ✅ Nx workspace (Yarn 4 + TypeScript 5.7)
- ✅ Docker development environment
- ✅ React 19 web-ui (port 4201)
- ✅ @l-kern/config package
- ✅ Documentation structure
- ✅ Port mapping strategy (LKMS{XXX} → 4{XXX})

---

### **1.2 Coding Standards** ✅ COMPLETED (2025-10-15)
- ✅ coding-standards.md (2235 lines)
- ✅ code-examples.md (1700 lines)
- ✅ TypeScript, React, Python conventions
- ✅ Testing standards (pytest + Vitest)

---

### **1.3 UI Infrastructure (@l-kern/ui-components)** ⏳ IN PROGRESS (~85%)
**Started:** 2025-10-18
**Target:** 2025-11-08

#### **1.3.1 Form Components** ✅ COMPLETED
- ✅ Button (primary, secondary, danger, danger-subtle, ghost, success)
- ✅ Input, FormField (controlled + uncontrolled)
- ✅ Select, Checkbox, Radio/RadioGroup
- ✅ 115 tests passing

#### **1.3.2 Layout Components** ✅ COMPLETED
- ✅ Card, Badge, Spinner, EmptyState
- ✅ 67 tests passing

#### **1.3.3 Utility Functions** ✅ COMPLETED
- ✅ phoneUtils, emailUtils, dateUtils, validation
- ✅ 148 tests passing

#### **1.3.4 Modal System v3.0** ⏳ IN PROGRESS (~85%)
**Reference:** See [implementation-plan-modal-system-v3.md](../temp/implementation-plan-modal-system-v3.md) for detailed specs (6 phases, 60-90h)

**1.3.4.1 Base Infrastructure** ✅ COMPLETED
- ✅ Modal component (centered, drag & drop, nested modals) - 46 tests
- ✅ ModalContext, WizardProgress, WizardNavigation
- ✅ Toast, DashboardCard, DebugBar
- ✅ modalStack utility (Modal stack management)

**1.3.4.2 Modal Hooks** ✅ COMPLETED
- ✅ useModal, useModalWizard (wizard workflows)
- ✅ useFormDirty (unsaved changes detection) - [See Phase 1](../temp/implementation-plan-modal-system-v3.md#phase-1-core-hooks--utilities-8-10h)
- ✅ useConfirm (promise-based confirmation API) - [See Phase 1](../temp/implementation-plan-modal-system-v3.md#phase-1-core-hooks--utilities-8-10h)
- ✅ useToast, usePageAnalytics

**1.3.4.3 Core Modals** ✅ COMPLETED (4/4 complete)
- ✅ **ConfirmModal** (15 tests, v1.0.0) - [See Phase 2](../temp/implementation-plan-modal-system-v3.md#phase-2-confirmmodal-component-5-6h)
  - Simple mode (Yes/No confirmation)
  - Danger mode (keyword confirmation "ano")
  - SK/EN translations
- ✅ **EditItemModal** (20 tests, v1.0.0, 2025-10-30) - [See Phase 3.1](../temp/implementation-plan-modal-system-v3.md#31-edititemmodal-template-3-4h)
  - Generic add/edit wrapper
  - useFormDirty integration
  - Clear button (🧹 danger-subtle variant)
  - Unsaved changes confirmation
- ✅ **ManagementModal** (33 tests, v1.0.0, 2025-11-01) - [See Phase 3.2](../temp/implementation-plan-modal-system-v3.md#32-managementmodal-template-3-4h)
  - Generic list management wrapper
  - Delete all with danger confirmation
  - Empty state support
  - Primary item support (star marking + sorting)
  - Dirty tracking (hasUnsavedChanges prop)
  - Test suite refactored: 33 comprehensive tests (2025-11-01)
- ✅ **SectionEditModal** (60 tests, v1.0.0, 2025-11-02) - [See Phase 3.3](../temp/implementation-plan-modal-system-v3.md#33-sectioneditmodal-template-6-8h)
  - Form builder with FieldDefinition system
  - Dynamic field rendering (text, email, number, date, select, textarea)
  - HTML5 validation + custom validation
  - Clear form button with confirmation
  - Unsaved changes detection (useFormDirty + useConfirm)
  - Translation key validation tests
  - Props & variants tests (size, custom text, pattern, min, max)
  - 60 comprehensive tests passing (2025-11-02)

**1.3.4.4 Modal Enhancements** ⏸️ PLANNED (4-6h) - [See Phase 4](../temp/implementation-plan-modal-system-v3.md#phase-4-enhancements-4-6h)
- ⏸️ Card accent variant (purple border + glow, 2-3h)
- ⏸️ Toast test page (visual testing UI, 1-2h)
- ⏸️ Documentation updates (1h)

**Progress:** ~50h done / 60-90h total (~75% complete) | Remaining: Enhancements (~5-10h)

#### **1.3.5 Data Display** ⏸️ DEFERRED (After modals)
- ⏸️ Table/DataGrid (4-6h)
- ⏸️ FilterAndSearch (2-3h)

---

### **1.4 Backend Infrastructure** ⏸️ PLANNED
**Dependencies:** 1.3 complete
**Estimated:** 12-16h (3-4 days)
**Target:** 2025-11-13 - 2025-11-17

#### **1.4.1 PostgreSQL Setup**
- ⏸️ PostgreSQL 15 (port 4501)
- ⏸️ Database per service strategy

#### **1.4.2 Alembic Migrations**
- ⏸️ Install + configure

#### **1.4.3 gRPC Infrastructure**
- ⏸️ grpcio + proto compilation

#### **1.4.4 Apache Kafka**
- ⏸️ Kafka + Zookeeper (port 9092)
- ⏸️ Topic setup

#### **1.4.5 Adminer UI**
- ⏸️ Add to docker-compose (port 4901)

---

### **1.5 System Health & Backup API** ⏸️ PLANNED
**Dependencies:** 1.4 complete
**Estimated:** 2-3h
**Target:** 2025-11-17

#### **1.5.1 Health Monitoring**
- ⏸️ GET /api/v1/system/health

#### **1.5.2 Backup Management**
- ⏸️ POST /api/v1/system/backup
- ⏸️ GET /api/v1/system/backup/status

---

### **1.6 Page Templates (StatusBar)** ⏸️ PLANNED
**Dependencies:** 1.5 complete
**Estimated:** 5-7h
**Target:** 2025-11-18 - 2025-11-20

#### **1.6.1 StatusBar Component** (3-4h)
- ⏸️ Port from v3 (v2.1.0)
- ⏸️ System monitoring, backup UI
- ⏸️ Theme/language toggles
- ⏸️ 20 unit tests

#### **1.6.2 StatusBadge Component** (1h)
- ⏸️ Port from v3
- ⏸️ 8 unit tests

#### **1.6.3 BaseLayout Integration** (1-2h)
- ⏸️ BaseLayout + BaseLayoutDataContext
- ⏸️ 10 integration tests

---

### **1.7 Contact (MDM) Service** ⏸️ PLANNED
**Dependencies:** 1.4 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2025-11-18 - 2025-11-25
**Ports:** 4101 (REST), 5101 (gRPC)
**Database:** lkms101_contacts

**Master Data Management - Single Source of Truth**

#### **1.7.1 Backend**
- ⏸️ FastAPI + gRPC service
- ⏸️ Contact model (UUID, Name, Address, Tax ID)
- ⏸️ **NO sensitive data** (NO bank accounts, NO salaries)
- ⏸️ REST + gRPC APIs
- ⏸️ Kafka: ContactCreated/Updated/Deleted

#### **1.7.2 Frontend**
- ⏸️ Contacts page (with Table)
- ⏸️ List, detail, add/edit views

---

### **1.8 Configuration Service** ⏸️ PLANNED
**Dependencies:** 1.4 complete
**Estimated:** 15-20h (4-5 days)
**Target:** 2025-11-18 - 2025-11-23 (parallel with 1.7)
**Ports:** 4199 (REST), 5199 (gRPC)
**Database:** lkms199_config

**Global settings (COA, VAT, currencies)**

#### **1.8.1 Backend**
- ⏸️ FastAPI + gRPC service
- ⏸️ Models: COA, VAT, currencies, periods

#### **1.8.2 Frontend**
- ⏸️ Configuration page

---

### **1.9 HR / Payroll Service** ⏸️ PLANNED
**Dependencies:** 1.7 complete
**Estimated:** 20-25h (5-6 days)
**Target:** 2025-11-26 - 2025-12-02
**Ports:** 4108 (REST), 5108 (gRPC)
**Database:** lkms108_employees

**GDPR-protected sensitive employee data**

#### **1.9.1 Backend**
- ⏸️ FastAPI + gRPC service
- ⏸️ **SENSITIVE:** Salaries, Personal IDs, Bank accounts (employees only)
- ⏸️ **Production data:** Work roles, qualifications
- ⏸️ Kafka: EmployeeCreated/RoleChanged/Absent/Available

#### **1.9.2 Frontend**
- ⏸️ Employees page

**Security:** STRICT access control, GDPR audit logging

---

### **1.10 Inventory / Logistics Service** ⏸️ PLANNED
**Dependencies:** 1.7, 1.8, 1.9 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2025-12-03 - 2025-12-10
**Ports:** 4111 (REST), 5111 (gRPC)
**Database:** lkms111_warehouse

#### **1.10.1 Backend**
- ⏸️ Models: Products, stock, goods receipts/issues
- ⏸️ Kafka: GoodsReceived/Issued, StockLevelCritical

#### **1.10.2 Frontend**
- ⏸️ Inventory page

---

### **1.11 Purchasing (AP) Service** ⏸️ PLANNED
**Dependencies:** 1.7, 1.8, 1.10 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2025-12-11 - 2025-12-21
**Ports:** 4106 (REST), 5106 (gRPC)
**Database:** lkms106_purchasing

**Vendors + PO + Invoices AP + 3-Way Match**

#### **1.11.1 Backend**
- ⏸️ Models: Vendor data, RFQ, PO, Received Invoices
- ⏸️ **Vendor bank accounts stored HERE**
- ⏸️ **3-Way Match:** PO → Goods Receipt → Invoice
- ⏸️ Kafka: PO events, Consume GoodsReceived

#### **1.11.2 Frontend**
- ⏸️ Purchasing page
- ⏸️ 3-Way match dashboard

---

### **1.12 Sales (AR) Service** ⏸️ PLANNED
**Dependencies:** 1.7, 1.8, 1.10 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2025-12-22 - 2026-01-02
**Ports:** 4103 (REST), 5103 (gRPC)
**Database:** lkms103_sales

**Customers + SO + Invoices AR + Overdue Tracking**

#### **1.12.1 Backend**
- ⏸️ Models: Customer data, Quotations, SO, Issued Invoices
- ⏸️ **Customer bank accounts stored HERE**
- ⏸️ **Overdue tracking:** Daily job → InvoiceOverdue event
- ⏸️ Kafka: SO events, Consume GoodsIssued

#### **1.12.2 Frontend**
- ⏸️ Sales page
- ⏸️ Overdue dashboard

---

### **1.13 Manufacturing Service** ⏸️ PLANNED
**Dependencies:** 1.10, 1.12 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2026-01-03 - 2026-01-10
**Ports:** 4112 (REST), 5112 (gRPC)
**Database:** lkms112_manufacturing

#### **1.13.1 Backend**
- ⏸️ Models: BOM, work centers, machines, work orders
- ⏸️ Kafka: WorkOrderCompleted, MachineDown/Available

#### **1.13.2 Frontend**
- ⏸️ Manufacturing page

---

### **1.14 Production Planning & Quality (PPQ)** ⏸️ PLANNED
**Dependencies:** 1.9, 1.12, 1.13 complete
**Estimated:** 40-50h (10-12 days)
**Target:** 2026-01-11 - 2026-01-23
**Ports:** TBD
**Database:** lkms_ppq

**Simple priority rules first, advanced optimization later**

#### **1.14.1 Backend (MVP)**
- ⏸️ **Simple rules:** Quality → best accuracy, Speed → fastest
- ⏸️ Models: Production calendar, resource assignments
- ⏸️ Kafka: Consume SalesOrderCreated, MachineDown, EmployeeAbsent

#### **1.14.2 Frontend**
- ⏸️ Planning dashboard

---

### **1.15 Operations (BPM)** ⏸️ PLANNED
**Dependencies:** 1.9, 1.11, 1.12, 1.13, 1.14 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2026-01-24 - 2026-02-03
**Ports:** TBD
**Database:** lkms_operations

**Workflow orchestration - end-to-end process management**

#### **1.15.1 Backend**
- ⏸️ Workflow definitions: CustomerQuote, PO Approval, MonthEnd, OrderFulfillment
- ⏸️ Models: Workflows, job queue, assignments
- ⏸️ **Dynamic job assignment:** Query HR by role
- ⏸️ Kafka: Consume multiple events

#### **1.15.2 Frontend**
- ⏸️ Operations dashboard
- ⏸️ My Jobs page

---

### **1.16 Finance (GL) Service** ⏸️ PLANNED
**Dependencies:** 1.8, 1.11, 1.12, 1.13 complete
**Estimated:** 35-40h (8-10 days)
**Target:** 2026-02-04 - 2026-02-14
**Ports:** TBD
**Database:** lkms_finance

**Accounting backbone - consolidates all transactions**

#### **1.16.1 Backend**
- ⏸️ Models: COA, GL entries, balances, periods
- ⏸️ **Automatic posting:** Events → GL entries
- ⏸️ **Tax compliance:** VAT reporting (SK)
- ⏸️ Kafka: Consume InvoiceIssued/Received, GoodsIssued, PaymentReceived

#### **1.16.2 Frontend**
- ⏸️ Finance dashboard
- ⏸️ GL viewer, reports, VAT returns

---

### **1.17 Cash & Bank Service** ⏸️ PLANNED
**Dependencies:** 1.10, 1.11, 1.15 complete
**Estimated:** 20-25h (5-6 days)
**Target:** 2026-02-15 - 2026-02-21
**Ports:** TBD
**Database:** lkms_cash_bank

#### **1.17.1 Backend**
- ⏸️ Models: Bank accounts, statements, payment orders
- ⏸️ **Payment matching:** Auto-match with AR/AP invoices
- ⏸️ Kafka: PaymentReceived/Sent, PaymentMatched

#### **1.17.2 Frontend**
- ⏸️ Cash & Bank dashboard

---

### **1.18 Authentication Service** ⏸️ PLANNED
**Dependencies:** 1.16 complete
**Estimated:** 25-30h (6-7 days)
**Target:** 2026-02-22 - 2026-03-01
**Ports:** 4107 (REST), 5107 (gRPC)
**Database:** lkms107_auth

#### **1.18.1 Backend**
- ⏸️ User model, JWT, bcrypt, RBAC
- ⏸️ REST + gRPC APIs

#### **1.18.2 Frontend**
- ⏸️ Login page
- ⏸️ Auth context + protected routes

---

### **1.19 Testing & QA** ⏸️ PLANNED
**Dependencies:** 1.18 complete
**Estimated:** 50-70h (12-17 days)
**Target:** 2026-03-02 - 2026-03-19

- ⏸️ **Backend:** Unit, integration, gRPC, Kafka tests (>80%)
- ⏸️ **Frontend:** Component, E2E tests (>70%)
- ⏸️ **Integration:** Full workflows, 3-Way match, overdue tracking
- ⏸️ **CI/CD:** GitHub Actions

---

### **1.20 Production Deployment Prep** ⏸️ PLANNED
**Dependencies:** 1.19 complete
**Estimated:** 35-45h (8-11 days)
**Target:** 2026-03-20 - 2026-03-31

- ⏸️ **Server:** Docker, firewall, SSL
- ⏸️ **Kafka Production:** Cluster config
- ⏸️ **Nginx:** Reverse proxy
- ⏸️ **Monitoring:** Logging, health checks

---

### **1.21 Deploy MVP to Production** ⏸️ PLANNED
**Dependencies:** 1.20 complete
**Estimated:** 15-25h (4-6 days)
**Target:** 2026-04-01 - 2026-04-07

- ⏸️ Deploy all 14+ microservices
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

### **2.1 Security Hardening** ⏸️ PLANNED
**Estimated:** 30-40h

- ⏸️ Dependency updates
- ⏸️ Penetration testing
- ⏸️ GDPR compliance audit
- ⏸️ Authentication hardening
- ⏸️ API rate limiting
- ⏸️ Input validation review

---

### **2.2 Performance Optimization** ⏸️ PLANNED
**Estimated:** 25-35h

- ⏸️ Database query optimization
- ⏸️ Kafka optimization
- ⏸️ Load testing
- ⏸️ Caching strategy
- ⏸️ Bundle size optimization
- ⏸️ API response time tuning

---

### **2.3 Bug Fixes & Stability** ⏸️ PLANNED
**Estimated:** 40-50h

- ⏸️ Production bug fixes
- ⏸️ Error handling improvements
- ⏸️ Logging improvements
- ⏸️ Monitoring dashboard
- ⏸️ User feedback implementation

---

### **2.4 PPQ Advanced Algorithms** ⏸️ PLANNED
**Estimated:** 30-40h

- ⏸️ Multi-criteria optimization (quality + speed + cost)
- ⏸️ Constraint-based scheduling
- ⏸️ Machine learning predictions
- ⏸️ Real-time rescheduling

---

### **2.5 Optional Services** ⏸️ PLANNED
**Estimated:** 50-70h

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
**Status:** ⏸️ PLANNED

---

### **3.1 High Availability** ⏸️ PLANNED
**Estimated:** 40-50h

- ⏸️ Database replication
- ⏸️ Kafka cluster HA
- ⏸️ Load balancing
- ⏸️ Failover strategies
- ⏸️ Multi-region deployment

---

### **3.2 Disaster Recovery** ⏸️ PLANNED
**Estimated:** 30-40h

- ⏸️ Automated backups
- ⏸️ Backup testing
- ⏸️ Recovery procedures
- ⏸️ Rollback mechanisms
- ⏸️ Incident response plan

---

### **3.3 Advanced Monitoring** ⏸️ PLANNED
**Estimated:** 25-35h

- ⏸️ APM (Application Performance Monitoring)
- ⏸️ Distributed tracing
- ⏸️ Alerting system
- ⏸️ Capacity planning
- ⏸️ SLA monitoring

---

### **3.4 Technical Debt Reduction** ⏸️ PLANNED
**Estimated:** 40-60h

- ⏸️ Code refactoring
- ⏸️ Documentation refinement
- ⏸️ Test coverage improvements
- ⏸️ Dependency cleanup
- ⏸️ Architecture simplification

---

### **3.5 Team Training** ⏸️ PLANNED
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

### **4.1 Advanced Reporting & Analytics** ⏸️ PLANNED
- Custom report builder
- Data visualization dashboards
- Export to Excel/PDF
- Scheduled reports
- Real-time analytics
- KPI tracking

---

### **4.2 Mobile Application** ⏸️ PLANNED
- React Native mobile app
- Offline mode support
- Push notifications
- Mobile-optimized workflows
- Camera integration

---

### **4.3 External Integrations** ⏸️ PLANNED
- Accounting software (Pohoda, Money S3)
- CRM systems
- E-commerce platforms
- Payment gateways
- Shipping providers

---

### **4.4 AI/ML Features** ⏸️ PLANNED
- Predictive analytics
- Anomaly detection
- Document classification
- OCR for invoices
- Chatbot support
- **PPQ machine learning:** Predict optimal resources

---

### **4.5 Business Intelligence** ⏸️ PLANNED
- Executive dashboard
- Trend analysis
- Forecasting
- Inventory optimization
- Sales pipeline analytics

---

### **4.6 Customer & Supplier Portals** ⏸️ PLANNED
- Self-service portal
- Order tracking (from Operations service)
- Invoice downloads
- Support tickets
- Document uploads

---

### **4.7 Multi-tenancy** ⏸️ PLANNED
- Support multiple companies
- Isolated data per tenant
- Shared infrastructure
- Custom branding per tenant

---

### **4.8 Advanced Features** ⏸️ PLANNED
- Multi-language support (DE, HU, PL)
- Multi-currency support
- Audit logging
- Version history
- Data archiving

---

### **4.9 Collaboration Tools** ⏸️ PLANNED
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

**Phase 1 Progress:** 2.7/21 tasks complete (~13%)

| Task | Status | Target | Architecture |
|------|--------|--------|--------------|
| 1.1 Infrastructure | ✅ COMPLETED | 2025-10-15 | Foundation |
| 1.2 Coding Standards | ✅ COMPLETED | 2025-10-15 | Foundation |
| 1.3 UI Infrastructure | ⏳ IN PROGRESS | 2025-11-12 | Frontend |
| 1.4 Backend Infrastructure | ⏸️ PLANNED | 2025-11-17 | Backend + Kafka |
| 1.5 System Health API | ⏸️ PLANNED | 2025-11-17 | Monitoring |
| 1.6 Page Templates | ⏸️ PLANNED | 2025-11-20 | Frontend |
| 1.7 Contact (MDM) | ⏸️ PLANNED | 2025-11-25 | Master Data |
| 1.8 Configuration | ⏸️ PLANNED | 2025-11-23 | Settings |
| 1.9 HR / Payroll | ⏸️ PLANNED | 2025-12-02 | GDPR Protected |
| 1.10 Inventory | ⏸️ PLANNED | 2025-12-10 | Physical Stock |
| 1.11 Purchasing (AP) | ⏸️ PLANNED | 2025-12-21 | Vendors + PO + AP |
| 1.12 Sales (AR) | ⏸️ PLANNED | 2026-01-02 | Customers + SO + AR |
| 1.13 Manufacturing | ⏸️ PLANNED | 2026-01-10 | Production |
| 1.14 PPQ | ⏸️ PLANNED | 2026-01-23 | Planning + Quality |
| 1.15 Operations (BPM) | ⏸️ PLANNED | 2026-02-03 | Workflow Orchestration |
| 1.16 Finance (GL) | ⏸️ PLANNED | 2026-02-14 | Accounting |
| 1.17 Cash & Bank | ⏸️ PLANNED | 2026-02-21 | Payment Processing |
| 1.18 Authentication | ⏸️ PLANNED | 2026-03-01 | Security |
| 1.19 Testing & QA | ⏸️ PLANNED | 2026-03-19 | Quality Assurance |
| 1.20 Production Prep | ⏸️ PLANNED | 2026-03-31 | Deployment |
| 1.21 Deploy MVP | ⏸️ PLANNED | 2026-04-07 | Production Launch |

**Phase 2:** 2.1-2.5 (Security & Stability)
**Phase 3:** 3.1-3.5 (Production Hardening)
**Phase 4:** 4.1-4.9 (Feature Development)