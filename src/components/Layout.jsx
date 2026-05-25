import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Phone } from 'lucide-react';
import { navLinks } from '../data/constants';
import { useTranslation } from 'react-i18next';
import CookieBanner from '../components/CookieBanner';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
      {/* Cookie Banner */}
      <CookieBanner />

      {/* Header */}
   <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${
          isScrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - UPDATED: NO BACKGROUND, SAME TEXT STYLE */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">Insurance<span className="text-blue-600">Pro</span></span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                  Save Money on Insurance
                </span>
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
                  {t(link.label)}
                </a>
              ))}
            </nav>

            {/* CTA Buttons + Language Switcher - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="English"
                >
                  <span className="fi fi-gb fis"></span>
                </button>
                <button
                  onClick={() => changeLanguage('es')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                    i18n.language === 'es'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Español"
                >
                  <span className="fi fi-es fis"></span>
                </button>
                <button
                  onClick={() => changeLanguage('nl')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                    i18n.language === 'nl'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Nederlands"
                >
                  <span className="fi fi-nl fis"></span>
                </button>
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{t('contact')}</span>
              </button>
              <button
                onClick={() => navigate('/quote')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t('get_a_quote')}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
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
                    {t(link.label)}
                  </a>
                ))}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  {/* Mobile Language Switcher */}
                  <div className="flex justify-center space-x-2 py-2">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                        i18n.language === 'en'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      aria-label="English"
                    >
                      <span className="fi fi-gb fis"></span>
                    </button>
                    <button
                      onClick={() => changeLanguage('es')}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                        i18n.language === 'es'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      aria-label="Español"
                    >
                      <span className="fi fi-es fis"></span>
                    </button>
                    <button
                      onClick={() => changeLanguage('nl')}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                        i18n.language === 'nl'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      aria-label="Nederlands"
                    >
                      <span className="fi fi-nl fis"></span>
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full flex items-center justify-center space-x-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('contact')}</span>
                  </button>
                  <button
                    onClick={() => navigate('/quote')}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    {t('get_a_quote')}
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

      {/* Footer - UPDATED WITH TAGLINE */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-white" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">
                {t('insurance')}<span className="text-blue-400">{t('pro')}</span>
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                Save Money on Insurance
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">{t('smart_insurance_simple_savings')}</p>
          <div className="space-y-2 mb-6">
            <p className="text-gray-400 text-sm">
              {t('email')}:{' '}
              <a
                href="mailto:Info@insurancepro.es"
                className="text-blue-400 hover:text-white"
              >
                Info@insurancepro.es
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              {t('website')}:{' '}
              <a
                href="https://insurancepro.es"
                className="text-blue-400 hover:text-white"
              >
                https://insurancepro.es
              </a>
            </p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="/faq"
              onClick={(e) => { e.preventDefault(); navigate('/faq'); }}
              className="text-gray-400 hover:text-white text-sm"
            >
              {t('faq')}
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}
              className="text-gray-400 hover:text-white text-sm"
            >
              {t('privacy_policy')}
            </a>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {t('insurancepro_all_rights_reserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
