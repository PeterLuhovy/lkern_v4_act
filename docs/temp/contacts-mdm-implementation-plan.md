# ================================================================
# Contact (MDM) Microservice - Implementation Plan
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\temp\contacts-mdm-implementation-plan.md
# Version: 1.0.0
# Created: 2025-11-08
# Updated: 2025-11-08
# Project: BOSS (Business Operating System Software)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive implementation plan for Contact (MDM) microservice.
#   Master Data Management service with GDPR Least Privilege principle.
#   Foundation microservice for entire ERP system (Microservice #1).
# ================================================================

## 📋 Executive Summary

**Contact (MDM)** is the foundational microservice (#1) in the BOSS ERP system, implementing Master Data Management pattern with GDPR Least Privilege principle.

### Key Characteristics:
- **Service ID**: LKMS101 (L-KERN Microservice 101)
- **Ports**: 4101 (REST API), 5101 (gRPC)
- **Database**: PostgreSQL 16 with UUID primary keys
- **Event Bus**: Kafka (5 event types)
- **Phase**: PHASE I (Foundation)
- **Dependencies**: None (foundation service)
- **Dependent Services**: All other microservices (Sales, Purchasing, HR, PPQ, Operations, etc.)

### Core Principles:

1. **Master Data Management (MDM)**
   - Single Source of Truth for contact data
   - UUID as global identifier across all microservices
   - Kafka event distribution for data synchronization

2. **GDPR Principle of Least Privilege**
   - Contact (MDM) contains ONLY public data
   - NO sensitive data: IBAN, salaries, rodné čísla stored in specialized microservices
   - Clear data ownership matrix

3. **Multi-Role Support**
   - One contact can have multiple roles simultaneously
   - Examples: Contact can be SUPPLIER + CUSTOMER + EMPLOYEE at the same time
   - Role history tracking (valid_from, valid_to)

4. **Party Model**
   - Contact as base entity
   - Inheritance: Contact → Person OR Company
   - Type-specific attributes in separate tables

---

## 🎯 GDPR Data Ownership Matrix

**CRITICAL: What data belongs WHERE in distributed architecture**

| Data Type              | Contact (MDM) | Sales    | Purchasing | HR       |
|------------------------|---------------|----------|------------|----------|
| UUID (contact_id)      | ✅ Owner      | Replica  | Replica    | Replica  |
| Name (Person/Company)  | ✅ Owner      | Replica  | Replica    | Replica  |
| Work Email/Phone       | ✅ Owner      | Replica  | Replica    | Replica  |
| Company Address        | ✅ Owner      | Replica  | Replica    | ❌       |
| Personal Address       | ✅ Owner      | ❌       | ❌         | Replica  |
| IBAN (Customer)        | ❌            | ✅ Owner | ❌         | ❌       |
| IBAN (Vendor)          | ❌            | ❌       | ✅ Owner   | ❌       |
| IBAN (Employee)        | ❌            | ❌       | ❌         | ✅ Owner |
| Credit Limit           | ❌            | ✅ Owner | ❌         | ❌       |
| Payment Terms          | ❌            | ✅ Owner | ✅ Owner   | ❌       |
| Salary                 | ❌            | ❌       | ❌         | ✅ Owner |
| Rodné číslo            | ❌            | ❌       | ❌         | ✅ Owner |
| Health Insurance       | ❌            | ❌       | ❌         | ✅ Owner |

### GDPR Rationale:

**Why NO IBAN in Contact (MDM)?**
- One person can have 3 different IBANs:
  - As CUSTOMER: IBAN for receiving refunds (Sales microservice)
  - As VENDOR: IBAN for receiving payments (Purchasing microservice)
  - As EMPLOYEE: IBAN for receiving salary (HR microservice)
- **Least Privilege**: Each microservice stores ONLY the IBAN it needs
- **Data Minimization**: Contact (MDM) doesn't need any IBAN

**Why addresses ARE in Contact (MDM)?**
- Company address: Public information (obchodný register)
- Work email/phone: Business communication, not personal
- Personal addresses: Only for employees (replicated to HR if needed)

---

## 🗄️ Database Schema (PostgreSQL 16)

### Table 1: `contacts` (Base Entity - Party Model) ✅

**Purpose**: Base table for all contacts (Person, Company, or Organizational Unit)

```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,  -- Soft delete

    -- Constraints
    CONSTRAINT contacts_type_valid CHECK (type IN ('PERSON', 'COMPANY', 'ORGANIZATIONAL_UNIT'))
);

-- Indexes
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- Trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_contacts_updated_at();
```

**Fields**:
- `id` (UUID): Global identifier, shared across ALL microservices (gen_random_uuid())
- `type` (VARCHAR 30): PERSON, COMPANY, or ORGANIZATIONAL_UNIT
- `created_at`, `updated_at`, `deleted_at`: Audit trail

**Design Decisions**:
- **UUID generation**: PostgreSQL `gen_random_uuid()` (automatic, consistent)
- **Soft delete**: `deleted_at` timestamp for audit compliance
- **Type inheritance**: PERSON → contact_persons, COMPANY → contact_companies, ORGANIZATIONAL_UNIT → contact_organizational_units
- **Auto-update trigger**: `updated_at` automatically set on every UPDATE

**Indexes Explained**:
- `idx_contacts_type`: Fast filtering by type (e.g., "all companies")
- `idx_contacts_deleted_at`: Partial index for active records only (WHERE deleted_at IS NULL)
- `idx_contacts_created_at`: Reporting queries ("contacts created this month"), DESC for newest-first

---

### Table 2: `contact_roles` (M:N Multi-Role Support) ✅

**Purpose**: Multi-role support with role history tracking

```sql
CREATE TABLE contact_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    role_type_id UUID NOT NULL REFERENCES role_types(id),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- **NEW v4**: Contextual role binding (fixes v3.6 limitation)
    related_contact_id UUID NULL REFERENCES contacts(id),

    -- Role validity period
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_roles_validity_period CHECK (
        valid_to IS NULL OR valid_to >= valid_from
    ),
    CONSTRAINT contact_roles_unique_active UNIQUE (contact_id, role_type_id, valid_from)
);

CREATE INDEX idx_contact_roles_contact ON contact_roles(contact_id);
CREATE INDEX idx_contact_roles_type ON contact_roles(role_type_id);
CREATE INDEX idx_contact_roles_related ON contact_roles(related_contact_id);
CREATE INDEX idx_contact_roles_active ON contact_roles(contact_id, role_type_id)
    WHERE valid_to IS NULL;
```

**Fields**:
- `contact_id` (UUID FK): Link to contact
- `role_type_id` (UUID FK): Reference to role_types table (SUPPLIER, CUSTOMER, EMPLOYEE, etc.)
- `is_primary` (BOOLEAN): Primary role flag
- **`related_contact_id` (UUID FK, NEW v4)**: Contextual binding - specifies WHAT entity the role relates to
  - **Why needed**: Fixes v3.6 limitation where roles lacked context (e.g., "CUSTOMER" didn't specify which division/company)
  - **Examples**: "Peter is EMPLOYEE of Development Team", "ABC is SUPPLIER for Sales Division"
  - **NULL allowed**: Some roles don't need context (e.g., global PARTNER role)
- `valid_from`, `valid_to` (DATE): Role history tracking

**Role Types** (see Table 19: role_types):

**Purchasing Context** (4 roles):
- **SUPPLIER**: Dodávateľ - pravidelný dodávateľ materiálu (dlhodobý vzťah, rámcové zmluvy)
- **VENDOR**: Predajca - jednorazový nákup (kúpim niečo raz, nie je to pravidelný dodávateľ)
- **SERVICE_PROVIDER**: Poskytovateľ služieb - externe služby (IT support, upratovanie)
- **CONTRACTOR**: Dodávateľ na zmluvu

**Sales Context** (2 roles):
- **CUSTOMER**: Zákazník - transakčný vzťah (kupuje produkty, môže byť jednorazovo)
- **CLIENT**: Klient - dlhodobý vzťah (pravidelný zákazník, B2B kontrakty)

**HR Context** (1 role):
- **EMPLOYEE**: Zamestnanec - pracovný pomer

**Partnership Context** (1 role):
- **PARTNER**: Obchodný partner

**Organizational Structure** (1 role):
- **PART_OF**: Organizačná jednotka súčasť firmy/divízie

**Multi-Role Examples**:

**Example 1: Multi-role contact (ABC s.r.o.)**
```sql
-- ABC s.r.o. is SUPPLIER for Sales Division
INSERT INTO contact_roles (contact_id, role_type_id, related_contact_id)
VALUES ('uuid-abc-sro', (SELECT id FROM role_types WHERE role_code = 'SUPPLIER'), 'uuid-sales-division');

-- ABC s.r.o. is also CUSTOMER for Production Division
INSERT INTO contact_roles (contact_id, role_type_id, related_contact_id)
VALUES ('uuid-abc-sro', (SELECT id FROM role_types WHERE role_code = 'CUSTOMER'), 'uuid-production-division');

→ One contact, two roles with different contexts
```

**Example 2: Employee in specific organizational unit (Peter Nový)**
```sql
-- Peter is EMPLOYEE of Development Team (not whole company!)
INSERT INTO contact_roles (contact_id, role_type_id, related_contact_id)
VALUES ('uuid-peter', (SELECT id FROM role_types WHERE role_code = 'EMPLOYEE'), 'uuid-dev-team');

-- Peter is also CLIENT at company level (buys products as personal customer)
INSERT INTO contact_roles (contact_id, role_type_id, related_contact_id)
VALUES ('uuid-peter', (SELECT id FROM role_types WHERE role_code = 'CLIENT'), NULL);

→ One contact, two roles (one contextual, one global)
```

**Example 3: Organizational hierarchy (Development Team PART_OF BOSSystems)**
```sql
-- Development Team belongs to BOSSystems company
INSERT INTO contact_roles (contact_id, role_type_id, related_contact_id)
VALUES ('uuid-dev-team', (SELECT id FROM role_types WHERE role_code = 'PART_OF'), 'uuid-bossystems');

-- Sales Division belongs to BOSSystems company
INSERT INTO contact_roles (contact_id, role_type_id, related_contact_id)
VALUES ('uuid-sales-division', (SELECT id FROM role_types WHERE role_code = 'PART_OF'), 'uuid-bossystems');

→ Organizational units linked to parent company via PART_OF role
```

**Design Decisions**:
- M:N relationship (one contact → many roles)
- Role history tracking (valid_from, valid_to) for compliance
- Active role filtering via WHERE valid_to IS NULL
- Unique constraint prevents duplicate active roles
- **NEW v4: `related_contact_id` field** - Contextual role binding
  - **Problem in v3.6**: Roles were global (CUSTOMER didn't specify which division/company)
  - **Solution in v4**: `related_contact_id` links role to specific organizational context
  - **Flexibility**: NULL allowed for global roles (company-wide PARTNER)
  - **Use cases**: Division-specific employees, department-specific suppliers, team-specific customers
- **NEW v4: `role_type_id` FK** - Dynamic role types via reference table
  - **Problem in v3.6**: ENUM required schema changes to add new roles
  - **Solution in v4**: `role_types` table allows adding roles without migrations
  - **Flexibility**: Custom roles (INVESTOR, CONSULTANT, DISTRIBUTOR) can be added at runtime

**Example Queries with Contextual Roles**:

```sql
-- Find all employees of Development Team (not whole company)
SELECT c.id, p.first_name, p.last_name, rt.role_name_sk
FROM contacts c
JOIN contact_persons p ON c.id = p.contact_id
JOIN contact_roles r ON c.id = r.contact_id
JOIN role_types rt ON r.role_type_id = rt.id
WHERE rt.role_code = 'EMPLOYEE'
  AND r.related_contact_id = 'uuid-dev-team'
  AND r.valid_to IS NULL;

-- Find all suppliers for Sales Division specifically
SELECT c.id, comp.company_name, rt.role_name_sk
FROM contacts c
JOIN contact_companies comp ON c.id = comp.contact_id
JOIN contact_roles r ON c.id = r.contact_id
JOIN role_types rt ON r.role_type_id = rt.id
WHERE rt.role_code = 'SUPPLIER'
  AND r.related_contact_id = 'uuid-sales-division'
  AND r.valid_to IS NULL;

-- Find organizational units belonging to BOSSystems company
SELECT c.id, org.unit_name, org.unit_type, rt.role_name_sk
FROM contacts c
JOIN contact_organizational_units org ON c.id = org.contact_id
JOIN contact_roles r ON c.id = r.contact_id
JOIN role_types rt ON r.role_type_id = rt.id
WHERE rt.role_code = 'PART_OF'
  AND r.related_contact_id = 'uuid-bossystems'
  AND r.valid_to IS NULL;

-- Check if contact has CUSTOMER role for specific division
SELECT EXISTS (
    SELECT 1 FROM contact_roles r
    JOIN role_types rt ON r.role_type_id = rt.id
    WHERE r.contact_id = 'uuid-xyz-sro'
      AND rt.role_code = 'CUSTOMER'
      AND r.related_contact_id = 'uuid-production-division'
      AND r.valid_to IS NULL
) AS is_customer_of_production;
```

---

### Table 2a: `role_types` (Reference Table)

**Purpose**: Reference data for contact role types (allows dynamic role creation)

```sql
CREATE TABLE role_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Role identification
    role_code VARCHAR(50) NOT NULL UNIQUE,  -- SUPPLIER, CUSTOMER, EMPLOYEE, etc.
    role_name_sk VARCHAR(100) NOT NULL,      -- Dodávateľ, Zákazník, Zamestnanec
    role_name_en VARCHAR(100) NOT NULL,      -- Supplier, Customer, Employee

    -- Role category (for grouping)
    category VARCHAR(50) NULL,  -- PURCHASING, SALES, HR, PARTNERSHIP

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_role_types_code ON role_types(role_code);
CREATE INDEX idx_role_types_category ON role_types(category);
CREATE INDEX idx_role_types_active ON role_types(is_active);
```

**Pre-populated Data**:
```sql
-- Purchasing roles
INSERT INTO role_types (role_code, role_name_sk, role_name_en, category) VALUES
('SUPPLIER', 'Dodávateľ', 'Supplier', 'PURCHASING'),
('VENDOR', 'Predajca', 'Vendor', 'PURCHASING'),
('SERVICE_PROVIDER', 'Poskytovateľ služieb', 'Service Provider', 'PURCHASING'),
('CONTRACTOR', 'Dodávateľ na zmluvu', 'Contractor', 'PURCHASING');

-- Sales roles
INSERT INTO role_types (role_code, role_name_sk, role_name_en, category) VALUES
('CUSTOMER', 'Zákazník', 'Customer', 'SALES'),
('CLIENT', 'Klient', 'Client', 'SALES');

-- HR roles
INSERT INTO role_types (role_code, role_name_sk, role_name_en, category) VALUES
('EMPLOYEE', 'Zamestnanec', 'Employee', 'HR');

-- Partnership roles
INSERT INTO role_types (role_code, role_name_sk, role_name_en, category) VALUES
('PARTNER', 'Obchodný partner', 'Partner', 'PARTNERSHIP');

-- Organizational structure
INSERT INTO role_types (role_code, role_name_sk, role_name_en, category) VALUES
('PART_OF', 'Súčasť', 'Part Of', 'ORGANIZATIONAL');
```

**Why Reference Table?**
- **Dynamic role creation**: Add new roles without database schema changes
- **Translations**: Slovak + English names for UI
- **Categorization**: Group roles by business context (PURCHASING, SALES, HR)
- **Extensibility**: Easy to add custom roles (INVESTOR, CONSULTANT, DISTRIBUTOR)
- **UI-friendly**: role_name_sk/en used in dropdowns and filters

---

### Table 3: `contact_persons` (Person Details) ✅

**Purpose**: Person-specific attributes (inheritance from contacts)

```sql
CREATE TABLE contact_persons (
    contact_id UUID PRIMARY KEY REFERENCES contacts(id) ON DELETE CASCADE,

    -- Name components
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NOT NULL,

    -- Academic/professional titles (JSON arrays for multiple titles)
    titles_before JSON NULL,  -- ["Ing.", "Mgr."] - can have multiple
    titles_after JSON NULL,   -- ["PhD.", "CSc."] - can have multiple

    -- Personal details
    gender VARCHAR(10) NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'AI', 'ROBOT')),

    -- Nationality
    nationality_id UUID NULL REFERENCES nationalities(id),

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_persons_name ON contact_persons(last_name, first_name);
CREATE INDEX idx_contact_persons_nationality ON contact_persons(nationality_id);

-- Trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_contact_persons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_persons_updated_at
    BEFORE UPDATE ON contact_persons
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_persons_updated_at();
```

**Fields**:
- `contact_id` (UUID PK/FK): 1:1 with contacts table
- `first_name`, `last_name`: Required name components
- `middle_name`: Optional middle name
- `titles_before`, `titles_after`: JSON arrays for multiple academic/professional titles
- `gender`: MALE/FEMALE/OTHER/AI/ROBOT
- `nationality_id`: Reference to nationalities table

**Design Decisions**:
- **1:1 relationship** with contacts (contact_id is PK and FK)
- **Multiple titles support**: JSON arrays allow multiple titles (Ing. + Mgr. before, PhD. + CSc. after)
- **No birth_date**: Removed per requirement (not stored in Contact MDM)
- **AI/ROBOT gender**: Support for AI assistants and robotic contacts
- **Languages as M:N**: Removed language_id FK, moved to separate junction table (contact_languages)
- **Auto-update trigger**: Automatic updated_at timestamp

**Title Examples**:
```sql
-- Single titles
INSERT INTO contact_persons (contact_id, first_name, last_name, titles_before, titles_after)
VALUES ('uuid-peter', 'Peter', 'Nový', '["Ing."]', '["PhD."]');

-- Multiple titles
INSERT INTO contact_persons (contact_id, first_name, last_name, titles_before, titles_after)
VALUES ('uuid-jan', 'Ján', 'Kováč', '["Ing.", "Mgr."]', '["PhD.", "CSc."]');

-- No titles
INSERT INTO contact_persons (contact_id, first_name, last_name)
VALUES ('uuid-anna', 'Anna', 'Nováková');
```

**Gender Options**:
- **MALE**: Male person
- **FEMALE**: Female person
- **OTHER**: Non-binary or other gender identity
- **AI**: Artificial intelligence assistant (e.g., ChatGPT contact for AI integrations)
- **ROBOT**: Robotic system or automated process contact

**GDPR Note**:
- **NO birth_date**: Birth date NOT stored in Contact (MDM) - goes to HR microservice if needed
- **NO rodné číslo**: Goes to HR microservice if EMPLOYEE role

---

### Table 4: `contact_companies` (Company Details) ✅

**Purpose**: Company-specific attributes (inheritance from contacts)

```sql
CREATE TABLE contact_companies (
    contact_id UUID PRIMARY KEY REFERENCES contacts(id) ON DELETE CASCADE,

    -- Company identification
    company_name VARCHAR(255) NOT NULL,
    legal_form_id UUID NULL REFERENCES legal_forms(id),  -- Reference table for international legal forms

    -- Registration details
    registration_number VARCHAR(20) NULL,  -- IČO (Identifikačné číslo organizácie)
    tax_number VARCHAR(20) NULL,           -- DIČ (Daňové identifikačné číslo)
    vat_number VARCHAR(20) NULL,           -- IČ DPH

    -- Business registry
    registry_court VARCHAR(100) NULL,      -- Okresný súd Bratislava I
    registry_section VARCHAR(10) NULL,     -- Sro
    registry_number VARCHAR(20) NULL,      -- 123456/B

    -- Company details
    description TEXT NULL,                 -- Company description/profile
    employee_count INT NULL,               -- Number of employees
    annual_revenue DECIMAL(15,2) NULL,     -- Annual revenue/turnover
    founded_date DATE NULL,                -- Company establishment date

    -- Company status
    company_status VARCHAR(30) NOT NULL DEFAULT 'PLANNED' CHECK (company_status IN (
        'PLANNED',        -- Plánovaná (bez IČO/DIČ)
        'IN_FORMATION',   -- V procese zakladania
        'ACTIVE',         -- Aktívna/Založená (IČO/DIČ povinné v Pythone)
        'SUSPENDED',      -- Pozastavená (dočasne nefunguje)
        'IN_BANKRUPTCY',  -- V konkurze
        'DISSOLVED'       -- Zrušená
    )),
    is_vat_payer BOOLEAN NOT NULL DEFAULT FALSE,  -- Platca DPH (IČ DPH)

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_companies_name ON contact_companies(company_name);
CREATE INDEX idx_contact_companies_ico ON contact_companies(registration_number);
CREATE INDEX idx_contact_companies_dic ON contact_companies(tax_number);
CREATE INDEX idx_contact_companies_legal_form ON contact_companies(legal_form_id);
CREATE INDEX idx_contact_companies_status ON contact_companies(company_status);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_companies_updated_at
    BEFORE UPDATE ON contact_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_companies_updated_at();
```

**Fields**:
- `contact_id` (UUID PK/FK): 1:1 with contacts table
- `company_name`: Official company name
- `legal_form_id`: FK to legal_forms reference table (supports international companies: s.r.o., GmbH, LLC, etc.)
- `registration_number` (IČO): 8-digit organization ID
- `tax_number` (DIČ): Tax ID
- `vat_number` (IČ DPH): VAT registration number
- `registry_court`, `registry_section`, `registry_number`: Obchodný register details
- `description`: Company profile/description
- `employee_count`: Company size in employees
- `annual_revenue`: Revenue/turnover in EUR (15 digits, 2 decimals)
- `founded_date`: Company establishment/founding date
- `company_status` (ENUM): Company lifecycle status (PLANNED/IN_FORMATION/ACTIVE/SUSPENDED/IN_BANKRUPTCY/DISSOLVED)
- `is_vat_payer` (BOOLEAN): VAT payer flag (determines if IČ DPH required)

**Design Decisions**:
- 1:1 relationship with contacts
- All fields nullable (not all companies require full details)
- Separate IČO/DIČ/IČ DPH fields (Slovak tax system specifics)
- Registry details for legal compliance verification
- **Legal form as FK**: Reference table supports international companies (GmbH, LLC, S.A., etc.)
- **founded_date**: Company/unit establishment date (optional historical data)
- **company_status**: Lifecycle tracking with validation implications
  - **PLANNED**: Company in planning phase (IČO/DIČ NOT required)
  - **IN_FORMATION**: Establishment process started (IČO/DIČ may be pending)
  - **ACTIVE**: Fully established company (IČO/DIČ required in Python validation)
  - **SUSPENDED**: Temporarily inactive/suspended operations (maintains registration data)
  - **IN_BANKRUPTCY**: Company in bankruptcy proceedings
  - **DISSOLVED**: Company no longer active/liquidated
- **is_vat_payer**: Determines if IČ DPH (VAT ID) is required
  - If TRUE: vat_number must be provided (validated in Python)
  - If FALSE: vat_number optional
- **Validation in Python**: Status-dependent field validation (e.g., ACTIVE requires IČO/DIČ)
- **Automatic trigger**: updated_at managed by PostgreSQL trigger

**Python Validation Examples**:
```python
# Status-dependent validation
def validate_company(company: Company):
    """Validate company fields based on company_status"""

    # ACTIVE companies MUST have IČO/DIČ
    if company.company_status == 'ACTIVE':
        if not company.registration_number:
            raise ValidationError("IČO required for ACTIVE companies")
        if not company.tax_number:
            raise ValidationError("DIČ required for ACTIVE companies")

    # VAT payers MUST have IČ DPH
    if company.is_vat_payer:
        if not company.vat_number:
            raise ValidationError("IČ DPH required for VAT payers")

    # PLANNED companies can have minimal data
    if company.company_status == 'PLANNED':
        # IČO/DIČ optional, only company_name required
        pass

# Usage in create endpoint
@router.post("/companies")
async def create_company(data: CompanyCreateSchema):
    company = Company(**data.dict())
    validate_company(company)  # Status-dependent validation
    db.add(company)
    db.commit()
    return company
```

**Slovak Context**:
- IČO: 8-digit number (00000000-99999999)
- DIČ: 10-digit number (starts with 2 for companies)
- IČ DPH: SK + 10 digits (e.g., SK2021234567)
- Legal forms: s.r.o. (LLC), a.s. (joint-stock), SZČO (sole proprietor)

---

### Table 5: `contact_organizational_units` (Organizational Unit Details) ✅

**Purpose**: Organizational unit-specific attributes (inheritance from contacts)

```sql
CREATE TABLE contact_organizational_units (
    contact_id UUID PRIMARY KEY REFERENCES contacts(id) ON DELETE CASCADE,

    -- Organization unit details
    unit_name VARCHAR(255) NOT NULL,
    unit_type_id UUID NULL REFERENCES organizational_unit_types(id),

    -- Optional details
    description TEXT NULL,
    founded_date DATE NULL,                -- Unit establishment date

    -- Unit status
    unit_status VARCHAR(30) NOT NULL DEFAULT 'PLANNED' CHECK (unit_status IN (
        'PLANNED',        -- Plánovaná (v príprave)
        'IN_FORMATION',   -- V procese vytvárania
        'ACTIVE',         -- Aktívna/Fungujúca
        'SUSPENDED',      -- Pozastavená (dočasne nefunguje)
        'DISSOLVED'       -- Zrušená
    )),

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_org_units_name ON contact_organizational_units(unit_name);
CREATE INDEX idx_org_units_type ON contact_organizational_units(unit_type_id);
CREATE INDEX idx_org_units_status ON contact_organizational_units(unit_status);

-- Trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_org_units_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_org_units_updated_at
    BEFORE UPDATE ON contact_organizational_units
    FOR EACH ROW
    EXECUTE FUNCTION update_org_units_updated_at();
```

**Fields**:
- `contact_id` (UUID PK/FK): 1:1 with contacts table
- `unit_name` (VARCHAR 255): Name of organizational unit
- `unit_type_id` (UUID FK): Reference to organizational_unit_types
- `description` (TEXT): Optional description
- `founded_date` (DATE): Unit establishment/founding date
- `unit_status` (ENUM): Unit lifecycle status (PLANNED/IN_FORMATION/ACTIVE/SUSPENDED/DISSOLVED)

**Design Decisions**:
- **Parent tracking**: Via `PART_OF` role with `related_contact_id` (not FK)
  - Allows organizational unit to change parent company (acquisitions, reorganizations)
  - Maintains history via role validity period (valid_from, valid_to)
- **Flexible types**: Reference table for unit types (can add new types without schema changes)
- **Multi-level hierarchy**: Company → Division → Department → Team (via cascading PART_OF roles)
- **unit_status**: Lifecycle tracking for organizational units
  - **PLANNED**: Unit in planning phase (not yet operational)
  - **IN_FORMATION**: Creation process started (structure being established)
  - **ACTIVE**: Fully operational unit
  - **SUSPENDED**: Temporarily inactive (e.g., reorganization, pending decision)
  - **DISSOLVED**: Unit disbanded/closed

**Hierarchy Example**:
```sql
-- BOSSystems (company)
INSERT INTO contacts (type) VALUES ('COMPANY');  -- uuid-bossystems

-- Sales Division (belongs to BOSSystems)
INSERT INTO contacts (type) VALUES ('ORGANIZATIONAL_UNIT');  -- uuid-sales-div
INSERT INTO contact_organizational_units (contact_id, unit_name, unit_type_id)
VALUES ('uuid-sales-div', 'Sales Division', (SELECT id FROM organizational_unit_types WHERE type_code = 'DIVISION'));
INSERT INTO contact_roles (contact_id, role_type, related_contact_id)
VALUES ('uuid-sales-div', 'PART_OF', 'uuid-bossystems');

-- Development Team (belongs to Sales Division)
INSERT INTO contacts (type) VALUES ('ORGANIZATIONAL_UNIT');  -- uuid-dev-team
INSERT INTO contact_organizational_units (contact_id, unit_name, unit_type_id)
VALUES ('uuid-dev-team', 'Development Team', (SELECT id FROM organizational_unit_types WHERE type_code = 'TEAM'));
INSERT INTO contact_roles (contact_id, role_type, related_contact_id)
VALUES ('uuid-dev-team', 'PART_OF', 'uuid-sales-div');
```

---

### Table 6: `organizational_unit_types` (Reference Table)

**Purpose**: Reference data for organizational unit types

```sql
CREATE TABLE organizational_unit_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Type identification
    type_code VARCHAR(50) NOT NULL UNIQUE,  -- DIVISION, DEPARTMENT, TEAM
    type_name_sk VARCHAR(100) NOT NULL,      -- Divízia, Oddelenie, Tím
    type_name_en VARCHAR(100) NOT NULL,      -- Division, Department, Team

    -- Optional hierarchy level (for sorting)
    hierarchy_level INT NULL,  -- 1=Division, 2=Department, 3=Team

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_org_unit_types_code ON organizational_unit_types(type_code);
CREATE INDEX idx_org_unit_types_active ON organizational_unit_types(is_active);
```

**Pre-populated Data**:
```sql
INSERT INTO organizational_unit_types (type_code, type_name_sk, type_name_en, hierarchy_level) VALUES
('DIVISION', 'Divízia', 'Division', 1),
('DEPARTMENT', 'Oddelenie', 'Department', 2),
('TEAM', 'Tím', 'Team', 3),
('BRANCH', 'Pobočka', 'Branch', 1),
('PROJECT_GROUP', 'Projektová skupina', 'Project Group', 3);
```

**Why Reference Table?**
- Easy to add new unit types (WORKSHOP, LABORATORY, SALES_OFFICE)
- Supports translations (SK + EN names)
- Optional hierarchy_level for organizational chart rendering
- Can migrate to ENUM later if performance needed

---

### Table 7: `legal_forms` (Reference Table)

**Purpose**: Legal forms for companies (international support)

```sql
CREATE TABLE legal_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Legal form identification
    form_code VARCHAR(20) NOT NULL UNIQUE,  -- s.r.o., a.s., GmbH, LLC, SA, etc.

    -- Legal form names
    form_name_sk VARCHAR(100) NOT NULL,     -- Spoločnosť s ručením obmedzeným
    form_name_en VARCHAR(100) NOT NULL,     -- Limited Liability Company

    -- Country specifics
    country_id UUID NULL REFERENCES countries(id),  -- NULL = international/multiple countries

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_legal_forms_code ON legal_forms(form_code);
CREATE INDEX idx_legal_forms_country ON legal_forms(country_id);
CREATE INDEX idx_legal_forms_active ON legal_forms(is_active);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_legal_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_legal_forms_updated_at
    BEFORE UPDATE ON legal_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_legal_forms_updated_at();
```

**Pre-populated Data Examples**:
```sql
-- Slovak legal forms
INSERT INTO legal_forms (form_code, form_name_sk, form_name_en, country_id) VALUES
('s.r.o.', 'Spoločnosť s ručením obmedzeným', 'Limited Liability Company', (SELECT id FROM countries WHERE iso_code_2 = 'SK')),
('a.s.', 'Akciová spoločnosť', 'Joint-Stock Company', (SELECT id FROM countries WHERE iso_code_2 = 'SK')),
('s.z.č.o.', 'Samostatne zárobkovo činná osoba', 'Sole Proprietor', (SELECT id FROM countries WHERE iso_code_2 = 'SK'));

-- German legal forms
INSERT INTO legal_forms (form_code, form_name_sk, form_name_en, country_id) VALUES
('GmbH', 'Gesellschaft mit beschränkter Haftung', 'Limited Liability Company', (SELECT id FROM countries WHERE iso_code_2 = 'DE')),
('AG', 'Aktiengesellschaft', 'Stock Corporation', (SELECT id FROM countries WHERE iso_code_2 = 'DE'));

-- US legal forms
INSERT INTO legal_forms (form_code, form_name_sk, form_name_en, country_id) VALUES
('LLC', 'Limited Liability Company', 'Limited Liability Company', (SELECT id FROM countries WHERE iso_code_2 = 'US')),
('Corp.', 'Corporation', 'Corporation', (SELECT id FROM countries WHERE iso_code_2 = 'US')),
('Inc.', 'Incorporated', 'Incorporated', (SELECT id FROM countries WHERE iso_code_2 = 'US'));

-- French legal forms
INSERT INTO legal_forms (form_code, form_name_sk, form_name_en, country_id) VALUES
('SA', 'Société Anonyme', 'Public Limited Company', (SELECT id FROM countries WHERE iso_code_2 = 'FR')),
('SARL', 'Société à Responsabilité Limitée', 'Limited Liability Company', (SELECT id FROM countries WHERE iso_code_2 = 'FR'));
```

**Design Decisions**:
- **International support**: Table-based approach supports companies from any country
- **Country FK nullable**: Some legal forms used in multiple countries (e.g., LLC)
- **Unique form_code**: Ensures no duplicates (use country prefix if needed: SK_s.r.o., DE_GmbH)
- **Bilingual names**: Slovak and English for UI display
- **Extensible**: Easy to add new countries and legal forms without code changes

---

### Table 8: `countries` (Reference Table)

**Purpose**: Country reference data for addresses and nationalities

```sql
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Country names (native, English, Slovak)
    name_native VARCHAR(100) NOT NULL,  -- Slovensko, Deutschland, Polska
    name_en VARCHAR(100) NOT NULL,      -- Slovakia, Germany, Poland
    name_sk VARCHAR(100) NOT NULL,      -- Slovensko, Nemecko, Poľsko

    -- ISO codes
    iso_code_2 CHAR(2) NOT NULL UNIQUE, -- SK
    iso_code_3 CHAR(3) NOT NULL UNIQUE, -- SVK
    iso_numeric CHAR(3) NOT NULL,       -- 703

    -- Additional details
    phone_code VARCHAR(10) NULL,        -- +421
    currency_code CHAR(3) NULL,         -- EUR
    timezone VARCHAR(50) NULL,          -- Europe/Bratislava, Europe/Prague, Europe/Warsaw

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_countries_iso2 ON countries(iso_code_2);
CREATE INDEX idx_countries_iso3 ON countries(iso_code_3);
CREATE INDEX idx_countries_active ON countries(is_active);
```

**Pre-populated Data Examples**:
```sql
INSERT INTO countries (name_native, name_en, name_sk, iso_code_2, iso_code_3, iso_numeric, phone_code, currency_code, timezone) VALUES
('Slovensko', 'Slovakia', 'Slovensko', 'SK', 'SVK', '703', '+421', 'EUR', 'Europe/Bratislava'),
('Česká republika', 'Czech Republic', 'Česká republika', 'CZ', 'CZE', '203', '+420', 'CZK', 'Europe/Prague'),
('Polska', 'Poland', 'Poľsko', 'PL', 'POL', '616', '+48', 'PLN', 'Europe/Warsaw'),
('Magyarország', 'Hungary', 'Maďarsko', 'HU', 'HUN', '348', '+36', 'HUF', 'Europe/Budapest'),
('Österreich', 'Austria', 'Rakúsko', 'AT', 'AUT', '040', '+43', 'EUR', 'Europe/Vienna');
```

---

### Table 9: `languages` (Reference Table)

**Purpose**: Language reference data for contact preferences

```sql
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Language names (native, English, Slovak)
    name_native VARCHAR(100) NOT NULL,  -- Slovenčina, English, Deutsch
    name_en VARCHAR(100) NOT NULL,      -- Slovak, English, German
    name_sk VARCHAR(100) NOT NULL,      -- Slovenčina, Angličtina, Nemčina

    -- ISO codes
    iso_code_2 CHAR(2) NOT NULL UNIQUE, -- sk
    iso_code_3 CHAR(3) NOT NULL UNIQUE, -- slk

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_languages_iso2 ON languages(iso_code_2);
CREATE INDEX idx_languages_active ON languages(is_active);
```

**Pre-populated Data Examples**:
```sql
INSERT INTO languages (name_native, name_en, name_sk, iso_code_2, iso_code_3) VALUES
('Slovenčina', 'Slovak', 'Slovenčina', 'sk', 'slk'),
('Čeština', 'Czech', 'Čeština', 'cs', 'ces'),
('English', 'English', 'Angličtina', 'en', 'eng'),
('Deutsch', 'German', 'Nemčina', 'de', 'deu'),
('Magyar', 'Hungarian', 'Maďarčina', 'hu', 'hun');
```

---

### Table 10: `nationalities` (Reference Table)

**Purpose**: Nationality reference data for persons

```sql
CREATE TABLE nationalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Nationality names (native, English, Slovak)
    name_native VARCHAR(100) NOT NULL,  -- Slovenská, British, Deutsche
    name_en VARCHAR(100) NOT NULL,      -- Slovak, British, German
    name_sk VARCHAR(100) NOT NULL,      -- Slovenská, Britská, Nemecká

    -- Reference to country
    country_id UUID NULL REFERENCES countries(id),

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nationalities_country ON nationalities(country_id);
CREATE INDEX idx_nationalities_active ON nationalities(is_active);
```

**Pre-populated Data Examples**:
```sql
-- Assuming countries are already inserted with known UUIDs
INSERT INTO nationalities (name_native, name_en, name_sk, country_id) VALUES
('Slovenská', 'Slovak', 'Slovenská', (SELECT id FROM countries WHERE iso_code_2 = 'SK')),
('Česká', 'Czech', 'Česká', (SELECT id FROM countries WHERE iso_code_2 = 'CZ')),
('Polska', 'Polish', 'Poľská', (SELECT id FROM countries WHERE iso_code_2 = 'PL'));
```

---

### Table 11: `business_focus_areas` (Reference Table)

**Purpose**: Business focus areas/industries (oblasti podnikania)

```sql
CREATE TABLE business_focus_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Area identification
    area_code VARCHAR(50) NOT NULL UNIQUE,  -- IT_SOFTWARE, MANUFACTURING_AUTOMOTIVE, etc.

    -- Area names
    area_name_sk VARCHAR(100) NOT NULL,     -- Vývoj softvéru
    area_name_en VARCHAR(100) NOT NULL,     -- Software Development

    -- Categorization
    category VARCHAR(50) NULL,              -- IT, MANUFACTURING, SERVICES, RETAIL, etc.

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_focus_code ON business_focus_areas(area_code);
CREATE INDEX idx_business_focus_category ON business_focus_areas(category);
CREATE INDEX idx_business_focus_active ON business_focus_areas(is_active);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_business_focus_areas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_business_focus_areas_updated_at
    BEFORE UPDATE ON business_focus_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_business_focus_areas_updated_at();
```

**Pre-populated Data Examples**:
```sql
-- IT & Software
INSERT INTO business_focus_areas (area_code, area_name_sk, area_name_en, category) VALUES
('IT_SOFTWARE', 'Vývoj softvéru', 'Software Development', 'IT'),
('IT_CONSULTING', 'IT poradenstvo', 'IT Consulting', 'IT'),
('IT_INFRASTRUCTURE', 'IT infraštruktúra', 'IT Infrastructure', 'IT');

-- Manufacturing
INSERT INTO business_focus_areas (area_code, area_name_sk, area_name_en, category) VALUES
('MFG_AUTOMOTIVE', 'Automobilový priemysel', 'Automotive Industry', 'MANUFACTURING'),
('MFG_ELECTRONICS', 'Elektronika', 'Electronics', 'MANUFACTURING'),
('MFG_MACHINERY', 'Strojárstvo', 'Machinery', 'MANUFACTURING');

-- Services
INSERT INTO business_focus_areas (area_code, area_name_sk, area_name_en, category) VALUES
('SVC_CONSULTING', 'Poradenstvo', 'Consulting', 'SERVICES'),
('SVC_FINANCE', 'Finančné služby', 'Financial Services', 'SERVICES'),
('SVC_LOGISTICS', 'Logistika', 'Logistics', 'SERVICES');

-- Retail & E-commerce
INSERT INTO business_focus_areas (area_code, area_name_sk, area_name_en, category) VALUES
('RETAIL_ECOMMERCE', 'E-commerce', 'E-commerce', 'RETAIL'),
('RETAIL_WHOLESALE', 'Veľkoobchod', 'Wholesale', 'RETAIL');
```

**Design Decisions**:
- **M:N relationship**: One company can operate in multiple areas (e.g., IT + Consulting)
- **Category grouping**: Allows filtering by high-level category (IT, MANUFACTURING, etc.)
- **Extensible**: Easy to add new business areas as needed
- **Bilingual**: Slovak and English names for UI

---
### Table 12: `addresses` (Reusable Address Pool)

**Purpose**: Reusable addresses (M:N relationship with contacts)

```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Address components
    street VARCHAR(255) NOT NULL,
    street_number VARCHAR(20) NULL,  -- Číslo domu
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id),

    -- Additional details
    region VARCHAR(100) NULL,        -- Kraj / Región
    district VARCHAR(100) NULL,      -- Okres

    -- Coordinates (optional)
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_postal ON addresses(postal_code);
CREATE INDEX idx_addresses_country ON addresses(country_id);
```

**Fields**:
- `id` (UUID): Unique address identifier
- `street`, `street_number`, `city`, `postal_code`: Standard address components
- `country_id` (UUID FK): Reference to countries table
- `region`, `district`: Slovak administrative divisions
- `latitude`, `longitude`: GPS coordinates for logistics

**Design Decisions**:
- **Reusable addresses**: Multiple contacts can share same address
- M:N relationship via `contact_addresses` junction table
- Supports international addresses (country_id FK)
- Optional GPS coordinates for delivery optimization

**Why Reusable Addresses?**
```
Example: Office building at "Hlavná 123, Bratislava"
- Company A (headquarter)
- Company B (office space)
- Employee X (work address)
→ All share same address record, linked via contact_addresses
```

---

### Table 13: `person_addresses` (M:N Junction Table) ✅

**Purpose**: Link persons to addresses with person-specific address types

```sql
CREATE TABLE person_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contact_persons(contact_id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,

    -- Address type classification (person-specific types only)
    address_type VARCHAR(50) NOT NULL CHECK (address_type IN (
        'PERSONAL',           -- Trvalý pobyt / Permanent residence
        'WORK',               -- Pracovná adresa / Work address
        'BILLING',            -- Fakturačná adresa (živnostník)
        'DELIVERY',           -- Dodacia adresa (živnostník)
        'CORRESPONDENCE'      -- Korešpondenčná adresa
    )),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- Validity period (optional)
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT person_addresses_unique UNIQUE (contact_id, address_id, address_type)
);

-- Indexes
CREATE INDEX idx_person_addresses_contact ON person_addresses(contact_id);
CREATE INDEX idx_person_addresses_address ON person_addresses(address_id);
CREATE INDEX idx_person_addresses_type ON person_addresses(address_type);
CREATE INDEX idx_person_addresses_primary ON person_addresses(contact_id, address_type, is_primary) WHERE is_primary = TRUE;
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact_persons.contact_id (NOT contacts.id)
- `address_id` (UUID FK): Reference to addresses pool
- `address_type` (ENUM): Person-specific address types (5 values)
- `is_primary` (BOOLEAN): Primary address per type
- `valid_from`, `valid_to` (DATE): Address validity period

**Design Decisions**:
- **Type safety**: Person CANNOT have HEADQUARTERS or WAREHOUSE (enforced by CHECK constraint)
- **PERSONAL vs WORK**: Person can have both (employee living elsewhere)
- **BILLING/DELIVERY**: For self-employed persons (živnostník)
- **Multiple addresses allowed**: All types except PERSONAL (typically one permanent residence)

**Example - Self-Employed Person**:
```sql
-- Jan Novák (živnostník) with multiple addresses:

-- 1. PERSONAL: Permanent residence
INSERT INTO person_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-jan', 'uuid-addr-home', 'PERSONAL', TRUE);

-- 2. WORK: Office/workshop address
INSERT INTO person_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-jan', 'uuid-addr-office', 'WORK', TRUE);

-- 3. BILLING: Different billing address for invoices
INSERT INTO person_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-jan', 'uuid-addr-po-box', 'BILLING', TRUE);
```

---

### Table 14: `company_addresses` (M:N Junction Table) ✅

**Purpose**: Link companies to addresses with company-specific address types

```sql
CREATE TABLE company_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contact_companies(contact_id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,

    -- Address type classification (company-specific types only)
    address_type VARCHAR(50) NOT NULL CHECK (address_type IN (
        'HEADQUARTERS',       -- Sídlo firmy (from obchodný register)
        'BILLING',            -- Fakturačná adresa
        'DELIVERY',           -- Dodacia adresa
        'WAREHOUSE',          -- Sklad
        'BRANCH',             -- Pobočka
        'CORRESPONDENCE'      -- Korešpondenčná adresa
    )),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- Validity period (optional)
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT company_addresses_unique UNIQUE (contact_id, address_id, address_type)
);

-- Indexes
CREATE INDEX idx_company_addresses_contact ON company_addresses(contact_id);
CREATE INDEX idx_company_addresses_address ON company_addresses(address_id);
CREATE INDEX idx_company_addresses_type ON company_addresses(address_type);
CREATE INDEX idx_company_addresses_primary ON company_addresses(contact_id, address_type, is_primary) WHERE is_primary = TRUE;

-- 🚨 CRITICAL: Only ONE HEADQUARTERS address per company (database-level enforcement)
CREATE UNIQUE INDEX idx_company_addresses_headquarters_unique
    ON company_addresses(contact_id)
    WHERE address_type = 'HEADQUARTERS';
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact_companies.contact_id (NOT contacts.id)
- `address_id` (UUID FK): Reference to addresses pool
- `address_type` (ENUM): Company-specific address types (6 values)
- `is_primary` (BOOLEAN): Primary address per type
- `valid_from`, `valid_to` (DATE): Address validity period

**Design Decisions**:
- **🚨 HEADQUARTERS constraint**: Only ONE headquarters address per company (enforced via partial unique index)
  - Company CANNOT have multiple headquarters addresses
  - Ensures legal compliance (obchodný register has single sídlo)
  - Attempts to insert second HEADQUARTERS will fail with unique constraint violation
- **BILLING addresses**: Multiple allowed, ONE must be is_primary = TRUE
  - Example: Main billing address + PO Box for invoices
  - Primary address used as default for invoice generation
- **DELIVERY addresses**: Multiple allowed, ONE must be is_primary = TRUE
  - Example: Main warehouse + regional distribution centers
  - Primary address used as default for shipments
- **Historical tracking**: valid_from/valid_to for address changes (company relocations, closed warehouses)
- **Type safety**: Company CANNOT have PERSONAL or WORK addresses (enforced by CHECK constraint)

**Example - Company with Multiple Locations**:
```sql
-- Company XYZ s.r.o. with multiple addresses:

-- 1. HEADQUARTERS: Only ONE allowed (enforced by unique index)
INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-xyz', 'uuid-addr-1', 'HEADQUARTERS', TRUE);

-- 2. BILLING addresses: Multiple allowed, one primary
INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary) VALUES
('uuid-xyz', 'uuid-addr-1', 'BILLING', TRUE),    -- Same as headquarters (primary)
('uuid-xyz', 'uuid-addr-2', 'BILLING', FALSE);   -- PO Box for invoices

-- 3. DELIVERY addresses: Multiple allowed, one primary
INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary) VALUES
('uuid-xyz', 'uuid-addr-3', 'DELIVERY', TRUE),   -- Main warehouse (primary)
('uuid-xyz', 'uuid-addr-4', 'DELIVERY', FALSE),  -- Regional distribution center
('uuid-xyz', 'uuid-addr-5', 'DELIVERY', FALSE);  -- Eastern office warehouse

-- 4. BRANCH offices
INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-xyz', 'uuid-addr-6', 'BRANCH', FALSE);

-- 🚨 INVALID: Second HEADQUARTERS would fail (unique index violation)
-- INSERT INTO company_addresses (contact_id, address_id, address_type)
-- VALUES ('uuid-xyz', 'uuid-addr-7', 'HEADQUARTERS');  -- ❌ ERROR!
```

---

### Table 15: `organizational_unit_addresses` (M:N Junction Table) ✅

**Purpose**: Link organizational units to addresses with unit-specific address types

```sql
CREATE TABLE organizational_unit_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contact_organizational_units(contact_id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,

    -- Address type classification (organizational unit types only)
    address_type VARCHAR(50) NOT NULL CHECK (address_type IN (
        'BRANCH',             -- Pobočka divízie/oddelenia
        'WAREHOUSE',          -- Sklad organizational unit
        'DELIVERY',           -- Dodacia adresa
        'CORRESPONDENCE'      -- Korešpondenčná adresa
    )),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- Validity period (optional)
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT org_unit_addresses_unique UNIQUE (contact_id, address_id, address_type)
);

-- Indexes
CREATE INDEX idx_org_unit_addresses_contact ON organizational_unit_addresses(contact_id);
CREATE INDEX idx_org_unit_addresses_address ON organizational_unit_addresses(address_id);
CREATE INDEX idx_org_unit_addresses_type ON organizational_unit_addresses(address_type);
CREATE INDEX idx_org_unit_addresses_primary ON organizational_unit_addresses(contact_id, address_type, is_primary) WHERE is_primary = TRUE;
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact_organizational_units.contact_id (NOT contacts.id)
- `address_id` (UUID FK): Reference to addresses pool
- `address_type` (ENUM): Organizational unit-specific address types (4 values)
- `is_primary` (BOOLEAN): Primary address per type
- `valid_from`, `valid_to` (DATE): Address validity period

**Design Decisions**:
- **Type safety**: Organizational unit CANNOT have HEADQUARTERS, BILLING, PERSONAL, or WORK (enforced by CHECK constraint)
- **NO HEADQUARTERS**: Organizational units are part of company (company has headquarters, not unit)
- **NO BILLING**: Billing at company level (organizational units don't invoice separately)
- **BRANCH**: Physical location of organizational unit (e.g., Sales Division East Slovakia office)
- **WAREHOUSE**: Unit-specific warehouse (e.g., Manufacturing Department warehouse)

**Example - Division with Regional Offices**:
```sql
-- Sales Division with multiple branch offices:

-- 1. BRANCH: Main division office
INSERT INTO organizational_unit_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-sales-div', 'uuid-addr-ba', 'BRANCH', TRUE);

-- 2. BRANCH: Regional offices
INSERT INTO organizational_unit_addresses (contact_id, address_id, address_type, is_primary) VALUES
('uuid-sales-div', 'uuid-addr-ke', 'BRANCH', FALSE),  -- Košice regional office
('uuid-sales-div', 'uuid-addr-za', 'BRANCH', FALSE);  -- Žilina regional office

-- 3. WAREHOUSE: Division-specific warehouse
INSERT INTO organizational_unit_addresses (contact_id, address_id, address_type, is_primary)
VALUES ('uuid-sales-div', 'uuid-addr-warehouse', 'WAREHOUSE', TRUE);
```

---

### Table 16: `contact_emails` (Work Emails Only)

**Purpose**: Business email addresses (NO personal emails - GDPR)

```sql
CREATE TABLE contact_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

    email VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL DEFAULT 'WORK' CHECK (email_type IN (
        'WORK',              -- Pracovný email
        'BILLING',           -- Fakturačný email
        'SUPPORT',           -- Support email
        'GENERAL'            -- Všeobecný kontakt
    )),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- Validity period
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_emails_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT contact_emails_unique UNIQUE (contact_id, email)
);

CREATE INDEX idx_contact_emails_contact ON contact_emails(contact_id);
CREATE INDEX idx_contact_emails_email ON contact_emails(email);
```

**Fields**:
- `email` (VARCHAR): Email address with format validation
- `email_type` (ENUM): Email type (WORK, BILLING, SUPPORT, GENERAL)
- `is_primary` (BOOLEAN): Primary email flag
- `valid_from`, `valid_to` (DATE): Email validity period

**GDPR Compliance**:
- **ONLY WORK EMAILS** stored in Contact (MDM)
- Personal emails (employee private emails) → HR microservice
- Regex validation for email format
- Email verification handled by Python backend (not database)

**Email Types**:
- `WORK` - Pracovný email (default)
- `BILLING` - Fakturačný email (invoices@company.sk)
- `SUPPORT` - Support email (support@company.sk)
- `GENERAL` - Všeobecný kontakt (info@company.sk)

**Use Cases**:
```sql
-- Create work email (default type)
INSERT INTO contact_emails (contact_id, email, is_primary) VALUES
('uuid-company', 'peter.novy@firma.sk', TRUE);

-- Create billing email
INSERT INTO contact_emails (contact_id, email, email_type) VALUES
('uuid-company', 'invoices@firma.sk', 'BILLING');

-- Find all billing emails for contact
SELECT email FROM contact_emails
WHERE contact_id = 'uuid-company'
  AND email_type = 'BILLING'
  AND valid_to IS NULL;
```

---

### Table 17: `contact_phones` (Work Phones Only)

**Purpose**: Business phone numbers (NO personal phones - GDPR)

```sql
CREATE TABLE contact_phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

    phone_number VARCHAR(50) NOT NULL,
    phone_type VARCHAR(50) NOT NULL DEFAULT 'MOBILE' CHECK (phone_type IN (
        'MOBILE',            -- Mobil
        'FAX',               -- Fax
        'FIXED_LINE'         -- Pevná linka
    )),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- Phone details
    country_id UUID NOT NULL REFERENCES countries(id),  -- Country code lookup
    extension VARCHAR(10) NULL,  -- Linka

    -- Validity period
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_phones_unique UNIQUE (contact_id, phone_number, country_id)
);

CREATE INDEX idx_contact_phones_contact ON contact_phones(contact_id);
CREATE INDEX idx_contact_phones_country ON contact_phones(country_id);
CREATE INDEX idx_contact_phones_number ON contact_phones(phone_number);
```

**Fields**:
- `phone_number` (VARCHAR): Phone number (without country code)
- `phone_type` (ENUM): Phone type (MOBILE, FAX, FIXED_LINE)
- `country_id` (UUID FK): Reference to countries table (provides phone_code like +421)
- `extension` (VARCHAR): Internal extension/linka
- `is_primary` (BOOLEAN): Primary phone flag
- `valid_from`, `valid_to` (DATE): Phone validity period

**GDPR Compliance**:
- **ONLY WORK PHONES** stored in Contact (MDM)
- Personal mobile phones (employee private) → HR microservice
- Country code via foreign key to countries table (referential integrity)

**Country Code Defaults**:
- Default country_id set based on contact's primary address country or company headquarters country
- Phone code (+421, +420, etc.) retrieved from countries.phone_code field
- Supports international phone numbers with proper country association

**Phone Types**:
- `MOBILE` - Mobil (default)
- `FAX` - Fax
- `FIXED_LINE` - Pevná linka

**Use Cases**:
```sql
-- Create mobile phone (default type)
INSERT INTO contact_phones (contact_id, phone_number, country_id, is_primary) VALUES
('uuid-company', '901234567', (SELECT id FROM countries WHERE iso_code_2 = 'SK'), TRUE);

-- Create fax number
INSERT INTO contact_phones (contact_id, phone_number, phone_type, country_id) VALUES
('uuid-company', '212345678', 'FAX', (SELECT id FROM countries WHERE iso_code_2 = 'SK'));

-- Find all mobile phones for contact
SELECT phone_number, phone_code
FROM contact_phones cp
JOIN countries co ON cp.country_id = co.id
WHERE cp.contact_id = 'uuid-company'
  AND cp.phone_type = 'MOBILE'
  AND cp.valid_to IS NULL;
```

---

### Table 18: `contact_websites` (M:N Junction Table)

**Purpose**: Link contacts to websites (applies to ALL contact types: PERSON, COMPANY, ORGANIZATIONAL_UNIT)

```sql
CREATE TABLE contact_websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

    -- Website details
    website_url VARCHAR(500) NOT NULL,
    website_type VARCHAR(50) NOT NULL DEFAULT 'MAIN' CHECK (website_type IN (
        'MAIN',              -- Main website
        'SHOP',              -- E-commerce/online shop
        'BLOG',              -- Blog/news
        'SUPPORT',           -- Support/help desk
        'PORTFOLIO'          -- Portfolio/showcase
    )),

    -- Primary website designation
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,  -- Main website

    -- Validity period
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE NULL,  -- NULL = currently valid

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_websites_unique UNIQUE (contact_id, website_url)
);

