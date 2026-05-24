import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';

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
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <AboutUs />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="quote"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <InsuranceSelection />
              </Suspense>
            }
          />
          <Route
            path="car-insurance"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <CarInsurance />
              </Suspense>
            }
          />
          <Route
            path="home-insurance"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <HomeInsurance />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
