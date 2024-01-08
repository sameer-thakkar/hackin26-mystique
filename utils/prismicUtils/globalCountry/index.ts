import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import { globalCountryGq } from './graphQuery';

// This page is not in production

const getGlobalCountry = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({
    req,
  });
  const globalCountry = await prismicClient.getByUID('global_country', uid, {
    lang,
    graphQuery: globalCountryGq,
  });

  if (globalCountry && Object.keys(globalCountry)?.length) {
    const { id: countryDocID } = globalCountry;

    const allCollectionsPromise = countryDocID
      ? prismicClient.getByType('global_collection', {
          predicates: [
            predicate.not('document.tags', [PRISMIC_DEV_TAG]),
            predicate.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.country`,
              countryDocID
            ),
          ],
          pageSize: 100,
        })
      : undefined;

    const cityCollectionsPromise = countryDocID
      ? prismicClient.getByType('global_city', {
          predicates: [
            predicate.not('document.tags', [PRISMIC_DEV_TAG]),
            predicate.at(
              `my.${CUSTOM_TYPES.GLOBAL_CITY}.country`,
              countryDocID
            ),
          ],
          pageSize: 100,
        })
      : undefined;

    const ticketPagesPromise = countryDocID
      ? prismicClient.getByType('global_experience', {
          predicates: [
            predicate.not('document.tags', [PRISMIC_DEV_TAG]),
            predicate.at(
              `my.${CUSTOM_TYPES.GLOBAL_EXPERIENCE}.country`,
              countryDocID
            ),
          ],
          pageSize: 100,
        })
      : undefined;

    const allSettledResults = await Promise.allSettled([
      allCollectionsPromise,
      cityCollectionsPromise,
      ticketPagesPromise,
    ]);

    const [allCollections, cityCollections, ticketPages] =
      handleSettledPromiseResults(allSettledResults);

    return {
      CMSContent: {
        ...globalCountry,
        ...(allCollections && {
          collections: allCollections,
        }),
        ...(cityCollections && {
          cityCollections,
        }),
        ...(ticketPages && {
          ticketPages,
        }),
      },
      ContentType: CUSTOM_TYPES.GLOBAL_COUNTRY,
    };
  } else {
    return Promise.reject();
  }
};

export default getGlobalCountry;
