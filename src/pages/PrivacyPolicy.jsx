import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy_policy')}</h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">{t('cookies')}</h2>
          <p className="text-gray-600 mb-4">{t('privacy_policy_cookies_description')}</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">{t('data_collection')}</h2>
          <p className="text-gray-600 mb-4">{t('privacy_policy_data_collection_description')}</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">{t('your_rights')}</h2>
          <p className="text-gray-600 mb-4">{t('privacy_policy_your_rights_description')}</p>
        </div>
      </div>
    </div>
  );
}
