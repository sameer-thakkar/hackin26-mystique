import { getCurrentDate } from 'components/Espeon/utils/date';
import { roundOffTo } from 'components/Espeon/utils/number';
import type {
  TFormatDurationToString,
  TGetDuration,
  TGetDurationInHmNotation,
  TGetLocalizedTime,
  TLocalisedRelativeTimeFormat,
} from 'components/Espeon/utils/time/types';
import { getIntlUnit } from 'components/Espeon/utils/units';

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
    minute = roundOffTo(minute, 5);
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

const formatDurationToString = ({
  hour,
  minute,
  lang,
}: TFormatDurationToString) => {
  let res = '';
  if (hour) {
    const hourParts = localisedRelativeTimeFormat({
      locale: lang,
      unit: 'hour',
      value: hour,
      formatToParts: true,
      style: 'long',
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
      style: 'long',
    });
    res +=
      typeof minuteParts === 'string'
        ? ` ${minuteParts}`
        : formatPartsToDuration(minuteParts);
  }
  return res;
};

/**
 * Formats a duration range or single duration from milliseconds into a localized string.
 * When minimum and maximum durations differ, returns a range (e.g., "1 hour - 2 hours").
 * When they're equal, returns a single duration (e.g., "1 hour 30 minutes").
 *
 * @param {Object} params - The parameters object
 * @param {number} params.minDuration - The minimum duration in milliseconds
 * @param {number} params.maxDuration - The maximum duration in milliseconds
 * @param {string} [params.lang='en'] - The language/locale code (e.g., 'en', 'fr')
 *
 * @returns {string} A localized string representing either:
 *   - A duration range when minDuration ≠ maxDuration (e.g., "1 hour - 2 hours")
 *   - A single duration when minDuration = maxDuration (e.g., "1 hour 30 minutes")
 *
 * @example
 * // Returns "1 heure 30 minutes - 2 heures" for fr
 * getDuration({
 *   minDuration: 5400000, // 1.5 hour in ms
 *   maxDuration: 7200000, // 2 hours in ms
 *   lang: 'fr'
 * })
 *
 * @example
 * // Returns "1 hour 30 minutes" for en
 * getDuration({
 *   minDuration: 5400000, // 1.5 hours in ms
 *   maxDuration: 5400000,
 *   lang: 'en'
 * })
 */
