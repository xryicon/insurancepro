import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
      <ToastContainer position="top-right" autoClose={5000} />
    </HelmetProvider>
  </React.StrictMode>
);
