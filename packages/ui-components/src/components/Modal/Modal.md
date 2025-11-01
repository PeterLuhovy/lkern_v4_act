# ================================================================
# Modal
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\Modal\Modal.md
# Version: 3.9.0
# Created: 2025-10-20
# Updated: 2025-11-01
# Source: packages/ui-components/src/components/Modal/Modal.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Production modal component with advanced features including drag & drop,
#   nested modals, dirty tracking, enhanced footer layout, alignment options,
#   dynamic debug bar height measurement, and keyboard shortcuts.
# ================================================================

---

## Overview

**Purpose**: Enterprise-grade modal dialog for L-KERN v4 with drag-and-drop, nested modals, dirty tracking, and advanced keyboard handling
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Modal
**Since**: v1.0.0 (Current: v3.9.0)

The Modal component is L-KERN's most advanced UI component, providing a powerful dialog system with drag-and-drop repositioning, nested modal support via modalStack, enhanced footer layout with separate left/right action slots, vertical alignment options (top/center/bottom), keyboard shortcuts (ESC/Enter), focus trap, body scroll lock, and full accessibility support. Designed for complex enterprise workflows requiring sophisticated modal interactions.

---

## Features

- ✅ **Portal Rendering**: Renders outside DOM hierarchy using React Portal
- ✅ **Drag & Drop**: Draggable by header with smooth repositioning
- ✅ **Nested Modals**: Full modalStack integration with auto z-index management
- ✅ **Dirty Tracking**: Unsaved changes detection with confirmation dialog (`hasUnsavedChanges` prop)
- ✅ **Enhanced Footer**: Separate left (delete) and right (cancel/confirm) slots + error message display
- ✅ **3 Sizes**: sm (480px), md (720px), lg (1000px)
- ✅ **Alignment Options**: Top, center, bottom vertical positioning
- ✅ **Keyboard Shortcuts**: ESC to close, Enter to confirm/submit (hybrid handling)
- ✅ **Focus Trap**: Locks keyboard navigation within modal
- ✅ **Body Scroll Lock**: Prevents background scrolling when modal open
- ✅ **Loading State**: Shows spinner overlay during async operations
- ✅ **Backdrop Click**: Optional close on backdrop click
- ✅ **Accessibility**: WCAG AA compliant, screen reader friendly
- ✅ **Analytics Integration**: usePageAnalytics for modal tracking
- ✅ **Debug Bar**: Built-in analytics debug bar with dynamic height measurement
- ✅ **Responsive Debug Bar**: Automatically adjusts header padding based on debug bar height (single or multi-line)
- ✅ **Dark Mode**: Full dark theme support
- ✅ **Memory Safe**: Fixed 2 memory leaks in v3.7.0 (drag listeners + keyboard churn)

---

## Quick Start

### Basic Usage

```tsx
import { Modal } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function MyPage() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {t('common.openModal')}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalId="my-modal"
        title={t('modal.title')}
        size="md"
      >
        <p>{t('modal.content')}</p>
      </Modal>
    </>
  );
}
```

### Common Patterns

#### Pattern 1: Save Modal with Loading State

```tsx
import { Modal, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function SaveModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={handleSave}
      modalId="save-modal"
      title={t('contacts.save')}
      loading={loading}
      footer={{
        right: (
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSave} loading={loading}>
              {t('common.save')}
            </Button>
          </>
        ),
      }}
    >
      <ContactForm />
    </Modal>
  );
}
```

#### Pattern 2: Nested Modal (Edit inside List)

```tsx
import { Modal } from '@l-kern/ui-components';
import { useState } from 'react';

function ContactsPage() {
  const [listOpen, setListOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      {/* Parent Modal: List */}
      <Modal
        isOpen={listOpen}
        onClose={() => setListOpen(false)}
        modalId="contact-list"
        title="Contacts"
        size="lg"
      >
        <ContactList onEdit={() => setEditOpen(true)} />

        {/* Child Modal: Edit */}
        <Modal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          modalId="contact-edit"
          parentModalId="contact-list"
          title="Edit Contact"
          size="md"
        >
          <EditForm />
        </Modal>
      </Modal>
    </>
  );
}
```

#### Pattern 3: Delete Modal with Enhanced Footer

```tsx
import { Modal, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function DeleteModal({ contact, isOpen, onClose, onDelete }) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalId="delete-contact"
      title={t('contacts.deleteConfirmTitle')}
      size="sm"
      footer={{
        left: (
          <Button variant="danger" onClick={onDelete}>
            {t('common.delete')}
          </Button>
        ),
        right: (
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
        ),
      }}
    >
      <p>{t('contacts.deleteConfirmMessage', { name: contact.name })}</p>
    </Modal>
  );
}
```

