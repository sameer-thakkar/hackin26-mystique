import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import type { ProductCardsDocument } from 'types.prismic';
import {
  getAlternateLanguageDocUid,
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  handleSettledPromiseResults,
} from 'utils';
import {
  fetchBulkPoisInfo,
  fetchCollectionList,
  fetchCollectionPoiInfo,
} from 'utils/apiUtils';
import { getLangObject } from 'utils/helper';
import { sendLog } from 'utils/logger';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SLICE_TYPES,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import getCanonicalLinkFromBaseLangData from '../getCanonicalLink';
import type { TGetDocument } from '../interface';
import { contentPageGq } from './graphQuery';

const { CONTENT_PAGE } = CUSTOM_TYPES;

const { TAGGED_COLLECTION, TAGGED_CITY, TAGGED_PAGE_TYPE, SHOULDER_PAGE_TYPE } =
  PRISMIC_FIELD_ID;

const { SHOULDER_PAGE_TYPE: SHOULDER_PAGE_TYPES } = MB_CATEGORISATION;

const getPrismicContentPageRelatedDocs = (
  mbCity: string,
  collectionId: string,
  excludedShoulderTypes: string[]
) => {
  const prismicClient = createClient();
  return prismicClient.getByType('content_page', {
    predicates: [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(`my.${CONTENT_PAGE}.${TAGGED_COLLECTION}`, collectionId),
      predicate.at(`my.${CONTENT_PAGE}.${TAGGED_CITY}`, mbCity),
      predicate.at(
        `my.${CONTENT_PAGE}.${TAGGED_PAGE_TYPE}`,
        MB_CATEGORISATION.PAGE_TYPE.SHOULDER_PAGE
      ),
      ...excludedShoulderTypes.map((type) =>
        predicate.not(`my.${CONTENT_PAGE}.${SHOULDER_PAGE_TYPE}`, type)
      ),
    ],
  });
};

