# ================================================================
# Modal & UI Component Improvements - Implementation Plan
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\temp\implementation-plan-modal-improvements.md
# Version: 1.0.0
# Created: 2025-10-19
# Updated: 2025-10-19
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive implementation plan for modal improvements, UI enhancements,
#   and component migrations based on user requirements.
# ================================================================

---

## 📋 User Requirements (Original Slovak)

1. **Toast test page** - Vytvoriť novú test stránku na toasty (kópiou template stránky)
2. **ConfirmModal namiesto alert()** - Malý modal pre potvrdenie namiesto natívneho alert
3. **Delete button** - Chýba tlačidlo "Zmazať formulár" vo footer (ako v v3)
4. **Input validation layout** - Rezervované miesto pre chybovú hlášku (aby input field neskákal)
5. **Unsaved changes protection** - Modal potvrdenie pri zatvorení s neuloženými údajmi
6. **DebugBar analytics fix** - Analytika nefunguje správne
7. **Card component migration** - Fialový border po kraji (ako v v3 DashboardCard)

---

## 🎯 Analysis Summary

### Current State Overview

**✅ ALREADY IMPLEMENTED:**
- Modal v3.6.0 with enhanced footer (left/right slots)
- Toast system (ToastProvider, useToast hook)
- BasePageTemplate for new pages
- DebugBar component with analytics
- Basic Card component

**⚠️ NEEDS FIXING:**
- Input validation causes layout shift
- DebugBar analytics may have useEffect dependency issues
- No ConfirmModal component (relies on browser alert)
- No unsaved changes protection pattern

**❌ MISSING FEATURES:**
- Card accent variant (v3 purple border style)
- useFormDirty hook
- Toast test page
- Documentation for delete button pattern

---

## 📊 Implementation Phases

### **Phase 1: Critical UX Fixes** ⏱️ 3-5 hours

#### Task 1.1: Input Validation - Reserved Error Space
**Priority:** 🔴 HIGH (prevents form jumping)
**Effort:** 1-2 hours

**Problem:**
```typescript
// CURRENT - Error message appears/disappears → layout shift
{error && <span>{error}</span>}
```

**Solution:**
```typescript
// NEW - Always reserve space for error
<div className={styles.errorContainer}> {/* min-height: 20px */}
  {error && <span>{error}</span>}
</div>
```

**Files:**
- `packages/ui-components/src/components/Input/Input.tsx`
- `packages/ui-components/src/components/Input/Input.module.css`
- `packages/ui-components/src/components/Input/Input.test.tsx`

**New API:**
```typescript
<Input
  error="Invalid email"
  reserveErrorSpace={true} // NEW - prevents jumping
/>
```

---

#### Task 1.2: DebugBar Analytics Fix
**Priority:** 🔴 HIGH (broken feature)
**Effort:** 2-3 hours

**Suspected Issue:**
```typescript
// Modal.tsx - WRONG
useEffect(() => {
  analytics.startSession();
}, [analytics]); // ❌ analytics in deps → infinite re-renders
```

**Fix:**
```typescript
// Modal.tsx - CORRECT
const analyticsRef = useRef(analytics);
useEffect(() => {
  analyticsRef.current.startSession();
}, [isOpen]); // ✅ Stable dependencies
```

**Files:**
- `packages/config/src/hooks/usePageAnalytics/usePageAnalytics.ts`
- `packages/ui-components/src/components/Modal/Modal.tsx`

**Debug Steps:**
1. Add logging to startSession()
2. Test modal open/close cycle
3. Verify click/keyboard tracking
4. Check metrics update (100ms interval)

---

### **Phase 2: New Components** ⏱️ 6-9 hours

#### Task 2.1: ConfirmModal Component
**Priority:** 🟡 MEDIUM (replaces alert)
**Effort:** 4-6 hours

**Requirements:**
- Small modal (400px width)
- Title + message
- Confirm + Cancel buttons
- Keyboard support (Enter/ESC)
- Promise-based API
- Variant support (default, danger, warning)

