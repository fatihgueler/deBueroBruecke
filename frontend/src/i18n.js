import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import de from './locales/de.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import ku from './locales/ku.json';
import uk from './locales/uk.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'de', label: 'Deutsch',      flag: '🇩🇪' },
  { code: 'tr', label: 'Türkçe',       flag: '🇹🇷' },
  { code: 'ar', label: 'العربية',      flag: '🇸🇦' },
  { code: 'ru', label: 'Русский',      flag: '🇷🇺' },
  { code: 'ku', label: 'Kurmancî',     flag: '🏴' },
  { code: 'uk', label: 'Українська',   flag: '🇺🇦' },
];

export const RTL_LANGUAGES = new Set(['ar']);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      tr: { translation: tr },
      ar: { translation: ar },
      ru: { translation: ru },
      ku: { translation: ku },
      uk: { translation: uk },
    },
    fallbackLng: 'de',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export function applyLanguageDirection(lang) {
  const dir = RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}

applyLanguageDirection(i18n.language || 'de');
i18n.on('languageChanged', applyLanguageDirection);

export default i18n;
