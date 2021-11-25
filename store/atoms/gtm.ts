import { atom } from 'recoil';

export const gtmAtom = atom({
  key: 'gtm',
  default: {
    eventsReady: false,
  },
});
