import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import { sendLog } from 'utils/logger';
import {
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  VIENNA_CONCERT_UID,
} from 'const/index';

const getConcertCollectionClientQueryPromise = ({
  docType,
  mbCollection,
}: {
  docType: 'microsite' | 'venue_page' | 'content_page';
  mbCollection: string;
}) => {
  const prismicClient = createClient();
  return prismicClient.getByType(docType, {
    predicates: [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(
        `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
        mbCollection
      ),
      predicate.any(`document.tags`, [VIENNA_CONCERT_UID]),
    ],
    pageSize: 100,
  });
};

const getConcertCollectionDocs = async (mbCollection: string | null) => {
  try {
    if (!mbCollection) return [];

    const micrositesPromises = getConcertCollectionClientQueryPromise({
      docType: 'microsite',
      mbCollection,
    });

    const venuePagesPromises = getConcertCollectionClientQueryPromise({
      docType: 'venue_page',
      mbCollection,
    });

    const aggregatedPromise = await Promise.allSettled([
      micrositesPromises,
      venuePagesPromises,
    ]);

    const [
      filteredMicrosites,
      filteredVenuePages,
    ] = handleSettledPromiseResults(aggregatedPromise);

    const aggregatedDocsStore = [
      ...filteredMicrosites?.results,
      ...filteredVenuePages?.results,
    ];

    return aggregatedDocsStore;
  } catch (error) {
    sendLog({ err: error });
    return [];
  }
};

export default getConcertCollectionDocs;
