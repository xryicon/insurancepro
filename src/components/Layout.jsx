import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Home, Shield, Menu, X, Phone, Mail, Globe, Heart
} from 'lucide-react';
import { navLinks, socialLinks } from '../data/constants';

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
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Insurance</span>
                <span className="text-xl font-bold text-blue-600">Pro</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.path);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => navigate('/contact')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4 inline mr-1" />
                Contact
              </button>
              <button
                onClick={() => navigate('/car-insurance')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get a Quote
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.path);
                    }}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors text-left"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact
                  </button>
                  <button
                    onClick={() => navigate('/car-insurance')}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    Get a Quote
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>
{/* Footer - Simplified */}
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        {/* Logo and Tagline */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="w-6 h-6 text-white" />
          <span className="text-xl font-bold">Insurance<span className="text-blue-600">Pro</span></span>
        </div>
        <p className="text-gray-400 text-sm mb-6">Smart Insurance. Simple Savings.</p>

        {/* Email and Website ONLY */}
        <div className="space-y-2 mb-6">
          <p className="text-gray-400 text-sm">
            Email: <a href="mailto:your@email.com" className="text-blue-400 hover:text-white">your@email.com</a>
          </p>
          <p className="text-gray-400 text-sm">
            Website: <a href="https://yourwebsite.com" className="text-blue-400 hover:text-white">https://yourwebsite.com</a>
          </p>
        </div>

        {/* Resources: ONLY FAQ and Privacy Policy */}
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="/faq"
            onClick={(e) => { e.preventDefault(); navigate('/faq'); }}
            className="text-gray-400 hover:text-white text-sm"
          >
            FAQ
          </a>
          <a
            href="/privacy-policy"
            onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Privacy Policy
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} InsurancePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Layout;
  
