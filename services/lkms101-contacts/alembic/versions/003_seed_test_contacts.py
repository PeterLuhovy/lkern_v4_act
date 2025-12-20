"""
================================================================
FILE: 003_seed_test_contacts.py
PATH: /services/lkms101-contacts/alembic/versions/003_seed_test_contacts.py
DESCRIPTION: Seed test contacts for development and testing
VERSION: v1.0.0
UPDATED: 2025-12-19
================================================================

Revision ID: 003_seed_test_contacts
Revises: 002_seed_reference_data
Create Date: 2025-12-19

Seeds:
- 5 test persons (Ján Novák, Eva Kováčová, Peter Horváth, Anna Němcová, Martin Szabó)
- 5 test companies (TechSoft s.r.o., AutoParts a.s., MedicalCare GmbH, LogiTrans Kft., BuildPro s.r.o.)
- Emails, phones, addresses, roles for each contact

Soft delete pattern: deleted_at TIMESTAMP (NULL = active, timestamp = deleted)
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003_seed_test_contacts'
down_revision = '002_seed_reference_data'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Seed test contacts for development."""

    # ============================================================
    # TEST PERSONS (5)
    # ============================================================

    # Person 1: Ján Novák - Slovak, CUSTOMER + EMPLOYEE
    op.execute("""
        -- Create contact base
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('11111111-1111-1111-1111-111111111101', 'CON-2512-0001', 'person');

        -- Create person details
        INSERT INTO contact_persons (contact_id, first_name, last_name, title_before, birth_date, gender, nationality_id)
        SELECT '11111111-1111-1111-1111-111111111101', 'Ján', 'Novák', 'Ing.', '1985-03-15', 'male', n.id
        FROM nationalities n
        JOIN countries c ON n.country_id = c.id
        WHERE c.iso_code_2 = 'SK';

        -- Add email
        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('11111111-1111-1111-1111-111111111101', 'jan.novak@email.sk', 'work', TRUE);

        -- Add phone
        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '11111111-1111-1111-1111-111111111101', '+421901234567', c.id, 'mobile', TRUE
        FROM countries c WHERE c.iso_code_2 = 'SK';

        -- Add roles (CUSTOMER, EMPLOYEE)
        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '11111111-1111-1111-1111-111111111101', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'CUSTOMER';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '11111111-1111-1111-1111-111111111101', rt.id, FALSE
        FROM role_types rt WHERE rt.role_code = 'EMPLOYEE';
    """)

    # Person 2: Eva Kováčová - Slovak, SUPPLIER
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('11111111-1111-1111-1111-111111111102', 'CON-2512-0002', 'person');

        INSERT INTO contact_persons (contact_id, first_name, last_name, title_before, title_after, birth_date, gender, nationality_id)
        SELECT '11111111-1111-1111-1111-111111111102', 'Eva', 'Kováčová', 'Mgr.', 'PhD.', '1990-07-22', 'female', n.id
        FROM nationalities n
        JOIN countries c ON n.country_id = c.id
        WHERE c.iso_code_2 = 'SK';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('11111111-1111-1111-1111-111111111102', 'eva.kovacova@firma.sk', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '11111111-1111-1111-1111-111111111102', '+421902345678', c.id, 'mobile', TRUE
        FROM countries c WHERE c.iso_code_2 = 'SK';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '11111111-1111-1111-1111-111111111102', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'SUPPLIER';
    """)

    # Person 3: Peter Horváth - Slovak, PARTNER
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('11111111-1111-1111-1111-111111111103', 'CON-2512-0003', 'person');

        INSERT INTO contact_persons (contact_id, first_name, last_name, birth_date, gender, nationality_id)
        SELECT '11111111-1111-1111-1111-111111111103', 'Peter', 'Horváth', '1978-11-08', 'male', n.id
        FROM nationalities n
        JOIN countries c ON n.country_id = c.id
        WHERE c.iso_code_2 = 'SK';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('11111111-1111-1111-1111-111111111103', 'peter.horvath@partner.sk', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '11111111-1111-1111-1111-111111111103', '+421903456789', c.id, 'mobile', TRUE
        FROM countries c WHERE c.iso_code_2 = 'SK';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '11111111-1111-1111-1111-111111111103', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'PARTNER';
    """)

    # Person 4: Anna Němcová - Czech, CLIENT
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('11111111-1111-1111-1111-111111111104', 'CON-2512-0004', 'person');

        INSERT INTO contact_persons (contact_id, first_name, last_name, title_before, birth_date, gender, nationality_id)
        SELECT '11111111-1111-1111-1111-111111111104', 'Anna', 'Němcová', 'Bc.', '1992-05-30', 'female', n.id
        FROM nationalities n
        JOIN countries c ON n.country_id = c.id
        WHERE c.iso_code_2 = 'CZ';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('11111111-1111-1111-1111-111111111104', 'anna.nemcova@klient.cz', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '11111111-1111-1111-1111-111111111104', '+420601234567', c.id, 'mobile', TRUE
        FROM countries c WHERE c.iso_code_2 = 'CZ';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '11111111-1111-1111-1111-111111111104', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'CLIENT';
    """)

    # Person 5: Martin Szabó - Hungarian, PROSPECT
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('11111111-1111-1111-1111-111111111105', 'CON-2512-0005', 'person');

        INSERT INTO contact_persons (contact_id, first_name, last_name, birth_date, gender, nationality_id)
        SELECT '11111111-1111-1111-1111-111111111105', 'Martin', 'Szabó', '1988-09-12', 'male', n.id
        FROM nationalities n
        JOIN countries c ON n.country_id = c.id
        WHERE c.iso_code_2 = 'HU';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('11111111-1111-1111-1111-111111111105', 'martin.szabo@prospect.hu', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '11111111-1111-1111-1111-111111111105', '+36301234567', c.id, 'mobile', TRUE
        FROM countries c WHERE c.iso_code_2 = 'HU';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '11111111-1111-1111-1111-111111111105', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'PROSPECT';
    """)

    # ============================================================
    # TEST COMPANIES (5)
    # ============================================================

    # Company 1: TechSoft s.r.o. - Slovak IT, CUSTOMER + SUPPLIER
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('22222222-2222-2222-2222-222222222201', 'CON-2512-0006', 'company');

        INSERT INTO contact_companies (contact_id, company_name, legal_form_id, registration_number, tax_number, vat_number, established_date, company_status)
        SELECT '22222222-2222-2222-2222-222222222201', 'TechSoft', lf.id, '12345678', '2021234567', 'SK2021234567', '2010-01-15', 'active'
        FROM legal_forms lf WHERE lf.form_code = 'SK_SRO';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222201', 'info@techsoft.sk', 'work', TRUE),
               ('22222222-2222-2222-2222-222222222201', 'fakturacia@techsoft.sk', 'billing', FALSE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '22222222-2222-2222-2222-222222222201', '+421212345678', c.id, 'fixed_line', TRUE
        FROM countries c WHERE c.iso_code_2 = 'SK';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '22222222-2222-2222-2222-222222222201', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'CUSTOMER';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '22222222-2222-2222-2222-222222222201', rt.id, FALSE
        FROM role_types rt WHERE rt.role_code = 'SUPPLIER';

        -- Add address
        INSERT INTO addresses (id, street, street_number, city, postal_code, country_id)
        SELECT '33333333-3333-3333-3333-333333333301', 'Hlavná', '15', 'Bratislava', '81101', c.id
        FROM countries c WHERE c.iso_code_2 = 'SK';

        INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301', 'headquarters', TRUE);

        -- Add tag (VIP)
        INSERT INTO contact_tags (contact_id, tag_id)
        SELECT '22222222-2222-2222-2222-222222222201', t.id
        FROM tags t WHERE t.tag_name = 'VIP';
    """)

    # Company 2: AutoParts a.s. - Slovak Manufacturing, SUPPLIER
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('22222222-2222-2222-2222-222222222202', 'CON-2512-0007', 'company');

        INSERT INTO contact_companies (contact_id, company_name, legal_form_id, registration_number, tax_number, established_date, company_status)
        SELECT '22222222-2222-2222-2222-222222222202', 'AutoParts', lf.id, '87654321', '2029876543', '2005-06-20', 'active'
        FROM legal_forms lf WHERE lf.form_code = 'SK_AS';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222202', 'obchod@autoparts.sk', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '22222222-2222-2222-2222-222222222202', '+421412345678', c.id, 'fixed_line', TRUE
        FROM countries c WHERE c.iso_code_2 = 'SK';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '22222222-2222-2222-2222-222222222202', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'SUPPLIER';

        -- Add address
        INSERT INTO addresses (id, street, street_number, city, postal_code, country_id)
        SELECT '33333333-3333-3333-3333-333333333302', 'Priemyselná', '42', 'Žilina', '01001', c.id
        FROM countries c WHERE c.iso_code_2 = 'SK';

        INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302', 'headquarters', TRUE);

        -- Add tag (Preferred Supplier)
        INSERT INTO contact_tags (contact_id, tag_id)
        SELECT '22222222-2222-2222-2222-222222222202', t.id
        FROM tags t WHERE t.tag_name = 'Preferred Supplier';
    """)

    # Company 3: MedicalCare GmbH - Austrian Healthcare, PARTNER
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('22222222-2222-2222-2222-222222222203', 'CON-2512-0008', 'company');

        INSERT INTO contact_companies (contact_id, company_name, legal_form_id, registration_number, established_date, company_status)
        SELECT '22222222-2222-2222-2222-222222222203', 'MedicalCare', lf.id, 'FN123456', '2015-03-10', 'active'
        FROM legal_forms lf WHERE lf.form_code = 'AT_GMBH';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222203', 'kontakt@medicalcare.at', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '22222222-2222-2222-2222-222222222203', '+43123456789', c.id, 'fixed_line', TRUE
        FROM countries c WHERE c.iso_code_2 = 'AT';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '22222222-2222-2222-2222-222222222203', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'PARTNER';

        -- Add address
        INSERT INTO addresses (id, street, street_number, city, postal_code, country_id)
        SELECT '33333333-3333-3333-3333-333333333303', 'Mariahilfer Straße', '88', 'Wien', '1070', c.id
        FROM countries c WHERE c.iso_code_2 = 'AT';

        INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333303', 'headquarters', TRUE);

        -- Add tag (Strategic Partner)
        INSERT INTO contact_tags (contact_id, tag_id)
        SELECT '22222222-2222-2222-2222-222222222203', t.id
        FROM tags t WHERE t.tag_name = 'Strategic Partner';
    """)

    # Company 4: LogiTrans Kft. - Hungarian Transport, CUSTOMER
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('22222222-2222-2222-2222-222222222204', 'CON-2512-0009', 'company');

        INSERT INTO contact_companies (contact_id, company_name, registration_number, established_date, company_status)
        VALUES ('22222222-2222-2222-2222-222222222204', 'LogiTrans Kft.', 'Cg.01-09-123456', '2018-08-01', 'active');

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222204', 'info@logitrans.hu', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '22222222-2222-2222-2222-222222222204', '+36112345678', c.id, 'fixed_line', TRUE
        FROM countries c WHERE c.iso_code_2 = 'HU';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '22222222-2222-2222-2222-222222222204', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'CUSTOMER';

        -- Add address
        INSERT INTO addresses (id, street, street_number, city, postal_code, country_id)
        SELECT '33333333-3333-3333-3333-333333333304', 'Andrássy út', '60', 'Budapest', '1062', c.id
        FROM countries c WHERE c.iso_code_2 = 'HU';

        INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333304', 'headquarters', TRUE);

        -- Add tag (High Volume)
        INSERT INTO contact_tags (contact_id, tag_id)
        SELECT '22222222-2222-2222-2222-222222222204', t.id
        FROM tags t WHERE t.tag_name = 'High Volume';
    """)

    # Company 5: BuildPro s.r.o. - Czech Construction, VENDOR
    op.execute("""
        INSERT INTO contacts (id, contact_code, contact_type)
        VALUES ('22222222-2222-2222-2222-222222222205', 'CON-2512-0010', 'company');

        INSERT INTO contact_companies (contact_id, company_name, legal_form_id, registration_number, tax_number, established_date, company_status)
        SELECT '22222222-2222-2222-2222-222222222205', 'BuildPro', lf.id, 'CZ12345678', 'CZ12345678', '2012-04-25', 'active'
        FROM legal_forms lf WHERE lf.form_code = 'CZ_SRO';

        INSERT INTO contact_emails (contact_id, email, email_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222205', 'obchod@buildpro.cz', 'work', TRUE);

        INSERT INTO contact_phones (contact_id, phone_number, country_id, phone_type, is_primary)
        SELECT '22222222-2222-2222-2222-222222222205', '+420234567890', c.id, 'fixed_line', TRUE
        FROM countries c WHERE c.iso_code_2 = 'CZ';

        INSERT INTO contact_roles (contact_id, role_type_id, is_primary)
        SELECT '22222222-2222-2222-2222-222222222205', rt.id, TRUE
        FROM role_types rt WHERE rt.role_code = 'VENDOR';

        -- Add address
        INSERT INTO addresses (id, street, street_number, city, postal_code, country_id)
        SELECT '33333333-3333-3333-3333-333333333305', 'Václavské náměstí', '1', 'Praha', '11000', c.id
        FROM countries c WHERE c.iso_code_2 = 'CZ';

        INSERT INTO company_addresses (contact_id, address_id, address_type, is_primary)
        VALUES ('22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333305', 'headquarters', TRUE);

        -- Add tag (New Customer)
        INSERT INTO contact_tags (contact_id, tag_id)
        SELECT '22222222-2222-2222-2222-222222222205', t.id
        FROM tags t WHERE t.tag_name = 'New Customer';
    """)


def downgrade() -> None:
    """Remove all test contacts."""
    # Delete in reverse order of dependencies
    op.execute("DELETE FROM contact_tags WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM company_addresses WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM person_addresses WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM contact_roles WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM contact_phones WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM contact_emails WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM contact_companies WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM contact_persons WHERE contact_id IN (SELECT id FROM contacts WHERE contact_code LIKE 'CON-2512-%');")
    op.execute("DELETE FROM addresses WHERE id IN (SELECT id FROM addresses WHERE id::text LIKE '33333333-3333-3333-3333-%');")
    op.execute("DELETE FROM contacts WHERE contact_code LIKE 'CON-2512-%';")
