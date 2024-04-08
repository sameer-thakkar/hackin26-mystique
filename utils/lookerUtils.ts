import { createClient } from 'prismicio';
import { AlternateLanguage, PrismicDocumentWithUID } from '@prismicio/types';
import type {
  CommonFooterDocument,
  ContentFrameworkDocument,
  ContentFrameworkDocumentDataBodySlice,
  GlobalCollectionDocument,
  MicrositeDocument,
} from 'types.prismic';
import {
  checkIfMicrosite,
  getBannerAndFooterSubtext,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
  isCollectionMB,
} from 'utils';
import { groupBy } from 'utils/arrayUtils';
import { getToursGlobalCollection } from 'utils/dataParsers';
import { getHostName } from 'utils/helper';
import { convertUidToUrl, getShowpageBreadcrumbUid } from 'utils/urlUtils';
import {
  CUSTOM_TYPES,
  DEFAULT_LOOKER_VALUES,
  DESIGN,
  DOC_TYPES,
  HEADOUT_CATEGORY_CONTENT_TYPE,
  LANGUAGE_PARAMS_REGEX,
  SLICE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import categoryTourListParserV1 from './parsers/categoryTourListParserV1';
import categoryTourListParserV2 from './parsers/categoryTourListParserV2';
import { sendLog } from './logger';

export const getDocType = (type: string): string | null => {
  return DOC_TYPES[type] || null;
};

export const fetchGlobalCollectionDocument = async (id: string) => {
  try {
    const prismicClient = createClient();
    const globalCollectionDoc = (await prismicClient.getByID(
      (id as string) ?? ''
    )) as GlobalCollectionDocument;

    return globalCollectionDoc;
  } catch (error) {
    sendLog({
      err: error,
      message: `[fetchGlobalCollectionDocument] id - ${id}`,
    });
  }
};

export const filterByDocType = (
  docs: PrismicDocumentWithUID[]
): Record<string, PrismicDocumentWithUID[]> => {
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
  lang,
}: {
  docId: string;
  sliceType: string;
  lang: string;
}) => {
  const contentFrameworkDoc = await attachedContentFrameworkData(docId, lang);

  if (!contentFrameworkDoc) return false;

  const { data } = contentFrameworkDoc ?? {};

  const { body } = data ?? {};
  return body?.some((slice) => slice?.slice_type === sliceType);
};

const getContentFrameworkSlice = async ({
  docId,
  sliceType,
  findAll = false,
  lang,
}: {
  docId: string;
  sliceType: string;
  lang: string;
  findAll?: boolean;
}) => {
  const contentFrameworkDoc = await attachedContentFrameworkData(docId, lang);
  const { data } = contentFrameworkDoc ?? {};
  const { body } = data ?? {};
  if (findAll) {
    return body?.filter((slice) => slice?.slice_type === sliceType);
  } else {
    return [body?.find((slice) => slice?.slice_type === sliceType)];
  }
};

export const shoulderPageTicketsCheck = async ({
  type,
  data,
  lang,
}: PrismicDocumentWithUID): Promise<boolean> => {
  const contentFrameworkId = data?.content_framework?.id;
  if (type === CUSTOM_TYPES.CONTENT_PAGE && contentFrameworkId) {
    return await contentFrameworkSliceCheck({
      docId: contentFrameworkId,
      sliceType: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
      lang,
    });
  }

  return false;
};

export const getPageUrl = ({ uid, lang }: PrismicDocumentWithUID) => {
  try {
    return convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });
  } catch (e) {
    return null;
  }
};

export const getProductCardsId = ({
  type,
  data,
}: PrismicDocumentWithUID | ContentFrameworkDocument): string | null => {
  switch (type) {
    case CUSTOM_TYPES.MICROSITE:
      const categorySlice = getSinglePrismicSlice({
        sliceName: SLICE_TYPES.TOUR_LIST_CATEGORY_V1,
        slices: data?.body,
      });
      return categorySlice?.primary?.product_cards?.id;

    case CUSTOM_TYPES.CONTENT_FRAMEWORK:
      const ticketCardSlice = getSinglePrismicSlice({
        sliceName: SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD,
        slices: data?.body,
      });
      return ticketCardSlice?.primary?.product_cards?.id;

    default:
      return null;
  }
};

type TgetTgidsFromProductCards = {
  doc: PrismicDocumentWithUID;
  baseLangDoc: PrismicDocumentWithUID;
  productCardsDocId: string;
  lang: string;
  hostname: string;
};

