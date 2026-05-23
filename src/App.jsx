import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import Layout from './components/Layout';


const Home = lazy(() => import('./pages/Home'));
const CarInsurance = lazy(() => import('./pages/CarInsurance'));
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'));

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
