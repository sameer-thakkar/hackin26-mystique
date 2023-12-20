import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import {
  globalCityHomepageGq,
  globalCollectionsHomepageGq,
  globalHomepageGq,
} from './graphQuery';

const getGlobalHomepage = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({
    req,
  });

  const globalHomepage = await prismicClient.getByUID('global_homepage', uid, {
    lang,
    graphQuery: globalHomepageGq,
  });

  sendLog({
    message: {
      uid,
      documentType: CUSTOM_TYPES.GLOBAL_HOMEPAGE,
      lang,
      functionality: 'globalHomepage',
      msg: 'Prismic API call from Canary',
    },
  });

  if (globalHomepage && Object.keys(globalHomepage)?.length) {
    const { data } = globalHomepage;
    const { mb_type } = data ?? {};

    const cityCollectionsPromise = prismicClient.getByType('global_city', {
      pageSize: 100,
      predicates: [
        predicate.not('document.tags', [PRISMIC_DEV_TAG]),
        predicate.at(
          `my.${CUSTOM_TYPES.GLOBAL_CITY}.mb_type`,
          mb_type as string
        ),
      ],
      graphQuery: globalCityHomepageGq,
    });

    sendLog({
      message: {
        uid,
        documentType: CUSTOM_TYPES.GLOBAL_HOMEPAGE,
        lang,
        functionality: 'cityCollectionsPromise',
        msg: 'Prismic API call from Canary',
      },
    });

    const globalCollectionsPromise = prismicClient.getByType(
      'global_collection',
      {
        pageSize: 100,
        predicates: [
          predicate.not('document.tags', [PRISMIC_DEV_TAG]),
          predicate.at(
            `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.mb_type`,
            mb_type as string
          ),
        ],
        graphQuery: globalCollectionsHomepageGq,
      }
    );

    sendLog({
      message: {
        uid,
        documentType: CUSTOM_TYPES.GLOBAL_HOMEPAGE,
        lang,
        functionality: 'globalCollectionsPromise',
        msg: 'Prismic API call from Canary',
      },
    });

    const settledPromiseResults = await Promise.allSettled([
      mb_type ? cityCollectionsPromise : undefined,
      mb_type ? globalCollectionsPromise : undefined,
    ]);

    const [cityCollections, globalCollections] = handleSettledPromiseResults(
      settledPromiseResults
    );

    return {
      CMSContent: {
        ...globalHomepage,
        ...(globalCollections && { collections: globalCollections }),
        ...(cityCollections && { cityCollections }),
      },
      ContentType: CUSTOM_TYPES.GLOBAL_HOMEPAGE,
    };
  } else {
    return Promise.reject();
  }
};

export default getGlobalHomepage;
