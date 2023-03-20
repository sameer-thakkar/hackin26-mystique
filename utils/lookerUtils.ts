import Prismic from 'prismic-javascript';
import {
  getSinglePrismicSlice,
  getHeadoutLanguagecode,
  checkIfMicrosite,
} from 'utils';
import { groupBy } from 'utils/arrayUtils';
import { convertUidToUrl, getShowpageBreadcrumbUid } from 'utils/urlUtils';
import { fetchAllMatchingDocs } from 'utils/prismicUtils';
import {
  categoryTourListParserV1,
  getToursGlobalCollection,
} from 'utils/dataParsers';
import { getHostName } from 'utils/helper';
import {
  CUSTOM_TYPES,
  DOC_TYPES,
  DESIGN,
  LANGUAGE_PARAMS_REGEX,
  SLICE_TYPES,
  HEADOUT_CATEGORY_CONTENT_TYPE,
  DEFAULT_LOOKER_VALUES,
} from 'const/index';
import { strings } from 'const/strings';

type PrismicDocumentType = {
  id: string;
  uid: string;
  type: string;
  alternate_languages: Record<string, string>[];
  tags: string[];
  lang: string;
  first_publication_date: string;
  last_publication_date: string;
  data: Record<string, any>;
};

export const getDocType = (type: string): string | null => {
  return DOC_TYPES[type] || null;
};

export const filterByDocType = (
  docs: PrismicDocumentType[]
): Record<string, PrismicDocumentType[]> => {
  return groupBy(docs, 'type');
};

export const getStructure = (url: URL): string | null => {
  if (!url) return null;

  const pathArray = url.pathname
    ?.replace(LANGUAGE_PARAMS_REGEX, '')
    ?.split('/')
    ?.filter((path) => path?.length);

  switch (true) {
    case pathArray.length > 0 && !url.host.startsWith('www'):
      return 'Subfolder on Subdomain';
    case pathArray.length > 0:
      return 'Subfolder';
    case url.host.startsWith('www'):
      return 'Root Domain';
    case !url.host.startsWith('www'):
      return 'Subdomain';
    default:
      return null;
  }
};

const contentFrameworkSliceCheck = async ({
  docId,
  sliceType,
}: {
  docId: string;
  sliceType: string;
}): Promise<boolean> => {
  const contentFrameworkDoc = await fetchAllMatchingDocs({
    query: [Prismic.Predicates.at(`document.id`, docId)],
  });
  const { body }: { body: Record<string, any>[] } =
    contentFrameworkDoc?.[0]?.data || {};
  return body?.some((slice) => slice?.slice_type === sliceType);
};

const getContentFrameworkSlice = async ({
  docId,
  sliceType,
  findAll = false,
}: {
  docId: string;
  sliceType: string;
  findAll?: boolean;
}): Promise<Record<string, any> | undefined> => {
  const contentFrameworkDoc = await fetchAllMatchingDocs({
    query: [Prismic.Predicates.at(`document.id`, docId)],
  });
  const { body }: { body: Record<string, any>[] } =
    contentFrameworkDoc?.[0]?.data ?? {};
  if (findAll) {
    return body?.filter((slice) => slice?.slice_type === sliceType);
  } else {
    return body?.find((slice) => slice?.slice_type === sliceType);
  }
};

export const shoulderPageTicketsCheck = async ({
  type,
  data,
}: PrismicDocumentType): Promise<boolean> => {
  const contentFrameworkId = data?.content_framework?.id;
  if (type === CUSTOM_TYPES.CONTENT_PAGE && contentFrameworkId) {
    return await contentFrameworkSliceCheck({
      docId: contentFrameworkId,
      sliceType: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
    });
  }

  return false;
};

export const getPageUrl = ({ uid, lang }: PrismicDocumentType) => {
  try {
    return convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });
  } catch (e) {
    return null;
  }
};

export const getProductCardsId = ({
  type,
  data,
}: PrismicDocumentType): string | null => {
  if (type === CUSTOM_TYPES.MICROSITE) {
    const categorySlice = getSinglePrismicSlice({
      sliceName: SLICE_TYPES.TOUR_LIST_CATEGORY_V1,
      slices: data?.body,
    });
    return categorySlice?.primary?.product_cards?.id;
  }

  return null;
};

type TgetTgidsFromProductCards = {
  productCardsDocId: string;
  data: Record<string, any>;
  lang: string;
  hostname: string;
};

