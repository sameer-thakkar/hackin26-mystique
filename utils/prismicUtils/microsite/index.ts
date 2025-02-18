import { createClient } from 'prismicio';
import type { KeyTextField } from '@prismicio/types';
import * as Sentry from '@sentry/nextjs';
import type {
  MicrositeDocumentData,
  MicrositeDocumentDataBodyTourListCategorySlice,
  MicrositeDocumentDataBodyTourListCategoryV1Slice,
} from 'types.prismic';
import {
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
} from 'utils';
import { checkIfCatOrSubCatPage } from 'utils/helper';
import { sendLog } from 'utils/logger';
import {
  micrositeDefaultLangGq,
  micrositeGq,
} from 'utils/prismicUtils/microsite/graphQuery';
import { transformStringValues } from 'utils/transformUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  MB_CATEGORISATION,
  MICROSITE_STRING_KEYS,
  SLICE_TYPES,
} from 'const/index';
import getContentPageDocument from '../contentPage';
import getCanonicalLinkFromBaseLangData from '../getCanonicalLink';
import type { TGetDocument, TRedirectInfo } from '../interface';
import type {
  TMicrositeDocument,
  TResolvedDocumentResponseM,
} from './interface';

const { SHOULDER_PAGE_TYPE, SUBATTRACTION_TYPE } = MB_CATEGORISATION;
const getMicrositeDocument = async ({
  req,
  uid,
  lang,
  host,
  isDev,
}: TGetDocument): Promise<
  TResolvedDocumentResponseM<TMicrositeDocument> | TRedirectInfo | undefined