CREATE INDEX idx_contact_websites_contact ON contact_websites(contact_id);
CREATE INDEX idx_contact_websites_primary ON contact_websites(contact_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_contact_websites_active ON contact_websites(contact_id) WHERE valid_to IS NULL;

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_websites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_websites_updated_at
    BEFORE UPDATE ON contact_websites
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_websites_updated_at();
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact (ANY type)
- `website_url` (VARCHAR): Full URL (https://example.com)
- `website_type` (ENUM): Website type (MAIN, SHOP, BLOG, SUPPORT, PORTFOLIO)
- `is_primary` (BOOLEAN): Main website flag
- `valid_from`, `valid_to`: Validity period (historical tracking)

**Design Decisions**:
- **M:N relationship**: One contact can have multiple websites (main site + shop + blog)
- **Primary website**: One contact should have one primary website (is_primary = TRUE)
- **Applies to ALL**: PERSON (personal website), COMPANY (corporate site), ORGANIZATIONAL_UNIT (department site)
- **Historical tracking**: valid_from/valid_to for website URL changes

**Website Types**:
- `MAIN` - Main website (default)
- `SHOP` - E-commerce/online shop
- `BLOG` - Blog/news
- `SUPPORT` - Support/help desk
- `PORTFOLIO` - Portfolio/showcase

**Use Cases**:
```sql
-- Company with main website (default type)
INSERT INTO contact_websites (contact_id, website_url, is_primary) VALUES
('uuid-company', 'https://example.com', TRUE);

-- Add e-shop website
INSERT INTO contact_websites (contact_id, website_url, website_type) VALUES
('uuid-company', 'https://shop.example.com', 'SHOP');

-- Person with portfolio website
INSERT INTO contact_websites (contact_id, website_url, website_type, is_primary) VALUES
('uuid-peter', 'https://peternovy.dev', 'PORTFOLIO', TRUE);

-- Find all shop websites for contact
SELECT website_url
FROM contact_websites
WHERE contact_id = 'uuid-company'
  AND website_type = 'SHOP'
  AND valid_to IS NULL;

-- Find primary website for contact
SELECT website_url, website_type
FROM contact_websites
WHERE contact_id = 'uuid-company'
  AND is_primary = TRUE
  AND valid_to IS NULL;
```

---

### Table 19: `contact_social_networks` (M:N Junction Table)

**Purpose**: Link contacts to social media profiles (applies to ALL contact types: PERSON, COMPANY, ORGANIZATIONAL_UNIT)

```sql
CREATE TABLE contact_social_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

    -- Social network details
    platform VARCHAR(50) NOT NULL CHECK (platform IN (
        'LINKEDIN',   -- LinkedIn
        'FACEBOOK',   -- Facebook
        'TWITTER',    -- Twitter/X
        'INSTAGRAM',  -- Instagram
        'YOUTUBE',    -- YouTube
        'GITHUB',     -- GitHub
        'XING',       -- XING (professional network, popular in Germany)
        'TIKTOK'      -- TikTok
    )),
    profile_url VARCHAR(500) NOT NULL,

    -- Primary social network designation
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,  -- Main social media profile

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_social_networks_unique UNIQUE (contact_id, platform, profile_url)
);

CREATE INDEX idx_contact_social_networks_contact ON contact_social_networks(contact_id);
CREATE INDEX idx_contact_social_networks_platform ON contact_social_networks(platform);
CREATE INDEX idx_contact_social_networks_primary ON contact_social_networks(contact_id, is_primary) WHERE is_primary = TRUE;

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_social_networks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_social_networks_updated_at
    BEFORE UPDATE ON contact_social_networks
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_social_networks_updated_at();
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact (ANY type)
- `platform` (ENUM): Social media platform (LINKEDIN, FACEBOOK, TWITTER, etc.)
- `profile_url` (VARCHAR): Full profile URL
- `is_primary` (BOOLEAN): Main social media profile

**Design Decisions**:
- **M:N relationship**: One contact can have multiple social media profiles
- **Primary profile**: One contact should have one primary profile (is_primary = TRUE)
- **Applies to ALL**: PERSON (personal profiles), COMPANY (corporate pages), ORGANIZATIONAL_UNIT (department pages)
- **Platform enum**: Most common social networks + GitHub (for developers) + XING (German market)
- **Unique constraint**: One contact cannot have duplicate platform+URL combination

**Use Cases**:
```sql
-- Company with LinkedIn, Facebook, and YouTube
INSERT INTO contact_social_networks (contact_id, platform, profile_url, is_primary) VALUES
('uuid-company', 'LINKEDIN', 'https://linkedin.com/company/example', TRUE),
('uuid-company', 'FACEBOOK', 'https://facebook.com/example', FALSE),
('uuid-company', 'YOUTUBE', 'https://youtube.com/@example', FALSE);

-- Person with LinkedIn and GitHub
INSERT INTO contact_social_networks (contact_id, platform, profile_url, is_primary) VALUES
('uuid-peter', 'LINKEDIN', 'https://linkedin.com/in/peternovy', TRUE),
('uuid-peter', 'GITHUB', 'https://github.com/peternovy', FALSE);

-- Find all LinkedIn profiles for companies
SELECT c.id, cc.company_name, csn.profile_url
FROM contacts c
JOIN contact_companies cc ON c.id = cc.contact_id
JOIN contact_social_networks csn ON c.id = csn.contact_id
WHERE csn.platform = 'LINKEDIN'
  AND c.deleted_at IS NULL;

-- Find primary social network for contact
SELECT platform, profile_url
FROM contact_social_networks
WHERE contact_id = 'uuid-company'
  AND is_primary = TRUE;
```

**Business Context**:
- **LinkedIn**: Primary professional network (B2B, recruitment, company pages)
- **Facebook**: Consumer engagement, local businesses
- **XING**: German-speaking markets (popular alternative to LinkedIn in DE/AT/CH)
- **GitHub**: Developer portfolios, open-source companies
- **Instagram/TikTok**: Consumer brands, visual content

---

### Table 20: `tags` (Reference Table)

**Purpose**: Tag definitions for contact classification and filtering

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tag details
    tag_name VARCHAR(50) NOT NULL UNIQUE,   -- VIP, Problematic, Strategic Partner
    tag_color VARCHAR(7) NULL,               -- #FF5733 (hex color for UI)
    description TEXT NULL,

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID NULL  -- Future: reference to users table
);

CREATE INDEX idx_tags_name ON tags(tag_name);
CREATE INDEX idx_tags_active ON tags(is_active);
```

**Fields**:
- `tag_name` (VARCHAR 50): Unique tag identifier (VIP, Problematic, Strategic)
- `tag_color` (VARCHAR 7): Hex color for UI badges (#FF5733)
- `description` (TEXT): Optional tag description/purpose
- `is_active` (BOOLEAN): Soft disable (archive old tags)

**Design Decisions**:
- **Reusable tags**: One tag definition → many contacts
- **Color coding**: Visual classification in UI (red for problematic, gold for VIP)
- **Soft disable**: is_active flag instead of deletion (preserve history)

**Example Tags**:
```sql
INSERT INTO tags (tag_name, tag_color, description) VALUES
('VIP', '#FFD700', 'High-priority customer requiring special attention'),
('Problematic', '#FF5733', 'Customer with payment or communication issues'),
('Strategic Partner', '#2196F3', 'Long-term strategic business relationship'),
('New Customer', '#4CAF50', 'Recently acquired customer (< 6 months)'),
('High Volume', '#9C27B0', 'High transaction volume supplier/customer');
```

---

### Table 21: `contact_tags` (M:N Junction Table)

**Purpose**: Link contacts to tags (many-to-many relationship)

```sql
CREATE TABLE contact_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID NULL,  -- Future: reference to users table

    -- Constraints
    CONSTRAINT contact_tags_unique UNIQUE (contact_id, tag_id)
);

CREATE INDEX idx_contact_tags_contact ON contact_tags(contact_id);
CREATE INDEX idx_contact_tags_tag ON contact_tags(tag_id);
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact
- `tag_id` (UUID FK): Reference to tag
- `created_at` (TIMESTAMP): When tag was assigned
- `created_by_id` (UUID): Who assigned the tag (future user tracking)

**Design Decisions**:
- **M:N relationship**: One contact → many tags, one tag → many contacts
- **Unique constraint**: Prevent duplicate tag assignments
- **Cascade delete**: Remove tag assignments when contact or tag deleted
- **Audit trail**: Track when and who assigned tags (created_at, created_by_id)

**Use Cases**:
```sql
-- Mark contact as VIP
INSERT INTO contact_tags (contact_id, tag_id)
VALUES ('uuid-peter', (SELECT id FROM tags WHERE tag_name = 'VIP'));

-- Find all VIP contacts
SELECT c.id, p.first_name, p.last_name, comp.company_name
FROM contacts c
LEFT JOIN contact_persons p ON c.id = p.contact_id
LEFT JOIN contact_companies comp ON c.id = comp.contact_id
JOIN contact_tags ct ON c.id = ct.contact_id
JOIN tags t ON ct.tag_id = t.id
WHERE t.tag_name = 'VIP'
  AND c.deleted_at IS NULL;

-- Find all tags for a specific contact
SELECT t.tag_name, t.tag_color
FROM tags t
JOIN contact_tags ct ON t.id = ct.tag_id
WHERE ct.contact_id = 'uuid-abc-sro';

-- Find contacts with multiple tags (VIP + High Volume)
SELECT c.id
FROM contacts c
JOIN contact_tags ct1 ON c.id = ct1.contact_id
JOIN contact_tags ct2 ON c.id = ct2.contact_id
JOIN tags t1 ON ct1.tag_id = t1.id
JOIN tags t2 ON ct2.tag_id = t2.id
WHERE t1.tag_name = 'VIP'
  AND t2.tag_name = 'High Volume'
  AND c.deleted_at IS NULL;
```

**Query Performance**:
- **Indexed lookups**: Both contact_id and tag_id indexed for fast filtering
- **Tag-based search**: Find all contacts with specific tag (O(log n))
- **Multi-tag filtering**: Efficient via multiple JOINs on indexed columns

---

### Table 22: `contact_languages` (M:N Junction Table)

**Purpose**: Link contacts to languages with primary/native language designation

```sql
CREATE TABLE contact_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,

    -- Language designation
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,  -- Primary/native language

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_languages_unique UNIQUE (contact_id, language_id)
);

CREATE INDEX idx_contact_languages_contact ON contact_languages(contact_id);
CREATE INDEX idx_contact_languages_language ON contact_languages(language_id);
CREATE INDEX idx_contact_languages_primary ON contact_languages(contact_id, is_primary) WHERE is_primary = TRUE;
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact
- `language_id` (UUID FK): Reference to language
- `is_primary` (BOOLEAN): Primary/native language flag

**Design Decisions**:
- **M:N relationship**: One contact → many languages, one language → many contacts
- **Primary language**: One contact can have one primary/native language (is_primary = TRUE)
- **Multiple languages**: Support for multilingual contacts (business reality in Slovakia: SK + EN + DE common)
- **No proficiency levels**: Removed - makes no sense for companies, not needed for persons in Contact MDM
- **Unique constraint**: Prevent duplicate language assignments

**Use Cases**:
```sql
-- Contact with Slovak (primary), English, German languages
INSERT INTO contact_languages (contact_id, language_id, is_primary) VALUES
('uuid-contact', (SELECT id FROM languages WHERE iso_code_2 = 'sk'), TRUE),
('uuid-contact', (SELECT id FROM languages WHERE iso_code_2 = 'en'), FALSE),
('uuid-contact', (SELECT id FROM languages WHERE iso_code_2 = 'de'), FALSE);

-- Find all Slovak speakers
SELECT c.id, p.first_name, p.last_name
FROM contacts c
JOIN contact_persons p ON c.id = p.contact_id
JOIN contact_languages cl ON c.id = cl.contact_id
JOIN languages l ON cl.language_id = l.id
WHERE l.iso_code_2 = 'sk'
  AND c.deleted_at IS NULL;

-- Find primary language for contact
SELECT l.name_sk, l.name_en
FROM languages l
JOIN contact_languages cl ON l.id = cl.language_id
WHERE cl.contact_id = 'uuid-contact'
  AND cl.is_primary = TRUE;

-- Find all contacts speaking English
SELECT c.id, c.contact_type
FROM contacts c
JOIN contact_languages cl ON c.id = cl.contact_id
JOIN languages l ON cl.language_id = l.id
WHERE l.iso_code_2 = 'en'
  AND c.deleted_at IS NULL;
```

**Business Context (Slovakia)**:
- **Multilingual reality**: Many Slovak professionals speak 2-3 languages
- **Common combinations**: SK + EN (business), SK + HU (southern Slovakia), SK + DE (Austria/Germany trade)
- **Primary language**: Usually Slovak for Slovak citizens, but not always (minorities, immigrants)

---

### Table 23: `contact_operating_countries` (M:N Junction Table)

**Purpose**: Link contacts to countries where they operate (applies to COMPANY and ORGANIZATIONAL_UNIT)

```sql
CREATE TABLE contact_operating_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,

    -- Primary country designation
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,  -- Main country of operation

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_operating_countries_unique UNIQUE (contact_id, country_id)
);

CREATE INDEX idx_contact_operating_countries_contact ON contact_operating_countries(contact_id);
CREATE INDEX idx_contact_operating_countries_country ON contact_operating_countries(country_id);
CREATE INDEX idx_contact_operating_countries_primary ON contact_operating_countries(contact_id, is_primary) WHERE is_primary = TRUE;

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_operating_countries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_operating_countries_updated_at
    BEFORE UPDATE ON contact_operating_countries
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_operating_countries_updated_at();
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact (COMPANY or ORGANIZATIONAL_UNIT)
- `country_id` (UUID FK): Reference to country
- `is_primary` (BOOLEAN): Main country of operation

**Design Decisions**:
- **M:N relationship**: One company can operate in multiple countries
- **Primary country**: Headquarters/main operation country (is_primary = TRUE)
- **Timezone handling**: Countries table contains timezone field (time/date format preferences removed)
- **Applies to**: COMPANY and ORGANIZATIONAL_UNIT types (NOT PERSON)

**Use Cases**:
```sql
-- Company operating in Slovakia (primary), Czech Republic, and Poland
INSERT INTO contact_operating_countries (contact_id, country_id, is_primary) VALUES
('uuid-company', (SELECT id FROM countries WHERE iso_code_2 = 'SK'), TRUE),
('uuid-company', (SELECT id FROM countries WHERE iso_code_2 = 'CZ'), FALSE),
('uuid-company', (SELECT id FROM countries WHERE iso_code_2 = 'PL'), FALSE);

-- Find all companies operating in Slovakia
SELECT c.id, cc.company_name
FROM contacts c
JOIN contact_companies cc ON c.id = cc.contact_id
JOIN contact_operating_countries coc ON c.id = coc.contact_id
JOIN countries co ON coc.country_id = co.id
WHERE co.iso_code_2 = 'SK'
  AND c.deleted_at IS NULL;
```

---

### Table 24: `contact_business_focus_areas` (M:N Junction Table)

**Purpose**: Link contacts to business focus areas/industries (applies to COMPANY and ORGANIZATIONAL_UNIT)

```sql
CREATE TABLE contact_business_focus_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    focus_area_id UUID NOT NULL REFERENCES business_focus_areas(id) ON DELETE CASCADE,

    -- Primary focus designation
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,  -- Main business focus

    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT contact_business_focus_unique UNIQUE (contact_id, focus_area_id)
);

CREATE INDEX idx_contact_business_focus_contact ON contact_business_focus_areas(contact_id);
CREATE INDEX idx_contact_business_focus_area ON contact_business_focus_areas(focus_area_id);
CREATE INDEX idx_contact_business_focus_primary ON contact_business_focus_areas(contact_id, is_primary) WHERE is_primary = TRUE;

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_business_focus_areas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_business_focus_areas_updated_at
    BEFORE UPDATE ON contact_business_focus_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_business_focus_areas_updated_at();
```

**Fields**:
- `contact_id` (UUID FK): Reference to contact (COMPANY or ORGANIZATIONAL_UNIT)
- `focus_area_id` (UUID FK): Reference to business focus area
- `is_primary` (BOOLEAN): Main business focus area

**Design Decisions**:
- **M:N relationship**: One company can operate in multiple industries (e.g., IT + Consulting)
- **Primary focus**: Main business area (is_primary = TRUE)
- **Applies to**: COMPANY and ORGANIZATIONAL_UNIT types

**Use Cases**:
```sql
-- Company with primary focus on IT Software, secondary on IT Consulting
INSERT INTO contact_business_focus_areas (contact_id, focus_area_id, is_primary) VALUES
('uuid-company', (SELECT id FROM business_focus_areas WHERE area_code = 'IT_SOFTWARE'), TRUE),
('uuid-company', (SELECT id FROM business_focus_areas WHERE area_code = 'IT_CONSULTING'), FALSE);

-- Find all companies in IT industry
SELECT c.id, cc.company_name
FROM contacts c
JOIN contact_companies cc ON c.id = cc.contact_id
JOIN contact_business_focus_areas cbfa ON c.id = cbfa.contact_id
JOIN business_focus_areas bfa ON cbfa.focus_area_id = bfa.id
WHERE bfa.category = 'IT'
  AND c.deleted_at IS NULL;
```

---


## 📡 Kafka Events (Event-Driven Architecture)

**Topic Prefix**: `lkern.contacts.*`

### Event 1: `lkern.contacts.created`

**Trigger**: New contact created

**Payload**:
```json
{
  "event_id": "uuid-v4",
  "event_type": "lkern.contacts.created",
  "timestamp": "2025-11-08T14:30:00Z",
  "version": "1.0",
  "data": {
    "contact_id": "uuid-of-contact",
    "type": "PERSON",  // or "COMPANY"
    "roles": ["SUPPLIER", "CUSTOMER"],
    "person": {
      "first_name": "Peter",
      "last_name": "Nový",
      "title_before": "Ing."
    },
    "company": null,  // null if type = PERSON
    "emails": [
      {
        "email": "peter.novy@firma.sk",
        "type": "WORK",
        "is_primary": true
      }
    ],
    "phones": [
      {
        "phone_number": "901234567",
        "country_code": "+421",
        "type": "MOBILE_WORK",
        "is_primary": true
      }
    ],
    "addresses": [
      {
        "type": "HEADQUARTERS",
        "street": "Hlavná",
        "street_number": "123",
        "city": "Bratislava",
        "postal_code": "81101",
        "country_code": "SK"
      }
    ]
  }
}
```

**Subscribers**:
- Sales microservice (if CUSTOMER/CLIENT role)
- Purchasing microservice (if SUPPLIER/VENDOR/SERVICE_PROVIDER role)
- HR microservice (if EMPLOYEE role)
- PPQ microservice (for quality tracking)
- Operations microservice (for job assignments)

---

### Event 2: `lkern.contacts.updated`

**Trigger**: Contact data modified

**Payload**:
```json
{
  "event_id": "uuid-v4",
  "event_type": "lkern.contacts.updated",
  "timestamp": "2025-11-08T14:35:00Z",
  "version": "1.0",
  "data": {
    "contact_id": "uuid-of-contact",
    "changed_fields": ["first_name", "email"],
    "changes": [
      {
        "field": "first_name",
        "old_value": "Peter",
        "new_value": "Petr"
      },
      {
        "field": "email",
        "old_value": "peter.novy@old.sk",
        "new_value": "petr.novy@new.sk"
      }
    ],
    "updated_at": "2025-11-08T14:35:00Z"
  }
}
```

**Subscribers**: Same as `created` event (for local replica updates)

---

### Event 3: `lkern.contacts.role_added`

**Trigger**: New role assigned to contact

**Payload**:
```json
{
  "event_id": "uuid-v4",
  "event_type": "lkern.contacts.role_added",
  "timestamp": "2025-11-08T14:40:00Z",
  "version": "1.0",
  "data": {
    "contact_id": "uuid-of-contact",
    "role_id": "uuid-of-role-assignment",
    "role_type_id": "uuid-employee-role",
    "role_type": {
      "role_code": "EMPLOYEE",
      "role_name_sk": "Zamestnanec",
      "role_name_en": "Employee",
      "category": "HR"
    },
    "is_primary": false,
    "related_contact_id": "uuid-dev-team",
    "related_contact_name": "Development Team",
    "valid_from": "2025-11-08",
    "valid_to": null,
    "contact_summary": {
      "name": "Peter Nový",
      "email": "peter.novy@firma.sk"
    }
  }
}
```

**Use Case**:
- Contact was SUPPLIER, now also becomes EMPLOYEE
- HR microservice subscribes and creates local replica
- Original contact data remains in Contact (MDM)

---

### Event 4: `lkern.contacts.role_updated`

**Trigger**: Role assignment modified (e.g., is_primary changed, valid_to set)

**Payload**:
```json
{
  "event_id": "uuid-v4",
  "event_type": "lkern.contacts.role_updated",
  "timestamp": "2025-11-08T14:42:00Z",
  "version": "1.0",
  "data": {
    "contact_id": "uuid-of-contact",
    "role_id": "uuid-of-role-assignment",
    "role_type_id": "uuid-employee-role",
    "role_type": {
      "role_code": "EMPLOYEE",
      "role_name_sk": "Zamestnanec",
      "role_name_en": "Employee",
      "category": "HR"
    },
    "changes": [
      {
        "field": "is_primary",
        "old_value": false,
        "new_value": true
      },
      {
        "field": "valid_to",
        "old_value": null,
        "new_value": "2026-12-31"
      }
    ],
    "updated_at": "2025-11-08T14:42:00Z",
    "contact_summary": {
      "name": "Peter Nový",
      "email": "peter.novy@firma.sk"
    }
  }
}
```

**Use Case**:
- Role is_primary flag changed from false to true
- Role validity period updated (valid_to set)
- Subscribers update local replica with new role status

---

### Event 5: `lkern.contacts.role_removed`

**Trigger**: Role removed from contact

**Payload**:
```json
{
  "event_id": "uuid-v4",
  "event_type": "lkern.contacts.role_removed",
  "timestamp": "2025-11-08T14:45:00Z",
  "version": "1.0",
  "data": {
    "contact_id": "uuid-of-contact",
    "role_id": "uuid-of-role-assignment",
    "role_type_id": "uuid-supplier-role",
    "role_type": {
      "role_code": "SUPPLIER",
      "role_name_sk": "Dodávateľ",
      "role_name_en": "Supplier",
      "category": "PURCHASING"
    },
    "removed_at": "2025-11-08T14:45:00Z",
    "reason": "Contract terminated",
    "contact_summary": {
      "name": "Firma s.r.o.",
      "email": "info@firma.sk"
    }
  }
}
```

**Use Case**:
- Contact no longer has SUPPLIER role
- Purchasing microservice archives local replica
- Contact still exists in Contact (MDM) with other roles

---

### Event 6: `lkern.contacts.deleted`

**Trigger**: Contact soft-deleted

**Payload**:
```json
{
  "event_id": "uuid-v4",
  "event_type": "lkern.contacts.deleted",
  "timestamp": "2025-11-08T14:50:00Z",
  "version": "1.0",
  "data": {
    "contact_id": "uuid-of-contact",
    "deleted_at": "2025-11-08T14:50:00Z",
    "deleted_by": "user-uuid",
    "reason": "GDPR deletion request"
  }
}
```

**GDPR Compliance**:
- Soft delete in Contact (MDM) (deleted_at timestamp)
- Subscribers mark local replicas as deleted
- Actual data purge after 30 days (GDPR compliance)

---

## 🔌 REST API Endpoints (Port 4101)

### Health & Info

**GET /health**
- Health check endpoint
- Response: `{ "status": "healthy", "timestamp": "..." }`

**GET /info**
- Service information
- Response: `{ "service": "lkms101-contacts", "version": "1.0.0", "port": 4101 }`

---

### Contact Management

**POST /api/v1/contacts**
- Create new contact (Person or Company)
- Body: Contact data + roles
- Returns: Contact UUID + full data
- Publishes: `lkern.contacts.created` event

**GET /api/v1/contacts/{id}**
- Get contact by UUID
- Returns: Full contact data (person/company, roles, emails, phones, addresses)

**PUT /api/v1/contacts/{id}**
- Update contact data
- Body: Changed fields
- Returns: Updated contact
- Publishes: `lkern.contacts.updated` event

**DELETE /api/v1/contacts/{id}**
- Soft delete contact
- Returns: Deletion confirmation
- Publishes: `lkern.contacts.deleted` event

**GET /api/v1/contacts**
- List contacts with filtering
- Query params: `type`, `role`, `search`, `page`, `limit`
- Returns: Paginated contact list

---

### Role Management

**POST /api/v1/contacts/{id}/roles**
- Add role to contact
- Body: `{ "role_type_id": "uuid-role-type", "is_primary": false, "related_contact_id": null, "valid_from": "2025-11-08" }`
- Returns: Role assignment with UUID
- Publishes: `lkern.contacts.role_added` event

**PUT /api/v1/contacts/{id}/roles/{role_id}**
- Update existing role assignment
- Body: `{ "is_primary": true, "valid_to": "2026-12-31" }`
- Returns: Updated role assignment
- Publishes: `lkern.contacts.role_updated` event

**DELETE /api/v1/contacts/{id}/roles/{role_id}**
- Remove role from contact (sets valid_to to current date)
- Returns: Removal confirmation
- Publishes: `lkern.contacts.role_removed` event

**GET /api/v1/contacts/{id}/roles**
- Get all roles for contact
- Query params:
  - `active_only` (optional, default true) - Filter only active roles (valid_to IS NULL)
  - `include_role_types` (optional, default true) - Include role_types JOIN data
- Returns: List of role assignments with role type details

**Request Example**:
```json
POST /api/v1/contacts/uuid-peter-novy/roles
{
  "role_type_id": "uuid-employee-role",
  "is_primary": true,
  "related_contact_id": "uuid-dev-team",
  "valid_from": "2025-11-08"
}
```

**Response Example**:
```json
{
  "id": "uuid-role-assignment-1",
  "contact_id": "uuid-peter-novy",
  "role_type_id": "uuid-employee-role",
  "role_type": {
    "role_code": "EMPLOYEE",
    "role_name_sk": "Zamestnanec",
    "role_name_en": "Employee",
    "category": "HR"
  },
  "is_primary": true,
  "related_contact_id": "uuid-dev-team",
  "related_contact_name": "Development Team",
  "valid_from": "2025-11-08",
  "valid_to": null,
  "created_at": "2025-11-08T10:00:00Z",
  "updated_at": "2025-11-08T10:00:00Z"
}
```

---

### Address Management

**POST /api/v1/contacts/{id}/addresses**
- Add address to contact
- Body: Address data + type
- Returns: Address assignment

**PUT /api/v1/contacts/{id}/addresses/{address_id}**
- Update address
- Body: Changed address fields
- Returns: Updated address

**DELETE /api/v1/contacts/{id}/addresses/{address_id}**
- Remove address from contact
- Returns: Removal confirmation

---

### Communication Management

**Universal endpoint for emails, phones, and websites**

**POST /api/v1/contacts/{id}/communication**
- Add email, phone, or website to contact
- **Query params**: `type` (required) - `email`, `phone`, `website`
- **Body**:
  - For `email`: `{ "email": "...", "email_type": "WORK|PERSONAL", "is_primary": false }`
  - For `phone`: `{ "phone_number": "...", "phone_type": "MOBILE_WORK|LANDLINE_WORK|FAX_WORK|MOBILE_PERSONAL|LANDLINE_PERSONAL", "is_primary": false }`
  - For `website`: `{ "url": "...", "website_type": "CORPORATE|E_SHOP|BLOG|SOCIAL_MEDIA", "is_primary": false }`
- **Returns**: Communication record with UUID

**Request Examples**:
```json
// Email
POST /api/v1/contacts/uuid-123/communication?type=email
{
  "email": "info@abc-sro.sk",
  "email_type": "WORK",
  "is_primary": true
}

// Phone
POST /api/v1/contacts/uuid-123/communication?type=phone
{
  "phone_number": "+421901234567",
  "phone_type": "MOBILE_WORK",
  "is_primary": true
}

// Website
POST /api/v1/contacts/uuid-123/communication?type=website
{
  "url": "https://www.abc-sro.sk",
  "website_type": "CORPORATE",
  "is_primary": true
}
```

**PUT /api/v1/contacts/{id}/communication/{comm_id}**
- Update existing communication record
- **Query params**: `type` (required) - `email`, `phone`, `website`
- **Body**: Fields to update (same structure as POST)
- **Returns**: Updated communication record

**DELETE /api/v1/contacts/{id}/communication/{comm_id}**
- Remove communication record (soft delete)
- **Query params**: `type` (required) - `email`, `phone`, `website`
- **Returns**: 204 No Content

**GET /api/v1/contacts/{id}/communication**
- Get all communication records for contact
- **Query params**:
  - `type` (optional) - Filter by `email`, `phone`, `website` (if not provided, returns all)
  - `primary_only` (optional, default false) - Return only primary records
- **Returns**: Object with arrays of communication records

**Response Example**:
```json
GET /api/v1/contacts/uuid-123/communication

{
  "emails": [
    {
      "id": "uuid-email-1",
      "email": "info@abc-sro.sk",
      "email_type": "WORK",
      "is_primary": true,
      "is_deleted": false,
      "created_at": "2025-11-08T10:00:00Z"
    }
  ],
  "phones": [
    {
      "id": "uuid-phone-1",
      "phone_number": "+421901234567",
      "phone_type": "MOBILE_WORK",
      "is_primary": true,
      "is_deleted": false,
      "created_at": "2025-11-08T10:00:00Z"
    }
  ],
  "websites": [
    {
      "id": "uuid-web-1",
      "url": "https://www.abc-sro.sk",
      "website_type": "CORPORATE",
      "is_primary": true,
      "is_deleted": false,
      "created_at": "2025-11-08T10:00:00Z"
    }
  ]
}
```

**Backend Implementation Pattern**:
```python
# app/api/rest/communication.py
from fastapi import APIRouter, Query, Body, Response
from uuid import UUID

router = APIRouter()

@router.post("/contacts/{contact_id}/communication")
async def create_communication(
    contact_id: UUID,
    type: str = Query(..., regex="^(email|phone|website)$"),
    data: dict = Body(...)
):
    """Universal communication creation endpoint."""
    if type == "email":
        return await email_service.create(contact_id, data)
    elif type == "phone":
        return await phone_service.create(contact_id, data)
    elif type == "website":
        return await website_service.create(contact_id, data)

@router.put("/contacts/{contact_id}/communication/{comm_id}")
async def update_communication(
    contact_id: UUID,
    comm_id: UUID,
    type: str = Query(..., regex="^(email|phone|website)$"),
    data: dict = Body(...)
):
    """Universal communication update endpoint."""
    if type == "email":
        return await email_service.update(contact_id, comm_id, data)
    elif type == "phone":
        return await phone_service.update(contact_id, comm_id, data)
    elif type == "website":
        return await website_service.update(contact_id, comm_id, data)

@router.delete("/contacts/{contact_id}/communication/{comm_id}")
async def delete_communication(
    contact_id: UUID,
    comm_id: UUID,
    type: str = Query(..., regex="^(email|phone|website)$")
):
    """Universal communication deletion endpoint (soft delete)."""
    if type == "email":
        await email_service.delete(contact_id, comm_id)
    elif type == "phone":
        await phone_service.delete(contact_id, comm_id)
    elif type == "website":
        await website_service.delete(contact_id, comm_id)
    return Response(status_code=204)

@router.get("/contacts/{contact_id}/communication")
async def get_communication(
    contact_id: UUID,
    type: str = Query(None, regex="^(email|phone|website)$"),
    primary_only: bool = False
):
    """Universal communication retrieval endpoint."""
    if type:
        # Return specific type only
        if type == "email":
            items = await email_service.get_all(contact_id, primary_only)
            return {"emails": items}
        elif type == "phone":
            items = await phone_service.get_all(contact_id, primary_only)
            return {"phones": items}
        elif type == "website":
            items = await website_service.get_all(contact_id, primary_only)
            return {"websites": items}
    else:
        # Return all types
        return {
            "emails": await email_service.get_all(contact_id, primary_only),
            "phones": await phone_service.get_all(contact_id, primary_only),
            "websites": await website_service.get_all(contact_id, primary_only)
        }
```

---

### Search & Filtering

**GET /api/v1/contacts/search**
- Advanced search
- Query params: `q` (full-text), `type`, `role`, `country`, `city`
- Returns: Search results

**GET /api/v1/contacts/by-role/{role_type}**
- Get contacts by role
- Path param: `role_type` (SUPPLIER, CUSTOMER, etc.)
- Returns: Filtered contact list

---

### Relations Management

**Universal endpoint for tags, languages, social networks, operating countries, and business focus areas**

**POST /api/v1/contacts/{id}/relations**
- Add relation to contact (tag, language, social network, operating country, or business focus area)
- **Query params**: `type` (required) - `tag`, `language`, `social_network`, `operating_country`, `business_focus_area`
- **Body**:
  - For `tag`: `{ "tag_id": "uuid-tag" }`
  - For `language`: `{ "language_id": "uuid-language", "proficiency_level": "NATIVE|FLUENT|INTERMEDIATE|BASIC" }`
  - For `social_network`: `{ "platform": "LINKEDIN|FACEBOOK|INSTAGRAM|TWITTER|YOUTUBE", "profile_url": "..." }`
  - For `operating_country`: `{ "country_id": "uuid-country" }`
  - For `business_focus_area`: `{ "area_code": "IT|MANUFACTURING|LOGISTICS|..." }`
- **Returns**: Relation record with UUID

**Request Examples**:
```json
// Tag
POST /api/v1/contacts/uuid-123/relations?type=tag
{
  "tag_id": "uuid-vip-tag"
}

// Language
POST /api/v1/contacts/uuid-123/relations?type=language
{
  "language_id": "uuid-english",
  "proficiency_level": "FLUENT"
}

// Social Network
POST /api/v1/contacts/uuid-123/relations?type=social_network
{
  "platform": "LINKEDIN",
  "profile_url": "https://www.linkedin.com/in/johndoe"
}

// Operating Country
POST /api/v1/contacts/uuid-123/relations?type=operating_country
{
  "country_id": "uuid-germany"
}

// Business Focus Area
POST /api/v1/contacts/uuid-123/relations?type=business_focus_area
{
  "area_code": "IT"
}
```

**PUT /api/v1/contacts/{id}/relations/{relation_id}**
- Update existing relation
- **Query params**: `type` (required) - `tag`, `language`, `social_network`, `operating_country`, `business_focus_area`
- **Body**: Fields to update (same structure as POST)
- **Returns**: Updated relation record

**DELETE /api/v1/contacts/{id}/relations/{relation_id}**
- Remove relation from contact
- **Query params**: `type` (required) - `tag`, `language`, `social_network`, `operating_country`, `business_focus_area`
- **Returns**: 204 No Content

**GET /api/v1/contacts/{id}/relations**
- Get all relations for contact
- **Query params**:
  - `type` (optional) - Filter by relation type (if not provided, returns all)
- **Returns**: Object with arrays of relation records

**Response Example**:
```json
GET /api/v1/contacts/uuid-123/relations

{
  "tags": [
    {
      "id": "uuid-rel-1",
      "tag_id": "uuid-vip-tag",
      "tag": {
        "tag_name_sk": "VIP zákazník",
        "tag_name_en": "VIP Customer",
        "color": "#9c27b0"
      },
      "created_at": "2025-11-08T10:00:00Z"
    }
  ],
  "languages": [
    {
      "id": "uuid-rel-2",
      "language_id": "uuid-english",
      "language": {
        "language_name_sk": "Angličtina",
        "language_name_en": "English",
        "iso_code_2": "EN"
      },
      "proficiency_level": "FLUENT",
      "created_at": "2025-11-08T10:00:00Z"
    }
  ],
  "social_networks": [
    {
      "id": "uuid-rel-3",
      "platform": "LINKEDIN",
      "profile_url": "https://www.linkedin.com/in/johndoe",
      "created_at": "2025-11-08T10:00:00Z"
    }
  ],
  "operating_countries": [
    {
      "id": "uuid-rel-4",
      "country_id": "uuid-germany",
      "country": {
        "country_name_sk": "Nemecko",
        "country_name_en": "Germany",
        "iso_code_2": "DE"
      },
      "created_at": "2025-11-08T10:00:00Z"
    }
  ],
  "business_focus_areas": [
    {
      "id": "uuid-rel-5",
      "area_code": "IT",
      "area_name_sk": "Informačné technológie",
      "area_name_en": "Information Technology",
      "created_at": "2025-11-08T10:00:00Z"
    }
  ]
}
```

**Backend Implementation Pattern**:
```python
# app/api/rest/relations.py
from fastapi import APIRouter, Query, Body, Response
from uuid import UUID

router = APIRouter()

@router.post("/contacts/{contact_id}/relations")
async def create_relation(
    contact_id: UUID,
    type: str = Query(..., regex="^(tag|language|social_network|operating_country|business_focus_area)$"),
    data: dict = Body(...)
):
    """Universal relations creation endpoint."""
    if type == "tag":
        return await tag_service.create(contact_id, data)
    elif type == "language":
        return await language_service.create(contact_id, data)
    elif type == "social_network":
        return await social_network_service.create(contact_id, data)
    elif type == "operating_country":
        return await operating_country_service.create(contact_id, data)
    elif type == "business_focus_area":
        return await business_focus_area_service.create(contact_id, data)

@router.put("/contacts/{contact_id}/relations/{relation_id}")
async def update_relation(
    contact_id: UUID,
    relation_id: UUID,
    type: str = Query(..., regex="^(tag|language|social_network|operating_country|business_focus_area)$"),
    data: dict = Body(...)
):
    """Universal relations update endpoint."""
    if type == "tag":
        return await tag_service.update(contact_id, relation_id, data)
    elif type == "language":
        return await language_service.update(contact_id, relation_id, data)
    elif type == "social_network":
        return await social_network_service.update(contact_id, relation_id, data)
    elif type == "operating_country":
        return await operating_country_service.update(contact_id, relation_id, data)
    elif type == "business_focus_area":
        return await business_focus_area_service.update(contact_id, relation_id, data)

@router.delete("/contacts/{contact_id}/relations/{relation_id}")
async def delete_relation(
    contact_id: UUID,
    relation_id: UUID,
    type: str = Query(..., regex="^(tag|language|social_network|operating_country|business_focus_area)$")
):
    """Universal relations deletion endpoint."""
    if type == "tag":
        await tag_service.delete(contact_id, relation_id)
    elif type == "language":
        await language_service.delete(contact_id, relation_id)
    elif type == "social_network":
        await social_network_service.delete(contact_id, relation_id)
    elif type == "operating_country":
        await operating_country_service.delete(contact_id, relation_id)
    elif type == "business_focus_area":
        await business_focus_area_service.delete(contact_id, relation_id)
    return Response(status_code=204)

@router.get("/contacts/{contact_id}/relations")
async def get_relations(
    contact_id: UUID,
    type: str = Query(None, regex="^(tag|language|social_network|operating_country|business_focus_area)$")
):
    """Universal relations retrieval endpoint."""
    if type:
        # Return specific type only
        if type == "tag":
            items = await tag_service.get_all(contact_id)
            return {"tags": items}
        elif type == "language":
            items = await language_service.get_all(contact_id)
            return {"languages": items}
        elif type == "social_network":
            items = await social_network_service.get_all(contact_id)
            return {"social_networks": items}
        elif type == "operating_country":
            items = await operating_country_service.get_all(contact_id)
            return {"operating_countries": items}
        elif type == "business_focus_area":
            items = await business_focus_area_service.get_all(contact_id)
            return {"business_focus_areas": items}
    else:
        # Return all types
        return {
            "tags": await tag_service.get_all(contact_id),
            "languages": await language_service.get_all(contact_id),
            "social_networks": await social_network_service.get_all(contact_id),
            "operating_countries": await operating_country_service.get_all(contact_id),
            "business_focus_areas": await business_focus_area_service.get_all(contact_id)
        }
```

---

### Validation

**GET /api/v1/contacts/validate**
- **Universal validation endpoint** - checks if value already exists in database
- **Query params**:
  - `type` (required): Type of validation
    - `email` - Validate email address
    - `phone` - Validate phone number
    - `website` - Validate website URL
    - `registration_number` - Validate company registration number (IČO)
    - `tax_number` - Validate tax number (DIČ)
    - `vat_number` - Validate VAT number (IČ DPH)
  - `value` (required): Value to validate
  - `exclude_contact_id` (optional): Exclude specific contact from check (for editing existing contact)

**Response Format**:
```json
{
  "available": true,        // false if value already exists
  "conflict": null,         // contact_id if value already exists
  "message": "Email is available"
}
```

**Examples**:
```bash
# Check if email exists
GET /api/v1/contacts/validate?type=email&value=peter.novy@example.com
→ { "available": false, "conflict": "uuid-123", "message": "Email already used by contact Peter Nový" }

# Check if phone exists
GET /api/v1/contacts/validate?type=phone&value=+421901234567
→ { "available": true, "conflict": null, "message": "Phone number is available" }

# Check registration number (excluding current contact when editing)
GET /api/v1/contacts/validate?type=registration_number&value=12345678&exclude_contact_id=uuid-456
→ { "available": true, "conflict": null, "message": "Registration number is available" }

# Check website URL
GET /api/v1/contacts/validate?type=website&value=https://example.com
→ { "available": false, "conflict": "uuid-789", "message": "Website already used by ABC s.r.o." }
```

**Validation Logic by Type**:

| Type | Table | Checks |
|------|-------|--------|
| `email` | `contact_emails` | email = ? AND is_deleted = FALSE |
| `phone` | `contact_phones` | phone_number = ? AND is_deleted = FALSE |
| `website` | `contact_websites` | url = ? AND is_deleted = FALSE |
| `registration_number` | `contact_companies` | registration_number = ? AND is_deleted = FALSE |
| `tax_number` | `contact_companies` | tax_number = ? AND is_deleted = FALSE |
| `vat_number` | `contact_companies` | vat_number = ? AND is_deleted = FALSE |

**HTTP Status Codes**:
- `200 OK` - Validation successful (both available and conflict cases)
- `400 Bad Request` - Invalid `type` parameter or missing `value`
- `422 Unprocessable Entity` - Invalid `value` format (e.g., malformed email)

**Use Cases**:
1. **Frontend Form Validation** - Real-time validation as user types
2. **Duplicate Detection** - Check before creating new contact
3. **Edit Mode** - Validate changes while allowing current contact's own data

---

### 📊 REST API Summary

**Total Endpoints: 25** (vs 32+ with fragmented approach)

**Endpoint Breakdown by Category:**

| Category | Endpoints | Methods | Approach |
|----------|-----------|---------|----------|
| **Health & Info** | 2 | GET | Standard health checks |
| **Contact Management** | 5 | POST, GET, PUT, DELETE, GET (list) | CRUD operations |
| **Role Management** | 4 | POST, PUT, DELETE, GET | Dedicated role endpoints |
| **Address Management** | 3 | POST, PUT, DELETE | Dedicated address endpoints |
| **Communication** | 4 | POST, PUT, DELETE, GET | **Universal** (emails, phones, websites) |
| **Relations** | 4 | POST, PUT, DELETE, GET | **Universal** (tags, languages, social networks, countries, business areas) |
| **Search & Filtering** | 2 | GET | Advanced search + role filtering |
| **Validation** | 1 | GET | **Universal** (6 validation types) |

**Universal Endpoints - DRY Principle:**

1. **Communication Management** (`/communication`) - 4 endpoints handle 3 entity types:
   - Email, Phone, Website
   - Controlled via `?type=` query parameter
   - Single backend service class per type
   - 60% less code vs fragmented approach

2. **Relations Management** (`/relations`) - 4 endpoints handle 5 entity types:
   - Tags, Languages, Social Networks, Operating Countries, Business Focus Areas
   - Controlled via `?type=` query parameter
   - Single backend service class per type
   - 75% less code vs fragmented approach

3. **Validation** (`/validate`) - 1 endpoint handles 6 validation types:
   - Email, Phone, Website, Registration Number, Tax Number, VAT Number
   - Controlled via `?type=` query parameter
   - Single validation service with type discrimination

**Benefits of Hybrid Approach:**

- ✅ **Code Reduction**: 60-75% less boilerplate code
- ✅ **Maintainability**: 4 service classes instead of 8+
- ✅ **Consistency**: Uniform API patterns across entity types
- ✅ **Flexibility**: Easy to add new types without new endpoints
- ✅ **DRY Compliance**: No duplicated CRUD logic
- ✅ **Type Safety**: Query param validation via FastAPI regex

**API Design Decisions:**

| Entity Group | Endpoint Type | Reason |
|--------------|---------------|--------|
| Roles | Dedicated | Complex contextual binding logic (related_contact_id) |
| Addresses | Dedicated | Complex multi-field structure (street, city, country, etc.) |
| Communication | Universal | Simple key-value structures, identical CRUD operations |
| Relations | Universal | Junction table operations, identical patterns |
| Validation | Universal | Read-only checks, no state changes |

**Frontend Integration Example:**
```typescript
// Universal communication endpoint usage
const api = {
  // Add email
  addEmail: (contactId, data) =>
    POST(`/contacts/${contactId}/communication?type=email`, data),

  // Add phone
  addPhone: (contactId, data) =>
    POST(`/contacts/${contactId}/communication?type=phone`, data),

  // Get all communication
  getAllCommunication: (contactId) =>
    GET(`/contacts/${contactId}/communication`),

  // Add tag
  addTag: (contactId, data) =>
    POST(`/contacts/${contactId}/relations?type=tag`, data),

  // Validate email
  validateEmail: (email) =>
    GET(`/contacts/validate?type=email&value=${email}`)
};
```

---

## 🔧 gRPC API (Port 5101)

**Purpose**: Internal microservice communication for high-performance contact data access

**Service Definition** (`infrastructure/proto/contacts.proto`):

```protobuf
syntax = "proto3";

package lkern.contacts.v1;

service ContactService {
  // ============================================================
  // Contact CRUD
  // ============================================================
  rpc GetContact (GetContactRequest) returns (Contact);
  rpc ListContacts (ListContactsRequest) returns (ListContactsResponse);
  rpc CreateContact (CreateContactRequest) returns (Contact);
  rpc UpdateContact (UpdateContactRequest) returns (Contact);
  rpc DeleteContact (DeleteContactRequest) returns (DeleteContactResponse);

  // ============================================================
  // Role Management
  // ============================================================
  rpc AddRole (AddRoleRequest) returns (RoleAssignment);
  rpc UpdateRole (UpdateRoleRequest) returns (RoleAssignment);
  rpc RemoveRole (RemoveRoleRequest) returns (RemoveRoleResponse);
  rpc GetContactRoles (GetContactRolesRequest) returns (GetContactRolesResponse);

  // ============================================================
  // Communication Management (Emails, Phones, Websites)
  // ============================================================
  rpc AddEmail (AddEmailRequest) returns (Email);
  rpc AddPhone (AddPhoneRequest) returns (Phone);
  rpc AddWebsite (AddWebsiteRequest) returns (Website);
  rpc GetCommunication (GetCommunicationRequest) returns (CommunicationResponse);

  // ============================================================
  // Relations Management (Tags, Languages, Social Networks, etc.)
  // ============================================================
  rpc AddTag (AddTagRequest) returns (TagAssignment);
  rpc AddLanguage (AddLanguageRequest) returns (LanguageAssignment);
  rpc AddSocialNetwork (AddSocialNetworkRequest) returns (SocialNetwork);
  rpc GetRelations (GetRelationsRequest) returns (RelationsResponse);

  // ============================================================
  // Address Management
  // ============================================================
  rpc AddAddress (AddAddressRequest) returns (Address);
  rpc UpdateAddress (UpdateAddressRequest) returns (Address);
  rpc GetAddresses (GetAddressesRequest) returns (GetAddressesResponse);

  // ============================================================
  // Validation (for other microservices)
  // ============================================================
  rpc ValidateEmail (ValidateRequest) returns (ValidateResponse);
  rpc ValidatePhone (ValidateRequest) returns (ValidateResponse);
  rpc ValidateRegistrationNumber (ValidateRequest) returns (ValidateResponse);

  // ============================================================
  // Bulk Operations (for performance)
  // ============================================================
  rpc GetContactsBulk (GetContactsBulkRequest) returns (GetContactsBulkResponse);
  rpc GetContactsByRole (GetContactsByRoleRequest) returns (GetContactsByRoleResponse);
  rpc GetContactsByIds (GetContactsByIdsRequest) returns (GetContactsByIdsResponse);
}

// ============================================================
// Message Definitions - Core Entities
// ============================================================

message Contact {
  string id = 1;
  string type = 2;  // PERSON, COMPANY, ORGANIZATIONAL_UNIT

  // Type-specific details
  Person person = 3;
  Company company = 4;
  OrganizationalUnit organizational_unit = 5;

  // Relationships
  repeated RoleAssignment roles = 6;
  repeated Email emails = 7;
  repeated Phone phones = 8;
  repeated Website websites = 9;
  repeated Address addresses = 10;
  repeated TagAssignment tags = 11;
  repeated LanguageAssignment languages = 12;
  repeated SocialNetwork social_networks = 13;

  // Audit
  string created_at = 14;
  string updated_at = 15;
  bool is_deleted = 16;
}

message Person {
  string id = 1;
  string first_name = 2;
  string last_name = 3;
  string title_before = 4;
  string title_after = 5;
  string birth_date = 6;
  string nationality_id = 7;
  string gender = 8;  // MALE, FEMALE, OTHER
}

message Company {
  string id = 1;
  string company_name = 2;
  string legal_form_id = 3;
  string registration_number = 4;
  string tax_number = 5;
  string vat_number = 6;
  string established_date = 7;
}

message OrganizationalUnit {
  string id = 1;
  string unit_name = 2;
  string unit_type = 3;  // DIVISION, DEPARTMENT, TEAM
  string parent_unit_id = 4;
}

// ============================================================
// Message Definitions - Roles
// ============================================================

message RoleAssignment {
  string id = 1;
  string contact_id = 2;
  string role_type_id = 3;
  RoleType role_type = 4;  // Nested role details
  bool is_primary = 5;
  string related_contact_id = 6;
  string valid_from = 7;
  string valid_to = 8;
  string created_at = 9;
  string updated_at = 10;
}

message RoleType {
  string id = 1;
  string role_code = 2;  // SUPPLIER, CUSTOMER, EMPLOYEE, etc.
  string role_name_sk = 3;
  string role_name_en = 4;
  string category = 5;  // PURCHASING, SALES, HR, ORGANIZATIONAL, PARTNERSHIP
}

// ============================================================
// Message Definitions - Communication
// ============================================================

message Email {
  string id = 1;
  string contact_id = 2;
  string email = 3;
  string email_type = 4;  // WORK, PERSONAL
  bool is_primary = 5;
  bool is_deleted = 6;
  string created_at = 7;
}

message Phone {
  string id = 1;
  string contact_id = 2;
  string phone_number = 3;
  string phone_type = 4;  // MOBILE_WORK, LANDLINE_WORK, FAX_WORK, MOBILE_PERSONAL, LANDLINE_PERSONAL
  bool is_primary = 5;
  bool is_deleted = 6;
  string created_at = 7;
}

message Website {
  string id = 1;
  string contact_id = 2;
  string url = 3;
  string website_type = 4;  // CORPORATE, E_SHOP, BLOG, SOCIAL_MEDIA
  bool is_primary = 5;
  bool is_deleted = 6;
  string created_at = 7;
}

message CommunicationResponse {
  repeated Email emails = 1;
  repeated Phone phones = 2;
  repeated Website websites = 3;
}

// ============================================================
// Message Definitions - Relations
// ============================================================

message TagAssignment {
  string id = 1;
  string contact_id = 2;
  string tag_id = 3;
  Tag tag = 4;  // Nested tag details
  string created_at = 5;
}

message Tag {
  string id = 1;
  string tag_name_sk = 2;
  string tag_name_en = 3;
  string color = 4;
}

message LanguageAssignment {
  string id = 1;
  string contact_id = 2;
  string language_id = 3;
  Language language = 4;  // Nested language details
  string proficiency_level = 5;  // NATIVE, FLUENT, INTERMEDIATE, BASIC
  string created_at = 6;
}

message Language {
  string id = 1;
  string language_name_sk = 2;
  string language_name_en = 3;
  string iso_code_2 = 4;
}

message SocialNetwork {
  string id = 1;
  string contact_id = 2;
  string platform = 3;  // LINKEDIN, FACEBOOK, INSTAGRAM, TWITTER, YOUTUBE
  string profile_url = 4;
  string created_at = 5;
}

message RelationsResponse {
  repeated TagAssignment tags = 1;
  repeated LanguageAssignment languages = 2;
  repeated SocialNetwork social_networks = 3;
}

// ============================================================
// Message Definitions - Addresses
// ============================================================

message Address {
  string id = 1;
  string contact_id = 2;
  string address_type = 3;  // HEADQUARTERS, BRANCH, BILLING, SHIPPING, HOME, WORK
  string street = 4;
  string street_number = 5;
  string city = 6;
  string postal_code = 7;
  string country_id = 8;
  string region = 9;
  bool is_primary = 10;
  string valid_from = 11;
  string valid_to = 12;
  string created_at = 13;
  string updated_at = 14;
}

message GetAddressesResponse {
  repeated Address addresses = 1;
}

// ============================================================
// Message Definitions - Validation
// ============================================================

message ValidateRequest {
  string value = 1;
  string exclude_contact_id = 2;  // Optional - exclude specific contact from check
}

message ValidateResponse {
  bool available = 1;
  string conflict_contact_id = 2;  // Contact ID if value already exists
  string message = 3;
}

// ============================================================
// Message Definitions - Bulk Operations
// ============================================================

message GetContactsByRoleRequest {
  string role_code = 1;  // SUPPLIER, CUSTOMER, EMPLOYEE, etc.
  bool active_only = 2;  // Filter only active roles (valid_to IS NULL)
  int32 limit = 3;
  int32 offset = 4;
}

message GetContactsByRoleResponse {
  repeated Contact contacts = 1;
  int32 total_count = 2;
}

message GetContactsByIdsRequest {
  repeated string contact_ids = 1;
}

message GetContactsByIdsResponse {
  repeated Contact contacts = 1;
}

message GetContactsBulkRequest {
  repeated string contact_ids = 1;
  bool include_deleted = 2;
}

message GetContactsBulkResponse {
  repeated Contact contacts = 1;
  int32 found_count = 2;
  int32 not_found_count = 3;
}

// ============================================================
// Request Messages (omitted for brevity - follow pattern above)
// ============================================================
// GetContactRequest, AddRoleRequest, AddEmailRequest, etc.
```

**Usage Examples**:

**1. Get Full Contact Details** (from Sales microservice):
```python
# Sales microservice needs customer details
import grpc
from lkern.contacts.v1 import contacts_pb2, contacts_pb2_grpc

channel = grpc.insecure_channel('lkms101-contacts:5101')
stub = contacts_pb2_grpc.ContactServiceStub(channel)

# Get contact with ALL details
request = contacts_pb2.GetContactRequest(contact_id="uuid-123")
contact = stub.GetContact(request)

print(f"Customer: {contact.company.company_name}")
print(f"Emails: {[email.email for email in contact.emails]}")
print(f"Addresses: {[addr.city for addr in contact.addresses]}")
```

**2. Get Contacts by Role** (bulk operation from Purchasing microservice):
```python
# Purchasing microservice needs all suppliers
request = contacts_pb2.GetContactsByRoleRequest(
    role_code="SUPPLIER",
    active_only=True,
    limit=100,
    offset=0
)
response = stub.GetContactsByRole(request)

for contact in response.contacts:
    print(f"Supplier: {contact.company.company_name}")
    print(f"  Primary email: {next((e.email for e in contact.emails if e.is_primary), None)}")
```

**3. Validate Email** (from HR microservice before creating employee):
```python
# HR microservice wants to check if work email already exists
request = contacts_pb2.ValidateRequest(
    value="novak@abc-sro.sk"
)
response = stub.ValidateEmail(request)

if not response.available:
    print(f"Email already exists for contact: {response.conflict_contact_id}")
```

**4. Get Contacts Bulk** (from PPQ microservice - production planning):
```python
# PPQ needs details for multiple contacts at once (suppliers + customers)
contact_ids = ["uuid-supplier-1", "uuid-supplier-2", "uuid-customer-1"]

request = contacts_pb2.GetContactsBulkRequest(
    contact_ids=contact_ids,
    include_deleted=False
)
response = stub.GetContactsBulk(request)

print(f"Found: {response.found_count}, Not found: {response.not_found_count}")
for contact in response.contacts:
    print(f"Contact: {contact.id} - {contact.type}")
```

**Benefits of gRPC API**:

- ✅ **Performance**: Binary protocol (protobuf) ~10x faster than JSON
- ✅ **Type Safety**: Compile-time validation via proto files
- ✅ **Bulk Operations**: GetContactsBulk, GetContactsByRole for efficient batch queries
- ✅ **Internal Only**: Not exposed to public internet (port 5101 internal)
- ✅ **Backward Compatibility**: Protobuf field numbers ensure version compatibility
- ✅ **Auto-Generated Clients**: Python, Go, Java, C# clients from single .proto file

**When to Use gRPC vs REST**:

| Use Case | API Type | Reason |
|----------|----------|--------|
| Frontend → Backend | REST | JSON easier for JavaScript/React |
| Backend → Backend | gRPC | 10x faster, type-safe, bulk operations |
| Sales → Contacts | gRPC | Get customer details (high frequency) |
| Purchasing → Contacts | gRPC | Get supplier details (high frequency) |
| HR → Contacts | gRPC | Get employee details (high frequency) |
| External API | REST | Public API, documentation, ease of use |

---

## ⚙️ Error Handling & Retry Logic

### Backend Error Handling (Python FastAPI)

**HTTP Status Codes**:

| Status | When | Response Format |
|--------|------|-----------------|
| `200 OK` | Success (GET, PUT) | `{ data: {...} }` |
| `201 Created` | Success (POST) | `{ data: {...}, id: "uuid" }` |
| `204 No Content` | Success (DELETE) | Empty body |
| `400 Bad Request` | Invalid input (validation failed) | `{ error: "message", field: "field_name" }` |
| `404 Not Found` | Resource not found | `{ error: "Contact not found", id: "uuid" }` |
| `409 Conflict` | Duplicate (email, phone, registration_number) | `{ error: "Email already exists", conflict_id: "uuid" }` |
| `422 Unprocessable Entity` | Business logic validation failed | `{ error: "message", details: {...} }` |
| `500 Internal Server Error` | Database error, unexpected exception | `{ error: "Internal server error", request_id: "uuid" }` |

**Exception Handling Pattern**:

```python
# app/api/rest/contacts.py
from fastapi import APIRouter, HTTPException, status
from app.exceptions import ContactNotFoundError, DuplicateContactError, ValidationError

router = APIRouter()

@router.post("/contacts")
async def create_contact(data: ContactCreate):
    try:
        # 1. Validate foreign keys BEFORE INSERT
        await validate_contact_data(data)

        # 2. Create contact
        contact = await contact_service.create(data)

        # 3. Publish Kafka event
        await kafka_producer.send("lkern.contacts.created", contact)

        return {"data": contact, "id": contact.id}, 201

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": str(e), "field": e.field}
        )
    except DuplicateContactError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"error": str(e), "conflict_id": e.conflict_id}
        )
    except Exception as e:
        logger.error(f"Unexpected error creating contact: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "request_id": str(uuid.uuid4())}
        )
