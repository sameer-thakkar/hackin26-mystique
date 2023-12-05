import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import { PrismicDocumentWithUID } from '@prismicio/types';
import * as Sentry from '@sentry/nextjs';
import { toursTabSliceHandler } from 'components/Slices';
import type { CollectionDetails } from 'components/StaticBanner/index';
import {
  deepDeleteKeys,
  documentUidUpdateRedirectHandler,
  getCollectionSection,
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  getTgidsFromShow,
  handleSettledPromiseResults,
  isCategoryMB,
  isCollectionMB,
  isSubCategoryMB,
  refsArrayToObject,
} from 'utils';
import {
  constructHeaders,
  fetchCollection,
  fetchCollectionList,
  fetchCurrencyList,
  fetchDomainConfig,
  fetchMediaResource,
  fetchTourGroupsByCategory,
  fetchTourGroupSlots,
  fetchTourGroupV6,
  fetchTourListV6,
} from 'utils/apiUtils';
import {
  getBreadcrumbs,
  getShowPageBreadcrumbs,
  getVenuePageBreadcrumbs,
} from 'utils/breadcrumbsUtils';
import { getCatAndSubCatPageData } from 'utils/categoryPageUtils';
import { generateCityPageData } from 'utils/cityPageUtils';
import { getDocsForListicleSlice } from 'utils/contentPageUtils';
import {
  categoryTourListParserV1,
  getToursGlobalCollection,
  parseVariantsData,
  uncategorizedToursListParser,
} from 'utils/dataParsers';
import { getCategoryHeaderMenu, getRankedDocuments } from 'utils/headerUtils';
import {
  checkIfCategoryHeaderExists,
  checkIfCatOrSubCatPage,
  getHostName,
} from 'utils/helper';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import categoryTourListParserV2 from 'utils/parsers/categoryTourListParserV2/index';
import {
  getNewsPageData,
  getNewsPageDocument,
} from 'utils/prismicPageData/NewsPage';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import {
  convertUidToUrl,
  getLangUID,
  getValidUrlParams,
  sanitizeURL,
} from 'utils/urlUtils';
import { MISC } from 'const/header';
import {
  CATEGORY_IDS,
  CUSTOM_TYPES,
  LANGUAGE_MAP,
  LINKED_MICROSITE_PROPS,
  MB_CATEGORISATION,
  MB_TYPES,
  MICROBRANDS_URL,
  MICROSITE_ARRAY_KEYS,
  MICROSITE_OBJECT_KEYS,
  MICROSITE_STRING_KEYS,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  RESOURCE_TYPE,
  SLICE_TYPES,
  TEMPLATES,
  THEMES,
  TLANGUAGELOCALE,
  VIENNA_CONCERT_UID,
  X_CACHE_HEADER_KEY,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';

// @ts-expect-error TS(7023): 'fetchAllMatchingDocs' implicitly has return type ... Remove this comment to see the full error message
export const fetchAllMatchingDocs = async ({
  query,
  params = { pageSize: 100, page: 1, lang: '*' },
  documents = [],
}: {
  query: string | string[];
  params?: Record<string, any>;
  page?: number;
  documents?: any[];
}) => {
  const response = await Client().query(query, params);
  if (response.page < response.total_pages) {
    return await fetchAllMatchingDocs({
      query,
      params: { ...params, page: response.page + 1 },
      documents: documents.concat(response?.results),
    });
  } else {
    return documents.concat(response.results);
  }
};

export const getSafetyBannerDocument = async ({ lang }: any) => {
  const safetyBannerResponse = await Client().query(
    Prismic.Predicates.at('document.type', CUSTOM_TYPES.SAFETY_BANNER),
    { lang: lang }
  );
  if (safetyBannerResponse) {
    const [data] = safetyBannerResponse?.results;
    const { options } = data?.data;
    return options;
  }
  return Promise.reject();
};

export const getPromoCodesDocument = async () => {
  const promoCodesResponse = await Client().query(
    Prismic.Predicates.at('document.type', CUSTOM_TYPES.PROMO_CODES),
    { lang: 'en-us' }
  );
  if (promoCodesResponse) {
    const [data] = promoCodesResponse?.results;
    const { promos } = data?.data;
    return promos;
  }
  return Promise.reject();
};

export const getContentPageDocument = async ({ req, uid, lang, host }: any) => {
  return await Client(req)
    .getByUID(CUSTOM_TYPES.CONTENT_PAGE, uid, {
      fetchLinks: [...LINKED_MICROSITE_PROPS],
      lang,
    })
    .then(async (page: any) => {
      const EN_LANG_CODE = 'en-us';
      if (page) {
        if (page.uid !== uid) {
          let url = convertUidToUrl({
            uid: page.uid,
            lang: getHeadoutLanguagecode(lang),
          });
          if (host.slice(0, 5) === 'stage') {
            if (url) {
              url = url.split('//')?.join('//stage-');
            }
          }
          return {
            redirectInfo: {
              url,
              type: 301,
            },
          };
        }
      }
      // Listicle Page Logic
      if (!(page && page.data)) {
        return Promise.reject();
      }

      // Redirect logic (content pages redirect else microsite redirect)
      const url =
        page.data?.redirect_url?.url ||
        page.data.microsite_document_ref?.data.redirect_url?.url;
      if (url) {
        return {
          redirectInfo: {
            url,
            type: 301,
          },
        };
      }

      /**
       *  Fetching data of referenced custom types which cannot be
       * fetched using the fetchLink method due to prismic constraints
       * Currently includes: Common Footer, Content Framework
       */
      const footerID = page.data.footer_ref.id || '';
      const headerID = page.data.header_ref.id || '';
      const secondaryFooterID = page.data.secondary_footer?.id || '';
      const contentFrameworkID = page.data.content_framework?.id || '';
      const micrositeId = page.data.microsite_document_ref.id || '';

      const linkedRefIDs = [];
      linkedRefIDs.push(footerID);
      linkedRefIDs.push(headerID);
      linkedRefIDs.push(micrositeId);
      linkedRefIDs.push(contentFrameworkID);
      linkedRefIDs.push(secondaryFooterID);
      const refArray = await getRefsArrayByIds(linkedRefIDs, req);
      const {
        commonFooter,
        commonHeader,
        contentFramework,
        secondaryFooter,
        microsite: micrositeData,
      } = refsArrayToObject(refArray);

      const baseLangUid = getEnglishDocUid(page?.alternate_languages);
      const baseLangData =
        lang !== EN_LANG_CODE
          ? await Client(req)
              .getByUID(CUSTOM_TYPES.CONTENT_PAGE, baseLangUid || uid, {
                lang: EN_LANG_CODE,
              })
              .then((res: any) => res)
          : page;

      const baseLangMicrositeData =
        lang !== EN_LANG_CODE
          ? await Client(req)
              .getByUID(
                CUSTOM_TYPES.MICROSITE,
                baseLangData?.data?.microsite_document_ref?.uid,
                {
                  lang: EN_LANG_CODE,
                }
              )
              .then((res: any) => res)
          : micrositeData;

      const baseLangRefArray = await getRefsArrayByIds(
        [baseLangData?.data?.content_framework?.id],
        req
      );
      const { contentFramework: baseLangContentFramework } = refsArrayToObject(
        baseLangRefArray
      );
      const {
        data: { tagged_mb_type: mbType },
      } = baseLangData || { data: {} };

      let categoryTourListV1 = getSinglePrismicSlice({
        sliceName: 'ticket_card_shoulder_page',
        slices:
          lang !== EN_LANG_CODE
            ? baseLangContentFramework?.data?.body
            : contentFramework?.data?.body,
      });

      let productCardData, baseLangExperienceLimit;
      const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;
      if (hasCategoryTourListV1) {
        const { primary } = categoryTourListV1;
        const { product_cards, sp_experience_limit } = primary || {};
        const { id: productCardsId } = product_cards || {};
        const { data } =
          (await Client(req).getByID(productCardsId, {
            lang: EN_LANG_CODE,
          })) || {};
        productCardData = data;
        baseLangExperienceLimit = sp_experience_limit;
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
      } = baseLangData?.data || {};

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

      let completePage = {
        ...page,
        data: {
          ...page.data,
          mbType,
          footer_ref: commonFooter,
          header_ref: commonHeader,
          content_framework: contentFramework,
          microsite: micrositeData,
          secondaryFooter,
          productCardData,
          noindex:
            lang !== EN_LANG_CODE
              ? baseLangData.data.noindex
              : page.data.noindex,
          baseLangExperienceLimit,
          baseLangPageTitle:
            lang !== EN_LANG_CODE ? baseLangData?.data?.title : page.data.title,
          baseLangIsPoiMb:
            lang !== EN_LANG_CODE
              ? baseLangMicrositeData.data.is_poi_mb
              : micrositeData.data.is_poi_mb,
          baseLangBannerAndFooterCombinations:
            lang !== EN_LANG_CODE
              ? baseLangMicrositeData.data.banner_and_footer_combinations
              : micrositeData.data.banner_and_footer_combinations,
          redirect_to_headout_booking_flow:
            lang !== EN_LANG_CODE
              ? baseLangData?.data?.redirect_to_headout_booking_flow
              : page.data.redirect_to_headout_booking_flow,
          baseLangMicrositeData,
          baseLangCategorisationMetadata,
        },
      };

      return {
        CMSContent: completePage,
        ContentType: CUSTOM_TYPES.CONTENT_PAGE,
      };
    });
};

export const getMicrositeDocument = async ({
  req,
  uid,
  lang,
  host,
}: any): Promise<any> => {
  return await Client(req)
    .getByUID(CUSTOM_TYPES.MICROSITE, uid, {
      lang,
    })
    .then(async (res: any) => {
      let completeMicrosite = { data: res };
      if (completeMicrosite.data) {
        if (completeMicrosite.data.uid !== uid) {
          let url = convertUidToUrl({
            uid: completeMicrosite.data.uid,
            lang: getHeadoutLanguagecode(lang),
          });
          if (host.slice(0, 5) === 'stage') {
            if (url) {
              url = url.split('//').join('//stage-');
            }
          }
          return {
            redirectInfo: {
              url,
              type: completeMicrosite.data.data.redirect_type,
            },
          };
        } else {
          const baseLangUid = getEnglishDocUid(
            completeMicrosite?.data?.alternate_languages
          );
          const baseLangData =
            lang !== 'en-us'
              ? await Client(req)
                  .getByUID(CUSTOM_TYPES.MICROSITE, baseLangUid || uid, {
                    lang: 'en-us',
                  })
                  .then((res: any) => res)
              : completeMicrosite.data;
          const {
            data: {
              is_entertainment_mb: isEntertainmentMb,
              body: localisedCategoryTourListSlice,
              tagged_mb_type: mbType,
            },
          } = baseLangData || { data: {} };
          completeMicrosite.data.mbType = mbType;

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
          } = baseLangData?.data || {};

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

          let allShowPages, productCardData, topAttractionsData;
          if (isEntertainmentMb) {
            allShowPages = await fetchAllMatchingDocs({
              query: [
                Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
                Prismic.Predicates.at(`document.type`, CUSTOM_TYPES.SHOW_PAGE),
              ],
              params: { lang },
            });
          }

          const strValues: any = MICROSITE_STRING_KEYS.reduce(
            (acc, elem) => ({
              ...acc,
              [elem]:
                completeMicrosite.data.data[elem] || baseLangData.data[elem],
            }),
            {}
          );

          const objValues = MICROSITE_OBJECT_KEYS.reduce(
            (acc, elem) => ({
              ...acc,
              [elem]: Object.keys(completeMicrosite.data.data[elem]).length
                ? completeMicrosite.data.data[elem]
                : baseLangData.data[elem],
            }),
            {}
          );

          const arrValues = MICROSITE_ARRAY_KEYS.reduce(
            (acc, elem) => ({
              ...acc,
              [elem]: completeMicrosite.data.data[elem].length
                ? completeMicrosite.data.data[elem]
                : baseLangData.data[elem],
            }),
            {}
          );

          const isCatOrSubCatPage = await checkIfCatOrSubCatPage(
            completeMicrosite?.data,
            baseLangCategorisationMetadata
          );

          // Base lang Fallback for Tour Ranking.
          const tourTabSlice = completeMicrosite.data.data.body1[0];
          if (tourTabSlice?.primary && !tourTabSlice.primary.ranking) {
            tourTabSlice.primary.ranking =
              baseLangData?.data?.body1[0]?.primary?.ranking;
          }

          // Base lang Fallback for CategorisedToursV1
          let localisedCategoryTourListV1 = !isCatOrSubCatPage
            ? getSinglePrismicSlice({
                sliceName: 'tour_list_category_v1',
                slices: localisedCategoryTourListSlice,
              })
            : {};
          const englishCategoryTourListSlice = completeMicrosite.data.data.body;

          let categoryTourListV1 = !isCatOrSubCatPage
            ? getSinglePrismicSlice({
                sliceName: 'tour_list_category_v1',
                slices: englishCategoryTourListSlice,
              })
            : {};

          let categoryTourListV2 = !isCatOrSubCatPage
            ? getSinglePrismicSlice({
                sliceName: 'tour_list_category',
                slices:
                  lang === LANGUAGE_MAP.en.locale
                    ? englishCategoryTourListSlice
                    : localisedCategoryTourListSlice,
              })
            : {};

          if (
            Object.keys(localisedCategoryTourListV1)?.length &&
            !isCatOrSubCatPage
          ) {
            localisedCategoryTourListV1.primary.locale_ranking =
              categoryTourListV1?.primary?.locale_ranking ||
              localisedCategoryTourListV1?.primary?.locale_ranking;
            localisedCategoryTourListV1.primary.locale_exclusions =
              categoryTourListV1?.primary?.locale_exclusions ||
              localisedCategoryTourListV1?.primary?.locale_exclusions;
          }
          if (
            !categoryTourListV1?.primary?.product_cards?.id &&
            !isCatOrSubCatPage
          ) {
            categoryTourListV1 = localisedCategoryTourListV1;
          }

          const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;
          if (hasCategoryTourListV1 && !isCatOrSubCatPage) {
            const { primary } = categoryTourListV1;
            const { product_cards } = primary || {};
            const { id: productCardsId } = product_cards || {};
            if (productCardsId) {
              try {
                const { data } =
                  (await Client(req).getByID(productCardsId, {
                    lang: 'en-us',
                  })) || {};
                productCardData = data;
                const { template, city, sub_category: subcategoryId } =
                  productCardData || {};
                const { cityCode: cityName } = city || {};
                if (template === TEMPLATES.HOHO && cityName && subcategoryId) {
                  topAttractionsData = await getTopAttractionsDoc({
                    cityName,
                    subcategoryId,
                    lang,
                  });
                }
              } catch (e) {
                Sentry.captureException(e);
                sendLog({
                  err: e,
                });
                // eslint-disable-next-line no-console
                console.log('productCard-error', e);
              }
            }
          }

          if (
            Object.keys(completeMicrosite.data.data['alert_popup']).length === 1
          ) {
            completeMicrosite.data.data['alert_popup'] =
              baseLangData.data['alert_popup'];
          }
          /**
           * References Handler;
           * The final case empty string was added
           * to handle promise resolve more neatly.
           */
          const footerID =
            completeMicrosite.data.data.footer_ref.id ||
            baseLangData.data.footer_ref.id ||
            '';
          const secondaryFooterId =
            completeMicrosite.data.data.secondary_footer?.id || '';
          const contentSectionId =
            completeMicrosite.data.data.content_framework.id || '';
          const contentSectionTreatmentId =
            completeMicrosite.data.data.content_framework_treatment?.id || '';
          const commonHeaderId =
            completeMicrosite.data.data.common_header_ref?.id ||
            baseLangData.data.common_header_ref?.id ||
            '';

          const linkedRefIDs = [];
          linkedRefIDs.push(footerID);
          linkedRefIDs.push(contentSectionId);
          linkedRefIDs.push(contentSectionTreatmentId);
          linkedRefIDs.push(commonHeaderId);
          linkedRefIDs.push(secondaryFooterId);
          const refArray = await getRefsArrayByIds(linkedRefIDs, req);
          const {
            commonFooter,
            commonHeader,
            contentFramework,
            secondaryFooter,
          } = refsArrayToObject(refArray);
          const contentFrameworkTreatment = refArray?.find(
            (ref: Record<string, any>) => ref?.id === contentSectionTreatmentId
          );

          let canonicalLink = strValues?.canonical_link;
          try {
            if (
              lang !== 'en-us' &&
              canonicalLink &&
              !completeMicrosite.data.data.canonical_link
            ) {
              canonicalLink = new URL(sanitizeURL(canonicalLink));
              canonicalLink.pathname = `/${PRISMIC_LANG_TO_ROUTE_PARAM[lang]}${canonicalLink.pathname}`;
              canonicalLink = canonicalLink.toString();
            }
          } catch (e) {
            // invalid url entered
          }

          const micrositeData = {
            ...completeMicrosite,
            data: {
              ...completeMicrosite.data,
              refs: {
                commonFooter,
                contentFramework,
                contentFrameworkTreatment,
                commonHeader,
                secondaryFooter,
                productCardData,
              },
              data: {
                ...completeMicrosite.data.data,
                ...(topAttractionsData && {
                  topAttractionsData,
                }),
                ...strValues,
                ...objValues,
                ...arrValues,
                canonical_link:
                  canonicalLink ||
                  convertUidToUrl({
                    uid: completeMicrosite.data.uid,
                    lang: getHeadoutLanguagecode(lang),
                  }),
                noindex:
                  lang !== 'en-us'
                    ? baseLangData.data.noindex
                    : completeMicrosite.data.data.noindex,
                enable_earliest_availability:
                  baseLangData.data.enable_earliest_availability,
                baseLangPageTitle:
                  lang !== 'en-us'
                    ? baseLangData.data.title
                    : completeMicrosite.data.data.title,
                baseLangIsPoiMb:
                  lang !== 'en-us'
                    ? baseLangData.data.is_poi_mb
                    : completeMicrosite.data.data.is_poi_mb,
                baseLangBannerAndFooterCombinations:
                  lang !== 'en-us'
                    ? baseLangData.data.banner_and_footer_combinations
                    : completeMicrosite.data.data
                        .banner_and_footer_combinations,
                redirect_to_headout_booking_flow:
                  lang !== 'en-us'
                    ? baseLangData.data.redirect_to_headout_booking_flow
                    : completeMicrosite.data.data
                        .redirect_to_headout_booking_flow,
                localisedCategoryTourListV1,
                categoryTourListV2,
                ...(allShowPages && { allShowPages }),
                baseLangCategorisationMetadata,
              },
            },
          };

          return {
            CMSContent: micrositeData,
            ContentType: CUSTOM_TYPES.MICROSITE,
          };
        }
      } else {
        return Promise.reject();
      }
    });
};

