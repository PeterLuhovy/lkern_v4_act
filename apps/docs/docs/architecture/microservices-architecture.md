---
id: microservices-architecture
title: Microservices Architecture Design
sidebar_label: Microservices
sidebar_position: 2
---

# L-KERN v4 - Microservices Architecture Design

**Version:** 1.0.0
**Created:** 2025-10-30
**Updated:** 2025-10-30
**Project:** BOSS (Business Operating System Service)
**Developer:** BOSSystems s.r.o.

**Description:**
Complete microservices architecture design for L-KERN v4 ERP system. Based on comprehensive analysis and business requirements. Includes terminology standards, sensitive data strategy, event-driven architecture, and implementation order.

---

## 📖 Document Purpose

This document defines the **complete microservices architecture** for L-KERN v4 ERP system based on:
- **Terminology Analysis** (Vendor vs Supplier, Customer vs Client, Inventory vs Stock)
- **Sensitive Data Strategy** (GDPR compliance, data ownership)
- **Event-Driven Architecture** (Apache Kafka, UUID shared keys)
- **Production Planning Optimization** (Quality vs Speed, Resource Allocation)
- **Implementation Order** (Phase-based development strategy)

**Source:** Comprehensive architectural discussion and business requirements analysis (2025-10-30)

---

## 🎯 Architecture Principles

### **1. Bounded Context (Domain-Driven Design)**
- ✅ **CORRECT:** Divide by business domain (Sales, Purchasing, Manufacturing)
- ❌ **WRONG:** Divide by data type (Customers, Suppliers, Orders)

**Rationale:** Microservices should own complete business contexts, not just data entities.

### **2. Single Source of Truth**
- **Contact (MDM)** = Referenčné dáta (UUID, name, address, tax ID)
- **Sales** = Transactional data for customers (credit limits, payment terms, bank accounts)
- **Purchasing** = Transactional data for vendors (approval status, payment terms, bank accounts)
- **HR/Payroll** = Sensitive employee data (salary, personal ID, bank accounts)

### **3. Event-Driven Communication**
- **Apache Kafka** for event distribution
- **Async processing** for scalability
- **UUID shared keys** across services

### **4. Principle of Least Privilege (Sensitive Data)**
- Bank accounts ONLY where they're used (Sales, Purchasing, HR)
- HR data isolated (separate microservice)
- Contact (MDM) contains ONLY non-sensitive reference data

---

## 📚 Terminology Standards

### **1. Vendor vs Supplier vs Service Provider**

**Architecture Decision:** Single entity "Vendor" with role attribute

| Term | Definition | Usage in L-KERN |
|------|------------|-----------------|
| **Vendor** | Generic term for any entity you pay | Main entity name in Purchasing module |
| **Supplier** | Provides raw materials/components for production | Role attribute: "Supplier" |
| **Service Provider** | Provides services (IT, legal, maintenance) | Role attribute: "Service Provider" |

**Database Model:**
```typescript
interface Vendor {
  id: UUID;
  contactId: UUID; // Reference to Contact (MDM)
  name: string;
  role: 'Supplier' | 'Vendor' | 'Service Provider';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  paymentTerms: PaymentTerms;
  bankAccount: BankAccount; // ✅ Stored in Purchasing
  // ... other purchasing-specific data
}
```

### **2. Customer vs Client**

**Architecture Decision:** Single entity "Customer" with role attribute

| Term | Definition | Usage in L-KERN |
|------|------------|-----------------|
| **Customer** | Generic term for any entity that pays you | Main entity name in Sales module |
| **B2C Customer** | End consumer (retail) | Role attribute: "B2C" |
| **B2B Customer** | Business customer | Role attribute: "B2B" |
| **Client** | Long-term service relationship | Role attribute: "Client" |

**Database Model:**
```typescript
interface Customer {
  id: UUID;
  contactId: UUID; // Reference to Contact (MDM)
  name: string;
  role: 'B2C' | 'B2B' | 'Client';
  creditLimit: number;
  approvalStatus: 'Approved' | 'Blocked';
  paymentTerms: PaymentTerms;
  bankAccount?: BankAccount; // ✅ Stored in Sales
  // ... other sales-specific data
}
```

### **3. Inventory vs Stock**

| Term | Definition | Usage in L-KERN |
|------|------------|-----------------|
| **Inventory** | Financial/accounting view (total value of all goods) | Module name: "Inventory Management" |
| **Stock** | Operational/logistics view (physical quantity at specific location) | Field name: "stock_level" |

**Example:**
```typescript
// ✅ Module name: Inventory Management
interface InventoryModule {
  totalInventoryValue: number; // Financial view
  products: Product[];
}

// ✅ Stock tracking: Physical quantity
interface Product {
  id: UUID;
  name: string;
  warehouses: Warehouse[];
}

interface Warehouse {
  id: UUID;
  location: string;
  stock: number; // Physical quantity at this location
}
```

