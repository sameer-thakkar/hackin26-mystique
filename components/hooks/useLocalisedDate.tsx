import { useContext } from 'react';
import dayjs from 'dayjs';
import { MBContext } from 'contexts/MBContext';
import { DATE_FORMAT_TYPES, LOCALISED_DATE_FORMATS } from 'const/index';

const useLocalisedDate = (date, formatType = DATE_FORMAT_TYPES.SHORT) => {
  const { lang } = useContext(MBContext);
  let format = LOCALISED_DATE_FORMATS[lang][formatType] || 'DD-MMM-YY';
  return dayjs(date).locale(lang).format(format);
};

export default useLocalisedDate;
