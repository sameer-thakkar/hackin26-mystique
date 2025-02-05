import type {
  TLanguages,
  TSupportedLanguageCode,
} from 'components/Espeon/constants/localisation/types';

const rtfUnitTypes = [
  'year',
  'quarter',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
] as const;

const localeMatcherType = ['best fit', 'lookup'] as const;
const numericType = ['always', 'auto'] as const;
const styleType = ['long', 'short', 'narrow'] as const;

export type TLocalisedRelativeTimeFormat = {
  locale: string;
  value: number;
  unit: (typeof rtfUnitTypes)[number];
  localeMatcher?: (typeof localeMatcherType)[number];
  numeric?: (typeof numericType)[number];
  style?: (typeof styleType)[number];
  formatToParts?: boolean;
};

export type TFormatDurationToString = {
  hour: number | null;
  minute: number | null;
  lang: TLanguages;
};

export type TGetDuration = {
  minDuration: number | null;
  maxDuration: number | null;
  lang?: TLanguages;
};

export type TGetLocalizedTime = {
  formattedTime: string;
  lang: TLanguages;
  trimTrailingZeros?: boolean;
  isLowerCase?: boolean;
};

export type TGetIntlTimeOptions = {
  time: string;
  lang: TSupportedLanguageCode;
  options?: Pick<
    Intl.DateTimeFormatOptions,
    'hour12' | 'timeZone' | 'timeZoneName'
  >;
};

export type TGetDurationInHmNotation = {
  lang: TSupportedLanguageCode;
  durationInMinutes: number;
  unitDisplay?: Intl.NumberFormatOptions['unitDisplay'];
};
