import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { handleSettledPromiseResults } from 'utils';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import { globalExperienceGq } from './graphQuery';

const getGlobalExperience = async ({ req, uid, lang }: any) => {
  const prismicClient = createClient({ req });
  const globalExperience = await prismicClient.getByUID(
    'global_experience',
    uid,
    {
      lang,
      graphQuery: globalExperienceGq,
    }
  );

  sendLog({
    message: {
      uid,
      documentType: CUSTOM_TYPES.GLOBAL_EXPERIENCE,
      lang,
      functionality: 'globalExperience',
      msg: 'Prismic API call from Canary',
    },
  });

  if (globalExperience && Object.keys(globalExperience).length) {
    const { data: globalExperienceData } = globalExperience ?? {};
    const { collection } = globalExperienceData ?? {};
    // @ts-expect-error
    const { data: collectionData } = collection ?? {};

    const countryDocID = collectionData?.country?.id;
    const cityDocID = collectionData?.city?.id;
    const cityName = collectionData?.city_name;

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
          documentType: CUSTOM_TYPES.GLOBAL_EXPERIENCE,
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
          documentType: CUSTOM_TYPES.GLOBAL_EXPERIENCE,
          lang,
          functionality: 'countryCollectionsPromise',
          msg: 'Prismic API call from Canary',
        },
      });
    }

    const allSettledResults = await Promise.allSettled([
      cityCollectionsPromise,
      countryCollectionsPromise,
    ]);

    const [cityCollections, countryCollections] =
      handleSettledPromiseResults(allSettledResults);

    return {
      CMSContent: {
        ...globalExperience,
        ...(cityCollections && { cityCollections }),
        ...(countryCollections && { countryCollections }),
        cityName,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_EXPERIENCE,
    };
  } else {
    Promise.reject();
  }
};

export default getGlobalExperience;
