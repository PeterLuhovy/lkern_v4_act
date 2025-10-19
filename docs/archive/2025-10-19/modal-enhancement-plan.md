# ================================================================
# Modal Enhancement Plan - v3 Features for v4
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\temp\modal-enhancement-plan.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Implementation plan for enhancing v4 Modal component with
#   proven features from v3 ModalBaseTemplate.
# ================================================================

---

## 📋 Executive Summary

**Goal:** Enhance v4 Modal component with battle-tested features from v3, while maintaining simplicity and avoiding v3's complexity issues.

**Current Status:**
- ✅ v4 Modal exists (centered variant only)
- ✅ useModal hook implemented
- ✅ useModalWizard hook implemented
- ✅ ModalContext implemented (z-index management)
- ✅ WizardProgress + WizardNavigation components

**Planned Enhancements:**
- ⏳ Drag & Drop functionality
- ⏳ Enhanced keyboard handling (ESC/Enter with textarea exceptions)
- ⏳ Nested modals support
- ⏳ Footer layout improvements (delete button, error messages)
- ⏳ Alignment options (top/center/bottom)
- ⏳ Padding override for custom layouts

---

## 🎯 Features to Implement

### **1. Drag & Drop Modal** ⭐

**Why:** Allows users to reposition modals for better workflow when referencing content behind the modal.

**Implementation:**
- Mouse down on header starts drag
- Track position offset
- Update modal position via transform/translate
- Reset position on modal open
- Cursor changes (grab → grabbing)
- User-select disabled during drag

**v3 Code Reference:**
```typescript
// State
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

// Handlers
handleMouseDown() // Start drag (only from header)
handleMouseMove() // Update position
handleMouseUp()   // End drag

// CSS
cursor: isDragging ? 'grabbing' : 'auto'
position: 'fixed'
left/top: calculated from position state
```

**API Addition:**
```typescript
interface ModalProps {
  // ... existing props
  draggable?: boolean; // Default: true
}
```

**Tests:**
- Drag starts from header
- Drag does NOT start from close button
- Position updates during drag
- Position resets on modal open
- Cursor changes during drag

---

### **2. Enhanced Keyboard Handling** ⭐

**Why:** Improves UX with smart keyboard shortcuts that respect context (e.g., Enter in textarea should add newline, not submit).

**Implementation:**

**ESC Key:**
- Closes topmost modal only (not all modals)
- Prevents same ESC event from closing multiple modals
- Global flag with timestamp check

**Enter Key:**
- Submit from INPUT/SELECT → trigger confirm
- Enter in TEXTAREA → newline (do NOT submit)
- Enter outside form elements → trigger confirm
- Requires: not submitting, not disabled, onConfirm exists

**v3 Code Reference:**
```typescript
// Escape handling with deduplication
let escapeEventConsumed = false;
let escapeEventTimestamp = 0;

if (e.key === 'Escape') {
  const currentTimestamp = e.timeStamp;
  if (escapeEventConsumed && currentTimestamp - escapeEventTimestamp < 10) {
    return; // Ignore duplicate event
  }
  escapeEventConsumed = true;
  escapeEventTimestamp = currentTimestamp;
  setTimeout(() => { escapeEventConsumed = false; }, 0);
  handleClose();
}

// Enter handling with textarea exception
if (e.key === 'Enter') {
  const isTextarea = target.tagName === 'TEXTAREA';
  const isInput = target.tagName === 'INPUT';
  const isSelect = target.tagName === 'SELECT';

  const shouldSubmit = (isInput || isSelect || (!isTextarea && !isInput && !isSelect));

  if (shouldSubmit && !isSubmitting && !confirmDisabled && onConfirm) {
    handleConfirm();
  }
}
```

**Tests:**
- ESC closes topmost modal only
- ESC does not close parent modal when child closes
- Enter in INPUT submits
- Enter in SELECT submits
- Enter in TEXTAREA does NOT submit (adds newline)
- Enter outside form elements submits

---

### **3. Nested Modals Support** ⭐

**Why:** Some workflows require opening a modal from within another modal (e.g., "Edit Contact" → "Select Category" picker).

**Implementation:**
- Use existing ModalContext for z-index calculation
- Each modal gets unique ID
- Z-index = baseZIndex + (stackPosition * 10)
- Only topmost modal handles ESC/Enter
- Only topmost modal tracks events (if analytics added later)

