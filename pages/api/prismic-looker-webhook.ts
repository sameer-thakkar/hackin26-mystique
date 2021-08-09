import { Client } from 'config/prismic-config';
import { CUSTOM_TYPES, LANGUAGE_PARAMS_REGEX } from 'const/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { legacyBooleanCheck } from 'utils';
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

const parseDocuments = async (documents) => {
  const microsites = documents.filter((d) => d.type === CUSTOM_TYPES.MICROSITE);
  let contentPages = documents.filter(
    (d) => d.type === CUSTOM_TYPES.CONTENT_PAGE
  );

  const tgidsToFetch = documents
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

  const finalDocs = [...microsites, ...contentPages].map((doc) => {
    const { uid, data, type, alternate_languages, tags, lang } = doc;
    const {
      page_url,
      redirect_url,
      disable_amp,
      noindex,
      nofollow,
      title,
      description,
      canonical_link,
      content_framework,
      body1,
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
      pageUrl = new URL(convertUidToUrl(uid));
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
      structure: getStructure(pageUrl),
      document_type: type,
      page_type:
        type === CUSTOM_TYPES.MICROSITE
          ? 'collection'
          : type === CUSTOM_TYPES.CONTENT_PAGE
          ? 'shoulder'
          : '',
      has_noindex: legacyBooleanCheck(noindex),
      has_nofollow: legacyBooleanCheck(nofollow),
      has_amp: !disable_amp || false,
      title,
      description,
      url: page_url,
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
    };

    return Object.entries(metaData).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val ?? '' }), // set empty string if no value.
      {}
    );
  });

  return { finalDocs, tgidsToFetch };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { documents: updatedDocumentIds = [], masterRef = null } =
    req?.body || {};

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

  const { finalDocs, tgidsToFetch } = await parseDocuments(documents);

  if (finalDocs.length === 0)
    return res.status(204).json({
      status: 'Nothing to update',
      documents,
      finalDocs,
    });

  let response = {};

  response['stitch'] = await fetch(
    'https://hooks.stitchdata.com/v1/clients/121892/token/b74d3528aa553a34e84a67d4215b606d3d6ab7a6ce963001431704ab23cc7522',
    {
      method: 'POST',
      body: JSON.stringify(finalDocs),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(async (r) => {
    return { json: await r.json(), r };
  });
  response['payload'] = { finalDocs, documents, tgidsToFetch };

  res.status(200).json({ response });
};
