import dayjs from 'dayjs';
import { strings } from 'const/strings';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const dateToString = (
  date,
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

export const isDateInThePast = (date) => new Date(date).getTime() < Date.now();

export const getDurationInHours = (duration) => Math.round(duration / 60);

export const isDateValid = (date) => dayjs(date).isValid();

export const getPrevDate = (date) =>
  dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');

/**
 * Returns ISO 8601 representation of a duration string.
 * The duration string is expected to be in the format "x hrs y mins...".
 * Currently only supports hours and minutes.
 *
 * @param {string} durationString (eg - "2 hrs, 45 mins with 1 intermission").
 * @return {string} ISO 8601 representation (eg - "PT2H45M").
 */
export const getDurationISO = (durationString) => {
  const durationObject = durationString
    .split(' ')
    .reduce((accObject, item, index, array) => {
      if (item.startsWith('hrs')) {
        accObject['hrs'] = array[index - 1];
      }
      if (item.startsWith('mins')) {
        accObject['mins'] = array[index - 1];
      }
      return accObject;
    }, {});
  return dayjs
    .duration({
      hours: durationObject?.hrs || 0,
      minutes: durationObject?.mins || 0,
    })
    .toISOString();
};
