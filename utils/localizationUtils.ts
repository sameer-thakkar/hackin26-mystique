import EN from 'const/localization/en';
import defaultsDeep from 'lodash/defaultsDeep';

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
};

export const getLocalizationLabels = async ({ lang }) => {
  if (lang === 'en' || !(lang in langStrings)) {
    return EN;
  }
  const localeStrings = await langStrings[lang]();
  return defaultsDeep(localeStrings.default, EN);
};