### **4. Finance Module Structure**

**Architecture Decision:** "Finance" (broader) instead of "Accounting" (narrower)

**Submodules:**

| Submodule | Slovak | Purpose |
|-----------|--------|---------|
| **Accounts Receivable (AR)** | Pohľadávky | Manage incoming payments and issued invoices (money coming IN) |
| **Accounts Payable (AP)** | Záväzky | Manage outgoing payments and received invoices (money going OUT) |
| **General Ledger (GL)** | Hlavná kniha | Core accounting (all entries, balance sheet, P&L, VAT) |
| **Cash & Bank** | Pokladnica & Banka | Track real money movement (bank accounts, cash) |

**Key Point:** **Delivery Notes** are NOT accounting documents!
- **Belong to:** Inventory/Logistics module
- **Purpose:** Physical movement confirmation
- **Relation:** Referenced by invoices in AR/AP

---

## 🏗️ Complete Microservices List (Implementation Order)

### **PHASE I: Foundation & Configuration**

These services MUST be completed FIRST - they provide reference data for all other services.

#### **1. Contact (MDM - Master Data Management)**

**Priority:** 🔴 CRITICAL - Build FIRST

**Responsibility:** Single Source of Truth for identity and basic contact data

**Key Data:**
- UUID (v4) - Shared across ALL services
- Name/Legal name
- Addresses (multiple)
- Tax IDs (IČO, DIČ)
- Phone numbers, emails
- **NO sensitive data** (no bank accounts, no salaries, no personal IDs)

**Emits Events:**
- `ContactCreated`
- `ContactUpdated`
- `ContactDeleted`
- `AddressChanged`

**Dependencies:** None (foundation)

**Provides For:** All other microservices (via Kafka events + local replicas)

**Database:** `lkms101_contacts`
**Ports:** 4101 (REST), 5101 (gRPC)

---

#### **2. Configuration**

**Priority:** 🔴 CRITICAL - Build FIRST

**Responsibility:** Manage global and localized settings needed by all services

**Key Data:**
- Chart of Accounts (COA) - localized (SK/CZ/PL)
- VAT codes and rates
- Currency exchange rates
- Accounting periods (fiscal year)
- Document numbering sequences
- Country-specific regulations

**Dependencies:** None

**Provides For:** Finance, Sales, Purchasing

**Database:** `lkms199_config`
**Ports:** 4199 (REST), 5199 (gRPC)

---

#### **3. HR / Payroll**

**Priority:** 🔴 CRITICAL - Build EARLY

**Responsibility:** Manage employees, payroll, GDPR-sensitive data

**Key Data:**
- Salaries (GDPR protected)
- Personal IDs (rodné číslo) (GDPR protected)
- Personal contracts
- Bank accounts of employees ✅
- **Work roles** (for job assignment) ✅
- **Qualification levels** (for Production Planning) ✅
- **Quality metrics** (accuracy, speed, error rate) ✅
- Time tracking / attendance

**Emits Events:**
- `EmployeeCreated`
- `EmployeeRoleChanged`
- `EmployeeAbsent` (for PPQ contingency planning)
- `EmployeeAvailable`

**Dependencies:** Contact (MDM) - for basic identity

**Provides For:**
- Operations (job assignment)
- Production Planning & Quality (resource allocation)
- Finance (payroll accounting)

**Security:** Strict access control (GDPR compliance)

**Database:** `lkms108_employees`
**Ports:** 4108 (REST), 5108 (gRPC)

---

### **PHASE II: Core Operations**

These modules manage main business transactions and create source documents.

#### **4. Inventory / Logistics**

**Priority:** ⚠️ HIGH - Core business

**Responsibility:** Physical management of goods flow and logistics

**Key Data:**
- Product catalog (SKU)
- Warehouse locations
- Stock levels (physical quantity)
- Goods receipts (příjem tovaru)
- Goods issues (výdej tovaru)
- **Delivery notes** ✅ (not accounting documents!)
- Product characteristics (precision requirements, etc.)

**Emits Events:**
- `GoodsReceived`
- `GoodsIssued`
- `StockLevelCritical`
- `ProductCreated`

**Dependencies:**
- Contact (MDM) - for vendor/customer references
- Configuration - for numbering sequences

**Provides For:**
- Purchasing (3-way match)
- Sales (stock availability)
- Manufacturing (BOM)
- Finance (inventory valuation)

**Database:** `lkms111_warehouse`
**Ports:** 4111 (REST), 5111 (gRPC)

---

#### **5. Purchasing (Nákup / AP - Accounts Payable)**

**Priority:** ⚠️ HIGH - Core business

