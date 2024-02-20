import { PrismicDocumentWithUID } from '@prismicio/types';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import { fetchCategory } from 'utils/apiUtils';
import { getPageHeading } from 'utils/categoryPageUtils/banner';
import { getCityCategoriesCarousel } from 'utils/categoryPageUtils/cityCategoriesCarousel';
import { getSubCategoryCards } from 'utils/categoryPageUtils/subCategoryCards';
import { getSubCategoryCarousels } from 'utils/categoryPageUtils/subCategoryCarousels';
import {
  getCategoryLandingPage,
  getSubCategoryPills,
} from 'utils/categoryPageUtils/subCategoryPills';
import { getTopCollectionsCarousel } from 'utils/categoryPageUtils/topCollectionsCarousel';
import { sendLog } from 'utils/logger';
import { convertUidToUrl } from 'utils/urlUtils';
import { ALL } from 'const/catAndSubcatPage';
import { MB_CATEGORISATION } from 'const/index';

export const getCatAndSubCatPageData = async ({
  doc,
  attractionsHeaderMenu,
  themesHeaderMenu,
  cookies,
}: {
  doc: PrismicDocumentWithUID;
  attractionsHeaderMenu: Record<string, any>;
  themesHeaderMenu: Record<string, any>;
  cookies: Record<string, any>;
}) => {
  const { uid, lang, data } = doc || {};

  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategory,
    tagged_sub_category: taggedSubCategory,
    tagged_mb_type: taggedMbType,
  } = data?.baseLangCategorisationMetadata || {};

  if (!taggedCity || !taggedCategory) return {};

  let categoryApiData: Record<string, any> = {};
  try {
    categoryApiData = await fetchCategory({
      city: taggedCity,
      language: getHeadoutLanguagecode(lang),
      cookies,
    });
  } catch (err) {
    sendLog({
      err,
      message: `[getCatAndSubCatPageData] - 
      ${JSON.stringify({
        taggedCity,
        taggedCategory,
        taggedSubCategory,
        taggedMbType,
        lang,
      })}
    `,
    });
    return {};
  }

  const { categories } = categoryApiData;
  const categoryData =
    categories?.find(
      (category: Record<string, any>) => category.name === taggedCategory
    ) || {};
  const { subCategories } = categoryData || {};
  const subCategoryData =
    subCategories?.find(
      (subCategory: Record<string, any>) =>
        subCategory.name === taggedSubCategory
    ) || {};

  const isSubCategoryPage =
    taggedMbType === MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY;

  const categoryLandingPageUrl = isSubCategoryPage
    ? await getCategoryLandingPage({
        mbCity: taggedCity,
        mbCategory: taggedCategory,
        lang,
      })
    : convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });

  const pageHeading = getPageHeading({
    taggedMbType,
    categoryData,
    subCategoryData,
  });

  const subCategoryPillsPromise = getSubCategoryPills({
    categoryData,
    attractionsHeaderMenu,
    themesHeaderMenu,
    categoryLandingPageUrl,
    isSubCategoryPage,
  });

  const topCollectionsCarouselPromise = !isSubCategoryPage
    ? getTopCollectionsCarousel({
        taggedCity,
        categoryData,
        lang,
        cookies,
      })
    : [];

  const subCategoryCarouselsPromise = !isSubCategoryPage
    ? getSubCategoryCarousels({
        taggedCity,
        subCategories,
        attractionsHeaderMenu,
        themesHeaderMenu,
        lang,
        cookies,
      })
    : [];

  const subCategoryCardsDataPromise = isSubCategoryPage
    ? getSubCategoryCards({
        taggedCity,
        subCategoryData,
        lang,
        cookies,
      })
    : [];

  const cityCategoriesCarouselPromise = getCityCategoriesCarousel({
    taggedCity,
    taggedCategory,
    categories,
    lang,
  });

  const settledPromiseResults = await Promise.allSettled([
    subCategoryPillsPromise,
    topCollectionsCarouselPromise,
    subCategoryCarouselsPromise,
    subCategoryCardsDataPromise,
    cityCategoriesCarouselPromise,
  ]);

  const [
    subCategoryPills,
    topCollectionsCarousel,
    subCategoryCarousels,
    subCategoryCardsData,
    cityCategoriesCarousel,
  ] = handleSettledPromiseResults(settledPromiseResults, uid);

  const filteredSubCategoryPills = subCategoryPills.filter(
    (subCategoryPill: Record<string, any>) => {
      if (isSubCategoryPage) return true;

      const { name, label } = subCategoryPill || {};
      if (label === ALL) return true;
      return subCategoryCarousels.some(
        (subCategoryCarousel: Record<string, any>) =>
          name === subCategoryCarousel?.name &&
          subCategoryCarousel?.carouselData?.length > 0
      );
    }
  );

  const { subCategoryCards, subCategoryCardsRanking } =
    subCategoryCardsData || {};

  return {
    isSubCategoryPage,
    taggedCity,
    pageHeading,
    subCategoryPills: filteredSubCategoryPills,
    categoryData,
    subCategoryData,
    topCollectionsCarousel,
    subCategoryCarousels,
    subCategoryCards,
    subCategoryCardsRanking,
    cityCategoriesCarousel,
    categoryLandingPageUrl,
  };
};
