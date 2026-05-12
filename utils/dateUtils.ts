import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';
import { getIntlDate } from '@headout/espeon/utils/date';
import { getIntlTime } from '@headout/espeon/utils/time';
import {
  INVALID_DATE,
  LANGUAGE_CODE_MAP,
  LOCALISED_DATE_FORMATS,
  TLANGUAGELOCALE,
} from 'const/index';
import { strings } from 'const/strings';

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localeData);

type TDateToString = {
  date: string;
  currentLanguage?: TLANGUAGELOCALE | string;
  dateFormat?: 'DD-MM-YYYY' | 'MMM-DD-YYYY';
  options?: Pick<Intl.DateTimeFormatOptions, 'dateStyle'>;
};

export const dateToString = ({
  date,
  currentLanguage = LANGUAGE_CODE_MAP.EN as TLANGUAGELOCALE,
  dateFormat = 'DD-MM-YYYY',
  options,
}: TDateToString) => {
  const today = [dayjs().format('YYYY-MM-DD'), dayjs().format('DD-MM-YYYY')];
  const tomorrow = [
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dayjs().add(1, 'day').format('DD-MM-YYYY'),
  ];
  if (today.indexOf(date) > -1) return strings.TODAY;
  if (tomorrow.indexOf(date) > -1) return strings.TOMORROW;

  const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : INVALID_DATE;

  return formattedDate !== INVALID_DATE
    ? getIntlDate({
        date: formattedDate,
        dateFormat,
        lang: currentLanguage,
        options,
      })
    : INVALID_DATE;
};

export const isDateInThePast = (date: string) =>
  new Date(date).getTime() < Date.now();

export const getDurationInDays = (duration: number) =>
  Math.round(duration / 1440);

export const getDurationInHours = (duration: number) =>
  Math.round(duration / 60);

export const isDateValid = (date: string | null) => dayjs(date).isValid();

export const getPrevDate = (date: string | null) =>
  dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');

/**
 * Returns ISO 8601 representation of a duration string.
 * The duration string is expected to be in the format "x hrs y mins...".
 * Currently only supports hours and minutes.
 *
 * @param {string} durationString (eg - "2 hrs, 45 mins with 1 intermission").
 * @return {string} ISO 8601 representation (eg - "PT2H45M").
 */
export const getDurationISO = (durationString: string) => {
  if (!durationString) return '';
  const durationObject = durationString
    .split(' ')
    .reduce(
      (
        accObject: Record<any, any>,
        item: string,
        index: number,
        array: string[]
      ) => {
        if (item.startsWith('hrs')) {
          accObject['hrs'] = array[index - 1];
        }
        if (item.startsWith('mins')) {
          accObject['mins'] = array[index - 1];
        }
        return accObject;
      },
      {}
    );
  return dayjs
    .duration({
      hours: durationObject?.hrs || 0,
      minutes: durationObject?.mins || 0,
    })
    .toISOString();
};

export const sortDateArray = (dates: string[]) =>
  dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

export const formatDateToString = (
  date: Date,
  currentLanguage: any,
  dateFormat = 'DD MMM YYYY'
) => dayjs(date).locale(currentLanguage).format(dateFormat);

export const addDays = (date: Date | string, nDaysToAdd: number) =>
  dayjs(date).add(nDaysToAdd, 'days').toDate();

export const generateNextXDays = ({
  numberOfDays,
  startDate,
  dayFormat = 'ddd',
  dateFormat = 'YYYY-MM-DD',
}: {
  numberOfDays: number;
  startDate?: string;
  dayFormat?: string;
  dateFormat?: string;
}) => {
  const days = [];
  for (let i = 0; i < numberOfDays; i++) {
    const day = dayjs(startDate).add(i, 'day');
    days.push({
      weekday: day.format(dayFormat),
      date: day.format(dateFormat),
    });
  }
  return days;
};

