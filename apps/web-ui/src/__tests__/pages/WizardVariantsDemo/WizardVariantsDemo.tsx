/*
 * ================================================================
 * FILE: WizardVariantsDemo.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/WizardVariantsDemo/WizardVariantsDemo.tsx
 * DESCRIPTION: TESTING PAGE - Demo for all 3 wizard modal variants
 * VERSION: v2.1.0
 * UPDATED: 2025-10-18 21:30:00
 *
 * NOTE: This is a TEST-ONLY page. Not for production use.
 *       Production uses simplified Modal with centered variant only.
 * ================================================================
 */

import React, { useState } from 'react';
import { Button, Card, Badge, BasePage } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { ContactFormWizard } from '../../demos/ContactFormWizard';
import styles from './WizardVariantsDemo.module.css';

// === COMPONENT ===

export const WizardVariantsDemo: React.FC = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<'centered' | 'drawer' | 'fullscreen'>('centered');
  const [completedData, setCompletedData] = useState<any>(null);

  const handleOpen = (selectedVariant: 'centered' | 'drawer' | 'fullscreen') => {
    setVariant(selectedVariant);
    setIsOpen(true);
    setCompletedData(null);
  };

  const handleComplete = (data: any) => {
    console.log('Wizard completed with data:', data);
    setCompletedData(data);
    setIsOpen(false);
  };

  return (
    <BasePage className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('components.testing.wizardTitle')}</h1>
        <p className={styles.description}>
          {t('components.wizard.testPageDescription')}
        </p>
      </div>

      {/* Variant Cards */}
      <div className={styles.variantGrid}>
        {/* Centered Modal */}
        <Card>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('components.wizard.centeredModal')}</h3>
              <Badge variant="neutral" size="small">600px</Badge>
            </div>
            <p className={styles.cardDescription}>
              {t('components.wizard.centeredDescription')}
            </p>
            <ul className={styles.featureList}>
              <li>{t('components.wizard.width')}: 600px (md)</li>
              <li>{t('components.wizard.position')}: {t('components.wizard.center')}</li>
              <li>{t('components.wizard.animation')}: {t('components.wizard.scaleIn')}</li>
            </ul>
            <Button variant="primary" onClick={() => handleOpen('centered')} fullWidth>
              {t('components.wizard.openCentered')}
            </Button>
          </div>
        </Card>

        {/* Drawer Modal */}
        <Card>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('components.wizard.drawerModal')}</h3>
              <Badge variant="success" size="small">⭐ {t('components.wizard.recommended')}</Badge>
            </div>
            <p className={styles.cardDescription}>
              {t('components.wizard.drawerDescription')}
            </p>
            <ul className={styles.featureList}>
              <li>{t('components.wizard.width')}: 500px</li>
              <li>{t('components.wizard.position')}: {t('components.wizard.rightSide')}</li>
              <li>{t('components.wizard.animation')}: {t('components.wizard.slideIn')}</li>
            </ul>
            <Button variant="primary" onClick={() => handleOpen('drawer')} fullWidth>
              {t('components.wizard.openDrawer')}
            </Button>
          </div>
        </Card>

        {/* Fullscreen Modal */}
        <Card>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('components.wizard.fullscreenModal')}</h3>
              <Badge variant="info" size="small">100%</Badge>
            </div>
            <p className={styles.cardDescription}>
              {t('components.wizard.fullscreenDescription')}
            </p>
            <ul className={styles.featureList}>
              <li>{t('components.wizard.width')}: 100%</li>
              <li>{t('components.wizard.position')}: {t('components.wizard.fullViewport')}</li>
              <li>{t('components.wizard.animation')}: {t('components.wizard.fadeIn')}</li>
            </ul>
            <Button variant="primary" onClick={() => handleOpen('fullscreen')} fullWidth>
              {t('components.wizard.openFullscreen')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Completed Data Display */}
      {completedData && (
        <Card>
          <div className={styles.completedDataCard}>
            <h3 className={styles.completedDataHeader}>
              {t('components.wizard.wizardData')} <Badge variant="success">{t('components.wizard.completed')}</Badge>
            </h3>
            <pre className={styles.dataDisplay}>
              {JSON.stringify(completedData, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {/* Info Section */}
      <Card className={styles.infoCard}>
        <div className={styles.infoContent}>
          <h3 className={styles.infoTitle}>{t('components.wizard.systemInfo')}</h3>
          <div className={styles.infoText}>
            <p className={styles.infoParagraph}>
              <strong>{t('components.wizard.wizardComponent')}</strong> {t('components.wizard.consists6Steps')}
            </p>
            <ol className={styles.infoList}>
              <li>{t('components.wizard.step1')}</li>
              <li>{t('components.wizard.step2')}</li>
              <li>{t('components.wizard.step3')}</li>
              <li>{t('components.wizard.step4')}</li>
              <li>{t('components.wizard.step5')}</li>
              <li>{t('components.wizard.step6')}</li>
            </ol>
            <p className={styles.infoParagraph}>
              <strong>{t('components.wizard.technologies')}:</strong>
            </p>
            <ul className={styles.infoList}>
              <li><code>useModalWizard</code> hook - {t('components.wizard.tech1')}</li>
              <li><code>Modal</code> {t('components.wizard.component')} - {t('components.wizard.tech2')}</li>
              <li><code>WizardProgress</code> - {t('components.wizard.tech3')}</li>
              <li><code>WizardNavigation</code> - {t('components.wizard.tech4')}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* ContactFormWizard */}
      <ContactFormWizard
        variant={variant}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComplete={handleComplete}
      />
    </BasePage>
  );
};

export default WizardVariantsDemo;
