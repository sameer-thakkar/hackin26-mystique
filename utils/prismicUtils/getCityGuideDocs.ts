import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import getRankedDocuments from 'utils/headerUtils/getRankedDocuments';
import { sendLog } from 'utils/logger';
import {
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
} from 'const/index';

const getCityGuideClientQueryPromise = ({
  docType,
  mbCity,
}: {
  docType: 'microsite' | 'content_page';
  mbCity: string | null;
}) => {
  const prismicClient = createClient();
  const predicatesArray = [
    predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
    predicate.at(
      `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
      MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE
    ),
  ];

  if (mbCity) {
    predicatesArray.push(
      predicate.at(`my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CITY}`, mbCity)
    );
  }

  const promise = prismicClient.getAllByType(docType, {
    pageSize: 10,
    predicates: predicatesArray,
  });

  sendLog({
    message: {
      documentType: docType,
      functionality: 'promise',
      msg: 'Prismic API call from Canary',
    },
  });

  return promise;
};

const getCityGuideDocs = async (
  categorisationMetadata: TCategorisationMetadata
) => {
  const { tagged_city: mbCity } = categorisationMetadata;

  const micrositesPromises = getCityGuideClientQueryPromise({
    docType: 'microsite',
    mbCity,
  });

  const contentPagesPromises = getCityGuideClientQueryPromise({
    docType: 'content_page',
    mbCity,
  });

  const aggregatedPromise = await Promise.allSettled([
    micrositesPromises,
    contentPagesPromises,
  ]);

  const [filteredMicrosites, filteredContentPages] =
    handleSettledPromiseResults(aggregatedPromise);

  const aggregatedDocsStore = [...filteredMicrosites, ...filteredContentPages];

  return getRankedDocuments({ docs: aggregatedDocsStore });
};

export default getCityGuideDocs;
