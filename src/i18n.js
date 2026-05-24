import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './public/locales/en/translation.json';
import esTranslations from './public/locales/es/translation.json';
import nlTranslations from './public/locales/nl/translation.json';

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
