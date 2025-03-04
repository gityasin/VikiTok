import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../constants';

// Import translations
import en from './en';
import tr from './tr';

// Create i18n instance
const i18n = new I18n({
  en,
  tr,
});

// Set the locale
const setLocale = (language: Language) => {
  i18n.locale = language;
};

// Get the device locale
const getDeviceLocale = (): Language => {
  const locale = Localization.locale.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(locale as Language) 
    ? (locale as Language) 
    : DEFAULT_LANGUAGE;
};

// Set the default locale
setLocale(getDeviceLocale());

// Enable fallbacks
i18n.enableFallback = true;
i18n.defaultLocale = DEFAULT_LANGUAGE;

export { i18n, setLocale, getDeviceLocale }; 