export const getVenuePageDocument = async ({ req, uid, lang }: any) => {
  try {
    const response = await Client(req).getByUID(CUSTOM_TYPES.VENUE_PAGE, uid, {
      lang,
    });

    if (response) {
      const {
        header_ref,
        footer_ref,
        secondary_footer_ref,
        seating_capacity,
        mobile_banner,
        desktop_banner,
        theatre_name,
        theatre_location_url,
        theatre_location_cta,
        info,
        amenities_dropdown,
        body2,
        tagged_city,
        tagged_country,
        google_map_url,
        tagged_collection,
        title,
        description,
        image_url,
        tagged_category,
        tagged_sub_category,
        tagged_mb_type,
      } = response.data;

      const linkedRefIDs = [];
      linkedRefIDs.push(header_ref.id, footer_ref.id, secondary_footer_ref.id);
      const refArray = await getRefsArrayByIds(linkedRefIDs, req);
      const { commonFooter, commonHeader, secondaryFooter } = refsArrayToObject(
        refArray
      );

      const venuePageData = {
        ...response,
        data: {
          refs: {
            commonHeader,
            commonFooter,
            secondaryFooter,
          },
          mbType: tagged_mb_type,
          seatingCapacity: seating_capacity,
          mobileBanner: mobile_banner,
          desktopBanner: desktop_banner,
          theatreName: theatre_name,
          theatreLocationUrl: theatre_location_url,
          theatreLocationCta: theatre_location_cta,
          googleMapUrl: google_map_url,
          theatreInfo: info,
          taggedCollection: tagged_collection,
          city: tagged_city,
          country: tagged_country,
          amenitiesDropdown: amenities_dropdown,
          descriptionSlices: body2,
          title,
          description,
          image_url,
          taggedCategoryName: tagged_category,
          taggedSubCategoryName: tagged_sub_category,
        },
      };

      return {
        CMSContent: venuePageData,
        ContentType: CUSTOM_TYPES.VENUE_PAGE,
      };
    }
    return Promise.reject();
  } catch (err) {
    Sentry.captureException(err);
    sendLog({
      err,
    });
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export const getGlobalHomepage = async ({ req, uid, lang }: any) => {
  const response = await Client(req).getByUID(
    CUSTOM_TYPES.GLOBAL_HOMEPAGE,
    uid,
    {
      lang,
    }
  );
  if (response) {
    const {
      common_header,
      common_footer,
      content_framework,
      mb_type,
    } = response.data;

    const client = Client();
    const cityCollections = mb_type
      ? await client.query(
          [
            Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_CITY),
            Prismic.Predicates.at(
              `my.${CUSTOM_TYPES.GLOBAL_CITY}.mb_type`,
              mb_type
            ),
          ],
          { pageSize: 100 }
        )
      : null;
    const collections = mb_type
      ? await client.query(
          [
            Prismic.Predicates.at(
              'document.type',
              CUSTOM_TYPES.GLOBAL_COLLECTION
            ),
            Prismic.Predicates.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.mb_type`,
              mb_type
            ),
          ],
          { pageSize: 100 }
        )
      : null;

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id, content_framework.id],
      req
    );
    const { commonHeader, commonFooter, contentFramework } = refsArrayToObject(
      refArray
    );
    return {
      CMSContent: {
        ...response,
        ...(collections && { collections }),
        ...(cityCollections && { cityCollections }),
        commonFooter,
        commonHeader,
        contentFramework,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_HOMEPAGE,
    };
  }
  return Promise.reject();
};

export const getGlobalCollection = async ({ req, uid, lang }: any) => {
  const response = await Client(req).getByUID(
    CUSTOM_TYPES.GLOBAL_COLLECTION,
    uid,
    {
      lang,
    }
  );
  const client = Client();
  if (response) {
    const { id: docID } = response;
    const {
      common_header,
      common_footer,
      content_framework,
      country: { id: countryDocID },
      city: { id: cityDocID },
    } = response.data;

    const cityCollections = cityDocID
      ? await client.query(
          [
            Prismic.Predicates.at(
              'document.type',
              CUSTOM_TYPES.GLOBAL_COLLECTION
            ),
            Prismic.Predicates.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.city`,
              cityDocID
            ),
          ],
          { pageSize: 100 }
        )
      : null;

    const countryCollections = countryDocID
      ? await client.query(
          [
            Prismic.Predicates.at(
              'document.type',
              CUSTOM_TYPES.GLOBAL_COLLECTION
            ),
            Prismic.Predicates.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.country`,
              countryDocID
            ),
          ],
          { pageSize: 100 }
        )
      : null;

    const subPages = await client.query(
      [
        Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_EXPERIENCE),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.GLOBAL_EXPERIENCE}.collection`,
          docID
        ),
      ],
      { pageSize: 100 }
    );

    let ticketsPage, attractionsPage;
    if (subPages?.results?.length) {
      ticketsPage =
        subPages?.results?.find(
          (page: any) => page.data.page_type === 'Tickets'
        ) || {};
      attractionsPage =
        subPages?.results?.find(
          (page: any) => page.data.page_type === 'Attractions'
        ) || {};
    }

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id, content_framework.id],
      req
    );
    const { commonHeader, commonFooter, contentFramework } = refsArrayToObject(
      refArray
    );
    return {
      CMSContent: {
        ...response,
        ticketsPage,
        attractionsPage,
        ...(cityCollections && { cityCollections }),
        ...(countryCollections && { countryCollections }),
        commonHeader,
        commonFooter,
        contentFramework,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_COLLECTION,
    };
  }
  return Promise.reject();
};

