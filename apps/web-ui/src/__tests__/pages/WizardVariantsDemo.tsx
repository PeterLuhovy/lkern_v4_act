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
import { ContactFormWizard } from '../demos/ContactFormWizard';

// === COMPONENT ===

export const WizardVariantsDemo: React.FC = () => {
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
        <h1 style={{ marginBottom: '8px' }}>Modal Wizard - Variant Testing</h1>
        <p style={{ color: 'var(--theme-text-muted, #9e9e9e)' }}>
          Testovacia stránka pre 3 varianty wizard modalov: Centered, Drawer a Fullscreen.
        </p>
      </div>

      {/* Variant Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Centered Modal */}
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Centered Modal</h3>
              <Badge variant="neutral" size="small">600px</Badge>
            </div>
            <p style={{ color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '16px', fontSize: '14px' }}>
              Klasický modal uprostred obrazovky s tmavým pozadím. Vhodný pre krátke formuláre.
            </p>
            <ul style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Šírka: 600px (md)</li>
              <li>Pozícia: Center</li>
              <li>Animácia: Scale in</li>
            </ul>
            <Button variant="primary" onClick={() => handleOpen('centered')} fullWidth>
              Otvoriť Centered Modal
            </Button>
          </div>
        </Card>

        {/* Drawer Modal */}
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Drawer Modal</h3>
              <Badge variant="success" size="small">⭐ ODPORÚČANÝ</Badge>
            </div>
            <p style={{ color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '16px', fontSize: '14px' }}>
              Bočný panel vyjazdujúci sprava. Zachováva kontext pôvodnej stránky. Ideálny pre kontakt forms.
            </p>
            <ul style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Šírka: 500px</li>
              <li>Pozícia: Right side</li>
              <li>Animácia: Slide in</li>
            </ul>
            <Button variant="primary" onClick={() => handleOpen('drawer')} fullWidth>
              Otvoriť Drawer Modal
            </Button>
          </div>
        </Card>

        {/* Fullscreen Modal */}
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Fullscreen Modal</h3>
              <Badge variant="info" size="small">100%</Badge>
            </div>
            <p style={{ color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '16px', fontSize: '14px' }}>
              Celá obrazovka bez distrakcií. Vhodný pre veľmi dlhé formuláre alebo mobilné zariadenia.
            </p>
            <ul style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Šírka: 100%</li>
              <li>Pozícia: Full viewport</li>
              <li>Animácia: Fade in</li>
            </ul>
            <Button variant="primary" onClick={() => handleOpen('fullscreen')} fullWidth>
              Otvoriť Fullscreen Modal
            </Button>
          </div>
        </Card>
      </div>

      {/* Completed Data Display */}
      {completedData && (
        <Card>
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Údaje z wizard <Badge variant="success">Dokončené</Badge>
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
          <h3 style={{ marginBottom: '16px' }}>Informácie o wizard systéme</h3>
          <div style={{ fontSize: '14px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Wizard komponent</strong> pozostáva z 6 krokov:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Typ kontaktu (Firma / Fyzická osoba)</li>
              <li>Základné údaje (Názov, IČO, DIČ / Meno, Priezvisko)</li>
              <li>Kontaktné údaje (Email, Telefón, Web)</li>
              <li>Adresa (Ulica, Mesto, PSČ, Krajina)</li>
              <li>Bankové údaje (IBAN, SWIFT, Názov banky)</li>
              <li>Zhrnutie (Prehľad všetkých údajov + poznámky)</li>
            </ol>
            <p style={{ marginBottom: '12px' }}>
              <strong>Technológie:</strong>
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><code>useModalWizard</code> hook - Centralizovaná správa wizard stavu</li>
              <li><code>Modal</code> komponent - 3 varianty (centered, drawer, fullscreen)</li>
              <li><code>WizardProgress</code> - Dots/Bar/Numbers progress indicator</li>
              <li><code>WizardNavigation</code> - Späť/Ďalej/Uložiť tlačidlá</li>
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
