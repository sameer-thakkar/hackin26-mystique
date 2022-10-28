import EN from 'const/localization/en';
import defaultsDeep from 'lodash/defaultsDeep';

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
};

const langStrings = {
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
};

export const initDayJSLocale = (lang) => dayJsLocales[lang]();

export const getLocalizationLabels = async ({ lang }) => {
  if (lang === 'en' || !(lang in langStrings)) {
    return EN;
  }
  const localeStrings = await langStrings[lang]();
  return defaultsDeep(localeStrings.default, EN);
};
