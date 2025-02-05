import type { TCurrency, TCurrencyCode } from 'components/Espeon/types';

export type TCurrencyDisplayType = 'symbol' | 'code';

export type TGetLocalisedCurrencySymbol = {
  lang?: string;
  currencyCode: TCurrencyCode;
  currencyDisplay: TCurrencyDisplayType;
};

export type TGetLocalisedPrice = Omit<
  TGetLocalisedCurrencySymbol,
  'currencyDisplay'
> & {
  price: number;
  currencyList: Array<TCurrency>;
  truncateIfLong?: boolean;
  truncateAfter?: number;
  hideCurrency?: boolean;
};

export type TCurrencyOverrideCode =
  | 'USD'
  | 'SGD'
  | 'AUD'
  | 'HKD'
  | 'CAD'
  | 'NZD'
  | 'TWD'
  | 'EGP';

export type TLanguageOverrideCode = 'pt' | 'fr' | 'it' | 'nl';
