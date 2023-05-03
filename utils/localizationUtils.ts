import { LanguagesUnion } from 'const/index';
import EN from 'const/localization/en';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
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
  id: () => import('dayjs/locale/id'),
  pl: () => import('dayjs/locale/pl'),
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
