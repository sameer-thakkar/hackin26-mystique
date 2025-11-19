import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'prismicio';
import type {
  AlternateLanguage,
  PrismicDocumentWithUID,
} from '@prismicio/types';
import { getHeadoutLanguagecode, legacyBooleanCheck } from 'utils';
import { fetchDomainConfig } from 'utils/apiUtils';
import {
  attachedContentFrameworkData,
  baseLangMicrositeDataForContentPage,
  fetchBaseLangData,
  filterByDocType,
  getAvailableLanguages,
  getBannerSubtext,
  getBreadcrumbs,
  getDocType,
  getFooterDetails,
  getFooterSubtext,
  getHeadings,
  getHeadoutPageDetails,
  getMetaImageUrl,
  getPageUrl,
  getParentDomain,
  getProductCardsId,
  getSlicesFromContentFramework,
  getStructure,
  getTgids,
  shoulderPageTicketsCheck,
  uncategorisedToursCheck,
} from 'utils/lookerUtils';
import {
  CUSTOM_TYPES,
  DOC_TYPES,
  PAGE_URL_STRUCTURE,
  SEO_SUBDOMAINS,
  SLICE_TYPES,
} from 'const/index';
import { HO_FAVICONS } from 'const/seo';

const getUpdatedDocuments = async ({ documentIds }: any) => {
  const prismicClient = createClient();
  const linkedRefsPromise = prismicClient.getByIDs(
    documentIds.filter((id: any) => id),
    {
      fetchLinks: 'microsite.body1',
      lang: '*',
    }
  );

  return await Promise.resolve(linkedRefsPromise).then((res: any) => {
    return res.results;
  });
};

