import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Euro } from 'lucide-react';
import Button from '../components/ui/Button';
import { FeatureCard } from '../components/ui/Card';

// Use the GitHub raw URL directly
const backgroundHeroUrl = 'https://raw.githubusercontent.com/xryicon/insurancepro/main/src/assets/images/main%20background%20hero.jpg';

export default function Home() {
  const { t } = useTranslation();

  // Inline style for the hero background using the URL
  const heroBackgroundStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
                      url(${backgroundHeroUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
  };

  return (
    <>
      <Helmet>
        <title>{t('insurancepro__compare__save_on_insurance_in_spain')}</title>
        <meta
          name="description"
          content={t('compare_insurance_quotes_in_spain')}
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Background Image */}
        <div style={heroBackgroundStyle} className="py-20 px-4 sm:px-6 lg:px-8 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            {t('compare_insurance_quotes_in_spain')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('get_the_best_rates_from_us_in_minutes')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center hero-buttons"
          >
            <Link to="/car-insurance">
              <Button size="large">{t('car_insurance')}</Button>
            </Link>
            <Link to="/home-insurance">
              <Button size="large" variant="outline">
                {t('home_insurance')}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Section - UPDATED WITH ANIMATED CARDS */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('why_choose_us')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={Zap}
                title={t('fast__easy')}
                description={t('compare_quotes_in_just_a_few_clicks')}
                color="blue"
                delay={0}
              />

              <FeatureCard
                icon={ShieldCheck}
                title={t('trusted_providers')}
                description={t('only_the_best_insurance_companies_in_spain')}
                color="blue"
                delay={0.2}
              />

              <FeatureCard
                icon={Euro}
                title={t('save_money')}
                description={t('save_up_to_40_on_your_premiums')}
                color="green"
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
