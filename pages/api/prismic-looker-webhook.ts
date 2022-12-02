import { Client } from 'config/prismic-config';
import { NextApiRequest, NextApiResponse } from 'next';
import { legacyBooleanCheck } from 'utils';
import {
  filterByDocType,
  shoulderPageTicketsCheck,
  breadcrumbsCheck,
  getDocType,
  getTgids,
  getStructure,
  getProductCardsId,
  getPageUrl,
  getAvailableLanguages,
  getParentDomain,
  uncategorisedToursCheck,
  getMetaImageUrl,
  getFooterDetails,
  getBannerSubtext,
} from 'utils/lookerUtils';
import { fetchDomainConfig } from 'utils/apiUtils';
import { CUSTOM_TYPES, SLICE_TYPES } from 'const/index';

const getUpdatedDocuments = async ({ documentIds, masterRef, req }) => {
  const linkedRefsPromise = Client(req, { ref: masterRef }).getByIDs(
    documentIds.filter((id) => id),
    {
      fetchLinks: 'microsite.body1',
    }
  );
  return await Promise.resolve(linkedRefsPromise).then((res: any) => {
    return res.results;
  });
};

const parseDocuments = async ({ documents: docs, isStageMode, host }) => {
  const documents = isStageMode
    ? docs?.filter((doc) => doc?.tags?.includes('[DEV]'))
    : docs;

  const {
    [CUSTOM_TYPES.MICROSITE]: microsites = [],
    [CUSTOM_TYPES.CONTENT_PAGE]: contentPages = [],
    [CUSTOM_TYPES.SHOW_PAGE]: showPages = [],
    [CUSTOM_TYPES.GLOBAL_HOMEPAGE]: globalHomepage = [],
    [CUSTOM_TYPES.GLOBAL_CITY]: globalCity = [],
    [CUSTOM_TYPES.GLOBAL_COUNTRY]: globalCountry = [],
    [CUSTOM_TYPES.GLOBAL_COLLECTION]: globalCollection = [],
    [CUSTOM_TYPES.GLOBAL_EXPERIENCE]: globalExperience = [],
    [CUSTOM_TYPES.PRODUCT_CARDS]: productCardDocsList = [],
  } = filterByDocType(documents);

  const pageDocsList = [
    ...microsites,
    ...contentPages,
    ...showPages,
    ...globalHomepage,
    ...globalCity,
    ...globalCountry,
    ...globalCollection,
    ...globalExperience,
  ];

  let baseLangDoc = null;

  const pageDocsPromises = pageDocsList?.map(async (doc) => {
    const {
      uid,
      type,
      lang,
      first_publication_date,
      last_publication_date,
      alternate_languages,
      data: {
        design,
        redirect_type,
        redirect_url,
        noindex,
        title,
        description,
        focus_keyword,
        google_site_verification,
        bing_site_verification,
        canonical_link,
        content_framework,
        author_name,
        tagged_collection,
        tagged_category,
        tagged_sub_category,
        tagged_city,
        tagged_country,
        tagged_mb_type,
        tagged_page_type,
        tagged_content_type,
        shoulder_page_type,
      },
    } = doc;

    const pageUrl = getPageUrl(doc);
    const language = lang?.split('-')[0].toUpperCase();

    if (language !== 'EN') {
      baseLangDoc = alternate_languages?.filter(
        (doc) => doc?.lang === 'en-us'
      )[0];
    }

    const { logo, faviconUrl } = await fetchDomainConfig(uid);
    const pageDocFooterDetails = await getFooterDetails(doc);

    const metaData = {
      uid,
      document_type: getDocType(type),
      first_publication_date,
      last_publication_date,
      has_shoulder_page_tickets: await shoulderPageTicketsCheck(doc),
      has_breadcrumbs: await breadcrumbsCheck(doc),
      redirect_type,
      redirect_url: redirect_url?.url,
      collection_id: tagged_collection,
      category_name: tagged_category,
      sub_category_name: tagged_sub_category,
      city: tagged_city,
      country: tagged_country,
      structure: pageUrl ? getStructure(new URL(pageUrl)) : null,
      page_type:
        type === CUSTOM_TYPES.SHOW_PAGE ? 'Landing Page' : tagged_page_type,
      mb_type: tagged_mb_type,
      shoulder_page_type:
        tagged_page_type === 'Shoulder Page' ? shoulder_page_type : null,
      content_type: tagged_content_type
        ?.map((tag) => tag?.[SLICE_TYPES.CONTENT_TYPE_TAG])
        ?.filter((tag) => tag),
      focus_keyword,
      google_site_verification_id: google_site_verification,
      bing_site_verification_id: bing_site_verification,
      author_name: author_name,
      has_uncategorised_tours: uncategorisedToursCheck(doc),
      banner_subtext: getBannerSubtext(doc),
      layout: type === CUSTOM_TYPES.MICROSITE ? design : null,
      favicon_url: faviconUrl,
      meta_image_url: getMetaImageUrl(doc),
      header_logo_url: logo?.logoUrl,
      footer_logo_url: logo?.logoUrl,
      footer_disclaimer: pageDocFooterDetails?.footerDisclaimer,
      microsite_doc_footer_disclaimer:
        pageDocFooterDetails?.micrositeDocFooterDisclaimer,
      has_noindex: !!legacyBooleanCheck(noindex),
      has_nofollow: !!legacyBooleanCheck(noindex),
      title,
      description,
      url: pageUrl,
      canonical_link,
      available_languages: getAvailableLanguages({ doc, language }),
      has_longform: !!content_framework?.id,
      tgids: await getTgids({ doc, host, isStageMode }),
      parent_domain: pageUrl ? getParentDomain(new URL(pageUrl)) : null,
      language,
      product_cards_id: getProductCardsId(doc),
    };

    return Object.entries(metaData).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val ?? '' }), // set empty string if no value.
      {}
    );
  });

  const productCardDocs = productCardDocsList?.map((doc) => {
    const {
      id,
      data: {
        city,
        collection,
        category,
        sub_category,
        ranking,
        exclusions,
        limit,
      },
    } = doc;

    return {
      city: city?.cityCode,
      collectionId: collection,
      categoryId: category,
      subCategoryId: sub_category,
      commonRanks: ranking,
      commonExclusions: exclusions,
      experienceLimit: limit,
      id,
    };
  });

  const pageDocs = await Promise.all(pageDocsPromises);
  const hasDataToPush = [...pageDocs, ...productCardDocs].length > 0;
  return {
    pageDocs,
    productCardDocs,
    baseLangDocId: baseLangDoc?.id,
    baseLangDocUid: baseLangDoc?.uid,
    hasDataToPush,
  };
};