```

**Data Validation BEFORE INSERT**:

```python
# app/services/validation.py
async def validate_contact_data(data: ContactCreate):
    """
    Validate ALL foreign keys and business rules BEFORE INSERT.

    This prevents database constraint violations and provides
    better error messages to frontend.
    """

    # 1. Validate country_id if provided
    if data.person and data.person.nationality_id:
        nationality = await db.query(Nationality).filter_by(
            id=data.person.nationality_id
        ).first()
        if not nationality:
            raise ValidationError(
                f"Nationality not found: {data.person.nationality_id}",
                field="person.nationality_id"
            )

    # 2. Validate legal_form_id for companies
    if data.company and data.company.legal_form_id:
        legal_form = await db.query(LegalForm).filter_by(
            id=data.company.legal_form_id
        ).first()
        if not legal_form:
            raise ValidationError(
                f"Legal form not found: {data.company.legal_form_id}",
                field="company.legal_form_id"
            )

    # 3. Validate role_type_id for roles
    if data.roles:
        for role in data.roles:
            role_type = await db.query(RoleType).filter_by(
                id=role.role_type_id
            ).first()
            if not role_type:
                raise ValidationError(
                    f"Role type not found: {role.role_type_id}",
                    field="roles.role_type_id"
                )

    # 4. Validate country_id for addresses
    if data.addresses:
        for address in data.addresses:
            country = await db.query(Country).filter_by(
                id=address.country_id
            ).first()
            if not country:
                raise ValidationError(
                    f"Country not found: {address.country_id}",
                    field="addresses.country_id"
                )

    # 5. Validate language_id for languages
    if data.languages:
        for language in data.languages:
            lang = await db.query(Language).filter_by(
                id=language.language_id
            ).first()
            if not lang:
                raise ValidationError(
                    f"Language not found: {language.language_id}",
                    field="languages.language_id"
                )

    # 6. Validate tag_id for tags
    if data.tags:
        for tag in data.tags:
            tag_obj = await db.query(Tag).filter_by(
                id=tag.tag_id
            ).first()
            if not tag_obj:
                raise ValidationError(
                    f"Tag not found: {tag.tag_id}",
                    field="tags.tag_id"
                )

    # 7. Validate related_contact_id for roles (if provided)
    if data.roles:
        for role in data.roles:
            if role.related_contact_id:
                related = await db.query(Contact).filter_by(
                    id=role.related_contact_id,
                    is_deleted=False
                ).first()
                if not related:
                    raise ValidationError(
                        f"Related contact not found: {role.related_contact_id}",
                        field="roles.related_contact_id"
                    )

    # 8. Check for duplicate email (if provided)
    if data.emails:
        for email in data.emails:
            existing = await db.query(ContactEmail).filter_by(
                email=email.email,
                is_deleted=False
            ).first()
            if existing:
                raise DuplicateContactError(
                    f"Email already exists: {email.email}",
                    conflict_id=existing.contact_id
                )

    # 9. Check for duplicate phone (if provided)
    if data.phones:
        for phone in data.phones:
            existing = await db.query(ContactPhone).filter_by(
                phone_number=phone.phone_number,
                is_deleted=False
            ).first()
            if existing:
                raise DuplicateContactError(
                    f"Phone already exists: {phone.phone_number}",
                    conflict_id=existing.contact_id
                )

    # 10. Check for duplicate registration_number for companies
    if data.company and data.company.registration_number:
        existing = await db.query(ContactCompany).filter_by(
            registration_number=data.company.registration_number,
            is_deleted=False
        ).first()
        if existing:
            raise DuplicateContactError(
                f"Registration number already exists: {data.company.registration_number}",
                conflict_id=existing.contact_id
            )

    # Validation passed
    return True
