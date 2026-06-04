import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Phone } from 'lucide-react';
import { navLinks } from '../data/constants';
import CookieBanner from '../components/CookieBanner';
import LiveChat from '../components/LiveChat';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white relative overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('/noise.png')]" />
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full" />

      {/* COOKIE BANNER */}
      <CookieBanner />

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0b1220]/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  InsurancePro
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">
                  Compare smarter. Save faster.
                </span>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.path);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center space-x-1 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </button>

              <button
                onClick={() => navigate('/quote')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg"
              >
                Get a quote
              </button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-[#0b1220] border-t border-white/10"
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
                    className="block px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                ))}

                <button
                  onClick={() => navigate('/quote')}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg mt-2"
                >
                  Get a quote
                </button>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full px-4 py-3 text-xs text-gray-400 hover:text-white"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-16 relative z-10">
        <Outlet />
      </main>

      {/* FOOTER */}
     <footer className="relative z-20 bg-[#0b1220] border-t border-white/10 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">

          <div className="flex items-center justify-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-lg font-semibold">
              InsurancePro
            </span>
          </div>

          <p className="text-gray-500 text-sm">
            Smart insurance comparison platform
          </p>

          <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
            <button onClick={() => navigate('/faq')} className="hover:text-white">
              FAQ
            </button>
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-white">
              Privacy Policy
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-xs text-gray-600 hover:text-white"
            >
              Admin login
            </button>
          </div>

          <div className="border-t border-white/10 mt-6 pt-6 text-xs text-gray-600">
            © {new Date().getFullYear()} InsurancePro
          </div>
        </div>
      </footer>

      {/* =========================
          FLOATING UI LAYER (FIXED)
      ========================= */}

      {/* LIVE CHAT (SAFE ZONE: bottom-left) */}
      <div className="fixed bottom-6 left-6 z-50">
        <LiveChat />
      </div>

      {/* COOKIE BUTTON (bottom-right safe) */}
      <button
        onClick={() => document.dispatchEvent(new Event('open-cookie'))}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center"
      >
        🍪
      </button>
    </div>
  );
};

export default Layout;