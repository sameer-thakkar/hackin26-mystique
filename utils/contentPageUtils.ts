import Prismic from 'prismic-javascript';
import * as Sentry from '@sentry/nextjs';
import {
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  isEmptyObject,
} from 'utils';
import { fetchCollectionList } from 'utils/apiUtils';
import { sendLog } from 'utils/logger/index';
import { fetchAllMatchingDocs } from 'utils/prismicUtils';
import {
  CUSTOM_TYPES,
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

  let docsForListicles = [];
  let collectionsInListicles = [];
  if (listicleSliceData && !isEmptyObject(listicleSliceData)) {
    try {
      const res = await fetchAllMatchingDocs({
        query: [
          Prismic.Predicates.any(
            `my.${CUSTOM_TYPES.MICROSITE}.tagged_city`,
            cities as Array<string>
          ),
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.MICROSITE}.tagged_page_type`,
            MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
          ),
        ],
        params: {
          lang: SUPPORTED_LOCALE_MAP.en,
        },
      });
      docsForListicles = res?.filter((doc: Record<any, any>) => {
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
      sendLog({ err: e });
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