export const getEarliestAvailableDate = ({
  date,
  currentLanguage,
}: {
  date: any;
  currentLanguage: any;
}) => {
  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

  if (date === today) return strings.TODAY;
  if (date === tomorrow) return strings.TOMORROW;
  return (
    dayjs(date)
      .locale(currentLanguage)
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      .format(LOCALISED_DATE_FORMATS[currentLanguage].DATE_MONTH)
  );
};

export const generateDaysInMonth = (currentMonth: Dayjs) => {
  const daysInMonth = currentMonth.daysInMonth();
  const firstWeekday = currentMonth.startOf('month').weekday();
  const arr = [];

  // Fill empty days before the first day of the month
  for (let i = 0; i < firstWeekday; i++) {
    arr.push(null);
  }

  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    arr.push(i);
  }

  return arr;
};

export const generateDaysInTwoMonths = (currentMonth: Dayjs) => {
  const firstMonth = generateDaysInMonth(currentMonth);
  const secondMonth = generateDaysInMonth(currentMonth.add(1, 'month'));
  return [firstMonth, secondMonth];
};

export const generateAllMonthsBetween = (start: Dayjs, end: Dayjs) => {
  const result = [];
  let current = start;
  while (current <= end) {
    result.push(current);
    current = current.add(1, 'month');
  }
  return result;
};
export const getWeekdaysShort = (locale: string) => {
  dayjs.locale(locale || LANGUAGE_CODE_MAP.EN);
  const dayInitials = dayjs.weekdaysShort();
  return dayInitials;
};

export const formatToDay = (dayJSDate: any) =>
  dayJSDate.format('ddd').replace('.', '');

export const formatInMonthTitleFormat = (date: string, locale: string) =>
  dayjs(date)
    .locale(locale || LANGUAGE_CODE_MAP.EN)
    .format('MMMM YYYY');

export const getLastAndFirstDayOfMonthAndYear = (
  year: number,
  month: number,
  isLastDayDate: boolean
) =>
  dayjs(
    new Date(year, isLastDayDate ? month : month - 1, isLastDayDate ? 0 : 1)
  ).format('YYYY-MM-DD');

export const localDateToJsDate = (dateString?: string) => {
  if (!dateString) return '';
  return dayjs(dateString, 'YYYY-MM-DD').toDate();
};

export const formatDate = (date: Date, dateFormat = 'DD-MM-YYYY') =>
  dayjs(date).format(dateFormat);

export const getOrderedMonthsBasedOnCurrentMonth = (
  locale: TLANGUAGELOCALE
) => {
  const today = dayjs().locale(locale);
  const nextYear = today.add(1, 'year');
  const monthsList = [];
  const shortMonthFormatter = new Intl.DateTimeFormat(locale, {
    month: 'short',
  });

  let currentMonth = today;
  while (
    currentMonth.isBefore(nextYear.subtract(1, 'month'), 'month') ||
    currentMonth.isSame(nextYear.subtract(1, 'month'), 'month')
  ) {
    const asDate = currentMonth.toDate();
    monthsList.push({
      long_format_month: currentMonth.locale('en').format('MMMM'),
      short_format_month: shortMonthFormatter.format(asDate),
      year: currentMonth.format('YYYY'),
    });
    currentMonth = currentMonth.add(1, 'month');
  }

  return monthsList;
};

export const formatOperatingDayTimings = ({
  day,
  lang,
}: {
  day: {
    openingTime: string;
    closingTime: string;
    lastEntryTime: string;
  };
  lang: string;
  useTo?: boolean;
}): { hours: string; lastAdmission?: string } => {
  const formattedOpeningTime = getIntlTime({
    time: day.openingTime,
    lang,
  });
  const formattedClosingTime = getIntlTime({
    time: day.closingTime,
    lang,
  });
  const formattedLastEntryTime =
    day.lastEntryTime &&
    getIntlTime({
      time: day.lastEntryTime,
      lang,
    });

  return {
    hours: `${formattedOpeningTime}–${formattedClosingTime}`,
    lastAdmission: formattedLastEntryTime,
  };
};

