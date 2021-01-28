import { atom } from 'recoil';

export const currencyAtom = atom({
  key: 'activeCurrency',
  default: null,
});
