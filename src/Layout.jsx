import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Home, Shield, Menu, X, Phone, Mail, Globe, Heart
} from 'lucide-react';


const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (unchanged) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        {/* ... (keep all header code unchanged) ... */}
      </header>

      {/* Main Content (unchanged) */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer - Hardcoded and Simplified */}
<footer className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Company Info */}
    <div className="text-center mb-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold">Insurance</span>
          <span className="text-xl font-bold text-blue-600">Pro</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Smart Insurance. Simple Savings.
      </p>
    </div>

    {/* Contact Info: ONLY Email and Website */}
    <div className="text-center mb-6">
      <p className="text-gray-400 text-sm">
        Email: <a href="mailto:your@email.com" className="text-blue-400 hover:text-white">your@email.com</a>
      </p>
      <p className="text-gray-400 text-sm">
        Website: <a href="https://yourwebsite.com" className="text-blue-400 hover:text-white">https://yourwebsite.com</a>
      </p>
    </div>

    {/* Resources: ONLY FAQ and Privacy Policy */}
    <div className="text-center mb-6">
      <h3 className="text-lg font-semibold mb-4">Resources</h3>
      <div className="flex justify-center space-x-6">
        <a
          href="/faq"
          onClick={(e) => { e.preventDefault(); navigate('/faq'); }}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          FAQ
        </a>
        <a
          href="/privacy-policy"
          onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Privacy Policy
        </a>
      </div>
    </div>

    {/* Bottom Bar: ONLY Copyright */}
    <div className="border-t border-gray-800 pt-6 text-center">
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} InsurancePro. All rights reserved.
      </p>
    </div>
  </div>
</footer>

export default Layout;
