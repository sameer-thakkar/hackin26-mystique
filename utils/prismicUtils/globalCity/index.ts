import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import { globalCityGq } from './graphQuery';

const getGlobalCity = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({ req });
  const globalCity = await prismicClient.getByUID('global_city', uid, {
    lang,
    graphQuery: globalCityGq,
  });

  if (globalCity && Object.keys(globalCity)?.length) {
    const { id: cityDocId } = globalCity;

    const cityCollectionsPromise = prismicClient.getByType(
      'global_collection',
      {
        pageSize: 100,
        predicates: [
          predicate.not('document.tags', [PRISMIC_DEV_TAG]),
          predicate.at(`my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.city`, cityDocId),
        ],
      }
    );

    const ticketPagesPromise = prismicClient.getByType('global_experience', {
      pageSize: 100,
      predicates: [
        predicate.not('document.tags', [PRISMIC_DEV_TAG]),
        predicate.at(`my.${CUSTOM_TYPES.GLOBAL_EXPERIENCE}.city`, cityDocId),
      ],
    });

    const allSettledResults = await Promise.allSettled([
      cityCollectionsPromise,
      ticketPagesPromise,
    ]);

    const [cityCollections, ticketPages] =
      handleSettledPromiseResults(allSettledResults);

    return {
      CMSContent: {
        ...globalCity,
        cityCollections,
        ticketPages,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_CITY,
    };
  } else {
    return Promise.reject();
  }
};

export default getGlobalCity;
