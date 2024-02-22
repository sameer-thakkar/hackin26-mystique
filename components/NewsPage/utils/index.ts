import { PrismicDocumentWithUID } from '@prismicio/types';
import { findImageUrlFromMediaData } from 'utils/helper';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

/* Removes the repeated featuredArticles from same tgid articles */
export const uniqueArticlesWithoutRepetition = (
  featuredArticles: PrismicDocumentWithUID[],
  articlesWithSameTgid: PrismicDocumentWithUID[]
) => {
  const featuredArticlesUid = new Set();
  featuredArticles?.forEach(
    (article) => article?.uid && featuredArticlesUid.add(article?.uid)
  );
  articlesWithSameTgid = articlesWithSameTgid?.filter((article) => {
    return !featuredArticlesUid.has(article?.uid);
  });

  return articlesWithSameTgid;
};

export const getVerticalImageUrl = (
  mediaData: Record<string, any>[],
  tgid: number
) => {
  const media = mediaData?.find((media) => media.resourceEntityId == tgid);

  return findImageUrlFromMediaData(media?.medias);
};

export const getShowPageUid = (
  showPageDocuments: Record<string, any>[],
  tgid: number
) => {
  return showPageDocuments.find((showPage) => showPage.data.tgid == tgid)?.uid;
};

export const getTrackingObject = (section: string) => {
  return {
    eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_SECTION_VIEWED,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  };
};
