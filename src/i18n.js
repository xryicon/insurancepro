import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files using dynamic imports (for Vite compatibility)
const enTranslations = await import('./public/locales/en/translation.json').then(m => m.default);
const esTranslations = await import('./public/locales/es/translation.json').then(m => m.default);
const nlTranslations = await import('./public/locales/nl/translation.json').then(m => m.default);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      nl: { translation: nlTranslations },
    },
  });

export default i18n;
