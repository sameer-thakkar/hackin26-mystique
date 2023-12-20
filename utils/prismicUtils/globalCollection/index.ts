import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import { sendLog } from 'utils/logger';
import { GLOBAL_EXPERIENCE_PAGE_TYPE } from 'const/globalMb';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import { globalCollectionGq } from './graphQuery';

const getGlobalCollection = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({
    req,
  });

  const globalCollection = await prismicClient.getByUID(
    'global_collection',
    uid,
    {
      lang,
      graphQuery: globalCollectionGq,
    }
  );
  sendLog({
    message: {
      uid,
      documentType: CUSTOM_TYPES.GLOBAL_COLLECTION,
      lang,
      functionality: 'globalCollection',
      msg: 'Prismic API call from Canary',
    },
  });

  if (globalCollection && Object.keys(globalCollection)?.length) {
    const { id: docID, data: globalCollectionData } = globalCollection;

    const {
      // @ts-expect-error prismic doesn't infer linked documents data
      country: { id: countryDocID },
      // @ts-expect-error prismic doesn't infer linked documents data
      city: { id: cityDocID },
    } = globalCollectionData;

    const subPagesPromise = prismicClient.getByType('global_experience', {
      pageSize: 100,
      predicates: [
        predicate.not('document.tags', [PRISMIC_DEV_TAG]),
        predicate.at(`my.${CUSTOM_TYPES.GLOBAL_EXPERIENCE}.collection`, docID),
      ],
    });

    sendLog({
      message: {
        uid,
        documentType: CUSTOM_TYPES.GLOBAL_COLLECTION,
        lang,
        functionality: 'subPagesPromise',
        msg: 'Prismic API call from Canary',
      },
    });

    const cityCollectionsPromise = cityDocID
      ? prismicClient.getByType('global_collection', {
          pageSize: 100,
          predicates: [
            predicate.not('document.tags', [PRISMIC_DEV_TAG]),
            predicate.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.city`,
              cityDocID
            ),
          ],
        })
      : undefined;

    if (cityDocID) {
      sendLog({
        message: {
          uid,
          documentType: CUSTOM_TYPES.GLOBAL_COLLECTION,
          lang,
          functionality: 'cityCollectionsPromise',
          msg: 'Prismic API call from Canary',
        },
      });
    }

    const countryCollectionsPromise = countryDocID
      ? prismicClient.getByType('global_collection', {
          pageSize: 100,
          predicates: [
            predicate.not('document.tags', [PRISMIC_DEV_TAG]),
            predicate.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.country`,
              countryDocID
            ),
          ],
        })
      : undefined;

    if (countryDocID) {
      sendLog({
        message: {
          uid,
          documentType: CUSTOM_TYPES.GLOBAL_COLLECTION,
          lang,
          functionality: 'countryCollectionsPromise',
          msg: 'Prismic API call from Canary',
        },
      });
    }

    const allSettledResults = await Promise.allSettled([
      subPagesPromise,
      cityCollectionsPromise,
      countryCollectionsPromise,
    ]);

    const [subPages, cityCollections, countryCollections] =
      handleSettledPromiseResults(allSettledResults);

    let ticketsPage, attractionsPage;
    if (subPages?.results?.length) {
      ticketsPage =
        subPages?.results?.find(
          (page: any) =>
            page.data.page_type === GLOBAL_EXPERIENCE_PAGE_TYPE.TICKETS
        ) || {};
      attractionsPage =
        subPages?.results?.find(
          (page: any) =>
            page.data.page_type === GLOBAL_EXPERIENCE_PAGE_TYPE.ATTRACTIONS
        ) || {};
    }

    return {
      CMSContent: {
        ...globalCollection,
        ticketsPage,
        attractionsPage,
        ...(cityCollections && { cityCollections }),
        ...(countryCollections && { countryCollections }),
      },
      ContentType: CUSTOM_TYPES.GLOBAL_COLLECTION,
    };
  } else {
    return Promise.reject();
  }
};
export default getGlobalCollection;
