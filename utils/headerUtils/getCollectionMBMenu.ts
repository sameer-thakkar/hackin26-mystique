import cloneDeep from 'lodash.clonedeep';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import { fetchCategory } from 'utils/apiUtils';
import getCityGuideDocs from 'utils/prismicUtils/getCityGuideDocs';
import getShoulderPageDocs from 'utils/prismicUtils/getShoulderPageDocs';
import getSubattractionPageDocs from 'utils/prismicUtils/getSubattractionPageDocs';
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

const getCollectionMBMenu = async ({
  uid,
  lang,
  categorisationMetadata,
  currency,
}: {
  uid: string;
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
  currency?: string;
}): Promise<Record<string, any>> => {
  const { tagged_city, tagged_collection } = categorisationMetadata;

  const shoulderPageDocsPromise = getShoulderPageDocs({
    categorisationMetadata,
  });

  const subattractionPageDocsPromise = getSubattractionPageDocs({
    mbCity: tagged_city,
    mbCollection: tagged_collection,
  });

  const cityGuideDocsPromise = getCityGuideDocs(categorisationMetadata);

  const categoryApiDataPromise = fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const {
    shoulderPageDocs,
    subattractionPageDocs,
    cityGuideDocs,
    categoryApiData,
  } = await labeledPromiseAllSettled([
    {
      promise: shoulderPageDocsPromise,
      label: 'shoulderPageDocs',
    },
    {
      promise: subattractionPageDocsPromise,
      label: 'subattractionPageDocs',
    },
    { promise: cityGuideDocsPromise, label: 'cityGuideDocs' },
    { promise: categoryApiDataPromise, label: 'categoryApiData' },
  ] as const);

  const aboutMenuPromise = generateShoulderPageMenu({
    isAboutMenu: true,
    menuType: ABOUT,
    pageUid: uid,
    categorisationMetadata,
    lang,
    shoulderPageDocsStore: shoulderPageDocs,
    subattractionPageDocsStore: subattractionPageDocs,
  });

  const visitMenuPromise = generateShoulderPageMenu({
    menuType: VISIT,
    pageUid: uid,
    categorisationMetadata,
    lang,
    shoulderPageDocsStore: shoulderPageDocs,
  });

  const thingsToDoMenuPromise = generateShoulderPageMenu({
    menuType: THINGS_TO_DO,
    pageUid: uid,
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

  const cruisesMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.CRUISES,
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
    cruisesMenuPromise,
    cityGuideMenuPromise,
    miscDocsPromise,
  ]);

  const [
    aboutMenu,
    visitMenu,
    thingsToDoMenu,
    cityAttractionsMenu,
    cityToursMenu,
    cruisesMenu,
    cityGuideMenu,
    miscDocs,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...aboutMenu,
    ...visitMenu,
    ...thingsToDoMenu,
    ...cityAttractionsMenu,
    ...cityToursMenu,
    ...cruisesMenu,
    ...cityGuideMenu,
  };

  const menu: Record<string, any> = cloneDeep(aggregatedMenu);

  const menuWithMiscItems = mergeMiscDocsWithMenu({ menu, miscDocs, lang });

  const transformedMenu = applyTransformations(cloneDeep(menuWithMiscItems));

  const { tagged_mb_type: taggedMbType } = categorisationMetadata;

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
          isCollectionMB: true,
          isA1CollectionMB:
            taggedMbType === MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isCollectionMB: true,
  });

  return finalMenu;
};

export default getCollectionMBMenu;
