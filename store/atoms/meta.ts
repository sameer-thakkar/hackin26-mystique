import { atom } from 'recoil';

export const metaAtom = atom({
  key: 'meta',
  default: {
    city: null,
    country: null,
    collectionId: null,
    collectionName: null,
    mbName: null,
    pageTitle: null,
    pageType: null,
    language: 'en',
  },
});
