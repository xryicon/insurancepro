import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from './components/ui/Button';

export default function Layout() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* LEFT: Logo + Home/About Us */}
          <div className="flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-primary"
            >
              InsurancePro
            </motion.div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                About Us
              </Link>
            </nav>
          </div>

          {/* RIGHT: Get a Quote + Language */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate('/quote')}
            >
              Get a Quote
            </Button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  i18n.language === 'en'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  i18n.language === 'es'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} InsurancePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
