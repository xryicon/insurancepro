import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import Layout from './components/Layout';
import i18n from './i18n';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const CarInsurance = lazy(() => import('./pages/CarInsurance'));
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const InsuranceSelection = lazy(() => import('./pages/InsuranceSelection'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <AboutUs />
                </Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="quote"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <InsuranceSelection />
                </Suspense>
              }
            />
            <Route
              path="car-insurance"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <CarInsurance />
                </Suspense>
              }
            />
            <Route
              path="home-insurance"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <HomeInsurance />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
