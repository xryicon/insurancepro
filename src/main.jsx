import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Import i18n and wait for translations to load
import('./i18n').then(({ default: i18n }) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <App />
          </Suspense>
          <ToastContainer position="top-right" autoClose={5000} />
        </I18nextProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
});
