import { strings } from 'const/strings';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/it';
import '@formatjs/intl-relativetimeformat/locale-data/es';
import '@formatjs/intl-relativetimeformat/locale-data/fr';
import '@formatjs/intl-relativetimeformat/locale-data/de';
import '@formatjs/intl-relativetimeformat/locale-data/nl';
import '@formatjs/intl-relativetimeformat/locale-data/pt';

const rtfUnitTypes = <const>[
  'year',
  'quarter',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
];
const localeMatcherType = <const>['best fit', 'lookup'];
const numericType = <const>['always', 'auto'];
const styleType = <const>['long', 'short', 'narrow'];

interface LocalisedRelativeTimeFormat {
  locale: string;
  value: number;
  unit: typeof rtfUnitTypes[number];
  localeMatcher?: typeof localeMatcherType[number];
  numeric?: typeof numericType[number];
  style?: typeof styleType[number];
  formatToParts?: boolean;
}

export const localisedRelativeTimeFormat = ({
  locale,
  value,
  unit,
  formatToParts = false,
  localeMatcher = 'lookup',
  numeric = 'auto',
  style = 'short',
}: LocalisedRelativeTimeFormat) => {
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, {
      localeMatcher,
      numeric,
      style,
    });
    return formatToParts
      ? rtf.formatToParts(value, unit) || []
      : rtf.format(value, unit);
  } catch (e) {
    return '';
  }
};

export function roundOffTo(num: number, roundingFactor: number) {
  return Math.round(num / roundingFactor) * roundingFactor;
}
export function convertMillisecondsToHours(milliseconds: number | null) {
  if (!milliseconds)
    return {
      hour: null,
      minute: null,
    };
  const hour = Math.floor(milliseconds / 1000 / 60 / 60);
  const minute = roundOffTo(
    Math.round((milliseconds / 1000 / 60 / 60 - hour) * 60),
    5
  );
  return {
    hour,
    minute,
  };
}

const formatPartsToDuration = (arr: Array<Intl.RelativeTimeFormatPart>) => {
  if (arr.length === 3) {
    const [, value, unit] = arr || [];
    return `${value?.value}${unit?.value}`;
  } else {
    const [value, unit] = arr || [];
    return `${value?.value}${unit?.value}`;
  }
};

export const getDuration = ({
  minDuration,
  maxDuration,
  lang = 'en',
}: {
  minDuration: number | null;
  maxDuration: number | null;
  lang?: string;
}) => {
  if (!minDuration && !maxDuration)
    return strings.DESCRIPTORS.FLEXIBLE_DURATION;

  const formatDurationToString = ({
    hour,
    minute,
  }: {
    hour: number | null;
    minute: number | null;
  }) => {
    let res = '';
    if (hour) {
      const hourParts = localisedRelativeTimeFormat({
        locale: lang,
        unit: 'hour',
        value: hour,
        formatToParts: true,
      });
      res +=
        typeof hourParts === 'string'
          ? hourParts
          : formatPartsToDuration(hourParts);
    }
    if (minute) {
      const minuteParts = localisedRelativeTimeFormat({
        locale: lang,
        unit: 'minute',
        value: minute,
        formatToParts: true,
      });
      res +=
        typeof minuteParts === 'string'
          ? ` ${minuteParts}`
          : ` ${formatPartsToDuration(minuteParts)}`;
    }
    return res;
  };

  if (minDuration !== maxDuration) {
    const { hour: minHour, minute: minMinute } = convertMillisecondsToHours(
      minDuration
    );
    const { hour: maxHour, minute: maxMinute } = convertMillisecondsToHours(
      maxDuration
    );
    return `${formatDurationToString({
      hour: minHour,
      minute: minMinute,
    })} - ${formatDurationToString({ hour: maxHour, minute: maxMinute })}`;
  } else {
    const { hour, minute } = convertMillisecondsToHours(maxDuration);
    return formatDurationToString({ hour, minute });
  }
};