**API Design:**
```typescript
// Hook-based API
const { confirm, ConfirmModalComponent } = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Zmazať kontakt',
    message: 'Naozaj chcete zmazať tento kontakt?',
    confirmText: 'Zmazať',
    cancelText: 'Zrušiť',
    variant: 'danger' // Red confirm button
  });

  if (confirmed) {
    // Delete contact
  }
};

return (
  <>
    <Button onClick={handleDelete}>Zmazať</Button>
    {ConfirmModalComponent}
  </>
);
```

**Files (NEW):**
- `packages/ui-components/src/components/ConfirmModal/ConfirmModal.tsx`
- `packages/ui-components/src/components/ConfirmModal/ConfirmModal.module.css`
- `packages/ui-components/src/components/ConfirmModal/ConfirmModal.test.tsx`
- `packages/config/src/hooks/useConfirm/useConfirm.ts`
- `packages/config/src/hooks/useConfirm/useConfirm.test.ts`

**Translations (NEW):**
```typescript
// packages/config/src/translations/types.ts
modals: {
  confirm: {
    defaultTitle: string;
    defaultMessage: string;
  };
  unsavedChanges: {
    title: string;
    message: string;
  };
}
```

---

#### Task 2.2: useFormDirty Hook
**Priority:** 🟡 MEDIUM (enables unsaved protection)
**Effort:** 1-2 hours

**API:**
```typescript
const { isDirty, markDirty, markClean, reset } = useFormDirty();

<Input
  value={name}
  onChange={(e) => {
    setName(e.target.value);
    markDirty(); // Track changes
  }}
/>
```

**Files (NEW):**
- `packages/config/src/hooks/useFormDirty/useFormDirty.ts`
- `packages/config/src/hooks/useFormDirty/useFormDirty.test.ts`

---

#### Task 2.3: Unsaved Changes Protection Pattern
**Priority:** 🟡 MEDIUM (improves UX)
**Effort:** 1 hour (documentation)

**Pattern:**
```typescript
const { isDirty, markDirty } = useFormDirty();
const { confirm, ConfirmModalComponent } = useConfirm();

const handleClose = async () => {
  if (isDirty) {
    const confirmed = await confirm({
      title: t('modals.unsavedChanges.title'),
      message: t('modals.unsavedChanges.message'),
      confirmText: t('common.discard'),
      cancelText: t('common.cancel'),
      variant: 'warning'
    });

    if (!confirmed) return; // User cancelled
  }

  onClose();
};

<Modal onClose={handleClose}>
  <Input onChange={(e) => {
    setName(e.target.value);
    markDirty();
  }} />
</Modal>
```

**Documentation:**
- Add to `docs/programming/code-examples.md`

---

### **Phase 3: Component Enhancements** ⏱️ 3-5 hours

#### Task 3.1: Card Accent Variant (v3 Migration)
**Priority:** 🟢 LOW (visual enhancement)
**Effort:** 2-3 hours

**v3 Design Analysis:**
```css
/* v3 DashboardCard - KEY FEATURES */
.dashboard-card--active {
  border: 2px solid var(--card-accent-color); /* Purple border */
  box-shadow: 0 0 0 4px var(--card-accent-color), var(--shadow-lg); /* Glow */
}

.dashboard-card--active:hover {
  transform: translateY(-4px); /* Hover lift */
  box-shadow: 0 0 0 4px var(--card-accent-color), var(--shadow-xl);
}
```

**v4 Implementation:**
```typescript
// NEW API
<Card
  variant="accent"
  accentColor="var(--color-brand-primary)" // Purple
  onClick={handleClick}
>
  <h3>Dashboard Card</h3>
</Card>
```

**Files:**
- `packages/ui-components/src/components/Card/Card.tsx`
- `packages/ui-components/src/components/Card/Card.module.css`
- `packages/ui-components/src/components/Card/Card.test.tsx`

**New Styles:**
```css
.card--accent {
  border: 2px solid var(--card-accent-color, var(--color-brand-primary));
  box-shadow:
    0 0 0 4px var(--card-accent-color, var(--color-brand-primary)),
    var(--shadow-lg);
  background: var(--theme-input-background);
  transition: all var(--transition-normal);
}

.card--accent:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 4px var(--card-accent-color),
    var(--shadow-xl);
}
```

