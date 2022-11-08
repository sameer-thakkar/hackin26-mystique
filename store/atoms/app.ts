import { atom } from 'recoil';

export const appAtom = atom({
  key: 'app',
  default: {
    isMobile: false,
    host: '',
    isDev: false,
    isStage: false,
    initialCurrency: '',
  },
});
