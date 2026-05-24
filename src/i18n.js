import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'Compare Insurance Quotes in Spain': 'Compare Insurance Quotes in Spain',
        'Get the best rates from top providers in minutes.': 'Get the best rates from top providers in minutes.',
        'Car Insurance': 'Car Insurance',
        'Home Insurance': 'Home Insurance',
        'Why Choose Us?': 'Why Choose Us?',
        'Fast & Easy': 'Fast & Easy',
        'Compare quotes in just a few clicks.': 'Compare quotes in just a few clicks.',
        'Trusted Providers': 'Trusted Providers',
        'Only the best insurance companies in Spain.': 'Only the best insurance companies in Spain.',
        'Save Money': 'Save Money',
        'Save up to 40% on your premiums.': 'Save up to 40% on your premiums.',
      },
    },
    es: {
      translation: {
        'Compare Insurance Quotes in Spain': 'Comparar Seguros en España',
        'Get the best rates from top providers in minutes.': 'Obtenga las mejores tarifas de los principales proveedores en minutos.',
        'Car Insurance': 'Seguro de Coche',
        'Home Insurance': 'Seguro de Hogar',
        'Why Choose Us?': '¿Por qué elegirnos?',
        'Fast & Easy': 'Rápido y Fácil',
        'Compare quotes in just a few clicks.': 'Compare cotizaciones en solo unos clics.',
        'Trusted Providers': 'Proveedores de Confianza',
        'Only the best insurance companies in Spain.': 'Solo las mejores compañías de seguros en España.',
        'Save Money': 'Ahorre Dinero',
        'Save up to 40% on your premiums.': 'Ahorre hasta un 40% en sus primas.',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

