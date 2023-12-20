import { PrismicDocumentWithUID } from '@prismicio/types';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import { fetchCollectionTop } from 'utils/apiUtils';
import { getMenuUrl } from 'utils/headerUtils';
import shouldIncludeinQueries from 'utils/headerUtils/shouldIncludeInQueries';
import { sendLog } from 'utils/logger';
import getTopCollectionsCarouselDocs from 'utils/prismicUtils/getTopCollectionsCarouselDocs';
import { COOKIE } from 'const/index';

const findSubCategoryPageUrl = ({
  displayName,
  headerMenu,
}: {
  displayName: string;
  headerMenu: Record<string, any>;
}): string => {
  const { url } =
    Object.values(headerMenu).find(
      (menuItem: Record<string, any>) => menuItem.label === displayName
    ) || {};
  return url;
};

const getSubCategoriesData = ({
  subCategories,
  headerMenu,
}: {
  subCategories: Array<Record<string, any>>;
  headerMenu: Record<string, any>;
}) => {
  const subCategoriesData = subCategories.reduce(
    (acc: Record<string, any>[], subCategory: Record<string, any>) => {
      const { id, heading, name, displayName } = subCategory || {};
      const subCategoryPageUrl = findSubCategoryPageUrl({
        displayName,
        headerMenu,
      });
      return [
        ...acc,
        {
          id,
          heading,
          name,
          subCategoryPageUrl: subCategoryPageUrl || '',
        },
      ];
    },
    []
  );

  return subCategoriesData;
};

const getCarouselCardsData = ({
  collections,
  docsStore,
  lang,
}: {
  collections: Array<Record<string, any>>;
  docsStore: Array<PrismicDocumentWithUID>;
  lang: string;
}) => {
  let hasAtLeastOneProduct = false;

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

  if (!hasAtLeastOneProduct) return [];

  return carouselCardsData;
};

export const getSubCategoryCarousels = async ({
  taggedCity,
  subCategories,
  attractionsHeaderMenu,
  themesHeaderMenu,
  lang,
  cookies,
}: {
  taggedCity: string;
  subCategories: Array<Record<string, any>>;
  attractionsHeaderMenu: Record<string, any>;
  themesHeaderMenu: Record<string, any>;
  lang: string;
  cookies: Record<string, any>;
}) => {
  const currency = cookies[COOKIE.CURRENT_CURRENCY];
  const mergedHeaderMenu = {
    ...attractionsHeaderMenu,
    ...themesHeaderMenu,
  };

  if (!subCategories) return [];

  const subCategoriesData = getSubCategoriesData({
    subCategories,
    headerMenu: mergedHeaderMenu,
  });

  const subCategoryCarouselsPromises = subCategoriesData.map(
    async (subCategory: Record<string, any>) => {
      try {
        const { id, heading, name, subCategoryPageUrl } = subCategory || {};
        const { pageData: topCollectionsData } =
          (await fetchCollectionTop({
            city: taggedCity,
            subCategoryId: id,
            limit: 20,
            language: getHeadoutLanguagecode(lang),
            currency,
            cookies,
          })) || {};
        const { items: topCollections } = topCollectionsData || {};
        const topCollectionsIds = topCollections?.map(
          (collection: Record<string, any>) => collection.id.toString()
        );

        if (!topCollectionsIds) return {};

        const docsStore = await getTopCollectionsCarouselDocs({
          mbCity: taggedCity,
          collectionsIds: topCollectionsIds,
        });

        const carouselData = getCarouselCardsData({
          collections: topCollections,
          docsStore,
          lang,
        });

        return {
          heading,
          name,
          subCategoryPageUrl,
          carouselData: carouselData.slice(0, 10),
        };
      } catch (err) {
        sendLog({
          err,
          message: `[getSubCategoryCarousels] - 
          ${JSON.stringify({
            taggedCity,
            subCategory,
            lang,
          })}
        `,
        });
        return {};
      }
    }
  );

  const settledPromiseResults = await Promise.allSettled(
    subCategoryCarouselsPromises
  );
  const subCategoryCarouselsData = handleSettledPromiseResults(
    settledPromiseResults
  );

  return subCategoryCarouselsData || [];
};
