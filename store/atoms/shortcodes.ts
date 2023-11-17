import { atom } from 'recoil';

export const shortcodesAtom = atom<{
  minPrice?: number;
  bestDiscount?: number;
}>({
  key: 'shortcodes',
  default: {
    minPrice: 0,
    bestDiscount: 0,
  },
});
