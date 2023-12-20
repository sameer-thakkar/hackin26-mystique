import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import * as Sentry from '@sentry/nextjs';
import { MicrositeDocument } from 'types.prismic';
import {
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  isEmptyObject,
} from 'utils';
import { fetchCollectionList } from 'utils/apiUtils';
import { sendLog } from 'utils/logger/index';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
  SEO_SUBDOMAINS_UID,
  SLICE_TYPES,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import { convertUidToUrl } from './urlUtils';

export type TListicleData = {
  slices: Array<any>;
  hostname: string;
  cookies: any;
  lang?: string;
};

export const getDocsForListicleSlice = async ({
  slices,
  lang,
  hostname,
  cookies,
}: TListicleData) => {
  const listicleSliceData = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.LISTICLE_V2,
    slices,
  });
  let collectionIdsInListicles: Array<number> = [];

  collectionIdsInListicles = listicleSliceData?.items
    ?.filter((item: Record<any, any>) => !!item?.collection_id)
    .map((item: Record<any, any>) => item.collection_id);

  const cities = Array.from(
    new Set(
      listicleSliceData?.items?.map(
        (item: Record<any, any>): Array<string> => item?.city
      )
    )
  ).filter(Boolean);

  let docsForListicles: MicrositeDocument[] = [];
  let collectionsInListicles = [];
  if (listicleSliceData && !isEmptyObject(listicleSliceData)) {
    try {
      const prismicClient = createClient();
      const documents = await prismicClient.getAllByType('microsite', {
        lang: DEFAULT_PRISMIC_LANG,
        predicates: [
          predicate.any(
            `my.${CUSTOM_TYPES.MICROSITE}.tagged_city`,
            cities as Array<string>
          ),
          predicate.at(
            `my.${CUSTOM_TYPES.MICROSITE}.tagged_page_type`,
            MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
          ),
        ],
      });

      sendLog({
        message: {
          lang: DEFAULT_PRISMIC_LANG,
          documentType: CUSTOM_TYPES.MICROSITE,
          functionality: 'listicle - documents',
          msg: 'Prismic API call from Canary',
        },
      });

      docsForListicles = documents?.filter((doc: Record<any, any>) => {
        const { uid, data } = doc || {};
        const { canonical_link, noindex } = data || {};

        return (
          (SEO_SUBDOMAINS_UID.includes(uid) ||
            uid?.split('.')?.[0] === 'www') &&
          noindex === 'False' &&
          (!canonical_link ||
            canonical_link ===
              convertUidToUrl({
                uid,
                lang: LANGUAGE_MAP.en.code,
              }))
        );
      });
    } catch (e) {
      Sentry.captureException(e);
      sendLog({ err: e, message: `[getDocsForListicleSlice]` });
    }
  }
  if (collectionIdsInListicles?.length > 0) {
    const language = getHeadoutLanguagecode(lang ?? SUPPORTED_LOCALE_MAP.en);
    const { collections: collections } =
      (await fetchCollectionList({
        collectionIds: collectionIdsInListicles,
        language,
        hostname,
        cookies,
      })) || {};
    collectionsInListicles = collections;
  }
  return [collectionsInListicles, docsForListicles];
};
