import { Route, Routes, Link } from 'react-router-dom';
import { useTranslation, useTheme, PORTS, API_ENDPOINTS, COLORS } from '@l-kern/config';

export function App() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 L-KERN v4 - @l-kern/config Test</h1>

      {/* Theme Test */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🎨 Theme Test</h2>
        <p>Current theme: <strong>{theme}</strong></p>
        <button onClick={toggleTheme}>Toggle Theme (Light/Dark)</button>
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
        <div style={{ marginTop: '10px' }}>
          <p>{t('common.save')} | {t('common.cancel')} | {t('common.delete')}</p>
        </div>
      </section>

      {/* Constants Test */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🔧 Constants Test</h2>
        <h3>Ports:</h3>
        <ul>
          <li>WEB_UI: {PORTS.WEB_UI}</li>
          <li>CONTACTS: {PORTS.CONTACTS}</li>
          <li>ORDERS: {PORTS.ORDERS}</li>
        </ul>
        <h3>API Endpoints:</h3>
        <ul>
          <li>CONTACTS: {API_ENDPOINTS.CONTACTS}</li>
          <li>ORDERS: {API_ENDPOINTS.ORDERS}</li>
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
