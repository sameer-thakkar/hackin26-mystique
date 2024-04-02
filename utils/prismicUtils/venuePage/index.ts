import { createClient } from 'prismicio';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { getSinglePrismicSlice, handleSettledPromiseResults } from 'utils';
import { getVenuePageBreadcrumbs } from 'utils/breadcrumbsUtils';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPE_VALUES,
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  SLICE_TYPES,
  TLANGUAGELOCALE,
} from 'const/index';
import { venuePageGq } from './graphQuery';
import { getAllShowsDataPromise, getNearbyTheatresDataPromise } from './utils';

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
        city: tagged_city,
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
    const { poiId, nearbyTheatreSliceData } = data ?? {};

    const allShowsDataPromise = getAllShowsDataPromise({
      poiId,
      language: lang,
      cookies,
      hostname,
    });
    const breadcrumbsPromise = getVenuePageBreadcrumbs(CMSContent);
    const nearbyTheatrePromise = getNearbyTheatresDataPromise(
      nearbyTheatreSliceData,
      cookies,
      lang,
      hostname
    );

    const allPromiseSettledResults = await Promise.allSettled([
      allShowsDataPromise,
      breadcrumbsPromise,
      nearbyTheatrePromise,
    ]);
    const [showsData, breadcrumbs, nearbyTheatresData] =
      handleSettledPromiseResults(allPromiseSettledResults);

    const { availableShowsData, allShowPageUids, inventorySlotData } =
      showsData ?? {};

    return {
      CMSContent: {
        ...CMSContent,
        availableShowsData,
        allShowPageUids,
        inventorySlotData,
        nearbyTheatresData,
      },
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