---

#### Task 3.2: Toast Test Page
**Priority:** 🟢 LOW (testing page)
**Effort:** 1-2 hours

**Steps:**
1. Copy `apps/web-ui/src/pages/_templates/BasePageTemplate/` folder
2. Rename to `ToastTestPage/`
3. Update component name
4. Add toast trigger buttons
5. Add route in app.tsx

**Features:**
- Success toast button
- Error toast button
- Warning toast button
- Info toast button
- Toast queue testing (multiple toasts)
- Toast configuration options

**Files (NEW):**
- `apps/web-ui/src/pages/ToastTestPage/ToastTestPage.tsx`
- `apps/web-ui/src/pages/ToastTestPage/ToastTestPage.module.css`
- `apps/web-ui/src/pages/ToastTestPage/index.ts`

**Files (UPDATE):**
- `apps/web-ui/src/app/app.tsx` (add route)

---

#### Task 3.3: Clear Form Button Pattern
**Priority:** 🟡 MEDIUM (different from Delete Item button)
**Effort:** 1 hour

**CLARIFICATION:**
- **Delete Item Button** ❌ = Zmazať celý záznam (kontakt, spoločnosť) - UŽ FUNGUJE
- **Clear Form Button** 🧹 = Vyčistiť formulár (vymazať vyplnené údaje) - TREBA PRIDAŤ

**Clear Form vs Delete Item:**
```typescript
// DELETE ITEM - Zmazať kontakt z databázy
<Button variant="danger" onClick={handleDeleteContact}>
  {t('contacts.delete')} // "Zmazať kontakt"
</Button>

// CLEAR FORM - Vyčistiť formulár (reset fields)
<Button variant="secondary-outline" onClick={handleClearForm}>
  {t('forms.clearForm')} // "Vyčistiť formulár"
</Button>
```

**Location:** Modal footer left slot (bude tam buď Delete ALEBO Clear, nie obe)

**Pattern:**
```typescript
// Example 1: Edit Contact Modal (has Delete button)
<Modal
  footer={{
    left: <Button variant="danger" onClick={handleDelete}>Delete Contact</Button>,
    right: <SaveCancelButtons />
  }}
/>

// Example 2: Add Contact Modal (has Clear Form button)
<Modal
  footer={{
    left: <Button variant="secondary-outline" onClick={handleClearForm}>Clear Form</Button>,
    right: <SaveCancelButtons />
  }}
/>
```

**Clear Form Implementation:**
```typescript
const handleClearForm = () => {
  setName('');
  setEmail('');
  setPhone('');
  setAddress('');
  // Reset all form fields
  markClean(); // Reset dirty state
};
```

**❌ NO Confirmation Dialog:**
Per user requirement, Clear Form does NOT ask for confirmation - it directly clears fields.

```typescript
const handleClearForm = () => {
  // Clear all fields (NO confirmation dialog)
  setName('');
  setEmail('');
  setPhone('');
  setAddress('');
  // ...
  markClean(); // Reset dirty state
};
```

**Documentation:**
- Add pattern to `docs/programming/code-examples.md`
- Add translations for clearForm button

---

#### Task 3.4: Modal Templates Migration (v3 → v4)
**Priority:** 🟡 MEDIUM (template library)
**Effort:** 8-12 hours

**v3 Modal Patterns Analyzed:**

L-KERN v3 má **5 hlavných modal patterns** ktoré treba migrova do v4 ako templates:

##### **1. EditItemModal Template** 📝
**Purpose:** Add/Edit single item (email, phone, address, role)
**v3 File:** `packages/modals/src/components/EditItemModal.tsx`

**Features:**
- ✅ Add/Edit mode (determined by presence of `item.id`)
- ✅ Modal stack management (parent/child hierarchy)
- ✅ **Clear Form button** (🧹 v footer left)
- ✅ **Delete All button** (optional, for list management)
- ✅ **Unsaved changes detection** (v1.1.0 feature)
- ✅ Save/Cancel buttons (right footer)
- ✅ Validation support (`saveDisabled` prop)
- ✅ Footer error message display

