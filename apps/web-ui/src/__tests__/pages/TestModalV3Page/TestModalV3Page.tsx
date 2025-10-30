/*
 * ================================================================
 * FILE: TestModalV3Page.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/TestModalV3Page.tsx
 * DESCRIPTION: Testing page for Modal v3.6.0 enhanced features
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 02:45:00
 *
 * TESTS:
 *   ✅ Drag & Drop - Modal can be dragged by header
 *   ✅ Enhanced Keyboard - ESC/Enter blur input, close/submit modal
 *   ✅ Nested Modals - modalStack auto z-index management
 *   ✅ Enhanced Footer - Left/right slots + error message
 *   ✅ Alignment - top/center/bottom positioning
 *   ✅ Padding Override - Custom overlay padding
 *   ✅ Disable Drag - Modal with dragging disabled
 *   ✅ Multi-step Wizard - 3-step wizard with progress indicator
 * ================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { BasePage, Modal, Button, Input, FormField, WizardProgress, WizardNavigation, Card, ConfirmModal, EditItemModal } from '@l-kern/ui-components';
import type { ModalFooterConfig } from '@l-kern/ui-components';
import { useModal, useModalWizard, useConfirm, useFormDirty, EMAIL_REGEX } from '@l-kern/config';
import { useTranslation } from '@l-kern/config';
import styles from './TestModalV3Page.module.css';

export function TestModalV3Page() {
  const { t } = useTranslation();

  // Test 1: Basic drag & drop
  const dragModal = useModal();

  // Test 2: Enhanced keyboard (ESC topmost only)
  const parentModal = useModal();
  const childModal = useModal();

  // Test 3: Enhanced footer with real-time validation
  const footerModal = useModal();
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Test 4: Alignment options
  const topModal = useModal();
  const bottomModal = useModal();

  // Test 5: Submit on Enter
  const submitModal = useModal();
  const [inputValue, setInputValue] = useState('');

  // Test 6: Disable drag
  const noDragModal = useModal();

  // Test 7: Multi-step Wizard (renumbered from Test 8)
  const wizardModal = useModal();
  const [wizardData, setWizardData] = useState({ step1: '', step2: '' });

  // Test 8: ConfirmModal - Simple Mode (renumbered from Test 9)
  const simpleConfirm = useConfirm();
  const [simpleConfirmResult, setSimpleConfirmResult] = useState<string>('');

  const handleSimpleConfirm = async () => {
    // Don't pass message - let ConfirmModal use default translations
    const confirmed = await simpleConfirm.confirm('');
    setSimpleConfirmResult(confirmed ? 'confirmed' : 'cancelled');
  };

  // Test 9: ConfirmModal - Danger Mode (renumbered from Test 10)
  const dangerConfirm = useConfirm();
  const [dangerConfirmResult, setDangerConfirmResult] = useState<string>('');

  const handleDangerConfirm = async () => {
    // Don't pass confirmKeyword - let ConfirmModal load it from translations dynamically
    // This ensures keyword changes when language switches
    const confirmed = await dangerConfirm.confirm({
      isDanger: true,
    });
    setDangerConfirmResult(confirmed ? 'confirmed' : 'cancelled');
  };

  // Test 10: ConfirmModal - Unsaved Changes (renumbered from Test 11)
  const unsavedConfirm = useConfirm();
  const [unsavedConfirmResult, setUnsavedConfirmResult] = useState<string>('');

  const handleUnsavedConfirm = async () => {
    // Use preset unsavedChanges translations from ConfirmModal
    const confirmed = await unsavedConfirm.confirm('');
    setUnsavedConfirmResult(confirmed ? 'discard' : 'stay');
  };

  // Test 11: EditItemModal (NEW)
  const editItemModal = useModal();
  const [editItemResult, setEditItemResult] = useState<string>('');
  const [initialEditData, setInitialEditData] = useState({ name: '', email: '' });
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const { isDirty } = useFormDirty(initialEditData, editFormData);
  const [editNameValid, setEditNameValid] = useState(false);
  const [editEmailValid, setEditEmailValid] = useState(false);

  // Sync editFormData with initialEditData when modal opens
  useEffect(() => {
    if (editItemModal.isOpen) {
      // Load saved data into form
      setEditFormData(initialEditData);
      // Set validation states based on saved data
      setEditNameValid(!!initialEditData.name);
      setEditEmailValid(!!initialEditData.email && EMAIL_REGEX.test(initialEditData.email));
    }
  }, [editItemModal.isOpen, initialEditData]);

  const handleEditItemSave = useCallback(() => {
    // Save current form data as new baseline
    setInitialEditData(editFormData);
    setEditItemResult(t('components.modalV3.test12.savedMessage'));
    editItemModal.close();
  }, [editFormData, t, editItemModal]);

  const handleEditItemClear = useCallback(() => {
    // Clear form (temporary - not saved until user clicks Save)
    setEditFormData({ name: '', email: '' });
    setEditNameValid(false);
    setEditEmailValid(false);
    setEditItemResult(t('components.modalV3.test12.clearedMessage'));
  }, [t]);

  const handleEditItemClose = useCallback(() => {
    // Close modal and discard unsaved changes
    if (isDirty) {
      setEditItemResult(t('components.modalV3.test12.closedWithChanges'));
    } else {
      setEditItemResult(t('components.modalV3.test12.closedWithoutChanges'));
    }
    editItemModal.close();
    // Note: editFormData will be reset to initialEditData when modal reopens (via useEffect)
  }, [isDirty, t, editItemModal]);

  const wizard = useModalWizard({
    id: 'test-wizard',
    steps: [
      { id: 'step1', title: t('components.modalV3.test8.step1Title') },
      { id: 'step2', title: t('components.modalV3.test8.step2Title') },
      { id: 'step3', title: t('components.modalV3.test8.step3Title') }
    ],
    onComplete: () => {
      alert(t('components.modalV3.test8.completeMessage'));
      wizardModal.close();
      setWizardData({ step1: '', step2: '' });
    },
    onCancel: () => {
      wizardModal.close();
    }
  });

  // Sync wizard open state with parent modal
  useEffect(() => {
    if (wizardModal.isOpen && !wizard.isOpen) {
      wizard.start();
    }
  }, [wizardModal.isOpen, wizard]);

  const handleSubmit = () => {
    console.log('[TestModalV3] Submit with value:', inputValue);
    alert(`${t('components.modalV3.common.submitted')}: ${inputValue}`);
    submitModal.close();
  };

  // Validation functions for FormField
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return t('forms.errors.required');
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return t('forms.errors.required');
    if (!EMAIL_REGEX.test(value)) return t('forms.errors.invalidEmail');
    return undefined;
  };

  // Check if form is valid (both fields must be valid)
  const isFormValid = nameValid && emailValid;

  const handleFooterSave = () => {
    if (!isFormValid) {
      alert(t('forms.errors.fillAllFields'));
      return;
    }

    // Success - submit form
    alert(`${t('common.save')} - ${t('components.modalV3.test3.successMessage')}`);
    footerModal.close();
    setNameValid(false);
    setEmailValid(false);
  };

  const handleFooterDelete = () => {
    if (confirm(t('components.modalV3.common.confirmDelete'))) {
      alert(t('components.modalV3.common.deleted'));
      footerModal.close();
    }
  };

  // Enhanced footer config
  const enhancedFooter: ModalFooterConfig = {
    left: (
      <Button variant="danger" onClick={handleFooterDelete}>
        {t('common.delete')}
      </Button>
    ),
    right: (
      <>
        <Button variant="secondary" onClick={footerModal.close}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleFooterSave}
          loading={footerModal.isSubmitting}
          disabled={!isFormValid}
        >
          {t('common.save')}
        </Button>
      </>
    ),
  };

  return (
    <BasePage pageName="modalV3Testing">
      <div className={styles.container}>
        <h1 className={styles.header}>
          {t('components.modalV3.pageTitle')}
        </h1>

      <div className={styles.testGrid}>
        {/* Test 1: Drag & Drop */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test1.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test1.description')}
          </p>
          <Button variant="primary" onClick={dragModal.open}>
            {t('components.modalV3.test1.buttonLabel')}
          </Button>

          <Modal
            isOpen={dragModal.isOpen}
            onClose={dragModal.close}
            modalId="drag-test"
            pageName="dragTest"
            title={t('components.modalV3.test1.modalTitle')}
            size="md"
          >
            <div className={styles.modalContent}>
              <p>
                <strong>{t('components.modalV3.test1.instructionsHeading')}</strong>
              </p>
              <ul>
                <li>{t('components.modalV3.test1.instruction1')}</li>
                <li>{t('components.modalV3.test1.instruction2')}</li>
                <li>{t('components.modalV3.test1.instruction3')}</li>
                <li>{t('components.modalV3.test1.instruction4')}</li>
              </ul>
            </div>
          </Modal>
        </Card>

        {/* Test 2: Nested Modals (ESC topmost only) */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test2.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test2.description')}
          </p>
          <Button variant="primary" onClick={parentModal.open}>
            {t('components.modalV3.test2.buttonLabel')}
          </Button>

          <Modal
            isOpen={parentModal.isOpen}
            onClose={parentModal.close}
            modalId="parent"
            pageName="parentModal"
            title={t('components.modalV3.test2.parentModalTitle')}
            size="lg"
          >
            <div className={styles.modalContent}>
              <p>
                {t('components.modalV3.test2.parentContent')}
              </p>
              <p style={{ fontWeight: '600' }}>
                {t('components.modalV3.test2.parentHint')}
              </p>
              <Button variant="secondary" onClick={childModal.open}>
                {t('components.modalV3.test2.childButtonLabel')}
              </Button>
            </div>

            {/* Nested Child Modal */}
            <Modal
              isOpen={childModal.isOpen}
              onClose={childModal.close}
              modalId="child"
              pageName="childModal"
              parentModalId="parent"
              title={t('components.modalV3.test2.childModalTitle')}
              size="md"
              overlayPadding="80px"
            >
              <div className={styles.modalContent}>
                <p style={{ fontWeight: '600' }}>
                  <strong>{t('components.modalV3.test2.childTestHeading')}</strong>
                </p>
                <ul style={{ marginBottom: '16px' }}>
                  <li>{t('components.modalV3.test2.childInstruction1')}</li>
                  <li>{t('components.modalV3.test2.childInstruction2')}</li>
                  <li>{t('components.modalV3.test2.childInstruction3')}</li>
                </ul>
                <p className={styles.modalHint}>
                  {t('components.modalV3.test2.childHint')}
                </p>
              </div>
            </Modal>
          </Modal>
        </Card>

        {/* Test 3: Enhanced Footer */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test3.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test3.description')}
          </p>
          <Button variant="primary" onClick={footerModal.open}>
            {t('components.modalV3.test3.buttonLabel')}
          </Button>

          <Modal
            isOpen={footerModal.isOpen}
            onClose={() => {
              footerModal.close();
              setNameValid(false);
              setEmailValid(false);
            }}
            onConfirm={handleFooterSave}
            modalId="enhanced-footer"
            pageName="enhancedFooter"
            title={t('components.modalV3.test3.modalTitle')}
            size="md"
            footer={enhancedFooter}
          >
            <div className={styles.modalContent}>
              <p style={{ marginBottom: '20px' }}>
                <strong>{t('components.modalV3.test3.testValidationHeading')}</strong>
              </p>

              {/* Name Field - REQUIRED with real-time validation */}
              <FormField
                label={t('fields.name')}
                required
                validate={validateName}
                onValidChange={setNameValid}
                successMessage={t('components.modalV3.test3.nameSuccess')}
                reserveMessageSpace
                htmlFor="footer-name"
              >
                <Input
                  id="footer-name"
                  type="text"
                  placeholder={t('components.modalV3.test3.namePlaceholder')}
                />
              </FormField>

              {/* Email Field - REQUIRED with real-time validation */}
              <FormField
                label={t('fields.email')}
                required
                validate={validateEmail}
                onValidChange={setEmailValid}
                successMessage={t('components.modalV3.test3.emailSuccess')}
                helperText={t('components.modalV3.test3.emailHelper')}
                reserveMessageSpace
                htmlFor="footer-email"
              >
                <Input
                  id="footer-email"
                  type="text"
                  placeholder={t('components.modalV3.test3.emailPlaceholder')}
                />
              </FormField>

              {/* Message Field - OPTIONAL (no validation) */}
              <FormField
                label={t('components.modalV3.test3.messageLabel')}
                helperText={t('components.modalV3.test3.messageHelper')}
                reserveMessageSpace
                htmlFor="footer-message"
              >
                <Input
                  id="footer-message"
                  type="text"
                  placeholder={t('components.modalV3.test3.messagePlaceholder')}
                />
              </FormField>

              <ul style={{ marginTop: '16px', fontSize: '14px' }}>
                <li>{t('components.modalV3.test3.instruction1')}</li>
                <li>{t('components.modalV3.test3.instruction2')}</li>
                <li>{t('components.modalV3.test3.instruction3')}</li>
                <li>{t('components.modalV3.test3.instruction4')}</li>
                <li>{t('components.modalV3.test3.instruction5')}</li>
              </ul>
            </div>
          </Modal>
        </Card>

        {/* Test 4: Alignment Top */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test4.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test4.description')}
          </p>
          <Button variant="primary" onClick={topModal.open}>
            {t('components.modalV3.test4.buttonLabel')}
          </Button>

          <Modal
            isOpen={topModal.isOpen}
            onClose={topModal.close}
            modalId="top-align"
            pageName="topAlign"
            title={t('components.modalV3.test4.modalTitle')}
            size="sm"
            alignment="top"
          >
            <div className={styles.modalContent}>
              <p>{t('components.modalV3.test4.content')}</p>
            </div>
          </Modal>
        </Card>

        {/* Test 5: Alignment Bottom */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test5.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test5.description')}
          </p>
          <Button variant="primary" onClick={bottomModal.open}>
            {t('components.modalV3.test5.buttonLabel')}
          </Button>

          <Modal
            isOpen={bottomModal.isOpen}
            onClose={bottomModal.close}
            modalId="bottom-align"
            pageName="bottomAlign"
            title={t('components.modalV3.test5.modalTitle')}
            size="sm"
            alignment="bottom"
          >
            <div className={styles.modalContent}>
              <p>{t('components.modalV3.test5.content')}</p>
            </div>
          </Modal>
        </Card>

        {/* Test 6: Submit on Enter */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test6.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test6.description')}
          </p>
          <Button variant="primary" onClick={submitModal.open}>
            {t('components.modalV3.test6.buttonLabel')}
          </Button>

          <Modal
            isOpen={submitModal.isOpen}
            onClose={() => {
              submitModal.close();
              setInputValue('');
            }}
            onConfirm={handleSubmit}
            modalId="submit-test"
            pageName="submitTest"
            title={t('components.modalV3.test6.modalTitle')}
            size="md"
          >
            <div className={styles.modalContent}>
              <p>
                <strong>{t('components.modalV3.test6.testHeading')}</strong>
              </p>
              <Input
                type="text"
                placeholder={t('components.modalV3.test6.placeholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                fullWidth
              />
              <p className={styles.modalHint} style={{ marginTop: '8px' }}>
                {t('components.modalV3.test6.hint')}
              </p>
            </div>
          </Modal>
        </Card>

        {/* Test 7: Disable Drag */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test7.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test7.description')}
          </p>
          <Button variant="primary" onClick={noDragModal.open}>
            {t('components.modalV3.test7.buttonLabel')}
          </Button>

          <Modal
            isOpen={noDragModal.isOpen}
            onClose={noDragModal.close}
            modalId="no-drag"
            pageName="noDrag"
            title={t('components.modalV3.test7.modalTitle')}
            size="sm"
            disableDrag={true}
          >
            <div className={styles.modalContent}>
              <p>
                {t('components.modalV3.test7.content')}
              </p>
            </div>
          </Modal>
        </Card>

        {/* Test 7: Multi-step Wizard */}
        <Card variant="default">
          <h2 className={styles.testTitle}>{t('components.modalV3.test8.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test8.description')}
          </p>
          <Button variant="primary" onClick={wizardModal.open}>
            {t('components.modalV3.test8.buttonLabel')}
          </Button>

          <Modal
            isOpen={wizard.isOpen}
            onClose={wizard.cancel}
            onConfirm={
              wizard.isLastStep
                ? () => wizard.complete(wizardData)
                : () => wizard.next(wizardData)
            }
            modalId="wizard-test"
            pageName="wizardTest"
            title={`${t('components.modalV3.test8.modalTitle')} - ${wizard.currentStepTitle}`}
            size="md"
            closeOnBackdropClick={false}
            footer={
              <>
                <WizardProgress
                  currentStep={wizard.currentStep}
                  totalSteps={wizard.totalSteps}
                  currentStepTitle={wizard.currentStepTitle}
                  variant="dots"
                />
                <WizardNavigation
                  onPrevious={wizard.canGoPrevious ? wizard.previous : undefined}
                  onNext={
                    !wizard.isLastStep
                      ? () => wizard.next(wizardData)
                      : undefined
                  }
                  onComplete={
                    wizard.isLastStep
                      ? () => wizard.complete(wizardData)
                      : undefined
                  }
                  canGoPrevious={wizard.canGoPrevious}
                  canGoNext={true}
                  isLastStep={wizard.isLastStep}
                  isSubmitting={wizard.isSubmitting}
                />
              </>
            }
          >
            <div className={styles.modalContent}>
              {/* Step 1: Basic Info */}
              {wizard.currentStep === 0 && (
                <div>
                  <p><strong>{t('components.modalV3.test8.step1Content')}</strong></p>
                  <Input
                    type="text"
                    placeholder={t('components.modalV3.test8.step1Placeholder')}
                    value={wizardData.step1}
                    onChange={(e) => setWizardData({ ...wizardData, step1: e.target.value })}
                    fullWidth
                  />
                </div>
              )}

              {/* Step 2: Details */}
              {wizard.currentStep === 1 && (
                <div>
                  <p><strong>{t('components.modalV3.test8.step2Content')}</strong></p>
                  <Input
                    type="email"
                    placeholder={t('components.modalV3.test8.step2Placeholder')}
                    value={wizardData.step2}
                    onChange={(e) => setWizardData({ ...wizardData, step2: e.target.value })}
                    fullWidth
                  />
                </div>
              )}

              {/* Step 3: Summary */}
              {wizard.currentStep === 2 && (
                <div>
                  <p><strong>{t('components.modalV3.test8.step3Content')}</strong></p>
                  <ul style={{ marginTop: '16px' }}>
                    <li>{t('components.modalV3.test8.step1Title')}: {wizardData.step1 || '(prázdne)'}</li>
                    <li>{t('components.modalV3.test8.step2Title')}: {wizardData.step2 || '(prázdne)'}</li>
                  </ul>
                </div>
              )}

              <p className={styles.modalHint} style={{ marginTop: '16px' }}>
                {t('components.modalV3.test8.hint')}
              </p>
            </div>
          </Modal>
        </Card>

        {/* Test 8: ConfirmModal - Simple Mode */}
        <Card variant="default">
          <h2 className={styles.testTitle}>🆕 ConfirmModal - Simple Mode</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test9.description')}
          </p>
          <Button variant="primary" onClick={handleSimpleConfirm}>
            {t('components.modalV3.test9.buttonLabel')}
          </Button>

          {simpleConfirmResult && (
            <div style={{
              padding: '12px',
              marginTop: '12px',
              background: simpleConfirmResult === 'confirmed'
                ? 'var(--color-status-success-bg, #e8f5e9)'
                : 'var(--color-status-warning-bg, #fff3e0)',
              color: simpleConfirmResult === 'confirmed'
                ? 'var(--color-status-success-text, #1b5e20)'
                : 'var(--color-status-warning-text, #e65100)',
              border: `1px solid ${simpleConfirmResult === 'confirmed'
                ? 'var(--color-status-success, #4caf50)'
                : 'var(--color-status-warning, #ff9800)'}`,
              borderRadius: '4px'
            }}>
              {t('components.modalV3.testConfirm.result')}: {simpleConfirmResult}
            </div>
          )}

          {/* ConfirmModal rendered by useConfirm hook */}
          <ConfirmModal
            isOpen={simpleConfirm.state.isOpen}
            onClose={simpleConfirm.handleCancel}
            onConfirm={simpleConfirm.handleConfirm}
            title={simpleConfirm.state.title}
            message={simpleConfirm.state.message}
          />
        </Card>

        {/* Test 9: ConfirmModal - Danger Mode */}
        <Card variant="default">
          <h2 className={styles.testTitle}>🆕 ConfirmModal - Danger Mode</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test10.description')}
          </p>
          <Button variant="danger" onClick={handleDangerConfirm}>
            {t('components.modalV3.test10.buttonLabel')}
          </Button>

          {dangerConfirmResult && (
            <div style={{
              padding: '12px',
              marginTop: '12px',
              background: dangerConfirmResult === 'confirmed'
                ? 'var(--color-status-success-bg, #e8f5e9)'
                : 'var(--color-status-warning-bg, #fff3e0)',
              color: dangerConfirmResult === 'confirmed'
                ? 'var(--color-status-success-text, #1b5e20)'
                : 'var(--color-status-warning-text, #e65100)',
              border: `1px solid ${dangerConfirmResult === 'confirmed'
                ? 'var(--color-status-success, #4caf50)'
                : 'var(--color-status-warning, #ff9800)'}`,
              borderRadius: '4px'
            }}>
              {t('components.modalV3.testConfirm.result')}: {dangerConfirmResult}
            </div>
          )}

          {/* ConfirmModal rendered by useConfirm hook with danger mode */}
          <ConfirmModal
            isOpen={dangerConfirm.state.isOpen}
            onClose={dangerConfirm.handleCancel}
            onConfirm={dangerConfirm.handleConfirm}
            title={dangerConfirm.state.title}
            message={dangerConfirm.state.message}
            isDanger={dangerConfirm.state.isDanger}
          />
        </Card>

        {/* Test 10: ConfirmModal - Unsaved Changes */}
        <Card variant="default">
          <h2 className={styles.testTitle}>🆕 ConfirmModal - Unsaved Changes</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test11.description')}
          </p>
          <Button variant="secondary" onClick={handleUnsavedConfirm}>
            {t('components.modalV3.test11.buttonLabel')}
          </Button>

          {unsavedConfirmResult && (
            <div style={{
              padding: '12px',
              marginTop: '12px',
              background: unsavedConfirmResult === 'stay'
                ? 'var(--color-status-info-bg, #e3f2fd)'
                : 'var(--color-status-warning-bg, #fff3e0)',
              color: unsavedConfirmResult === 'stay'
                ? 'var(--color-status-info-text, #0d47a1)'
                : 'var(--color-status-warning-text, #e65100)',
              border: `1px solid ${unsavedConfirmResult === 'stay'
                ? 'var(--color-status-info, #2196F3)'
                : 'var(--color-status-warning, #ff9800)'}`,
              borderRadius: '4px'
            }}>
              {t('components.modalV3.testConfirm.result')}: {unsavedConfirmResult}
            </div>
          )}

          {/* ConfirmModal rendered by useConfirm hook */}
          <ConfirmModal
            isOpen={unsavedConfirm.state.isOpen}
            onClose={unsavedConfirm.handleCancel}
            onConfirm={unsavedConfirm.handleConfirm}
            title={unsavedConfirm.state.title}
            message={unsavedConfirm.state.message}
          />
        </Card>

        {/* Test 11: EditItemModal */}
        <Card variant="default">
          <h2 className={styles.testTitle}>🆕 {t('components.modalV3.test12.title')}</h2>
          <p className={styles.testDescription}>
            {t('components.modalV3.test12.description')}
          </p>
          <Button variant="primary" onClick={editItemModal.open}>
            {t('components.modalV3.test12.buttonLabel')}
          </Button>

          {editItemResult && (
            <div style={{
              padding: '12px',
              marginTop: '12px',
              background: editItemResult.includes('uložené') || editItemResult.includes('saved')
                ? 'var(--color-status-success-bg, #e8f5e9)'
                : editItemResult.includes('vyčistený') || editItemResult.includes('cleared')
                ? 'var(--color-status-info-bg, #e3f2fd)'
                : 'var(--color-status-warning-bg, #fff3e0)',
              color: editItemResult.includes('uložené') || editItemResult.includes('saved')
                ? 'var(--color-status-success-text, #1b5e20)'
                : editItemResult.includes('vyčistený') || editItemResult.includes('cleared')
                ? 'var(--color-status-info-text, #0d47a1)'
                : 'var(--color-status-warning-text, #e65100)',
              border: `1px solid ${editItemResult.includes('uložené') || editItemResult.includes('saved')
                ? 'var(--color-status-success, #4caf50)'
                : editItemResult.includes('vyčistený') || editItemResult.includes('cleared')
                ? 'var(--color-status-info, #2196F3)'
                : 'var(--color-status-warning, #ff9800)'}`,
              borderRadius: '4px'
            }}>
              {editItemResult}
            </div>
          )}

          {/* EditItemModal with all features */}
          <EditItemModal
            key="edit-item-modal-stable"
            isOpen={editItemModal.isOpen}
            onClose={handleEditItemClose}
            onSave={handleEditItemSave}
            title={t('components.modalV3.test12.modalTitle')}
            modalId="edit-item-test"
            saveDisabled={!editNameValid || !editEmailValid}
            hasUnsavedChanges={isDirty}
            showClearButton
            onClear={handleEditItemClear}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormField
                label={t('components.modalV3.test12.nameLabel')}
                required
                validate={validateName}
                onValidChange={setEditNameValid}
                reserveMessageSpace
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              >
                <Input
                  type="text"
                  placeholder={t('components.modalV3.test12.namePlaceholder')}
                  fullWidth
                />
              </FormField>

              <FormField
                label={t('components.modalV3.test12.emailLabel')}
                required
                validate={validateEmail}
                onValidChange={setEditEmailValid}
                reserveMessageSpace
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
              >
                <Input
                  type="email"
                  placeholder={t('components.modalV3.test12.emailPlaceholder')}
                  fullWidth
                />
              </FormField>

              <ul style={{ fontSize: '14px', marginTop: '8px' }}>
                <li>💾 {t('components.modalV3.test12.instructions.unsavedChanges')}: {isDirty ? `✅ ${t('components.modalV3.test12.instructions.yes')}` : `❌ ${t('components.modalV3.test12.instructions.no')}`}</li>
                <li>✅ {t('components.modalV3.test12.instructions.formValid')}: {editNameValid && editEmailValid ? `✅ ${t('components.modalV3.test12.instructions.yes')}` : `❌ ${t('components.modalV3.test12.instructions.no')}`}</li>
                <li>🧹 {t('components.modalV3.test12.instructions.clearButton')}</li>
                <li>⚠️ {t('components.modalV3.test12.instructions.tryClosing')}</li>
                <li>🔄 {t('components.modalV3.test12.instructions.changeLanguage')}</li>
              </ul>
            </div>
          </EditItemModal>
        </Card>
      </div>

      {/* Feature Summary */}
      <Card variant="elevated" className={styles.featureSummary}>
        <h2 className={styles.featureSummaryTitle}>
          {t('components.modalV3.featureSummary.title')}
        </h2>
        <ul className={styles.featureSummaryList}>
          <li>
            <strong>{t('components.modalV3.featureSummary.dragDrop')}</strong> {t('components.modalV3.featureSummary.dragDropDesc')}
          </li>
          <li>
            <strong>{t('components.modalV3.featureSummary.enhancedKeyboard')}</strong> {t('components.modalV3.featureSummary.enhancedKeyboardDesc')}
          </li>
          <li>
            <strong>{t('components.modalV3.featureSummary.nestedModals')}</strong> {t('components.modalV3.featureSummary.nestedModalsDesc')}
          </li>
          <li>
            <strong>{t('components.modalV3.featureSummary.enhancedFooter')}</strong> {t('components.modalV3.featureSummary.enhancedFooterDesc')}
          </li>
          <li>
            <strong>{t('components.modalV3.featureSummary.alignment')}</strong> {t('components.modalV3.featureSummary.alignmentDesc')}
          </li>
          <li>
            <strong>{t('components.modalV3.featureSummary.paddingOverride')}</strong> {t('components.modalV3.featureSummary.paddingOverrideDesc')}
          </li>
          <li>
            <strong>{t('components.modalV3.featureSummary.modalStack')}</strong> {t('components.modalV3.featureSummary.modalStackDesc')}
          </li>
          <li>
            <strong>🆕 ConfirmModal Component</strong> Simple and danger mode confirmations with keyword validation
          </li>
        </ul>
      </Card>
    </div>
    </BasePage>
  );
}

export default TestModalV3Page;
