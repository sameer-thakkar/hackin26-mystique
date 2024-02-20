import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { getMenuUrl } from 'utils/headerUtils';
import { getSubCategoryIconUrl } from 'utils/helper';
import { sendLog } from 'utils/logger';
import { ALL } from 'const/catAndSubcatPage';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUBCATEGORY,
  SUBCATEGORY_IDS,
} from 'const/index';

export const getCategoryLandingPage = async ({
  mbCategory,
  mbCity,
  lang,
}: {
  mbCategory: string;
  mbCity: string;
  lang: string;
}) => {
  try {
    const predicatesArray = [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
        mbCategory
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
        mbCity
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
        MB_CATEGORISATION.MB_TYPE.A1_CATEGORY
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
        MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
      ),
    ];
    const prismicClient = createClient();
    const { results: filteredMicrosites } = await prismicClient.getByType(
      'microsite',
      {
        predicates: predicatesArray,
      }
    );

    if (!filteredMicrosites?.[0]) return '';

    const url = getMenuUrl({ docFound: filteredMicrosites?.[0], lang });

    return url;
  } catch (err) {
    sendLog({
      err,
      message: `[getCategoryLandingPage] - 
        ${JSON.stringify({
          mbCategory,
          mbCity,
          lang,
        })}
      `,
    });
    return '';
  }
};

export const getSubCategoryPills = async ({
  categoryData,
  attractionsHeaderMenu,
  themesHeaderMenu,
  categoryLandingPageUrl,
  isSubCategoryPage,
}: {
  categoryData: Record<string, any>;
  attractionsHeaderMenu: Record<string, any>;
  themesHeaderMenu: Record<string, any>;
  categoryLandingPageUrl: string;
  isSubCategoryPage: boolean;
}) => {
  const { subCategories } = categoryData || {};
  const mergedHeaderMenu = {
    ...attractionsHeaderMenu,
    ...themesHeaderMenu,
  };

  if (!subCategories) return [];

  let subCategoryPills = [];

  if (!isSubCategoryPage) {
    subCategoryPills = subCategories.map((subCategory: Record<string, any>) => {
      const { id, name, displayName } = subCategory || {};

      if (!id || String(id) === SUBCATEGORY_IDS[SUBCATEGORY.CITY_CARDS]) return;

      const iconUrl = getSubCategoryIconUrl(id);
      return {
        id,
        name,
        label: displayName,
        url: null,
        iconUrl,
      };
    });
  } else {
    subCategoryPills = Object.values(mergedHeaderMenu)
      .map((menuItem: Record<string, any>) => {
        const { label, url } = menuItem || {};
        const { id, name } =
          subCategories.find(
            (subCategory: Record<string, any>) =>
              label === subCategory?.displayName
          ) || {};

        if (!id || String(id) === SUBCATEGORY_IDS[SUBCATEGORY.CITY_CARDS])
          return;

        const iconUrl = getSubCategoryIconUrl(id);
        return {
          id,
          name,
          label,
          url,
          iconUrl,
        };
      })
      .filter(Boolean);
  }

  if (categoryLandingPageUrl) {
    subCategoryPills = [
      {
        id: 0,
        name: 'All',
        label: ALL,
        url: categoryLandingPageUrl,
        iconUrl: null,
      },
      ...subCategoryPills,
    ];
  }

  return subCategoryPills;
};
