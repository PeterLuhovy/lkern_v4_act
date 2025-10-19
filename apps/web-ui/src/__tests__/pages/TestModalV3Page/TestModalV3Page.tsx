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

import { useState, useEffect } from 'react';
import { BasePage, Modal, Button, Input, WizardProgress, WizardNavigation } from '@l-kern/ui-components';
import type { ModalFooterConfig } from '@l-kern/ui-components';
import { useModal, useModalWizard } from '@l-kern/config';
import { useTranslation } from '@l-kern/config';
import styles from './TestModalV3Page.module.css';

export function TestModalV3Page() {
  const { t } = useTranslation();

  // Test 1: Basic drag & drop
  const dragModal = useModal();

  // Test 2: Enhanced keyboard (ESC topmost only)
  const parentModal = useModal();
  const childModal = useModal();

  // Test 3: Enhanced footer with error
  const footerModal = useModal();
  const [footerError, setFooterError] = useState<string>('');

  // Test 4: Alignment options
  const topModal = useModal();
  const bottomModal = useModal();

  // Test 5: Submit on Enter
  const submitModal = useModal();
  const [inputValue, setInputValue] = useState('');

  // Test 6: Disable drag
  const noDragModal = useModal();

  // Test 8: Multi-step Wizard
  const wizardModal = useModal();
  const [wizardData, setWizardData] = useState({ step1: '', step2: '' });

  const wizard = useModalWizard({
    id: 'test-wizard',
    steps: [
      { id: 'step1', title: t('components.modalV3.test8.step1Title') },
      { id: 'step2', title: t('components.modalV3.test8.step2Title') },
      { id: 'step3', title: t('components.modalV3.test8.step3Title') }
    ],
    onComplete: (data) => {
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

  const handleFooterSave = () => {
    if (!inputValue) {
      setFooterError(t('components.modalV3.common.inputEmptyError'));
      return;
    }
    setFooterError('');
    alert(`${t('common.save')}: ${inputValue}`);
    footerModal.close();
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
        <Button variant="primary" onClick={handleFooterSave} loading={footerModal.isSubmitting}>
          {t('common.save')}
        </Button>
      </>
    ),
    errorMessage: footerError || undefined,
  };

  return (
    <BasePage>
      <div className={styles.container}>
        <h1 className={styles.header}>
          {t('components.modalV3.pageTitle')}
        </h1>

      <div className={styles.testGrid}>
        {/* Test 1: Drag & Drop */}
        <div className={styles.testCard}>
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
        </div>

        {/* Test 2: Nested Modals (ESC topmost only) */}
        <div className={styles.testCard}>
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
        </div>

        {/* Test 3: Enhanced Footer */}
        <div className={styles.testCard}>
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
              setFooterError('');
              setInputValue('');
            }}
            onConfirm={handleFooterSave}
            modalId="enhanced-footer"
            title={t('components.modalV3.test3.modalTitle')}
            size="md"
            footer={enhancedFooter}
          >
            <div className={styles.modalContent}>
              <p>
                <strong>{t('components.modalV3.test3.testValidationHeading')}</strong>
              </p>
              <Input
                type="text"
                placeholder={t('components.modalV3.test3.placeholder')}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (footerError) setFooterError(''); // Clear error on input
                }}
                fullWidth
              />
              <ul style={{ marginTop: '16px', fontSize: '14px' }}>
                <li>{t('components.modalV3.test3.instruction1')}</li>
                <li>{t('components.modalV3.test3.instruction2')}</li>
                <li>{t('components.modalV3.test3.instruction3')}</li>
              </ul>
            </div>
          </Modal>
        </div>

        {/* Test 4: Alignment Top */}
        <div className={styles.testCard}>
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
            title={t('components.modalV3.test4.modalTitle')}
            size="sm"
            alignment="top"
          >
            <div className={styles.modalContent}>
              <p>{t('components.modalV3.test4.content')}</p>
            </div>
          </Modal>
        </div>

        {/* Test 5: Alignment Bottom */}
        <div className={styles.testCard}>
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
            title={t('components.modalV3.test5.modalTitle')}
            size="sm"
            alignment="bottom"
          >
            <div className={styles.modalContent}>
              <p>{t('components.modalV3.test5.content')}</p>
            </div>
          </Modal>
        </div>

        {/* Test 6: Submit on Enter */}
        <div className={styles.testCard}>
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
        </div>

        {/* Test 7: Disable Drag */}
        <div className={styles.testCard}>
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
        </div>

        {/* Test 8: Multi-step Wizard */}
        <div className={styles.testCard}>
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
        </div>
      </div>

      {/* Feature Summary */}
      <div className={styles.featureSummary}>
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
        </ul>
      </div>
    </div>
    </BasePage>
  );
}

export default TestModalV3Page;
