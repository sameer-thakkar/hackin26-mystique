import { atom } from 'recoil';

export const metaAtom = atom<{
  city?: string;
  country?: string;
  collectionId?: string;
  collectionName?: string;
  mbName?: string;
  pageTitle?: string;
  pageType?: string;
  language?: string;
}>({
  key: 'meta',
  default: {
    city: '',
    country: '',
    collectionId: '',
    collectionName: '',
    mbName: '',
    pageTitle: '',
    pageType: '',
    language: 'en',
  },
});
