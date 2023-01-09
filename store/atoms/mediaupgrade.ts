import { atom } from 'recoil';

export const mediaUpgradeExperimentAtom = atom({
  key: 'mediaUpgrade',
  default: {
    isNewMediaSite: false,
    isOldMediaSite: false,
  },
});
