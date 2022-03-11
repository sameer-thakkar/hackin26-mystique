import { atom } from 'recoil';

export const hsidAtom = atom({
  key: 'hsid',
  default: null,
});

export const hsidSetFailAtom = atom({
  key: 'hsid-set-fail',
  default: false,
});