export const getTgidsFromProductCards = async ({
  productCardsDocId,
  data,
  lang,
  hostname,
}: TgetTgidsFromProductCards): Promise<string[]> => {
  const productCardDocs = await fetchAllMatchingDocs({
    query: [Prismic.Predicates.at(`document.id`, productCardsDocId)],
  });
  const { data: productCardDocData } = productCardDocs?.[0] || {};
  const parsedData = await categoryTourListParserV1({
    productCard: productCardDocData,
    sliceObj: data?.body?.[0],
    hostname,
    lang,
  });
  let tgids: any = [];
  tgids = tgids.concat(
    parsedData?.orderedTours?.map((tour: any) => tour?.tgid.toString())
  );
  return tgids;
};

export const getTgids = async ({
  doc,
  host,
  isStageMode,
}: {
  doc: PrismicDocumentType;
  host: string;
  isStageMode: boolean;
}): Promise<string[]> => {
  let tgids: any[] = [];
  const { type, lang, data } = doc || {};

  const isDev = host.includes('localhost');
  const hostname = getHostName(isStageMode, isDev, host);

  if (type === CUSTOM_TYPES.MICROSITE) {
    switch (true) {
      case data?.design === DESIGN.V1 && !!getProductCardsId(doc):
        //categorised V1 MB
        tgids = tgids.concat(
          (await getTgidsFromProductCards({
            productCardsDocId: getProductCardsId(doc) ?? '',
            data,
            lang,
            hostname,
          })) || []
        );
        break;
      case data?.design === DESIGN.V2:
        //non-entertainment V2 MB
        tgids = tgids.concat(
          data?.all_tours
            ?.filter((tour: any) => tour?.primary?.tgid)
            ?.map((tour: any) => tour?.primary?.tgid) || []
        );
        break;
      default:
        //uncategorised MB
        tgids = tgids.concat(
          data?.body1?.[0]?.items
            ?.filter((tour: any) => tour?.tgid)
            ?.map((tour: any) => tour?.tgid) || []
        );
    }
  }
  if (type === CUSTOM_TYPES.SHOW_PAGE) tgids.push(data?.tgid.toString());
  if (type === CUSTOM_TYPES.GLOBAL_COLLECTION) {
    const {
      headout_collection_id,
      headout_category_id,
      headout_tgid,
      city_name,
    } = data || {};
    const parsedData = await getToursGlobalCollection({
      collection: headout_collection_id,
      sub_category: headout_category_id,
      tgid: headout_tgid,
      hostname,
      cityName: city_name,
      lang,
    });
    tgids = tgids.concat(
      parsedData?.orderedTours?.map((tour: any) => tour?.tgid.toString()) || []
    );
  }

  return tgids;
};

export const getAvailableLanguages = ({
  doc: { alternate_languages },
  language,
}: {
  doc: PrismicDocumentType;
  language: string;
}): string[] => {
  // @ts-expect-error TS(2769): No overload matches this call.
  const alternateLanguages = alternate_languages?.reduce((acc, currentLang) => {
    const formattedLang = currentLang?.lang?.split('-')?.[0]?.toUpperCase();
    return [...acc, formattedLang];
  }, []);
  // @ts-expect-error TS(2488): Type 'Record<string, string>' must have a '[Symbol... Remove this comment to see the full error message
  return [language, ...alternateLanguages];
};

export const getParentDomain = (url: URL): string | null => {
  if (!url) return null;
  const hostnameArray = url?.hostname?.split('.');
  hostnameArray[0] = 'www';
  return hostnameArray.join('.');
};

export const uncategorisedToursCheck = ({
  type,
  data,
}: PrismicDocumentType) => {
  return (
    type === CUSTOM_TYPES.MICROSITE &&
    data?.body1?.[0]?.items?.filter((tour: any) => tour?.tgid).length > 0
  );
};

export const getMetaImageUrl = ({
  type,
  data,
}: PrismicDocumentType): string => {
  const { image } = data || {};
  switch (type) {
    case CUSTOM_TYPES.MICROSITE:
    case CUSTOM_TYPES.CONTENT_PAGE:
      return image?.url || '';
    default:
      return image || '';
  }
};

const getDefaultFooterDisclaimer = () =>
  DEFAULT_LOOKER_VALUES.FOOTER_DISCLAIMER;

type FooterDetailsType = {
  hasPrimaryFooter: boolean;
  hasSecondaryFooter: boolean;
  attractionName: string;
  footerDisclaimer: string;
  micrositeDocFooterDisclaimer: string;
};

