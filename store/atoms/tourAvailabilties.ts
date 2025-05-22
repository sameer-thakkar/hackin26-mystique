import { atom } from 'recoil';

export const tourAvailabiltiesAtom = atom<{
  tourAvailabilties: Record<string, any> | null;
}>({
  key: 'tourAvailabilties',
  default: {
    tourAvailabilties: null,
  },
});
