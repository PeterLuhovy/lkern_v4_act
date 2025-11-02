/*
 * ================================================================
 * FILE: ToastTestPage.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/ToastTestPage/ToastTestPage.tsx
 * DESCRIPTION: Visual testing UI for Toast notifications (toastManager)
 * VERSION: v1.0.0
 * UPDATED: 2025-11-02 11:00:00
 * ================================================================
 */

import React from 'react';
import { BasePage, Button, Card } from '@l-kern/ui-components';
import { useTranslation, toastManager } from '@l-kern/config';
import styles from './ToastTestPage.module.css';

export const ToastTestPage = () => {
  const { t } = useTranslation();

  return (
    <BasePage>
      <div className={styles.container}>
        <h1>{t('components.testing.toastTest.title')}</h1>

        <Card>
          <h2>{t('components.testing.toastTest.variants')}</h2>
          <div className={styles.buttonGroup}>
            <Button
              variant="success"
              onClick={() =>
                toastManager.show(
                  t('components.testing.toastTest.successMessage'),
                  { type: 'success' }
                )
              }
            >
              {t('components.testing.toastTest.showSuccess')}
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                toastManager.show(
                  t('components.testing.toastTest.errorMessage'),
                  { type: 'error' }
                )
              }
            >
              {t('components.testing.toastTest.showError')}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toastManager.show(
                  t('components.testing.toastTest.warningMessage'),
                  { type: 'warning' }
                )
              }
            >
              {t('components.testing.toastTest.showWarning')}
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                toastManager.show(
                  t('components.testing.toastTest.infoMessage'),
                  { type: 'info' }
                )
              }
            >
              {t('components.testing.toastTest.showInfo')}
            </Button>
          </div>
        </Card>

        <Card>
          <h2>{t('components.testing.toastTest.queue')}</h2>
          <Button
            onClick={() => {
              toastManager.show('Toast 1', { type: 'success' });
              toastManager.show('Toast 2', { type: 'info' });
              toastManager.show('Toast 3', { type: 'warning' });
              toastManager.show('Toast 4', { type: 'error' });
              toastManager.show('Toast 5', { type: 'success' });
              toastManager.show('Toast 6 - should queue', { type: 'info' });
            }}
          >
            {t('components.testing.toastTest.showMultiple')}
          </Button>
        </Card>
      </div>
    </BasePage>
  );
};
