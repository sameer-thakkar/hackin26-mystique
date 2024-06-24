import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import type { ProductCardsDocument } from 'types.prismic';
import {
  getAlternateLanguageDocUid,
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
} from 'utils';
import {
  fetchBulkPoisInfo,
  fetchCollection,
  fetchCollectionList,
  fetchCollectionPoiInfo,
  fetchTourGroupsByCollection,
  fetchTourListV6,
} from 'utils/apiUtils';
import { getHostName, getLangObject } from 'utils/helper';
import { sendLog } from 'utils/logger';
import { getStructure } from 'utils/lookerUtils';
import { getScorpioData } from 'utils/productUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  COOKIE,
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  LANGUAGE_MAP,
  LanguagesUnion,
  MB_CATEGORISATION,
  MB_TYPES,
  PAGE_URL_STRUCTURE,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SLICE_TYPES,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import { strings } from 'const/strings';
import getCanonicalLinkFromBaseLangData from '../getCanonicalLink';
import type { TGetDocument } from '../interface';
import { contentPageGq } from './graphQuery';

const { CONTENT_PAGE, MICROSITE } = CUSTOM_TYPES;

const {
  TAGGED_COLLECTION,
  TAGGED_CITY,
  TAGGED_PAGE_TYPE,
  SHOULDER_PAGE_TYPE,
  NOINDEX,
  CANONICAL_LINK,
} = PRISMIC_FIELD_ID;

const { SHOULDER_PAGE_TYPE: SHOULDER_PAGE_TYPES, SUBATTRACTION_TYPE } =
  MB_CATEGORISATION;

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

const getPrismicParentCollectionLandingPage = async (
  mbCity: string,
  collectionId: string,
  selfUid: string,
  langCode: string
) => {
  try {
    if (!collectionId) return null;
    const prismicClient = createClient();
    // the landing page could be either a microsite or a content page
    let res = await prismicClient.get({
      predicates: [
        predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
        predicate.not(`my.${MICROSITE}.uid`, selfUid),
        predicate.at(`my.${MICROSITE}.${NOINDEX}`, 'False'),
        predicate.missing(`my.${MICROSITE}.${CANONICAL_LINK}`),
        predicate.at(`my.${MICROSITE}.${TAGGED_COLLECTION}`, collectionId),
        predicate.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
        predicate.at(
          `my.${MICROSITE}.${TAGGED_PAGE_TYPE}`,
          MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
        ),
      ],
    });
    if (!res?.results?.length) {
      res = await prismicClient.get({
        predicates: [
          predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
          predicate.not(`my.${CONTENT_PAGE}.uid`, [selfUid]),
          predicate.at(`my.${CONTENT_PAGE}.${NOINDEX}`, 'False'),
          predicate.missing(`my.${CONTENT_PAGE}.${CANONICAL_LINK}`),
          predicate.at(`my.${CONTENT_PAGE}.${TAGGED_COLLECTION}`, collectionId),
          predicate.at(`my.${CONTENT_PAGE}.${TAGGED_CITY}`, mbCity),
          predicate.at(
            `my.${CONTENT_PAGE}.${TAGGED_PAGE_TYPE}`,
            MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
          ),
        ],
      });
    }
    const priorityValues = {
      [MB_TYPES.C1_COLLECTION]: 2,
      [MB_TYPES.B1_GLOBAL]: 1,
      [MB_TYPES.B1_GLOBAL_HOMEPAGE]: 1,
    };
    const sortedResults = res?.results
      ?.filter((res) => {
        if (res.uid?.includes('sagradafamilia')) return true; // this is the only hardcoded exception
        const url = convertUidToUrl({
          uid: res.uid!,
          lang: langCode,
        });
        const isSubdomain =
          getStructure(new URL(url)) === PAGE_URL_STRUCTURE.SUBDOMAIN ||
          getStructure(new URL(url)) === PAGE_URL_STRUCTURE.SUBDOMAIN_SUBFOLDER;
        return !isSubdomain;
      })
      ?.sort(
        (a, b) =>
          // @ts-ignore
          priorityValues[a.data?.tagged_mb_type] -
          // @ts-ignore
          priorityValues[b.data?.tagged_mb_type]
      );
    const language =
      LANGUAGE_MAP[langCode as LanguagesUnion]?.locale || 'en-us';
    const selectedLandingPage = sortedResults?.[0];

    if (language === SUPPORTED_LOCALE_MAP.en) return selectedLandingPage;

    const localizedPageUid = getAlternateLanguageDocUid({
      doc: selectedLandingPage,
      lang: language,
    });

    if (!localizedPageUid) return null;

    return prismicClient.getByUID(selectedLandingPage.type, localizedPageUid, {
      lang: language,
    });
  } catch (e) {
    sendLog({
      err: e,
      message: `[getPrismicParentCollectionLandingPage]`,
    });
    return null;
  }
};

