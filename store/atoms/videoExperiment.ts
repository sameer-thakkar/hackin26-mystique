import { atom } from 'recoil';

export const videoExperimentAtom = atom<{
  variant: string | null;
}>({
  key: 'video-experiment',
  default: {
    variant: null,
  },
});