export const getFooterDetails = async ({
  type,
  data,
}: PrismicDocumentType): Promise<FooterDetailsType | undefined> => {
  const isMicrosite = checkIfMicrosite({ type });
  const {
    footer_ref,
    common_footer,
    secondary_footer: secondaryFooterDocRef,
    attraction,
    disclaimer,
  } = data || {};
  const footerDocRef = footer_ref || common_footer;
  const hasPrimaryFooter = !!footerDocRef?.id;
  const hasSecondaryFooter = !!secondaryFooterDocRef?.id;

  if (hasPrimaryFooter) {
    const { id: footerDocId } = footerDocRef || {};
    const footerDocs = await fetchAllMatchingDocs({
      query: [Prismic.Predicates.at(`document.id`, footerDocId)],
    });
    const { data: footerDocData } = footerDocs?.[0] || {};
    const { footerDocDataAttraction, disclaimer_text } = footerDocData || {};

    return {
      hasPrimaryFooter,
      hasSecondaryFooter,
      attractionName: attraction || footerDocDataAttraction || '',
      footerDisclaimer: disclaimer_text || getDefaultFooterDisclaimer(),
      micrositeDocFooterDisclaimer:
        (isMicrosite && disclaimer?.[0]?.text) ||
        (isMicrosite && getDefaultFooterDisclaimer()),
    };
  }
  if (isMicrosite) {
    return {
      hasPrimaryFooter,
      hasSecondaryFooter,
      attractionName: attraction || '',
      footerDisclaimer: '',
      micrositeDocFooterDisclaimer:
        disclaimer?.[0]?.text || getDefaultFooterDisclaimer(),
    };
  }
};

export const getBannerSubtext = ({
  type,
  data,
}: PrismicDocumentType): string => {
  const { banner_subtext, banner_sub_text } = data || {};
  switch (type) {
    case CUSTOM_TYPES.MICROSITE:
      if (banner_subtext) return banner_subtext;
      else return '';
    case CUSTOM_TYPES.GLOBAL_HOMEPAGE || CUSTOM_TYPES.GLOBAL_EXPERIENCE:
      return banner_subtext;
    case CUSTOM_TYPES.GLOBAL_CITY:
      return banner_sub_text;
    default:
      return '';
  }
};

type TBreadcrumb = {
  text: string | null;
  url: string | null;
};

export const getBreadcrumbs = async (doc: PrismicDocumentType) => {
  const { type, data, lang } = doc;
  let breadcrumbsDetails: Record<string, TBreadcrumb> = {},
    counter = 0;

  switch (true) {
    case type === CUSTOM_TYPES.MICROSITE || type === CUSTOM_TYPES.CONTENT_PAGE:
      const breadcrumbsSlice =
        data?.body2?.find(
          (slice: Record<string, any>) =>
            slice?.slice_type === SLICE_TYPES.BREADCRUMBS
        ) ||
        (data?.content_framework?.id &&
          (await getContentFrameworkSlice({
            docId: data.content_framework.id,
            sliceType: SLICE_TYPES.BREADCRUMBS,
          })));

      if (breadcrumbsSlice) {
        breadcrumbsSlice?.items?.forEach(
          (level: Record<string, any>, index: number) => {
            counter++;
            return (breadcrumbsDetails[`level_${index + 1}`] = {
              text: level?.title || '',
              url: level?.url?.url || '',
            });
          }
        );

        breadcrumbsDetails[`level_${counter + 1}`] = {
          text: breadcrumbsSlice?.primary?.current_title || '',
          url: getPageUrl(doc),
        };
      }
      break;

    case type === CUSTOM_TYPES.SHOW_PAGE:
      const pageUrl = getPageUrl(doc);
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const isLTT = pageUrl.includes('www.london-theater-tickets.com');

      breadcrumbsDetails = {
        level_1: {
          text: isLTT
            ? strings.ENTERTAINMENT_MB.LTT.MB_NAME
            : strings.ENTERTAINMENT_MB.BROADWAY.MB_NAME,
          url: convertUidToUrl({
            uid: getShowpageBreadcrumbUid('', isLTT),
            lang: getHeadoutLanguagecode(lang),
          }),
        },
        level_2: {
          text: data?.tagged_sub_category || '',
          url: convertUidToUrl({
            uid: getShowpageBreadcrumbUid(data?.tagged_sub_category, isLTT),
            lang: getHeadoutLanguagecode(lang),
          }),
        },
        level_3: { text: DEFAULT_LOOKER_VALUES.SHOWPAGE_TITLE, url: pageUrl },
      };
      break;

    case type === CUSTOM_TYPES.GLOBAL_COLLECTION:
      breadcrumbsDetails = {
        level_1: {
          text: data?.country_name || '',
          url: convertUidToUrl({ uid: data?.country?.uid, lang }) || '',
        },
        level_2: {
          text: data?.city_name || '',
          url: convertUidToUrl({ uid: data?.city?.uid, lang }) || '',
        },
      };
      break;

    case type === CUSTOM_TYPES.GLOBAL_EXPERIENCE:
      const { collection, country, city } = data || {};
      const globalCollectionDoc = await fetchAllMatchingDocs({
        query: [Prismic.Predicates.at(`document.id`, collection?.id)],
      });
      const { country_name, city_name } = globalCollectionDoc?.[0]?.data || {};

      breadcrumbsDetails = {
        level_1: {
          text: country_name || '',
          url: convertUidToUrl({ uid: country?.uid }) || '',
        },
        level_2: {
          text: city_name || '',
          url: convertUidToUrl({ uid: city?.uid }) || '',
        },
      };
      break;

    default:
      breadcrumbsDetails = {};
  }

  return breadcrumbsDetails;
};