**v3 API:**
```typescript
<EditItemModal
  isOpen={isEditing}
  onClose={handleCancel}
  onSave={handleSave}
  title="Pridať email"
  modalId="edit-email"
  parentModalId="management-emails"
  accentColor="#2196F3"
  saveDisabled={!isValid}
  showClearButton={true}
  onClear={handleClearForm}
  hasUnsavedChanges={isDirty}
  footerError={validationError}
  maxWidth="600px"
>
  <ValidatedInput label="Email" value={email} onChange={setEmail} />
</EditItemModal>
```

**v4 Migration:**
- Create template: `apps/web-ui/src/pages/_templates/EditItemModalTemplate/`
- Integrate with v4 Modal component
- Add useFormDirty hook integration
- Add ConfirmModal integration (unsaved changes)

---

##### **2. ManagementModal Template** 📋
**Purpose:** Manage list of items (addresses, emails, phones, roles)
**v3 File:** `packages/modals/src/components/ManagementModal.tsx`

**Features:**
- ✅ List display with ListManager component
- ✅ **Delete All button** (with confirmation)
- ✅ **Done button** (close modal)
- ✅ No Save/Cancel (changes applied immediately)
- ✅ Modal stack registration
- ✅ Custom accent color per list type

**v3 API:**
```typescript
<ManagementModal
  isOpen={editingSection === 'addresses'}
  onClose={() => setEditingSection(null)}
  modalName="AddressManagement"
  title="📍 Správa adries"
  items={addresses}
  onDeleteAll={handleDeleteAll}
  deleteAllTitle="Zmazať všetky adresy?"
  deleteAllMessage="Táto akcia je nevratná."
  accentColor="#FF5722"
  maxWidth="700px"
>
  <AddressListEditor addresses={addresses} onChange={setAddresses} />
</ManagementModal>
```

**v4 Migration:**
- Create template: `apps/web-ui/src/pages/_templates/ManagementModalTemplate/`
- Integrate ListManager-style component
- Add Delete All confirmation with ConfirmModal

---

##### **3. SectionEditModal Template** ✏️
**Purpose:** Edit single section of data (Person info, Company info, Core fields)
**v3 File:** `packages/modals/src/components/SectionEditModal.tsx`

**Features:**
- ✅ Generic field definition system (`FieldDefinition[]`)
- ✅ Auto-generated form from field definitions
- ✅ **Clear Form button** (🧹)
- ✅ **Unsaved changes detection** (v4.5.0)
- ✅ Real-time validation (debounced API calls)
- ✅ Nested modal support (z-index 10001)
- ✅ Auto-focus on first input
- ✅ OK/Cancel buttons only

**v3 Field Definition System:**
```typescript
interface FieldDefinition {
  name: string; // 'first_name', 'email', etc.
  label: string; // 'Meno', 'Email', etc.
  type: 'text' | 'email' | 'date' | 'checkbox' | 'select' | 'country-select' | 'language-select';
  required?: boolean;
  placeholder?: string;
  validationType?: 'email' | 'phone' | 'registration_number' | 'tax_id' | 'vat_number';
  pattern?: string; // HTML5 validation
  inputMode?: string; // 'numeric', 'tel', 'email'
}

const PERSON_FIELDS: FieldDefinition[] = [
  { name: 'first_name', label: 'Meno', type: 'text', required: true },
  { name: 'last_name', label: 'Priezvisko', type: 'text', required: true },
  { name: 'birth_date', label: 'Dátum narodenia', type: 'date' },
  { name: 'nationality', label: 'Národnosť', type: 'country-select' },
];
```

**v3 API:**
```typescript
<SectionEditModal
  isOpen={editingSection === 'person'}
  onClose={handleCancel}
  onSave={handleSave}
  title="✏️ Upraviť osobné údaje"
  sectionId="person"
  fields={PERSON_FIELDS}
  formData={formData}
  onChange={setFormData}
  validationErrors={errors}
  showClearButton={true}
  onClear={handleClearForm}
  hasUnsavedChanges={isDirty}
/>
```

