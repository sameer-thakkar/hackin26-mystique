import { atom } from 'recoil';

export const lazyLoadOverrideAtom = atom({
  key: 'lazyLoadOverride',
  default: false,
});