**v3 Code Reference:**
```typescript
// Z-index prop
zIndexOverride?: number;

// Z-index application
zIndex: zIndexOverride || 2500

// Topmost detection
const topmostModalId = modalStack.getTopmostModalId();
const isTopmost = topmostModalId === modalName;

if (!isTopmost) return; // Ignore keyboard events
```

**API Addition:**
```typescript
interface ModalProps {
  // ... existing props
  id?: string;  // Unique ID for modal registry
  zIndexOverride?: number; // Manual z-index (default: from ModalContext)
}
```

**Tests:**
- Second modal appears above first modal
- ESC closes only top modal
- Parent modal remains open when child closes
- Z-index increments correctly
- ModalContext tracks open modals

---

### **4. Footer Layout Enhancements** ⭐

**Why:** Common pattern: delete button on left, cancel/confirm on right. Also display validation errors in footer.

**Implementation:**
- Footer flex layout: space-between
- Left side: optional delete button + error message
- Right side: cancel + confirm buttons

**v3 Code Reference:**
```typescript
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--spacing-md)'
}}>
  {/* Left side */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
    {showDeleteAllButton && (
      <Button variant="danger" onClick={onDeleteAll}>
        🗑️ {deleteAllText}
      </Button>
    )}
    {footerError && (
      <div style={{ fontSize: '12px', color: '#d32f2f' }}>
        ❌ {footerError}
      </div>
    )}
  </div>

  {/* Right side */}
  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
    <Button variant="secondary" onClick={onClose}>
      {cancelText}
    </Button>
    <Button variant="primary" onClick={onConfirm}>
      {confirmText}
    </Button>
  </div>
</div>
```

**API Addition:**
```typescript
interface ModalProps {
  // ... existing props
  showDeleteButton?: boolean;
  deleteButtonText?: string;
  deleteButtonVariant?: 'danger' | 'danger-subtle';
  onDelete?: () => void;
  footerError?: string; // Error message displayed in footer
}
```

**Tests:**
- Delete button renders on left
- Footer error renders on left
- Cancel/Confirm buttons render on right
- Delete button calls onDelete
- Footer layout maintains alignment

---

### **5. Alignment Override** ⭐

**Why:** Some modals need top/bottom alignment instead of center (e.g., notifications, dropdowns).

**Implementation:**
- Overlay uses flexbox with configurable alignItems
- Default: center
- Options: flex-start (top), center, flex-end (bottom)

**v3 Code Reference:**
```typescript
alignmentOverride?: 'flex-start' | 'center' | 'flex-end';

<div style={{
  ...
  alignItems: alignmentOverride || 'center'
}}>
```

**API Addition:**
```typescript
interface ModalProps {
  // ... existing props
  alignment?: 'top' | 'center' | 'bottom'; // Default: 'center'
}
```

**Tests:**
- Top alignment positions modal at top
- Center alignment positions modal at center
- Bottom alignment positions modal at bottom

---

### **6. Padding Override** ⭐

**Why:** Nested modals may need less padding to avoid excessive whitespace.

**Implementation:**
- Overlay padding configurable via prop
- Default: var(--spacing-xl)
- Allows custom values for nested modals

**v3 Code Reference:**
```typescript
paddingOverride?: string;

<div style={{
  ...
  padding: paddingOverride || 'var(--spacing-xl)'
}}>
```

**API Addition:**
```typescript
interface ModalProps {
  // ... existing props
  overlayPadding?: string; // Default: 'var(--spacing-xl)'
}
```

---

## 🚫 Features NOT Implementing

### **Analytics Tracking**
- **Why NOT:** Too complex for base component
- **Alternative:** Separate wrapper component or higher-order component
- **Future:** Analytics wrapper component in Phase 4

### **Debug Header**
- **Why NOT:** Development-only feature
- **Alternative:** DebugBar component (already in roadmap Phase 4)
- **Future:** Global debug panel, not per-modal

### **Built-in Notification**
- **Why NOT:** Modal shouldn't handle notifications
- **Alternative:** Separate toast/notification system
- **Future:** Global notification manager

### **Custom ModalButton**
- **Why NOT:** We have production Button component
- **Alternative:** Use existing Button from @l-kern/ui-components

---

## 📐 Final Modal API (v3.0.0)

