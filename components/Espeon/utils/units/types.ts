/**
 * Intl doesn't have types for unit atm
 * This list is acquired from tc39 proposal. [Read here](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier)
 * */

export type TIntlUnit =
  | 'acre'
  | 'bit'
  | 'byte'
  | 'celsius'
  | 'centimeter'
  | 'day'
  | 'degree'
  | 'fahrenheit'
  | 'fluid-ounce'
  | 'foot'
  | 'gallon'
  | 'gigabit'
  | 'gigabyte'
  | 'gram'
  | 'hectare'
  | 'hour'
  | 'inch'
  | 'kilobit'
  | 'kilobyte'
  | 'kilogram'
  | 'kilometer'
  | 'liter'
  | 'megabit'
  | 'megabyte'
  | 'meter'
  | 'mile'
  | 'mile-scandinavian'
  | 'milliliter'
  | 'millimeter'
  | 'millisecond'
  | 'minute'
  | 'month'
  | 'ounce'
  | 'percent'
  | 'petabyte'
  | 'pound'
  | 'second'
  | 'stone'
  | 'terabit'
  | 'terabyte'
  | 'week'
  | 'yard'
  | 'year';

export type TGetIntlUnit = {
  lang: any;
  number: number;
  options: Pick<Intl.NumberFormatOptions, 'unitDisplay'> & {
    unit: TIntlUnit;
  };
};
