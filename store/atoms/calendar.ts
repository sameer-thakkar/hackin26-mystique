import { atom } from 'recoil';

export const calendarDataAtom = atom<{
  calendarData: Record<string, string> | null;
}>({
  key: 'calendarData',
  default: {
    calendarData: null,
  },
});