const parseDocuments = async ({ documents, host }: any) => {
  const {
    [CUSTOM_TYPES.MICROSITE]: microsites = [],
    [CUSTOM_TYPES.CONTENT_PAGE]: contentPages = [],
    [CUSTOM_TYPES.SHOW_PAGE]: showPages = [],
    [CUSTOM_TYPES.VENUE_PAGE]: venuePages = [],
    [CUSTOM_TYPES.GLOBAL_HOMEPAGE]: globalHomepage = [],
    [CUSTOM_TYPES.GLOBAL_CITY]: globalCity = [],
    [CUSTOM_TYPES.GLOBAL_COUNTRY]: globalCountry = [],
    [CUSTOM_TYPES.GLOBAL_COLLECTION]: globalCollection = [],
    [CUSTOM_TYPES.GLOBAL_EXPERIENCE]: globalExperience = [],
    [CUSTOM_TYPES.PRODUCT_CARDS]: productCardDocsList = [],
    [CUSTOM_TYPES.HEADOUT_CATEGORY_CONTENT]: headoutContentDocsList = [],
    [CUSTOM_TYPES.CONTENT_FRAMEWORK]: contentFrameworkDocsList = [],
  } = filterByDocType(documents);

  const pageDocsList = [
    ...microsites,
    ...contentPages,
    ...showPages,
    ...venuePages,
    ...globalHomepage,
    ...globalCity,
    ...globalCountry,
    ...globalCollection,
    ...globalExperience,
    ...headoutContentDocsList,
  ];

  let baseLangDoc: (PrismicDocumentWithUID | AlternateLanguage) | null = null;

  const pageDocsPromises = pageDocsList?.map(async (doc) => {
    const {
      id,
      uid,
      type,
      lang,
      first_publication_date,
      last_publication_date,
      alternate_languages,
      tags,
      data: {
        design,
        redirect_type,
        redirect_url,
        noindex,
        title,
        description,
        focus_keyword,
        focus_keywords,
        google_site_verification,
        bing_site_verification,
        canonical_link,
        content_framework,
        author_name,
        is_freelancer,
        tagged_collection,
        tagged_category,
        tagged_sub_category,
        tagged_city,
        tagged_country,
        tagged_mb_type,
        tagged_page_type,
        tagged_content_type,
        shoulder_page_type,
        shoulder_page_custom_label,
        misc_page_mapping,
        is_entertainment_mb,
        primary_tag,
        disclaimer,
        banner_subtext,
        category_heading_override,
        category_subtext_override,
      },
    } = doc;

    const contentFrameworkId = content_framework?.id;
    const pageUrl = getPageUrl(doc) || '';
    const language = getHeadoutLanguagecode(lang).toUpperCase();
    const isSubdomain =
      getStructure(new URL(pageUrl)) === PAGE_URL_STRUCTURE.SUBDOMAIN;

    if (language !== 'EN') {
      baseLangDoc = alternate_languages?.filter(
        (doc) => doc?.lang === 'en-us'
      )[0];
    }

    /* Data for content framework attached in Microsite or Content Page doc */
    const contentFrameworkData = await attachedContentFrameworkData(
      contentFrameworkId,
      lang
    );
    let baseLangData = await fetchBaseLangData(language, baseLangDoc, doc);
    baseLangData =
      type === CUSTOM_TYPES.CONTENT_PAGE
        ? await baseLangMicrositeDataForContentPage(type, baseLangData)
        : baseLangData;

    const {
      is_poi_mb: baseLangIsPoiMb,
      banner_and_footer_combinations: baseLangBannerAndFooterCombinations,
      tagged_mb_type: baseLangMbType,
    } = baseLangData?.data || {};

    const slicesInsideContentFramework =
      Object.keys(contentFrameworkData ?? {})?.length > 0
        ? contentFrameworkData?.data?.body
        : [];
    const { logo } = await fetchDomainConfig(uid);
    const pageDocFooterDetails = await getFooterDetails(doc);
    const headingsDetails = await getHeadings(doc);
    const docType = getDocType(type);
    const focusKeyword =
      docType === DOC_TYPES.venue_page ? focus_keywords : focus_keyword;

    const metaData = {
      id,
      uid,
      document_type: docType,
      first_publication_date,
      last_publication_date,
      has_shoulder_page_tickets: await shoulderPageTicketsCheck(doc),
      breadcrumbs: await getBreadcrumbs(doc),
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
        ?.map((tag: any) => tag?.[SLICE_TYPES.CONTENT_TYPE_TAG])
        ?.filter((tag: any) => tag),
      focus_keyword: focusKeyword,
      google_site_verification_id: google_site_verification,
      bing_site_verification_id: bing_site_verification,
      author_name,
      is_freelancer: !!is_freelancer,
      has_uncategorised_tours: uncategorisedToursCheck(doc),
      banner_subtext: await getBannerSubtext(
        doc,
        baseLangIsPoiMb,
        baseLangBannerAndFooterCombinations
      ),
      footer_subtext: await getFooterSubtext(
        doc,
        baseLangIsPoiMb,
        baseLangBannerAndFooterCombinations,
        baseLangMbType,
        disclaimer
      ),
      custom_banner_subtext: banner_subtext,
      layout: type === CUSTOM_TYPES.MICROSITE ? design : null,
      favicon_url: HO_FAVICONS[48],
      meta_image_url: getMetaImageUrl(doc),
      header_logo_url: logo?.logoUrl,
      footer_logo_url: logo?.logoUrl,
      has_primary_footer: pageDocFooterDetails?.hasPrimaryFooter,
      has_secondary_footer: pageDocFooterDetails?.hasSecondaryFooter,
      disclaimer_type: baseLangBannerAndFooterCombinations,
      is_poi_mb: baseLangIsPoiMb,
      is_entertainment_mb:
        type === CUSTOM_TYPES.SHOW_PAGE || type === CUSTOM_TYPES.VENUE_PAGE
          ? true
          : is_entertainment_mb,
      attraction_name: pageDocFooterDetails?.attractionName,
      footer_disclaimer: pageDocFooterDetails?.footerDisclaimer,
      microsite_doc_footer_disclaimer:
        pageDocFooterDetails?.micrositeDocFooterDisclaimer,
      has_noindex:
        isSubdomain && !SEO_SUBDOMAINS.includes(pageUrl)
          ? true
          : !!legacyBooleanCheck(noindex),
      has_nofollow:
        isSubdomain && !SEO_SUBDOMAINS.includes(pageUrl)
          ? true
          : !!legacyBooleanCheck(noindex),
      main_h1_headings: headingsDetails.mainHeadings,
      content_framework_h1_headings: headingsDetails.lfcHeadings,
      title,
      description,
      url: pageUrl,
      canonical_link,
      available_languages: getAvailableLanguages({ doc, language }),
      has_longform: !!content_framework?.id,
      linked_content_framework_id: content_framework?.id || null,
      tgids: await getTgids({
        localisedDoc: doc,
        baseLangDoc: baseLangData,
        host,
      }),
      parent_domain: pageUrl ? getParentDomain(new URL(pageUrl)) : null,
      language,
      product_cards_id: getProductCardsId(
        type === CUSTOM_TYPES.CONTENT_PAGE && !!contentFrameworkData
          ? contentFrameworkData
          : baseLangData
      ),
      tags,
      slices_in_url: getSlicesFromContentFramework(
        slicesInsideContentFramework
      ),
      shoulder_page_custom_label,
      misc_page_mapping,
      primary_tag,
      category_heading_override,
      category_subtext_override,
    };

    return Object.entries(metaData).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val ?? '' }), // set empty string if no value.
      {}
    );
  });

  const productCardDocs = productCardDocsList?.map((doc) => {
    const {
      id,
      tags,
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
      id,
      city: city?.cityCode,
      collectionId: collection,
      categoryId: category,
      subCategoryId: sub_category,
      commonRanks: ranking,
      commonExclusions: exclusions,
      experienceLimit: limit,
      tags,
    };
  });

  const headoutContentDocs = headoutContentDocsList?.map((doc) => {
    const {
      id,
      uid,
      type,
      first_publication_date,
      last_publication_date,
      lang,
      tags,
      data: {
        use_accordion_as_faq_schema,
        content_framework,
        meta_title_override,
        meta_description_override,
        author_name,
        is_freelancer,
      },
    } = doc;

    const headoutPageDetails = getHeadoutPageDetails(uid);
    const language = getHeadoutLanguagecode(lang).toUpperCase();

    const metadata = {
      id,
      uid,
      first_publication_date,
      last_publication_date,
      tags,
      document_type: getDocType(type),
      language,
      available_languages: getAvailableLanguages({ doc, language }),
      headout_page_type: headoutPageDetails?.pageType,
      headout_page_id: headoutPageDetails?.pageId,
      accordions_as_faq_and_schema: !!use_accordion_as_faq_schema,
      has_lfc: !!content_framework?.id,
      linked_content_framework_id: content_framework?.id || null,
      meta_title_override,
      meta_description_override,
      author_name,
      is_freelancer: !!is_freelancer,
    };

    return Object.entries(metadata).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val ?? '' }), // set empty string if no value.
      {}
    );
  });

  const contentFrameworkDocs = contentFrameworkDocsList?.map((doc) => {
    const {
      id,
      type,
      tags,
      first_publication_date,
      last_publication_date,
      lang,
      data: { prismic_preview_title },
    } = doc;

    const language = getHeadoutLanguagecode(lang).toUpperCase();

    return {
      id,
      tags,
      document_type: getDocType(type),
      first_publication_date,
      last_publication_date,
      language,
      available_languages: getAvailableLanguages({ doc, language }),
      prismic_preview_title,
    };
  });

  const pageDocs = await Promise.all(pageDocsPromises);
  const hasDataToPush =
    [
      ...pageDocs,
      ...productCardDocs,
      ...headoutContentDocs,
      ...contentFrameworkDocs,
    ].length > 0;

  return {
    pageDocs,
    productCardDocs,
    headoutContentDocs,
    contentFrameworkDocs,
    baseLangDocId: (baseLangDoc as any)?.id,
    baseLangDocUid: (baseLangDoc as any)?.uid,
    hasDataToPush,
  };
};