/* 
  January to Jan
  localized
*/
export const longMonthtoShort = ({
  fullMonth,
  lang = 'en-US',
}: {
  fullMonth: string;
  lang?: string;
}) => {
  const monthIndex = new Date(Date.parse(`${fullMonth} 1, 2000`)).getMonth();

  if (!isNaN(monthIndex)) {
    const shortMonthName = new Intl.DateTimeFormat(lang, {
      month: 'short',
    }).format(new Date(2000, monthIndex, 1));
    return shortMonthName;
  }
  return null;
};

/* 
  Monday to Mon
  localized
  Note: the input day is expected to be in english
*/
export const longDaytoShort = ({
  fullWeekday,
  lang = 'en-US',
}: {
  fullWeekday: string;
  lang?: string;
}) => {
  const normalizedInput = fullWeekday.toLowerCase();
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2000, 0, index + 1);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' })
      .format(date)
      .toLowerCase();
  });
  const weekdayIndex = weekdays.indexOf(normalizedInput);

  if (weekdayIndex !== -1) {
    const shortWeekdayName = new Intl.DateTimeFormat(lang, {
      weekday: 'short',
    }).format(new Date(2000, 0, weekdayIndex + 1));
    return shortWeekdayName;
  }
  return null;
};

export const getCurrentOperatingHours = (
  operatingSchedules: Record<string, any>[],
  lang: string,
  useTo?: boolean
) => {
  try {
    const currentDate = new Date();
    for (const schedule of operatingSchedules) {
      const startDate = new Date(schedule?.startDate);
      const endDate = new Date(schedule?.endDate);

      if (currentDate >= startDate && currentDate <= endDate) {
        const dayOfWeek = currentDate
          .toLocaleString('en-US', { weekday: 'long' })
          .toUpperCase();
        const operatingDay = schedule?.operatingDaySchedules.find(
          (day: any) => day?.dayOfWeek === dayOfWeek
        );

        if (
          !operatingDay?.closed &&
          operatingDay?.openingTime &&
          operatingDay?.closingTime
        ) {
          return formatOperatingDayTimings({
            day: operatingDay,
            lang,
            useTo,
          });
        }

        return {
          hours: strings.CONTENT_PAGE.CLOSED_TODAY,
          lastAdmission: null,
        };
      }
    }
    return {};
  } catch {
    return {};
  }
};

export const getCurrentOperatingSchedule = (
  operatingSchedules: Record<string, any>[]
) => {
  const currentDate = new Date();
  return operatingSchedules?.find((schedule) => {
    const startDate = new Date(schedule?.startDate);
    const endDate = new Date(schedule?.endDate);
    return currentDate >= startDate && currentDate <= endDate;
  });
};

export const localizeDay = (day: string, locale: string): string => {
  const date = new Date();
  const dayIndex = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ].indexOf(day.toLowerCase());
  date.setDate(date.getDate() - date.getDay() + dayIndex); // Get the date of the given day

  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const formatter = new Intl.DateTimeFormat(locale, options);

  return formatter.format(date);
};
export const getNMonthsFromNow = (n: number) => {
  return Array.from({ length: n }).map((_, i) => {
    return dayjs().add(i, 'month');
  });
};

export function convertDateToIsoDate(date: string) {
  // Try parsing with common formats
  const formats = [
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY/MM/DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
    'YYYY-MM-DD',
    'DD.MM.YYYY',
    'MM.DD.YYYY',
    'YYYY.MM.DD',
  ];

  // Try each format until one works
  for (const format of formats) {
    const parsed = dayjs(date, format, true);
    if (parsed.isValid()) {
      return parsed.format('YYYY-MM-DD');
    }
  }

  // If no format matches, try letting Day.js auto-parse
  const parsed = dayjs(date);
  if (parsed.isValid()) {
    return parsed.format('YYYY-MM-DD');
  }

  return INVALID_DATE;
}
