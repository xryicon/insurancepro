import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dynamically import translation files (required for Vite)
const loadTranslations = async () => {
  try {
    const enTranslations = await import('../public/locales/en/translation.json').then((m) => m.default);
    const esTranslations = await import('../public/locales/es/translation.json').then((m) => m.default);
    const nlTranslations = await import('../public/locales/nl/translation.json').then((m) => m.default);

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
        debug: true, // Logs i18n events to the console for debugging
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        detection: {
          order: ['navigator', 'localStorage', 'htmlTag'],
          caches: ['localStorage'],
        },
      });
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

loadTranslations();

export default i18n;
