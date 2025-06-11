import { shouldPolyfill } from '@formatjs/intl-relativetimeformat/should-polyfill';
import { strings } from 'const/strings';

export async function dynamicPolyfillIntlRelativeTime(locale: string) {
  const unsupportedLocale = shouldPolyfill(locale);
  // This locale is supported
  if (!unsupportedLocale) {
    return;
  }
  // Load the polyfill 1st BEFORE loading data
  await import('@formatjs/intl-relativetimeformat/polyfill-force');
  await import(
    `@formatjs/intl-relativetimeformat/locale-data/${unsupportedLocale}`
  );
}

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
  unit: (typeof rtfUnitTypes)[number];
  localeMatcher?: (typeof localeMatcherType)[number];
  numeric?: (typeof numericType)[number];
  style?: (typeof styleType)[number];
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
  } catch (e: any) {
    return '';
  }
};

export function roundOffTo(num: number, roundingFactor: number) {
  return Math.round(num / roundingFactor) * roundingFactor;
}
export function convertMillisecondsToHours(
  milliseconds: number | null,
  enableRoundOff: boolean = true
) {
  if (!milliseconds)
    return {
      hour: null,
      minute: null,
    };
  const hour = Math.floor(milliseconds / 1000 / 60 / 60);
  let minute = Math.floor((milliseconds / 1000 / 60 / 60 - hour) * 60);

  if (enableRoundOff) {
    minute = roundOffTo(Math.round(minute), 5);
  }

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

export const formatDurationToString = ({
  hour,
  minute,
  lang = 'en',
}: {
  hour: number | null;
  minute: number | null;
  lang?: string;
}) => {
  let res = '';

  if (hour) {
    if (lang === 'en') {
      // custom formatting for EN to get 'hr' and not 'hr.'
      res += `${hour} hr`;
    } else {
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
  }

  if (minute) {
    if (lang === 'en') {
      // custom formatting for EN to get 'min' and not 'min.'
      res += `${hour ? ' ' : ''}${minute} min`;
    } else {
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
  }

  return res;
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

  if (minDuration !== maxDuration) {
    const { hour: minHour, minute: minMinute } =
      convertMillisecondsToHours(minDuration);
    const { hour: maxHour, minute: maxMinute } =
      convertMillisecondsToHours(maxDuration);
    return `${formatDurationToString({
      hour: minHour,
      minute: minMinute,
      lang,
    })} - ${formatDurationToString({
      hour: maxHour,
      minute: maxMinute,
      lang,
    })}`;
  } else {
    const { hour, minute } = convertMillisecondsToHours(maxDuration, false);
    return formatDurationToString({ hour, minute, lang });
  }
};
