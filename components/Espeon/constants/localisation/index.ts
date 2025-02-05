import type { TSupportedLanguageCode, TUnsupportedLanguageCode } from './types';

export const LANGUAGE_MAP = {
  en: {
    displayName: 'English',
    locale: 'en-us',
    code: 'en',
    translatedName: 'English',
    supported: true,
  },
  it: {
    displayName: 'Italiano',
    locale: 'it-it',
    code: 'it',
    translatedName: 'Italian',
    supported: true,
  },
  es: {
    displayName: 'Español',
    locale: 'es-es',
    code: 'es',
    translatedName: 'Spanish',
    supported: true,
  },
  fr: {
    displayName: 'Français',
    locale: 'fr-fr',
    code: 'fr',
    translatedName: 'French',
    supported: true,
  },
  de: {
    displayName: 'Deutsch',
    locale: 'de-de',
    code: 'de',
    translatedName: 'German',
    supported: true,
  },
  nl: {
    displayName: 'Nederlands',
    locale: 'nl-nl',
    code: 'nl',
    translatedName: 'Dutch',
    supported: true,
  },
  pt: {
    displayName: 'Português',
    locale: 'pt-pt',
    code: 'pt',
    translatedName: 'Portuguese',
    supported: true,
  },
  id: {
    displayName: 'Indonesian',
    locale: 'id-id',
    code: 'id',
    translatedName: 'Indonesian',
    supported: false,
  },
  pl: {
    displayName: 'Polski',
    locale: 'pl-pl',
    code: 'pl',
    translatedName: 'Polish',
    supported: true,
  },
  ar: {
    displayName: 'Arabic',
    locale: 'ar-ae',
    code: 'ar',
    translatedName: 'Arabic',
    supported: false,
  },
  ru: {
    displayName: 'Русский',
    locale: 'ru-ru',
    code: 'ru',
    translatedName: 'Russian',
    supported: true,
  },
  da: {
    displayName: 'Dansk',
    locale: 'da-da',
    code: 'da',
    translatedName: 'Danish',
    supported: true,
  },
  no: {
    displayName: 'Norsk',
    locale: 'no-nb',
    code: 'no-nb',
    translatedName: 'Norwegian',
    supported: true,
  },
  ro: {
    displayName: 'Română',
    locale: 'ro-ro',
    code: 'ro',
    translatedName: 'Romanian',
    supported: true,
  },
  sv: {
    displayName: 'Svenska',
    locale: 'sv-se',
    code: 'sv',
    translatedName: 'Swedish',
    supported: true,
  },
  tr: {
    displayName: 'Türkçe',
    locale: 'tr-tr',
    code: 'tr',
    translatedName: 'Turkish',
    supported: true,
  },
} as const;

export const SUPPORTED_LANGUAGES = Object.values(LANGUAGE_MAP).reduce(
  (acc, obj) => {
    if (obj.supported) {
      acc.push(obj.code);
    }
    return acc;
  },
  [] as Array<TSupportedLanguageCode>
);

export const UNSUPPORTED_LANGUAGES = Object.values(LANGUAGE_MAP).reduce(
  (acc, obj) => {
    if (!obj.supported) {
      acc.push(obj.code);
    }
    return acc;
  },
  [] as Array<TUnsupportedLanguageCode>
);

export const DEFAULT_LANGUAGE = 'en';
