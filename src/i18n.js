import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dynamic imports for JSON files (Vite compatibility)
let enTranslations, esTranslations, nlTranslations;

async function loadTranslations() {
  enTranslations = (await import('./public/locales/en/translation.json')).default;
  esTranslations = (await import('./public/locales/es/translation.json')).default;
  nlTranslations = (await import('./public/locales/nl/translation.json')).default;

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
}

loadTranslations();
export default i18n;