---

## Props API

### ModalProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isOpen` | `boolean` | - | **Yes** | Whether modal is currently open |
| `onClose` | `() => void` | - | **Yes** | Callback when modal should close (ESC key, backdrop click, X button) |
| `modalId` | `string` | - | **Yes** | Unique modal identifier for modalStack and keyboard handling |
| `onConfirm` | `() => void` | `undefined` | No | Callback when modal confirms/submits (Enter key triggers this) |
| `parentModalId` | `string` | `undefined` | No | Parent modal ID for nested modals (enables proper z-index stacking) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Modal width preset |
| `title` | `string` | `undefined` | No | Modal title text (displayed in header) |
| `children` | `ReactNode` | - | **Yes** | Modal body content |
| `footer` | `ReactNode \| ModalFooterConfig` | `undefined` | No | Footer content (simple ReactNode or enhanced config object) |
| `closeOnBackdropClick` | `boolean` | `false` | No | Allow closing modal by clicking backdrop overlay |
| `showCloseButton` | `boolean` | `true` | No | Show X close button in header |
| `loading` | `boolean` | `false` | No | Show loading spinner overlay (hides children) |
| `disableDrag` | `boolean` | `false` | No | Disable drag-and-drop repositioning |
| `alignment` | `'top' \| 'center' \| 'bottom'` | `'center'` | No | Vertical alignment of modal in viewport |
| `overlayPadding` | `string` | `'64px'` | No | Overlay padding (useful for nested modals) |
| `zIndexOverride` | `number` | `undefined` | No | Manual z-index override (auto-calculated from modalStack if not provided) |
| `className` | `string` | `''` | No | Additional CSS classes for modal container |
| `showDebugBar` | `boolean` | `true` | No | Show analytics debug bar at top of modal |
| `pageName` | `string` | `modalId` | No | Modal name for analytics (English name, e.g., 'contactEdit') |
| `isFormValid` | `boolean` | `true` | No | Form validation state (when false, submit button disabled) |

### Type Definitions

```typescript
// Modal size options
type ModalSize = 'sm' | 'md' | 'lg';

// Vertical alignment options
type ModalAlignment = 'top' | 'center' | 'bottom';

// Enhanced footer configuration
interface ModalFooterConfig {
  left?: React.ReactNode;       // Left slot (typically delete button)
  right?: React.ReactNode;      // Right slot (typically cancel + confirm buttons)
  errorMessage?: string;        // Error message below footer actions
}

// Main Modal props interface
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  modalId: string;
  parentModalId?: string;
  size?: ModalSize;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode | ModalFooterConfig;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  loading?: boolean;
  disableDrag?: boolean;
  alignment?: ModalAlignment;
  overlayPadding?: string;
  zIndexOverride?: number;
  className?: string;
  showDebugBar?: boolean;
  pageName?: string;
  isFormValid?: boolean;
}
```

---

## Visual Design

### Sizes

**sm (Small)** - Confirmation dialogs, simple forms
- Width: `480px` (CSS variable: `--modal-width-sm`)
- Max-width: `90vw`
- Height: Auto (max 90vh)
- Use: Delete confirmations, simple alerts, short forms

**md (Medium)** - Default size for most modals
- Width: `720px` (CSS variable: `--modal-width-md`)
- Max-width: `90vw`
- Height: Auto (max 90vh)
- Use: Standard forms, edit dialogs, settings

**lg (Large)** - Complex forms, data tables
- Width: `1000px` (CSS variable: `--modal-width-lg`)
- Max-width: `90vw`
- Height: Auto (max 90vh)
- Use: List modals, multi-step wizards, complex forms

### Alignment

**center** (Default) - Standard centered modal
- Position: Center of viewport
- Flexbox: `align-items: center`
- Use: Most modals, standard dialogs

**top** - Top-aligned modal
- Position: Top of viewport
- Flexbox: `align-items: flex-start`
- Padding: `overlayPadding` applied (default 64px)
- Use: Notifications, alerts, wizard steps

**bottom** - Bottom-aligned modal
- Position: Bottom of viewport
- Flexbox: `align-items: flex-end`
- Use: Mobile slide-up modals, action sheets

### Visual Elements

**Overlay Backdrop**
- Background: `rgba(0, 0, 0, 0.5)` (light mode)
- Background: `rgba(0, 0, 0, 0.7)` (dark mode)
- Animation: 200ms fade-in
- z-index: Auto-calculated from modalStack

