import cloneDeep from 'lodash.clonedeep';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import { fetchCategory } from 'utils/apiUtils';
import getCityGuideDocs from 'utils/prismicUtils/getCityGuideDocs';
import getShoulderPageDocs from 'utils/prismicUtils/getShoulderPageDocs';
import { labeledPromiseAllSettled } from 'utils/promiseUtils';
import { ABOUT, CITY_GUIDE, THINGS_TO_DO, VISIT } from 'const/header';
import { MB_CATEGORISATION } from 'const/index';
import generateCityAttractionsMenu from './generateCityAttractionsMenu';
import generateCityGuideMenu from './generateCityGuideMenu';
import generateShoulderPageMenu from './generateShoulderPageMenu';
import generateSubCategoryMenu from './generateSubCategoryMenu';
import {
  applyTransformations,
  getNormalisedMiscDocs,
  isMainMenu,
  mergeMiscDocsWithMenu,
  sortMenu,
} from '.';

const getA2CatMBMenu = async ({
  lang,
  categorisationMetadata,
  currency,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
  currency?: string;
}): Promise<Record<string, any>> => {
  const shoulderPageDocsPromise = getShoulderPageDocs({
    categorisationMetadata,
    isA2CatMB: true,
  });
  const cityGuideDocsPromise = getCityGuideDocs(categorisationMetadata);

  const categoryApiDataPromise = fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const { shoulderPageDocs, cityGuideDocs, categoryApiData } =
    await labeledPromiseAllSettled([
      {
        promise: shoulderPageDocsPromise,
        label: 'shoulderPageDocs',
      },
      { promise: cityGuideDocsPromise, label: 'cityGuideDocs' },
      { promise: categoryApiDataPromise, label: 'categoryApiData' },
    ] as const);

  const aboutMenuPromise = generateShoulderPageMenu({
    isAboutMenu: true,
    menuType: ABOUT,
    categorisationMetadata,
    lang,
    shoulderPageDocsStore: shoulderPageDocs,
  });

  const visitMenuPromise = generateShoulderPageMenu({
    menuType: VISIT,
    categorisationMetadata,
    lang,
    shoulderPageDocsStore: shoulderPageDocs,
  });

  const thingsToDoMenuPromise = generateShoulderPageMenu({
    menuType: THINGS_TO_DO,
    categorisationMetadata,
    lang,
    shoulderPageDocsStore: shoulderPageDocs,
  });

  const cityAttractionsMenuPromise = generateCityAttractionsMenu({
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

  const miscDocsPromise = getNormalisedMiscDocs({
    docsStore: shoulderPageDocs,
    lang,
    categorisationMetadata,
  });

  const menuPromiseSettledResults = await Promise.allSettled([
    aboutMenuPromise,
    visitMenuPromise,
    thingsToDoMenuPromise,
    cityAttractionsMenuPromise,
    cityToursMenuPromise,
    cityGuideMenuPromise,
    miscDocsPromise,
  ]);

  const [
    aboutMenu,
    visitMenu,
    thingsToDoMenu,
    cityAttractionsMenu,
    cityToursMenu,
    cityGuideMenu,
    miscDocs,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...aboutMenu,
    ...visitMenu,
    ...thingsToDoMenu,
    ...cityAttractionsMenu,
    ...cityToursMenu,
    ...cityGuideMenu,
  };
  const menu: Record<string, any> = cloneDeep(aggregatedMenu);

  const menuWithMiscItems = mergeMiscDocsWithMenu({ menu, miscDocs, lang });

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
          isA2MB: true,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isA2MB: true,
  });

  return finalMenu;
};

export default getA2CatMBMenu;
