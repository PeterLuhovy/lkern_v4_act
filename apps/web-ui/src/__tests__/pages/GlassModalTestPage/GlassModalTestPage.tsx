/*
 * ================================================================
 * FILE: GlassModalTestPage.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/GlassModalTestPage/GlassModalTestPage.tsx
 * DESCRIPTION: Testing page for Glassmorphism modal design
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19
 *
 * TESTS:
 *   ✅ Glassmorphism Design - Backdrop blur + gradient background
 *   ✅ Scale Animation - 0.9 → 1.0 zoom effect
 *   ✅ Gradient Text - Purple → blue gradient title
 *   ✅ Glass Inputs - Transparent blur inputs
 * ================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { BasePage, Modal, Button } from '@l-kern/ui-components';
import { useModal } from '@l-kern/config';
import { useTranslation } from '@l-kern/config';
import styles from './GlassModalTestPage.module.css';

export function GlassModalTestPage() {
  const { t } = useTranslation();
  const glassModal = useModal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  // Auto-focus on modal open
  useEffect(() => {
    if (glassModal.isOpen) {
      setTimeout(() => {
        nameRef.current?.focus();
      }, 100);
    }
  }, [glassModal.isOpen]);

  const handleSubmit = () => {
    if (!name || !email) {
      alert(t('components.testing.glassModal.fillAllFields'));
      return;
    }
    console.log('[GlassModal] Submit:', { name, email });
    alert(`${t('components.testing.glassModal.submitted')}: ${name}, ${email}`);
    glassModal.close();
    setName('');
    setEmail('');
  };

  const handleCancel = () => {
    glassModal.close();
    setName('');
    setEmail('');
  };

  return (
    <BasePage>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('components.testing.glassModal.title')}</h1>
          <p className={styles.description}>{t('components.testing.glassModal.description')}</p>
        </div>

        <div className={styles.buttonGrid}>
          <Button onClick={glassModal.open} variant="primary" size="large">
            {t('components.testing.glassModal.openModal')}
          </Button>
        </div>

        <div className={styles.infoBox}>
          <h3>{t('components.testing.glassModal.features.title')}</h3>
          <ul>
            <li>{t('components.testing.glassModal.features.backdropBlur')}</li>
            <li>{t('components.testing.glassModal.features.gradientBackground')}</li>
            <li>{t('components.testing.glassModal.features.scaleAnimation')}</li>
            <li>{t('components.testing.glassModal.features.gradientText')}</li>
            <li>{t('components.testing.glassModal.features.glassInputs')}</li>
            <li>{t('components.testing.glassModal.features.purpleGlow')}</li>
          </ul>
        </div>

        {/* Glassmorphism Modal */}
        <Modal
          modalId="glass-modal-test"
          isOpen={glassModal.isOpen}
          onClose={handleCancel}
          title={t('components.testing.glassModal.modalTitle')}
          size="md"
          className={styles.glassModal}
        >
          <div className={styles.modalBody}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.label}>
                {t('fields.name')}
              </label>
              <input
                ref={nameRef}
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.glassInput}
                placeholder={t('components.testing.glassModal.namePlaceholder')}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="email" className={styles.label}>
                {t('fields.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.glassInput}
                placeholder="user@example.com"
              />
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.buttonSecondary}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={styles.buttonPrimary}
              >
                {t('common.submit')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </BasePage>
  );
}