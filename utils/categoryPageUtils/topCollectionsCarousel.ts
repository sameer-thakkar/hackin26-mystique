import { getHeadoutLanguagecode } from 'utils';
import { fetchCollectionTop } from 'utils/apiUtils';
import { getMenuUrl } from 'utils/headerUtils';
import shouldIncludeinQueries from 'utils/headerUtils/shouldIncludeInQueries';
import { sendLog } from 'utils/logger';
import getTopCollectionsCarouselDocs from 'utils/prismicUtils/getTopCollectionsCarouselDocs';
import { COOKIE } from 'const/index';

export const getTopCollectionsCarousel = async ({
  taggedCity,
  categoryData,
  lang,
  cookies,
}: {
  taggedCity: string;
  categoryData: Record<string, any>;
  lang: string;
  cookies: Record<string, any>;
}) => {
  const currency = cookies[COOKIE.CURRENT_CURRENCY];

  try {
    const { pageData: topCollectionsData } =
      (await fetchCollectionTop({
        city: taggedCity,
        categoryId: categoryData?.id,
        limit: 20,
        language: getHeadoutLanguagecode(lang),
        currency,
        cookies,
      })) || {};
    const { items: topCollections } = topCollectionsData || {};
    const topCollectionsIds = topCollections?.map(
      (collection: Record<string, any>) => collection.id.toString()
    );

    if (!topCollectionsIds) return [];

    const docsStore = await getTopCollectionsCarouselDocs({
      mbCity: taggedCity,
      collectionsIds: topCollectionsIds,
    });

    const topCollectionsCarouselData = topCollections.reduce(
      (acc: Record<string, any>[], collection: Record<string, any>) => {
        const { id, name, displayName, startingPrice, cardMedia } =
          collection || {};

        if (!startingPrice?.listingPrice) return acc;

        const docFound = docsStore?.find(
          (doc) =>
            String(id) === doc?.data?.tagged_collection &&
            shouldIncludeinQueries(doc)
        );
        if (docFound) {
          const url = getMenuUrl({ docFound, lang });
          if (!url) return acc;
          return [
            ...(acc || []),
            {
              id,
              name,
              displayName,
              cardMedia,
              startingPrice,
              url,
            },
          ];
        }
        return acc;
      },
      []
    );

    return topCollectionsCarouselData.slice(0, 10);
  } catch (err) {
    sendLog({
      err,
      message: `[getTopCollectionsCarousel] -
      ${JSON.stringify({
        taggedCity,
        categoryData,
        lang,
      })}
    `,
    });
    return [];
  }
};
