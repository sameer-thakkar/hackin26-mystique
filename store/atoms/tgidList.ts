import { atom } from 'recoil';

const TIMER_KEY = 'collection-timer';

const debouncedIsCollectingEffect = ({
  setSelf,
  onSet
}: any) => {
  if (typeof window === 'undefined') return;

  onSet((newValue: any) => {
    if (newValue.isCollecting) {
      const prevTimerId = localStorage.getItem(TIMER_KEY);
      if (prevTimerId) clearTimeout(parseInt(prevTimerId));
      const timer = setTimeout(() => {
        setSelf({ ...newValue, isCollecting: false });
      }, 800);
      localStorage.setItem(TIMER_KEY, timer.toString());
    }
  });
};

export const tgidListAtom = atom({
  key: 'tgidList',
  default: { tgids: [], isCollecting: false },
  effects: [debouncedIsCollectingEffect],
});
