import { RadioItemArg } from 'components/common/RadioList';
import { LanguagesUnion } from 'const/index';

export type IsortedLanguages = {
  url: string;
  lang: LanguagesUnion;
  code: LanguagesUnion;
};

export type ISortedCurrencies = {
  code: string;
  currency: string;
  currencyName: string;
  localSymbol: string;
  precision: number;
  symbol: string;
};

export type IPopover = {
  currencies: ISortedCurrencies[];
  languages: IsortedLanguages[];
  currentLanguage: LanguagesUnion;
  isDarkMode: boolean;
  hasLanguageDropdown: boolean;
  hasCurrencySelector: boolean;
};

export type ICurrencySelectorMobile = {
  sortedCurrencies: ISortedCurrencies[];
  activeCurrency: string | null;
  onCurrencyChange: ({ code }: RadioItemArg) => void;
};

export type IcurrencyMap = {
  popular_currencies: ISortedCurrencies[];
  more_currencies: ISortedCurrencies[];
};

type sortedCurrencyData = {
  label: string;
  subLabel: string;
  value: string;
};

export type IsortedCurrencyMap = {
  popular_currencies: sortedCurrencyData[];
  more_currencies: sortedCurrencyData[];
};

export type ILocalePopOverContentSection = {
  currentValue: string | null;
  id: number;
  onClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: any
  ) => void;
  title: string;
  type: string;
  options: Record<string, any>[];
};

export type ILocalePopOverContent = {
  section: ILocalePopOverContentSection;
};

export type IcurrencyMapkeyType = 'popular_currencies' | 'more_currencies';
