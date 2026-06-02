import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0f1c] py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="p-8 bg-slate-900 border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-6">{t('privacy_policy')}</h1>

          <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-4">{t('cookies')}</h2>
          <p className="text-slate-400 mb-4">{t('privacy_policy_cookies_description')}</p>

          <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-4">{t('data_collection')}</h2>
          <p className="text-slate-400 mb-4">{t('privacy_policy_data_collection_description')}</p>

          <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-4">{t('your_rights')}</h2>
          <p className="text-slate-400 mb-4">{t('privacy_policy_your_rights_description')}</p>
        </Card>
      </div>
    </div>
  );
}