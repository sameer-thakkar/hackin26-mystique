import { atom } from 'recoil';

/***
 * This atom is only for running localisedCurrency growth experiment.
 * Not to be used as universal loader state
 */

export const localisedCurrencyloaderAtom = atom({
  key: 'localisedCurrencyloaderAtom',
  default: true,
});
