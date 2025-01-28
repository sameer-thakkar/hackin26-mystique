import { LanguagesUnion } from 'const/index';
import { TRUSTPILOT_WIDGET_LANGUAGE_LOCALE_MAP } from './constants';

export const getTrustPilotWidgetLanguageLocale = (lang: LanguagesUnion) => {
  return (
    TRUSTPILOT_WIDGET_LANGUAGE_LOCALE_MAP[
      lang as keyof typeof TRUSTPILOT_WIDGET_LANGUAGE_LOCALE_MAP
    ] || 'en-US'
  );
};
