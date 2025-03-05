import { handleSettledPromiseResults } from 'utils';
import { fetchBannerData } from 'utils/apiUtils';
import { getCategoriesData } from 'utils/cityPageUtils/categories';
import {
  getCityTopCollections,
  getNearbyCitiesCollections,
} from 'utils/cityPageUtils/cityCollections';
import { getCityGuideData } from 'utils/cityPageUtils/cityGuide';
import { IGenerateCityPageData } from 'utils/cityPageUtils/interface';
import { getNearbyCities } from 'utils/cityPageUtils/nearbyCities';
import { BANNER_API_PARAMS } from 'const/index';

export const generateCityPageData = async ({
  mbCountry,
  mbCity,
  lang,
  cookies,
}: IGenerateCityPageData) => {
  const cityPageBannerPromise = fetchBannerData({
    cookies,
    params: {
      city: mbCity,
      platform: BANNER_API_PARAMS.PLATFORM.DESKTOP,
      'resource-type': BANNER_API_PARAMS.RESOURCE_TYPE.CITY_BANNER,
    },
  });

  //top attractions section
  const cityTopCollectionsPromise = getCityTopCollections({
    mbCity,
    lang,
    cookies,
  });

  //cities nearby section
  const nearbyAndCurrentCityPromise = getNearbyCities({
    mbCountry,
    mbCity,
    lang,
    cookies,
  });

  //go-to {city} guide section
  const cityGuidePromise = getCityGuideData({ mbCity, lang });

  //go beyond {city} section
  const nearbyTopCollectionsPromise = getNearbyCitiesCollections({
    mbCity,
    lang,
    cookies,
  });

  // popular categories and explore section
  const categoriesPromise = getCategoriesData({ lang, mbCity, cookies });

  const allPromiseSettledResults = await Promise.allSettled([
    cityPageBannerPromise,
    cityTopCollectionsPromise,
    nearbyAndCurrentCityPromise,
    cityGuidePromise,
    nearbyTopCollectionsPromise,
    categoriesPromise,
  ]);

  const [
    cityPageBannerData,
    cityTopCollectionsData,
    nearbyAndCurrentCityData,
    cityGuideData,
    nearbyTopCollectionsData,
    categoriesData,
  ] = handleSettledPromiseResults(allPromiseSettledResults);
  return {
    cityTopCollectionsData,
    cityPageBannerData,
    nearbyAndCurrentCityData,
    cityGuideData,
    nearbyTopCollectionsData,
    categoriesData,
  };
};