const getContentPageDocument = async ({
  req,
  uid,
  lang,
  host,
  isDev,
}: TGetDocument) => {
  const prismicClient = createClient({
    req,
  });
  const isLocalizedLang = lang !== DEFAULT_PRISMIC_LANG;

  const contentPage = await prismicClient.getByUID('content_page', uid, {
    ...(lang && { lang }),
    graphQuery: contentPageGq,
  });

  // remove this log after SDK 100%

  const {
    uid: currentPageUid,
    lang: currentPageLang,
    data: currentPageData,
    alternate_languages: currentPageAlternateLanguages,
  } = contentPage ?? {};

  if (currentPageData) {
    let pageUrl = convertUidToUrl({
      uid: currentPageUid,
      lang: getHeadoutLanguagecode(currentPageLang),
    });

    if (currentPageUid !== uid) {
      if (host?.slice(0, 5) === 'stage') {
        if (pageUrl) {
          pageUrl = pageUrl.split('//')?.join('//stage-');
        }
      }
      return {
        redirectInfo: {
          url: pageUrl,
          type: 301,
        },
      };
    }

    const redirectUrl =
      // @ts-expect-error Incomplete prismic type
      contentPage.data?.redirect_url?.url ||
      // @ts-expect-error Incomplete prismic type
      contentPage.data.microsite_document_ref?.data?.redirect_url?.url;
    if (redirectUrl) {
      return {
        redirectInfo: {
          url: redirectUrl,
          type: 301,
        },
      };
    }

    const baseLangUid = getEnglishDocUid(currentPageAlternateLanguages);
    const baseLangData = isLocalizedLang
      ? await prismicClient.getByUID('content_page', baseLangUid || uid, {
          lang: DEFAULT_PRISMIC_LANG,
          graphQuery: contentPageGq,
        })
      : contentPage;

    const baseLangMicrositeData = isLocalizedLang
      ? await prismicClient.getByUID(
          'microsite',
          // @ts-expect-error Incomplete prismic type
          baseLangData?.data?.microsite_document_ref?.uid,
          {
            lang: DEFAULT_PRISMIC_LANG,
          }
        )
      : contentPage?.data?.microsite_document_ref;

    const {
      tagged_city,
      tagged_country,
      tagged_collection,
      tagged_category,
      tagged_sub_category,
      tagged_mb_type,
      tagged_page_type,
      primary_tag,
      shoulder_page_type,
      shoulder_page_custom_label,
      tagged_content_type,
    } = baseLangData?.data ?? {};

    const baseLangCategorisationMetadata: TCategorisationMetadata = {
      tagged_city,
      tagged_country,
      tagged_collection,
      tagged_category,
      tagged_sub_category,
      tagged_mb_type,
      tagged_page_type,
      primary_tag,
      shoulder_page_type,
      shoulder_page_custom_label,
      tagged_content_type,
    };

    const canonicalLink = await getCanonicalLinkFromBaseLangData({
      baseLangCanonicalLink: baseLangData?.data?.canonical_link,
      currentPageLang,
      host,
      isDev,
    });

    let baseLangTicketsCardsSlice = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
      slices: isLocalizedLang
        ? // @ts-expect-error prismic doesn't support linked document data type
          baseLangData?.data?.content_framework?.data?.body
        : // @ts-expect-error prismic doesn't support linked document data type
          currentPageData?.content_framework?.data?.body,
    });

    let ticketsCardSlice = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
      // @ts-expect-error prismic doesn't support linked document data type
      slices: currentPageData?.content_framework?.data?.body,
    });

    let productCardData: Record<string, any> | undefined;
    const hasTicketsCardSlice = Object.keys(baseLangTicketsCardsSlice)?.length;

    if (hasTicketsCardSlice) {
      const { id, slice_type, slice_label, primary, items } =
        baseLangTicketsCardsSlice;
      const { product_cards } = primary || {};
      const { id: productCardsId } = product_cards || {};

      try {
        const { data } =
          ((await prismicClient.getByID(productCardsId, {
            lang: DEFAULT_PRISMIC_LANG,
          })) as ProductCardsDocument) ?? {};
        productCardData = {
          id,
          slice_type,
          slice_label,
          items,
          primary: {
            ...primary,
            sp_experience_limit: ticketsCardSlice?.primary?.sp_experience_limit,
            product_cards: {
              ...product_cards,
              data,
            },
          },
        };
      } catch (error) {
        sendLog({
          err: error,
          message: `[getContentPageDocument] - ${uid}`,
        });
      }
    }

    let relatedContentPages = [];
    const excludedShoulderTypes: string[] = [
      SHOULDER_PAGE_TYPES.Architecture,
      SHOULDER_PAGE_TYPES.SUB_ATTRACTIONS,
      SHOULDER_PAGE_TYPES.SKIP_THE_LINE,
      SHOULDER_PAGE_TYPES.INSIDE,
      SHOULDER_PAGE_TYPES.TIPS,
      SHOULDER_PAGE_TYPES.GUIDED_TOURS,
      SHOULDER_PAGE_TYPES.MISC,
      SHOULDER_PAGE_TYPES.HISTORY,
      SHOULDER_PAGE_TYPES.RESTAURANTS,
      shoulder_page_type as string,
    ];
    let poiInfo = {};
    let childPoisInfo = [];
    // We Currently only want this in the Revamped pages
    if (
      [SHOULDER_PAGE_TYPES.ABOUT, SHOULDER_PAGE_TYPES.TIMINGS].includes(
        shoulder_page_type || ''
      )
    ) {
      const settledPromises = await Promise.allSettled([
        getPrismicContentPageRelatedDocs(
          tagged_city ?? '',
          tagged_collection ?? '',
          excludedShoulderTypes
        ),
        fetchCollectionPoiInfo({
          language: lang || 'en',
          collectionId: tagged_collection || '',
        }),
      ]);
      const [prismicRelatedDocs, fetchedPoiInfo] = handleSettledPromiseResults(
        settledPromises,
        uid
      );
      const childPoiIds = fetchedPoiInfo?.childPOIIds;
      if (
        shoulder_page_type === SHOULDER_PAGE_TYPES.TIMINGS &&
        childPoiIds?.length
      ) {
        childPoisInfo = await fetchBulkPoisInfo({
          language: lang || 'en',
          poiIds: childPoiIds,
          operatingSchedules: true,
          content: true,
        });
        const childPoiCollectionIds = childPoisInfo?.pois?.map(
          (poi: any) => poi.linkedCollectionId
        );
        // fetch the collection for each child id and assign it in the poi object
        if (childPoiCollectionIds?.length) {
          const languageCode = getLangObject(lang!).code || 'en';
          const childPoiCollectionsInfo = (
            await fetchCollectionList({
              collectionIds: childPoiCollectionIds,
              language: languageCode,
            })
          )?.collections;
          childPoisInfo?.pois?.forEach((poi: any) => {
            poi.collectionInfo = childPoiCollectionsInfo?.find(
              (childPoiCollection: any) =>
                childPoiCollection.id == poi.linkedCollectionId
            );
          });
        }
      }
      relatedContentPages = prismicRelatedDocs?.results?.map(
        (doc: Record<string, any>) => ({
          ...doc,
          uid:
            lang === SUPPORTED_LOCALE_MAP.en
              ? doc.uid
              : getAlternateLanguageDocUid({ doc, lang: lang || 'en-us' }),
        })
      );
      poiInfo = fetchedPoiInfo;
    }
    let completePage = {
      ...contentPage,
      data: {
        ...contentPage?.data,
        canonical_link: canonicalLink || pageUrl,
        mbType: tagged_mb_type,
        noindex: isLocalizedLang
          ? baseLangData?.data?.noindex
          : contentPage.data.noindex,
        baseLangPageTitle: isLocalizedLang
          ? baseLangData?.data?.title
          : contentPage.data.title,
        // @ts-expect-error
        baseLangIsPoiMb: baseLangMicrositeData?.data?.is_poi_mb,
        baseLangBannerAndFooterCombinations:
          // @ts-expect-error
          baseLangMicrositeData?.data?.banner_and_footer_combinations,
        redirect_to_headout_booking_flow: isLocalizedLang
          ? baseLangData?.data?.redirect_to_headout_booking_flow
          : contentPage.data.redirect_to_headout_booking_flow,
        baseLangMicrositeData,
        baseLangCategorisationMetadata,
        productCardData,
        relatedContentPages,
        poiInfo,
        childPoisInfo: childPoisInfo?.pois,
      },
    };

    return {
      CMSContent: completePage,
      ContentType: CUSTOM_TYPES.CONTENT_PAGE,
    };
  } else {
    return Promise.reject();
  }
};

export default getContentPageDocument;
