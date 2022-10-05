import { atom } from 'recoil';

export const searchQueryAtom = atom({
  key: 'searchQuery',
  default: '',
});