**Modal Container**
- Background: `--theme-modal-background` (light: #f5f5f5, dark: #424242)
- Border-radius: `8px`
- Box-shadow: `0 10px 40px rgba(0, 0, 0, 0.2)`
- Animation: 200ms scale-in (from 0.9 to 1.0)

**Header**
- Padding: `20px 24px`
- Border-bottom: `1px solid --theme-border`
- Title font: 20px, weight 600
- Close button: 32px × 32px, hover gray background

**Body**
- Padding: `24px`
- Overflow: `auto` (vertical scroll if content exceeds max-height)
- Flex: `1` (takes remaining space)

**Footer**
- Padding: `16px 24px`
- Border-top: `1px solid --theme-border`
- Simple layout: `justify-content: flex-end`
- Enhanced layout: `justify-content: space-between` (left/right slots)

---

## Behavior

### Interaction States

**Open** - Modal visible
- Overlay: Visible with fade-in animation
- Container: Visible with scale-in animation
- Body scroll: Locked (`overflow: hidden`)
- Focus: Trapped within modal
- z-index: Auto-calculated from modalStack

**Closed** - Modal hidden
- Overlay: Removed from DOM
- Container: Removed from DOM
- Body scroll: Restored
- Focus: Restored to previous element

**Loading** - Async operation in progress
- Body content: Hidden
- Spinner: Visible with "Loading..." text
- Footer buttons: Typically disabled
- Keyboard: ESC/Enter still functional

**Dragging** - User dragging modal
- Cursor: `grabbing` (from `grab`)
- Position: Absolute positioning (fixed left/top)
- User-select: `none` (prevents text selection)
- Animation: Disabled during drag

### Keyboard Navigation

| Key | Action | Condition |
|-----|--------|-----------|
| `ESC` | Close modal OR blur input | Topmost modal only |
| `Enter` | Confirm (onConfirm) OR close modal OR blur input | Topmost modal only |
| `Tab` | Focus next element | Focus trap within modal |
| `Shift+Tab` | Focus previous element | Focus trap within modal |

**Keyboard Behavior Details:**

**ESC Key:**
- Input field focused → Blur input (remove focus)
- No input focused → Close modal (call `onClose`)
- Only topmost modal handles ESC (nested modals ignored)

**Enter Key:**
- Input field focused → Blur input (remove focus)
- No input focused + `onConfirm` provided → Call `onConfirm` (submit)
- No input focused + NO `onConfirm` → Close modal (same as ESC)
- Only topmost modal handles Enter (nested modals ignored)

**Implementation Note:** Modal uses **hybrid keyboard handling** (v3.2.0+). Modal handles ESC/Enter locally (not delegated to BasePage), giving modal full control over its keyboard behavior. Uses bubble phase listeners (not capture phase) for proper nested modal event order.

### Drag and Drop

**Drag Initiation:**
- Grab area: Modal header (title + empty space)
- Excluded: Close button (X), buttons in header
- Mouse down: Records offset from mouse to modal corner
- Cursor: Changes from `grab` to `grabbing`

**During Drag:**
- Position: Switches from flexbox centering to absolute positioning
- Movement: Modal follows mouse cursor with recorded offset
- Boundaries: No constraints (can drag anywhere on screen)
- Text selection: Disabled (`user-select: none`)

**Drag End:**
- Mouse up: Cursor returns to `grab`
- Position: Retained (modal stays where dropped)
- Reopen: Modal resets to centered position

**Disable Drag:**
- Set `disableDrag={true}`
- Cursor: `default` instead of `grab`
- Header mouse events: Ignored

### Nested Modals

**modalStack Integration:**
1. Modal opens → Registers in `modalStack.push(modalId, parentModalId, onClose, onConfirm)`
2. modalStack calculates z-index: Base 1000 + (depth × 10)
3. Topmost modal gets keyboard focus
4. ESC/Enter only work on topmost modal
5. Modal closes → Unregisters via `modalStack.pop(modalId)`

**z-index Calculation:**
- Root modal: 1000 (no parent)
- Child modal (1 level): 1010 (parentModalId set)
- Grandchild modal (2 levels): 1020
- Override: Use `zIndexOverride` prop to manually set z-index

**Keyboard Behavior:**
- Only topmost modal handles ESC/Enter
- Parent modal listeners still active but check `modalStack.getTopmostModalId()` before executing
- Child modal events bubble up but parent ignores them

---

## Accessibility

### WCAG Compliance

- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard navigable (Tab, Shift+Tab, ESC, Enter)
- ✅ Screen reader support (role="dialog", aria-modal, aria-labelledby)
- ✅ Focus trap (Tab cycles through modal elements only)
- ✅ Focus restoration (returns to previous element on close)
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Close button accessible (aria-label, title with shortcut hint)

### ARIA Attributes

```tsx
<div
  className="modalOverlay"
  data-modal-overlay="true"
  data-modal-id={modalId}
>
  <div
    ref={modalRef}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : undefined}
    tabIndex={-1}
    data-modal-container-id={modalId}
  >
    {title && <h2 id="modal-title">{title}</h2>}
    <button
      aria-label={t('common.close')}
      title={`${t('common.close')} (ESC)`}
      onClick={onClose}
    >
      ×
    </button>
    {children}
  </div>
</div>
```

### Screen Reader Behavior

- **Modal opens**: "Dialog, [title]" (e.g., "Dialog, Edit Contact")
- **Close button**: "Close button, close (ESC)"
- **Focus**: Automatically moves to modal on open
- **Tab navigation**: Cycles through modal elements only (focus trapped)
- **ESC key**: "Dialog closed" (focus returns to trigger element)

### Focus Management

**On Open:**
1. Store reference to previously focused element
2. Focus modal container (`modalRef.current.focus()`)
3. Lock body scroll (`document.body.style.overflow = 'hidden'`)

**On Close:**
1. Restore focus to previously focused element
2. Unlock body scroll (`document.body.style.overflow = ''`)
3. Unregister from modalStack

**Focus Trap:**
- Tab/Shift+Tab cycle through modal elements only
- Cannot focus elements behind modal overlay
- Implemented via `tabIndex={-1}` on modal container

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Width: `95vw` (all sizes)
- Max-height: `95vh`
- Padding: `16px 20px` (header), `20px` (body)
- Title font: `18px` (reduced from 20px)
- Recommendation: Use `alignment="bottom"` for mobile slide-up effect

**Tablet** (768px - 1023px)
- Standard sizing applies
- Use appropriate size based on content (sm/md/lg)

**Desktop** (≥ 1024px)
- Standard sizing applies
- Recommended: `size="md"` for most modals
- Use `size="lg"` for complex forms/tables

### Layout Behavior

```tsx
// Mobile: Bottom-aligned slide-up modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  modalId="mobile-modal"
  size="sm"
  alignment="bottom"
>
  <MobileContent />
</Modal>

// Desktop: Centered modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  modalId="desktop-modal"
  size="md"
  alignment="center"
>
  <DesktopContent />
</Modal>
```

---

## Styling

### CSS Variables Used

```css
/* Background */
--theme-modal-background (light: #f5f5f5, dark: #424242)
--color-background-alt (fallback)

/* Text */
--theme-text (#212121, dark: #e0e0e0)
--theme-text-muted (#9e9e9e, dark: #757575)

/* Borders */
--theme-border (#e0e0e0, dark: #333333)

/* Spacing */
--spacing-xs (4px)
--spacing-sm (8px)
--spacing-md (16px)
--spacing-lg (24px)
--spacing-xl (32px)
--spacing-xxl (40px)
--spacing-xhuge (200px)

/* Modal Widths */
--modal-width-sm (480px)
--modal-width-md (720px)
--modal-width-lg (1000px)

/* Colors */
--color-brand-primary (#9c27b0) - focus outline
--color-status-error (#f44336) - error message
--color-status-error-light (#ffebee) - error background
--color-status-error-dark (#c62828) - error text
```

### Custom Styling

**Via className prop:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  modalId="custom-modal"
  className="my-custom-modal"
>
  <Content />
</Modal>
```

```css
.my-custom-modal {
  /* Override modal container styles */
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

**Via CSS Modules:**
```css
.myModal {
  composes: modalContainer from '@l-kern/ui-components/Modal.module.css';
  /* Additional custom styles */
  max-width: 95vw;
}
```

---

## Known Issues

### Active Issues

**No known critical issues** ✅

All 128 tests passing, component stable in production.

**Minor Enhancements Planned:**
- **Enhancement #1**: Add `variant` prop for drawer/fullscreen modals
  - **Severity**: Low (enhancement, not bug)
  - **Status**: Planned for v4.0.0
  - **CSS classes exist**: `.modal--drawer`, `.modal--fullscreen` already in CSS
  - **Workaround**: Use custom `className` with these classes

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage

- ✅ **Unit Tests**: 128 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: 8 tests (ARIA, focus trap, keyboard navigation)
- ✅ **Drag & Drop Tests**: 10 tests (drag initiation, movement, cursor states)
- ✅ **Nested Modal Tests**: 6 tests (modalStack integration, z-index)
- ✅ **Footer Tests**: 8 tests (simple footer, enhanced footer with left/right/error)
- ✅ **Keyboard Tests**: 12 tests (ESC/Enter behavior with input fields)

### Test File

`packages/ui-components/src/components/Modal/Modal.test.tsx`

### Running Tests

```bash
# Run Modal tests only
docker exec lkms201-web-ui npx nx test ui-components --testFile=Modal.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=Modal.test.tsx

# Watch mode (local development)
npx nx test ui-components --watch --testFile=Modal.test.tsx
```

### Key Test Cases

**Basic Rendering (5 tests):**
- ✅ Renders nothing when closed
- ✅ Renders modal when open
- ✅ Renders title when provided
- ✅ Renders simple footer (ReactNode)
- ✅ Applies custom className

**Sizes (4 tests):**
- ✅ Applies medium size by default
- ✅ Applies small size when specified
- ✅ Applies large size when specified
- ✅ Max-width constraint on mobile

**Close Button (3 tests):**
- ✅ Shows close button by default
- ✅ Hides close button when showCloseButton=false
- ✅ Calls onClose when close button clicked

**Backdrop Click (3 tests):**
- ✅ Does NOT close on backdrop click by default
- ✅ Closes on backdrop click when closeOnBackdropClick=true
- ✅ Does NOT close when clicking inside modal content

**Loading State (2 tests):**
- ✅ Shows spinner when loading
- ✅ Hides content when loading

**Accessibility (8 tests):**
- ✅ Has role="dialog"
- ✅ Has aria-modal="true"
- ✅ Has aria-labelledby when title provided
- ✅ Focus trap works (Tab cycles through modal only)
- ✅ Focus restored to previous element on close
- ✅ Close button has aria-label
- ✅ Body scroll locked when open
- ✅ Body scroll restored when closed

**Modal Stack (6 tests):**
- ✅ Registers in modalStack when opened
- ✅ Unregisters from modalStack when closed
- ✅ Registers nested modal with parentModalId
- ✅ Applies higher z-index for nested modal
- ✅ Respects zIndexOverride when provided
- ✅ Only topmost modal handles keyboard events

**Enhanced Footer (8 tests):**
- ✅ Renders enhanced footer with left slot
- ✅ Renders enhanced footer with right slot
- ✅ Renders enhanced footer with error message
- ✅ Renders complete enhanced footer (left + right + error)
- ✅ Renders simple footer when not ModalFooterConfig
- ✅ Error message styled with red background
- ✅ Left/right slots positioned correctly
- ✅ Footer hidden when footer prop not provided

**Alignment Options (4 tests):**
- ✅ Applies center alignment by default
- ✅ Applies top alignment when specified
- ✅ Applies bottom alignment when specified
- ✅ Overlay padding applies correctly

**Drag and Drop (10 tests):**
- ✅ Has draggable cursor on header by default
- ✅ Has default cursor when disableDrag=true
- ✅ Changes cursor to grabbing during drag
- ✅ Does NOT start drag from close button
- ✅ Modal centered on initial open
- ✅ Updates position during drag
- ✅ Ends drag on mouse up
- ✅ Resets position when modal reopens
- ✅ Drag listeners cleaned up on unmount (memory leak fix)
- ✅ User-select disabled during drag

**Keyboard Shortcuts (12 tests):**
- ✅ ESC closes modal when no input focused
- ✅ ESC blurs input when input focused
- ✅ Enter calls onConfirm when no input focused
- ✅ Enter closes modal when no onConfirm and no input focused
- ✅ Enter blurs input when input focused
- ✅ Only topmost modal handles ESC
- ✅ Only topmost modal handles Enter
- ✅ Keyboard listener cleaned up on unmount (memory leak fix)
- ✅ Parent modal ignores keyboard when child open
- ✅ Keyboard events tracked in analytics
- ✅ Both keydown and keyup tracked
- ✅ Bubble phase listeners (not capture phase)

---

## Related Components

- **[Button](Button.md)** - Used in modal footer for actions (cancel/confirm/delete)
- **[FormField](FormField.md)** - Common modal body content for forms
- **[DebugBar](DebugBar.md)** - Analytics debug bar displayed at top of modal
- **[Spinner](Spinner.md)** - Loading state indicator (implicitly used in loading overlay)

---

## Usage Examples

### Example 1: Basic Confirmation Modal

```tsx
import { Modal, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function DeleteConfirmation({ contact, onDelete }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onDelete(contact.id);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="danger" size="small" onClick={() => setIsOpen(true)}>
        {t('common.delete')}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        modalId="delete-contact"
        title={t('contacts.deleteConfirmTitle')}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p>
          {t('contacts.deleteConfirmMessage', { name: contact.name })}
        </p>
      </Modal>
    </>
  );
}
```

**Output:**
- Small modal (480px width)
- Title: "Delete Contact?"
- Content: "Are you sure you want to delete Peter Smith?"
- Footer: Cancel (gray) + Delete (red) buttons
- ESC closes modal
- Enter triggers delete (onConfirm)

---

### Example 2: Edit Modal with Loading State

```tsx
import { Modal, Button, FormField, Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function EditContactModal({ contact, isOpen, onClose, onSave }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(contact);

  const handleSave = async () => {
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSave}
      modalId="edit-contact"
      title={t('contacts.editTitle')}
      size="md"
      loading={loading}
      footer={{
        right: (
          <>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSave} loading={loading}>
              {t('common.save')}
            </Button>
          </>
        ),
      }}
    >
      <FormField label={t('contacts.firstName')}>
        <Input
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          disabled={loading}
        />
      </FormField>

      <FormField label={t('contacts.lastName')}>
        <Input
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          disabled={loading}
        />
      </FormField>
    </Modal>
  );
}
```

**Output:**
- Medium modal (720px width)
- Loading state: Spinner overlay hides form fields
- Footer: Cancel + Save buttons (both disabled during loading)
- Enter triggers save (onConfirm)
- Form fields disabled during save

---

### Example 3: Nested Modal (List → Edit)

```tsx
import { Modal, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function ContactsListModal() {
  const { t } = useTranslation();
  const [listOpen, setListOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setEditOpen(true);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setListOpen(true)}>
        {t('contacts.openList')}
      </Button>

      {/* Parent Modal: Contact List */}
      <Modal
        isOpen={listOpen}
        onClose={() => setListOpen(false)}
        modalId="contact-list"
        title={t('contacts.listTitle')}
        size="lg"
      >
        <ContactTable onEdit={handleEdit} />

        {/* Child Modal: Edit Contact */}
        <Modal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          modalId="contact-edit"
          parentModalId="contact-list"
          title={t('contacts.editTitle')}
          size="md"
          footer={{
            right: (
              <>
                <Button variant="secondary" onClick={() => setEditOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {t('common.save')}
                </Button>
              </>
            ),
          }}
        >
          <EditForm contact={selectedContact} />
        </Modal>
      </Modal>
    </>
  );
}
```

**Output:**
- Parent modal: z-index 1000 (large, 1000px width)
- Child modal: z-index 1010 (medium, 720px width)
- ESC closes topmost modal (child closes first, then parent)
- Child modal overlays parent modal
- Parent modal dimmed when child open

---

### Example 4: Enhanced Footer with Error Message

```tsx
import { Modal, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function ContactFormModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(true);

  const handleSave = async () => {
    if (!formValid) {
      setError(t('contacts.validationError'));
      return;
    }

    await saveContact();
    onClose();
  };

  const handleDelete = async () => {
    await deleteContact();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSave}
      modalId="contact-form"
      title={t('contacts.addTitle')}
      size="md"
      footer={{
        left: (
          <Button variant="danger" onClick={handleDelete}>
            {t('common.delete')}
          </Button>
        ),
        right: (
          <>
            <Button variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!formValid}>
              {t('common.save')}
            </Button>
          </>
        ),
        errorMessage: error,
      }}
    >
      <ContactForm
        onValidationChange={(valid) => setFormValid(valid)}
        onError={(msg) => setError(msg)}
      />
    </Modal>
  );
}
```

**Output:**
- Enhanced footer layout:
  - Left: Delete button (red, danger variant)
  - Right: Cancel + Save buttons (gray + purple)
  - Error message: Red background strip below buttons
- Error message: "Please fix validation errors" (red background)
- Save button disabled when form invalid

---

### Example 5: Draggable Modal with Alignment

```tsx
import { Modal, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function NotificationModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      modalId="notification"
      title={t('notifications.title')}
      size="sm"
      alignment="top"
      overlayPadding="20px"
      disableDrag={false}
      footer={
        <Button variant="primary" onClick={() => setIsOpen(false)}>
          {t('common.ok')}
        </Button>
      }
    >
      <p>{t('notifications.message')}</p>
    </Modal>
  );
}
```

**Output:**
- Small modal (480px width)
- Top-aligned (20px from top)
- Draggable by header (cursor: grab)
- Drag modal anywhere on screen
- Position resets to top-center on reopen

---

## Performance

### Bundle Size

- **JS**: ~4.5 KB (gzipped, including TypeScript types and hooks)
- **CSS**: ~2.8 KB (gzipped, all variants + animations)
- **Total**: ~7.3 KB (larger due to drag & drop, modalStack, analytics)

### Runtime Performance

- **Render time**: ~2-3ms (average, complex modal with drag)
- **Re-renders**: Optimized with useCallback for all handlers
- **Memory**: ~5 KB per modal instance (includes analytics session)
- **Animation**: CSS-only (60fps, no JavaScript)
- **Drag performance**: Smooth 60fps (mousemove throttling via React state)

### Optimization Tips

- ✅ **Memoize handlers** with `useCallback()` (onClose, onConfirm)
- ✅ **Lazy render children** - Only render when `isOpen={true}`
- ✅ **Avoid inline footer** - Define footer outside component
- ✅ **Use modalId wisely** - Stable IDs prevent modalStack churn
- ✅ **Disable analytics** - Set `showDebugBar={false}` for production modals

**Example - Optimized Modal:**
```tsx
const handleClose = useCallback(() => {
  setIsOpen(false);
}, []); // Empty deps - handler never recreates

const handleSave = useCallback(async () => {
  await saveData();
  setIsOpen(false);
}, [saveData]); // Only recreate if saveData changes

const footer = useMemo(() => ({
  right: (
    <>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  ),
}), [handleClose, handleSave]); // Memoize footer object

return (
  <Modal
    isOpen={isOpen}
    onClose={handleClose}
    onConfirm={handleSave}
    modalId="contact-edit"
    footer={footer}
    showDebugBar={false} // Disable analytics in production
  >
    {children}
  </Modal>
);
```

### Memory Leak Fixes (v3.7.0)

**Fixed Leak #1: Drag Listeners**
- **Problem**: `mousemove` and `mouseup` listeners not cleaned up on unmount
- **Solution**: Track listener state with `listenersAttachedRef`, ensure cleanup in useEffect return
- **Impact**: Memory leak in pages with frequent modal open/close

**Fixed Leak #2: Keyboard Listener Churn**
- **Problem**: Keyboard listener recreated on every render (unstable handler reference)
- **Solution**: Stable handler via `handleModalKeyEventRef`, update ref instead of recreating listener
- **Impact**: Memory leak + performance degradation (listener churn on every render)

---

## Migration Guide

### From v3.7.0 to v3.8.0

**No Breaking Changes** ✅

**New Features:**
- Memory leak fixes (drag listeners + keyboard listener churn)
- Improved performance (stable event handlers)

**Migration:** No code changes required, upgrade automatically.

---

### From v3.5.0 to v3.6.0

**Breaking Changes:**
1. **Enter key behavior changed:**
   - **Before**: Enter always closed modal (same as ESC)
   - **After**: Enter calls `onConfirm` if provided, otherwise closes modal

**Migration Example:**
```tsx
// v3.5.0
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  modalId="my-modal"
>
  <Content />
</Modal>
// Behavior: Enter closes modal

// v3.6.0+ (same behavior)
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  modalId="my-modal"
  // No onConfirm - Enter closes modal (same as ESC)
>
  <Content />
</Modal>

// v3.6.0+ (new behavior - Enter submits)
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleSave} // NEW: Enter triggers this
  modalId="my-modal"
>
  <Content />
</Modal>
// Behavior: Enter calls handleSave
```

---

### From v2.x to v3.0.0

**Breaking Changes:**
1. `parentModalId` prop required for nested modals (was optional)
2. Footer layout changed: Simple ReactNode OR `ModalFooterConfig` object (no more `footerLeft`/`footerRight` props)
3. `onConfirm` callback added for keyboard shortcuts
4. `showDebugBar` prop defaults to `true` (was `false`)

**Migration Example:**
```tsx
// v2.x
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  modalId="my-modal"
  footerLeft={<Button variant="danger">Delete</Button>}
  footerRight={<Button variant="primary">Save</Button>}
>
  <Content />
</Modal>

// v3.0.0
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleSave} // NEW: Required for Enter key
  modalId="my-modal"
  footer={{
    left: <Button variant="danger">Delete</Button>,
    right: <Button variant="primary">Save</Button>,
    errorMessage: error ? 'Validation failed' : undefined, // NEW
  }}
>
  <Content />
</Modal>
```

---

## Changelog

### v3.9.0 (2025-11-01)
- ✅ **NEW**: Dirty tracking (unsaved changes detection)
  - Added `hasUnsavedChanges` prop (default: false)
  - Shows confirmation dialog when closing modal with unsaved changes
  - Applies to X button, ESC key, and backdrop click
  - Uses useConfirm hook for consistent UX
- ✅ **NEW**: Dynamic debug bar height measurement
  - Debug bar height measured automatically after render
  - Header `paddingTop` adjusts dynamically based on measured height
  - Supports multi-line debug bar (wraps on narrow modals < 600px)
  - Window resize listener re-measures height when needed
  - Fixes issue where multi-line debug bar covered modal header
- ✅ **IMPROVEMENT**: DebugBar refactored to use forwardRef
  - Allows parent Modal to measure DebugBar height via ref
  - Enables dynamic header padding calculation

### v3.8.1 (2025-10-30)
- 🐛 **CRITICAL**: Fixed useEffect dependencies in modalStack registration (line 361)
- ✅ Removed `onClose` and `onConfirm` from dependencies array
- ✅ Prevents unmount/remount cycles when parent re-renders with new function references
- ✅ modalStack stores functions internally and uses latest versions when called
- ✅ Improves performance and prevents stale closure bugs in EditItemModal integration

### v3.8.0 (2025-10-19)
- 🐛 **CRITICAL**: Fixed 2 memory leaks (drag listeners + keyboard listener churn)
- ✅ Improved performance (stable event handlers, reduced listener churn)
- ✅ Added `listenersAttachedRef` to track drag listener state
- ✅ Added `handleModalKeyEventRef` to stabilize keyboard handler

### v3.7.0 (2025-10-19)
- ✅ Added memory leak detection tests
- ✅ Verified drag listener cleanup on unmount
- ✅ Verified keyboard listener cleanup on unmount

### v3.6.0 (2025-10-18)
- ✅ Enter key now closes modal when no `onConfirm` (same as ESC)
- ✅ Enhanced keyboard behavior: Enter submits if `onConfirm` provided
- ✅ Updated keyboard tests for new behavior

### v3.5.0 (2025-10-18)
- ✅ Enhanced input field handling: ESC/Enter blur input instead of modal action
- ✅ Improved UX: User can escape input field without closing modal

### v3.4.0 (2025-10-17)
- ✅ Fixed nested modal ESC handling: Switched to bubble phase listeners
- ✅ Child modal events now bubble up correctly (child handles first)

### v3.3.0 (2025-10-17)
- ⚠️ **Attempted fix** with `_modalHandled` flag (didn't work)
- 🐛 Nested modal ESC still broken (fixed in v3.4.0)

### v3.2.0 (2025-10-16)
- ✅ **Hybrid keyboard handling**: Modal handles ESC/Enter locally (not delegated to BasePage)
- ✅ Modal has full control over keyboard behavior
- ✅ Separation of concerns: BasePage only handles global shortcuts (Ctrl+D, Ctrl+L)

### v3.1.0 (2025-10-15)
- ✅ Initial version with keyboard delegation to BasePage
- ⚠️ Keyboard handling issues with nested modals (fixed in v3.2.0)

### v3.0.0 (2025-10-14)
- 🎉 Initial v3 release with enhanced features
- ✅ Drag & Drop support
- ✅ Nested modals with modalStack integration
- ✅ Enhanced footer (left/right slots + error message)
- ✅ Alignment options (top/center/bottom)
- ✅ Padding override for nested modals
- ✅ Analytics integration (usePageAnalytics)
- ✅ Debug bar support
- ✅ 128 unit tests (100% coverage)

---

## Contributing

### Adding New Modal Variant

1. Add CSS class in `Modal.module.css`:
   ```css
   .modal--drawer {
     position: fixed;
     right: 0;
     top: 0;
     height: 100vh;
     width: var(--modal-width-md);
     animation: slideInRight 300ms ease-out;
   }
   ```

2. Update `ModalProps` interface in `Modal.tsx`:
   ```typescript
   interface ModalProps {
     variant?: 'centered' | 'drawer' | 'fullscreen'; // NEW prop
     // ... other props
   }
   ```

3. Update Modal component logic:
   ```typescript
   const variantClass = variant === 'drawer' ? styles['modal--drawer'] : styles['modal--centered'];
   ```

4. Update this documentation:
   - Add to **Features** list
   - Add to **Visual Design > Variants** section
   - Add example in **Usage Examples**

5. Add tests:
   ```typescript
   it('applies drawer variant class', () => {
     render(<Modal isOpen={true} variant="drawer" modalId="test" />);
     expect(screen.getByRole('dialog').className).toContain('modal--drawer');
   });
   ```

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management (get Task #XXX)
3. Add to this documentation under "Known Issues"
4. Include:
   - Severity (Low/Medium/High/Critical)
   - Affected props/features
   - Steps to reproduce
   - Workaround (if any)

---

## Resources

### Internal Links

- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)
- [modalStack Documentation](../packages/config.md#modalstack)
- [usePageAnalytics Hook](../hooks/usePageAnalytics.md)
- [Button Component](Button.md)
- [DebugBar Component](DebugBar.md)

### External References

- [React 19 Documentation](https://react.dev)
- [React Portal API](https://react.dev/reference/react-dom/createPortal)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices - Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 3.8.0
**Component Version**: 3.8.0