export const getDuration = ({
  minDuration,
  maxDuration,
  lang = 'en',
}: TGetDuration) => {
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

export const getDurationInDays = (duration: number) =>
  Math.round(duration / 1440);

export const getDurationInHours = (duration: number) =>
  Math.round(duration / 60);

/**
 * Formats a duration in minutes into a localized string representation using hours and minutes.
 * For durations of 90 minutes or less, only minutes are displayed.
 * For durations above 90 minutes, the time is split into hours and minutes.
 *
 * @param {Object} params - The parameters object
 * @param {string} params.lang - The language/locale code (e.g., 'en-US', 'fr-FR')
 * @param {number} params.durationInMinutes - The duration to format in minutes
 * @param {('long'|'short'|'narrow')} [params.unitDisplay='long'] - The unit display format
 *   - 'long' displays full unit names (e.g., "2 hours 30 minutes")
 *   - 'short' displays abbreviated units (e.g., "2 hr 30 min")
 *   - 'narrow' displays narrow units (e.g., "2h 30m")
 *
 * @returns {string} A localized string representing the duration
 *
 * @example
 * // Returns "45 minutes" for en
 * getDurationInHmNotation({ lang: 'en', durationInMinutes: 45 })
 *
 * @example
 * // Returns "2 horas 30 minutos" for es
 * getDurationInHmNotation({ lang: 'es', durationInMinutes: 150 })
 *
 * @example
 * // Returns "2 Std. 30 Min." for de with short unit display
 * getDurationInHmNotation({ lang: 'de', durationInMinutes: 150, unitDisplay: 'short' })
 */

export const getDurationInHmNotation = ({
  lang,
  durationInMinutes,
  unitDisplay = 'long',
}: TGetDurationInHmNotation) => {
  let hours = Math.floor(durationInMinutes / 60);
  let minutes = durationInMinutes % 60;

  if (durationInMinutes <= 90) {
    hours = 0;
    minutes = durationInMinutes;
  }

  let durationString = '';

  switch (true) {
    case hours === 0:
      durationString = getIntlUnit({
        lang,
        number: minutes,
        options: {
          unit: 'minute',
          unitDisplay,
        },
      });
      break;
    case minutes === 0:
      durationString = getIntlUnit({
        lang,
        number: hours,
        options: {
          unit: 'hour',
          unitDisplay,
        },
      });
      break;
    default:
      const intlHour = getIntlUnit({
        lang,
        number: hours,
        options: {
          unit: 'hour',
          unitDisplay,
        },
      });
      const intlMin = getIntlUnit({
        lang,
        number: minutes,
        options: {
          unit: 'minute',
          unitDisplay,
        },
      });
      durationString = `${intlHour} ${intlMin}`;
      break;
  }

  return durationString;
};

export const localisedRelativeTimeFormat = ({
  locale,
  value,
  unit,
  formatToParts = false,
  localeMatcher = 'lookup',
  numeric = 'auto',
  style = 'short',
}: TLocalisedRelativeTimeFormat) => {
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

export const getLocalizedTime = ({
  lang,
  formattedTime,
  trimTrailingZeros = false,
  isLowerCase = false,
}: TGetLocalizedTime) => {
  try {
    if (!formattedTime) return formattedTime;
    const [hours, minutes] = formattedTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const showMinutes = minutes !== 0 && !trimTrailingZeros;

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      ...(showMinutes && { minute: 'numeric' }),
    };

    const time = new Intl.DateTimeFormat(
      lang,
      options as Intl.DateTimeFormatOptions
    ).format(date);

    if (isLowerCase) return time.split(' ').join('').toLowerCase();

    return time;
  } catch (error) {
    return formattedTime; // Return the original time if formatting fails
  }
};

/**
 * Formats a date and time into a localized time string using Intl.DateTimeFormat. This fn replaces `getHumanReadableTime`
 *
 * @param {Object} params - The parameters object
 * @param {string} params.date - The date in YYYY-MM-DD format
 * @param {string} params.time - The time in HH:mm format (24-hour)
 * @param {string} params.lang - The language/locale code (e.g., 'en', 'fr')
 * @param {Object} [params.options] - Additional Intl.DateTimeFormat options
 * @param {boolean} [params.options.hour12] - Whether to use 12-hour format. Defaults to false (24-hour)
 * @param {string} [params.options.timeZone] - The IANA time zone name (e.g., 'America/New_York')
 * @param {string} [params.options.timeZoneName] - Format for time zone name ('short', 'long', 'shortOffset', etc.)
 *
 * @returns {string} A localized time string
 *
 * @example
 * // Returns "14:30" for nl
 * getIntlTime({
 *   date: '2024-03-14',
 *   time: '14:30',
 *   lang: 'nl'
 * })
 *
 * @example
 * // Returns "ÖS 2:30" for tr with 12-hour format
 * getIntlTime({
 *   date: '2024-03-14',
 *   time: '14:30',
 *   lang: 'tr',
 *   options: { hour12: true }
 * })
 *
 * @example
 * // Returns "14:30 EDT" for en with time zone
 * getIntlTime({
 *   date: '2024-03-14',
 *   time: '14:30',
 *   lang: 'en',
 *   options: { timeZone: 'America/New_York', timeZoneName: 'short' }
 * })
 */

export function getIntlTime({
  time,
  lang,
  options = {},
}: {
  time: string;
  lang: string;
  options?: Pick<
    Intl.DateTimeFormatOptions,
    'hour12' | 'timeZone' | 'timeZoneName'
  >;
}) {
  try {
    if (!time) return time;
    const now = new Date(`${getCurrentDate()}T${time}`);
    const format = new Intl.DateTimeFormat(lang, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: lang === 'en' ? true : false,
      ...options,
    }).format(now);
    return format;
  } catch (error) {
    return time;
  }
}
