import type { LANGUAGE_MAP } from '.';

export type TLanguages = keyof typeof LANGUAGE_MAP;

export type THeadoutLanguages = Uppercase<TLanguages>;

export type TLocales = (typeof LANGUAGE_MAP)[TLanguages]['locale'];

export type TSupportedLanguageCode = {
  [K in TLanguages]: (typeof LANGUAGE_MAP)[K]['supported'] extends true
    ? (typeof LANGUAGE_MAP)[K]['code']
    : never;
}[TLanguages];

export type TUnsupportedLanguageCode = {
  [K in TLanguages]: (typeof LANGUAGE_MAP)[K]['supported'] extends false
    ? (typeof LANGUAGE_MAP)[K]['code']
    : never;
}[TLanguages];
