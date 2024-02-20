import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { getMenuUrl } from 'utils/headerUtils';
import getRankedDocuments from 'utils/headerUtils/getRankedDocuments';
import shouldIncludeinQueries from 'utils/headerUtils/shouldIncludeInQueries';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
} from 'const/index';

const getCityCategoriesCarouselDocs = async ({
  mbCity,
  mbCategory,
  categories,
}: {
  mbCity: string;
  mbCategory: string;
  categories: Array<string>;
}) => {
  try {
    const predicatesArray = [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
        mbCity
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
        MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
      ),
      predicate.any(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
        [
          MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
        ]
      ),
      predicate.any(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
        categories
      ),
      predicate.not(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
        mbCategory
      ),
    ];
    const prismicClient = createClient();
    const { results } = await prismicClient.getByType('microsite', {
      pageSize: 50,
      predicates: predicatesArray,
    });

    const filteredMicrosites = results?.filter((doc) => {
      const { data } = doc || {};
      const { tagged_sub_category: taggedSubCategory } = data || {};
      return !taggedSubCategory;
    });

    return getRankedDocuments({
      docs: filteredMicrosites,
      ranking: [
        MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
        MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
        MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
      ],
    });
  } catch (err) {
    sendLog({
      err,
      message: `[getCityCategoriesCarouselDocs] - 
      ${JSON.stringify({
        mbCity,
        mbCategory,
        categories,
      })}
    `,
    });
    return [];
  }
};

export const getCityCategoriesCarousel = async ({
  taggedCity,
  taggedCategory,
  categories,
  lang,
}: {
  taggedCity: string;
  taggedCategory: string;
  categories: Array<Record<string, any>>;
  lang: string;
}) => {
  const categoriesArray = categories.map((category: Record<string, string>) => {
    return category?.name;
  });

  const docsStore = await getCityCategoriesCarouselDocs({
    mbCity: taggedCity,
    mbCategory: taggedCategory,
    categories: categoriesArray,
  });

  const carouselData = categories.reduce(
    (acc: Record<string, any>[], category) => {
      const { id, name, displayName, medias } = category || {};

      const docFound = docsStore?.find(
        (doc) =>
          name === doc?.data?.tagged_category && shouldIncludeinQueries(doc)
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
            media:
              medias?.find(
                (media: Record<string, any>) => media.type === 'IMAGE'
              ) || {},
            url,
          },
        ];
      }
      return acc;
    },
    []
  );

  return carouselData;
};
