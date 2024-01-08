import { PrismicDocumentWithUID } from '@prismicio/types';
import { RESOURCE_ASSET_TYPE } from 'const/index';

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
  const media = mediaData.find((media) => media.resourceEntityId == tgid);

  return findImageUrlFromMediaData(media?.medias);
};

export const findImageUrlFromMediaData = (media: Record<string, any>[]) => {
  return media?.find((item) => item?.type === RESOURCE_ASSET_TYPE.IMAGE)?.url;
};

export const getShowPageUid = (
  showPageDocuments: Record<string, any>[],
  tgid: number
) => {
  return showPageDocuments.find((showPage) => showPage.data.tgid == tgid)?.uid;
};
