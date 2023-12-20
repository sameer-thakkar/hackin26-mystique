import { createClient } from 'prismicio';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES } from 'const/index';
import { venuePageGq } from './graphQuery';

const getVenuePageDocument = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({ req });
  const venuePage = await prismicClient.getByUID('venue_page', uid, {
    lang,
    graphQuery: venuePageGq,
  });

  sendLog({
    message: {
      uid,
      documentType: CUSTOM_TYPES.VENUE_PAGE,
      lang,
      functionality: 'venuePage',
      msg: 'Prismic API call from Canary',
    },
  });

  if (venuePage && Object.keys(venuePage)) {
    const { data: venuePageData } = venuePage ?? {};
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
        taggedCategoryName: tagged_category,
        taggedSubCategoryName: tagged_sub_category,
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

export default getVenuePageDocument;
