import { Client } from 'config/prismic-config';
import Prismic from 'prismic-javascript';
import * as Sentry from '@sentry/nextjs';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { toursTabSliceHandler } from 'components/Slices';
import type { CollectionDetailsTypes } from 'components/StaticBanner/index';
import {
  CUSTOM_TYPES,
  LANGUAGE_MAP,
  LINKED_MICROSITE_PROPS,
  MICROSITE_ARRAY_KEYS,
  MICROSITE_OBJECT_KEYS,
  MICROSITE_STRING_KEYS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  SLICE_TYPES,
  THEMES,
  MB_CATEGORISATION,
  PRISMIC_FIELD_ID,
  PRISMIC_DEV_TAG,
} from 'const/index';
import { MISC } from 'const/header';
import {
  documentUidUpdateRedirectHandler,
  getCollectionSection,
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  getTgidsFromShow,
  redirectTo,
  refsArrayToObject,
  handleSettledPromiseResults,
  deepDeleteKeys,
} from 'utils';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import { traceError } from 'utils/logutils';
import { getHostName, checkIfCategoryHeaderExists } from 'utils/helper';
import {
  getLangUID,
  getValidUrlParams,
  sanitizeURL,
  convertUidToUrl,
} from 'utils/urlUtils';
import {
  categoryTourListParserV1,
  getToursGlobalCollection,
  uncategorizedToursListParser,
} from 'utils/dataParsers';
import {
  fetchCollection,
  fetchCollectionList,
  fetchTourGroupsByCategory,
  fetchCurrencyList,
  fetchTourGroupSlots,
  fetchTourGroupV6,
  fetchDomainConfig,
  fetchTourListV6,
} from 'utils/apiUtils';
import { getCategoryHeaderMenu, getRankedDocuments } from 'utils/headerUtils';
import type { TCategorisationMetadata } from 'utils/headerUtils';
import { sendLog } from 'utils/logger';
import categoryTourListParserV2 from 'utils/parsers/categoryTourListParserV2/index';
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

