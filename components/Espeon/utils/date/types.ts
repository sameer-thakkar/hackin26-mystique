export type TGetIntlDate = {
  lang: any;
  date: string | number;
  dateFormat?: 'DD-MM-YYYY' | 'MMM-D-YYY' | 'MMM-DD-YYYY' | 'MMM-YYYY';
  options?: Pick<
    Intl.DateTimeFormatOptions,
    'dateStyle' | 'day' | 'month' | 'year' | 'dayPeriod'
  >;
};
