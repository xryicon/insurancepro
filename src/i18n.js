import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files from /src/
import enTranslations from './en-translation.json';
import esTranslations from './es-translation.json';
import nlTranslations from './nl-translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      nl: { translation: nlTranslations },
    },
    fallbackLng: 'en',
    debug: true, // Enable to see i18n logs in the console
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
