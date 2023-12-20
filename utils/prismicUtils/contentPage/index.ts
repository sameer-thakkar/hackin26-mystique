import { createClient } from 'prismicio';
import type { ProductCardsDocument } from 'types.prismic';
import {
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
} from 'utils';
import { sendLog } from 'utils/logger';
import { convertUidToUrl } from 'utils/urlUtils';
import { CUSTOM_TYPES, DEFAULT_PRISMIC_LANG, SLICE_TYPES } from 'const/index';
import type { TGetDocument } from '../interface';
import { contentPageGq } from './graphQuery';

const getContentPageDocument = async ({
  req,
  uid,
  lang,
  host,
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
  sendLog({
    message: {
      uid,
      documentType: CUSTOM_TYPES.CONTENT_PAGE,
      lang,
      functionality: 'contentPage',
      msg: 'Prismic API call from Canary',
    },
  });

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
      contentPage.data.microsite_document_ref?.data.redirect_url?.url;
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

    if (isLocalizedLang) {
      sendLog({
        message: {
          uid,
          documentType: CUSTOM_TYPES.CONTENT_PAGE,
          lang,
          functionality: 'baseLangMicrositeData',
          msg: 'Prismic API call from Canary',
        },
      });
      sendLog({
        message: {
          uid,
          documentType: CUSTOM_TYPES.CONTENT_PAGE,
          lang,
          functionality: 'baseLangData',
          msg: 'Prismic API call from Canary',
        },
      });
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
          message: `[productCardsDocument]`,
        });
      }
    }

    let completePage = {
      ...contentPage,
      data: {
        ...contentPage?.data,
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
