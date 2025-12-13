/*
 * ================================================================
 * FILE: EntityEditModalTestPage.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/EntityEditModalTestPage/EntityEditModalTestPage.tsx
 * DESCRIPTION: Test page for EntityEditModal component
 * VERSION: v1.0.0
 * CREATED: 2025-12-09
 * UPDATED: 2025-12-09
 * ================================================================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@l-kern/config';
import {
  BasePage,
  Card,
  Button,
  EntityEditModal,
  EntityEditConfig,
  EntitySection,
  SelectOption,
} from '@l-kern/ui-components';
import styles from './EntityEditModalTestPage.module.css';

// ================================================================
// EXAMPLE ENTITY: Contact
// ================================================================

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  type: 'customer' | 'supplier' | 'partner' | 'employee';
  status: 'active' | 'inactive' | 'blocked';
  notes: string;
  created_at: string;
  updated_at: string;
}

// Mock contact data
const MOCK_CONTACT: Contact = {
  id: '12345678-1234-4123-8123-123456789012',
  first_name: 'Ján',
  last_name: 'Novák',
  email: 'jan.novak@example.com',
  phone: '+421 900 123 456',
  company: 'ACME s.r.o.',
  position: 'Senior Developer',
  type: 'customer',
  status: 'active',
  notes: 'VIP zákazník od roku 2020. Preferuje komunikáciu cez email.',
  created_at: '2024-01-15T10:30:00.000Z',
  updated_at: '2024-12-05T14:22:00.000Z',
};

// ================================================================
// CONTACT EDIT CONFIGURATION
// ================================================================

// Type options
const contactTypeOptions: SelectOption[] = [
  { value: 'customer', label: 'Zákazník' },
  { value: 'supplier', label: 'Dodávateľ' },
  { value: 'partner', label: 'Partner' },
  { value: 'employee', label: 'Zamestnanec' },
];

// Status options
const contactStatusOptions: SelectOption[] = [
  { value: 'active', label: 'Aktívny' },
  { value: 'inactive', label: 'Neaktívny' },
  { value: 'blocked', label: 'Blokovaný' },
];

// Sections
const contactSections: EntitySection[] = [
  // Basic Info Section
  {
    id: 'basic',
    titleKey: 'test.entityEdit.contact.sections.basic',
    useGrid: true,
    fields: [
      {
        name: 'first_name',
        type: 'text',
        labelKey: 'test.entityEdit.contact.fields.firstName',
        placeholderKey: 'test.entityEdit.contact.placeholders.firstName',
        required: true,
        width: 'half',
        minLength: 2,
        maxLength: 50,
        validate: (value) => {
          if (typeof value !== 'string' || value.length < 2) {
            return 'test.entityEdit.validation.minLength2';
          }
          return undefined;
        },
      },
      {
        name: 'last_name',
        type: 'text',
        labelKey: 'test.entityEdit.contact.fields.lastName',
        placeholderKey: 'test.entityEdit.contact.placeholders.lastName',
        required: true,
        width: 'half',
        minLength: 2,
        maxLength: 50,
      },
      {
        name: 'email',
        type: 'email',
        labelKey: 'test.entityEdit.contact.fields.email',
        placeholderKey: 'test.entityEdit.contact.placeholders.email',
        required: true,
        width: 'full',
      },
      {
        name: 'phone',
        type: 'text',
        labelKey: 'test.entityEdit.contact.fields.phone',
        placeholderKey: 'test.entityEdit.contact.placeholders.phone',
        width: 'half',
      },
    ],
  },
  // Company Section
  {
    id: 'company',
    titleKey: 'test.entityEdit.contact.sections.company',
    useGrid: true,
    fields: [
      {
        name: 'company',
        type: 'text',
        labelKey: 'test.entityEdit.contact.fields.company',
        placeholderKey: 'test.entityEdit.contact.placeholders.company',
        width: 'half',
      },
      {
        name: 'position',
        type: 'text',
        labelKey: 'test.entityEdit.contact.fields.position',
        placeholderKey: 'test.entityEdit.contact.placeholders.position',
        width: 'half',
      },
      {
        name: 'type',
        type: 'select',
        labelKey: 'test.entityEdit.contact.fields.type',
        options: contactTypeOptions,
        width: 'half',
        required: true,
      },
      {
        name: 'status',
        type: 'select',
        labelKey: 'test.entityEdit.contact.fields.status',
        options: contactStatusOptions,
        width: 'half',
        required: true,
        hintKey: 'test.entityEdit.contact.hints.statusHint',
        hintMaxWidth: 300,
      },
    ],
  },
  // Notes Section
  {
    id: 'notes',
    titleKey: 'test.entityEdit.contact.sections.notes',
    useGrid: false,
    fields: [
      {
        name: 'notes',
        type: 'textarea',
        labelKey: 'test.entityEdit.contact.fields.notes',
        placeholderKey: 'test.entityEdit.contact.placeholders.notes',
        width: 'full',
        rows: 5,
        maxLength: 1000,
      },
    ],
  },
  // Timestamps Section (read-only demo)
  {
    id: 'timestamps',
    titleKey: 'test.entityEdit.contact.sections.timestamps',
    useGrid: true,
    fields: [
      {
        name: 'id',
        type: 'text',
        labelKey: 'test.entityEdit.contact.fields.id',
        width: 'full',
        disabled: true, // Always readonly
        blur: false,
      },
      {
        name: 'created_at',
        type: 'datetime-local',
        labelKey: 'test.entityEdit.contact.fields.createdAt',
        width: 'half',
        permissionField: 'created_at',
      },
      {
        name: 'updated_at',
        type: 'datetime-local',
        labelKey: 'test.entityEdit.contact.fields.updatedAt',
        width: 'half',
        permissionField: 'updated_at',
      },
    ],
  },
];

// Permission configuration
const contactPermissions = {
  canEdit: (fieldName: string, permissionLevel: number): boolean => {
    // ID is never editable
    if (fieldName === 'id') return false;

    // Level 60+: Can edit everything except ID
    if (permissionLevel >= 60) return true;

    // Level 30-59: Can edit basic fields
    if (permissionLevel >= 30) {
      return ['first_name', 'last_name', 'email', 'phone', 'company', 'position', 'notes'].includes(fieldName);
    }

    // Level 0-29: Can only edit notes
    return fieldName === 'notes';
  },
  canView: (fieldName: string, permissionLevel: number): boolean => {
    // Level 0-29: ID is blurred
    if (permissionLevel < 30 && fieldName === 'id') return false;
    return true;
  },
  getEditReasonKey: (fieldName: string, permissionLevel: number): string | undefined => {
    if (fieldName === 'id') {
      return 'test.entityEdit.permission.immutableField';
    }
    if (permissionLevel < 30 && !['notes'].includes(fieldName)) {
      return 'test.entityEdit.permission.noAccess';
    }
    if (permissionLevel < 60 && ['type', 'status', 'created_at', 'updated_at'].includes(fieldName)) {
      return 'test.entityEdit.permission.adminOnly';
    }
    return undefined;
  },
};

// Complete config
const contactEditConfig: EntityEditConfig<Contact> = {
  entityName: 'contact',
  sections: contactSections,
  permissions: contactPermissions,
};

// ================================================================
// TEST PAGE COMPONENT
// ================================================================

export function EntityEditModalTestPage() {
  const { t } = useTranslation();

  // Permission level state (for testing)
  const [permissionLevel, setPermissionLevel] = useState(60);

  // Modal states
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Contact data (would come from API in real app)
  const [contact, setContact] = useState<Contact>(MOCK_CONTACT);

  // Handle save
  const handleSave = async (changes: Partial<Contact>): Promise<boolean> => {
    console.log('[EntityEditModalTestPage] Save called with changes:', changes);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update local state
    setContact((prev) => ({
      ...prev,
      ...changes,
      updated_at: new Date().toISOString(),
    }));

    return true;
  };

  // Open modal for section
  const openSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Close modal
  const closeModal = () => {
    setActiveSection(null);
  };

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/testing" className={styles.backLink}>
            ← {t('components.testing.backToDashboard')}
          </Link>
          <h1 className={styles.title}>EntityEditModal Test</h1>
          <p className={styles.subtitle}>
            Universal entity edit modal with configuration-driven fields
          </p>
        </div>

        {/* Permission Level Switcher */}
        <Card variant="outlined" className={styles.controlCard}>
          <h2 className={styles.cardTitle}>Permission Level</h2>
          <div className={styles.buttonRow}>
            <Button
              variant={permissionLevel < 30 ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setPermissionLevel(20)}
            >
              Basic (20)
            </Button>
            <Button
              variant={permissionLevel >= 30 && permissionLevel < 60 ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setPermissionLevel(45)}
            >
              Standard (45)
            </Button>
            <Button
              variant={permissionLevel >= 60 ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setPermissionLevel(80)}
            >
              Admin (80)
            </Button>
          </div>
          <p className={styles.hint}>
            Current: <strong>{permissionLevel}</strong> - {permissionLevel < 30 ? 'Basic (notes only)' : permissionLevel < 60 ? 'Standard (basic fields)' : 'Admin (all fields)'}
          </p>
        </Card>

        {/* Section Cards */}
        <div className={styles.sectionGrid}>
          {contactSections.map((section) => (
            <Card key={section.id} variant="outlined" className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>{t(section.titleKey)}</h3>
              <p className={styles.sectionDescription}>
                {section.fields.length} fields • {section.useGrid ? 'Grid layout' : 'Stack layout'}
              </p>

              {/* Preview current values */}
              <div className={styles.previewList}>
                {section.fields.slice(0, 3).map((field) => (
                  <div key={field.name} className={styles.previewItem}>
                    <span className={styles.previewLabel}>{t(field.labelKey)}:</span>
                    <span className={styles.previewValue}>
                      {String(contact[field.name as keyof Contact] ?? '—')}
                    </span>
                  </div>
                ))}
                {section.fields.length > 3 && (
                  <div className={styles.previewMore}>
                    +{section.fields.length - 3} more fields...
                  </div>
                )}
              </div>

              <Button
                variant="secondary"
                size="small"
                onClick={() => openSection(section.id)}
              >
                <span role="img" aria-label="Edit">✏️</span> Edit Section
              </Button>
            </Card>
          ))}
        </div>

        {/* Current Contact Data Display */}
        <Card variant="outlined" className={styles.dataCard}>
          <h2 className={styles.cardTitle}>Current Contact Data</h2>
          <pre className={styles.codeBlock}>
            {JSON.stringify(contact, null, 2)}
          </pre>
        </Card>

        {/* EntityEditModal */}
        {activeSection && (
          <EntityEditModal
            isOpen={Boolean(activeSection)}
            onClose={closeModal}
            onSave={handleSave}
            entity={contact}
            sectionId={activeSection}
            config={contactEditConfig}
            permissionLevel={permissionLevel}
            parentModalId="entity-edit-test"
            size="md"
          />
        )}
      </div>
    </BasePage>
  );
}

export default EntityEditModalTestPage;
