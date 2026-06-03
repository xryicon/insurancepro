import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// ================= LAZY PAGES =================
const Home = lazy(() => import('./pages/Home'));
const CarInsurance = lazy(() => import('./pages/CarInsurance'));
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const InsuranceSelection = lazy(() => import('./pages/InsuranceSelection'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const FAQ = lazy(() => import('./pages/FAQ'));

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminChat = lazy(() => import('./pages/AdminChat'));

// ✅ NEW HUB PAGE
const AdminHub = lazy(() => import('./pages/AdminHub'));

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
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* MAIN LAYOUT ROUTES */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="quote" element={<InsuranceSelection />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="car-insurance" element={<CarInsurance />} />
            <Route path="home-insurance" element={<HomeInsurance />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />

            {/* ADMIN LOGIN */}
            <Route path="admin/login" element={<AdminLogin />} />

            {/* ✅ ADMIN HUB (NEW DEFAULT AFTER LOGIN) */}
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminHub />
                </ProtectedRoute>
              }
            />

            {/* LEADS DASHBOARD */}
            <Route
              path="admin/leads"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* CHAT */}
            <Route
              path="admin/chat"
              element={
                <ProtectedRoute>
                  <AdminChat />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;