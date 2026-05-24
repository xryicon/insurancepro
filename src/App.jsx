import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout'; // Updated to point to the correct Layout file

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const CarInsurance = lazy(() => import('./pages/CarInsurance'));
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const InsuranceSelection = lazy(() => import('./pages/InsuranceSelection'));
const Contact = lazy(() => import('./pages/Contact')); // Added Contact page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home Page */}
          <Route
            index
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <Home />
              </Suspense>
            }
          />

          {/* About Us Page */}
          <Route
            path="about"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <AboutUs />
              </Suspense>
            }
          />

          {/* Contact Page */}
          <Route
            path="contact"
            element={
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <Contact />
              </Suspense>
            }
          />