**Responsibility:** Manage purchasing process, payables, supplier risk

**Key Data:**
- **Vendor data** (business context)
  - Approval status (Qualified, Preferred, Blocked)
  - Payment terms
  - **Bank account of VENDOR** ✅ (stored HERE, not in Contact!)
  - Gamification data (supplier loyalty program)
- **Received RFQ** (Request for Quote - prijatý dopyt) ✅
- **Purchase Orders (PO)** (prijatá objednávka) ✅
- **Received Invoices (AP)** ✅
- 3-Way Match logic (PO → Goods Receipt → Invoice)

**Emits Events:**
- `PurchaseOrderCreated`
- `PurchaseOrderApprovalRequired` (if amount > limit)
- `InvoiceReceived`
- `VendorPaymentSent`
- `3WayMatchCompleted`
- `3WayMatchFailed`

**Dependencies:**
- Contact (MDM) - for vendor identity
- Inventory - for product availability
- Configuration - for COA, numbering

**Provides For:**
- Finance (AP entries)
- Cash & Bank (payment processing)
- Operations (approval workflows)

**Database:** `lkms106_suppliers`
**Ports:** 4106 (REST), 5106 (gRPC)

---

#### **6. Sales (Predaj / AR - Accounts Receivable)**

**Priority:** ⚠️ HIGH - Core business

**Responsibility:** Manage sales process, receivables, customer risk

**Key Data:**
- **Customer data** (business context)
  - Credit limits
  - Approval status (Approved, Blocked)
  - Payment terms
  - **Bank account of CUSTOMER** ✅ (stored HERE, not in Contact!)
  - Gamification data (customer loyalty program)
- **Issued Quotations** (vydaný dopyt) ✅
- **Sales Orders (SO)** (vydaná objednávka) ✅
- **Issued Invoices (AR)** ✅
- Pricing rules, discounts
- **Overdue tracking** (invoices past due date)

**Emits Events:**
- `CustomerRequestReceived` (dopyt from customer)
- `QuotationIssued`
- `SalesOrderCreated`
- `InvoiceIssued`
- `InvoiceOverdue` (triggers reminders)
- `CustomerPaymentReceived`
- `CreditLimitBreached`

**Dependencies:**
- Contact (MDM) - for customer identity
- Inventory - for stock availability
- Configuration - for COA, numbering, VAT

**Provides For:**
- Finance (AR entries)
- Cash & Bank (payment tracking)
- Operations (order fulfillment workflows)
- Production Planning (order requirements)

**Database:** `lkms103_customers`
**Ports:** 4103 (REST), 5103 (gRPC)

---

#### **7. Manufacturing / Production**

**Priority:** ⚠️ HIGH - Core for production companies

**Responsibility:** Manage production processes, capacity, machine data

**Key Data:**
- **Bills of Materials (BOM)** (kusovník)
- **Work centers** (pracovné centrá - machines/stations)
- **Machine characteristics** ✅
  - Precision level (e.g., ±5 microns)
  - Speed (units/hour)
  - Error rate / defect history
  - Current utilization (vyťaženie)
  - Maintenance status
- **Work orders** (pracovné príkazy)
- Production capacity planning
- **Machine availability** (for PPQ scheduling)

**Emits Events:**
- `WorkOrderCreated`
- `WorkOrderCompleted`
- `MachineDown` (for PPQ contingency)
- `MachineAvailable`
- `ProductionCapacityChanged`

**Dependencies:**
- Inventory - for product definitions
- Sales - for production requirements
- Configuration - for numbering

**Provides For:**
- Production Planning & Quality (resource allocation)
- Finance (production costing)
- Operations (work order tracking)

**Database:** `lkms112_operations`
**Ports:** 4112 (REST), 5112 (gRPC)

---

### **PHASE III: Planning, Process Management & Consolidation**

These services process data from Phase II to generate financial data and optimized work plans.

#### **8. Production Planning & Quality (PPQ)**

**Priority:** 🔴 CRITICAL - Advanced feature, build AFTER Manufacturing + HR stable

**Responsibility:** Advanced Planning & Scheduling (APS) with quality/speed optimization

**Key Features:**
1. **Resource Allocation Optimization**
   - Match order requirements with best resources
   - Quality vs Speed tradeoff
   - Employee skill matching
   - Machine capability matching

2. **Intelligent Scheduling**
   - Production calendar management
   - Load balancing (vyťaženie)
   - Constraint-based scheduling
   - Real-time rescheduling

3. **Contingency Planning**
   - Automatic backup resource selection
   - Machine failure handling
   - Employee absence handling
   - Minimize production disruption

4. **Quality-Based Assignment**
   - High precision orders → High precision machines + Qualified employees
   - High speed orders → Fast machines + Fast employees (even with higher defect rate)