export const getGlobalCity = async ({ req, uid, lang }: any) => {
  const cityResponse = await Client(req).getByUID(
    CUSTOM_TYPES.GLOBAL_CITY,
    uid,
    {
      lang,
    }
  );
  if (cityResponse) {
    const { id: cityDocId } = cityResponse;
    const {
      common_header,
      common_footer,
      content_framework,
    } = cityResponse.data;

    const client = Client();
    const cityCollections = await client.query(
      [
        Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_COLLECTION),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.city`,
          cityDocId
        ),
      ],
      { pageSize: 100 }
    );

    const ticketPages = await client.query(
      [
        Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_EXPERIENCE),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.GLOBAL_EXPERIENCE}.city`,
          cityDocId
        ),
      ],
      { pageSize: 100 }
    );

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id, content_framework.id],
      req
    );
    const { commonHeader, commonFooter, contentFramework } = refsArrayToObject(
      refArray
    );
    return {
      CMSContent: {
        ...cityResponse,
        cityCollections,
        commonHeader,
        commonFooter,
        contentFramework,
        ticketPages,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_CITY,
    };
  }
  return Promise.reject();
};

export const getGlobalCountry = async ({ req, uid, lang }: any) => {
  const countryResponse = await Client(req).getByUID(
    CUSTOM_TYPES.GLOBAL_COUNTRY,
    uid,
    {
      lang,
    }
  );
  if (countryResponse) {
    const { id: countryDocID } = countryResponse;
    const {
      common_header,
      common_footer,
      content_framework,
    } = countryResponse.data;

    const client = Client();
    const getAllCollections = await client.query(
      [
        Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_COLLECTION),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.country`,
          countryDocID
        ),
      ],
      { pageSize: 100 }
    );

    const cityCollections = await client.query(
      [
        Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_CITY),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.GLOBAL_CITY}.country`,
          countryDocID
        ),
      ],
      { pageSize: 100 }
    );

    const ticketPages = await client.query(
      [
        Prismic.Predicates.at('document.type', CUSTOM_TYPES.GLOBAL_EXPERIENCE),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.GLOBAL_EXPERIENCE}.country`,
          countryDocID
        ),
      ],
      { pageSize: 100 }
    );

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id, content_framework.id],
      req
    );
    const { commonHeader, commonFooter, contentFramework } = refsArrayToObject(
      refArray
    );
    return {
      CMSContent: {
        ...countryResponse,
        collections: {
          ...getAllCollections,
        },
        cityCollections,
        commonHeader,
        commonFooter,
        contentFramework,
        ticketPages,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_COUNTRY,
    };
  }
  return Promise.reject();
};

export const getGlobalExperience = async ({ req, uid, lang }: any) => {
  const response = await Client(req).getByUID(
    CUSTOM_TYPES.GLOBAL_EXPERIENCE,
    uid,
    {
      lang,
    }
  );
  if (response) {
    const {
      common_header,
      common_footer,
      content_framework,
      collection,
    } = response.data;

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id, content_framework.id, collection.id],
      req
    );
    const {
      commonHeader,
      commonFooter,
      contentFramework,
      globalCollection,
    } = refsArrayToObject(refArray);
    const {
      country: { id: countryDocID },
      city: { id: cityDocID },
      city_name: cityName,
    } = globalCollection?.data;
    const client = Client();
    const cityCollections = cityDocID
      ? await client.query(
          [
            Prismic.Predicates.at(
              'document.type',
              CUSTOM_TYPES.GLOBAL_COLLECTION
            ),
            Prismic.Predicates.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.city`,
              cityDocID
            ),
          ],
          { pageSize: 100 }
        )
      : null;

    const countryCollections = countryDocID
      ? await client.query(
          [
            Prismic.Predicates.at(
              'document.type',
              CUSTOM_TYPES.GLOBAL_COLLECTION
            ),
            Prismic.Predicates.at(
              `my.${CUSTOM_TYPES.GLOBAL_COLLECTION}.country`,
              countryDocID
            ),
          ],
          { pageSize: 100 }
        )
      : null;
    return {
      CMSContent: {
        ...response,
        commonHeader,
        commonFooter,
        contentFramework,
        globalCollection,
        ...(cityCollections && { cityCollections }),
        ...(countryCollections && { countryCollections }),
        cityName,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_EXPERIENCE,
    };
  }
  return Promise.reject();
};

