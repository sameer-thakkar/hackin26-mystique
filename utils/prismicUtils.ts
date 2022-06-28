import { Client } from 'config/prismic-config';
import Prismic from 'prismic-javascript';
import { toursTabSliceHandler } from 'components/Slices';
import {
  CUSTOM_TYPES,
  LINKED_MICROSITE_PROPS,
  MICROSITE_ARRAY_KEYS,
  MICROSITE_BOOL_KEYS,
  MICROSITE_LINK_KEYS,
  MICROSITE_OBJECT_KEYS,
  MICROSITE_STRING_KEYS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  THEMES,
} from 'const/index';
import { COMMON_DATA_PROPS_FOR_LISTICLE } from 'const/index';
import {
  documentUidUpdateRedirectHandler,
  getCollectionSection,
  getEnglishDocUid,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  redirectTo,
  refsArrayToObject,
} from 'utils';
import { generateDescriptor } from 'utils/productUtils';
import { traceError } from 'utils/logutils';
import { getHostName } from 'utils/helper';
import { getLangUID, getValidUrlParams, sanitizeURL } from 'utils/urlUtils';
import {
  categoryTourListParserV1,
  categoryTourListParserV2,
  uncategorizedToursListParser,
  getToursGlobalCollection,
} from 'utils/dataParsers';
import {
  fetchTourGroupV6,
  fetchTourGroupSlots,
  fetchCollection,
  fetchCollectionList,
  fetchTourGroupsByCategory,
} from 'utils/apiUtils';

