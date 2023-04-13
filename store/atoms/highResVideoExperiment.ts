import { atom } from 'recoil';

export const highResVideoExperimentAtom = atom<{
  variant?: string;
}>({
  key: 'high-res-video-experiment',
  default: { variant: undefined },
});
