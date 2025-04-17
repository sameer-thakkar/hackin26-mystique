import { atom } from 'recoil';

export const experimentsAtom = atom<{
  expGroup: Record<string, string>;
  isExpGroupLoading: boolean;
}>({
  key: 'experiments',
  default: {
    expGroup: {},
    isExpGroupLoading: true,
  },
});