**v4 Migration:**
- Create template: `apps/web-ui/src/pages/_templates/SectionEditModalTemplate/`
- Implement FieldDefinition system
- Auto-generate form from field definitions
- Integrate validation system

---

##### **4. DetailModal Template** 🔍
**Purpose:** View/Edit complex entity with multiple sections (Contact detail, Order detail)
**v3 File:** `packages/modals/src/components/ModalDetailContact.tsx`

**Features:**
- ✅ Read-only section display (multiple columns)
- ✅ **Edit button per section** → Opens SectionEditModal
- ✅ **Management buttons** (emails, phones, addresses) → Opens ManagementModal
- ✅ Main footer: **Save, Cancel, Delete** buttons
- ✅ **Hard Delete checkbox** (for permanent deletion)
- ✅ **Unsaved changes tracking** (across all sections)
- ✅ Complex modal hierarchy (3 levels deep)
- ✅ Primary badges for contact methods (⭐)
- ✅ Verified indicators (✓)

**v3 Architecture:**
```
DetailModal (z-index: 10000)
├─ SectionEditModal (z-index: 10001)
│  └─ ConfirmModal (z-index: 10002)
├─ ManagementModal (z-index: 10001)
│  └─ EditItemModal (z-index: 10002)
│     └─ ConfirmModal (z-index: 10003)
```

**v3 Sections:**
- Auto-generated fields (ID, Created, Updated)
- Core fields (Type, Database, Status)
- Person/Company fields (dynamic based on type)
- Addresses (multi-value with primary)
- Emails (multi-value with primary + verified)
- Phones (multi-value with primary + verified)
- Websites (multi-value)
- Social Networks (multi-value)
- Roles (multi-value with temporal validity)
- Languages (multi-value with proficiency)

**v4 Migration:**
- Create template: `apps/web-ui/src/pages/_templates/DetailModalTemplate/`
- Implement section-based layout
- Integrate SectionEditModal + ManagementModal
- Complex modal stack management

---

##### **5. MiniConfirmModal** ✔️
**Purpose:** Small confirmation dialog (yes/no, ok/cancel)
**v3 File:** `packages/modals/src/components/MiniConfirmModal.tsx`

**Features:**
- ✅ Small modal (400px width)
- ✅ Title + message
- ✅ Confirm + Cancel buttons
- ✅ Keyboard support (Enter/ESC)
- ✅ Auto-focus on confirm button
- ✅ Used for: Delete confirmations, unsaved changes warnings

**v3 API:**
```typescript
<MiniConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDeleteConfirmed}
  title="Zmazať položku?"
  message="Táto akcia je nevratná. Položka bude natrvalo odstránená."
  confirmText="Zmazať"
  cancelText="Zrušiť"
  confirmVariant="danger" // Red button
/>
```

**v4 Migration:**
- ✅ ALREADY PLANNED as Task 2.1 (ConfirmModal component)
- Same features as v3 MiniConfirmModal
- Promise-based API (useConfirm hook)

---

**v4 Template Structure:**

```
apps/web-ui/src/pages/_templates/
├── BasePageTemplate/          (✅ Already exists)
├── EditItemModalTemplate/     (📝 NEW - Add/Edit single item)
├── ManagementModalTemplate/   (📋 NEW - Manage list of items)
├── SectionEditModalTemplate/  (✏️ NEW - Edit data section)
├── DetailModalTemplate/       (🔍 NEW - Complex detail view)
└── ToastTestPage/             (🧪 NEW - Toast testing page)
```

**Implementation Effort:**

| Template | Complexity | Effort |
|----------|-----------|--------|
| **EditItemModal** | Medium | 2-3 hours |
| **ManagementModal** | Medium | 2-3 hours |
| **SectionEditModal** | High | 3-4 hours |
| **DetailModal** | Very High | 4-6 hours |
| **Tests** | - | 3-4 hours |
| **Documentation** | - | 1-2 hours |
| **TOTAL** | - | **15-22 hours** |

**Priority Recommendation (USER CONFIRMED):**
✅ **Implement ONE BY ONE** (postupne, nie všetky naraz)

