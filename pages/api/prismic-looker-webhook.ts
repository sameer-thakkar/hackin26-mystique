import { Client } from 'config/prismic-config';
import { CUSTOM_TYPES, LANGUAGE_PARAMS_REGEX } from 'const/index';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  legacyBooleanCheck,
} from 'utils';
import { fetchTourList } from 'utils/apiUtils';
import { convertUidToUrl } from 'utils/urlUtils';

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

const getTgidFromDocument = (page) => {
  if (page.type === CUSTOM_TYPES.MICROSITE)
    return page.data?.body1?.[0]?.items?.[0]?.tgid;

  return page.data?.microsite_document_ref?.data?.body1?.[0]?.items?.[0]?.tgid;
};

const parseDocuments = async ({ documents: docs, isStageMode }) => {
  const documents = isStageMode
    ? docs.filter((d) => d.tags.includes('[DEV]'))
    : docs;
  const microsites = documents.filter((d) => d.type === CUSTOM_TYPES.MICROSITE);
  let contentPages = documents.filter(
    (d) => d.type === CUSTOM_TYPES.CONTENT_PAGE
  );
  const productCardsList = documents.filter(
    (d) => d.type === CUSTOM_TYPES.PRODUCT_CARDS
  );

  const pagesList = [...microsites, ...contentPages];

  const tgidsToFetch = pagesList
    .map((page) => {
      return getTgidFromDocument(page);
    }, [])
    .filter((tgid) => tgid);
  let tgidData = {};

  if (tgidsToFetch?.length)
    tgidData = await fetchTourList({
      tgids: tgidsToFetch,
      host: 'https://microbrands.headout.com',
    })
      .then((res) => res.json())
      .then((data) =>
        data?.tourGroups.reduce((acc, tour) => {
          return {
            ...acc,
            [tour.id]: {
              ...tour,
              city: data.cities.find((city) => city.cityCode === tour.cityCode),
            },
          };
        }, {})
      );

  const pageDocs = pagesList.map((doc) => {
    const { uid, data, type, alternate_languages, tags, lang } = doc;
    const {
      redirect_url,
      disable_amp,
      noindex,
      title,
      description,
      canonical_link,
      content_framework,
      body1,
      body: categorisedTourTab,
      all_tours: allTours,
    } = data;

    let tgids = [];
    if (type === CUSTOM_TYPES.MICROSITE) {
      tgids = tgids.concat(
        body1?.[0]?.items
          ?.filter((tour) => tour?.tgid)
          ?.map((tour) => tour?.tgid) || []
      );
      tgids = tgids.concat(
        allTours
          ?.filter((tour) => tour?.primary?.tgid)
          ?.map((tour) => tour?.primary?.tgid) || []
      );
    }

    const categorySlice = getSinglePrismicSlice({
      sliceName: 'tour_list_category_v1',
      slices: categorisedTourTab,
    });

    const productCardsListId = categorySlice?.primary?.product_cards?.id;

    const STRUCTURE_TYPES = {
      CHECK: 'check',
      SUB_FOLDER_SUB_DOMAIN: 'sub-folder-on-sub-domain',
      SUB_FOLDER: 'sub-folder',
      ROOT: 'root',
      SUB_DOMAIN: 'sub-domain',
    };

    const getStructure = (url: URL) => {
      if (!url) return STRUCTURE_TYPES.CHECK;
      const pathArray = url.pathname
        .replace(LANGUAGE_PARAMS_REGEX, '')
        .split('/')
        .filter((path) => path?.length);

      switch (true) {
        case pathArray.length > 0 && !url.host.startsWith('www'):
          return STRUCTURE_TYPES.SUB_FOLDER_SUB_DOMAIN;
        case pathArray.length > 0:
          return STRUCTURE_TYPES.SUB_FOLDER;
        case url.host.startsWith('www'):
          return STRUCTURE_TYPES.ROOT;
        case !url.host.startsWith('www'):
          return STRUCTURE_TYPES.SUB_DOMAIN;
        default:
          return STRUCTURE_TYPES.CHECK;
      }
    };
    let pageUrl;
    try {
      pageUrl = convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });
    } catch (e) {
      pageUrl = null;
    }

    let inferredCity = null,
      inferredCategoryId = null;
    const tgid = getTgidFromDocument(doc);
    inferredCity = tgid ? tgidData?.[tgid]?.city?.cityCode : null;
    inferredCategoryId = tgid ? tgidData?.[tgid]?.primaryCategory?.id : null;
    const metaData = {
      uid,
      structure: pageUrl ? getStructure(new URL(pageUrl)) : null,
      document_type: type,
      page_type:
        type === CUSTOM_TYPES.MICROSITE
          ? 'collection'
          : type === CUSTOM_TYPES.CONTENT_PAGE
          ? 'shoulder'
          : '',
      has_noindex: legacyBooleanCheck(noindex),
      has_nofollow: legacyBooleanCheck(noindex),
      has_amp: !disable_amp || false,
      title,
      description,
      url: pageUrl,
      category_id: inferredCategoryId,
      city: inferredCity,
      canonical_link,
      redirect_url: redirect_url?.url,
      available_languages: alternate_languages
        .filter((l) => l?.lang)
        .map((l) => l.lang?.split('-')[1].toUpperCase()),
      has_longform: !!content_framework?.id,
      tgids,
      parent_domain: tags[0],
      language: lang?.split('-')[0].toUpperCase(),
      productCardsListId,
    };

    return Object.entries(metaData).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val ?? '' }), // set empty string if no value.
      {}
    );
  });

  const productCardDocs = productCardsList.map((doc) => {
    const { id, data } = doc;
    const {
      city,
      collection,
      category,
      sub_category,
      ranking,
      exclusions,
      limit,
    } = data;
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
  const hasDataToPush = [...pageDocs, ...productCardDocs].length > 0;
  return { pageDocs, productCardDocs, tgidsToFetch, hasDataToPush };
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
    tgidsToFetch,
    hasDataToPush,
  } = await parseDocuments({
    documents,
    isStageMode,
  });

  if (!hasDataToPush)
    return res.status(204).json({
      status: 'Nothing to update',
      documents,
      pageDocs,
    });

  let response = {};
  const requests = [];

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
        jsonBody: pageDocs,
      })
    );
  }
  if (requests?.length) {
    response['stitch'] = await Promise.all(requests);
  }
  response['payload'] = { pageDocs, documents, tgidsToFetch };

  res.status(200).json({ response });
};
