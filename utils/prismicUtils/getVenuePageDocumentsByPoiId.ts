import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import { venuePageTgidsGq } from './venuePage/graphQuery';

export const getVenuePageDocumentsByPoiId = async ({
  poiIds,
  pageSize = 100,
  lang,
}: {
  poiIds: any[];
  pageSize: number;
  lang?: string;
}) => {
  try {
    const prismicClient = createClient();
    const { results: venuePageDocs } = await prismicClient.getByType(
      'venue_page',
      {
        pageSize,
        predicates: [
          predicate.not('document.tags', [PRISMIC_DEV_TAG]),
          predicate.any(`my.${CUSTOM_TYPES.VENUE_PAGE}.poi_id`, poiIds),
        ],
        graphQuery: venuePageTgidsGq,
        ...(lang && {
          lang,
        }),
      }
    );

    return venuePageDocs;
  } catch (error) {
    sendLog({
      message: `[getVenuePageDocumentsByPoiId] failed`,
      err: error,
    });
  }
};

export default getVenuePageDocumentsByPoiId;