1. 🔴 **EditItemModal FIRST** - Most common pattern (emails, phones, addresses)
2. 🟡 **ManagementModal SECOND** - Required for list management
3. 🟡 **SectionEditModal THIRD** - Complex but powerful (generic forms)
4. 🟢 **DetailModal LAST** - Nice-to-have (reference implementation)

**Deliverables:**
- ✅ 4 modal templates with working examples
- ✅ Documentation for each template
- ✅ Code examples in code-examples.md
- ✅ Unit tests for each template
- ✅ Integration tests for modal hierarchy

---

### **Phase 4: Testing & Documentation** ⏱️ 6-8 hours

#### Task 4.1: Unit Tests
**Effort:** 3-4 hours

**Input.test.tsx (UPDATE):**
```typescript
describe('Input - reserveErrorSpace', () => {
  it('reserves space when prop is true', () => {
    const { container, rerender } = render(
      <Input id="test" reserveErrorSpace />
    );

    const initialHeight = container.firstChild?.clientHeight;

    // Add error - height should NOT change
    rerender(<Input id="test" reserveErrorSpace error="Error" />);

    expect(container.firstChild?.clientHeight).toBe(initialHeight);
  });
});
```

**ConfirmModal.test.tsx (NEW):**
```typescript
describe('ConfirmModal', () => {
  it('renders with title and message', () => { /* ... */ });
  it('calls onConfirm when confirm button clicked', async () => { /* ... */ });
  it('calls onClose when cancel button clicked', async () => { /* ... */ });
  it('closes on ESC key', async () => { /* ... */ });
  it('confirms on Enter key', async () => { /* ... */ });
  it('applies danger variant', () => { /* ... */ });
  it('uses translations (SK/EN)', () => { /* ... */ });
});
```

**Card.test.tsx (UPDATE):**
```typescript
describe('Card - accent variant', () => {
  it('renders accent variant with border', () => { /* ... */ });
  it('applies accentColor CSS variable', () => { /* ... */ });
  it('shows hover animation', () => { /* ... */ });
});
```

**useFormDirty.test.ts (NEW):**
```typescript
describe('useFormDirty', () => {
  it('starts with isDirty = false', () => { /* ... */ });
  it('markDirty sets isDirty to true', () => { /* ... */ });
  it('markClean sets isDirty to false', () => { /* ... */ });
  it('reset resets state', () => { /* ... */ });
});
```

---

#### Task 4.2: Integration Tests
**Effort:** 2-3 hours

**Modal + ConfirmModal (Unsaved Changes):**
```typescript
describe('Modal - Unsaved Changes Protection', () => {
  it('shows confirm dialog when closing dirty form', async () => {
    render(<ContactModal />);

    // Type into input (makes form dirty)
    await userEvent.type(screen.getByLabelText('Name'), 'John');

    // Try to close
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Confirm dialog appears
    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
  });

  it('does not close when user cancels', async () => { /* ... */ });
  it('closes when user confirms discard', async () => { /* ... */ });
});
```

**Modal + DebugBar (Analytics):**
```typescript
describe('Modal - DebugBar Analytics', () => {
  it('starts session when modal opens', () => { /* ... */ });
  it('tracks click events', () => { /* ... */ });
  it('tracks keyboard events', () => { /* ... */ });
  it('updates metrics in real-time', () => { /* ... */ });
  it('ends session when modal closes', () => { /* ... */ });
});
```

---

#### Task 4.3: Documentation Updates
**Effort:** 1-2 hours

**docs/programming/code-examples.md (UPDATE):**
- Add ConfirmModal usage examples
- Add unsaved changes protection pattern
- Add Modal footer delete button pattern
- Add Card accent variant examples

**docs/programming/coding-standards.md (UPDATE):**
- Update Input validation pattern (recommend `reserveErrorSpace`)
- Document form dirty tracking pattern

**packages/ui-components/README.md (UPDATE):**
- Add ConfirmModal to component list
- Update Card API docs (accent variant)

---

## 📝 Total Effort Estimate

