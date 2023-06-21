import dayjs from 'dayjs';
import { strings } from 'const/strings';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const dateToString = (
  date: string,
  currentLanguage = 'en',
  dateFormat = 'DD MMM YYYY'
) => {
  const today = [dayjs().format('YYYY-MM-DD'), dayjs().format('DD-MM-YYYY')];
  const tomorrow = [
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dayjs().add(1, 'day').format('DD-MM-YYYY'),
  ];
  if (today.indexOf(date) > -1) return strings.TODAY;
  if (tomorrow.indexOf(date) > -1) return strings.TOMORROW;
  return dayjs(date, ['DD-MM-YYYY', 'YYYY-MM-DD'])
    .locale(currentLanguage)
    .format(dateFormat);
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
  currentLanguage = 'en',
  dateFormat = 'DD MMM YYYY'
) => dayjs(date).locale(currentLanguage).format(dateFormat);

export const addDays = (date: Date | string, nDaysToAdd: number) =>
  dayjs(date).add(nDaysToAdd, 'days').toDate();
