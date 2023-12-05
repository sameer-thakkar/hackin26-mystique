import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import {
  getAlternateLanguageDocUid,
  getFinalisedBannerImages,
  handleSettledPromiseResults,
} from 'utils';
import { fetchNearbyCityList } from 'utils/apiUtils';
import {
  IGetCityListData,
  IGetLangBasedCitiesData,
  IGetNearbyCities,
} from 'utils/cityPageUtils/interface';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import { shouldIncludeinQueries as shouldIncludeDoc } from 'utils/headerUtils';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';

const {
  MB_TYPE: { A1_HOMEPAGE },
} = MB_CATEGORISATION;
const { MICROSITE } = CUSTOM_TYPES;

const { TAGGED_MB_TYPE, TAGGED_CITY, TAGGED_COUNTRY } = PRISMIC_FIELD_ID;

const getLangBasedCitiesData = ({
  prismicDocs,
  lang,
  cityListData,
}: IGetLangBasedCitiesData) => {
  const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
  const getUid = isBaselang ? getUidFromRootLevel : getAlternateLanguageDocUid;
  const citiesPrismicData: Array<object> = [];
  prismicDocs.forEach((currentDoc: PrismicDocumentWithUID) => {
    const { tagged_city, tagged_country, images } = currentDoc.data;
    const currentCityData = cityListData.get(tagged_city);
    const { discoverable } = currentCityData || {};

    const uid = getUid({ doc: currentDoc, lang });
    if (
      uid &&
      tagged_city &&
      shouldIncludeDoc(currentDoc) &&
      currentCityData &&
      discoverable
    ) {
      const cityData = {
        uid,
        prismicData: {
          taggedCity: tagged_city,
          taggedCountry: tagged_country,
          bannerImages: getFinalisedBannerImages(images),
        },
        cityHOData: currentCityData,
      };
      citiesPrismicData.push(cityData);
    }
  });
  return citiesPrismicData.sort(
    (cityA: Record<string, any>, cityB: Record<string, any>) =>
      cityA.cityHOData.computedRank - cityB.cityHOData.computedRank
  );
};

const getCityListData = async ({ cookies, mbCity }: IGetCityListData) => {
  const { cities } = await fetchNearbyCityList({
    cookies,
    params: {},
    cityCode: mbCity,
  });
  const cityDataMap = new Map();
  cities.forEach((city: Record<string, any>, index: number) => {
    const { cityCode } = city;
    cityDataMap.set(cityCode, { ...city, computedRank: index + 1 });
  });

  return cityDataMap;
};

export const getNearbyCities = async ({
  mbCountry,
  mbCity,
  lang,
  cookies,
}: IGetNearbyCities) => {
  try {
    const prismicDataPromise = Client().query(
      [
        Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
        Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, A1_HOMEPAGE),
        Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_COUNTRY}`, mbCountry),
        Prismic.Predicates.not(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
        Prismic.Predicates.has(`my.${MICROSITE}.${TAGGED_CITY}`),
      ],
      { pageSize: 30 }
    );

    const cityListDataPromise = getCityListData({ cookies, mbCity });
    const allResult = await Promise.allSettled([
      prismicDataPromise,
      cityListDataPromise,
    ]);

    const [prismicData, cityListData] = handleSettledPromiseResults(allResult);
    const currentCityData = cityListData.get(mbCity);

    const result = getLangBasedCitiesData({
      prismicDocs: prismicData.results,
      lang,
      cityListData,
    });

    return { nearbyCitiesData: result, currentCityData };
  } catch (err) {
    sendLog({
      message: `getNearbyCities failed. Citycode:${mbCity}, lang${lang}, ${mbCountry}`,
    });
    return {};
  }
};
