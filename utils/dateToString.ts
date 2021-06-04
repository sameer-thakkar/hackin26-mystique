import dayjs from 'dayjs';
import { strings } from 'const/strings';
import { LOCALISED_DATE_FORMATS } from 'const/index';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export const dateToString = (date, currentLanguage = 'en') => {
  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  if (date === today) return strings.TODAY;
  if (date === tomorrow) return strings.TOMORROW;
  return dayjs(date)
    .locale(currentLanguage)
    .format(LOCALISED_DATE_FORMATS[currentLanguage].DATE_MONTH);
};