**Algorithm Example:**
```typescript
interface OrderRequirements {
  orderId: UUID;
  product: Product;
  quantity: number;
  requiredPrecision: number; // microns
  dueDate: Date;
  priority: 'Quality' | 'Speed' | 'Balanced';
}

interface ResourceCapabilities {
  // Employee
  employeeId: UUID;
  qualificationLevel: number; // 1-10
  speedRating: number; // units/hour
  accuracyRating: number; // defect rate %
  availability: Date[];

  // Machine
  machineId: UUID;
  precisionLevel: number; // microns
  throughput: number; // units/hour
  defectRate: number; // %
  utilization: number; // current load %
  availableSlots: TimeSlot[];
}

function optimizeResourceAllocation(
  order: OrderRequirements,
  employees: ResourceCapabilities[],
  machines: ResourceCapabilities[]
): Assignment {
  if (order.priority === 'Quality') {
    // Select best accuracy, ignore speed
    const bestEmployee = employees.sort((a, b) => a.accuracyRating - b.accuracyRating)[0];
    const bestMachine = machines.filter(m => m.precisionLevel <= order.requiredPrecision)
                                 .sort((a, b) => a.defectRate - b.defectRate)[0];
    return { employee: bestEmployee, machine: bestMachine };
  } else if (order.priority === 'Speed') {
    // Select fastest, accept higher defect rate
    const fastestEmployee = employees.sort((a, b) => b.speedRating - a.speedRating)[0];
    const fastestMachine = machines.sort((a, b) => b.throughput - a.throughput)[0];
    return { employee: fastestEmployee, machine: fastestMachine };
  }
  // Balanced: Multi-criteria optimization
  return multiCriteriaOptimization(order, employees, machines);
}
```

**Key Data:**
- Optimization algorithms
- Production calendar (with assignments)
- Contingency plans (backup resources)
- Resource utilization tracking
- Job scheduling queue

**Emits Events:**
- `JobScheduled` (assigned to employee + machine + timeslot)
- `JobRescheduled` (contingency triggered)
- `ResourceOverloaded` (warning)
- `ProductionPlanOptimized`

**Dependencies:**
- Sales - order requirements (precision, speed, due date)
- Manufacturing - machine capabilities, availability
- HR - employee skills, availability
- Inventory - product characteristics
- Operations - job status updates

**Provides For:**
- Operations - optimized job assignments
- Manufacturing - production schedule
- Sales - realistic delivery dates

**Database:** `lkms_ppq`
**Ports:** 4XXX (REST), 5XXX (gRPC)

---

#### **9. Operations (Workflow Orchestration / BPM)**

**Priority:** ⚠️ HIGH - Process management

**Responsibility:** End-to-end process orchestration, job management, status tracking

**Key Features:**
1. **Workflow Definition**
   - Business process modeling
   - Step definitions
   - Role assignments
   - Approval chains

2. **Job Management**
   - Create jobs from events
   - Assign to employees (via HR roles)
   - Track job status
   - Handle job completion

3. **Customer Visibility**
   - Operation status tracking
   - Real-time progress updates
   - Accessible via web portal

4. **Administrative Tasks**
   - Invoice approvals
   - Document reviews
   - Non-production workflows

**Example Workflows:**
```yaml
Workflow: ProcessCustomerQuote
Trigger: CustomerRequestReceived (from Sales)
Steps:
  1. CreateQuoteJob
     - Assign to: Role = "Sales Agent" (from HR)
     - Status visible: Customer can see "Processing quote"
  2. ApproveQuote (if amount > limit)
     - Assign to: Role = "Sales Manager"
  3. SendQuote
     - Trigger: Email sent via Notification service
  4. Complete
     - Status: "Quote sent to customer"

Workflow: ApprovalWorkflow_PO
Trigger: PurchaseOrderApprovalRequired (from Purchasing)
Steps:
  1. ReviewPO
     - Assign to: Role = "Purchasing Manager"
     - If amount > 10000 → Escalate to "Finance Director"
  2. Approve/Reject
     - If approved → Emit POApprovalCompleted
     - If rejected → Emit POApprovalRejected

Workflow: MonthEndAccounting (Internal)
Trigger: Scheduled (last day of month)
Steps:
  1. CloseAccountingPeriod
     - Assign to: Role = "Accountant"
  2. GenerateFinancialReports
     - Assign to: Role = "Accountant"
  3. ReviewReports
     - Assign to: Role = "Finance Director"
  4. SubmitTaxReturns
     - Assign to: Role = "Accountant"
```

**Key Data:**
- Workflow definitions
- Job queue
- Job assignments (employee + task + status)
- Operation status (for customer visibility)
- Approval history

