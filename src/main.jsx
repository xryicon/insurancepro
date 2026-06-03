import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
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

      if (consent.analytics) {
        console.log('Analytics enabled');
      }

      if (consent.marketing) {
        console.log('Marketing enabled');
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
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <AnalyticsLoader />
        <App />
      </Suspense>
      <ToastContainer position="top-right" autoClose={5000} />
    </HelmetProvider>
  </React.StrictMode>
);