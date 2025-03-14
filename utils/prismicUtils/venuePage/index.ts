import { createClient } from 'prismicio';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { getSinglePrismicSlice, handleSettledPromiseResults } from 'utils';
import { getVenuePageBreadcrumbs } from 'utils/breadcrumbsUtils';
import { getCityListData } from 'utils/cityPageUtils/nearbyCities';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPE_VALUES,
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  SLICE_TYPES,
  TLANGUAGELOCALE,
} from 'const/index';
import { venuePageGq } from './graphQuery';
import {
  getAllShowsData,
  getCategories,
  getLandingPageGroups,
  getNearbyTheatresData,
  getPopularShows,
} from './utils';

const getVenuePageDocument = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({ req });
  const isLocalizedLang = lang !== DEFAULT_PRISMIC_LANG;
  const venuePage = await prismicClient.getByUID('venue_page', uid, {
    lang,
    graphQuery: venuePageGq,
  });
  const baseLangVenuePage = isLocalizedLang
    ? await prismicClient.getByUID('venue_page', uid, {
        lang: DEFAULT_PRISMIC_LANG,
        graphQuery: venuePageGq,
      })
    : venuePage;

  if (venuePage && Object.keys(venuePage)) {
    const { data: venuePageData } = venuePage ?? {};
    const { data: baseLangVenuePageData } = baseLangVenuePage ?? {};
    const nearbyTheatreSliceData = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.VERTICAL_CARD_GRIDS,
      slices: baseLangVenuePageData?.body2,
    });
    const {
      seating_capacity,
      mobile_banner,
      desktop_banner,
      theatre_name,
      theatre_location_url,
      theatre_location_cta,
      info,
      amenities_dropdown,
      body2,
      tagged_city,
      tagged_country,
      tagged_collection,
      title,
      description,
      image_url,
      tagged_category,
      tagged_sub_category,
      tagged_mb_type,
      is_landing_page,
      banner_heading,
      landing_page_groups,
    } = venuePageData;

    const completePageData = {
      ...venuePage,
      data: {
        ...venuePage.data,
        mbType: tagged_mb_type,
        seatingCapacity: seating_capacity,
        mobileBanner: mobile_banner,
        desktopBanner: desktop_banner,
        theatreName: theatre_name,
        theatreLocationUrl: theatre_location_url,
        theatreLocationCta: theatre_location_cta,
        theatreInfo: info,
        taggedCollection: tagged_collection,
        taggedCity: tagged_city,
        country: tagged_country,
        amenitiesDropdown: amenities_dropdown,
        descriptionSlices: body2,
        title,
        description,
        image_url,
        nearbyTheatreSliceData,
        taggedCategoryName: tagged_category,
        taggedSubCategoryName: tagged_sub_category,
        poiId: baseLangVenuePageData?.poi_id,
        isLandingPage: is_landing_page,
        bannerHeading: banner_heading,
        landingPageGroups: landing_page_groups,
      },
    };

    return {
      CMSContent: completePageData,
      ContentType: CUSTOM_TYPES.VENUE_PAGE,
    };
  } else {
    return Promise.reject();
  }
};

export const getVenuePageData = async (
  CMSContent: PrismicDocumentWithUID,
  ContentType: CUSTOM_TYPE_VALUES,
  isDev: boolean,
  host: string,
  hostname: string,
  lang: TLANGUAGELOCALE,
  cookies: any,
  currencyListPromise: Promise<any>,
  domainConfigPromise: Promise<any>
) => {
  try {
    const { uid, data } = CMSContent ?? {};

    const {
      poiId,
      nearbyTheatreSliceData,
      isLandingPage,
      landingPageGroups,
      taggedCollection,
      taggedCity,
    } = data ?? {};

    const allShowsDataPromise = getAllShowsData({
      poiId,
      language: lang,
      cookies,
      hostname,
    });
    const breadcrumbsPromise = getVenuePageBreadcrumbs(
      CMSContent,
      isLandingPage
    );
    const nearbyTheatrePromise = getNearbyTheatresData(
      nearbyTheatreSliceData,
      cookies,
      lang,
      hostname
    );

    const landingPageGroupsPromise = getLandingPageGroups(
      landingPageGroups,
      cookies,
      lang,
      hostname
    );
    const popularShowsPromise = getPopularShows(
      taggedCollection,
      hostname,
      cookies,
      lang
    );
    const browseCategoriesPromise = getCategories(
      taggedCity,
      lang,
      cookies,
      uid
    );

    const cityListDataPromise = getCityListData({
      cookies,
      mbCity: taggedCity,
      lang,
    });

    const allPromiseSettledResults = await Promise.allSettled([
      allShowsDataPromise,
      breadcrumbsPromise,
      nearbyTheatrePromise,
      landingPageGroupsPromise,
      popularShowsPromise,
      browseCategoriesPromise,
      cityListDataPromise,
    ]);

    const [
      showsData,
      breadcrumbs,
      nearbyTheatresData,
      landingPageData,
      popularShowsData,
      browseCategoriesData,
      cityListData,
    ] = handleSettledPromiseResults(allPromiseSettledResults, uid, true);

    const { availableShowsData, allShowPageUids, inventorySlotData } =
      showsData ?? {};

    const primaryCity = cityListData?.get(taggedCity);
    const primaryCountry = primaryCity?.country;
    const activeCurrency = primaryCountry?.currency?.code;

    return {
      CMSContent: {
        ...CMSContent,
        availableShowsData,
        allShowPageUids,
        inventorySlotData,
        nearbyTheatresData,
        landingPageData,
        popularShowsData,
        browseCategoriesData,
      },
      ...(primaryCity && { primaryCity }),
      ...(primaryCountry && { primaryCountry }),
      ...(activeCurrency && { activeCurrency }),
      uid,
      ContentType,
      lang,
      isDev,
      breadcrumbs,
      host,
      currencyList: await currencyListPromise,
      domainConfig: await domainConfigPromise,
    };
  } catch (err) {
    sendLog({
      message: '[getVenuePageData] - Error while fetching Venue Page Data',
      err,
    });
  }
};

export default getVenuePageDocument;