**Emits Events:**
- `JobCreated`
- `JobAssigned`
- `JobCompleted`
- `JobFailed`
- `ApprovalRequired`
- `ApprovalCompleted`
- `ApprovalRejected`

**Dependencies:**
- Sales - order/quote processes
- Purchasing - PO approval processes
- Manufacturing - production processes
- HR - employee roles, availability
- Production Planning & Quality - optimized job assignments

**Provides For:**
- Customer portal (status tracking)
- Employee dashboard (my jobs)
- Management (process monitoring)

**Database:** `lkms_operations`
**Ports:** 4XXX (REST), 5XXX (gRPC)

---

#### **10. Finance / General Ledger (GL)**

**Priority:** 🔴 CRITICAL - Core of accounting

**Responsibility:** Accounting backbone - consolidate all financial transactions

**Key Features:**
1. **General Ledger**
   - All accounting entries (Debit/Credit)
   - Chart of Accounts (COA)
   - Account balances
   - Period closing

2. **Financial Reports**
   - Balance Sheet (Súvaha)
   - Profit & Loss (Výkaz ziskov a strát)
   - Cash Flow Statement
   - Localized reports (SK/CZ/PL formats)

3. **Tax Compliance**
   - VAT reporting (Kontrolný výkaz DPH)
   - Tax calculations
   - Audit trail

4. **Automatic Posting**
   - From Sales (AR invoices) → GL entries
   - From Purchasing (AP invoices) → GL entries
   - From Inventory (goods movements) → GL entries
   - From Payroll (salary payments) → GL entries

**Event Consumers:**
- `InvoiceIssued` (Sales) → Create GL entry (Debit: AR, Credit: Revenue)
- `InvoiceReceived` (Purchasing) → Create GL entry (Debit: Expense, Credit: AP)
- `GoodsIssued` (Inventory) → Create GL entry (Debit: COGS, Credit: Inventory)
- `PaymentReceived` (Cash & Bank) → Create GL entry (Debit: Bank, Credit: AR)

**Key Data:**
- Chart of Accounts (from Configuration)
- GL entries (journal)
- Account balances
- Accounting periods (open/closed)
- Financial statements

**Dependencies:**
- Configuration - COA, VAT codes, accounting periods
- Sales - AR invoices
- Purchasing - AP invoices
- Inventory - inventory valuation
- Manufacturing - production costs
- Cash & Bank - payment entries

**Provides For:**
- Management (financial reports)
- Tax authorities (VAT returns, financial statements)
- Auditors (audit trail)

**Database:** `lkms_finance`
**Ports:** 4XXX (REST), 5XXX (gRPC)

---

### **PHASE IV: Supporting & Value-Adding Services**

These services enhance comfort and efficiency but are NOT critical for daily operations.

#### **11. Cash & Bank**

**Priority:** ⚠️ HIGH - Payment processing

**Responsibility:** Liquidity management, bank transactions

**Key Data:**
- Bank accounts
- Bank statements
- Payment orders (SEPA)
- Payment matching (AR/AP)
- Cash register movements

**Emits Events:**
- `PaymentReceived`
- `PaymentSent`
- `BankStatementImported`
- `PaymentMatched`

**Dependencies:**
- Finance - bank account definitions
- Sales - AR receivables
- Purchasing - AP payables

**Database:** `lkms_cash_bank`
**Ports:** 4XXX (REST), 5XXX (gRPC)

---

#### **12. Notification**

**Priority:** 💡 NICE TO HAVE - Communication

**Responsibility:** Central notification management

**Key Data:**
- Notification templates
- Notification log
- Email/SMS/Push notification settings

**Event Consumers:**
- `InvoiceOverdue` → Send reminder to customer
- `JobAssigned` → Notify employee
- `ApprovalRequired` → Notify approver
- `MachineDown` → Alert maintenance team

**Dependencies:** All services (consumes events from everywhere)

**Database:** `lkms_notification`
**Ports:** 4XXX (REST), 5XXX (gRPC)

---

#### **13. Gamification / Loyalty**

**Priority:** 💡 NICE TO HAVE - Marketing

**Responsibility:** Loyalty programs, rewards, motivation

**Key Data:**
- Gamification rules
- Points/levels
- Rewards history
- Leaderboards

**Dependencies:**
- Sales - sales transactions
- Purchasing - supplier performance

**Database:** `lkms_gamification`
**Ports:** 4XXX (REST), 5XXX (gRPC)

---

## 🔒 Sensitive Data Strategy (GDPR Compliance)

### **Where Sensitive Data Belongs**

