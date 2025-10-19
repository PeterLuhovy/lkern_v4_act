# Contacts Service - Database Architecture Design (DRAFT v1)

**Version**: 1.0.0 DRAFT
**Created**: 2025-10-15
**Status**: 🚧 IN REVIEW - Pracovná verzia
**Database**: lkms101_contacts
**Pattern**: **Pure Party Model**

---

## 📋 Overview

Contacts service implementuje **Pure Party Model** architektúru - univerzálny dátový model pre správu osôb, firiem a ich vzťahov. Tento dokument definuje kompletnú databázovú štruktúru pred implementáciou.

**Key Principles:**
- ✅ **Party Model** - Jednotná tabuľka `contacts` pre osoby aj firmy
- ✅ **Child Tables** - Detaily v `contact_persons` a `contact_companies`
- ✅ **M:N Relationships** - Flexibilné prepojenia (adresy, jazyky, tagy)
- ✅ **Temporal Validity** - Časová platnosť rolí (valid_from, valid_to)
- ✅ **Soft Delete** - `deleted_at` timestamp (nie `is_active` flag)
- ✅ **UUID Primary Keys** - Globálne jedinečné identifikátory
- ✅ **Normalized Storage** - Adresy, tagy, obrázky ako samostatné entity

---

## 🏗️ Database Schema Overview

### **Core Entity:**
```
contacts (parent table)
├── contact_persons (PERSON details)
├── contact_companies (COMPANY details)
├── contact_emails (M:N emails)
├── contact_phones (M:N phones)
├── contact_addresses (M:N addresses via junction)
├── contact_websites (M:N websites)
├── contact_social_networks (M:N social profiles)
├── contact_languages (M:N languages)
├── contact_roles (M:N roles with temporal validity)
├── contact_tags (M:N tags)
├── contact_images (M:N images)
└── contact_preferences (1:1 preferences)
```

### **Supporting Tables:**
```
addresses (normalized address storage)
role_types (reference data)
languages (reference data)
nationalities (reference data)
countries (reference data)
titles (reference data for academic/professional titles)
person_titles (M:N junction for multiple titles per person)
```

---

[... FULL CONTENT FROM PREVIOUS RESPONSE ...]

---

**Last Updated**: 2025-10-15
**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 (BOSS)
