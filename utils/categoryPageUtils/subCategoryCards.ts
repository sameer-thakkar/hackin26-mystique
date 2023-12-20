import { PrismicDocumentWithUID } from '@prismicio/types';
import { getHeadoutLanguagecode } from 'utils';
import { fetchCollectionTop } from 'utils/apiUtils';
import { getMenuUrl } from 'utils/headerUtils';
import shouldIncludeinQueries from 'utils/headerUtils/shouldIncludeInQueries';
import { sendLog } from 'utils/logger';
import getTopCollectionsCarouselDocs from 'utils/prismicUtils/getTopCollectionsCarouselDocs';
import { COOKIE } from 'const/index';

const getCardsData = ({
  collections,
  docsStore,
  lang,
}: {
  collections: Array<Record<string, any>>;
  docsStore: Array<PrismicDocumentWithUID>;
  lang: string;
}) => {
  let hasAtLeastOneProduct = false;
  let subCategoryCardsRanking: Array<number> = [];

  const carouselCardsData = collections.reduce(
    (acc: Record<string, any>[], collection: Record<string, any>) => {
      const {
        id,
        cardMedia,
        name,
        displayName,
        ratingsInfo,
        subtext,
        startingPrice,
      } = collection || {};

      if (!hasAtLeastOneProduct && startingPrice?.listingPrice) {
        hasAtLeastOneProduct = true;
      }

      const docFound = docsStore?.find(
        (doc) =>
          String(id) === doc?.data?.tagged_collection &&
          shouldIncludeinQueries(doc)
      );

      if (docFound) {
        const url = getMenuUrl({ docFound, lang });
        if (!url) return acc;

        subCategoryCardsRanking = [...subCategoryCardsRanking, id];
        return [
          ...(acc || []),
          {
            id,
            cardMedia,
            name,
            displayName,
            ratingsInfo,
            subtext,
            startingPrice,
            url,
          },
        ];
      }
      return acc;
    },
    []
  );

  if (!hasAtLeastOneProduct) return {};

  return { carouselCardsData, subCategoryCardsRanking };
};

export const getSubCategoryCards = async ({
  taggedCity,
  subCategoryData,
  lang,
  cookies,
}: {
  taggedCity: string;
  subCategoryData: Record<string, any>;
  lang: string;
  cookies: Record<string, any>;
}) => {
  try {
    const currency = cookies[COOKIE.CURRENT_CURRENCY];

    const { pageData: topCollectionsData } =
      (await fetchCollectionTop({
        city: taggedCity,
        subCategoryId: subCategoryData?.id,
        limit: 30,
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

    const { carouselCardsData, subCategoryCardsRanking } = getCardsData({
      collections: topCollections,
      docsStore,
      lang,
    });

    return {
      subCategoryCards: carouselCardsData,
      subCategoryCardsRanking,
    };
  } catch (err) {
    sendLog({
      err,
      message: `[getSubCategoryCards] - 
        ${JSON.stringify({
          taggedCity,
          subCategoryData,
          lang,
        })}
      `,
    });
    return {};
  }
};