| Data Type | Belongs In | Why? | ❌ NOT In |
|-----------|------------|------|-----------|
| **Bank account (VENDOR)** | Purchasing (AP) | Used for payments to vendors | ❌ Contact (MDM) |
| **Bank account (CUSTOMER)** | Sales (AR) | Used for direct debit from customers | ❌ Contact (MDM) |
| **Bank account (EMPLOYEE)** | HR / Payroll | Used for salary payments | ❌ Contact (MDM) |
| **Salary, personal ID, contracts** | HR / Payroll | GDPR protected, payroll secrecy | ❌ Contact (MDM) |
| **Basic employee identity** | Contact (MDM) | Reference data (UUID, name, work email) | ✅ Safe to share |
| **Credit limits, payment terms** | Sales (AR) | Business risk management | ❌ Contact (MDM) |
| **Vendor approval status** | Purchasing (AP) | Supply chain risk management | ❌ Contact (MDM) |

### **Contact (MDM) - What It Contains (Non-Sensitive Only)**

✅ **Safe to store:**
- UUID (shared key)
- Legal name / trading name
- Addresses (business addresses, NOT home addresses of employees)
- Tax ID (IČO, DIČ) - public information
- Work phone numbers, work emails

❌ **NEVER store:**
- Bank accounts (any type)
- Salaries
- Personal ID numbers (rodné číslo)
- Home addresses of employees
- Credit card information
- Health information

**Rationale:** Contact (MDM) is distributed to ALL services. Storing sensitive data here would expose it to services that don't need it, violating **Principle of Least Privilege**.

---

## 🔄 Event-Driven Architecture

### **Communication Patterns**

**1. Event Distribution (Async via Kafka)**

Primary pattern for:
- Data synchronization (ContactUpdated)
- Business events (InvoiceIssued, OrderCreated)
- Notifications (InvoiceOverdue)

**Example:**
```typescript
// Purchasing emits event when PO requires approval
kafka.publish('PurchaseOrderApprovalRequired', {
  poId: 'PO-00123',
  amount: 5000,
  requiredRole: 'Purchasing Manager',
  vendorId: 'V-456'
});

// Operations consumes event and creates job
kafka.subscribe('PurchaseOrderApprovalRequired', async (event) => {
  const employee = await hr.getEmployeeByRole(event.requiredRole);
  await operations.createJob({
    title: `Approve PO ${event.poId}`,
    assignedTo: employee.id,
    status: 'Pending'
  });
});
```

**2. Synchronous Calls (REST/gRPC)**

Use for:
- Real-time queries (who has this role?)
- Critical path operations
- User-facing requests

**Example:**
```typescript
// Operations needs to know who can approve (synchronous query to HR)
const approvers = await hrService.getEmployeesByRole('Purchasing Manager');
```

### **Key Events by Service**

**Contact (MDM):**
- `ContactCreated`
- `ContactUpdated`
- `ContactDeleted`
- `AddressChanged`

**Sales:**
- `CustomerRequestReceived`
- `QuotationIssued`
- `SalesOrderCreated`
- `InvoiceIssued`
- `InvoiceOverdue`
- `CustomerPaymentReceived`

**Purchasing:**
- `PurchaseOrderCreated`
- `PurchaseOrderApprovalRequired`
- `InvoiceReceived`
- `VendorPaymentSent`
- `3WayMatchCompleted`

**Manufacturing:**
- `WorkOrderCreated`
- `WorkOrderCompleted`
- `MachineDown`
- `MachineAvailable`

**HR:**
- `EmployeeCreated`
- `EmployeeRoleChanged`
- `EmployeeAbsent`
- `EmployeeAvailable`

**Operations:**
- `JobCreated`
- `JobAssigned`
- `JobCompleted`
- `ApprovalRequired`

**Production Planning & Quality:**
- `JobScheduled`
- `JobRescheduled`
- `ProductionPlanOptimized`

**Finance:**
- `GLEntryCreated`
- `PeriodClosed`
- `FinancialReportGenerated`

---

## 📅 Implementation Order & Dependencies

### **Phase I: Foundation (1-2 months)**

**Order:**
1. **Contact (MDM)** - No dependencies
2. **Configuration** - No dependencies
3. **HR / Payroll** - Depends on Contact

**Deliverables:**
- ✅ UUID shared key system working
- ✅ Kafka event distribution operational
- ✅ Basic identity management
- ✅ Employee roles defined

---

### **Phase II: Core Operations (3-4 months)**

**Order:**
4. **Inventory / Logistics** - Depends on Contact, Configuration
5. **Purchasing** - Depends on Contact, Inventory, Configuration
6. **Sales** - Depends on Contact, Inventory, Configuration
7. **Manufacturing** - Depends on Inventory, Sales, Configuration

**Deliverables:**
- ✅ Transactional documents working (PO, SO, Invoices)
- ✅ 3-Way Match functional
- ✅ Basic production tracking

---

### **Phase III: Planning & Finance (2-3 months)**