const createStitchPostRequest = ({
  stitchEndpointToken,
  jsonBody,
  clientId = 121892,
}: any) => {
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
  const { documents: updatedDocumentIds = [] } = req?.body || {};

  const { host } = req?.headers;

  if (!updatedDocumentIds?.length)
    return res.status(204).json({
      status: 'Nothing to update',
      body: req?.body,
      query: req?.query,
    });

  const documents = await getUpdatedDocuments({
    documentIds: updatedDocumentIds,
    req,
  });

  const {
    pageDocs,
    productCardDocs,
    headoutContentDocs,
    contentFrameworkDocs,
    baseLangDocId,
    baseLangDocUid,
    hasDataToPush,
  } = await parseDocuments({
    documents,
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

  let baseLangPageDocs: any = [];

  //trigger webhook for base lang doc as well if lang page is published so that available_languages field for base lang doc is updated
  if (baseLangDocId) {
    const baseLangDocuments = await getUpdatedDocuments({
      documentIds: [baseLangDocId],
      req,
    });
    const { pageDocs } = await parseDocuments({
      documents: baseLangDocuments,
      host,
    });
    baseLangPageDocs = pageDocs;
  }

  //get lang docs categorisation metadata from it's corresponding base lang doc categorisation metadata
  if (baseLangDocUid) {
    pageDocs?.forEach((pageDoc: Record<string, any>) => {
      const baseLangPageDoc = baseLangPageDocs?.find(
        (doc: PrismicDocumentWithUID) => doc?.uid === baseLangDocUid
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
      pageDoc.product_cards_id = baseLangPageDoc?.product_cards_id;
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

  if (headoutContentDocs.length) {
    requests.push(
      createStitchPostRequest({
        stitchEndpointToken:
          'b74d3528aa553a34e84a67d4215b606d3d6ab7a6ce963001431704ab23cc7522',
        jsonBody: headoutContentDocs,
      })
    );
  }

  if (contentFrameworkDocs.length) {
    requests.push(
      createStitchPostRequest({
        stitchEndpointToken:
          'b74d3528aa553a34e84a67d4215b606d3d6ab7a6ce963001431704ab23cc7522',
        jsonBody: contentFrameworkDocs,
      })
    );
  }

  if (requests?.length) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    response['stitch'] = await Promise.all(requests);
  }

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  response['payload'] = {
    pageDocs: baseLangPageDocs?.length
      ? [...pageDocs, ...baseLangPageDocs]
      : pageDocs,
    productCardDocs,
    headoutContentDocs,
    contentFrameworkDocs,
    documents,
  };

  res.status(200).json({ response });
};
