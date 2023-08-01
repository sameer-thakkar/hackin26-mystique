import { atom } from 'recoil';
import type { TCurrencyObj } from 'utils/currency';

export const currencyListAtom = atom<Array<TCurrencyObj>>({
  key: 'currencyList',
  default: [],
});