export const getRefsArrayByIds = async (
  ref_ids: Array<String>,
  req: Request
) => {
  // @ts-expect-error TS(2345): Argument of type 'Request' is not assignable to pa... Remove this comment to see the full error message
  const linkedRefsPromise = Client(req).getByIDs(
    ref_ids.filter((id) => id),
    {
      pageSize: 100,
    }
  );
  return await Promise.resolve(linkedRefsPromise).then((res: any) => {
    return res.results;
  });
};

export const getShowPageCollections = async ({
  pageSize = 100,
  page = 1,
  prevResults,
  lang,
}: {
  pageSize: number;
  page: number;
  prevResults: Array<any>;
  lang: string;
}): Promise<any[]> => {
  const {
    results = [],
    total_results_size: totalDocuments,
  } = await Client().query(
    [Prismic.Predicates.at('document.type', CUSTOM_TYPES.SHOW_PAGE)],
    { page, pageSize, lang }
  );
  const allResults = [...prevResults, ...results];

  if (allResults.length < totalDocuments) {
    return getShowPageCollections({
      pageSize: 100,
      page: page + 1,
      prevResults: allResults,
      lang,
    });
  }

  return allResults;
};

export const getShowPage = async ({ req, lang, uid, isDev, host }: any) => {
  const page = await Client(req).getByUID(CUSTOM_TYPES.SHOW_PAGE, uid, {
    lang,
  });

  if (page.uid !== uid) {
    const handlerData = documentUidUpdateRedirectHandler({
      toUid: page.uid,
      isDev,
      host,
      lang,
    });
    if (handlerData?.redirectInfo) {
      return handlerData;
    }
  }

  // const baseLangData =
  //   lang !== 'en-us'
  //     ? await Client(req)
  //       .getByUID(CUSTOM_TYPES.SHOW_PAGE, uid, {
  //         lang: 'en-us',
  //       })
  //       .then((res) => res)
  //     : page.data;

  const allDocuments = await getShowPageCollections({
    pageSize: 100,
    page: 1,
    prevResults: [],
    lang,
  });

  if (page) {
    const { common_footer, common_header } = page.data;

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id],
      req
    );
    const { commonHeader, commonFooter } = refsArrayToObject(refArray);
    return {
      CMSContent: {
        ...page,
        commonFooter,
        commonHeader,
        allShowPagesDocuments: allDocuments.map(
          (d: { uid: string; data: { tgid: string } }) => ({
            data: { tgid: d.data.tgid },
            uid: d.uid,
          })
        ),
      },
      ContentType: CUSTOM_TYPES.SHOW_PAGE,
    };
  }
  return Promise.reject();
};

export const getPrismicDocument = async ({
  req,
  isDev,
  lang,
  uid,
}: {
  req: any;
  lang: any;
  uid: any;
  isDev?: boolean;
}): Promise<{
  ContentType?: string;
  CMSContent?: any;
  statusCode?: number;
  redirectInfo?: {
    url: string;
    type: number;
  };
}> => {
  const { host } = req.headers || window.location;

  try {
    return await Promise.any([
      getMicrositeDocument({
        req,
        host,
        lang,
        uid,
      }),
      getNewsPageDocument({ req, lang, uid }),
      getVenuePageDocument({ req, lang, uid }),
      getContentPageDocument({
        req,
        host,
        lang,
        uid,
      }),
      getShowPage({
        req,
        lang,
        uid,
        isDev,
        host,
      }),
      getGlobalExperience({ req, lang, uid }),
      getGlobalCollection({ req, lang, uid }),
      getGlobalCity({ req, lang, uid }),
      getGlobalCountry({ req, lang, uid }),
      getGlobalHomepage({ req, lang, uid }),
    ]);
  } catch (error) {
    if ((error as any).errors && Array.isArray((error as any).errors)) {
      (error as any).errors.forEach((errorInstance: any) => {
        // eslint-disable-next-line no-console
        console.error(errorInstance);
      });
    }
    /**
     * Sentry quota due to the following line has exceeded the daily limit.
     * Blocking posting to sentry until all the issues are reduced to a significant limit.
     * Uncomment below line to resume posting parsing errors.
     *
     * Sentry Aggregate Errors:
     * https://sentry.io/organizations/headout/issues/3767199315/events/79cc53c79eb64cb0af310861962cffde/events/?cursor=0%3A50%3A0&project=1545593
     *
     * Sentry.captureException(error);
     */
    sendLog({
      err: error,
      message: {
        host: req?.headers?.host,
        url: req?.url,
        message: 'Prismic Doc Not Found',
      },
    });
    traceError({
      error,
      host: req?.headers?.host,
      url: req?.url,
      message: 'Prismic Doc Not Found',
    });
    return {
      statusCode: 404,
    };
  }
};

const fetchPrismicDocument = async ({
  req,
  host,
  uid,
  lang,
  isDev,
  invalidateApi,
}: {
  req: any;
  host: string;
  uid: any;
  lang: any;
  isDev: boolean;
  invalidateApi: string;
}): Promise<{
  prismicApiResponse: {
    ContentType?: string;
    CMSContent?: any;
    statusCode?: number;
    redirectInfo?: {
      url: string;
      type: number;
    };
  };
  prismicApiCacheStatus: string | null;
}> => {
  const { headers, cookies } = req;
  const requestHeaders = constructHeaders({ cookies, currentHeaders: headers });

  const params = new URLSearchParams({
    isDev: String(isDev),
  });

  // Bypass prismic api cache.
  if (invalidateApi) {
    params.append('invalidate-api', invalidateApi);
  }

  params.sort();
  const paramsString = params.toString();

  const domain = isDev ? `http://${host}` : MICROBRANDS_URL;
  const endpoint = `${domain}/api/prismic/${uid}/${lang}/?${paramsString}`;

  const response = (await fetch(endpoint, {
    headers: requestHeaders,
  })) || { statusCode: 404 };
  const cacheHeader = response.headers.get(X_CACHE_HEADER_KEY);
  const cacheAge = response.headers.get('age');
  const data = await response.json();
  return {
    prismicApiResponse: data,
    prismicApiCacheStatus: `${cacheHeader}, Age: ${cacheAge ?? -1}`,
  };
};

