import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import Layout from './components/Layout';
import i18n from './i18n';

// ================= LAZY PAGES =================
const Home = lazy(() => import('./pages/Home'));
const CarInsurance = lazy(() => import('./pages/CarInsurance'));
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const InsuranceSelection = lazy(() => import('./pages/InsuranceSelection'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const FAQ = lazy(() => import('./pages/FAQ'));  // Add this

// ================= LOADING UI =================
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
    <div className="animate-pulse text-slate-400 text-sm">
      Loading...
    </div>
  </div>
);

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="quote" element={<InsuranceSelection />} />
              <Route path="faq" element={<FAQ />} />  {/* Changed from /faq to faq */}
              <Route path="car-insurance" element={<CarInsurance />} />
              <Route path="home-insurance" element={<HomeInsurance />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;