> => {
  const prismicClient = createClient({
    req,
  });
  const isLocalizedLang = lang !== DEFAULT_PRISMIC_LANG;
  const micrositeData = await prismicClient.getByUID('microsite', uid, {
    ...(lang && { lang }),
    graphQuery: micrositeGq,
  });

  const {
    uid: currentPageUid,
    lang: currentPageLang,
    data: currentPageData,
    alternate_languages: currentPageAlternateLanguages,
  } = micrositeData ?? {};

  const { body: currentPageCategorizedToursTab } = currentPageData ?? {};
  if (currentPageData) {
    let pageUrl = convertUidToUrl({
      uid: currentPageUid,
      lang: getHeadoutLanguagecode(currentPageLang),
    });

    if (currentPageUid !== uid) {
      return {
        redirectInfo: {
          url: pageUrl,
          type: currentPageData?.redirect_type,
        },
      };
    } else {
      const baseLangUid = getEnglishDocUid(currentPageAlternateLanguages);

      try {
        const baseLangMicrositeData =
          isLocalizedLang && baseLangUid
            ? await prismicClient.getByUID('microsite', baseLangUid || uid, {
                lang: DEFAULT_PRISMIC_LANG,
                graphQuery: micrositeDefaultLangGq,
              })
            : micrositeData;

        const { data: baseLangPageData } = baseLangMicrositeData ?? {};
        const {
          body: baseLangCategorizedToursTab,
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
        } = baseLangPageData ?? {};

        const baseLangCategorisationMetadata = {
          tagged_city,
          tagged_country,
          tagged_collection,
          tagged_category,
          tagged_sub_category,
          tagged_mb_type,
          tagged_page_type,
          primary_tag,
          shoulder_page_type,
          subattraction_type,
          shoulder_page_custom_label,
          tagged_content_type,
        };

        const isCatOrSubCatPage = await checkIfCatOrSubCatPage(
          currentPageData,
          baseLangCategorisationMetadata
        );

        let baseLangCategoryTourListV1: MicrositeDocumentDataBodyTourListCategoryV1Slice;
        let currentPageCategoryTourListV1: MicrositeDocumentDataBodyTourListCategoryV1Slice;
        let categoryTourListV2:
          | MicrositeDocumentDataBodyTourListCategorySlice
          | undefined = undefined;

        // Base lang Fallback for Tour Ranking.
        const tourTabSlice = currentPageData?.body1?.[0];
        if (tourTabSlice?.primary && !tourTabSlice?.primary?.ranking) {
          tourTabSlice.primary.ranking =
            baseLangPageData?.body1[0]?.primary?.ranking ?? '';
        }

        const customBanner = getSinglePrismicSlice({
          sliceName: SLICE_TYPES.CUSTOM_BANNER,
          slices: currentPageCategorizedToursTab,
        });

        const baseLangCustomBanner = getSinglePrismicSlice({
          sliceName: SLICE_TYPES.CUSTOM_BANNER,
          slices: baseLangCategorizedToursTab,
        });
        // Base lang Fallback for CategorisedToursV1
        currentPageCategoryTourListV1 = !isCatOrSubCatPage
          ? getSinglePrismicSlice({
              sliceName: SLICE_TYPES.TOUR_LIST_CATEGORY_V1,
              slices: currentPageCategorizedToursTab,
            })
          : {};
        baseLangCategoryTourListV1 = !isCatOrSubCatPage
          ? getSinglePrismicSlice({
              sliceName: SLICE_TYPES.TOUR_LIST_CATEGORY_V1,
              slices: baseLangCategorizedToursTab,
            })
          : {};

        // Base lang Fallback for CategorisedToursV2
        categoryTourListV2 = !isCatOrSubCatPage
          ? getSinglePrismicSlice({
              sliceName: SLICE_TYPES.TOUR_LIST_CATEGORY,
              slices: isLocalizedLang
                ? baseLangCategorizedToursTab
                : currentPageCategorizedToursTab,
            })
          : {};

        if (
          Object.keys(baseLangCategoryTourListV1)?.length &&
          !isCatOrSubCatPage
        ) {
          const {
            locale_ranking,
            locale_exclusions,
            sub_category_filter,
            category_filter,
          } = baseLangCategoryTourListV1?.primary || {};
          const {
            locale_ranking: localisedRanking,
            locale_exclusions: localisedExclusions,
            sub_category_filter: localisedSubCatFilter,
            category_filter: localisedCategoryFilter,
          } = currentPageCategoryTourListV1?.primary || {};

          baseLangCategoryTourListV1.primary.locale_ranking =
            localisedRanking || locale_ranking;
          baseLangCategoryTourListV1.primary.locale_exclusions =
            localisedExclusions || locale_exclusions;
          baseLangCategoryTourListV1.primary.sub_category_filter =
            localisedSubCatFilter || sub_category_filter;
          baseLangCategoryTourListV1.primary.category_filter =
            localisedCategoryFilter || category_filter;
        }

        const categoryTourListV1Primary = isLocalizedLang
          ? baseLangCategoryTourListV1?.primary
          : currentPageCategoryTourListV1?.primary;

        let shouldPageHaveShorterTtl = false;

        if (
          !Object.keys(categoryTourListV1Primary ?? {})?.length &&
          currentPageData?.design === 'V1 - Horizontal Card Layout'
        ) {
          shouldPageHaveShorterTtl = true;
          // Have shorter TTL on cache, if product cards are empty (fetch fails or catalog team temporarily remove the cards)
        }

        const strValues = transformStringValues<MicrositeDocumentData>({
          array: MICROSITE_STRING_KEYS,
          currentPageData,
          baseLangData: baseLangPageData,
        });

        const canonicalLink = await getCanonicalLinkFromBaseLangData({
          baseLangCanonicalLink: baseLangPageData?.canonical_link,
          currentPageLang,
          isDev,
          host,
        });

        if (Object.keys(currentPageData?.alert_popup)?.length === 1) {
          currentPageData.alert_popup = baseLangPageData?.alert_popup;
        }

        const headerScripts = Object.keys(currentPageData?.header_scripts)
          ?.length
          ? currentPageData?.header_scripts
          : baseLangPageData?.header_scripts;

        const otherMetaTags = Object.keys(currentPageData?.other_meta_tags)
          ?.length
          ? currentPageData?.other_meta_tags
          : baseLangPageData?.other_meta_tags;

        const imagesArray = currentPageData?.images?.length
          ? currentPageData?.images
          : baseLangPageData?.images;

        let subattractionsContentPageData;
        // treat sub attractions microsite as content page
        if (
          shoulder_page_type === SHOULDER_PAGE_TYPE.SUB_ATTRACTIONS &&
          SUBATTRACTION_TYPE[
            subattraction_type as keyof typeof SUBATTRACTION_TYPE
          ]
        ) {
          // @ts-ignore
          subattractionsContentPageData = await getContentPageDocument({
            req,
            host,
            lang,
            uid,
            isDev,
            documentData: micrositeData,
            baseLangMicrositeData,
          });
        }

        const transformedData: TMicrositeDocument = {
          ...micrositeData,
          data: {
            ...micrositeData.data,
            ...strValues,
            header_scripts: headerScripts,
            other_meta_tags: otherMetaTags,
            images: imagesArray,
            canonical_link: (canonicalLink || pageUrl) as KeyTextField,
            noindex: isLocalizedLang
              ? baseLangPageData?.noindex
              : currentPageData?.noindex,
            enable_earliest_availability:
              baseLangPageData?.enable_earliest_availability,
            redirect_to_headout_booking_flow: isLocalizedLang
              ? baseLangPageData.redirect_to_headout_booking_flow
              : currentPageData.redirect_to_headout_booking_flow,
            localisedCategoryTourListV1: isLocalizedLang
              ? baseLangCategoryTourListV1
              : currentPageCategoryTourListV1,
            customBanner,
            baseLangCustomBanner,
            currentPageCategoryTourListV1,
            categoryTourListV2,
            baseLangPageTitle: isLocalizedLang
              ? baseLangPageData.title
              : currentPageData.title,
            baseLangIsPoiMb: isLocalizedLang
              ? baseLangPageData.is_poi_mb
              : currentPageData.is_poi_mb,
            baseLangBannerAndFooterCombinations: isLocalizedLang
              ? baseLangPageData.banner_and_footer_combinations
              : currentPageData.banner_and_footer_combinations,
            baseLangCategorisationMetadata,
            mbType: tagged_mb_type,
          },
          subattractionsContentPageData,
          qnaSnippets: [],
          qnaSections: [],
        };

        return {
          CMSContent: transformedData,
          ContentType: CUSTOM_TYPES.MICROSITE,
          shouldPageHaveShorterTtl,
        };
      } catch (error) {
        Sentry.captureException(error);
        sendLog({
          err: error,
          message: `[getMicrositeDocument] getMicrositeDocument - ${uid}`,
        });
        // eslint-disable-next-line no-console
        console.log(`${CUSTOM_TYPES.MICROSITE} baselang document`, error);
      }
    }
  } else {
    return Promise.reject();
  }
};

export default getMicrositeDocument;