export const getPageData = async ({
  req,
  query,
  isDev,
  localizedStrings,
}: any) => {
  const { host } = req.headers || window.location;
  const isStage = host.includes('stage-');
  const { cookies } = req;
  const { uid, lang } = getLangUID(req, query);
  const hostname = getHostName(isStage, isDev, host);
  const { invalidateApi } = query;

  try {
    let initial_tgids: any = [];
    const {
      prismicApiResponse,
      prismicApiCacheStatus,
    } = await fetchPrismicDocument({
      req,
      host,
      isDev,
      uid,
      lang,
      invalidateApi,
    });

    const {
      ContentType,
      CMSContent,
      statusCode,
      redirectInfo,
    } = prismicApiResponse;
    const currencyListPromise = fetchCurrencyList();
    const domainConfigPromise = fetchDomainConfig(uid);

    if (redirectInfo) {
      const { url, type } = redirectInfo;
      const queryParamsString = getValidUrlParams(query);
      const urlWithParams = `${url}${
        queryParamsString ? `?${queryParamsString}` : ''
      }`;

      return {
        redirectInfo: {
          url: urlWithParams,
          type,
        },
      };
    } else if (statusCode) {
      return {
        statusCode,
      };
    }

    /**
     * scorpioAllTourGroupData will yield different sets of Properties based on CUSTOM_TYPE,
     * and finally gets returned with any other common data for CUSTOM_TYPE
     */
    let scorpioAllTourGroupData: any = {};
    let tgidsArray: any = [];
    let minPrice = 0;
    let bestDiscount = 0;
    const queryParams = (function getQueryparams() {
      try {
        const href = req ? `http://${host}${req.url}` : window.location.href;
        const url = new URL(href);
        if (url) {
          return {
            tgidToScroll: url.searchParams.get('tgid'),
            noTrack: typeof url.searchParams.get('no-track') === 'string',
            currencyCode: url.searchParams.get('currencyCode'),
            bookSubdomain: url.searchParams.get('bookSubdomain') ?? undefined,
          };
        }
        return {};
      } catch (error) {
        traceError({ error, host: req?.headers?.host, url: req?.url });
        return {};
      }
    })();

    if (ContentType === CUSTOM_TYPES.NEWS_PAGE) {
      return await getNewsPageData(
        CMSContent,
        ContentType,
        isDev,
        req,
        host,
        hostname,
        lang as TLANGUAGELOCALE,
        cookies,
        currencyListPromise,
        domainConfigPromise
      );
    }

    if (ContentType === CUSTOM_TYPES.VENUE_PAGE) {
      const showsListSlices = CMSContent.data?.descriptionSlices?.filter(
        (slice: any) => {
          return slice.slice_type === SLICE_TYPES.SHOWS_LIST;
        }
      );

      const showsListSlicesTgids = showsListSlices?.reduce(
        (
          acc: any[],
          curr: {
            items: [];
          }
        ) => {
          const tgids = getTgidsFromShow(curr.items);
          return (acc = [...acc, ...tgids]);
        },
        []
      );

      const showPageDocuments =
        showsListSlicesTgids.length > 0
          ? await Client().query(
              Prismic.Predicates.any('my.showpage.tgid', [
                ...showsListSlicesTgids,
              ])
            )
          : [];

      const allShowPageUids = showPageDocuments?.results?.map(
        (document: any) => {
          const tgid = document.data?.tgid;
          return {
            [tgid]: document.uid,
          };
        }
      );

      const showsData = await fetchTourListV6({
        tgids: [...showsListSlicesTgids],
        hostname,
        language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
        cookies,
      });

      const showsListSlicesData = showsData?.tourGroups;
      const availableShowsData = showsListSlicesData;

      const tgidForFirstShow = availableShowsData[0];

      const inventorySlotData = tgidForFirstShow
        ? await fetchTourGroupSlots({
            tgid: tgidForFirstShow?.id,
            hostname,
            forDays: 20,
            cookies,
          })
        : {};

      const breadcrumbs = await getVenuePageBreadcrumbs(CMSContent);

      return {
        CMSContent: {
          ...CMSContent,
          availableShowsData,
          allShowPageUids,
          inventorySlotData,
        },
        uid,
        host,
        ContentType,
        lang,
        isDev,
        tgidsInPage: [...showsListSlicesTgids],
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        breadcrumbs,
        prismicApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.CONTENT_PAGE) {
      const { data } = CMSContent || {};
      const {
        productCardData,
        content_framework: contentFramework,
        data: CMSData,
      } = data || {};
      const { data: contentFrameworkData } = contentFramework || {};
      const { body: slices } = contentFrameworkData || {};

      const [
        collectionsInListicles,
        docsForListicles,
      ] = await getDocsForListicleSlice({
        slices,
        hostname,
        lang: lang as string,
        cookies,
      });

      const { design, theme, body1 } = CMSData || {};
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabFirstSlice = body1?.[0];

      const categoryTourListV1 = getSinglePrismicSlice({
        sliceName: 'ticket_card_shoulder_page',
        slices,
      });

      let categoryTourListData;
      const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;

      if (hasCategoryTourListV1) {
        const sliceObj = {
          ...categoryTourListV1,
        };
        categoryTourListData = await categoryTourListParserV1({
          productCard: productCardData,
          sliceObj,
          hostname,
          lang: lang ?? LANGUAGE_MAP.en.code,
          cookies,
          localizedStrings,
        });
        minPrice = categoryTourListData.minPrice;
        bestDiscount = categoryTourListData.bestDiscount;
      }

      const prismicTours = toursTabFirstSlice
        ? toursTabSliceHandler(toursTabFirstSlice)
        : [];

      const toursList = uncategorizedToursListParser(
        prismicTours,
        initial_tgids
      );

      tgidsArray = toursList?.reduce((acc: any, tour: any) => {
        return [...acc, tour.tgid];
      }, []);
      const { activeCurrency, primaryCity, primaryCountry } =
        categoryTourListData || {};

      scorpioAllTourGroupData = {
        CMSContent,
        collectionsInListicles,
        docsForListicles,
        toursList,
        categoryTourListData,
        ContentType,
        uid,
        lang,
        host,
        MBDesign,
        isDev,
        queryParams,
        mbTheme,
        isStage,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        currencyList: await currencyListPromise,
        prismicApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_COLLECTION) {
      let ticketsData, startingPrice, currencyCode;
      const language = getHeadoutLanguagecode(lang ?? 'en-us');
      const city = CMSContent?.data?.city_name?.trim()?.split(' ')?.join('_');
      const categoryId = CMSContent?.data?.headout_category_id;
      const collectionId = CMSContent?.data?.headout_collection_id;
      if (collectionId) {
        const collectionData =
          (await fetchCollection({
            collectionId,
            hostname,
            language,
            currency: 'USD',
            cookies,
          })) ?? {};
        const pinnedCards =
          getCollectionSection(collectionData, 'PINNED_CARDS') ?? [];
        const genericSection =
          getCollectionSection(collectionData, 'GENERIC') ?? [];
        const headoutPicks =
          getCollectionSection(collectionData, 'HEADOUT_PICKS') ?? [];
        ticketsData = [...pinnedCards, ...genericSection, ...headoutPicks];
        const { collections: collectionList } =
          (await fetchCollectionList({
            collectionIds: [collectionId],
            language,
            currency: 'USD',
            hostname,
            cookies,
          })) ?? {};
        const [currentCollection] = collectionList ?? [];
        const { startingPrice: price } = currentCollection ?? {};
        startingPrice = price?.listingPrice;
        currencyCode = price?.currency;
      }
      if (!collectionId && categoryId) {
        const categoryData =
          (await fetchTourGroupsByCategory({
            categoryId,
            hostname,
            isSubCategory: false,
            city,
            language,
            currency: 'USD',
            cookies,
          })) ?? {};
        ticketsData = categoryData?.pageData?.items;
        startingPrice = categoryData?.unFilteredMetaData?.minPrice;
        currencyCode = categoryData?.currency?.code;
      }
      return {
        CMSContent: {
          ...CMSContent,
          tickets: {
            data: ticketsData,
            startingPrice,
            currencyCode,
          },
        },
        ContentType,
        uid,
        lang,
        isDev,
        host,
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_CITY) {
      return {
        CMSContent: {
          ...CMSContent,
        },
        ContentType,
        uid,
        lang,
        isDev,
        host,
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
      };
    }

    if (
      ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
      ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY
    ) {
      return {
        CMSContent,
        ContentType,
        uid,
        lang,
        isDev,
        host,
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.GLOBAL_EXPERIENCE) {
      const { globalCollection, lang } = CMSContent;

      const {
        data: {
          headout_category_id: sub_category,
          headout_collection_id: collection,
          headout_tgid: tgid,
        },
      } = globalCollection;
      const { cityName } = CMSContent;
      const categoryTourListData = await getToursGlobalCollection({
        collection,
        sub_category,
        tgid,
        commonScratchPrice: true,
        hostname,
        cityName,
        lang: getHeadoutLanguagecode(lang),
        cookies,
      });

      const primaryCity = categoryTourListData?.primaryCity;
      const primaryCountry = primaryCity?.country;
      const activeCurrency = primaryCountry?.currency?.code;

      return {
        CMSContent: {
          ...CMSContent,
          data: {
            ...CMSContent?.data,
            city_name: cityName,
          },
        },
        ContentType,
        uid,
        lang,
        isDev,
        host,
        ...categoryTourListData,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        prismicApiCacheStatus,
      };
    }

    if (ContentType === CUSTOM_TYPES.SHOW_PAGE) {
      try {
        const tgidData = await fetchTourGroupV6({
          tgid: CMSContent?.data?.tgid,
          hostname,
          language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
          cookies,
        });
        const tgidDataWithoutUrlSlugs = deepDeleteKeys({
          obj: tgidData,
          keys: ['urlSlugs', 'urlSlug'],
        });
        const {
          url: _tgidDataUrl,
          ...tgidDataWithoutUrls
        } = tgidDataWithoutUrlSlugs;

        const inventorySlotData = await fetchTourGroupSlots({
          tgid: CMSContent?.data?.tgid,
          hostname,
          forDays: 20,
          cookies,
        });

        const primaryCountry = tgidDataWithoutUrls?.city?.country;
        const primaryCity = tgidDataWithoutUrls?.city;

        const activeCurrency = tgidDataWithoutUrls?.currency;

        const breadcrumbs = await getShowPageBreadcrumbs(CMSContent);

        return {
          CMSContent,
          tourGroupData: tgidDataWithoutUrls,
          inventorySlotData,
          ContentType,
          uid,
          lang,
          isDev,
          host,
          ...(primaryCity && { primaryCity }),
          ...(primaryCountry && { primaryCountry }),
          ...(activeCurrency && { activeCurrency }),
          currencyList: await currencyListPromise,
          domainConfig: await domainConfigPromise,
          breadcrumbs,
          prismicApiCacheStatus,
        };
      } catch (error) {
        traceError({ error, host: req?.headers?.host, url: req?.url });
      }
    }
    /**
     * Setting a Common Microsite Reference for Content Page & Regular Microsite
     * Added to make tour data available on Content Pages.
     * i.e Content Page now contains all of the data from its related Microsite.
     */
    let microsite =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent.data.microsite
        : CMSContent.data;
    const all_tours_tab_tgids =
      microsite.data.all_tours.reduce((accum: any, tour: any) => {
        return [...accum, parseInt(tour.primary.tgid)];
      }, []) || [];

    let labelIds;
    if (all_tours_tab_tgids.length) {
      labelIds = microsite.data.content_order.reduce(
        (accum: any, label: any) => {
          return [...accum, label.label.id];
        },
        []
      );
      try {
        microsite.data.labels = await Client(req)
          .getByIDs(labelIds)
          .then((res: any) => {
            return res.results;
          });
      } catch (e) {
        microsite.data.labels = [];
        Sentry.captureException(e);
        sendLog({ err: e });
      }
    }

    const mbType =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.mbType
        : microsite?.mbType;

    if (ContentType === CUSTOM_TYPES.MICROSITE) {
      let collectionDetails: CollectionDetails | Object = {};
      let finalTgids: Array<number | string> = [];
      const { data } = CMSContent || {};
      const { refs, data: CMSData } = data || {};
      const { contentFramework, productCardData } = refs || {};
      const { data: contentFrameworkData } = contentFramework || {};
      const {
        design,
        theme,
        body,
        body1,
        allShowPages,
        localisedCategoryTourListV1,
        categoryTourListV2,
        baseLangCategorisationMetadata,
      } = CMSData || {};
      const {
        tagged_mb_type: taggedMbType,
        tagged_category: taggedCategory,
        tagged_collection: taggedCollection,
        tagged_city: taggedCity,
      } = baseLangCategorisationMetadata || {};
      delete CMSData.allShowPages;
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabSlice = body?.[0];
      const toursTabFirstSlice = body1[0];

      const isCatOrSubCatPage = await checkIfCatOrSubCatPage(CMSContent?.data);

      const categoryCarouselCF = !isCatOrSubCatPage
        ? getSinglePrismicSlice({
            sliceName: 'category_carousel',
            slices: contentFrameworkData?.body,
          })
        : {};
      let categoryTourListData: Record<string, any> = {};
      let variantsData: Array<Record<string, any>> = [];
      let bannerImageData, routeDetails;
      const hasCategoryTourListV1 = Object.keys(localisedCategoryTourListV1)
        ?.length;
      const hasCategoryTourListV2 = Object.keys(categoryTourListV2)?.length;
      const hasCategoryTourList =
        hasCategoryTourListV2 ||
        hasCategoryTourListV1 ||
        Object.keys(categoryCarouselCF)?.length;
      if (hasCategoryTourList && !isCatOrSubCatPage) {
        if (hasCategoryTourListV1) {
          categoryTourListData = await categoryTourListParserV1({
            productCard: productCardData,
            sliceObj: toursTabSlice || localisedCategoryTourListV1,
            hostname,
            lang: lang ?? 'en',
            cookies,
            localizedStrings,
          });
          minPrice = categoryTourListData.minPrice;
          bestDiscount = categoryTourListData.bestDiscount;
          const [firstTGID]: Record<string, any>[] = Object.values(
            categoryTourListData.scorpioData || {}
          );
          const subCatId = firstTGID?.primarySubCategory?.id;
          const categoryId = CATEGORY_IDS?.[taggedCategory];

          if (productCardData?.template === TEMPLATES.HOHO) {
            variantsData = await parseVariantsData({
              finalTgids: categoryTourListData?.finalTgids || [],
              currencyCode: categoryTourListData?.activeCurrency?.code,
              language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
              cookies,
            });
          }

          if (isCollectionMB(taggedMbType)) {
            bannerImageData = await fetchMediaResource({
              resourceType: RESOURCE_TYPE.COLLECTION_VIDEO,
              entityIds: taggedCollection,
            });
          } else if (isSubCategoryMB(taggedMbType)) {
            bannerImageData = await fetchMediaResource({
              resourceType: RESOURCE_TYPE.SUB_CATEGORY_CITY,
              entityIds: `${subCatId}-${taggedCity}`,
            });
          } else if (isCategoryMB(taggedMbType)) {
            bannerImageData = await fetchMediaResource({
              resourceType: RESOURCE_TYPE.CATEGORY_CITY,
              entityIds: `${categoryId}-${taggedCity}`,
            });
          }
          collectionDetails = categoryTourListData.collectionDetails ?? {};
          finalTgids = categoryTourListData.finalTgids || [];
          const { template } = productCardData || {};
          if (template === TEMPLATES.HOHO) {
            routeDetails = await getRouteDetailsDoc({
              tgids: finalTgids,
              lang: lang ?? 'en',
            });
          }
        } else {
          const timestampForCoralogix = Date.now();
          categoryTourListData = await categoryTourListParserV2({
            tourListCategory: categoryTourListV2,
            hostname,
            showpages: allShowPages,
            categoryCarousel: categoryCarouselCF,
            lang: lang ?? 'en',
            localizedStrings,
            cookies,
            MBDesign,
            taggedCollection,
          });
          const timestampDeltaForCoralogix = Date.now() - timestampForCoralogix;
          sendLog({
            level: LOG_LEVELS.INFO,
            message: String(timestampDeltaForCoralogix),
          });
        }
      }

      const { tagged_city: mbCity, tagged_country: mbCountry } =
        microsite.data.baseLangCategorisationMetadata || {};

      let cityPageData: Record<string, any> = {};
      let isCityPageMB = false;
      if (mbType === MB_TYPES.A1_HOMEPAGE && mbCity) {
        cityPageData = await generateCityPageData({
          mbCity,
          mbCountry,
          lang: lang || LANGUAGE_MAP.en.locale,
          cookies,
        });

        const {
          nearbyAndCurrentCityData: { currentCityData },
        } = cityPageData;
        const { discoverable } = currentCityData || {};
        isCityPageMB = !!discoverable;
      }

      const cityPageParams = {
        mbLocationData: { mbCity, mbCountry },
        isCityPageMB,
        cityPageData,
      };

      const prismicTours =
        toursTabFirstSlice && !isCatOrSubCatPage
          ? toursTabSliceHandler(toursTabFirstSlice)
          : [];
      const offers = prismicTours
        ?.filter((tour: any) => tour.offer__free_tour?.id)
        ?.map((tour: any) => tour.offer__free_tour?.id);
      const uniqueOfferIds = offers.filter(
        (id: any, index: any) => offers.indexOf(id) === index
      );
      if (uniqueOfferIds.length)
        (CMSContent as any).offerData = await Client(req)
          .getByIDs(uniqueOfferIds)
          .then((offerData: any) => {
            offerData.results.map((offer: any) => {
              if (parseInt(offer.data.offer_tgid) > 0)
                initial_tgids.push(offer.data.offer_tgid);
            });
            return offerData;
          });

      const toursList = uncategorizedToursListParser(
        prismicTours,
        initial_tgids
      );

      tgidsArray = toursList?.reduce((acc: any, tour: any) => {
        return [...acc, tour.tgid];
      }, []);

      const {
        activeCurrency,
        primaryCity,
        isCategoryV2,
        primaryCountry: _,
        scorpioData,
        orderedTours,
        collectionVideos,
        ...rawCategories
      }: any = categoryTourListData ?? {};

      const simplifiedCategoryTourListData =
        !hasCategoryTourListV1 && !isCatOrSubCatPage
          ? Object.entries(rawCategories || {}).reduce<{
              tourGroupMap: TGIDProductCardMap;
            }>(
              (simpleCategoryData: any, [categoryId, productGroups]: any) => {
                const tgids: Array<number> = [];
                const productGroupMap: TGIDProductCardMap = productGroups?.reduce(
                  (map: TGIDProductCardMap, productGroup: ProductCard) => {
                    if (productGroup.showPageUid) {
                      delete productGroup.highlights;
                    }
                    tgids.push(productGroup.tgid);
                    return {
                      ...map,
                      [productGroup.tgid]: productGroup,
                    };
                  },
                  {}
                );

                return {
                  ...simpleCategoryData,
                  tourGroupMap: {
                    ...simpleCategoryData.tourGroupMap,
                    ...productGroupMap,
                  },
                  [categoryId]: tgids,
                };
              },
              { tourGroupMap: {} }
            )
          : {};
      const primaryCountry = primaryCity?.country;

      scorpioAllTourGroupData = {
        CMSContent,
        toursList,
        ...(!hasCategoryTourListV1 && { simplifiedCategoryTourListData }),
        ...(hasCategoryTourListV1 && {
          scorpioData,
          orderedTours,
          collectionVideos,
        }),
        isCategoryV2,
        ContentType,
        uid,
        lang,
        host,
        MBDesign,
        isDev,
        queryParams,
        mbTheme,
        isStage,
        collectionDetails,
        bannerImageData,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        cityPageParams,
        ...(variantsData && { variantsData }),
        ...(routeDetails && { routeDetails }),
      };
    }
    tgidsArray = [...tgidsArray, ...all_tours_tab_tgids];
    const useTest = !!scorpioAllTourGroupData?.['queryParams']?.bookSubdomain;

    const tourGroupAPIResponses = await fetchTourListV6({
      hostname,
      language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
      tgids: tgidsArray,
      fallbackToEnglish:
        getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale) === 'en',
      currency: scorpioAllTourGroupData?.['queryParams']?.currency ?? null,
      useTest,
      cookies,
    }).catch((error) => {
      Sentry.captureException(error);
      traceError({ error, host: req?.headers?.host, url: req?.url });
      sendLog({ err: error });

      // if tourGroup API fails, assume all tours as unavailable and render rest of the page.
      return {
        // @ts-expect-error TS(7006): Parameter 'tgid' implicitly has an 'any' type.
        tourGroups: tgidsArray.map((tgid) => ({
          id: tgid,
          listingPrice: null,
        })),
      };
    });

    const currencySymbolMap = tourGroupAPIResponses?.currencies?.reduce(
      // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
      (acc, currency) => ({
        ...acc,
        [currency.code]: { ...currency },
      }),
      {}
    );

    const tourGroupData = tourGroupAPIResponses?.tourGroups
      ?.filter((tour: Record<string, any>) => {
        const { hidden } = tour ?? {};
        return !hidden;
      })
      ?.reduce((accum: {}, tour: Record<string, any>) => {
        const { hide_df, hide_safe } = scorpioAllTourGroupData['CMSContent']
          ?.data?.data || {
          hide_df: false,
          hide_safe: false,
        };
        const {
          name,
          descriptors,
          minDuration,
          maxDuration,
          highlights,
          media,
          imageUrl,
          averageRating,
          reviewCount,
          callToAction,
          listingPrice,
          validity,
          allTags: allTagsTour,
          id,
          combo,
          multiVariant,
          primaryCollection,
          ticketValidity,
          reschedulePolicy,
          cancellationPolicy,
          cancellationPolicyV2,
          flowType,
        } = tour ?? {};

        let { microBrandsHighlight } = tour ?? {};

        microBrandsHighlight = standardizeCancellationPolicy({
          highlights: microBrandsHighlight,
          ticketValidity,
          reschedulePolicy,
          cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
          lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
          localizedStrings,
        });

        const { productImages, safetyImages } = media || {};
        const updatedDescriptors = generateDescriptor({
          descriptors,
          lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
        });

        let allTags = allTagsTour || [];
        if (hide_df) {
          allTags = allTags?.filter((t: any) => !t.includes('DF-'));
        }
        if (hide_safe) {
          allTags = allTags?.filter((t: any) => !t.includes('SAFE'));
        }

        const isMBHighlightsExist = microBrandsHighlight?.length > 0;
        return {
          ...accum,
          [id]: {
            title: name,
            primaryCollection,
            highlights: microBrandsHighlight,
            descriptors: updatedDescriptors,
            productHighlights: highlights,
            productTitle: name,
            imageUrl,
            images: [...(productImages || []), { url: imageUrl }],
            averageRating,
            reviewCount,
            ctaBooster: callToAction,
            available: !(listingPrice === null),
            allTags,
            safetyImages: safetyImages || [],
            validity,
            combo,
            multiVariant,
            minDuration,
            maxDuration,
            listingPrice: {
              ...listingPrice,
              ...currencySymbolMap[listingPrice?.currencyCode],
            },
            flowType,
            isMBHighlightsExist,
          },
        };
      }, {});

    const primaryCountry =
      tourGroupAPIResponses?.cities?.[0]?.country ||
      scorpioAllTourGroupData?.primaryCountry;

    const primaryCity = tourGroupAPIResponses?.cities?.[0];
    const activeCurrency = tourGroupAPIResponses?.currencies?.[0];

    const baseLangCategorisationMetadata =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.baseLangCategorisationMetadata
        : CMSContent?.data?.data?.baseLangCategorisationMetadata;

    //for content pages baseLangMicrositeData is the base lang microsite doc
    //for microsites baseLangMicrositeData is the current microsite doc (NOT BASE LANG)
    const baseLangMicrositeDoc =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.baseLangMicrositeData
        : CMSContent?.data;

    const categoryHeaderMenuExists =
      checkIfCategoryHeaderExists({
        mbDesign: baseLangMicrositeDoc?.data?.design,
        mbType,
      }) && !!baseLangCategorisationMetadata?.tagged_city;

    const categoryHeaderMenuPromise = categoryHeaderMenuExists
      ? getCategoryHeaderMenu({
          doc: baseLangMicrositeDoc,
          lang: lang || LANGUAGE_MAP.en.locale,
          ContentType,
        })
      : {};

    const breadcrumbsDoc =
      ContentType === CUSTOM_TYPES.MICROSITE ? CMSContent.data : CMSContent;

    const breadcrumbsPromise = getBreadcrumbs(breadcrumbsDoc);

    const aggregatedPromise = await Promise.allSettled([
      categoryHeaderMenuPromise,
      breadcrumbsPromise,
    ]);

    const [categoryHeaderMenu, breadcrumbs] = handleSettledPromiseResults(
      aggregatedPromise
    );

    const isCatOrSubCatPage = await checkIfCatOrSubCatPage(CMSContent?.data);
    const catAndSubCatPageData = isCatOrSubCatPage
      ? await getCatAndSubCatPageData({
          doc: CMSContent?.data,
          attractionsHeaderMenu: categoryHeaderMenu?.ATTRACTIONS?.menu || {},
          themesHeaderMenu: categoryHeaderMenu?.THEMES?.menu || {},
          cookies,
        })
      : {};

    return {
      ...scorpioAllTourGroupData,
      ...(activeCurrency && { activeCurrency }),
      ...(primaryCity && { primaryCity }),
      tourGroupData,
      currencySymbolMap,
      primaryCountry,
      currencyList: await currencyListPromise,
      domainConfig: await domainConfigPromise,
      categoryHeaderMenu,
      breadcrumbs,
      isCatOrSubCatPage,
      catAndSubCatPageData,
      minPrice,
      bestDiscount,
      prismicApiCacheStatus,
    };
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      statusCode: 500,
    };
  }
};

type TGetShoulerPageClientQueryPromise = {
  docType: string;
  mbCity: string | null;
  mbCollection: string | null;
  mbCategory: string | null;
  mbSubCategory: string | null;
  filterMiscDocs?: boolean;
  lang?: string;
};

const getShoulderPageClientQueryPromise = ({
  docType,
  lang,
  mbCity,
  mbCollection,
  mbCategory,
  mbSubCategory,
  filterMiscDocs,
}: TGetShoulerPageClientQueryPromise) =>
  Client().query(
    [
      Prismic.Predicates.not(`document.tags`, ['[DEV]']),
      mbCity &&
        Prismic.Predicates.at(
          `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
          mbCity
        ),
      mbCollection &&
        Prismic.Predicates.at(
          `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
          mbCollection
        ),
      mbCategory &&
        Prismic.Predicates.at(
          `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
          mbCategory
        ),
      mbSubCategory &&
        Prismic.Predicates.at(
          `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_SUB_CATEGORY}`,
          mbSubCategory
        ),
      filterMiscDocs &&
        Prismic.Predicates.at(
          `my.${docType}.${PRISMIC_FIELD_ID.SHOULDER_PAGE_TYPE}`,
          MISC
        ),
    ],
    {
      pageSize: 100,
      ...(filterMiscDocs && { lang }),
    }
  );

type TGetShoulderPageDocs = {
  categorisationMetadata: TCategorisationMetadata;
  filterMiscDocs?: boolean;
  isA2CatMB?: boolean;
  isA2SubcatMB?: boolean;
  lang?: string;
};

export const getShoulderPageDocs = async ({
  categorisationMetadata,
  isA2CatMB,
  isA2SubcatMB,
  filterMiscDocs,
  lang,
}: TGetShoulderPageDocs) => {
  const {
    tagged_city: mbCity,
    tagged_collection: mbCollection,
    tagged_category: mbCategory,
    tagged_sub_category: mbSubCategory,
  } = categorisationMetadata;

  if (
    (!isA2CatMB && !isA2SubcatMB && !mbCollection) ||
    (isA2CatMB && !mbCategory) ||
    (isA2SubcatMB && !mbSubCategory)
  )
    return [];

  const micrositesPromises = getShoulderPageClientQueryPromise({
    docType: CUSTOM_TYPES.MICROSITE,
    mbCity,
    mbCollection: !isA2CatMB && !isA2SubcatMB ? mbCollection : null,
    mbCategory: isA2CatMB ? mbCategory : null,
    mbSubCategory: isA2SubcatMB ? mbSubCategory : null,
    filterMiscDocs,
    lang,
  });

  const contentPagesPromises = getShoulderPageClientQueryPromise({
    docType: CUSTOM_TYPES.CONTENT_PAGE,
    mbCity,
    mbCollection: !isA2CatMB && !isA2SubcatMB ? mbCollection : null,
    mbCategory: isA2CatMB ? mbCategory : null,
    mbSubCategory: isA2SubcatMB ? mbSubCategory : null,
    filterMiscDocs,
    lang,
  });

  const aggregatedPromise = await Promise.allSettled([
    micrositesPromises,
    contentPagesPromises,
  ]);

  const [
    filteredMicrosites,
    filteredContentPages,
  ] = handleSettledPromiseResults(aggregatedPromise);

  const aggregatedDocsStore = [
    ...filteredMicrosites?.results,
    ...filteredContentPages?.results,
  ];

  return getRankedDocuments({ docs: aggregatedDocsStore });
};

const getCityGuideClientQueryPromise = ({
  docType,
  mbCity,
}: {
  docType: string;
  mbCity: string | null;
}) =>
  Client().query(
    [
      Prismic.Predicates.not(`document.tags`, ['[DEV]']),
      mbCity &&
        Prismic.Predicates.at(
          `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
          mbCity
        ),
      Prismic.Predicates.at(
        `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
        MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE
      ),
    ],
    { pageSize: 100 }
  );

export const getCityGuideDocs = async (
  categorisationMetadata: TCategorisationMetadata
) => {
  const { tagged_city: mbCity } = categorisationMetadata;

  const micrositesPromises = getCityGuideClientQueryPromise({
    docType: CUSTOM_TYPES.MICROSITE,
    mbCity,
  });

  const contentPagesPromises = getCityGuideClientQueryPromise({
    docType: CUSTOM_TYPES.CONTENT_PAGE,
    mbCity,
  });

  const aggregatedPromise = await Promise.allSettled([
    micrositesPromises,
    contentPagesPromises,
  ]);

  const [
    filteredMicrosites,
    filteredContentPages,
  ] = handleSettledPromiseResults(aggregatedPromise);

  const aggregatedDocsStore = [
    ...filteredMicrosites?.results,
    ...filteredContentPages?.results,
  ];

  return getRankedDocuments({ docs: aggregatedDocsStore });
};

export const getAlternateLanguageDocs = async ({
  baseLangDocs,
  lang,
}: {
  baseLangDocs: PrismicDocumentWithUID[];
  lang: string;
}): Promise<PrismicDocumentWithUID[]> => {
  const alternateLangDocsIds = baseLangDocs
    .map((doc) => {
      const { alternate_languages: alternateLanguages } = doc || {};
      const { id } = alternateLanguages.find((doc) => doc.lang === lang) || {};
      return id;
    })
    .filter(Boolean);

  const { results: alternateLangDocs } = await Client().getByIDs(
    alternateLangDocsIds,
    {
      pageSize: 100,
    }
  );

  return alternateLangDocs;
};
export const getRouteDetailsDoc = async ({
  tgids,
  lang = 'en',
}: {
  tgids: Array<number | string>;
  lang: string;
}): Promise<Record<string, any>> => {
  const uidsArr = tgids?.map((el) => `${el}-route`);
  try {
    const { results } =
      (await Client().query(
        [
          Prismic.Predicates.not(`document.tags`, ['[DEV]']),
          Prismic.Predicates.any(`my.${CUSTOM_TYPES.HOHO_ROUTES}.uid`, uidsArr),
        ],
        { pageSize: 10, lang }
      )) || {};
    const routeData = results.reduce(
      (acc: Record<string, any>, elem: Record<string, any>) => {
        return {
          ...acc,
          [elem?.uid]: elem?.data,
        };
      },
      {}
    );
    return routeData;
  } catch (error) {
    sendLog({
      err: error,
      message: `getRouteDetailsDoc failed. UID: ${JSON.stringify(uidsArr)}`,
    });
    return [];
  }
};

export const getTopAttractionsDoc = async ({
  cityName,
  subcategoryId,
  lang = 'en',
}: {
  cityName: string;
  subcategoryId: number | string;
  lang: string;
}): Promise<Record<string, any>> => {
  const uid = `${cityName?.toLowerCase()}-${subcategoryId}`;
  try {
    const topAttractionsDoc = await Client().getByUID(
      CUSTOM_TYPES.TOP_ATTRACTIONS,
      uid,
      {
        lang,
      }
    );
    const { data } = topAttractionsDoc || {};
    return data;
  } catch (error) {
    sendLog({
      err: error,
      message: `getTopAttractionsDoc failed. UID: ${uid}`,
    });
    return {};
  }
};
export const getTopCollectionsCarouselDocs = async ({
  mbCity,
  collectionsIds,
}: {
  mbCity: string;
  collectionsIds: Array<string>;
}) => {
  try {
    const { results: filteredMicrosites } =
      (await Client().query(
        [
          Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
            mbCity
          ),
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
            MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
          ),
          Prismic.Predicates.any(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
            [
              MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
              MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
              MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
            ]
          ),
          Prismic.Predicates.any(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
            collectionsIds
          ),
        ],
        { pageSize: 50 }
      )) || {};

    return getRankedDocuments({
      docs: filteredMicrosites,
      ranking: [
        MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
        MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
        MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
      ],
    });
  } catch (err) {
    sendLog({
      err,
      message: `[getTopCollectionsCarouselDocs] - 
        ${JSON.stringify({
          mbCity,
          collectionsIds,
        })}
      `,
    });
    return [];
  }
};

const getConcertCollectionClientQueryPromise = ({
  docType,
  mbCollection,
}: {
  docType: string;
  mbCollection: string;
}) =>
  Client().query(
    [
      Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
      Prismic.Predicates.at(
        `my.${docType}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
        mbCollection
      ),
      Prismic.Predicates.any(`document.tags`, [VIENNA_CONCERT_UID]),
    ],
    { pageSize: 100 }
  );

export const getConcertCollectionDocs = async (mbCollection: string | null) => {
  try {
    if (!mbCollection) return [];

    const micrositesPromises = getConcertCollectionClientQueryPromise({
      docType: CUSTOM_TYPES.MICROSITE,
      mbCollection,
    });

    const venuePagesPromises = getConcertCollectionClientQueryPromise({
      docType: CUSTOM_TYPES.VENUE_PAGE,
      mbCollection,
    });

    const aggregatedPromise = await Promise.allSettled([
      micrositesPromises,
      venuePagesPromises,
    ]);

    const [
      filteredMicrosites,
      filteredVenuePages,
    ] = handleSettledPromiseResults(aggregatedPromise);

    const aggregatedDocsStore = [
      ...filteredMicrosites?.results,
      ...filteredVenuePages?.results,
    ];

    return aggregatedDocsStore;
  } catch (error) {
    sendLog({ err: error });
    return [];
  }
};