**Order:**
8. **Production Planning & Quality** - Depends on Manufacturing, HR, Sales
9. **Operations** - Depends on Sales, Purchasing, Manufacturing, HR, PPQ
10. **Finance (GL)** - Depends on ALL transactional services

**Deliverables:**
- ✅ Intelligent resource allocation
- ✅ Workflow orchestration
- ✅ Financial reporting

---

### **Phase IV: Supporting Services (1-2 months)**

**Order:**
11. **Cash & Bank** - Depends on Finance, Sales, Purchasing
12. **Notification** - Depends on ALL services
13. **Gamification** - Depends on Sales, Purchasing

**Deliverables:**
- ✅ Payment processing
- ✅ Notification system
- ✅ Loyalty programs

---

## 🗂️ Database Strategy

### **One Database Per Service**

Each microservice has its own PostgreSQL database:

| Service | Database Name | Port (REST) | Port (gRPC) |
|---------|---------------|-------------|-------------|
| Contact | `lkms101_contacts` | 4101 | 5101 |
| Configuration | `lkms199_config` | 4199 | 5199 |
| HR / Payroll | `lkms108_employees` | 4108 | 5108 |
| Inventory | `lkms111_warehouse` | 4111 | 5111 |
| Purchasing | `lkms106_suppliers` | 4106 | 5106 |
| Sales | `lkms103_customers` | 4103 | 5103 |
| Manufacturing | `lkms112_operations` | 4112 | 5112 |
| PPQ | `lkms_ppq` | TBD | TBD |
| Operations | `lkms_operations` | TBD | TBD |
| Finance | `lkms_finance` | TBD | TBD |
| Cash & Bank | `lkms_cash_bank` | TBD | TBD |

### **Port Mapping Strategy (LKMS)**

**L-KERN Microservice (LKMS) Port Standard:**
- **REST API:** `41XX` (external communication)
- **gRPC API:** `51XX` (internal communication)
- **PostgreSQL:** `4501` (single shared instance for all DBs)
- **Adminer:** `4901` (database management UI)

---

## 🎯 Key Architectural Decisions Summary

| Decision | Rationale |
|----------|-----------|
| **Vendor = main entity with role attribute** | Simplified model, DRY principle, easy to extend |
| **Customer = main entity with role attribute** | Same as Vendor, consistent approach |
| **Bank accounts in Sales/Purchasing, NOT Contact** | Principle of Least Privilege, GDPR compliance |
| **HR data isolated in separate service** | GDPR, payroll secrecy, strict access control |
| **Contact (MDM) = non-sensitive reference data only** | Safe to distribute to all services |
| **Delivery notes in Inventory, NOT Finance** | Not accounting documents, logistics only |
| **Finance module consolidates all transactions** | Single Source of Truth for accounting |
| **Event-driven architecture (Kafka)** | Scalability, decoupling, resilience |
| **UUID shared key across services** | Referential integrity without tight coupling |
| **One database per service** | Service autonomy, independent scaling |
| **Production Planning as separate service (PPQ)** | Complex optimization logic, advanced feature |
| **Operations = BPM orchestration** | Process management, not data storage |

---

## 📊 Architecture Diagrams

### **Microservices Dependencies (Phase-based)**

```
PHASE I: Foundation
┌──────────────────────────────────────────┐
│                                          │
│  1. Contact (MDM)                        │
│     └─> Kafka Events                     │
│                                          │
│  2. Configuration                        │
│     └─> COA, VAT, Currencies             │
│                                          │
│  3. HR / Payroll                         │
│     └─> Roles, Skills, Availability      │
│                                          │
└──────────────────────────────────────────┘
           │
           ▼
PHASE II: Core Operations
┌──────────────────────────────────────────┐
│                                          │
│  4. Inventory ──┐                        │
│                 │                        │
│  5. Purchasing ─┼─> Kafka Events         │
│                 │                        │
│  6. Sales ──────┤                        │
│                 │                        │
│  7. Manufacturing                        │
│                                          │
└──────────────────────────────────────────┘
           │
           ▼
PHASE III: Planning & Finance
┌──────────────────────────────────────────┐
│                                          │
│  8. PPQ (Optimization)                   │
│     └─> Intelligent Scheduling           │
│                                          │
│  9. Operations (BPM)                     │
│     └─> Job Management                   │
│                                          │
│  10. Finance (GL)                        │
│     └─> Financial Reports                │
│                                          │
└──────────────────────────────────────────┘
           │
           ▼
PHASE IV: Supporting
┌──────────────────────────────────────────┐
│                                          │
│  11. Cash & Bank                         │
│  12. Notification                        │
│  13. Gamification                        │
│                                          │
└──────────────────────────────────────────┘
```

### **Data Flow: Purchase Order Approval**

