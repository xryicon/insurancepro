import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Cookies from 'js-cookie';

function AnalyticsLoader() {
  useEffect(() => {
    const raw = Cookies.get('cookieConsent');

    if (!raw) return;

    try {
      const consent = JSON.parse(raw);

      // ONLY load analytics if user allowed it
      if (consent.analytics) {
        console.log('Analytics enabled');

        // 🔥 Example: Google Analytics (replace with your ID)
        // const script = document.createElement('script');
        // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
        // script.async = true;
        // document.head.appendChild(script);
      }

      // MARKETING EXAMPLE
      if (consent.marketing) {
        console.log('Marketing enabled');
        // load facebook pixel etc here
      }
    } catch (e) {
      console.log('Invalid consent cookie');
    }
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
          <AnalyticsLoader />
          <App />
        </Suspense>
        <ToastContainer position="top-right" autoClose={5000} />
      </I18nextProvider>
    </HelmetProvider>
  </React.StrictMode>
);