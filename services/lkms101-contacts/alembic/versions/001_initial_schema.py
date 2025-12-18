"""
================================================================
FILE: 001_initial_schema.py
PATH: /services/lkms101-contacts/alembic/versions/001_initial_schema.py
DESCRIPTION: Initial database schema for Contact MDM service (24 tables)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Revision ID: 001_initial_schema
Revises:
Create Date: 2025-12-18

Tables:
- Core: contacts, contact_roles, role_types, contact_persons, contact_companies,
        contact_organizational_units, organizational_unit_types
- Reference: legal_forms, countries, languages, nationalities, business_focus_areas
- Address: addresses, person_addresses, company_addresses, organizational_unit_addresses
- Communication: contact_emails, contact_phones, contact_websites, contact_social_networks
- Classification: tags, contact_tags, contact_languages, contact_operating_countries,
                  contact_business_focus_areas
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create all 24 tables for Contact MDM service."""

    # ============================================================
    # REFERENCE TABLES (must be created first - FK dependencies)
    # ============================================================

    # Table 1: role_types (Reference - L318-378)
    op.execute("""
        CREATE TABLE role_types (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Role identification
            role_code VARCHAR(50) NOT NULL UNIQUE,
            role_name_sk VARCHAR(100) NOT NULL,
            role_name_en VARCHAR(100) NOT NULL,

            -- Category for grouping
            category VARCHAR(50) NOT NULL CHECK (category IN (
                'purchasing',      -- Supplier-related roles
                'sales',           -- Customer-related roles
                'hr',              -- Employee-related roles
                'organizational',  -- Org unit roles
                'partnership'      -- Partner-related roles
            )),

            -- Description
            description TEXT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_role_types_code ON role_types(role_code);
        CREATE INDEX idx_role_types_category ON role_types(category);
        CREATE INDEX idx_role_types_active ON role_types(is_active);
    """)

    # Table 2: organizational_unit_types (Reference - L706-749)
    op.execute("""
        CREATE TABLE organizational_unit_types (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Unit type identification
            type_code VARCHAR(50) NOT NULL UNIQUE,
            type_name_sk VARCHAR(100) NOT NULL,
            type_name_en VARCHAR(100) NOT NULL,

            -- Hierarchy level (for sorting)
            hierarchy_level INTEGER NOT NULL DEFAULT 0,

            -- Description
            description TEXT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_org_unit_types_code ON organizational_unit_types(type_code);
        CREATE INDEX idx_org_unit_types_level ON organizational_unit_types(hierarchy_level);
    """)

    # Table 3: legal_forms (Reference - L752-828)
    op.execute("""
        CREATE TABLE legal_forms (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Legal form identification
            form_code VARCHAR(20) NOT NULL,
            form_name_sk VARCHAR(100) NOT NULL,
            form_name_en VARCHAR(100) NOT NULL,
            form_abbreviation VARCHAR(20) NOT NULL,

            -- Country where this legal form is valid
            country_code VARCHAR(2) NOT NULL,

            -- Description
            description TEXT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint per country
            CONSTRAINT legal_forms_unique UNIQUE (form_code, country_code)
        );

        CREATE INDEX idx_legal_forms_code ON legal_forms(form_code);
        CREATE INDEX idx_legal_forms_country ON legal_forms(country_code);
        CREATE INDEX idx_legal_forms_active ON legal_forms(is_active);
    """)

    # Table 4: countries (Reference - L831-875)
    op.execute("""
        CREATE TABLE countries (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- ISO codes
            iso_code_2 VARCHAR(2) NOT NULL UNIQUE,
            iso_code_3 VARCHAR(3) NOT NULL UNIQUE,

            -- Names in different languages
            country_name_sk VARCHAR(100) NOT NULL,
            country_name_en VARCHAR(100) NOT NULL,

            -- Phone and timezone
            phone_code VARCHAR(10) NOT NULL,
            timezone VARCHAR(50) NOT NULL DEFAULT 'Europe/Bratislava',

            -- EU membership
            is_eu_member BOOLEAN NOT NULL DEFAULT FALSE,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_countries_iso2 ON countries(iso_code_2);
        CREATE INDEX idx_countries_iso3 ON countries(iso_code_3);
        CREATE INDEX idx_countries_eu ON countries(is_eu_member);
        CREATE INDEX idx_countries_active ON countries(is_active);
    """)

    # Table 5: languages (Reference - L879-916)
    op.execute("""
        CREATE TABLE languages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- ISO codes
            iso_code_2 VARCHAR(2) NOT NULL UNIQUE,
            iso_code_3 VARCHAR(3) NOT NULL UNIQUE,

            -- Names in different languages
            language_name_sk VARCHAR(100) NOT NULL,
            language_name_en VARCHAR(100) NOT NULL,
            language_name_native VARCHAR(100) NOT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_languages_iso2 ON languages(iso_code_2);
        CREATE INDEX idx_languages_iso3 ON languages(iso_code_3);
        CREATE INDEX idx_languages_active ON languages(is_active);
    """)

    # Table 6: nationalities (Reference - L920-955)
    op.execute("""
        CREATE TABLE nationalities (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Link to country
            country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,

            -- Names in different languages
            nationality_name_sk VARCHAR(100) NOT NULL,
            nationality_name_en VARCHAR(100) NOT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_nationalities_country ON nationalities(country_id);
        CREATE INDEX idx_nationalities_active ON nationalities(is_active);
    """)

    # Table 7: business_focus_areas (Reference - L959-1035)
    op.execute("""
        CREATE TABLE business_focus_areas (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Area identification
            area_code VARCHAR(50) NOT NULL UNIQUE,
            area_name_sk VARCHAR(100) NOT NULL,
            area_name_en VARCHAR(100) NOT NULL,

            -- Category
            category VARCHAR(50) NOT NULL CHECK (category IN (
                'it',
                'manufacturing',
                'services',
                'trade',
                'finance',
                'healthcare',
                'education',
                'agriculture',
                'construction',
                'transport',
                'other'
            )),

            -- Description
            description TEXT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_business_focus_code ON business_focus_areas(area_code);
        CREATE INDEX idx_business_focus_category ON business_focus_areas(category);
        CREATE INDEX idx_business_focus_active ON business_focus_areas(is_active);
    """)

    # Table 8: tags (Reference - L1698-1743)
    op.execute("""
        CREATE TABLE tags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Tag details
            tag_name VARCHAR(50) NOT NULL UNIQUE,
            tag_color VARCHAR(7) NULL,
            description TEXT NULL,

            -- Status
            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_id UUID NULL
        );

        CREATE INDEX idx_tags_name ON tags(tag_name);
        CREATE INDEX idx_tags_active ON tags(is_active);
    """)

    # ============================================================
    # CORE TABLES
    # ============================================================

    # Table 9: contacts (Base entity - L93-146)
    op.execute("""
        CREATE TABLE contacts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Contact code (human-readable: CON-2512-0001)
            contact_code VARCHAR(20) NOT NULL UNIQUE,

            -- Contact type (discriminator for Party Model)
            contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN (
                'person',
                'company',
                'organizational_unit'
            )),

            -- Soft delete
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
            deleted_at TIMESTAMP NULL,
            deleted_by_id UUID NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_id UUID NULL,
            updated_by_id UUID NULL
        );

        CREATE INDEX idx_contacts_code ON contacts(contact_code);
        CREATE INDEX idx_contacts_type ON contacts(contact_type);
        CREATE INDEX idx_contacts_deleted ON contacts(is_deleted);
        CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at) WHERE deleted_at IS NULL;
    """)

    # Table 10: contact_roles (M:N - L149-314)
    op.execute("""
        CREATE TABLE contact_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            role_type_id UUID NOT NULL REFERENCES role_types(id) ON DELETE RESTRICT,

            -- Primary role flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Contextual binding (e.g., Employee OF which company/org unit)
            related_contact_id UUID NULL REFERENCES contacts(id) ON DELETE SET NULL,

            -- Validity period (for historical tracking)
            valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
            valid_to DATE NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_id UUID NULL,

            -- Prevent duplicate active roles
            CONSTRAINT contact_roles_unique_active UNIQUE (contact_id, role_type_id, related_contact_id, valid_to)
        );

        CREATE INDEX idx_contact_roles_contact ON contact_roles(contact_id);
        CREATE INDEX idx_contact_roles_type ON contact_roles(role_type_id);
        CREATE INDEX idx_contact_roles_related ON contact_roles(related_contact_id);
        CREATE INDEX idx_contact_roles_active ON contact_roles(contact_id, role_type_id)
            WHERE valid_to IS NULL;
        CREATE INDEX idx_contact_roles_primary ON contact_roles(contact_id, is_primary)
            WHERE is_primary = TRUE;
    """)

    # Table 11: contact_persons (L383-469)
    op.execute("""
        CREATE TABLE contact_persons (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL UNIQUE REFERENCES contacts(id) ON DELETE CASCADE,

            -- Name fields
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            title_before VARCHAR(50) NULL,
            title_after VARCHAR(50) NULL,

            -- Personal details
            birth_date DATE NULL,
            gender VARCHAR(10) NULL CHECK (gender IN ('male', 'female', 'other')),
            nationality_id UUID NULL REFERENCES nationalities(id) ON DELETE SET NULL,

            -- Soft delete
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_contact_persons_contact ON contact_persons(contact_id);
        CREATE INDEX idx_contact_persons_name ON contact_persons(last_name, first_name);
        CREATE INDEX idx_contact_persons_nationality ON contact_persons(nationality_id);
    """)

    # Table 12: contact_companies (L473-611)
    op.execute("""
        CREATE TABLE contact_companies (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL UNIQUE REFERENCES contacts(id) ON DELETE CASCADE,

            -- Company name
            company_name VARCHAR(255) NOT NULL,

            -- Legal form
            legal_form_id UUID NULL REFERENCES legal_forms(id) ON DELETE SET NULL,

            -- Registration numbers
            registration_number VARCHAR(50) NULL,
            tax_number VARCHAR(50) NULL,
            vat_number VARCHAR(50) NULL,

            -- Establishment date
            established_date DATE NULL,

            -- Company status
            company_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (company_status IN (
                'active',
                'inactive',
                'suspended',
                'liquidation',
                'bankrupt',
                'dissolved'
            )),

            -- Soft delete
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_contact_companies_contact ON contact_companies(contact_id);
        CREATE INDEX idx_contact_companies_name ON contact_companies(company_name);
        CREATE INDEX idx_contact_companies_reg_num ON contact_companies(registration_number);
        CREATE INDEX idx_contact_companies_status ON contact_companies(company_status);
    """)

    # Table 13: contact_organizational_units (L614-702)
    op.execute("""
        CREATE TABLE contact_organizational_units (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL UNIQUE REFERENCES contacts(id) ON DELETE CASCADE,

            -- Unit details
            unit_name VARCHAR(255) NOT NULL,
            unit_type_id UUID NOT NULL REFERENCES organizational_unit_types(id) ON DELETE RESTRICT,

            -- Parent unit (for hierarchy)
            parent_unit_id UUID NULL REFERENCES contacts(id) ON DELETE SET NULL,

            -- Parent company
            parent_company_id UUID NULL REFERENCES contacts(id) ON DELETE SET NULL,

            -- Soft delete
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_contact_org_units_contact ON contact_organizational_units(contact_id);
        CREATE INDEX idx_contact_org_units_name ON contact_organizational_units(unit_name);
        CREATE INDEX idx_contact_org_units_type ON contact_organizational_units(unit_type_id);
        CREATE INDEX idx_contact_org_units_parent ON contact_organizational_units(parent_unit_id);
        CREATE INDEX idx_contact_org_units_company ON contact_organizational_units(parent_company_id);
    """)

    # ============================================================
    # ADDRESS SYSTEM
    # ============================================================

    # Table 14: addresses (Reusable pool - L1037-1091)
    op.execute("""
        CREATE TABLE addresses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            -- Address components
            street VARCHAR(255) NOT NULL,
            street_number VARCHAR(20) NULL,
            building_number VARCHAR(20) NULL,
            city VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            region VARCHAR(100) NULL,
            country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,

            -- GPS coordinates (optional)
            latitude DECIMAL(10, 8) NULL,
            longitude DECIMAL(11, 8) NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique address constraint
            CONSTRAINT addresses_unique UNIQUE (street, street_number, city, postal_code, country_id)
        );

        CREATE INDEX idx_addresses_city ON addresses(city);
        CREATE INDEX idx_addresses_postal ON addresses(postal_code);
        CREATE INDEX idx_addresses_country ON addresses(country_id);
    """)

    # Table 15: person_addresses (M:N - L1094-1163)
    op.execute("""
        CREATE TABLE person_addresses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,

            -- Address type (person-specific)
            address_type VARCHAR(20) NOT NULL CHECK (address_type IN (
                'personal',
                'work',
                'billing',
                'delivery',
                'correspondence'
            )),

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Validity period
            valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
            valid_to DATE NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT person_addresses_unique UNIQUE (contact_id, address_id, address_type)
        );

        CREATE INDEX idx_person_addresses_contact ON person_addresses(contact_id);
        CREATE INDEX idx_person_addresses_address ON person_addresses(address_id);
        CREATE INDEX idx_person_addresses_type ON person_addresses(address_type);
        CREATE INDEX idx_person_addresses_primary ON person_addresses(contact_id, is_primary)
            WHERE is_primary = TRUE;
    """)

    # Table 16: company_addresses (M:N - L1166-1260)
    op.execute("""
        CREATE TABLE company_addresses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,

            -- Address type (company-specific)
            address_type VARCHAR(20) NOT NULL CHECK (address_type IN (
                'headquarters',
                'billing',
                'delivery',
                'warehouse',
                'branch',
                'correspondence'
            )),

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Validity period
            valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
            valid_to DATE NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT company_addresses_unique UNIQUE (contact_id, address_id, address_type)
        );

        CREATE INDEX idx_company_addresses_contact ON company_addresses(contact_id);
        CREATE INDEX idx_company_addresses_address ON company_addresses(address_id);
        CREATE INDEX idx_company_addresses_type ON company_addresses(address_type);
        CREATE INDEX idx_company_addresses_hq ON company_addresses(contact_id, address_type)
            WHERE address_type = 'headquarters';
    """)

    # Table 17: organizational_unit_addresses (M:N - L1263-1333)
    op.execute("""
        CREATE TABLE organizational_unit_addresses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,

            -- Address type (org unit-specific)
            address_type VARCHAR(20) NOT NULL CHECK (address_type IN (
                'branch',
                'warehouse',
                'delivery',
                'correspondence'
            )),

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Validity period
            valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
            valid_to DATE NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT org_unit_addresses_unique UNIQUE (contact_id, address_id, address_type)
        );

        CREATE INDEX idx_org_unit_addresses_contact ON organizational_unit_addresses(contact_id);
        CREATE INDEX idx_org_unit_addresses_address ON organizational_unit_addresses(address_id);
        CREATE INDEX idx_org_unit_addresses_type ON organizational_unit_addresses(address_type);
    """)

    # ============================================================
    # COMMUNICATION TABLES
    # ============================================================

    # Table 18: contact_emails (L1336-1406)
    op.execute("""
        CREATE TABLE contact_emails (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

            -- Email details
            email VARCHAR(255) NOT NULL,
            email_type VARCHAR(20) NOT NULL DEFAULT 'work' CHECK (email_type IN (
                'work',
                'billing',
                'support',
                'general'
            )),

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Soft delete
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique email constraint
            CONSTRAINT contact_emails_unique UNIQUE (contact_id, email)
        );

        CREATE INDEX idx_contact_emails_contact ON contact_emails(contact_id);
        CREATE INDEX idx_contact_emails_email ON contact_emails(email);
        CREATE INDEX idx_contact_emails_type ON contact_emails(email_type);
        CREATE INDEX idx_contact_emails_primary ON contact_emails(contact_id, is_primary)
            WHERE is_primary = TRUE AND is_deleted = FALSE;
    """)

    # Table 19: contact_phones (L1409-1489)
    op.execute("""
        CREATE TABLE contact_phones (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

            -- Phone details
            phone_number VARCHAR(30) NOT NULL,
            country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
            phone_type VARCHAR(20) NOT NULL DEFAULT 'mobile' CHECK (phone_type IN (
                'mobile',
                'fax',
                'fixed_line'
            )),

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Soft delete
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique phone constraint
            CONSTRAINT contact_phones_unique UNIQUE (contact_id, phone_number)
        );

        CREATE INDEX idx_contact_phones_contact ON contact_phones(contact_id);
        CREATE INDEX idx_contact_phones_number ON contact_phones(phone_number);
        CREATE INDEX idx_contact_phones_country ON contact_phones(country_id);
        CREATE INDEX idx_contact_phones_type ON contact_phones(phone_type);
        CREATE INDEX idx_contact_phones_primary ON contact_phones(contact_id, is_primary)
            WHERE is_primary = TRUE AND is_deleted = FALSE;
    """)

    # Table 20: contact_websites (L1492-1593)
    op.execute("""
        CREATE TABLE contact_websites (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

            -- Website details
            website_url VARCHAR(500) NOT NULL,
            website_type VARCHAR(20) NOT NULL DEFAULT 'main' CHECK (website_type IN (
                'main',
                'shop',
                'blog',
                'support',
                'portfolio'
            )),

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Validity period
            valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
            valid_to DATE NULL,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT contact_websites_unique UNIQUE (contact_id, website_url)
        );

        CREATE INDEX idx_contact_websites_contact ON contact_websites(contact_id);
        CREATE INDEX idx_contact_websites_primary ON contact_websites(contact_id, is_primary)
            WHERE is_primary = TRUE;
        CREATE INDEX idx_contact_websites_active ON contact_websites(contact_id)
            WHERE valid_to IS NULL;
    """)

    # Table 21: contact_social_networks (L1596-1695)
    op.execute("""
        CREATE TABLE contact_social_networks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

            -- Social network details
            platform VARCHAR(50) NOT NULL CHECK (platform IN (
                'linkedin',
                'facebook',
                'twitter',
                'instagram',
                'youtube',
                'github',
                'xing',
                'tiktok'
            )),
            profile_url VARCHAR(500) NOT NULL,

            -- Primary flag
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT contact_social_networks_unique UNIQUE (contact_id, platform, profile_url)
        );

        CREATE INDEX idx_contact_social_networks_contact ON contact_social_networks(contact_id);
        CREATE INDEX idx_contact_social_networks_platform ON contact_social_networks(platform);
        CREATE INDEX idx_contact_social_networks_primary ON contact_social_networks(contact_id, is_primary)
            WHERE is_primary = TRUE;
    """)

    # ============================================================
    # CLASSIFICATION TABLES
    # ============================================================

    # Table 22: contact_tags (M:N - L1747-1819)
    op.execute("""
        CREATE TABLE contact_tags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_id UUID NULL,

            -- Unique constraint
            CONSTRAINT contact_tags_unique UNIQUE (contact_id, tag_id)
        );

        CREATE INDEX idx_contact_tags_contact ON contact_tags(contact_id);
        CREATE INDEX idx_contact_tags_tag ON contact_tags(tag_id);
    """)

    # Table 23: contact_languages (M:N - L1822-1897)
    op.execute("""
        CREATE TABLE contact_languages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,

            -- Primary language designation
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT contact_languages_unique UNIQUE (contact_id, language_id)
        );

        CREATE INDEX idx_contact_languages_contact ON contact_languages(contact_id);
        CREATE INDEX idx_contact_languages_language ON contact_languages(language_id);
        CREATE INDEX idx_contact_languages_primary ON contact_languages(contact_id, is_primary)
            WHERE is_primary = TRUE;
    """)

    # Table 24: contact_operating_countries (M:N - L1900-1967)
    op.execute("""
        CREATE TABLE contact_operating_countries (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,

            -- Primary country designation
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT contact_operating_countries_unique UNIQUE (contact_id, country_id)
        );

        CREATE INDEX idx_contact_operating_countries_contact ON contact_operating_countries(contact_id);
        CREATE INDEX idx_contact_operating_countries_country ON contact_operating_countries(country_id);
        CREATE INDEX idx_contact_operating_countries_primary ON contact_operating_countries(contact_id, is_primary)
            WHERE is_primary = TRUE;
    """)

    # Table 25: contact_business_focus_areas (M:N - L1971-2037)
    op.execute("""
        CREATE TABLE contact_business_focus_areas (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
            focus_area_id UUID NOT NULL REFERENCES business_focus_areas(id) ON DELETE CASCADE,

            -- Primary focus designation
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,

            -- Audit fields
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Unique constraint
            CONSTRAINT contact_business_focus_unique UNIQUE (contact_id, focus_area_id)
        );

        CREATE INDEX idx_contact_business_focus_contact ON contact_business_focus_areas(contact_id);
        CREATE INDEX idx_contact_business_focus_area ON contact_business_focus_areas(focus_area_id);
        CREATE INDEX idx_contact_business_focus_primary ON contact_business_focus_areas(contact_id, is_primary)
            WHERE is_primary = TRUE;
    """)

    # ============================================================
    # TRIGGERS FOR AUTOMATIC updated_at
    # ============================================================
    op.execute("""
        -- Create function for updating timestamps
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Apply trigger to all tables with updated_at column
        CREATE TRIGGER trigger_contacts_updated_at
            BEFORE UPDATE ON contacts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_roles_updated_at
            BEFORE UPDATE ON contact_roles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_persons_updated_at
            BEFORE UPDATE ON contact_persons
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_companies_updated_at
            BEFORE UPDATE ON contact_companies
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_org_units_updated_at
            BEFORE UPDATE ON contact_organizational_units
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_addresses_updated_at
            BEFORE UPDATE ON addresses
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_person_addresses_updated_at
            BEFORE UPDATE ON person_addresses
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_company_addresses_updated_at
            BEFORE UPDATE ON company_addresses
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_org_unit_addresses_updated_at
            BEFORE UPDATE ON organizational_unit_addresses
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_emails_updated_at
            BEFORE UPDATE ON contact_emails
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_phones_updated_at
            BEFORE UPDATE ON contact_phones
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_websites_updated_at
            BEFORE UPDATE ON contact_websites
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_social_networks_updated_at
            BEFORE UPDATE ON contact_social_networks
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_languages_updated_at
            BEFORE UPDATE ON contact_languages
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_operating_countries_updated_at
            BEFORE UPDATE ON contact_operating_countries
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_contact_business_focus_updated_at
            BEFORE UPDATE ON contact_business_focus_areas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_role_types_updated_at
            BEFORE UPDATE ON role_types
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_org_unit_types_updated_at
            BEFORE UPDATE ON organizational_unit_types
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_legal_forms_updated_at
            BEFORE UPDATE ON legal_forms
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_countries_updated_at
            BEFORE UPDATE ON countries
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_languages_updated_at
            BEFORE UPDATE ON languages
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_nationalities_updated_at
            BEFORE UPDATE ON nationalities
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_business_focus_updated_at
            BEFORE UPDATE ON business_focus_areas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER trigger_tags_updated_at
            BEFORE UPDATE ON tags
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade() -> None:
    """Drop all tables in reverse order."""

    # Drop triggers first
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;")

    # Drop classification tables
    op.execute("DROP TABLE IF EXISTS contact_business_focus_areas CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_operating_countries CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_languages CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_tags CASCADE;")

    # Drop communication tables
    op.execute("DROP TABLE IF EXISTS contact_social_networks CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_websites CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_phones CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_emails CASCADE;")

    # Drop address tables
    op.execute("DROP TABLE IF EXISTS organizational_unit_addresses CASCADE;")
    op.execute("DROP TABLE IF EXISTS company_addresses CASCADE;")
    op.execute("DROP TABLE IF EXISTS person_addresses CASCADE;")
    op.execute("DROP TABLE IF EXISTS addresses CASCADE;")

    # Drop core tables
    op.execute("DROP TABLE IF EXISTS contact_organizational_units CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_companies CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_persons CASCADE;")
    op.execute("DROP TABLE IF EXISTS contact_roles CASCADE;")
    op.execute("DROP TABLE IF EXISTS contacts CASCADE;")

    # Drop reference tables
    op.execute("DROP TABLE IF EXISTS tags CASCADE;")
    op.execute("DROP TABLE IF EXISTS business_focus_areas CASCADE;")
    op.execute("DROP TABLE IF EXISTS nationalities CASCADE;")
    op.execute("DROP TABLE IF EXISTS languages CASCADE;")
    op.execute("DROP TABLE IF EXISTS countries CASCADE;")
    op.execute("DROP TABLE IF EXISTS legal_forms CASCADE;")
    op.execute("DROP TABLE IF EXISTS organizational_unit_types CASCADE;")
    op.execute("DROP TABLE IF EXISTS role_types CASCADE;")
