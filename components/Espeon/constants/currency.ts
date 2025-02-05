export const TOP_CURRENCIES = ['EUR', 'USD', 'AED', 'SGD', 'INR', 'MYR'];

export const CURRENCY_CODES_ORDER = [
  'AZN',
  'AUD',
  'BHD',
  'CAD',
  'CHF',
  'CNY',
  'DKK',
  'EGP',
  'GBP',
  'HKD',
  'IDR',
  'ISK',
  'JPY',
  'KRW',
  'LBP',
  'MOP',
  'MXN',
  'NZD',
  'PLN',
  'QAR',
  'SAR',
  'SEK',
  'TWD',
  'THB',
  'VND',
  'ZAR',
];

export const CURRENCY_SYMBOL_MAP = {
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  USD: '$',
  SGD: 'S$',
  AUD: 'AU$',
  THB: '฿',
  INR: '₹',
  HKD: 'HK$',
  KRW: '₩',
  CAD: 'CA$',
  JPY: '¥',
  NZD: 'NZ$',
  CHF: 'CHF',
  ZAR: 'ZAR',
  MYR: 'MYR',
  SEK: 'SEK',
  IDR: 'Rp',
  ISK: 'ISK',
  MOP: 'MOP',
  CNY: 'CN¥',
  TWD: 'TW$',
  MXN: 'MXN',
  EGP: 'EGP',
  QAR: 'QAR',
  SAR: 'SAR',
  DKK: 'DKK',
  AZN: 'AZN',
  BHD: 'BHD',
  LBP: 'LBP',
  PLN: 'zł',
  VND: '₫',
} as const;

/* less commonly used currencies and for such currencies we do not want to show the symbols*/
export const LESSER_KNOWN_CURRENCY_CODES = [
  'AED',
  'CHF',
  'ZAR',
  'MYR',
  'SEK',
  'ISK',
  'DKK',
  'MOP',
  'CNY',
  'MXN',
  'QAR',
  'SAR',
  'AZN',
  'BHD',
  'LBP',
];

/* currency symbol overrides for specific languages */
export const CURRENCY_SYMBOL_OVERRIDES = {
  USD: {
    pt: 'US$',
  },
  SGD: {
    fr: '$S',
  },
  AUD: {
    fr: '$AU',
    it: 'A$',
  },
  HKD: {
    fr: '$HK',
  },
  CAD: {
    fr: '$CA',
    nl: 'C$',
  },
  NZD: {
    fr: '$NZ',
  },
  TWD: {
    fr: '$NT',
  },
  EGP: {
    fr: '£E',
  },
} as const;
