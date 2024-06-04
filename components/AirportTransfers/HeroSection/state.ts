import { atom } from 'recoil';
import { TSelectedSearchTab } from '../SearchUnit/interface';

export const selectedSearchTabState = atom<TSelectedSearchTab>({
  key: 'selectedSearchTabState',
  default: 'SHARED_TAB',
});