export const fetchAllMatchingDocs = async ({
  query,
  params = { pageSize: 100, page: 1 },
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
          let url = page.data?.page_url;
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
          let url = completeMicrosite.data.data?.page_url;
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
              body: categorisedTours,
            },
          } = baseLangData || { data: {} };

          let allShowPages, productCardData;
          if (isEntertainmentMb) {
            allShowPages = await fetchAllMatchingDocs({
              query: [
                Prismic.Predicates.at(`document.type`, CUSTOM_TYPES.SHOW_PAGE),
              ],
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

          const linkValues = MICROSITE_LINK_KEYS.reduce(
            (acc, elem) => ({
              ...acc,
              [elem]:
                Object.keys(completeMicrosite.data.data[elem]).length > 1
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

          const boolValues: any = MICROSITE_BOOL_KEYS.reduce(
            (acc, elem) => ({
              ...acc,
              [elem]: baseLangData.data[elem],
            }),
            {}
          );

          // Base lang Fallback for Tour Ranking.
          const tourTabSlice = completeMicrosite.data.data.body1[0];
          if (tourTabSlice?.primary && !tourTabSlice.primary.ranking) {
            tourTabSlice.primary.ranking =
              baseLangData?.data?.body1[0]?.primary?.ranking;
          }

          // Base lang Fallback for CategorisedToursV1.
          let categorisedToursV1 = getSinglePrismicSlice({
            sliceName: 'tour_list_category_v1',
            slices: categorisedTours,
          });

          let categoryTourListV1 = getSinglePrismicSlice({
            sliceName: 'tour_list_category_v1',
            slices: completeMicrosite.data.data.body,
          });
          if (Object.keys(categorisedToursV1)?.length) {
            categorisedToursV1.primary.locale_ranking =
              categoryTourListV1?.primary?.locale_ranking ||
              categorisedToursV1?.primary?.locale_ranking;
            categorisedToursV1.primary.locale_exclusions =
              categoryTourListV1?.primary?.locale_exclusions ||
              categorisedToursV1?.primary?.locale_exclusions;
          }
          if (!categoryTourListV1?.primary?.product_cards?.id) {
            categoryTourListV1 = categorisedToursV1;
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

          const poweredByHeadout =
            completeMicrosite.data.data?.enable_powered_by_headout_logo ||
            baseLangData.data?.enable_powered_by_headout_logo;
          delete completeMicrosite.data.data?.enable_powered_by_headout_logo;
          delete baseLangData.data?.enable_powered_by_headout_logo;

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
                ...linkValues,
                ...boolValues,
                canonical_link:
                  canonicalLink || completeMicrosite.data.data.page_url,
                logo_redirection_url: completeMicrosite.data.data
                  .logo_redirection_url.url
                  ? completeMicrosite.data.data.logo_redirection_url
                  : baseLangData.data.logo_redirection_url,
                enable_earliest_availability:
                  baseLangData.data.enable_earliest_availability,
                enable_powered_by_superbrand_logo:
                  typeof poweredByHeadout === 'string'
                    ? poweredByHeadout === 'Yes'
                    : poweredByHeadout,
                baseLangPageTitle:
                  lang !== 'en-us'
                    ? baseLangData?.data?.title
                    : completeMicrosite.data.data.title,
                redirect_to_headout_booking_flow:
                  lang !== 'en-us'
                    ? baseLangData?.data?.redirect_to_headout_booking_flow
                    : completeMicrosite.data.data
                        .redirect_to_headout_booking_flow,
                categorisedToursV1,
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

  const collections = await Client().query(
    [Prismic.Predicates.at('document.type', CUSTOM_TYPES.SHOW_PAGE)],
    { pageSize: 100 }
  );

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
        allShowPagesDocuments: collections?.results,
      },
      ContentType: CUSTOM_TYPES.SHOW_PAGE,
    };
  }
  return Promise.reject();
};

const getPrismicDocument = async ({
  req,
  serverResponse,
  query,
  isDev,
}): Promise<{
  ContentType?: string;
  CMSContent?: any;
  statusCode?: number;
  isDev?: boolean;
}> => {
  const { host } = req.headers || window.location;
  const { uid, lang } = getLangUID(req, query);
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
}) => {
  const { host } = req.headers || window.location;
  const isStage = host.includes('stage-');
  const { uid, lang } = getLangUID(req, query);
  const hostname = getHostName(isStage, isDev, host);

  try {
    let initial_tgids = [];

    const { ContentType, CMSContent, statusCode } = (await getPrismicDocument({
      query,
      req,
      serverResponse,
      isDev,
    })) || { statusCode: 404 };

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
        });
      }

      const prismicTours = toursTabFirstSlice
        ? await toursTabSliceHandler(toursTabFirstSlice)
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
          language: getHeadoutLanguagecode(lang),
          currency: 'USD',
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
      };
    }

    if (
      ContentType === CUSTOM_TYPES.GLOBAL_HOMEPAGE ||
      ContentType === CUSTOM_TYPES.GLOBAL_COUNTRY ||
      ContentType === CUSTOM_TYPES.LISTICLE
    ) {
      return { CMSContent, ContentType, uid, lang, isDev, host };
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
      });
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
      };
    }

    if (ContentType === CUSTOM_TYPES.SHOW_PAGE) {
      try {
        const tgidData = await fetchTourGroupV6({
          tgid: CMSContent?.data?.tgid,
          hostname,
          language: getHeadoutLanguagecode(lang),
        });

        const inventorySlotData = await fetchTourGroupSlots({
          tgid: CMSContent?.data?.tgid,
          hostname,
          forDays: 10,
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
        categorisedToursV1: categoryTourListV1,
      } = CMSData || {};
      const MBDesign = design || '';
      const mbTheme = theme || THEMES.DEFAULT;
      const toursTabFirstSlice = body1[0];
      const categorizedTours = body;

      const categoryTourList = getSinglePrismicSlice({
        sliceName: 'tour_list_category',
        slices: categorizedTours,
      });

      const categoryCarouselCF = getSinglePrismicSlice({
        sliceName: 'category_carousel',
        slices: contentFrameworkData?.body,
      });

      let categoryTourListData;
      const hasCategoryTourListV1 = Object.keys(categoryTourListV1)?.length;
      const hasCategoryTourListV2 = Object.keys(categoryTourList)?.length;
      const hasCategoryTourList =
        hasCategoryTourListV2 ||
        hasCategoryTourListV1 ||
        Object.keys(categoryCarouselCF)?.length;
      if (hasCategoryTourList) {
        if (hasCategoryTourListV1) {
          categoryTourListData = await categoryTourListParserV1({
            productCard: productCardData,
            sliceObj: categoryTourListV1,
            hostname,
            lang,
          });
        } else {
          categoryTourListData = await categoryTourListParserV2({
            tourListCategory: categoryTourList,
            hostname,
            showpages: allShowPages,
            categoryCarousel: categoryCarouselCF,
          });
        }
      }

      const prismicTours = toursTabFirstSlice
        ? await toursTabSliceHandler(toursTabFirstSlice)
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
        ...(primaryCity && { primaryCity }),
        ...(primaryCountry && { primaryCountry }),
        ...(activeCurrency && { activeCurrency }),
      };
    }
    let constructedTourgroupURL;
    tgidsArray = [...tgidsArray, ...all_tours_tab_tgids];
    try {
      const useTest = !!scorpioAllTourGroupData?.['queryParams']?.bookSubdomain;
      const tgEndpoint = new URL(
        `https://${
          isStage ? 'stage-' : ''
        }microbrands.headout.com/api/tours/v6/tour-groups/`
      );
      tgEndpoint.searchParams.set('language', getHeadoutLanguagecode(lang));
      tgEndpoint.searchParams.set('ids%5B%5D', tgidsArray.join(','));
      if (getHeadoutLanguagecode(lang) !== 'en') {
        tgEndpoint.searchParams.set('fallback-to-english', '0');
      }
      if (scorpioAllTourGroupData?.['queryParams']?.currency)
        tgEndpoint.searchParams.set(
          'currency',
          scorpioAllTourGroupData?.['queryParams']?.currency
        );
      if (useTest) {
        tgEndpoint.searchParams.set('useTest', 'true');
      }
      constructedTourgroupURL = tgEndpoint.toString();
    } catch (e) {
      constructedTourgroupURL = `https://${
        isStage ? 'stage-' : ''
      }microbrands.headout.com/api/tours/v6/tour-groups/?ids%5B%5D=${tgidsArray}&language=${getHeadoutLanguagecode(
        lang
      )}`;
    }

    const tourGroupAPIResponses = await fetch(
      constructedTourgroupURL.toString()
    )
      .then((r) => r.json())
      .catch((error) => {
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
          microBrandsHighlight,
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
          primaryCollection,
        } = tour || {};
        const { productImages, safetyImages } = media || {};
        const updatedDescriptors = generateDescriptor({
          descriptors,
          maxDuration,
          minDuration,
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
            images: [...(productImages || []), { url: imageUrl }],
            averageRating,
            reviewCount,
            ctaBooster: callToAction,
            available: !(listingPrice === null),
            allTags,
            safetyImages: safetyImages || [],
            validity,
            combo,
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
    };
  } catch (error) {
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      statusCode: 500,
    };
  }
};
