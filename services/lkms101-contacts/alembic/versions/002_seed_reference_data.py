"""
================================================================
FILE: 002_seed_reference_data.py
PATH: /services/lkms101-contacts/alembic/versions/002_seed_reference_data.py
DESCRIPTION: Seed reference data for Contact MDM service
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Revision ID: 002_seed_reference_data
Revises: 001_initial_schema
Create Date: 2025-12-18

Seeds:
- role_types (11 roles)
- organizational_unit_types (3 types)
- legal_forms (SK, CZ, DE, AT, US - 15+ forms)
- countries (Central European focus - 15+ countries)
- languages (sk, cs, en, de, hu, pl - 6 languages)
- nationalities (linked to countries)
- business_focus_areas (11 categories)
- tags (5 common tags)
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_seed_reference_data'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Seed all reference tables."""

    # ============================================================
    # ROLE TYPES (L347-372)
    # ============================================================
    op.execute("""
        INSERT INTO role_types (role_code, role_name_sk, role_name_en, category, description) VALUES
        -- purchasing category
        ('SUPPLIER', 'Dodávateľ', 'Supplier', 'purchasing', 'Company or person supplying goods or materials'),
        ('VENDOR', 'Predajca', 'Vendor', 'purchasing', 'Company selling products to us'),
        ('SERVICE_PROVIDER', 'Poskytovateľ služieb', 'Service Provider', 'purchasing', 'Company providing services'),

        -- sales category
        ('CUSTOMER', 'Zákazník', 'Customer', 'sales', 'Company or person buying our products'),
        ('CLIENT', 'Klient', 'Client', 'sales', 'Company using our services'),
        ('PROSPECT', 'Potenciálny zákazník', 'Prospect', 'sales', 'Potential future customer'),

        -- hr category
        ('EMPLOYEE', 'Zamestnanec', 'Employee', 'hr', 'Person employed by company'),
        ('CONTRACTOR', 'Externý pracovník', 'Contractor', 'hr', 'External contractor working for company'),

        -- organizational category
        ('DEPARTMENT', 'Oddelenie', 'Department', 'organizational', 'Organizational unit within company'),
        ('TEAM', 'Tím', 'Team', 'organizational', 'Team within department'),

        -- partnership category
        ('PARTNER', 'Partner', 'Partner', 'partnership', 'Business partner for collaboration');
    """)

    # ============================================================
    # ORGANIZATIONAL UNIT TYPES (L734-742)
    # ============================================================
    op.execute("""
        INSERT INTO organizational_unit_types (type_code, type_name_sk, type_name_en, hierarchy_level, description) VALUES
        ('DIVISION', 'Divízia', 'Division', 1, 'Top-level organizational unit'),
        ('DEPARTMENT', 'Oddelenie', 'Department', 2, 'Mid-level organizational unit'),
        ('TEAM', 'Tím', 'Team', 3, 'Lowest-level organizational unit');
    """)

    # ============================================================
    # COUNTRIES (L867-875)
    # Central European focus + major trading partners
    # ============================================================
    op.execute("""
        INSERT INTO countries (iso_code_2, iso_code_3, country_name_sk, country_name_en, phone_code, timezone, is_eu_member) VALUES
        -- Central Europe (EU)
        ('SK', 'SVK', 'Slovensko', 'Slovakia', '+421', 'Europe/Bratislava', TRUE),
        ('CZ', 'CZE', 'Česká republika', 'Czech Republic', '+420', 'Europe/Prague', TRUE),
        ('PL', 'POL', 'Poľsko', 'Poland', '+48', 'Europe/Warsaw', TRUE),
        ('HU', 'HUN', 'Maďarsko', 'Hungary', '+36', 'Europe/Budapest', TRUE),
        ('AT', 'AUT', 'Rakúsko', 'Austria', '+43', 'Europe/Vienna', TRUE),
        ('DE', 'DEU', 'Nemecko', 'Germany', '+49', 'Europe/Berlin', TRUE),
        ('SI', 'SVN', 'Slovinsko', 'Slovenia', '+386', 'Europe/Ljubljana', TRUE),
        ('HR', 'HRV', 'Chorvátsko', 'Croatia', '+385', 'Europe/Zagreb', TRUE),

        -- Western Europe (EU)
        ('FR', 'FRA', 'Francúzsko', 'France', '+33', 'Europe/Paris', TRUE),
        ('IT', 'ITA', 'Taliansko', 'Italy', '+39', 'Europe/Rome', TRUE),
        ('ES', 'ESP', 'Španielsko', 'Spain', '+34', 'Europe/Madrid', TRUE),
        ('NL', 'NLD', 'Holandsko', 'Netherlands', '+31', 'Europe/Amsterdam', TRUE),
        ('BE', 'BEL', 'Belgicko', 'Belgium', '+32', 'Europe/Brussels', TRUE),

        -- Non-EU Europe
        ('CH', 'CHE', 'Švajčiarsko', 'Switzerland', '+41', 'Europe/Zurich', FALSE),
        ('GB', 'GBR', 'Veľká Británia', 'United Kingdom', '+44', 'Europe/London', FALSE),
        ('UA', 'UKR', 'Ukrajina', 'Ukraine', '+380', 'Europe/Kyiv', FALSE),

        -- Major trading partners
        ('US', 'USA', 'Spojené štáty', 'United States', '+1', 'America/New_York', FALSE),
        ('CN', 'CHN', 'Čína', 'China', '+86', 'Asia/Shanghai', FALSE);
    """)

    # ============================================================
    # LANGUAGES (L908-916)
    # ============================================================
    op.execute("""
        INSERT INTO languages (iso_code_2, iso_code_3, language_name_sk, language_name_en, language_name_native) VALUES
        ('sk', 'slk', 'Slovenčina', 'Slovak', 'Slovenčina'),
        ('cs', 'ces', 'Čeština', 'Czech', 'Čeština'),
        ('en', 'eng', 'Angličtina', 'English', 'English'),
        ('de', 'deu', 'Nemčina', 'German', 'Deutsch'),
        ('hu', 'hun', 'Maďarčina', 'Hungarian', 'Magyar'),
        ('pl', 'pol', 'Poľština', 'Polish', 'Polski'),
        ('fr', 'fra', 'Francúzština', 'French', 'Français'),
        ('it', 'ita', 'Taliančina', 'Italian', 'Italiano'),
        ('es', 'spa', 'Španielčina', 'Spanish', 'Español'),
        ('uk', 'ukr', 'Ukrajinčina', 'Ukrainian', 'Українська'),
        ('zh', 'zho', 'Čínština', 'Chinese', '中文');
    """)

    # ============================================================
    # NATIONALITIES (L948-954)
    # Linked to countries
    # ============================================================
    op.execute("""
        INSERT INTO nationalities (country_id, nationality_name_sk, nationality_name_en)
        SELECT c.id, n.name_sk, n.name_en
        FROM countries c
        JOIN (VALUES
            ('SK', 'Slovenská', 'Slovak'),
            ('CZ', 'Česká', 'Czech'),
            ('PL', 'Poľská', 'Polish'),
            ('HU', 'Maďarská', 'Hungarian'),
            ('AT', 'Rakúska', 'Austrian'),
            ('DE', 'Nemecká', 'German'),
            ('SI', 'Slovinská', 'Slovenian'),
            ('HR', 'Chorvátska', 'Croatian'),
            ('FR', 'Francúzska', 'French'),
            ('IT', 'Talianska', 'Italian'),
            ('ES', 'Španielska', 'Spanish'),
            ('NL', 'Holandská', 'Dutch'),
            ('BE', 'Belgická', 'Belgian'),
            ('CH', 'Švajčiarska', 'Swiss'),
            ('GB', 'Britská', 'British'),
            ('UA', 'Ukrajinská', 'Ukrainian'),
            ('US', 'Americká', 'American'),
            ('CN', 'Čínska', 'Chinese')
        ) AS n(iso_code, name_sk, name_en) ON c.iso_code_2 = n.iso_code;
    """)

    # ============================================================
    # LEGAL FORMS (L797-820)
    # Slovakia, Czech Republic, Germany, Austria, US
    # ============================================================
    op.execute("""
        INSERT INTO legal_forms (form_code, form_name_sk, form_name_en, form_abbreviation, country_code, description) VALUES
        -- Slovakia
        ('SK_SRO', 'Spoločnosť s ručením obmedzeným', 'Limited Liability Company', 's.r.o.', 'SK', 'Most common Slovak company type'),
        ('SK_AS', 'Akciová spoločnosť', 'Joint Stock Company', 'a.s.', 'SK', 'Stock company'),
        ('SK_KS', 'Komanditná spoločnosť', 'Limited Partnership', 'k.s.', 'SK', 'Partnership with limited/unlimited partners'),
        ('SK_VOS', 'Verejná obchodná spoločnosť', 'General Partnership', 'v.o.s.', 'SK', 'General partnership'),
        ('SK_ZO', 'Živnostník', 'Sole Proprietor', 'živnosť', 'SK', 'Self-employed individual'),
        ('SK_SDRUZENIE', 'Združenie', 'Association', 'o.z.', 'SK', 'Civic association'),

        -- Czech Republic
        ('CZ_SRO', 'Společnost s ručením omezeným', 'Limited Liability Company', 's.r.o.', 'CZ', 'Most common Czech company type'),
        ('CZ_AS', 'Akciová společnost', 'Joint Stock Company', 'a.s.', 'CZ', 'Stock company'),
        ('CZ_OSVC', 'Osoba samostatně výdělečně činná', 'Sole Proprietor', 'OSVČ', 'CZ', 'Self-employed individual'),

        -- Germany
        ('DE_GMBH', 'Gesellschaft mit beschränkter Haftung', 'Limited Liability Company', 'GmbH', 'DE', 'Most common German company type'),
        ('DE_AG', 'Aktiengesellschaft', 'Stock Corporation', 'AG', 'DE', 'German stock corporation'),
        ('DE_KG', 'Kommanditgesellschaft', 'Limited Partnership', 'KG', 'DE', 'German limited partnership'),
        ('DE_UG', 'Unternehmergesellschaft', 'Mini GmbH', 'UG', 'DE', 'Entrepreneurial company with limited liability'),

        -- Austria
        ('AT_GMBH', 'Gesellschaft mit beschränkter Haftung', 'Limited Liability Company', 'GmbH', 'AT', 'Austrian LLC'),
        ('AT_AG', 'Aktiengesellschaft', 'Stock Corporation', 'AG', 'AT', 'Austrian stock corporation'),
        ('AT_KG', 'Kommanditgesellschaft', 'Limited Partnership', 'KG', 'AT', 'Austrian limited partnership'),

        -- United States
        ('US_LLC', 'Limited Liability Company', 'Limited Liability Company', 'LLC', 'US', 'American LLC'),
        ('US_INC', 'Corporation', 'Corporation', 'Inc.', 'US', 'American corporation'),
        ('US_LP', 'Limited Partnership', 'Limited Partnership', 'LP', 'US', 'American limited partnership'),

        -- United Kingdom
        ('GB_LTD', 'Private Limited Company', 'Private Limited Company', 'Ltd', 'GB', 'British private company'),
        ('GB_PLC', 'Public Limited Company', 'Public Limited Company', 'PLC', 'GB', 'British public company'),

        -- France
        ('FR_SARL', 'Société à responsabilité limitée', 'Limited Liability Company', 'SARL', 'FR', 'French LLC'),
        ('FR_SA', 'Société anonyme', 'Joint Stock Company', 'SA', 'FR', 'French stock company');
    """)

    # ============================================================
    # BUSINESS FOCUS AREAS (L1005-1028)
    # ============================================================
    op.execute("""
        INSERT INTO business_focus_areas (area_code, area_name_sk, area_name_en, category, description) VALUES
        -- it
        ('IT_SOFTWARE', 'Vývoj softvéru', 'Software Development', 'it', 'Custom software development and consulting'),
        ('IT_CONSULTING', 'IT poradenstvo', 'IT Consulting', 'it', 'Information technology consulting services'),
        ('IT_CLOUD', 'Cloudové služby', 'Cloud Services', 'it', 'Cloud computing and hosting services'),
        ('IT_SECURITY', 'IT bezpečnosť', 'IT Security', 'it', 'Cybersecurity and data protection'),

        -- manufacturing
        ('MFG_AUTOMOTIVE', 'Automobilový priemysel', 'Automotive Industry', 'manufacturing', 'Car and vehicle parts manufacturing'),
        ('MFG_MACHINERY', 'Strojárstvo', 'Machinery', 'manufacturing', 'Industrial machinery manufacturing'),
        ('MFG_ELECTRONICS', 'Elektronika', 'Electronics', 'manufacturing', 'Electronic components manufacturing'),
        ('MFG_FOOD', 'Potravinárstvo', 'Food Industry', 'manufacturing', 'Food processing and production'),

        -- services
        ('SVC_LOGISTICS', 'Logistika', 'Logistics', 'services', 'Transport and logistics services'),
        ('SVC_FINANCE', 'Finančné služby', 'Financial Services', 'finance', 'Banking, insurance, investment'),
        ('SVC_LEGAL', 'Právne služby', 'Legal Services', 'services', 'Law firms and legal consulting'),
        ('SVC_MARKETING', 'Marketing', 'Marketing', 'services', 'Marketing and advertising services'),
        ('SVC_HR', 'HR služby', 'HR Services', 'services', 'Human resources and recruitment'),

        -- trade
        ('TRD_WHOLESALE', 'Veľkoobchod', 'Wholesale', 'trade', 'Wholesale distribution'),
        ('TRD_RETAIL', 'Maloobchod', 'Retail', 'trade', 'Retail sales'),
        ('TRD_ECOMMERCE', 'E-commerce', 'E-commerce', 'trade', 'Online retail and marketplaces'),

        -- construction
        ('CON_BUILDING', 'Stavebníctvo', 'Construction', 'construction', 'Building construction'),
        ('CON_ARCHITECTURE', 'Architektúra', 'Architecture', 'construction', 'Architectural design'),

        -- healthcare
        ('HC_PHARMA', 'Farmácia', 'Pharmaceuticals', 'healthcare', 'Pharmaceutical industry'),
        ('HC_MEDICAL', 'Zdravotníctvo', 'Healthcare', 'healthcare', 'Medical services and equipment'),

        -- education
        ('EDU_TRAINING', 'Vzdelávanie', 'Education & Training', 'education', 'Training and educational services'),

        -- agriculture
        ('AGR_FARMING', 'Poľnohospodárstvo', 'Agriculture', 'agriculture', 'Agricultural production'),

        -- transport
        ('TRP_TRANSPORT', 'Doprava', 'Transport', 'transport', 'Transportation services');
    """)

    # ============================================================
    # TAGS (L1736-1743)
    # ============================================================
    op.execute("""
        INSERT INTO tags (tag_name, tag_color, description) VALUES
        ('VIP', '#FFD700', 'High-priority customer requiring special attention'),
        ('Problematic', '#FF5733', 'Customer with payment or communication issues'),
        ('Strategic Partner', '#2196F3', 'Long-term strategic business relationship'),
        ('New Customer', '#4CAF50', 'Recently acquired customer (< 6 months)'),
        ('High Volume', '#9C27B0', 'High transaction volume supplier/customer'),
        ('Preferred Supplier', '#00BCD4', 'Preferred supplier with best terms'),
        ('Key Account', '#FF9800', 'Key account requiring dedicated management'),
        ('Inactive', '#9E9E9E', 'Contact with no recent activity');
    """)


def downgrade() -> None:
    """Remove all seeded data."""
    op.execute("DELETE FROM tags;")
    op.execute("DELETE FROM business_focus_areas;")
    op.execute("DELETE FROM legal_forms;")
    op.execute("DELETE FROM nationalities;")
    op.execute("DELETE FROM languages;")
    op.execute("DELETE FROM countries;")
    op.execute("DELETE FROM organizational_unit_types;")
    op.execute("DELETE FROM role_types;")