export const getTgidsFromProductCards = async ({
  doc,
  baseLangDoc,
  productCardsDocId,
  lang,
  hostname,
}: TgetTgidsFromProductCards) => {
  try {
    let localisedCategoryTourListV1 = getTourListCategorySlice({
      doc,
      baseLangDoc,
      sliceType: SLICE_TYPES.TOUR_LIST_CATEGORY_V1,
    });

    const prismicClient = createClient({});
    const productCardData =
      (await prismicClient.getByID(productCardsDocId, {
        lang: '*',
      })) ?? {};

    localisedCategoryTourListV1.primary.product_cards.data =
      productCardData?.data;

    const parsedData = await categoryTourListParserV1({
      micrositeProductCardSliceWithData: localisedCategoryTourListV1,
      hostname,
      lang,
      isLookerWebhookCall: true,
    });
    let tgids: string[] = [];
    tgids = tgids.concat(
      parsedData?.finalTgids?.map((id) => id.toString()) || []
    );
    return tgids;
  } catch (error) {
    sendLog({
      message: `getProductCardData for Looker - productCardsDocId ${productCardsDocId}`,
      err: error,
    });
  }
};

export const getTgids = async ({
  localisedDoc,
  baseLangDoc,
  host,
  isStageMode,
}: {
  localisedDoc: PrismicDocumentWithUID;
  baseLangDoc: PrismicDocumentWithUID;
  host: string;
  isStageMode: boolean;
}): Promise<string[]> => {
  let tgids: any[] = [];
  const { type, lang, data } = localisedDoc || {};

  const isDev = host.includes('localhost');
  const hostname = getHostName(isStageMode, isDev, host);

  if (type === CUSTOM_TYPES.MICROSITE) {
    switch (true) {
      case data?.design === DESIGN.V1 && !!getProductCardsId(baseLangDoc):
        //categorised V1 MB
        tgids = tgids.concat(
          (await getTgidsFromProductCards({
            doc: localisedDoc,
            baseLangDoc,
            productCardsDocId: getProductCardsId(baseLangDoc) ?? '',
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
      case data?.design === DESIGN.V3:
        //categorized v3 MBs
        const { allTgids } = await categoryTourListParserV2({
          tourListCategory: getTourListCategorySlice({
            doc: localisedDoc,
            baseLangDoc,
            sliceType: SLICE_TYPES.TOUR_LIST_CATEGORY,
          }),
          hostname,
          lang: lang,
          MBDesign: DESIGN.V3,
          isLookerWebhookCall: true,
        });
        tgids = allTgids?.[0] || [];
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
  doc: PrismicDocumentWithUID;
  language: string;
}): string[] => {
  const alternateLanguages = alternate_languages?.reduce(
    (acc: string[], currentLang) => {
      const formattedLang = currentLang?.lang?.split('-')?.[0]?.toUpperCase();
      return [...acc, formattedLang];
    },
    []
  );

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
}: PrismicDocumentWithUID) => {
  return (
    type === CUSTOM_TYPES.MICROSITE &&
    data?.body1?.[0]?.items?.filter((tour: any) => tour?.tgid).length > 0
  );
};

export const getMetaImageUrl = ({
  type,
  data,
}: PrismicDocumentWithUID): string => {
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
  lang,
  data,
}: PrismicDocumentWithUID): Promise<FooterDetailsType | undefined> => {
  const isMicrosite = checkIfMicrosite({ type });
  const {
    footer_ref,
    common_footer,
    secondary_footer: secondaryFooterDocRef,
    secondary_footer_ref: secondaryFooterDocRefForVenuePage,
    attraction,
    disclaimer,
  } = data || {};
  const footerDocRef = footer_ref || common_footer;
  const hasPrimaryFooter = !!footerDocRef?.id;
  const hasSecondaryFooter =
    !!secondaryFooterDocRef?.id || secondaryFooterDocRefForVenuePage?.id;

  if (hasPrimaryFooter) {
    const { id: footerDocId } = footerDocRef || {};

    const prismicClient = createClient();
    const footerDocs = (await prismicClient.getByID(footerDocId, {
      lang,
    })) as CommonFooterDocument;

    const { data: footerDocData } = footerDocs || {};

    const { attraction: footerDocDataAttraction, disclaimer_text } =
      footerDocData || {};

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

export const getBannerSubtext = async (
  { type, data }: PrismicDocumentWithUID,
  baseLangIsPoiMb: boolean,
  baseLangBannerAndFooterCombinations: string
): Promise<string> => {
  const { banner_subtext, banner_sub_text, tagged_mb_type } = data || {};

  const isCollectionMicrobrand = isCollectionMB(tagged_mb_type);

  switch (type) {
    case CUSTOM_TYPES.MICROSITE:
      if (!isCollectionMicrobrand) {
        return banner_subtext;
      } else {
        return (
          getBannerAndFooterSubtext(
            baseLangIsPoiMb,
            baseLangBannerAndFooterCombinations
          ) || ''
        );
      }
    case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
    case CUSTOM_TYPES.GLOBAL_EXPERIENCE:
      return banner_subtext;
    case CUSTOM_TYPES.GLOBAL_CITY:
      return banner_sub_text;
    default:
      return '';
  }
};

export const getFooterSubtext = async (
  { type }: PrismicDocumentWithUID,
  baseLangIsPoiMb: boolean,
  baseLangBannerAndFooterCombinations: string,
  baseLangMbType: string,
  disclaimer: string
) => {
  const isCollectionMicrobrand = isCollectionMB(baseLangMbType);

  switch (type) {
    case CUSTOM_TYPES.MICROSITE:
    case CUSTOM_TYPES.CONTENT_PAGE:
      if (isCollectionMicrobrand)
        return getBannerAndFooterSubtext(
          baseLangIsPoiMb,
          baseLangBannerAndFooterCombinations
        );
      else return disclaimer;

    case CUSTOM_TYPES.GLOBAL_HOMEPAGE:
    case CUSTOM_TYPES.GLOBAL_EXPERIENCE:
    case CUSTOM_TYPES.SHOW_PAGE:
    case CUSTOM_TYPES.VENUE_PAGE:
    case CUSTOM_TYPES.GLOBAL_CITY:
      return disclaimer;

    default:
      return '';
  }
};

type TBreadcrumb = {
  text: string | null;
  url: string | null;
};

export const getBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
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
            lang: lang,
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
      const isLTT = pageUrl
        ? pageUrl.includes('www.london-theater-tickets.com')
        : false;

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

      const globalCollectionDoc = await fetchGlobalCollectionDocument(
        (collection?.id as string) ?? ''
      );

      const { country_name, city_name } = globalCollectionDoc?.data || {};

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
  lang,
  data,
}: PrismicDocumentWithUID): Promise<Record<string, string[]>> => {
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
      const globalCollectionDoc = await fetchGlobalCollectionDocument(
        data?.collection?.id ?? ''
      );
      const { collection_name: globalCollectionName } =
        globalCollectionDoc?.data || {};
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
      lang: lang,
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

export const getSlicesFromContentFramework = (
  slices: ContentFrameworkDocumentDataBodySlice[] | undefined
) => {
  return slices?.reduce(
    (acc: Record<string, number>, curr: { slice_type: string }) => {
      const sliceType = curr?.slice_type;
      const currentSliceCount = acc[sliceType];

      return (acc = {
        ...acc,
        ...(acc[sliceType] && {
          [sliceType]: currentSliceCount + 1,
        }),
        ...(!acc[sliceType] && {
          [sliceType]: 1,
        }),
      });
    },
    {}
  );
};

export const attachedContentFrameworkData = async (
  contentFrameworkId: string,
  lang: string
) => {
  try {
    const prismicClient = createClient();
    const contentFrameworkDoc = (await prismicClient.getByID(
      contentFrameworkId,
      { lang }
    )) as ContentFrameworkDocument;

    return contentFrameworkDoc;
  } catch (error) {
    sendLog({
      err: error,
      message: `[attachedContentFrameworkData]: contentFrameworkId - ${contentFrameworkId} `,
    });
    return null;
  }
};

export const baseLangMicrositeDataForContentPage = async (
  type: string,
  baseLangData: PrismicDocumentWithUID<Record<string, any>, string, string>
): Promise<MicrositeDocument | any> => {
  const micrositeId = baseLangData?.data?.microsite_document_ref?.id ?? '';
  const prismicClient = createClient();
  return type === CUSTOM_TYPES.CONTENT_PAGE && micrositeId
    ? ((await prismicClient.getByID(micrositeId)) as MicrositeDocument)
    : {};
};

export const fetchBaseLangData = async (
  language: string,
  baseLangDoc: (PrismicDocumentWithUID | AlternateLanguage) | null,
  doc: PrismicDocumentWithUID
) => {
  const prismicClient = createClient();
  return language !== 'EN'
    ? ((await prismicClient.getByID(baseLangDoc!.id)) as PrismicDocumentWithUID)
    : doc;
};

const getTourListCategorySlice = ({
  doc,
  baseLangDoc,
  sliceType,
}: {
  doc: PrismicDocumentWithUID;
  baseLangDoc: PrismicDocumentWithUID;
  sliceType: string;
}) => {
  const docBody = doc?.data?.body ?? baseLangDoc?.data?.body;
  return docBody?.find(
    (slice: Record<string, any>) => slice.slice_type === sliceType
  );
};
