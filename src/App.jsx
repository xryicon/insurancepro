import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const CarInsurance = lazy(() => import('./pages/CarInsurance'));
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const InsuranceSelection = lazy(() => import('./pages/InsuranceSelection'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="about"
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <AboutUs />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="contact"
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <Contact />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="quote"
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <InsuranceSelection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="car-insurance"
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <CarInsurance />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="home-insurance"
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                  <HomeInsurance />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
