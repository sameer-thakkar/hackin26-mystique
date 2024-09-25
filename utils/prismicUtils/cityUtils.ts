import { generateCityPageData } from 'utils/cityPageUtils';
import { IGenerateCityPageData } from 'utils/cityPageUtils/interface';
import { DESIGN, LANGUAGE_MAP, MB_TYPES } from 'const/index';

export const getCityPageData = async ({
  mbCity,
  taggedMbType,
  mbCountry,
  cookies,
  lang,
  mbDesign,
}: IGenerateCityPageData & { taggedMbType: string; mbDesign: string }) => {
  let cityPageData = {};
  let isCityPageMB = false;
  if (
    (taggedMbType === MB_TYPES.A1_HOMEPAGE ||
      mbDesign === DESIGN.PRIVATE_AIRPORT_TRANSFERS) &&
    mbCity
  ) {
    isCityPageMB = true;
    cityPageData = await generateCityPageData({
      mbCity,
      mbCountry,
      lang: lang || LANGUAGE_MAP.en.locale,
      cookies,
    });

    const {
      nearbyAndCurrentCityData: { currentCityData },
    } = cityPageData as Record<string, any>;
    const { discoverable } = currentCityData || {};

    isCityPageMB = !!discoverable;
  }

  return {
    mbLocationData: { mbCity, mbCountry },
    isCityPageMB,
    cityPageData,
  };
};
