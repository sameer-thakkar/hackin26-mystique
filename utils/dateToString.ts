import dayjs from 'dayjs';
import { strings } from 'const/strings';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

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
