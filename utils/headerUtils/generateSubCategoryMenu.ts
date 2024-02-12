import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
} from 'const/index';
import getRankedDocuments from './getRankedDocuments';
import shouldIncludeinQueries from './shouldIncludeInQueries';
import { getMenuName, getMenuUrl, getSubCategoriesData } from '.';

type TCategoryApiData = {
  categories: Record<string, any>[];
  starredCategoriesAndSubCategories: Record<string, any>[];
  city: string | null;
};

const generateSubCategoryMenu = async ({
  parentCategory,
  categorisationMetadata,
  categoryApiData,
  lang,
}: {
  parentCategory: string;
  categorisationMetadata: TCategorisationMetadata;
  categoryApiData: TCategoryApiData;
  lang: string;
}) => {
  try {
    const prismicClient = createClient();

    const { tagged_city: mbCity } = categorisationMetadata;

    const subCategories = getSubCategoriesData({
      categoriesData: categoryApiData.categories,
      parentCategory,
    });
    const subCategoriesArray = Object.values(subCategories).reduce(
      (acc: string[], subcat: Record<string, string>) => {
        acc.push(subcat.baseLangName);
        return acc;
      },
      []
    );

    const predicatesArray = [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
        MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
      ),
      predicate.any(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
        [
          MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
          MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
          MB_CATEGORISATION.MB_TYPE.B1_GLOBAL_HOMEPAGE,
        ]
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
        parentCategory
      ),
      predicate.any(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_SUB_CATEGORY}`,
        subCategoriesArray
      ),
    ];

    if (mbCity) {
      predicatesArray.push(
        predicate.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
          mbCity
        )
      );
    }

    const filteredMicrosites = await prismicClient.getAllByType('microsite', {
      pageSize: 100,
      predicates: predicatesArray,
    });

    const docsStore = getRankedDocuments({ docs: filteredMicrosites });

    const menu = Object.keys(subCategories).reduce((acc, subcat) => {
      const subCategoryData =
        subCategories[subcat as keyof typeof subCategories];
      const { baseLangName, label } = subCategoryData;

      const docFound = docsStore?.find(
        (doc) =>
          baseLangName === doc?.data?.tagged_sub_category &&
          shouldIncludeinQueries(doc)
      );

      if (docFound) {
        const url = getMenuUrl({ docFound, lang });
        if (label && url) {
          return {
            ...acc,
            [subcat]: {
              label,
              url,
            },
          };
        }
      }
      return acc;
    }, {});

    const menuName = getMenuName({ parentCategory });

    return { [menuName]: menu };
  } catch (error) {
    sendLog({
      message: `[generateSubCategoryMenu] failed`,
      err: error,
    });
  }
};

export default generateSubCategoryMenu;
