import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import getRankedDocuments from 'utils/headerUtils/getRankedDocuments';
import { PRISMIC_DEV_TAG, PRISMIC_FIELD_ID } from 'const/index';

type TGetSubattractionPageClientQueryPromise = {
  docType: 'microsite' | 'content_page';
  mbCity: string;
  mbCollection: string;
};

const getSubattractionPageClientQueryPromise = ({
  docType,
  mbCity,
  mbCollection,
}: TGetSubattractionPageClientQueryPromise) => {
  const prismicClient = createClient();
  const promise = prismicClient.getAllByType(docType, {
    pageSize: 50,
    predicates: [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(`my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CITY}`, mbCity),
      predicate.at(
        `my.${docType}.${PRISMIC_FIELD_ID.PARENT_COLLECTION_ID}`,
        mbCollection
      ),
    ],
  });

  return promise;
};

const getSubattractionPageDocs = async ({
  mbCity,
  mbCollection,
}: {
  mbCity: string | null;
  mbCollection: string | null;
}) => {
  if (!mbCity || !mbCollection) return [];

  const micrositesPromises = getSubattractionPageClientQueryPromise({
    docType: 'microsite',
    mbCity,
    mbCollection,
  });

  const contentPagesPromises = getSubattractionPageClientQueryPromise({
    docType: 'content_page',
    mbCity,
    mbCollection,
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

export default getSubattractionPageDocs;