const getContentPageDocument = async ({
  req,
  uid,
  lang,
  host,
  isDev,
  documentData,
  baseLangMicrositeData: fetchedBaseLangMicrositeData,
}: TGetDocument) => {
  const currency = req?.cookies?.[COOKIE.CURRENT_CURRENCY] || 'USD';
  const prismicClient = createClient({
    req,
  });
  const isLocalizedLang = lang !== DEFAULT_PRISMIC_LANG;

  const contentPage =
    documentData ??
    (await prismicClient.getByUID('content_page', uid, {
      ...(lang && { lang }),
      graphQuery: contentPageGq,
    }));

  // remove this log after SDK 100%

  const {
    uid: currentPageUid,
    lang: currentPageLang,
    data: currentPageData,
    alternate_languages: currentPageAlternateLanguages,
  } = contentPage ?? {};
  const { subattraction_banner_disclaimer } = currentPageData;

  if (currentPageData) {
    let pageUrl = convertUidToUrl({
      uid: currentPageUid!,
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
      contentPage.data?.redirect_url?.url ||
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

    let baseLangData, baseLangMicrositeData;
    if (fetchedBaseLangMicrositeData) {
      baseLangData = fetchedBaseLangMicrositeData;
      baseLangMicrositeData = fetchedBaseLangMicrositeData;
    } else {
      baseLangData = isLocalizedLang
        ? await prismicClient.getByUID('content_page', baseLangUid || uid, {
            lang: DEFAULT_PRISMIC_LANG,
            graphQuery: contentPageGq,
          })
        : contentPage;

      baseLangMicrositeData = isLocalizedLang
        ? await prismicClient.getByUID(
            'microsite',
            baseLangData?.data?.microsite_document_ref?.uid,
            {
              lang: DEFAULT_PRISMIC_LANG,
            }
          )
        : contentPage?.data?.microsite_document_ref;
    }

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
      subattraction_type,
      parent_collection_id: subattractionParentCollectionId,
      child_poi_id: subattractionChildPoiId,
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
      subattraction_banner_disclaimer,
      tagged_content_type,
      subattraction_type,
      subattractionParentCollectionId,
      subattractionChildPoiId,
    };

    const canonicalLink = await getCanonicalLinkFromBaseLangData({
      baseLangCanonicalLink: baseLangData?.data?.canonical_link,
      currentPageLang,
      host,
      isDev: !!isDev,
    });

    let baseLangTicketsCardsSlice = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
      slices: isLocalizedLang
        ? baseLangData?.data?.content_framework?.data?.body
        : currentPageData?.content_framework?.data?.body,
    });

    let ticketsCardSlice = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
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
    let subattractionParentCollectionData;
    let subattractionChildPoiData;
    let parentLandingPageDocument;
    let childTgidsData;
    let parentTgidsData;
    let parentTgidsList;
    let childTgidsList;
    let collectionData;
    // We Currently only want this in the Revamped pages
    const languageCode = getLangObject(lang!).code;
    if (
      [
        SHOULDER_PAGE_TYPES.ABOUT,
        SHOULDER_PAGE_TYPES.TIMINGS,
        SHOULDER_PAGE_TYPES.SUB_ATTRACTIONS,
      ].includes(shoulder_page_type || '')
    ) {
      const fetchPromises = [
        getPrismicContentPageRelatedDocs(
          tagged_city ?? '',
          tagged_collection ?? '',
          excludedShoulderTypes
        ),
        fetchCollectionPoiInfo({
          language: lang || 'en',
          collectionId:
            subattractionParentCollectionId || tagged_collection || '',
        }),
        getPrismicParentCollectionLandingPage(
          tagged_city ?? '',
          subattractionParentCollectionId ?? '',
          uid,
          languageCode
        ),
        fetchCollection({
          language: languageCode,
          collectionId: tagged_collection,
          currency,
        }),
        subattractionParentCollectionId
          ? fetchCollection({
              collectionId: subattractionParentCollectionId,
              language: languageCode,
              currency,
            })
          : Promise.resolve(null),
        subattractionChildPoiId
          ? fetchBulkPoisInfo({
              language: lang || 'en',
              poiIds: [subattractionChildPoiId],
              operatingSchedules: true,
              content: true,
            })
          : Promise.resolve(null),
      ];

      const results = await Promise.allSettled(fetchPromises);
      const [
        prismicRelatedDocs,
        fetchedPoiInfo, // this is the parent poi info in case of subattraction
        prismicParentLandingPageDocument,
        fetchedCollectionData,
        fetchedSubattractionParentCollection,
        fetchedSubattractionChildPoi,
        // @ts-ignore
      ] = results.map((res) => res.value);
      // console.log(fetchedSubattractionParentCollection)
      collectionData = fetchedCollectionData;
      parentLandingPageDocument = prismicParentLandingPageDocument;
      subattractionParentCollectionData =
        fetchedSubattractionParentCollection?.collection;
      subattractionChildPoiData = fetchedSubattractionChildPoi?.pois?.[0];
      if (shoulder_page_type === SHOULDER_PAGE_TYPES.SUB_ATTRACTIONS) {
        const isStage = !!host?.includes('stage-');
        const hostname = getHostName(isStage, !!isDev, host!);
        const tgidsResult = await fetchTourGroupsByCollection({
          collectionId: subattractionParentCollectionId,
          currency,
          language: languageCode,
          hostname,
        });
        parentTgidsList = tgidsResult?.pageData?.items || [];
        parentTgidsData = await getScorpioData({
          finalTours: parentTgidsList,
          currency: tgidsResult?.currency,
          language: lang!,
          localizedStrings: strings,
        });
        if (
          subattraction_type == SUBATTRACTION_TYPE.B &&
          subattractionChildPoiData?.linkedTourGroups?.length
        ) {
          const tgidsResult: Record<string, any> = await fetchTourListV6({
            tgids: subattractionChildPoiData?.linkedTourGroups,
            language: languageCode,
            currency,
            hostname,
          });
          childTgidsList = tgidsResult?.tourGroups || [];
          childTgidsData = await getScorpioData({
            finalTours: childTgidsList,
            currency: tgidsResult?.currencies?.[0],
            language: lang!,
            localizedStrings: strings,
          });
        } else if (subattraction_type == SUBATTRACTION_TYPE.C) {
          const tgidsResult = await fetchTourGroupsByCollection({
            collectionId: tagged_collection,
            language: languageCode,
            hostname,
            currency,
          });
          childTgidsList = tgidsResult?.pageData?.items || [];
          childTgidsData = await getScorpioData({
            currency: tgidsResult?.currency,
            finalTours: childTgidsList,
            language: lang!,
            localizedStrings: strings,
          });
        }
      }
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
        baseLangIsPoiMb: baseLangMicrositeData?.data?.is_poi_mb,
        baseLangBannerAndFooterCombinations:
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
        subattractionParentCollectionData,
        subattractionChildPoiData,
        parentLandingPageDocument,
        childTgidsData,
        childTgidsList,
        parentTgidsData,
        parentTgidsList,
        subattraction_type,
        shoulder_page_type,
        collectionData,
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
