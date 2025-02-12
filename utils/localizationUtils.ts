import defaultsDeep from 'lodash/defaultsDeep';
import { LanguagesUnion } from 'const/index';
import EN from 'const/localization/en';

const dayJsLocales = {
  de: () => import(`dayjs/locale/de`),
  nl: () => import(`dayjs/locale/nl`),
  es: () => import(`dayjs/locale/es`),
  pt: () => import(`dayjs/locale/pt`),
  fr: () => import(`dayjs/locale/fr`),
  it: () => import(`dayjs/locale/it`),
  ko: () => import(`dayjs/locale/ko`),
  tw: () => import('dayjs/locale/zh-tw'),
  cn: () => import('dayjs/locale/zh-cn'),
  ar: () => import('dayjs/locale/ar'),
  id: () => import('dayjs/locale/id'),
  pl: () => import('dayjs/locale/pl'),
  ru: () => import('dayjs/locale/ru'),
  da: () => import('dayjs/locale/da'),
  no: () => import('dayjs/locale/nb'),
  sv: () => import('dayjs/locale/sv'),
  tr: () => import('dayjs/locale/tr'),
  ro: () => import('dayjs/locale/ro'),
};

const langStrings: Record<LanguagesUnion, object> = {
  en: EN,
  fr: () => import(`const/localization/fr`),
  it: () => import(`const/localization/it`),
  es: () => import(`const/localization/es`),
  de: () => import(`const/localization/de`),
  pt: () => import(`const/localization/pt`),
  nl: () => import(`const/localization/nl`),
  ja: () => import(`const/localization/ja`),
  ko: () => import(`const/localization/ko`),
  cn: () => import(`const/localization/cn`),
  tw: () => import(`const/localization/tw`),
  ar: () => import(`const/localization/ar`),
  id: () => import('const/localization/id'),
  pl: () => import('const/localization/pl'),
  ru: () => import('const/localization/ru'),
  da: () => import('const/localization/da'),
  no: () => import('const/localization/no'),
  sv: () => import('const/localization/sv'),
  tr: () => import('const/localization/tr'),
  ro: () => import('const/localization/ro'),
};

// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
export const initDayJSLocale = (lang: string) => dayJsLocales[lang]();

export const getLocalizationLabels = async ({
  lang,
}: {
  lang: string;
}): Promise<Record<any, any>> => {
  if (lang === 'en' || !(lang in langStrings)) {
    return EN;
  }
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const localeStrings = await langStrings[lang]();
  return defaultsDeep(localeStrings.default, EN);
};

export const isEnglishLanguage = (lang: string) => {
  return ['en-us', 'en'].includes(lang);
};