| Phase | Description | Effort |
|-------|-------------|--------|
| **Phase 1** | Critical UX Fixes (Input + DebugBar) | 3-5 hours |
| **Phase 2** | New Components (ConfirmModal + useFormDirty) | 6-9 hours |
| **Phase 3** | Enhancements (Card + Toast + Clear Form + **Modal Templates**) | 12-20 hours |
| **Phase 4** | Testing & Documentation | 8-12 hours |
| **TOTAL (Without Templates)** | Core Implementation | **18-27 hours** |
| **TOTAL (With Templates)** | Full Implementation + Templates | **29-46 hours** |

**Realistic Timeline:**
- **Without Modal Templates:** 3-4 working days (18-27 hours)
- **With Modal Templates:** 5-7 working days (29-46 hours)

**Recommendation:** Split into 2 milestones:
- **Milestone 1:** Phase 1-2 (Core fixes + ConfirmModal) - 9-14 hours
- **Milestone 2:** Phase 3-4 (Templates + Testing) - 20-32 hours

---

## 🚀 Execution Order (Recommended)

### **Day 1: Critical Fixes** ⏱️ 4-7 hours
1. ✅ Input reserved error space (1-2h)
2. ✅ DebugBar analytics fix (2-3h)
3. ✅ Write tests for above (1-2h)

---

### **Day 2: New Components** ⏱️ 6-9 hours
1. ✅ ConfirmModal component (4-6h)
2. ✅ Add translations SK/EN (30min)
3. ✅ Write ConfirmModal tests (2-3h)

---

### **Day 3: Enhancements** ⏱️ 6-10 hours
1. ✅ Card accent variant (2-3h)
2. ✅ useFormDirty hook (1-2h)
3. ✅ Toast test page (1-2h)
4. ✅ Write tests for above (2-3h)

---

### **Day 4: Documentation & Polish** ⏱️ 5-7 hours
1. ✅ Update code-examples.md (1h)
2. ✅ Update coding-standards.md (1h)
3. ✅ Integration tests (2-3h)
4. ✅ Review all changes (1h)
5. ✅ Create git commit (30min)

---

## 📋 Success Criteria

### **Functionality:**
- ✅ Input validation does NOT cause layout shift
- ✅ DebugBar analytics tracks clicks/keyboard correctly
- ✅ ConfirmModal replaces all alert() calls
- ✅ Modal supports delete button in footer (already works, just documented)
- ✅ Unsaved changes protection works
- ✅ Card accent variant matches v3 design (purple border + glow)

### **Testing:**
- ✅ All unit tests pass (90%+ coverage)
- ✅ All integration tests pass
- ✅ No flaky tests
- ✅ Manual visual review of Card accent variant

### **Documentation:**
- ✅ Code examples updated
- ✅ Coding standards updated
- ✅ All new components documented
- ✅ v3 → v4 migration patterns documented

### **Code Quality:**
- ✅ 100% DRY compliance (no hardcoded values)
- ✅ All text uses translations
- ✅ All colors use theme variables
- ✅ TypeScript strict mode passes
- ✅ ESLint warnings resolved

---

## 🎯 Priority Recommendations

### **START IMMEDIATELY (Critical UX):**
1. 🔴 **Input reserved error space** - Prevents annoying form jumping
2. 🔴 **DebugBar analytics fix** - Currently broken

### **HIGH PRIORITY (User-facing):**
3. 🟡 **ConfirmModal component** - Replaces alert() (user dislikes it)
4. 🟡 **useFormDirty + Unsaved protection** - Prevents data loss

### **MEDIUM PRIORITY (Enhancements):**
5. 🟢 **Card accent variant** - Visual enhancement (v3 parity)
6. 🟢 **Toast test page** - Testing convenience

### **LOW PRIORITY (Documentation):**
7. 🟢 **Delete button pattern** - Already works, just document

---

## ✅ User Decisions (CONFIRMED)

**Before implementation, user confirmed:**

1. ✅ **Modal Templates Priority** - Implement ONE BY ONE (postupne)
2. ✅ **Milestone Split** - OK (M1: Core fixes, M2: Templates)
3. ✅ **Start After Review** - Review plan first, then implement
4. ✅ **Clear Form Confirmation** - NO confirmation dialog (direct clear)
5. ✅ **Delete Item Confirmation** - YES confirmation dialog (always)
6. ✅ **Unsaved Changes Confirmation** - YES confirmation on modal close

