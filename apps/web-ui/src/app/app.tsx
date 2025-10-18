import { Route, Routes, Link } from 'react-router-dom';
import { useTranslation, useTheme, PORTS, API_ENDPOINTS, COLORS } from '@l-kern/config';
import { Button, Input, FormField, Select } from '@l-kern/ui-components';

export function App() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 L-KERN v4 - Component Test</h1>

      {/* Theme Test */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🎨 Theme Test</h2>
        <p>Current theme: <strong>{theme}</strong></p>
        <button onClick={toggleTheme}>Toggle Theme (Light/Dark)</button>
      </section>

      {/* UI Components Test */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🎨 UI Components Test (@l-kern/ui-components)</h2>

        <h3>Button Variants:</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
        </div>

        <h3>Button Sizes:</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>

        <h3>Input - Standalone:</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Input placeholder="Basic input..." />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
        </div>

        <h3>FormField - Complete Form Structure:</h3>
        <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

          <FormField label="Username" required htmlFor="username" fullWidth>
            <Input id="username" placeholder="Enter username" fullWidth />
          </FormField>

          <FormField
            label="Email"
            required
            htmlFor="email"
            helperText="We'll never share your email"
            fullWidth
          >
            <Input id="email" type="email" placeholder="Enter email" fullWidth />
          </FormField>

          <FormField
            label="Password"
            required
            htmlFor="password"
            error="Password must be at least 8 characters"
            fullWidth
          >
            <Input id="password" type="password" placeholder="Enter password" fullWidth />
          </FormField>

          <FormField label="Country" required htmlFor="country" helperText="Select your country" fullWidth>
            <Select
              id="country"
              placeholder="Choose a country"
              options={[
                { value: 'sk', label: 'Slovakia' },
                { value: 'cz', label: 'Czech Republic' },
                { value: 'pl', label: 'Poland' },
                { value: 'hu', label: 'Hungary' },
                { value: 'at', label: 'Austria' }
              ]}
              fullWidth
            />
          </FormField>

          <FormField label="Bio" htmlFor="bio" helperText="Optional" fullWidth>
            <textarea
              id="bio"
              placeholder="Tell us about yourself..."
            />
          </FormField>

          <Button variant="primary" fullWidth>Submit Form</Button>
        </div>
      </section>

      {/* Translation Test */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🌍 Translation Test</h2>
        <p>Current language: <strong>{language}</strong></p>
        <p>{t('common.welcome')}: <strong>{t('dashboard.welcome')}</strong></p>
        <div>
          <button onClick={() => setLanguage('sk')} disabled={language === 'sk'}>
            Slovenčina
          </button>
          {' '}
          <button onClick={() => setLanguage('en')} disabled={language === 'en'}>
            English
          </button>
        </div>
      </section>

      {/* Constants Test */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🔧 Constants Test</h2>
        <h3>Ports:</h3>
        <ul>
          <li>WEB_UI: {PORTS.WEB_UI}</li>
          <li>CONTACTS: {PORTS.CONTACTS}</li>
        </ul>
        <h3>Design Tokens:</h3>
        <ul>
          <li>Primary Color: {COLORS.brand.primary}</li>
          <li>Success Color: {COLORS.status.success}</li>
        </ul>
      </section>

      {/* Navigation */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>📋 Navigation</h2>
        <ul>
          <li><Link to="/">{t('common.welcome')}</Link></li>
          <li><Link to="/page-2">Page 2</Link></li>
        </ul>
      </section>

      <Routes>
        <Route path="/" element={<div><h3>✅ Home Page</h3></div>} />
        <Route path="/page-2" element={<div><h3>✅ Page 2</h3></div>} />
      </Routes>
    </div>
  );
}

export default App;
