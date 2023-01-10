import { Client } from 'config/prismic-config';
import Prismic from 'prismic-javascript';
import * as Sentry from '@sentry/nextjs';
import { toursTabSliceHandler } from 'components/Slices';
import type { AggregatedRatingDetails } from 'components/StaticBanner/index';
import {
  COMMON_DATA_PROPS_FOR_LISTICLE,
  CUSTOM_TYPES,
  LANGUAGE_MAP,
  LINKED_MICROSITE_PROPS,
  MEDIAUPGRADE_EXPERIMENT_UIDS,
  MICROSITE_ARRAY_KEYS,
  MICROSITE_OBJECT_KEYS,
  MICROSITE_STRING_KEYS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  THEMES,
} from 'const/index';
import {
  documentUidUpdateRedirectHandler,
  getCollectionSection,
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  redirectTo,
  refsArrayToObject,
} from 'utils/index';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import { traceError } from 'utils/logutils';
import { getHostName } from 'utils/helper';
import {
  getLangUID,
  getValidUrlParams,
  sanitizeURL,
  convertUidToUrl,
} from 'utils/urlUtils';
import {
  categoryTourListParserV1,
  categoryTourListParserV2,
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

export const getSafetyBannerDocument = async ({ lang }) => {
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

export const getListicleDocument = async ({ req, uid, lang }) => {
  const listicleResponse = await Client(req).getByUID(
    CUSTOM_TYPES.LISTICLE,
    uid,
    {
      fetchLinks: [...COMMON_DATA_PROPS_FOR_LISTICLE],
      lang,
    }
  );
  if (listicleResponse) {
    const {
      common_footer,
      common_header,
      content_framework,
    } = listicleResponse.data;

    const refArray = await getRefsArrayByIds(
      [common_footer.id, common_header.id, content_framework.id],
      req
    );
    const {
      commonFooter,
      commonHeader,
      contentFramework,
      secondaryFooter,
    } = refsArrayToObject(refArray);
    return {
      CMSContent: {
        ...listicleResponse,
        commonFooter,
        commonHeader,
        contentFramework,
        secondaryFooter,
      },
      ContentType: CUSTOM_TYPES.LISTICLE,
    };
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
}) => {
  return await Client(req)
    .getByUID(CUSTOM_TYPES.CONTENT_PAGE, uid, {
      fetchLinks: [...LINKED_MICROSITE_PROPS],
      lang,
    })
    .then(async (page) => {
      if (page) {
        if (page.uid !== uid) {
          let url = convertUidToUrl({
            uid: page.uid,
            lang: getHeadoutLanguagecode(lang),
          });
          if (host.slice(0, 5) === 'stage') {
            url = url.split('//');
            url = url.join('//stage-');
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
        lang !== 'en-us'
          ? await Client(req)
              .getByUID(CUSTOM_TYPES.CONTENT_PAGE, baseLangUid || uid, {
                lang: 'en-us',
              })
              .then((res) => res)
          : null;
      const baseLangRefArray = await getRefsArrayByIds(
        [baseLangData?.data?.content_framework?.id],
        req
      );
      const { contentFramework: baseLangContentFramework } = refsArrayToObject(
        baseLangRefArray
      );

      let categoryTourListV1 = getSinglePrismicSlice({
        sliceName: 'ticket_card_shoulder_page',
        slices:
          lang !== 'en-us'
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
            lang: 'en-us',
          })) || {};
        productCardData = data;
        baseLangExperienceLimit = sp_experience_limit;
      }

      let completePage = {
        ...page,
        data: {
          ...page.data,
          footer_ref: commonFooter,
          header_ref: commonHeader,
          content_framework: contentFramework,
          microsite: micrositeData,
          secondaryFooter,
          productCardData,
          noindex:
            lang !== 'en-us' ? baseLangData.data.noindex : page.data.noindex,
          baseLangExperienceLimit,
          baseLangPageTitle:
            lang !== 'en-us' ? baseLangData?.data?.title : page.data.title,
          redirect_to_headout_booking_flow:
            lang !== 'en-us'
              ? baseLangData?.data?.redirect_to_headout_booking_flow
              : page.data.redirect_to_headout_booking_flow,
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
}): Promise<any> => {
  return await Client(req)
    .getByUID(CUSTOM_TYPES.MICROSITE, uid, {
      lang,
    })
    .then(async (res) => {
      let completeMicrosite = { data: res };
      if (completeMicrosite.data) {
        if (completeMicrosite.data.uid !== uid) {
          let url = convertUidToUrl({
            uid: completeMicrosite.data.uid,
            lang: getHeadoutLanguagecode(lang),
          });
          if (host.slice(0, 5) === 'stage') {
            url = url.split('//');
            url = url.join('//stage-');
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
                  .then((res) => res)
              : completeMicrosite.data;

          const {
            data: {
              is_entertainment_mb: isEntertainmentMb,
              body: localisedCategoryTourListSlice,
            },
          } = baseLangData || { data: {} };

          let allShowPages, productCardData;
          if (isEntertainmentMb) {
            allShowPages = await fetchAllMatchingDocs({
              query: [
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
            completeMicrosite: completeMicrosite,
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
                baseLangShowBannerSubtext:
                  lang !== 'en-us'
                    ? baseLangData.data.show_banner_subtext
                    : completeMicrosite.data.data.show_banner_subtext,
                baseLangisPartnered:
                  lang !== 'en-us'
                    ? baseLangData.data.is_partnered_poi
                    : completeMicrosite.data.data.is_partnered_poi,
                redirect_to_headout_booking_flow:
                  lang !== 'en-us'
                    ? baseLangData.data.redirect_to_headout_booking_flow
                    : completeMicrosite.data.data
                        .redirect_to_headout_booking_flow,
                localisedCategoryTourListV1,
                categoryTourListV2,
                ...(allShowPages && { allShowPages }),
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

export const getGlobalHomepage = async ({ req, uid, lang }) => {
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

export const getGlobalCollection = async ({ req, uid, lang }) => {
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
        subPages?.results?.find((page) => page.data.page_type === 'Tickets') ||
        {};
      attractionsPage =
        subPages?.results?.find(
          (page) => page.data.page_type === 'Attractions'
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

export const getGlobalCity = async ({ req, uid, lang }) => {
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

export const getGlobalCountry = async ({ req, uid, lang }) => {
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

export const getGlobalExperience = async ({ req, uid, lang }) => {
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
  const linkedRefsPromise = Client(req).getByIDs(ref_ids.filter((id) => id));
  return await Promise.resolve(linkedRefsPromise).then((res: any) => {
    return res.results;
  });
};

export const getShowPage = async ({
  req,
  lang,
  uid,
  isDev,
  serverResponse,
  host,
  queryParamsString,
}) => {
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

  const getCollections = async ({ pageSize = 100, page = 1, prevResults }) => {
    const {
      results = [],
      total_results_size: totalDocuments,
    } = await Client().query(
      [Prismic.Predicates.at('document.type', CUSTOM_TYPES.SHOW_PAGE)],
      { page, pageSize }
    );
    const allResults = [...prevResults, ...results];

    if (allResults.length < totalDocuments) {
      return getCollections({
        pageSize: 100,
        page: page + 1,
        prevResults: allResults,
      });
    }

    return allResults;
  };

  const allDocuments = await getCollections({
    pageSize: 100,
    page: 1,
    prevResults: [],
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
        allShowPagesDocuments: allDocuments,
      },
      ContentType: CUSTOM_TYPES.SHOW_PAGE,
    };
  }
  return Promise.reject();
};

const removeLastPathFromUID = (uid: string): string => {
  const tempUid = uid.split('.');
  tempUid.pop();
  return tempUid.join('.');
};

export const getPrismicDocument = async ({
  req,
  serverResponse,
  query,
  isDev,
  useHostAsUid = false,
  isNewMediaSite = false,
  cookies = {},
}): Promise<{
  ContentType?: string;
  CMSContent?: any;
  statusCode?: number;
  isDev?: boolean;
  useHostAsUid?: boolean;
  isNewMediaSite?: boolean;
  cookies?: { [key: string]: string };
}> => {
  const { host } = req.headers || window.location;
  const { lang } = getLangUID(req, query);
  let uid = useHostAsUid
    ? host.replace('stage-', '')
    : getLangUID(req, query)?.uid;
  const queryParamsString = getValidUrlParams(query);

  // Removes '.home' from the uid so a valid prismic document is returned.
  if (isNewMediaSite) {
    uid = removeLastPathFromUID(uid);
  }

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
      getContentPageDocument({
        req,
        serverResponse,
        host,
        lang,
        queryParamsString,
        uid,
      }),
      getListicleDocument({ req, lang, uid }),
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
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((errorInstance) => {
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
}) => {
  const { host } = req.headers || window.location;
  const isStage = host.includes('stage-');
  const cookies = req.cookies;
  let { uid, lang } = getLangUID(req, query);
  const hostname = getHostName(isStage, isDev, host);

  /* Mediaupgrade Experiment */
  let mediaUpgradeExperiment = { isNewMediaSite: false, isOldMediaSite: false };
  const experimentUid = MEDIAUPGRADE_EXPERIMENT_UIDS.find((expUid) => {
    if (uid.includes(expUid)) {
      return expUid;
    }
  });
  switch (true) {
    case experimentUid && experimentUid === uid: {
      mediaUpgradeExperiment.isOldMediaSite = true;
      break;
    }
    case experimentUid && `${experimentUid}.home` === uid: {
      mediaUpgradeExperiment.isNewMediaSite = true;
      uid = removeLastPathFromUID(uid);
      break;
    }
    default: {
      break;
    }
  }

  try {
    let initial_tgids = [];

    const { ContentType, CMSContent, statusCode } = (await getPrismicDocument({
      query,
      req,
      serverResponse,
      isDev,
      isNewMediaSite: mediaUpgradeExperiment.isNewMediaSite,
      cookies,
    })) || { statusCode: 404 };
    const currencyListPromise = fetchCurrencyList();
    const domainConfigPromise = fetchDomainConfig(uid);

    /* Mutating the alternate lang array so it works for the newMediaSites 
    - To be removed after mediaUpgrade project */
    if (
      ContentType === CUSTOM_TYPES.MICROSITE &&
      mediaUpgradeExperiment.isNewMediaSite
    ) {
      const { alternate_languages } = CMSContent.data;
      CMSContent.data.alternate_languages = alternate_languages.map((lang) => {
        lang.uid = `${lang.uid}.home`;
        return lang;
      });
      CMSContent.data.data.noindex = true;
      CMSContent.data.data.canonical_link =
        CMSContent.data.data.canonical_link + 'home/';
    }

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
    let tgidsArray = [];
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
          lang,
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

      tgidsArray = toursList?.reduce((acc, tour) => {
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
      const language = getHeadoutLanguagecode(lang);
      const city = CMSContent?.data?.city_name?.trim()?.split(' ')?.join('_');
      const categoryId = CMSContent?.data?.headout_category_id;
      const collectionId = CMSContent?.data?.headout_collection_id;
      if (collectionId) {
        const collectionData = await fetchCollection({
          collectionId,
          hostname,
          language,
          currency: 'USD',
          cookies,
        });
        const pinnedCards =
          getCollectionSection(collectionData, 'PINNED_CARDS') ?? [];
        const genericSection = getCollectionSection(collectionData, 'GENERIC');
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
        const categoryData = await fetchTourGroupsByCategory({
          categoryId,
          hostname,
          isSubCategory: false,
          city,
          language,
          currency: 'USD',
          cookies,
        });
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
        mediaUpgradeExperiment,
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
        mediaUpgradeExperiment,
      };
    }

    if (
      ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
      ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY ||
      ContentType === CUSTOM_TYPES.LISTICLE
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
        mediaUpgradeExperiment,
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
        categoryTourListData,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
        currencyList: await currencyListPromise,
        domainConfig: await domainConfigPromise,
        mediaUpgradeExperiment,
      };
    }

    if (ContentType === CUSTOM_TYPES.SHOW_PAGE) {
      try {
        const tgidData = await fetchTourGroupV6({
          tgid: CMSContent?.data?.tgid,
          hostname,
          language: getHeadoutLanguagecode(lang),
          cookies,
        });

        const inventorySlotData = await fetchTourGroupSlots({
          tgid: CMSContent?.data?.tgid,
          hostname,
          forDays: 10,
          cookies,
        });

        const primaryCountry = tgidData?.city?.country;
        const primaryCity = tgidData?.city;

        const activeCurrency = tgidData?.currency;

        return {
          CMSContent,
          tourGroupData: tgidData,
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
          mediaUpgradeExperiment,
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
      microsite.data.all_tours.reduce((accum, tour) => {
        return [...accum, parseInt(tour.primary.tgid)];
      }, []) || [];

    let labelIds;
    if (all_tours_tab_tgids.length) {
      labelIds = microsite.data.content_order.reduce((accum, label) => {
        return [...accum, label.label.id];
      }, []);
      microsite.data.labels = await Client(req)
        .getByIDs(labelIds)
        .then((res) => {
          return res.results;
        });
    }

    if (ContentType === CUSTOM_TYPES.MICROSITE) {
      let aggregatedRatingDetails: AggregatedRatingDetails;
      const { data } = CMSContent || {};
      const { refs, data: CMSData } = data || {};
      const { contentFramework, productCardData } = refs || {};
      const { data: contentFrameworkData } = contentFramework || {};
      const {
        design,
        theme,
        body1,
        allShowPages,
        localisedCategoryTourListV1,
        categoryTourListV2,
      } = CMSData || {};
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
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
            sliceObj: localisedCategoryTourListV1,
            hostname,
            lang,
            cookies,
            localizedStrings,
          });
          aggregatedRatingDetails =
            categoryTourListData.aggregatedRatingDetails;
        } else {
          categoryTourListData = await categoryTourListParserV2({
            tourListCategory: categoryTourListV2,
            hostname,
            showpages: allShowPages,
            categoryCarousel: categoryCarouselCF,
            lang,
            localizedStrings,
            cookies,
          });
        }
      }

      const prismicTours = toursTabFirstSlice
        ? toursTabSliceHandler(toursTabFirstSlice)
        : [];
      const offers = prismicTours
        ?.filter((tour) => tour.offer__free_tour?.id)
        ?.map((tour) => tour.offer__free_tour?.id);
      const uniqueOfferIds = offers.filter(
        (id, index) => offers.indexOf(id) === index
      );
      if (uniqueOfferIds.length)
        (CMSContent as any).offerData = await Client(req)
          .getByIDs(uniqueOfferIds)
          .then((offerData) => {
            offerData.results.map((offer) => {
              if (parseInt(offer.data.offer_tgid) > 0)
                initial_tgids.push(offer.data.offer_tgid);
            });
            return offerData;
          });

      const toursList = uncategorizedToursListParser(
        prismicTours,
        initial_tgids
      );

      tgidsArray = toursList?.reduce((acc, tour) => {
        return [...acc, tour.tgid];
      }, []);

      const activeCurrency = categoryTourListData?.activeCurrency;
      const primaryCity = categoryTourListData?.primaryCity;
      const primaryCountry = primaryCity?.country;

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
        aggregatedRatingDetails,
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
      };
    }
    tgidsArray = [...tgidsArray, ...all_tours_tab_tgids];
    const useTest = !!scorpioAllTourGroupData?.['queryParams']?.bookSubdomain;

    const tourGroupAPIResponses = await fetchTourListV6({
      hostname,
      language: getHeadoutLanguagecode(lang),
      tgids: tgidsArray,
      fallbackToEnglish: getHeadoutLanguagecode(lang) !== 'en',
      currency: scorpioAllTourGroupData?.['queryParams']?.currency ?? null,
      useTest,
      cookies,
    }).catch((error) => {
      Sentry.captureException(error);
      traceError({ error, host: req?.headers?.host, url: req?.url });

      // if tourGroup API fails, assume all tours as unavailable and render rest of the page.
      return {
        tourGroups: tgidsArray.map((tgid) => ({
          id: tgid,
          listingPrice: null,
        })),
      };
    });

    const currencySymbolMap = tourGroupAPIResponses?.currencies?.reduce(
      (acc, currency) => ({
        ...acc,
        [currency.code]: { ...currency },
      }),
      {}
    );

    const tourGroupData = tourGroupAPIResponses?.tourGroups?.reduce(
      (accum: {}, tour: any) => {
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
        } = tour ?? {};

        let { microBrandsHighlight } = tour ?? {};

        microBrandsHighlight = standardizeCancellationPolicy({
          highlights: microBrandsHighlight,
          ticketValidity,
          reschedulePolicy,
          cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
          lang: getHeadoutLanguagecode(lang),
          localizedStrings,
        });

        const { productImages, safetyImages } = media || {};
        const updatedDescriptors = generateDescriptor({
          descriptors,
          lang: getHeadoutLanguagecode(lang),
        });

        let allTags = allTagsTour || [];
        if (hide_df) {
          allTags = allTags?.filter((t) => !t.includes('DF-'));
        }
        if (hide_safe) {
          allTags = allTags?.filter((t) => !t.includes('SAFE'));
        }
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
          },
        };
      },
      {}
    );

    const primaryCountry =
      tourGroupAPIResponses?.cities?.[0]?.country ||
      scorpioAllTourGroupData?.categoryTourListData?.primaryCountry;

    const primaryCity = tourGroupAPIResponses?.cities?.[0];
    const activeCurrency = tourGroupAPIResponses?.currencies?.[0];
    return {
      ...scorpioAllTourGroupData,
      ...(activeCurrency && { activeCurrency }),
      ...(primaryCity && { primaryCity }),
      tourGroupData,
      currencySymbolMap,
      primaryCountry,
      currencyList: await currencyListPromise,
      domainConfig: await domainConfigPromise,
      mediaUpgradeExperiment,
    };
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      statusCode: 500,
    };
  }
};