export const getHeadoutPageDetails = (uid: string): Record<string, string> => {
  const [type, id] = uid.split('-') || [];

  return {
    pageType: HEADOUT_CATEGORY_CONTENT_TYPE[type] || '',
    pageId: (type === 'city' ? id.toUpperCase() : id) || '',
  };
};

export const getHeadings = async ({
  type,
  data,
}: PrismicDocumentType): Promise<Record<string, string[]>> => {
  let mainHeadings = [],
    lfcHeadings: any = [];

  switch (type) {
    case CUSTOM_TYPES.MICROSITE:
      const { design, is_entertainment_mb, heading, images, body } = data || {};
      switch (true) {
        case design === DESIGN.V1:
          heading && mainHeadings.push(heading);
          break;
        case design === DESIGN.V2:
          const isEntertainmentMB = is_entertainment_mb;
          const isListicle = body?.[0]?.primary?.islisticle;
          if (isEntertainmentMB && isListicle) {
            heading && mainHeadings.push(heading);
          } else if (isEntertainmentMB) {
            images?.forEach((image: any) => {
              image?.main_heading && mainHeadings.push(image?.main_heading);
            });
          }
      }
      break;
    case CUSTOM_TYPES.CONTENT_PAGE:
      const { featured_title } = data || {};
      featured_title && mainHeadings.push(featured_title);
      break;
    case CUSTOM_TYPES.SHOW_PAGE:
      mainHeadings.push(DEFAULT_LOOKER_VALUES.SHOWPAGE_TITLE);
      break;
    case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
      const { banner_title } = data || {};
      banner_title && mainHeadings.push(banner_title || '');
      break;
    case CUSTOM_TYPES.GLOBAL_CITY:
      const bannerSlice = getSinglePrismicSlice({
        sliceName: SLICE_TYPES.BANNER,
        slices: data?.body,
      });
      bannerSlice?.primary?.banner_title &&
        mainHeadings.push(bannerSlice?.primary?.banner_title);
      break;
    case CUSTOM_TYPES.GLOBAL_COUNTRY:
      const { country_name } = data || {};
      country_name && mainHeadings.push(`${country_name} Theme Parks`);
      break;
    case CUSTOM_TYPES.GLOBAL_COLLECTION:
      const { collection_name } = data || {};
      collection_name && mainHeadings.push(collection_name);
      break;
    case CUSTOM_TYPES.GLOBAL_EXPERIENCE:
      const globalCollectionDoc = await fetchAllMatchingDocs({
        query: [Prismic.Predicates.at(`document.id`, data?.collection?.id)],
      });
      const { collection_name: globalCollectionName } =
        globalCollectionDoc?.[0]?.data || {};
      globalCollectionName &&
        mainHeadings.push(`${globalCollectionName} ${strings.TICKETS}`);
      break;
  }

  //get h1 from linked content framework doc
  const contentFrameworkId = data?.content_framework?.id;
  if (contentFrameworkId) {
    const richTextSlices = await getContentFrameworkSlice({
      docId: contentFrameworkId,
      sliceType: SLICE_TYPES.RICH_TEXT,
      findAll: true,
    });
    richTextSlices?.forEach((slice: any) => {
      slice?.items?.forEach((item: any) => {
        item?.text?.forEach((textItem: any) => {
          const { type, text } = textItem || {};
          return type === 'heading1' && text && lfcHeadings.push(text);
        });
      });
    });
  }

  return {
    mainHeadings,
    lfcHeadings,
  };
};