```
1. Purchasing Service (Employee creates PO > approval limit)
   │
   ├─> Emit: PurchaseOrderApprovalRequired
   │    {poId, amount, requiredRole: "Purchasing Manager"}
   │
   ▼
2. Operations Service (Kafka consumer)
   │
   ├─> Query HR: getEmployeesByRole("Purchasing Manager")
   │    └─> Response: [Employee E-789]
   │
   ├─> Create Job: "Approve PO #P00123"
   │    └─> Assign to: E-789
   │    └─> Status: "Pending"
   │
   ├─> Emit: JobCreated
   │
   ▼
3. Notification Service (Kafka consumer)
   │
   └─> Send email to E-789: "New job: Approve PO"

4. Employee E-789 (Web UI)
   │
   └─> Approve PO in Operations UI
       │
       ├─> Operations updates Job status: "Completed"
       │
       ├─> Emit: POApprovalCompleted {poId}
       │
       ▼
5. Purchasing Service (Kafka consumer)
   │
   └─> Update PO status: "Approved"
       └─> Proceed to send PO to Vendor
```

### **Data Flow: Production Planning Optimization**

```
1. Sales Service (New order created)
   │
   ├─> Emit: SalesOrderCreated
   │    {orderId, product, quantity, dueDate, precision: "High"}
   │
   ▼
2. Production Planning & Quality (Kafka consumer)
   │
   ├─> Query Manufacturing: getMachinesByPrecision(precision: "High")
   │    └─> Response: [Machine M-01 (±5μm), Machine M-03 (±3μm)]
   │
   ├─> Query HR: getEmployeesByQualification(level: "High")
   │    └─> Response: [Employee E-123 (Level 9), Employee E-456 (Level 8)]
   │
   ├─> Run optimization algorithm:
   │    └─> Select: Machine M-03 + Employee E-123
   │    └─> Find available timeslot: 2025-11-01 08:00-12:00
   │    └─> Calculate contingency: Backup = Machine M-01 + Employee E-456
   │
   ├─> Create schedule entry in production calendar
   │
   ├─> Emit: JobScheduled
   │    {orderId, machineId: M-03, employeeId: E-123, timeslot}
   │
   ▼
3. Operations Service (Kafka consumer)
   │
   ├─> Create Job: "Produce Order #O-123 on Machine M-03"
   │    └─> Assign to: E-123
   │    └─> Scheduled: 2025-11-01 08:00
   │
   └─> Customer portal shows: "Order in production (Machine M-03)"

4. IF Machine M-03 breaks down:
   │
   ├─> Manufacturing emits: MachineDown {machineId: M-03}
   │
   ├─> PPQ receives event
   │    └─> Activate contingency plan
   │    └─> Reschedule to: Machine M-01 + Employee E-456
   │    └─> Emit: JobRescheduled
   │
   └─> Operations updates customer portal: "Rescheduled to Machine M-01"
```

---

## 🔐 Security Considerations

### **Service-to-Service Authentication**

- **Internal gRPC:** mTLS (mutual TLS)
- **External REST:** JWT tokens
- **Kafka:** SASL/SSL

### **Data Access Control**

| Service | Access Level | Who Can Access |
|---------|--------------|----------------|
| HR / Payroll | RESTRICTED | HR Manager, Finance Director only |
| Finance (GL) | CONFIDENTIAL | Finance team, Auditors |
| Sales, Purchasing | INTERNAL | Business users |
| Contact (MDM) | SHARED | All services (non-sensitive data) |

### **GDPR Compliance**

- **Right to be forgotten:** Cascade delete from Contact → All services
- **Data portability:** Export API for all personal data
- **Audit logging:** All access to sensitive data logged
- **Encryption at rest:** All databases encrypted
- **Encryption in transit:** All communication encrypted (TLS/SSL)

---

## 📚 References & Further Reading

**Domain-Driven Design:**
- Eric Evans - "Domain-Driven Design" (Bounded Context)
- Vernon Vaughn - "Implementing Domain-Driven Design"

**Microservices Architecture:**
- Chris Richardson - "Microservices Patterns"
- Sam Newman - "Building Microservices"

**Event-Driven Architecture:**
- Martin Fowler - "Event-Driven Architecture"
- Apache Kafka Documentation

**GDPR Compliance:**
- GDPR Official Text (EU Regulation 2016/679)
- ISO 27001 (Information Security Management)

---

## 📞 Questions & Clarifications

**For further architectural decisions, contact:**
- **Technical Lead:** BOSSystems s.r.o.
- **Documentation:** This file (microservices-architecture.md)
- **Related Docs:**
  - See project roadmap documentation
  - See coding standards documentation

---

**Last Updated:** 2025-10-30
**Maintainer:** BOSSystems s.r.o.
**Version:** 1.0.0
**Status:** ✅ COMPLETE - Ready for implementation