```

### Frontend Retry Logic (Exponential Backoff)

**Retry Strategy for 500 Server Errors**:

```typescript
// packages/config/src/api/retryLogic.ts

interface RetryConfig {
  maxRetries: number;
  initialDelay: number; // ms
  maxDelay: number; // ms
  timeoutPerAttempt: number; // ms
  exponentialBase: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1s
  maxDelay: 10000, // 10s
  timeoutPerAttempt: 20000, // 20s per attempt
  exponentialBase: 2
};

/**
 * Exponential backoff retry logic for 500 Server Errors
 *
 * Timeline:
 * - Attempt 1: Immediate (0s)
 * - Attempt 2: After 1s delay
 * - Attempt 3: After 2s delay (exponential: 1s * 2^1)
 * - Attempt 4: After 4s delay (exponential: 1s * 2^2)
 * - Total max wait: ~10s
 * - After 10s: Show toast error to user
 * - Continue retrying up to 20s total timeout
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const cfg = { ...DEFAULT_RETRY_CONFIG, ...config };
  const startTime = Date.now();
  let lastError: Error;
  let toastShown = false;

  for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
    try {
      // Check total timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > cfg.timeoutPerAttempt) {
        throw new Error(`Request timeout after ${elapsed}ms`);
      }

      // Execute request
      return await fn();

    } catch (error: any) {
      lastError = error;

      // Only retry on 500 errors
      if (error.response?.status !== 500) {
        throw error;
      }

      // Show toast after 10s of retrying
      const elapsed = Date.now() - startTime;
      if (elapsed > 10000 && !toastShown) {
        toast.error('Server error - retrying...', {
          description: `Attempt ${attempt + 1} of ${cfg.maxRetries + 1}`,
          duration: 3000
        });
        toastShown = true;
      }

      // Stop retrying if we've exceeded total timeout
      if (elapsed > cfg.timeoutPerAttempt) {
        toast.error('Request timeout', {
          description: 'Server is not responding. Please try again later.',
          duration: 5000
        });
        throw new Error(`Request timeout after ${elapsed}ms`);
      }

      // Calculate delay for next retry (exponential backoff)
      if (attempt < cfg.maxRetries) {
        const delay = Math.min(
          cfg.initialDelay * Math.pow(cfg.exponentialBase, attempt),
          cfg.maxDelay
        );

        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }

  // All retries exhausted
  toast.error('Server error', {
    description: 'Unable to complete request. Please try again later.',
    duration: 5000
  });
  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Usage in API Client**:

```typescript
// packages/config/src/api/apiClient.ts
import { withRetry } from './retryLogic';

export const apiClient = {
  async post<T>(url: string, data: any): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}`);
        error.response = { status: response.status };
        throw error;
      }

      return response.json();
    });
  },

  async get<T>(url: string): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(url);

      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}`);
        error.response = { status: response.status };
        throw error;
      }

      return response.json();
    });
  }
};
```

**Example Usage in Component**:

```typescript
// apps/web-ui/src/pages/Contacts/Contacts.tsx
import { apiClient } from '@l-kern/config';

const handleCreateContact = async (data: ContactCreate) => {
  try {
    // Retry logic automatically applied
    const contact = await apiClient.post('/api/v1/contacts', data);

    toast.success('Contact created successfully');
    navigate(`/contacts/${contact.id}`);

  } catch (error) {
    // Error toast already shown by withRetry()
    console.error('Failed to create contact:', error);
  }
};
```

**Retry Timeline Example**:

```
User clicks "Save Contact" at t=0s

Attempt 1 (t=0s):     POST /api/v1/contacts → 500 Error
Attempt 2 (t=1s):     POST /api/v1/contacts → 500 Error (retry after 1s)
Attempt 3 (t=3s):     POST /api/v1/contacts → 500 Error (retry after 2s)
Attempt 4 (t=7s):     POST /api/v1/contacts → 500 Error (retry after 4s)

t=10s reached → Toast: "Server error - retrying... (Attempt 4 of 4)"

Attempt 4 (t=11s):    POST /api/v1/contacts → 500 Error (retry after 4s)

t=20s reached → Toast: "Request timeout. Please try again later."
Request fails permanently
```

**Benefits**:

- ✅ **User Experience**: Silent retries for transient errors (network blips, server restarts)
- ✅ **Feedback**: Toast shown after 10s so user knows something is happening
- ✅ **Safety**: Max 20s timeout prevents infinite hanging
- ✅ **Efficiency**: Exponential backoff prevents server overload during outages
- ✅ **Selective**: Only retries 500 errors (not 400/404 which are permanent)

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

**Database Layer** (repositories):
```typescript
// tests/repositories/ContactRepository.test.ts
describe('ContactRepository', () => {
  test('should create contact with person details', async () => {
    const contact = await contactRepo.create({
      type: 'PERSON',
      person: { first_name: 'Peter', last_name: 'Nový' }
    });
    expect(contact.id).toBeDefined();
    expect(contact.type).toBe('PERSON');
  });

  test('should enforce multi-role uniqueness constraint', async () => {
    // Test that duplicate active roles are prevented
  });
});
```

**Service Layer**:
```typescript
// tests/services/ContactService.test.ts
describe('ContactService', () => {
  test('should publish Kafka event on contact creation', async () => {
    const mockKafka = jest.fn();
    const service = new ContactService(mockKafka);

    await service.createContact({ ... });

    expect(mockKafka).toHaveBeenCalledWith(
      'lkern.contacts.created',
      expect.objectContaining({ contact_id: expect.any(String) })
    );
  });
});
```

---

### Integration Tests (Playwright)

**REST API Tests**:
```typescript
// tests/integration/api/contacts.test.ts
describe('POST /api/v1/contacts', () => {
  test('should create contact and return UUID', async () => {
    const response = await request.post('/api/v1/contacts', {
      type: 'PERSON',
      person: { first_name: 'Test', last_name: 'User' },
      roles: ['CUSTOMER']
    });

    expect(response.status).toBe(201);
    expect(response.data.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
```

**Kafka Event Tests**:
```typescript
// tests/integration/events/kafka.test.ts
describe('Kafka Events', () => {
  test('should receive lkern.contacts.created event', async () => {
    const consumer = kafka.consumer({ groupId: 'test-group' });
    await consumer.subscribe({ topic: 'lkern.contacts.created' });

    // Create contact via API
    await createContact({ ... });

    // Wait for event
    const event = await waitForEvent(consumer);
    expect(event.data.contact_id).toBeDefined();
  });
});
```

---

### E2E Tests (Playwright)

**UI Workflow Tests**:
```typescript
// tests/e2e/contacts/create-person.test.ts
test('should create person contact through UI', async ({ page }) => {
  await page.goto('/contacts/new');

  await page.fill('[name="type"]', 'PERSON');
  await page.fill('[name="first_name"]', 'Peter');
  await page.fill('[name="last_name"]', 'Nový');
  await page.check('[name="roles"][value="CUSTOMER"]');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/contacts\/[0-9a-f-]{36}/);
  await expect(page.locator('h1')).toContainText('Peter Nový');
});
```

---

## 📦 Implementation Phases

### Phase 1: Database Setup (3-4h)
- [ ] Create PostgreSQL schema
- [ ] Create all 25 tables with constraints
- [ ] Seed reference tables (countries, languages, nationalities)
- [ ] Write database migration scripts
- [ ] Test schema with sample data

### Phase 2: Backend Core (6-8h)
- [ ] Setup FastAPI project structure
- [ ] Implement SQLAlchemy models
- [ ] Create repository layer (CRUD operations)
- [ ] Implement service layer (business logic)
- [ ] Add validation schemas (Pydantic)
- [ ] Configure logging (NO print() statements!)

### Phase 3: REST API (4-5h)
- [ ] Implement all REST endpoints
- [ ] Add request/response validation
- [ ] Implement pagination
- [ ] Add error handling
- [ ] Write API documentation (OpenAPI/Swagger)

### Phase 4: Kafka Integration (3-4h)
- [ ] Setup Kafka producer
- [ ] Implement 5 event types
- [ ] Add event schema validation
- [ ] Test event publishing
- [ ] Add Kafka monitoring

### Phase 5: gRPC API (3-4h)
- [ ] Define protobuf schema
- [ ] Generate Python stubs
- [ ] Implement gRPC service
- [ ] Add gRPC error handling
- [ ] Test gRPC endpoints

### Phase 6: Testing (4-5h)
- [ ] Write unit tests (repository layer)
- [ ] Write service tests (business logic)
- [ ] Write integration tests (API endpoints)
- [ ] Write Kafka event tests
- [ ] Setup test coverage reporting

### Phase 7: Frontend (TBD - separate plan)
- [ ] React components for contact management
- [ ] Forms for Person/Company creation
- [ ] Multi-role selection UI
- [ ] Address management interface
- [ ] Contact search & filtering

---

## 🔗 Integration with Other Microservices

### Sales Microservice (LKMS106)
**What it receives from Contact (MDM)**:
- UUID, name, work email/phone
- Addresses (BILLING, DELIVERY)
- Role events (CUSTOMER, CLIENT added/removed)

**What it stores locally**:
- Customer IBAN (for refunds)
- Credit limit
- Payment terms
- Invoice history

**Why not in Contact (MDM)?**
- GDPR: IBAN is sensitive, belongs to Sales context
- Sales-specific data (credit limits) irrelevant to other microservices

---

### Purchasing Microservice (LKMS105)
**What it receives from Contact (MDM)**:
- UUID, name, work email/phone
- Addresses (HEADQUARTERS, DELIVERY)
- Role events (SUPPLIER, VENDOR, SERVICE_PROVIDER added/removed)

**What it stores locally**:
- Vendor IBAN (for payments)
- Payment terms
- Purchase order history
- Quality ratings

**Why not in Contact (MDM)?**
- GDPR: IBAN is sensitive, belongs to Purchasing context
- Purchasing-specific data (quality ratings) irrelevant to other microservices

---

### HR Microservice (LKMS103)
**What it receives from Contact (MDM)**:
- UUID, name, work email/phone
- Personal addresses (PERSONAL)
- Role events (EMPLOYEE added/removed)

**What it stores locally**:
- Employee IBAN (for salary payments)
- Salary information
- Rodné číslo (Slovak national ID)
- Health insurance details
- Employment contracts

**Why not in Contact (MDM)?**
- GDPR: Highly sensitive data (salary, rodné číslo)
- HR-specific data irrelevant to Sales/Purchasing

---

### PPQ Microservice (LKMS108 - Production Planning & Quality)
**What it receives from Contact (MDM)**:
- SUPPLIER contacts (for quality tracking)
- EMPLOYEE contacts (for quality assignments)

**What it stores locally**:
- Quality inspection results per supplier
- Employee quality performance metrics
- Optimization parameters (quality vs speed tradeoffs)

**Use Case**:
- Production Planning: "Which supplier has best quality for material X?"
- Quality Control: "Which employee has highest QC success rate?"

---

### Operations Microservice (LKMS109 - BPM/Job Management)
**What it receives from Contact (MDM)**:
- EMPLOYEE contacts (for job assignments)
- CUSTOMER/CLIENT contacts (for job context)

**What it stores locally**:
- Job assignments (which employee → which job)
- Workflow states (job lifecycle)
- Performance metrics (job completion times)

**Use Case**:
- Job Assignment: "Assign installation job to employee with INSTALLER role"
- Customer Jobs: "Create service job for CLIENT XYZ"

---

## 📊 Performance Considerations

### Database Indexing Strategy
```sql
-- Primary lookups
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contact_roles_contact ON contact_roles(contact_id);
CREATE INDEX idx_contact_persons_name ON contact_persons(last_name, first_name);

-- Search optimization
CREATE INDEX idx_contact_companies_name ON contact_companies(company_name);
CREATE INDEX idx_contact_emails_email ON contact_emails(email);

-- Active records filtering
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_contact_roles_active ON contact_roles(contact_id, role_type)
    WHERE valid_to IS NULL;
```

### Kafka Event Optimization
- Event batching for bulk operations
- Async event publishing (non-blocking)
- Event compression (gzip)
- Partition key: `contact_id` (ensures order per contact)

### API Performance
- Response pagination (default 50 items, max 200)
- Field selection (sparse fieldsets)
- gRPC for bulk operations (GetContactsBulk)
- Database connection pooling (10-20 connections)

---

## 🛡️ Security & GDPR

### Data Protection
- **Encryption at rest**: Database encryption (PostgreSQL TDE)
- **Encryption in transit**: TLS 1.3 for all APIs
- **API authentication**: JWT tokens (RS256)
- **API authorization**: Role-based access control (RBAC)

### GDPR Compliance
- **Right to Access**: GET /api/v1/contacts/{id} (export all data)
- **Right to Erasure**: DELETE /api/v1/contacts/{id} (soft delete → purge after 30 days)
- **Right to Rectification**: PUT /api/v1/contacts/{id} (update incorrect data)
- **Data Minimization**: NO sensitive data in Contact (MDM)
- **Purpose Limitation**: Contact data ONLY for business communication

### Audit Trail
- All changes logged (created_at, updated_at fields)
- Soft delete tracking (deleted_at, deleted_by)
- Role history tracking (valid_from, valid_to)
- Event log via Kafka (permanent audit trail)

---

## 🚀 Deployment

### Docker Configuration
```yaml
# docker-compose.yml (excerpt)
services:
  lkms101-contacts:
    build: ./services/lkms101-contacts
    ports:
      - "4101:4101"  # REST API
      - "5101:5101"  # gRPC
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/lkms101_contacts
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
      - LOG_LEVEL=INFO
    depends_on:
      - db
      - kafka
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/lkms101_contacts
DATABASE_POOL_SIZE=10

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_TOPIC_PREFIX=lkern.contacts

# API
REST_API_PORT=4101
GRPC_API_PORT=5101
API_CORS_ORIGINS=http://localhost:4200

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
```

---

## 📝 Next Steps (Table-by-Table Review)

**We'll now go through each table iteratively:**

1. **Table 1: contacts** - Base entity design review
2. **Table 2: contact_roles** - Multi-role system refinement
3. **Table 3: contact_persons** - Person attributes review
4. **Table 4: contact_companies** - Company attributes review
5. **Table 5: addresses** - Address reusability discussion
6. **Table 6: contact_addresses** - M:N junction table review
7. **Table 7: contact_emails** - Email validation & types
8. **Table 8: contact_phones** - Phone number handling
9. **Table 9-11: Reference tables** - Countries, languages, nationalities

**For each table, we'll discuss**:
- Column design (types, constraints, nullability)
- Indexing strategy (performance vs storage)
- GDPR compliance (what data belongs here vs other microservices)
- Validation rules (business logic)
- Integration points (how other microservices use this data)

**After each table review, I'll update this implementation plan.**

---

## 📚 References

- **GDPR Documentation**: GDPR Principle of Least Privilege
- **Party Model Pattern**: Martin Fowler - Analysis Patterns
- **Kafka Event Design**: Event-Driven Microservices (Manning)
- **UUID Best Practices**: RFC 4122
- **Slovak Legal Forms**: Obchodný register SR

---

**STATUS**: 🟡 Ready for table-by-table review
**NEXT ACTION**: Review Table 1 (contacts) with user

---

_This document will be iteratively updated after each table review._