```typescript
interface ModalProps {
  // === Core ===
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;

  // === Identity ===
  id?: string; // For nested modals tracking

  // === Content ===
  title?: string;
  subtitle?: string;
  children: React.ReactNode;

  // === Appearance ===
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'top' | 'center' | 'bottom';
  overlayPadding?: string;
  className?: string;

  // === Footer ===
  footer?: React.ReactNode; // Custom footer (overrides defaults)
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: React.ReactNode;
  confirmDisabled?: boolean;
  showDeleteButton?: boolean;
  deleteButtonText?: string;
  deleteButtonVariant?: 'danger' | 'danger-subtle';
  onDelete?: () => void;
  footerError?: string;

  // === Behavior ===
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  draggable?: boolean;

  // === State ===
  loading?: boolean;
  isSubmitting?: boolean;

  // === Advanced ===
  zIndexOverride?: number; // For nested modals
}
```

---

## 📝 Implementation Checklist

### **Phase 1: Core Enhancements**
- [ ] Add drag & drop functionality
  - [ ] State management (position, dragging, offset)
  - [ ] Mouse event handlers
  - [ ] CSS updates (cursor, position)
  - [ ] Reset on modal open
  - [ ] Tests (8 tests)

- [ ] Enhanced keyboard handling
  - [ ] ESC key with deduplication
  - [ ] Enter key with textarea exception
  - [ ] Topmost modal detection
  - [ ] Tests (6 tests)

- [ ] Nested modals support
  - [ ] ID prop for tracking
  - [ ] ModalContext integration
  - [ ] Z-index calculation
  - [ ] Topmost detection
  - [ ] Tests (5 tests)

### **Phase 2: UI Enhancements**
- [ ] Footer layout improvements
  - [ ] Delete button (left side)
  - [ ] Footer error message (left side)
  - [ ] Cancel/Confirm layout (right side)
  - [ ] Flexbox spacing
  - [ ] Tests (5 tests)

- [ ] Alignment options
  - [ ] Top alignment
  - [ ] Bottom alignment
  - [ ] Center alignment (default)
  - [ ] Tests (3 tests)

- [ ] Padding override
  - [ ] overlayPadding prop
  - [ ] Default value
  - [ ] Tests (2 tests)

### **Phase 3: Documentation & Testing**
- [ ] Update Modal.tsx implementation
- [ ] Update Modal.module.css
- [ ] Update Modal.test.tsx (add ~29 new tests)
- [ ] Update ui-components documentation
- [ ] Update components-reference documentation
- [ ] Create demo page with all features
- [ ] Test in Docker container

---

## 🎯 Success Criteria

1. **Functionality:**
   - ✅ Modal can be dragged by header
   - ✅ ESC closes only topmost modal
   - ✅ Enter submits (except in textarea)
   - ✅ Nested modals work correctly
   - ✅ Footer layout matches v3 patterns
   - ✅ Alignment options work

2. **Testing:**
   - ✅ 100% test coverage maintained
   - ✅ ~55 total tests (26 existing + 29 new)
   - ✅ All tests passing

3. **Documentation:**
   - ✅ API fully documented
   - ✅ Examples provided
   - ✅ Migration guide from v3

4. **Compatibility:**
   - ✅ Works with useModal hook
   - ✅ Works with useModalWizard hook
   - ✅ Works with ModalContext
   - ✅ Backward compatible (all features optional)

---

## 📊 Estimated Effort

- **Phase 1:** ~4 hours (drag & drop, keyboard, nested modals)
- **Phase 2:** ~2 hours (footer, alignment, padding)
- **Phase 3:** ~2 hours (docs, tests, demo)
- **Total:** ~8 hours

---

## 🔗 Related Files

**Source Files:**
- `packages/ui-components/src/components/Modal/Modal.tsx`
- `packages/ui-components/src/components/Modal/Modal.module.css`
- `packages/ui-components/src/components/Modal/Modal.test.tsx`
- `packages/config/src/contexts/ModalContext.tsx`

**Reference:**
- `lkern_codebase_v3_act/packages/modals/src/components/ModalBaseTemplate.tsx` (v3 implementation)

**Documentation:**
- `docs/packages/ui-components.md` ✅ UPDATED
- `docs/packages/components-reference.md` (to be updated)
- `docs/project/roadmap.md` (update completion status)

---

**Last Updated:** 2025-10-18
**Status:** READY FOR IMPLEMENTATION
**Approved By:** User (awaiting final approval)
