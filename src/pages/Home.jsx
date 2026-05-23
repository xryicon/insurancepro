import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>InsurancePro - Compare & Save on Insurance in Spain</title>
        <meta
          name="description"
          content="Compare car and home insurance from top providers and save up to 40%."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            {t('Compare Insurance Quotes in Spain')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('Get the best rates from top providers in minutes.')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/car-insurance">
              <Button size="large">{t('Car Insurance')}</Button>
            </Link>
            <Link to="/home-insurance">
              <Button size="large" variant="outline">
                {t('Home Insurance')}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('Why Choose Us?')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('Fast & Easy')}
                  </h3>
                  <p className="text-gray-600">
                    {t('Compare quotes in just a few clicks.')}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('Trusted Providers')}
                  </h3>
                  <p className="text-gray-600">
                    {t('Only the best insurance companies in Spain.')}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('Save Money')}
                  </h3>
                  <p className="text-gray-600">
                    {t('Save up to 40% on your premiums.')}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
