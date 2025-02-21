import cloneDeep from 'lodash.clonedeep';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import { fetchCategory } from 'utils/apiUtils';
import getCityGuideDocs from 'utils/prismicUtils/getCityGuideDocs';
import getShoulderPageDocs from 'utils/prismicUtils/getShoulderPageDocs';
import { labeledPromiseAllSettled } from 'utils/promiseUtils';
import { CITY_GUIDE } from 'const/header';
import { MB_CATEGORISATION } from 'const/index';
import generateCityAttractionsMenu from './generateCityAttractionsMenu';
import generateCityGuideMenu from './generateCityGuideMenu';
import generateSubCategoryMenu from './generateSubCategoryMenu';
import {
  applyTransformations,
  getNormalisedMiscDocs,
  isMainMenu,
  mergeMiscDocsWithMenu,
  sortMenu,
} from '.';

const getNonCollectionMBMenu = async ({
  lang,
  categorisationMetadata,
  currency,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
  currency?: string;
}): Promise<Record<string, any>> => {
  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const cityGuideDocsPromise = getCityGuideDocs(categorisationMetadata);

  const shoulderPageDocsPromise = getShoulderPageDocs({
    categorisationMetadata,
    filterMiscDocs: true,
    lang,
  });

  const { cityGuideDocs, shoulderPageDocs } = await labeledPromiseAllSettled([
    {
      promise: cityGuideDocsPromise,
      label: 'cityGuideDocs',
    },
    { promise: shoulderPageDocsPromise, label: 'shoulderPageDocs' },
  ] as const);

  const topThingsToDoMenuPromise = generateCityAttractionsMenu({
    categorisationMetadata,
    lang,
    currency,
  });

  const cityToursMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TOURS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cityGuideMenuPromise = generateCityGuideMenu({
    menuType: CITY_GUIDE,
    categorisationMetadata,
    lang,
    docsStore: cityGuideDocs,
  });

  const attractionsMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TICKETS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cruisesMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.CRUISES,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const miscDocsPromise = getNormalisedMiscDocs({
    docsStore: shoulderPageDocs,
    lang,
    categorisationMetadata,
  });

  const menuPromiseSettledResults = await Promise.allSettled([
    topThingsToDoMenuPromise,
    cityToursMenuPromise,
    cityGuideMenuPromise,
    attractionsMenuPromise,
    cruisesMenuPromise,
    miscDocsPromise,
  ]);

  const [
    topThingsToDoMenu,
    cityToursMenu,
    cityGuideMenu,
    attractionsMenu,
    cruisesMenu,
    miscDocs,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...topThingsToDoMenu,
    ...cityToursMenu,
    ...cityGuideMenu,
    ...attractionsMenu,
    ...cruisesMenu,
  };

  const menu = cloneDeep(aggregatedMenu);

  const menuWithMiscItems = mergeMiscDocsWithMenu({ miscDocs, menu, lang });

  const transformedMenu = applyTransformations(cloneDeep(menuWithMiscItems));

  Object.keys(transformedMenu).forEach((menuKey) => {
    if (Object.keys(transformedMenu[menuKey]).length === 0) {
      delete transformedMenu[menuKey];
    }
    if (typeof transformedMenu[menuKey] === 'object') {
      const something = transformedMenu[menuKey];
      transformedMenu[menuKey] = {
        label: menuKey,
        menu: something,
        mainMenu: isMainMenu({
          isCollectionMB: false,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isCollectionMB: false,
  });

  return finalMenu;
};

export default getNonCollectionMBMenu;
