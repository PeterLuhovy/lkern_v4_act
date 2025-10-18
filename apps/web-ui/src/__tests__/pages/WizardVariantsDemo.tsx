/*
 * ================================================================
 * FILE: WizardVariantsDemo.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/WizardVariantsDemo.tsx
 * DESCRIPTION: TESTING PAGE - Demo for all 3 wizard modal variants
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18 19:00:00
 *
 * NOTE: This is a TEST-ONLY page. Not for production use.
 *       Production uses simplified Modal with centered variant only.
 * ================================================================
 */

import React, { useState } from 'react';
import { Button, Card, Badge } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { ContactFormWizard } from '../demos/ContactFormWizard';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

// === COMPONENT ===

export const WizardVariantsDemo: React.FC = () => {
  const { t } = useTranslation();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>{t('components.testing.wizardTitle')}</h1>
        <p style={{ color: 'var(--theme-text-muted, #9e9e9e)' }}>
          {t('components.wizard.testPageDescription')}
        </p>
      </div>

      {/* Variant Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Centered Modal */}
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>{t('components.wizard.centeredModal')}</h3>
              <Badge variant="neutral" size="small">600px</Badge>
            </div>
            <p style={{ color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '16px', fontSize: '14px' }}>
              {t('components.wizard.centeredDescription')}
            </p>
            <ul style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '20px', paddingLeft: '20px' }}>
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
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>{t('components.wizard.drawerModal')}</h3>
              <Badge variant="success" size="small">⭐ {t('components.wizard.recommended')}</Badge>
            </div>
            <p style={{ color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '16px', fontSize: '14px' }}>
              {t('components.wizard.drawerDescription')}
            </p>
            <ul style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '20px', paddingLeft: '20px' }}>
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
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>{t('components.wizard.fullscreenModal')}</h3>
              <Badge variant="info" size="small">100%</Badge>
            </div>
            <p style={{ color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '16px', fontSize: '14px' }}>
              {t('components.wizard.fullscreenDescription')}
            </p>
            <ul style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '20px', paddingLeft: '20px' }}>
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
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t('components.wizard.wizardData')} <Badge variant="success">{t('components.wizard.completed')}</Badge>
            </h3>
            <pre style={{
              backgroundColor: 'var(--theme-input-background, #f5f5f5)',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '13px',
              maxHeight: '400px',
            }}>
              {JSON.stringify(completedData, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {/* Info Section */}
      <Card style={{ marginTop: '32px' }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>{t('components.wizard.systemInfo')}</h3>
          <div style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>{t('components.wizard.wizardComponent')}</strong> {t('components.wizard.consists6Steps')}
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>{t('components.wizard.step1')}</li>
              <li>{t('components.wizard.step2')}</li>
              <li>{t('components.wizard.step3')}</li>
              <li>{t('components.wizard.step4')}</li>
              <li>{t('components.wizard.step5')}</li>
              <li>{t('components.wizard.step6')}</li>
            </ol>
            <p style={{ marginBottom: '12px' }}>
              <strong>{t('components.wizard.technologies')}:</strong>
            </p>
            <ul style={{ paddingLeft: '20px' }}>
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
    </div>
  );
};

export default WizardVariantsDemo;
