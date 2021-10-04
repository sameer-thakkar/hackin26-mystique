import { Client } from 'config/prismic-config';
import Prismic from 'prismic-javascript';
import {
  CUSTOM_TYPES,
  LINKED_MICROSITE_PROPS,
  MICROSITE_ARRAY_KEYS,
  MICROSITE_BOOL_KEYS,
  MICROSITE_LINK_KEYS,
  MICROSITE_OBJECT_KEYS,
  MICROSITE_STRING_KEYS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
} from 'const/index';
import { COMMON_DATA_PROPS_FOR_LISTICLE } from 'const/index';
import {
  getEnglishDocUid,
  getSinglePrismicSlice,
  redirectTo,
  refsArrayToObject,
} from 'utils';
import { getLangUID, getValidUrlParams, sanitizeURL } from 'utils/urlUtils';

import { traceError } from './logutils';

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

      // Redirect logic (if redirect exists on content page)
      const url = page.data.microsite_document_ref?.data.redirect_url?.url;
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
              .getByUID(CUSTOM_TYPES.CONTENT_PAGE, baseLangUid, {
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
  console.log({ lang });
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

          const categorisedToursV1 = getSinglePrismicSlice({
            sliceName: 'tour_list_category_v1',
            slices: categorisedTours,
          });

          let allShowPages, productCardData;
          if (isEntertainmentMb) {
            allShowPages = await Client().query(
              [Prismic.Predicates.at('document.type', CUSTOM_TYPES.SHOW_PAGE)],
              { pageSize: 100 }
            );
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

          let categoryTourListV1 = getSinglePrismicSlice({
            sliceName: 'tour_list_category_v1',
            slices: completeMicrosite.data.data.body,
          });
          if (!categoryTourListV1?.primary?.product_cards?.id) {
            categoryTourListV1 = getSinglePrismicSlice({
              sliceName: 'tour_list_category_v1',
              slices: baseLangData?.data?.body,
            });
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
                baseLangPageTitle: baseLangData.data.title,
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
      ticketsPage = subPages?.results
        ?.filter((page) => page.data.page_type === 'Tickets')
        ?.reduce((acc, curr) => acc + curr);
      attractionsPage = subPages?.results
        ?.filter((page) => page.data.page_type === 'Attractions')
        ?.reduce((acc, curr) => acc + curr);
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
        commonHeader,
        commonFooter,
        contentFramework,
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
    const { common_header, common_footer, content_framework } = response.data;

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
        commonHeader,
        commonFooter,
        contentFramework,
      },
      ContentType: CUSTOM_TYPES.GLOBAL_EXPERIENCE,
    };
  }
  return Promise.reject();
};

const getRefsArrayByIds = async (ref_ids: Array<String>, req: Request) => {
  const linkedRefsPromise = Client(req).getByIDs(ref_ids.filter((id) => id));
  return await Promise.resolve(linkedRefsPromise).then((res: any) => {
    return res.results;
  });
};

export const getShowPage = async ({ req, lang, uid }) => {
  const response = await Client(req).getByUID(CUSTOM_TYPES.SHOW_PAGE, uid, {
    lang,
  });

  const collections = await Client().query(
    [Prismic.Predicates.at('document.type', CUSTOM_TYPES.SHOW_PAGE)],
    { pageSize: 100 }
  );

  if (response) {
    const { common_footer, common_header } = response.data;

    const refArray = await getRefsArrayByIds(
      [common_header.id, common_footer.id],
      req
    );

    const { commonHeader, commonFooter } = refsArrayToObject(refArray);
    return {
      CMSContent: {
        ...response,
        commonFooter,
        commonHeader,
        allShowPagesDocuments: collections?.results,
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
}): Promise<{
  ContentType?: string;
  CMSContent?: any;
  statusCode?: number;
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
      getShowPage({ req, lang, uid }),
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
