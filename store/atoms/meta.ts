import { atom } from 'recoil';

export const metaAtom = atom<{
  city?: { code?: string; displayName?: string };
  country?: { code?: string; displayName: string };
  collectionId?: string;
  collectionName?: string;
  mbName?: string;
  pageTitle?: string;
  pageType?: string;
  language?: string;
}>({
  key: 'meta',
  default: {
    city: {} as any,
    country: {} as any,
    collectionId: '',
    collectionName: '',
    mbName: '',
    pageTitle: '',
    pageType: '',
    language: 'en',
  },
});
