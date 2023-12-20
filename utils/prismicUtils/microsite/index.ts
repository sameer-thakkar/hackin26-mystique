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
import { convertUidToUrl, sanitizeURL } from 'utils/urlUtils';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  MICROSITE_STRING_KEYS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  SLICE_TYPES,
  TEMPLATES,
} from 'const/index';
import type { TGetDocument, TRedirectInfo } from '../interface';
import { getTopAttractionsDoc } from '../topAttractions';
import type {
  TMicrositeDocument,
  TResolvedDocumentResponseM,
} from './interface';

const getMicrositeDocument = async ({
  req,
  uid,
  lang,
  host,
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

  sendLog({
    message: {
      uid,
      documentType: CUSTOM_TYPES.MICROSITE,
      lang,
      functionality: 'micrositeData',
      msg: 'Prismic API call from Canary',
    },
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
      if (host?.slice(0, 5) === 'stage') {
        if (pageUrl) {
          pageUrl = pageUrl.split('//').join('//stage-');
        }
      }
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

        if (isLocalizedLang && baseLangUid) {
          sendLog({
            message: {
              uid,
              documentType: CUSTOM_TYPES.MICROSITE,
              lang,
              functionality: 'micrositeData',
              msg: 'Prismic API call from Canary',
            },
          });
        }

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

        let topAttractionsData = undefined;

        // Base lang Fallback for Tour Ranking.
        const tourTabSlice = currentPageData?.body1?.[0];
        if (tourTabSlice?.primary && !tourTabSlice?.primary?.ranking) {
          tourTabSlice.primary.ranking =
            baseLangPageData?.body1[0]?.primary?.ranking ?? '';
        }

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
          baseLangCategoryTourListV1.primary.locale_ranking =
            currentPageCategoryTourListV1?.primary?.locale_ranking ||
            baseLangCategoryTourListV1?.primary?.locale_ranking;
          baseLangCategoryTourListV1.primary.locale_exclusions =
            currentPageCategoryTourListV1?.primary?.locale_exclusions ||
            baseLangCategoryTourListV1?.primary?.locale_exclusions;
        }

        const categoryTourListV1Primary = isLocalizedLang
          ? baseLangCategoryTourListV1?.primary
          : currentPageCategoryTourListV1?.primary;

        const { product_cards: productCards } = categoryTourListV1Primary ?? {};

        let shouldPageHaveShorterTtl = false;

        if (!Object.keys(categoryTourListV1Primary ?? {})?.length) {
          shouldPageHaveShorterTtl = true;
          // Have shorter TTL on cache, if product cards are empty (fetch fails or catalog team temporarily remove the cards)
        }

        // prismic typescript doesn't infer linked document fetch :(
        const {
          template,
          city,
          sub_category: subcategoryId,
          // @ts-ignore
        } = productCards?.data ?? {};
        const { cityCode: cityName } = city || {};
        if (template === TEMPLATES.HOHO && cityName && subcategoryId) {
          try {
            topAttractionsData = await getTopAttractionsDoc({
              cityName,
              subcategoryId,
              lang,
            });
          } catch (error) {
            Sentry.captureException(error);
            sendLog({
              err: error,
            });
            // eslint-disable-next-line no-console
            console.log('top-attractions-data-hoho', error);
          }
        }

        const strValues = transformStringValues<MicrositeDocumentData>({
          array: MICROSITE_STRING_KEYS,
          currentPageData,
          baseLangData: baseLangPageData,
        });

        let canonicalLink;

        if (
          isLocalizedLang &&
          canonicalLink &&
          !currentPageData.canonical_link
        ) {
          canonicalLink = new URL(sanitizeURL(canonicalLink));
          canonicalLink.pathname = `/${
            PRISMIC_LANG_TO_ROUTE_PARAM?.[lang ?? DEFAULT_PRISMIC_LANG]
          }${canonicalLink.pathname}`;
          canonicalLink = canonicalLink.toString();
        }

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
            categoryTourListV2,
            topAttractionsData,
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
