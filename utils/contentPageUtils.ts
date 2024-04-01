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
  SHOULDER_TIMINGS_SCALE_ICONS,
  SLICE_TYPES,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import {
  Closed,
  Crowded,
  ModerateSeason,
  OffSeason,
  PeakSeason,
  PleasantCrowd,
  VeryCrowded,
} from 'assets/timingsLegend';
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
  if (listicleSliceData && !isEmptyObject(listicleSliceData) && cities.length) {
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

export const getRelatedContentPagesUrl = ({
  relatedContentPages,
  type,
  lang,
}: {
  relatedContentPages?: Record<string, any>[];
  type: string;
  lang?: string;
}) => {
  const uid = relatedContentPages?.find(
    (page: any) =>
      page.data?.shoulder_page_type?.toLowerCase?.() === type.toLowerCase()
  )?.uid;
  return (
    uid &&
    convertUidToUrl({
      uid: uid,
      lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
    })
  );
};

export const SHOULDER_TIMINGS_SCALE_ICONS_VALUES: Record<
  SHOULDER_TIMINGS_SCALE_ICONS,
  () => JSX.Element
> = {
  PLEASANT: PleasantCrowd,
  CROWDED: Crowded,
  VERY_CROWDED: VeryCrowded,
  CLOSED: Closed,
  LOW_SEASON: OffSeason,
  MID_SEASON: ModerateSeason,
  PEAK_SEASON: PeakSeason,
};
export type TExtractSliceByTypeParams = {
  slices: {
    slices?: {
      slice_type: string;
    }[];
    slice_type?: string;
  }[];
  sliceType: keyof typeof SLICE_TYPES;
};

/*
 * Extracts a prismic slice from a given list of slices based on a given slice type
 * Even if the slice is nested inside a slice
 * Note: This mutates the given slices array
 */
export const extractSliceByType = ({
  slices,
  sliceType,
}: TExtractSliceByTypeParams): Record<string, any>[] => {
  const sliceIndex = slices.findIndex(
    ({ slice_type, slices: childrenSlices }) =>
      slice_type === sliceType ||
      childrenSlices?.some?.(
        ({ slice_type: child_slice_type }: { slice_type: string }) =>
          child_slice_type === sliceType
      )
  );
  const splicedSlice = sliceIndex >= 0 ? slices?.splice?.(sliceIndex, 1) : [];
  return splicedSlice;
};
