import Prismic from 'prismic-javascript';
import {
  CUSTOM_TYPES,
  DOC_TYPES,
  DESIGN,
  LANGUAGE_PARAMS_REGEX,
  SLICE_TYPES,
} from 'const/index';
import { getSinglePrismicSlice, getHeadoutLanguagecode } from 'utils';
import { groupBy } from 'utils/arrayUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import { fetchAllMatchingDocs } from 'utils/prismicUtils';
import {
  categoryTourListParserV1,
  getToursGlobalCollection,
} from 'utils/dataParsers';
import { getHostName } from 'utils/helper';

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

export const shoulderPageTicketsCheck = async ({
  type,
  data,
}: PrismicDocumentType): Promise<boolean> => {
  const contentFrameworkId = data?.content_framework?.id;
  if (type === CUSTOM_TYPES.CONTENT_PAGE && contentFrameworkId) {
    const contentFrameworkDoc = await fetchAllMatchingDocs({
      query: [Prismic.Predicates.at(`document.id`, contentFrameworkId)],
    });
    const { body } = contentFrameworkDoc?.[0]?.data || {};
    return body?.some(
      (slice) => slice?.slice_type === SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD
    );
  }

  return false;
};

export const breadcrumbsCheck = ({
  type,
  data,
}: PrismicDocumentType): boolean => {
  if (type === CUSTOM_TYPES.MICROSITE) {
    return data?.body2?.some(
      (slice) => slice?.slice_type === SLICE_TYPES.BREADCRUMBS
    );
  }
  if (
    type === CUSTOM_TYPES.CONTENT_PAGE ||
    type === CUSTOM_TYPES.SHOW_PAGE ||
    type === CUSTOM_TYPES.GLOBAL_COLLECTION ||
    type === CUSTOM_TYPES.GLOBAL_EXPERIENCE
  )
    return true;

  return false;
};

export const getPageUrl = ({
  uid,
  lang,
}: PrismicDocumentType): string | null => {
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

export const getTgidsFromProductCards = async ({
  productCardsDocId,
  data,
  lang,
  hostname,
}): Promise<string[]> => {
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
  let tgids = [];
  tgids = tgids.concat(
    parsedData?.orderedTours?.map((tour) => tour?.tgid.toString())
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
  let tgids = [];
  const { type, lang, data } = doc || {};

  const isDev = host.includes('localhost');
  const hostname = getHostName(isStageMode, isDev, host);

  if (type === CUSTOM_TYPES.MICROSITE) {
    switch (true) {
      case data?.design === DESIGN.V1 && !!getProductCardsId(doc):
        //categorised V1 MB
        tgids = tgids.concat(
          (await getTgidsFromProductCards({
            productCardsDocId: getProductCardsId(doc),
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
            ?.filter((tour) => tour?.primary?.tgid)
            ?.map((tour) => tour?.primary?.tgid) || []
        );
        break;
      default:
        //uncategorised MB
        tgids = tgids.concat(
          data?.body1?.[0]?.items
            ?.filter((tour) => tour?.tgid)
            ?.map((tour) => tour?.tgid) || []
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
      parsedData?.orderedTours?.map((tour) => tour?.tgid.toString()) || []
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
  const alternateLanguages = alternate_languages?.reduce((acc, currentLang) => {
    const formattedLang = currentLang?.lang?.split('-')?.[0]?.toUpperCase();
    return [...acc, formattedLang];
  }, []);
  return [language, ...alternateLanguages];
};

export const getParentDomain = (url: URL): string | null => {
  if (!url) return null;
  const hostnameArray = url?.hostname?.split('.');
  hostnameArray[0] = 'www';
  return hostnameArray.join('.');
};
