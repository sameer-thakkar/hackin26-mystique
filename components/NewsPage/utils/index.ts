import { PrismicDocumentWithUID } from '@prismicio/types';

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
