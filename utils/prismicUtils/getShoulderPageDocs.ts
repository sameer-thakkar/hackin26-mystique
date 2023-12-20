import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import getRankedDocuments from 'utils/headerUtils/getRankedDocuments';
import { sendLog } from 'utils/logger';
import { MISC } from 'const/header';
import { PRISMIC_DEV_TAG, PRISMIC_FIELD_ID } from 'const/index';

type TGetShoulerPageClientQueryPromise = {
  docType: 'microsite' | 'content_page';
  mbCity: string | null;
  mbCollection: string | null;
  mbCategory: string | null;
  mbSubCategory: string | null;
  filterMiscDocs?: boolean;
  lang?: string;
};

const getShoulderPageClientQueryPromise = ({
  docType,
  lang,
  mbCity,
  mbCollection,
  mbCategory,
  mbSubCategory,
  filterMiscDocs,
}: TGetShoulerPageClientQueryPromise) => {
  const predicatesArray = [predicate.not(`document.tags`, [PRISMIC_DEV_TAG])];

  if (mbCity) {
    predicatesArray.push(
      predicate.at(`my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CITY}`, mbCity)
    );
  }

  if (mbCollection) {
    predicatesArray.push(
      predicate.at(
        `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
        mbCollection
      )
    );
  }

  if (mbCategory) {
    predicatesArray.push(
      predicate.at(
        `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
        mbCategory
      )
    );
  }

  if (mbSubCategory) {
    predicatesArray.push(
      predicate.at(
        `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_SUB_CATEGORY}`,
        mbSubCategory
      )
    );
  }
  if (filterMiscDocs) {
    predicatesArray.push(
      predicate.at(`my.${docType}.${PRISMIC_FIELD_ID.SHOULDER_PAGE_TYPE}`, MISC)
    );
  }

  const prismicClient = createClient();
  const promise = prismicClient.getAllByType(docType, {
    pageSize: 100,
    ...(filterMiscDocs && { lang }),
    predicates: predicatesArray,
  });

  sendLog({
    message: {
      documentType: docType,
      functionality: 'promise',
      queryingMultipleDocs: true,
      lang,
      msg: 'Prismic API call from Canary',
    },
  });
  return promise;
};

type TGetShoulderPageDocs = {
  categorisationMetadata: TCategorisationMetadata;
  filterMiscDocs?: boolean;
  isA2CatMB?: boolean;
  isA2SubcatMB?: boolean;
  lang?: string;
};

const getShoulderPageDocs = async ({
  categorisationMetadata,
  isA2CatMB,
  isA2SubcatMB,
  filterMiscDocs,
  lang,
}: TGetShoulderPageDocs) => {
  const {
    tagged_city: mbCity,
    tagged_collection: mbCollection,
    tagged_category: mbCategory,
    tagged_sub_category: mbSubCategory,
  } = categorisationMetadata;

  if (
    (!isA2CatMB && !isA2SubcatMB && !mbCollection) ||
    (isA2CatMB && !mbCategory) ||
    (isA2SubcatMB && !mbSubCategory)
  )
    return [];

  const micrositesPromises = getShoulderPageClientQueryPromise({
    docType: 'microsite',
    mbCity,
    mbCollection: !isA2CatMB && !isA2SubcatMB ? mbCollection : null,
    mbCategory: isA2CatMB ? mbCategory : null,
    mbSubCategory: isA2SubcatMB ? mbSubCategory : null,
    filterMiscDocs,
    lang,
  });

  const contentPagesPromises = getShoulderPageClientQueryPromise({
    docType: 'content_page',
    mbCity,
    mbCollection: !isA2CatMB && !isA2SubcatMB ? mbCollection : null,
    mbCategory: isA2CatMB ? mbCategory : null,
    mbSubCategory: isA2SubcatMB ? mbSubCategory : null,
    filterMiscDocs,
    lang,
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

export default getShoulderPageDocs;
