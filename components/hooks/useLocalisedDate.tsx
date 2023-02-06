import { useContext } from 'react';
import dayjs from 'dayjs';
import { MBContext } from 'contexts/MBContext';
import { DATE_FORMAT_TYPES, LOCALISED_DATE_FORMATS } from 'const/index';

const useLocalisedDate = (date: any, formatType = DATE_FORMAT_TYPES.SHORT) => {
  const { lang } = useContext(MBContext);
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  let format = LOCALISED_DATE_FORMATS[lang][formatType] || 'DD-MMM-YY';
  return dayjs(date).locale(lang).format(format);
};

export default useLocalisedDate;
