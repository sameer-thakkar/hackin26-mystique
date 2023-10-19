import {
  IcurrencyMap,
  ISortedCurrencies,
  IsortedCurrencyMap,
  IsortedLanguages,
} from 'components/common/LocalePopover/interface';
import { TOP_CURRENCIES } from 'const/currency';
import { LanguagesUnion, LOCALE_ORDER } from 'const/index';
import {
  MORE_CURRENCIES,
  POPULAR_CURRENCIES,
} from 'const/localeSelectorConstants';
import { getLangObject } from './helper';

export const getSortedLanguages = (
  currentLanguage: LanguagesUnion,
  languages: IsortedLanguages[]
) => {
  const orderedLocales = Array.from(
    new Set([getLangObject(currentLanguage).code, ...LOCALE_ORDER])
  );
  const languagesShallowClone = [...languages];

  return languagesShallowClone.sort(
    (lA, lB) =>
      orderedLocales.indexOf(lA.code) - orderedLocales.indexOf(lB.code)
  );
};

export const getDisplayCurrencyString = ({
  currencyObj,
  full = false,
}: any) => {
  const { currencyName, localSymbol, code } = currencyObj ?? {};
  const finalLocalSymbol = localSymbol === code ? '' : localSymbol;
  return full
    ? `${currencyName}`
    : `${code} ${finalLocalSymbol ? finalLocalSymbol + ' ' : ''}`;
};

export const getCurrencyOptions = (currencies: ISortedCurrencies[] = []) => {
  return currencies.reduce(
    (accumulator: IsortedCurrencyMap, currency: ISortedCurrencies) => {
      const { code = '' } = currency || {};

      if (code) {
        const data = {
          subLabel: getDisplayCurrencyString({
            currencyObj: currency,
            full: true,
          }),
          value: code,
          label: getDisplayCurrencyString({ currencyObj: currency }),
        };

        const categoryKey = TOP_CURRENCIES.includes(code)
          ? POPULAR_CURRENCIES
          : MORE_CURRENCIES;

        accumulator[categoryKey] = [...(accumulator[categoryKey] || []), data];
      }

      return accumulator;
    },
    { popular_currencies: [], more_currencies: [] }
  );
};

export const getCurrencyOptionsMobile = (
  sortedCurrencies: ISortedCurrencies[] = [],
  lowerCaseSearchQuery: string
) => {
  return sortedCurrencies.reduce(
    (accumulator: IcurrencyMap, currency: ISortedCurrencies) => {
      const { currencyName = '', code = '' } = currency || {};
      if (currencyName && code) {
        const isMatch =
          currencyName.toLowerCase()?.includes(lowerCaseSearchQuery) ||
          code.toLowerCase()?.includes(lowerCaseSearchQuery);

        const categoryKey = TOP_CURRENCIES.includes(code)
          ? POPULAR_CURRENCIES
          : MORE_CURRENCIES;

        if (isMatch) {
          accumulator[categoryKey] = [
            ...(accumulator[categoryKey] || []),
            currency,
          ];
        }
      }

      return accumulator;
    },
    { popular_currencies: [], more_currencies: [] }
  );
};