**Still need confirmation:**
- ❓ **Card accent color?** - Use `var(--color-brand-primary)` (purple) as default?
- ❓ **Input reserveErrorSpace default?** - `false` (backward compatible) or `true` (better UX)?
- ❓ **ConfirmModal API?** - Promise-based `useConfirm()` hook OK?

---

## 🔧 Technical Notes

### **Input Reserved Error Space - Implementation Detail**

**Backward Compatibility Strategy:**
- Default `reserveErrorSpace={false}` → NO breaking changes
- New forms use `reserveErrorSpace={true}` → Better UX
- Gradually migrate old forms as needed

**CSS Implementation:**
```css
.errorContainer {
  min-height: 20px; /* Reserve space */
  display: flex;
  align-items: flex-start;
  margin-top: var(--spacing-xs);
}
```

---

### **DebugBar Analytics - Suspected Issues**

**Issue 1: useEffect Dependencies**
```typescript
// WRONG - analytics in deps causes re-renders
useEffect(() => {
  analytics.startSession();
}, [isOpen, analytics]); // ❌

// CORRECT - use ref
const analyticsRef = useRef(analytics);
useEffect(() => {
  analyticsRef.current.startSession();
}, [isOpen]); // ✅
```

**Issue 2: Session Cleanup**
```typescript
// WRONG - may access stale session
return () => {
  if (analytics.session) { // ❌ Stale check
    analytics.endSession('dismissed');
  }
};

// CORRECT - always call endSession
return () => {
  analyticsRef.current.endSession('dismissed'); // ✅
};
```

---

### **ConfirmModal - Promise API Pattern**

**Why Promise-based?**
- ✅ Async/await syntax (clean code)
- ✅ No callback hell
- ✅ TypeScript-friendly
- ✅ Easy to test

**Example:**
```typescript
const confirmed = await confirm({
  title: 'Zmazať?',
  message: 'Naozaj chcete zmazať?'
});

if (confirmed) {
  // User clicked confirm
} else {
  // User clicked cancel or pressed ESC
}
```

---

### **Card Accent Variant - CSS Variable Strategy**

**Why CSS Variable?**
- ✅ Theming support (dark/light mode)
- ✅ Customizable per instance
- ✅ No hardcoded colors (DRY compliance)

**Usage:**
```typescript
// Default accent color (purple)
<Card variant="accent">...</Card>

// Custom accent color (red)
<Card variant="accent" accentColor="var(--color-status-error)">
  ...
</Card>

// Custom hex color (fallback)
<Card variant="accent" accentColor="#ff5722">
  ...
</Card>
```

---

## 📚 Reference Files

### **v3 Components Analyzed:**
- `lkern_codebase_v3_act/packages/modals/src/components/MiniConfirmModal.tsx`
- `lkern_codebase_v3_act/packages/page-templates/src/components/DashboardCard/DashboardCard.tsx`
- `lkern_codebase_v3_act/packages/page-templates/src/components/DashboardCard/DashboardCard.css`

### **v4 Components to Modify:**
- `packages/ui-components/src/components/Input/Input.tsx`
- `packages/ui-components/src/components/Card/Card.tsx`
- `packages/ui-components/src/components/Modal/Modal.tsx`
- `packages/config/src/hooks/usePageAnalytics/usePageAnalytics.ts`

### **v4 Components to Create:**
- `packages/ui-components/src/components/ConfirmModal/` (new)
- `packages/config/src/hooks/useConfirm/` (new)
- `packages/config/src/hooks/useFormDirty/` (new)
- `apps/web-ui/src/pages/ToastTestPage/` (new)

---

## ✅ Next Step

**Awaiting user approval to start Phase 1:**

1. ✅ Read implementation plan
2. ✅ Answer questions
3. ✅ Approve priorities
4. 🚀 **START Phase 1: Input + DebugBar fixes**

---

**End of Implementation Plan**
**Total Pages:** 1
**Total Sections:** 10
**Estimated Total Effort:** 18-27 hours (3-4 days)
