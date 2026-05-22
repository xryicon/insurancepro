import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CarInsurance from './pages/CarInsurance';
import HomeInsurance from './pages/HomeInsurance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="car-insurance" element={<CarInsurance />} />
          <Route path="home-insurance" element={<HomeInsurance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
