import { DUTCH_ABBREV_MONTHS } from 'components/Espeon/constants/date';
import type { TGetIntlDate } from './types';

/**
 * Function to format a date using the specified Intl.DateTimeFormat object for Dutch medium date format.
 * @param {object} options - The options object containing the date and Intl.DateTimeFormat.
 * @param {Date} options.date - The date object to format.
 * @param {Intl.DateTimeFormat} options.intlDateTimeFormat - The Intl.DateTimeFormat object for formatting.
 * @returns {string} - The formatted date string in Dutch medium format (e.g., "1 jan. 2024, 7 okt. 2024, 7 mei 2024, 25 dec. 2024").
 */

const getDutchMediumFormatDate = ({
  date,
  intlDateTimeFormat,
}: {
  date: Date;
  intlDateTimeFormat: Intl.DateTimeFormat;
}) => {
  const parts = intlDateTimeFormat.formatToParts(date);

  const formattedParts = parts.map((part) => {
    if (part.type === 'month') {
      return `${part.value}.`;
    }
    return part.value;
  });

  return formattedParts.join('');
};

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Function to format a date according to the specified language and date format using Intl.DateTimeFormat.
 * @param {Object} TGetIntlDate - The object containing the date, language, date format, and additional options.
 * @param {string} obj.lang - The language code for the desired locale.
 * @param {string | number} obj.date - Date format DD MM YYYY, YYYY MM DD, ISO Date String, UTC Date string or unix timestamp if number
 * @param {string} [obj.dateFormat='DD-MM-YYYY'] - The date format to apply. Default is 'DD-MM-YYYY'.
 * @param {object} [obj.options] - Additional options to customize the date format (Intl.DateTimeFormatOptions).
 * @returns {string} - The formatted date string based on the specified language and date format.
 *
 * **Note:**
 * * This is in accordance with the inputs from Localization team. [Sheet](https://docs.google.com/spreadsheets/d/1xvovDGgCDjgIZM_AQyeGWBjszIwZ6xaDFWwTW1HUY94/edit?gid=1170314173#gid=1170314173)
 * * For Dutch medium date style, the function handles a specific format adjustment since Intl doesn't give correct month abbreviation at the moment
 */
export const getIntlDate = ({
  date,
  lang,
  dateFormat = 'DD-MM-YYYY',
  options,
}: TGetIntlDate) => {
  const now = new Date(date);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    ...(dateFormat === 'DD-MM-YYYY' && {
      dateStyle: 'short',
    }),
    ...(dateFormat === 'MMM-D-YYY' && {
      dateStyle: 'medium',
    }),
    ...(dateFormat === 'MMM-DD-YYYY' && {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    ...(dateFormat === 'MMM-YYYY' && {
      month: 'short',
      year: 'numeric',
    }),
  };

  const formattedDate = new Intl.DateTimeFormat(lang, {
    ...dateTimeOptions,
    ...options,
  });

  if (
    lang === 'nl' &&
    dateFormat !== 'DD-MM-YYYY' &&
    !DUTCH_ABBREV_MONTHS.includes(now.getMonth())
  ) {
    return getDutchMediumFormatDate({
      intlDateTimeFormat: formattedDate,
      date: now,
    });
  }

  return formattedDate.format(now);
};
