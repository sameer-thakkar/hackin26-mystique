import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import getRankedDocuments from 'utils/headerUtils/getRankedDocuments';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
} from 'const/index';

const getTopCollectionsCarouselDocs = async ({
  mbCity,
  collectionsIds,
}: {
  mbCity: string;
  collectionsIds: Array<string>;
}) => {
  try {
    const prismicClient = createClient();

    const micrositeData = await prismicClient.getAllByType('microsite', {
      pageSize: 50,
      predicates: [
        predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
        predicate.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
          mbCity
        ),
        predicate.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
          MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
        ),
        predicate.any(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
          [
            MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
            MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
            MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
          ]
        ),
        predicate.any(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
          collectionsIds
        ),
      ],
    });

    return getRankedDocuments({
      docs: micrositeData,
      ranking: [
        MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
        MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
        MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
      ],
    });
  } catch (err) {
    sendLog({
      err,
      message: `[getTopCollectionsCarouselDocs] - 
          ${JSON.stringify({
            mbCity,
            collectionsIds,
          })}
        `,
    });
    return [];
  }
};
export default getTopCollectionsCarouselDocs;
