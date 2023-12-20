import cloneDeep from 'lodash.clonedeep';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import { fetchCategory } from 'utils/apiUtils';
import getCityGuideDocs from 'utils/prismicUtils/getCityGuideDocs';
import getShoulderPageDocs from 'utils/prismicUtils/getShoulderPageDocs';
import { ABOUT, CITY_GUIDE, THINGS_TO_DO, VISIT } from 'const/header';
import { MB_CATEGORISATION } from 'const/index';
import generateCityAttractionsMenu from './generateCityAttractionsMenu';
import generateCityGuideMenu from './generateCityGuideMenu';
import generateShoulderPageMenu from './generateShoulderPageMenu';
import generateSubCategoryMenu from './generateSubCategoryMenu';
import {
  addMiscMenuItems,
  applyTransformations,
  isMainMenu,
  sortMenu,
} from '.';

const getCollectionMBMenu = async ({
  lang,
  categorisationMetadata,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}): Promise<Record<string, any>> => {
  const shoulderPageDocs = await getShoulderPageDocs({
    categorisationMetadata,
  });

  const cityGuideDocs = await getCityGuideDocs(categorisationMetadata);

  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const aboutMenuPromise = generateShoulderPageMenu({
    isAboutMenu: true,
    menuType: ABOUT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const visitMenuPromise = generateShoulderPageMenu({
    menuType: VISIT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const thingsToDoMenuPromise = generateShoulderPageMenu({
    menuType: THINGS_TO_DO,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const cityAttractionsMenuPromise = generateCityAttractionsMenu({
    categorisationMetadata,
    lang,
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

  const menuPromiseSettledResults = await Promise.allSettled([
    aboutMenuPromise,
    visitMenuPromise,
    thingsToDoMenuPromise,
    cityAttractionsMenuPromise,
    cityToursMenuPromise,
    cruisesMenuPromise,
    cityGuideMenuPromise,
  ]);

  const [
    aboutMenu,
    visitMenu,
    thingsToDoMenu,
    cityAttractionsMenu,
    cityToursMenu,
    cruisesMenu,
    cityGuideMenu,
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

  const menuWithMiscItems = await addMiscMenuItems({
    menu: cloneDeep(aggregatedMenu),
    docsStore: shoulderPageDocs,
    lang,
    categorisationMetadata,
  });

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