const createStitchPostRequest = ({
  stitchEndpointToken,
  jsonBody,
  clientId = 121892,
}) => {
  return fetch(
    `https://hooks.stitchdata.com/v1/clients/${clientId}/token/${stitchEndpointToken}`,
    {
      method: 'POST',
      body: JSON.stringify(jsonBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { documents: updatedDocumentIds = [], masterRef = null } =
    req?.body || {};
  const { stageMode } = req.query;
  const isStageMode = stageMode?.length > 0;
  const { host } = req?.headers;

  if (!updatedDocumentIds?.length)
    return res.status(204).json({
      status: 'Nothing to update',
      body: req?.body,
      query: req?.query,
    });

  const documents = await getUpdatedDocuments({
    documentIds: updatedDocumentIds,
    masterRef,
    req,
  });

  const {
    pageDocs,
    productCardDocs,
    baseLangDocId,
    baseLangDocUid,
    hasDataToPush,
  } = await parseDocuments({
    documents,
    isStageMode,
    host,
  });

  if (!hasDataToPush)
    return res.status(204).json({
      status: 'Nothing to update',
      documents,
      pageDocs,
    });

  let response = {};
  const requests = [];
  let baseLangPageDocs = [];

  //trigger webhook for base lang doc as well if lang page is published so that available_languages field for base lang doc is updated
  if (baseLangDocId) {
    const baseLangDocuments = await getUpdatedDocuments({
      documentIds: [baseLangDocId],
      masterRef,
      req,
    });
    const { pageDocs } = await parseDocuments({
      documents: baseLangDocuments,
      isStageMode,
      host,
    });
    baseLangPageDocs = pageDocs;
  }

  //get lang docs categorisation metadata from it's corresponding base lang doc categorisation metadata
  if (baseLangDocUid) {
    pageDocs?.forEach((pageDoc: Record<string, any>) => {
      const baseLangPageDoc = baseLangPageDocs?.find(
        (doc) => doc?.uid === baseLangDocUid
      );
      pageDoc.collection_id = baseLangPageDoc?.collection_id;
      pageDoc.category_name = baseLangPageDoc?.category_name;
      pageDoc.sub_category_name = baseLangPageDoc?.sub_category_name;
      pageDoc.city = baseLangPageDoc?.city;
      pageDoc.country = baseLangPageDoc?.country;
      pageDoc.mb_type = baseLangPageDoc?.mb_type;
      pageDoc.page_type = baseLangPageDoc?.page_type;
      pageDoc.shoulder_page_type = baseLangPageDoc?.shoulder_page_type;
      pageDoc.content_type = baseLangPageDoc?.content_type;
      pageDoc.banner_subtext =
        pageDoc.banner_sub_text || baseLangPageDoc?.banner_subtext;
    });
  }

  if (productCardDocs.length) {
    requests.push(
      createStitchPostRequest({
        stitchEndpointToken:
          '3db60546284f1eb6776e433e509d06bfdfb25cb6126816dff88cb5b156de8384',
        jsonBody: productCardDocs,
      })
    );
  }

  if (pageDocs.length) {
    requests.push(
      createStitchPostRequest({
        stitchEndpointToken:
          'b74d3528aa553a34e84a67d4215b606d3d6ab7a6ce963001431704ab23cc7522',
        jsonBody: baseLangPageDocs?.length
          ? [...pageDocs, ...baseLangPageDocs]
          : pageDocs,
      })
    );
  }

  if (requests?.length) {
    response['stitch'] = await Promise.all(requests);
  }

  response['payload'] = {
    pageDocs: baseLangPageDocs?.length
      ? [...pageDocs, ...baseLangPageDocs]
      : pageDocs,
    documents,
    productCardDocs,
  };

  res.status(200).json({ response });
};