export const getContentPageDocument = async ({
  req,
  uid,
  lang,
  queryParamsString,
  serverResponse,
  host,
}: any) => {
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
          redirectTo({
            res: serverResponse,
            url: `${url}${queryParamsString ? `?${queryParamsString}` : ''}`,
            type: 301,
          });
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
        redirectTo({
          res: serverResponse,
          url: `${url}${queryParamsString ? `?${queryParamsString}` : ''}`,
        });
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
          : micrositeData;

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
          baseLangTaggedCity:
            lang !== EN_LANG_CODE
              ? baseLangMicrositeData.data.tagged_city
              : micrositeData.data.tagged_city,
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
  serverResponse,
  queryParamsString,
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
          redirectTo({
            res: serverResponse,
            url: `${url}${queryParamsString ? `?${queryParamsString}` : ''}`,
            type: completeMicrosite.data.data.redirect_type,
          });
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

          let allShowPages, productCardData;
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

          // Base lang Fallback for Tour Ranking.
          const tourTabSlice = completeMicrosite.data.data.body1[0];
          if (tourTabSlice?.primary && !tourTabSlice.primary.ranking) {
            tourTabSlice.primary.ranking =
              baseLangData?.data?.body1[0]?.primary?.ranking;
          }

          // Base lang Fallback for CategorisedToursV1
          let localisedCategoryTourListV1 = getSinglePrismicSlice({
            sliceName: 'tour_list_category_v1',
            slices: localisedCategoryTourListSlice,
          });

          const englishCategoryTourListSlice = completeMicrosite.data.data.body;

          let categoryTourListV1 = getSinglePrismicSlice({
            sliceName: 'tour_list_category_v1',
            slices: englishCategoryTourListSlice,
          });

          let categoryTourListV2 = getSinglePrismicSlice({
            sliceName: 'tour_list_category',
            slices:
              lang === LANGUAGE_MAP.en.locale
                ? englishCategoryTourListSlice
                : localisedCategoryTourListSlice,
          });

          if (Object.keys(localisedCategoryTourListV1)?.length) {
            localisedCategoryTourListV1.primary.locale_ranking =
              categoryTourListV1?.primary?.locale_ranking ||
              localisedCategoryTourListV1?.primary?.locale_ranking;
            localisedCategoryTourListV1.primary.locale_exclusions =
              categoryTourListV1?.primary?.locale_exclusions ||
              localisedCategoryTourListV1?.primary?.locale_exclusions;
          }
          if (!categoryTourListV1?.primary?.product_cards?.id) {
            categoryTourListV1 = localisedCategoryTourListV1;
          }

          const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;
          if (hasCategoryTourListV1) {
            const { primary } = categoryTourListV1;
            const { product_cards } = primary || {};
            const { id: productCardsId } = product_cards || {};
            const { data } =
              (await Client(req).getByID(productCardsId, {
                lang: 'en-us',
              })) || {};
            productCardData = data;
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
          const commonHeaderId =
            completeMicrosite.data.data.common_header_ref?.id ||
            baseLangData.data.common_header_ref?.id ||
            '';

          const linkedRefIDs = [];
          linkedRefIDs.push(footerID);
          linkedRefIDs.push(contentSectionId);
          linkedRefIDs.push(commonHeaderId);
          linkedRefIDs.push(secondaryFooterId);
          const refArray = await getRefsArrayByIds(linkedRefIDs, req);
          const {
            commonFooter,
            commonHeader,
            contentFramework,
            secondaryFooter,
          } = refsArrayToObject(refArray);

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
                commonHeader,
                secondaryFooter,
                productCardData,
              },
              data: {
                ...completeMicrosite.data.data,
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
                baseLangTaggedCity:
                  lang !== 'en-us'
                    ? baseLangData.data.tagged_city
                    : completeMicrosite.data.data.tagged_city,
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
        tagged_mb_type,
        tagged_city,
        tagged_country,
        google_map_url,
        tagged_collection,
        title,
        description,
        image_url,
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
  const linkedRefsPromise = Client(req).getByIDs(ref_ids.filter((id) => id));
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

export const getShowPage = async ({
  req,
  lang,
  uid,
  isDev,
  serverResponse,
  host,
  queryParamsString,
}: any) => {
  const page = await Client(req).getByUID(CUSTOM_TYPES.SHOW_PAGE, uid, {
    lang,
  });

  if (page.uid !== uid) {
    documentUidUpdateRedirectHandler({
      toUid: page.uid,
      serverResponse,
      isDev,
      host,
      queryParamsString,
      lang,
    });
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
  serverResponse,
  query,
  isDev,
  useHostAsUid = false,
}: any): Promise<{
  ContentType?: string;
  CMSContent?: any;
  statusCode?: number;
  isDev?: boolean;
  useHostAsUid?: boolean;
}> => {
  const { host } = req.headers || window.location;
  const { lang } = getLangUID(req, query);
  const uid = useHostAsUid
    ? host.replace('stage-', '')
    : getLangUID(req, query)?.uid;
  const queryParamsString = getValidUrlParams(query);

  try {
    return await Promise.any([
      getMicrositeDocument({
        req,
        serverResponse,
        host,
        lang,
        queryParamsString,
        uid,
      }),
      getVenuePageDocument({ req, lang, uid }),
      getContentPageDocument({
        req,
        serverResponse,
        host,
        lang,
        queryParamsString,
        uid,
      }),
      getShowPage({
        req,
        lang,
        uid,
        isDev,
        serverResponse,
        host,
        queryParamsString,
      }),
      getGlobalHomepage({ req, lang, uid }),
      getGlobalExperience({ req, lang, uid }),
      getGlobalCollection({ req, lang, uid }),
      getGlobalCity({ req, lang, uid }),
      getGlobalCountry({ req, lang, uid }),
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

export const getPageData = async ({
  res: serverResponse,
  req,
  query,
  isDev,
  localizedStrings,
}: any) => {
  const { host } = req.headers || window.location;
  const isStage = host.includes('stage-');
  const cookies = req.cookies;
  const { uid, lang } = getLangUID(req, query);
  const hostname = getHostName(isStage, isDev, host);

  try {
    let initial_tgids: any = [];

    const { ContentType, CMSContent, statusCode } = (await getPrismicDocument({
      query,
      req,
      serverResponse,
      isDev,
    })) || { statusCode: 404 };
    const currencyListPromise = fetchCurrencyList();
    const domainConfigPromise = fetchDomainConfig(uid);

    if (statusCode) {
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

    if (ContentType === CUSTOM_TYPES.VENUE_PAGE) {
      const [showsListSlices, showsGridSlices] = [
        CMSContent.data?.descriptionSlices?.filter((slice: any) => {
          return slice.slice_type === SLICE_TYPES.SHOWS_LIST;
        }),
        CMSContent.data?.descriptionSlices?.filter((slice: any) => {
          return slice.slice_type === SLICE_TYPES.SHOWS_GRID;
        }),
      ];

      const showsListSlicesTgids = showsListSlices.reduce(
        (acc: any[], curr: any) => {
          const tgids = getTgidsFromShow(curr.items);
          return (acc = [...acc, ...tgids]);
        },
        []
      );
      const showsGridSlicesTgids = showsGridSlices.reduce(
        (acc: any[], curr: any) => {
          const tgids = getTgidsFromShow(curr.items);
          return (acc = [...acc, ...tgids]);
        },
        []
      );

      const showsData = await fetchTourListV6({
        tgids: [...showsListSlicesTgids, ...showsGridSlicesTgids],
        hostname,
        language: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
        cookies,
      });
      // eslint-disable-next-line no-console
      console.log('---', showsData);

      const showsListSlicesData = showsData?.tourGroups?.slice(
        0,
        showsListSlicesTgids.length
      );
      const showsGridSlicesData = showsData?.tourGroups?.slice(
        showsListSlicesTgids.length,
        showsData.length
      );
      // eslint-disable-next-line no-console
      console.log('jfjfj', showsListSlicesData);

      return {
        CMSContent: {
          ...CMSContent,
          showsListSlicesData,
          showsGridSlicesData,
        },
        uid,
        host,
        ContentType,
        lang,
        isDev,
        tgidsInPage: [...showsListSlicesTgids, ...showsGridSlicesTgids],
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
      };
    }

    if (ContentType === CUSTOM_TYPES.CONTENT_PAGE) {
      const { data } = CMSContent || {};
      const {
        productCardData,
        baseLangExperienceLimit,
        content_framework: contentFramework,
        data: CMSData,
      } = data || {};
      const { data: contentFrameworkData } = contentFramework || {};
      const { design, theme, body1 } = CMSData || {};
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabFirstSlice = body1?.[0];

      const categoryTourListV1 = getSinglePrismicSlice({
        sliceName: 'ticket_card_shoulder_page',
        slices: contentFrameworkData?.body,
      });
      let categoryTourListData;
      const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;

      if (hasCategoryTourListV1) {
        const sliceObj = {
          ...categoryTourListV1,
          ...(baseLangExperienceLimit && {
            primary: {
              sp_experience_limit: baseLangExperienceLimit,
            },
          }),
        };
        categoryTourListData = await categoryTourListParserV1({
          productCard: productCardData,
          sliceObj,
          hostname,
          lang: lang ?? LANGUAGE_MAP.en.code,
          cookies,
          localizedStrings,
        });
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
      microsite.data.labels = await Client(req)
        .getByIDs(labelIds)
        .then((res: any) => {
          return res.results;
        });
    }

    const mbType =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.mbType
        : microsite?.mbType;

    if (ContentType === CUSTOM_TYPES.MICROSITE) {
      let collectionDetails: CollectionDetailsTypes | Object = {};
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
      } = CMSData || {};
      delete CMSData.allShowPages;
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabSlice = body?.[0];
      const toursTabFirstSlice = body1[0];

      const categoryCarouselCF = getSinglePrismicSlice({
        sliceName: 'category_carousel',
        slices: contentFrameworkData?.body,
      });

      let categoryTourListData;
      const hasCategoryTourListV1 = Object.keys(localisedCategoryTourListV1)
        ?.length;
      const hasCategoryTourListV2 = Object.keys(categoryTourListV2)?.length;
      const hasCategoryTourList =
        hasCategoryTourListV2 ||
        hasCategoryTourListV1 ||
        Object.keys(categoryCarouselCF)?.length;
      if (hasCategoryTourList) {
        if (hasCategoryTourListV1) {
          categoryTourListData = await categoryTourListParserV1({
            productCard: productCardData,
            sliceObj: toursTabSlice || localisedCategoryTourListV1,
            hostname,
            lang: lang ?? 'en',
            cookies,
            localizedStrings,
          });
          collectionDetails = categoryTourListData.collectionDetails ?? {};
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
          });
          const timestampDeltaForCoralogix = Date.now() - timestampForCoralogix;
          sendLog({
            level: LOG_LEVELS.INFO,
            message: String(timestampDeltaForCoralogix),
          });
        }
      }

      const prismicTours = toursTabFirstSlice
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
        collectionVideo,
        ...rawCategories
      }: any = categoryTourListData ?? {};

      const simplifiedCategoryTourListData = !hasCategoryTourListV1
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
          collectionVideo,
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
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
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

    const baseLangMicrositeTaggedCity =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.baseLangTaggedCity
        : CMSContent?.data?.data?.baseLangTaggedCity;

    const categoryHeaderMenuExists =
      checkIfCategoryHeaderExists({
        mbDesign: microsite?.data?.design,
        mbType,
      }) && !!baseLangMicrositeTaggedCity;

    const categoryHeaderMenu = categoryHeaderMenuExists
      ? await getCategoryHeaderMenu(microsite)
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
    };
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      statusCode: 500,
    };
  }
};

type TGetClientQueryPromise = {
  docType: string;
  mbCity: string | null;
  mbCollection: string | null;
  mbCategory: string | null;
  mbSubCategory: string | null;
  filterMiscDocs?: boolean;
  lang?: string;
};

const getClientQueryPromise = ({
  docType,
  lang,
  mbCity,
  mbCollection,
  mbCategory,
  mbSubCategory,
  filterMiscDocs,
}: TGetClientQueryPromise) => {
  return Client().query(
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
};

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

  const micrositesPromises = getClientQueryPromise({
    docType: CUSTOM_TYPES.MICROSITE,
    mbCity,
    mbCollection: !isA2CatMB && !isA2SubcatMB ? mbCollection : null,
    mbCategory: isA2CatMB ? mbCategory : null,
    mbSubCategory: isA2SubcatMB ? mbSubCategory : null,
    filterMiscDocs,
    lang,
  });

  const contentPagesPromises = getClientQueryPromise({
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

  return getRankedDocuments(aggregatedDocsStore);
};

export const getCityGuideDocs = async (
  categorisationMetadata: TCategorisationMetadata
) => {
  const { tagged_city: mbCity } = categorisationMetadata;

  const { results: filteredMicrosites } =
    (await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, ['[DEV]']),
        mbCity &&
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
            mbCity
          ),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
          MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE
        ),
      ],
      { pageSize: 100 }
    )) || {};

  return getRankedDocuments(filteredMicrosites);
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
