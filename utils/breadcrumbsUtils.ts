import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import type { ShowpageDocument } from 'types.prismic';
import {
  getAlternateLanguageDocUid,
  getCategorisationMetadata,
  getHeadoutLanguagecode,
} from 'utils';
import {
  fetchCategory,
  fetchCollection,
  fetchTourGroupV6,
} from 'utils/apiUtils';
import {
  checkIfBroadwayMB,
  checkIfLTTMB,
  checkIfViennaConcertMB,
  getShoulderPageLabel,
} from 'utils/helper';
import { getStructure } from 'utils/lookerUtils';
import { titleCase } from 'utils/stringUtils';
import {
  convertUidToUrl,
  getSanitizedPathArray,
  getShowpageBreadcrumbUid,
} from 'utils/urlUtils';
import {
  ATTRACTIONS,
  BROADWAY_SHOW_NEWS,
  getEntMBLabels,
  HOME,
  LONDON_THEATRE_NEWS,
  SHOW_NAME_TICKETS,
  THINGS_TO_DO,
  TICKETS,
  TRAVEL_GUIDE,
} from 'const/breadcrumbs';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  MB_CATEGORISATION,
  PAGE_URL_STRUCTURE,
  PRISMIC_FIELD_ID,
  SEO_SUBDOMAINS,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import getConcertCollectionDocs from './prismicUtils/getConcertCollections';
import { sendLog } from './logger';

export type TBreadcrumbItem = {
  level: number;
  label: string;
  url: string;
};
export type TBreadcrumbs = Record<string, TBreadcrumbItem>;

const getC1CollectionBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc;

  const {
    tagged_collection: taggedCollection,
    tagged_page_type: taggedPageType,
    shoulder_page_type: shoulderPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const {
    shoulder_page_custom_label: shoulderPageCustomLabel,
    categoryTourListV2,
    images,
    is_entertainment_mb: isEntertainmentMb,
  } = data || {};

  const localisedCategoryHeading = images?.[0]?.main_heading;
  const finalShoulderPageLabel = getShoulderPageLabel({
    shoulderPageType: shoulderPageType || '',
    shoulderPageCustomLabel: shoulderPageCustomLabel || '',
  });
  const isCategoryPage = !!categoryTourListV2?.primary?.primary_subcategory_id;
  const isEntertainmentMbListicle =
    isEntertainmentMb && categoryTourListV2?.primary?.islisticle;

  if (
    !taggedCollection ||
    (!finalShoulderPageLabel && !isCategoryPage && !isEntertainmentMbListicle)
  )
    return {};

  const breadcrumbs: TBreadcrumbs = {};

  if (
    taggedPageType === MB_CATEGORISATION.PAGE_TYPE.SHOULDER_PAGE ||
    isCategoryPage ||
    isEntertainmentMbListicle
  ) {
    const headoutLanguagecode = getHeadoutLanguagecode(lang);
    const { collection: collectionData } =
      (await fetchCollection({
        collectionId: taggedCollection,
        language: headoutLanguagecode,
      })) || {};

    const collectionHeading = collectionData?.heading;

    if (!collectionHeading) return {};

    const pageUrl = convertUidToUrl({
      uid,
      lang: headoutLanguagecode,
    });
    const pageUrlObject = new URL(pageUrl);

    breadcrumbs[`level_1`] = {
      level: 1,
      label: collectionHeading,
      url: convertUidToUrl({
        uid: pageUrlObject.host,
        lang: headoutLanguagecode,
      }),
    };
    breadcrumbs[`level_2`] = {
      level: 2,
      label:
        isCategoryPage || isEntertainmentMbListicle
          ? localisedCategoryHeading
          : finalShoulderPageLabel,
      url: pageUrl,
    };
  }

  return breadcrumbs;
};

const getA1CollectionBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc;
  const {
    tagged_mb_type: taggedMbType,
    tagged_city: taggedCity,
    tagged_collection: taggedCollection,
    tagged_page_type: taggedPageType,
    shoulder_page_type: shoulderPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const { shoulder_page_custom_label: shoulderPageCustomLabel } = data;

  const cityName = titleCase(taggedCity || '');
  const headoutLanguagecode = getHeadoutLanguagecode(lang);
  const isA1CollectionMB =
    taggedMbType === MB_CATEGORISATION.MB_TYPE.A1_COLLECTION;

  if ((isA1CollectionMB && !cityName) || !taggedCollection) return {};

  const breadcrumbs: TBreadcrumbs = {};

  const { collection: collectionData } =
    (await fetchCollection({
      collectionId: taggedCollection,
      language: headoutLanguagecode,
    })) || {};
  const collectionHeading = collectionData?.heading;

  if (!collectionHeading) return {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  breadcrumbs[`level_1`] = {
    level: 1,
    label: isA1CollectionMB ? cityName : HOME,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };

  if (taggedPageType === MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE) {
    breadcrumbs[`level_2`] = {
      level: 2,
      label: collectionHeading,
      url: pageUrl,
    };
  } else if (
    taggedPageType === MB_CATEGORISATION.PAGE_TYPE.SHOULDER_PAGE &&
    pathArray.length === 2
  ) {
    const finalShoulderPageLabel = getShoulderPageLabel({
      shoulderPageType: shoulderPageType || '',
      shoulderPageCustomLabel: shoulderPageCustomLabel || '',
    });

    if (!finalShoulderPageLabel) return {};

    breadcrumbs[`level_2`] = {
      level: 2,
      label: collectionHeading,
      url: convertUidToUrl({
        uid: `${pageUrlObject.host}.${pathArray[0]}`,
        lang: headoutLanguagecode,
      }),
    };
    breadcrumbs[`level_3`] = {
      level: 3,
      label: finalShoulderPageLabel,
      url: pageUrl,
    };
  }

  return breadcrumbs;
};

const getA1CategoryBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc;
  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategory,
    tagged_page_type: taggedPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const cityName = titleCase(taggedCity || '');
  const headoutLanguagecode = getHeadoutLanguagecode(lang);

  if (
    !taggedCity ||
    !taggedCategory ||
    taggedPageType !== MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
  )
    return {};

  const breadcrumbs: TBreadcrumbs = {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  if (pathArray.length !== 1) return {};

  const { categories } = await fetchCategory({
    city: taggedCity,
    language: headoutLanguagecode,
  });
  const categoryData = categories?.find(
    (category: Record<string, any>) => category.name === taggedCategory
  );
  const localisedCategoryName =
    categoryData?.name === TICKETS ? ATTRACTIONS : categoryData?.heading;

  if (!localisedCategoryName) return {};

  breadcrumbs[`level_1`] = {
    level: 1,
    label: cityName,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_2`] = {
    level: 2,
    label: localisedCategoryName,
    url: pageUrl,
  };

  return breadcrumbs;
};

const getA1SubCategoryBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc;
  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategory,
    tagged_sub_category: taggedSubCategory,
    tagged_page_type: taggedPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const cityName = titleCase(taggedCity || '');
  const headoutLanguagecode = getHeadoutLanguagecode(lang);

  if (
    !taggedCity ||
    !taggedCategory ||
    !taggedSubCategory ||
    taggedPageType !== MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
  )
    return {};

  const breadcrumbs: TBreadcrumbs = {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  if (pathArray.length !== 2) return {};

  const { categories } = await fetchCategory({
    city: taggedCity,
    language: headoutLanguagecode,
  });
  const categoryData = categories?.find(
    (category: Record<string, any>) => category.name === taggedCategory
  );
  const subCategoryData = categoryData?.subCategories?.find(
    (subCategory: Record<string, any>) => subCategory.name === taggedSubCategory
  );
  const localisedCategoryName =
    categoryData?.name === TICKETS ? ATTRACTIONS : categoryData?.heading;
  const localisedSubCategoryName = subCategoryData?.heading;

  if (!localisedCategoryName || !localisedSubCategoryName) return {};

  breadcrumbs[`level_1`] = {
    level: 1,
    label: cityName,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_2`] = {
    level: 2,
    label: localisedCategoryName,
    url: convertUidToUrl({
      uid: `${pageUrlObject.host}.${pathArray[0]}`,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_3`] = {
    level: 3,
    label: localisedSubCategoryName,
    url: pageUrl,
  };

  return breadcrumbs;
};

const getA2CategoryBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc;
  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategory,
    tagged_page_type: taggedPageType,
    shoulder_page_type: shoulderPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const { shoulder_page_custom_label: shoulderPageCustomLabel } = data;
  const headoutLanguagecode = getHeadoutLanguagecode(lang);
  const finalShoulderPageLabel = getShoulderPageLabel({
    shoulderPageType: shoulderPageType || '',
    shoulderPageCustomLabel: shoulderPageCustomLabel || '',
  });

  if (
    !taggedCity ||
    !taggedCategory ||
    !finalShoulderPageLabel ||
    taggedPageType !== MB_CATEGORISATION.PAGE_TYPE.SHOULDER_PAGE
  )
    return {};

  const breadcrumbs: TBreadcrumbs = {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  if (pathArray.length !== 1) return {};

  const { categories } = await fetchCategory({
    city: taggedCity,
    language: headoutLanguagecode,
  });
  const categoryData = categories?.find(
    (category: Record<string, any>) => category.name === taggedCategory
  );
  const localisedCategoryName =
    categoryData?.name === TICKETS ? ATTRACTIONS : categoryData?.heading;

  if (!localisedCategoryName) return {};

  breadcrumbs[`level_1`] = {
    level: 1,
    label: localisedCategoryName,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_2`] = {
    level: 2,
    label: finalShoulderPageLabel,
    url: pageUrl,
  };

  return breadcrumbs;
};

const getA2SubCategoryBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc;
  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategory,
    tagged_sub_category: taggedSubCategory,
    tagged_page_type: taggedPageType,
    shoulder_page_type: shoulderPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const { shoulder_page_custom_label: shoulderPageCustomLabel } = data;
  const headoutLanguagecode = getHeadoutLanguagecode(lang);
  const finalShoulderPageLabel = getShoulderPageLabel({
    shoulderPageType: shoulderPageType || '',
    shoulderPageCustomLabel: shoulderPageCustomLabel || '',
  });

  if (
    !taggedCity ||
    !taggedCategory ||
    !taggedSubCategory ||
    !finalShoulderPageLabel ||
    taggedPageType !== MB_CATEGORISATION.PAGE_TYPE.SHOULDER_PAGE
  )
    return {};

  const breadcrumbs: TBreadcrumbs = {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  if (pathArray.length !== 1) return {};

  const { categories } = await fetchCategory({
    city: taggedCity,
    language: headoutLanguagecode,
  });
  const { subCategories } = categories?.find(
    (category: Record<string, any>) => category.name === taggedCategory
  );
  const subCategoryData = subCategories?.find(
    (subCategory: Record<string, any>) => subCategory.name === taggedSubCategory
  );
  const localisedSubCategoryName = subCategoryData?.heading;

  if (!localisedSubCategoryName) return {};

  breadcrumbs[`level_1`] = {
    level: 1,
    label: localisedSubCategoryName || '',
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_2`] = {
    level: 2,
    label: finalShoulderPageLabel,
    url: pageUrl,
  };

  return breadcrumbs;
};

const getCityGuideLandingPageBreadcrumbs = async (
  doc: PrismicDocumentWithUID
) => {
  const { uid, lang, data } = doc;
  const { tagged_city: taggedCity, primary_tag: primaryTag } =
    data?.baseLangCategorisationMetadata || {};
  const cityName = titleCase(taggedCity || '');
  const headoutLanguagecode = getHeadoutLanguagecode(lang);

  if (!cityName || !primaryTag) return {};

  let breadcrumbs: TBreadcrumbs = {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  breadcrumbs[`level_1`] = {
    level: 1,
    label: cityName,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };

  switch (primaryTag) {
    case MB_CATEGORISATION.PRIMARY_TAG.TRAVEL_GUIDE:
      breadcrumbs[`level_2`] = {
        level: 2,
        label: TRAVEL_GUIDE,
        url: pageUrl,
      };
      break;
    case MB_CATEGORISATION.PRIMARY_TAG.THINGS_TO_DO:
      breadcrumbs[`level_2`] = {
        level: 2,
        label: THINGS_TO_DO,
        url: pageUrl,
      };
      break;
    default:
      if (pathArray.length !== 2) return {};

      breadcrumbs[`level_2`] = {
        level: 2,
        label: TRAVEL_GUIDE,
        url: convertUidToUrl({
          uid: `${pageUrlObject.host}.${pathArray[0]}`,
          lang: headoutLanguagecode,
        }),
      };
      breadcrumbs[`level_3`] = {
        level: 3,
        label: primaryTag,
        url: pageUrl,
      };
  }

  return breadcrumbs;
};

const getCityGuideShoulderPageBreadcrumbs = async (
  doc: PrismicDocumentWithUID
) => {
  const { uid, lang, data } = doc;
  const {
    tagged_city: taggedCity,
    primary_tag: primaryTag,
    shoulder_page_type: shoulderPageType,
  } = data?.baseLangCategorisationMetadata || {};
  const { shoulder_page_custom_label: shoulderPageCustomLabel } = data;
  const cityName = titleCase(taggedCity || '');
  const finalShoulderPageLabel = getShoulderPageLabel({
    shoulderPageType: shoulderPageType || '',
    shoulderPageCustomLabel: shoulderPageCustomLabel || '',
  });
  const headoutLanguagecode = getHeadoutLanguagecode(lang);

  if (!cityName || !primaryTag || !finalShoulderPageLabel) return {};

  let breadcrumbs: TBreadcrumbs = {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  breadcrumbs[`level_1`] = {
    level: 1,
    label: cityName,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };

  if (
    primaryTag === MB_CATEGORISATION.PRIMARY_TAG.THINGS_TO_DO &&
    pathArray.length === 2
  ) {
    breadcrumbs[`level_2`] = {
      level: 2,
      label: THINGS_TO_DO,
      url: convertUidToUrl({
        uid: `${pageUrlObject.host}.${pathArray[0]}`,
        lang: headoutLanguagecode,
      }),
    };
    breadcrumbs[`level_3`] = {
      level: 3,
      label: finalShoulderPageLabel,
      url: pageUrl,
    };
  } else if (pathArray.length > 2) {
    breadcrumbs[`level_2`] = {
      level: 2,
      label: TRAVEL_GUIDE,
      url: convertUidToUrl({
        uid: `${pageUrlObject.host}.${pathArray[0]}`,
        lang: headoutLanguagecode,
      }),
    };
    breadcrumbs[`level_3`] = {
      level: 3,
      label: primaryTag,
      url: convertUidToUrl({
        uid: `${pageUrlObject.host}.${pathArray[0]}.${pathArray[1]}`,
        lang: headoutLanguagecode,
      }),
    };

    if (pathArray.length === 3) {
      breadcrumbs[`level_4`] = {
        level: 4,
        label: finalShoulderPageLabel,
        url: pageUrl,
      };
    } else {
      try {
        const prevSlugShoulderPageUid = `${pageUrlObject.host}.${pathArray
          .slice(0, pathArray.length - 1)
          .join('.')}`;
        const prismicClient = createClient();
        const { data } =
          (await prismicClient.getByUID(
            'content_page',
            prevSlugShoulderPageUid,
            {
              lang,
            }
          )) ?? {};

        const { shoulder_page_type, shoulder_page_custom_label } = data || {};
        const prevSlugShoulderPageLabel = getShoulderPageLabel({
          shoulderPageType: shoulder_page_type || '',
          shoulderPageCustomLabel: shoulder_page_custom_label || '',
        });

        if (!prevSlugShoulderPageLabel) return {};

        breadcrumbs[`level_4`] = {
          level: 4,
          label: prevSlugShoulderPageLabel,
          url: convertUidToUrl({
            uid: prevSlugShoulderPageUid,
            lang: headoutLanguagecode,
          }),
        };
        breadcrumbs[`level_5`] = {
          level: 5,
          label: finalShoulderPageLabel,
          url: pageUrl,
        };
      } catch (error) {
        sendLog({ err: error });
        return {};
      }
    }
  }

  return breadcrumbs;
};

const getA1CityGuideBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { tagged_page_type: taggedPageType } =
    doc?.data?.baseLangCategorisationMetadata || {};

  if (!taggedPageType) return {};

  let breadcrumbs: TBreadcrumbs = {};

  if (taggedPageType === MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE) {
    breadcrumbs = await getCityGuideLandingPageBreadcrumbs(doc);
  } else {
    breadcrumbs = await getCityGuideShoulderPageBreadcrumbs(doc);
  }

  return breadcrumbs;
};

export const getBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { baseLangCategorisationMetadata } = doc?.data || {};
  const { tagged_mb_type: taggedMbType } = baseLangCategorisationMetadata || {};

  if (!taggedMbType) return {};

  let breadcrumbs: TBreadcrumbs = {};

  const { uid, lang } = doc || {};
  const pageUrl = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });
  const url = new URL(pageUrl);
  const isSubdomain =
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN ||
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN_SUBFOLDER;
  const parentDomainUrl = convertUidToUrl({
    uid: url.hostname,
  });
  const isSeoSubdomain =
    SEO_SUBDOMAINS.includes(pageUrl) ||
    SEO_SUBDOMAINS.includes(parentDomainUrl);

  if (isSubdomain && !isSeoSubdomain) return {};
  if (isSeoSubdomain) {
    breadcrumbs = await getC1CollectionBreadcrumbs(doc);
    return breadcrumbs;
  }

  switch (taggedMbType) {
    case MB_CATEGORISATION.MB_TYPE.C1_COLLECTION:
      breadcrumbs = await getC1CollectionBreadcrumbs(doc);
      break;
    case MB_CATEGORISATION.MB_TYPE.A1_COLLECTION:
    case MB_CATEGORISATION.MB_TYPE.B1_GLOBAL:
      breadcrumbs = await getA1CollectionBreadcrumbs(doc);
      break;
    case MB_CATEGORISATION.MB_TYPE.A1_CATEGORY:
      breadcrumbs = await getA1CategoryBreadcrumbs(doc);
      break;
    case MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY:
      breadcrumbs = await getA1SubCategoryBreadcrumbs(doc);
      break;
    case MB_CATEGORISATION.MB_TYPE.A2_CATEGORY:
      breadcrumbs = await getA2CategoryBreadcrumbs(doc);
      break;
    case MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY:
      breadcrumbs = await getA2SubCategoryBreadcrumbs(doc);
      break;
    case MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE:
      breadcrumbs = await getA1CityGuideBreadcrumbs(doc);
      break;

    case MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE:
    case MB_CATEGORISATION.MB_TYPE.B1_GLOBAL_HOMEPAGE:
      breadcrumbs = {};
      break;

    default:
      breadcrumbs = {};
  }

  return breadcrumbs;
};

const getLTTBroadwayShowPageBreadcrumbs = async ({
  doc,
  isLTT,
  isBroadway,
}: {
  doc: ShowpageDocument;
  isLTT?: boolean;
  isBroadway?: boolean;
}) => {
  const { uid, lang, data } = doc;
  const { tgid } = data || {};
  const headoutLanguagecode = getHeadoutLanguagecode(lang);
  const { HOME } = getEntMBLabels({
    isLTT,
    isBroadway,
  });

  if (!tgid) return {};

  let breadcrumbs: TBreadcrumbs = {};

  const { name, primarySubCategory } =
    (await fetchTourGroupV6({
      tgid,
      language: headoutLanguagecode,
    })) || {};
  const { name: subCategoryName, displayName: localisedSubCategoryName } =
    primarySubCategory || {};

  if (!name || !subCategoryName || !localisedSubCategoryName) return {};

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);

  breadcrumbs[`level_1`] = {
    level: 1,
    label: HOME,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_2`] = {
    level: 2,
    label: localisedSubCategoryName,
    url: convertUidToUrl({
      uid: getShowpageBreadcrumbUid(subCategoryName, isLTT || false),
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_3`] = {
    level: 3,
    label: SHOW_NAME_TICKETS,
    url: pageUrl,
  };

  return breadcrumbs;
};

const getViennaConcertShowPageBreadcrumbs = async (doc: ShowpageDocument) => {
  const { uid, lang, data } = doc;
  const categorisationMetadata = await getCategorisationMetadata({ doc });
  const { tgid } = data || {};
  const { tagged_collection: mbCollection } = categorisationMetadata || {};
  const headoutLanguagecode = getHeadoutLanguagecode(lang);

  if (!tgid) return {};

  let breadcrumbs: TBreadcrumbs = {};

  const { name, primaryCollection } = await fetchTourGroupV6({
    tgid,
    language: headoutLanguagecode,
  });
  const { displayName: localisedCollectionName } = primaryCollection || {};
  const concertCollectionDocs = await getConcertCollectionDocs(mbCollection);
  const concertCollectionDoc = concertCollectionDocs[0];
  const concertCollectionDocUid =
    lang === SUPPORTED_LOCALE_MAP.en
      ? concertCollectionDoc.uid
      : getAlternateLanguageDocUid({
          doc: concertCollectionDoc,
          lang,
        });

  if (!localisedCollectionName || !concertCollectionDocUid) return {};

  const { HOME } = getEntMBLabels({ isViennaConcert: true });
  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);

  breadcrumbs[`level_1`] = {
    level: 1,
    label: HOME,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_2`] = {
    level: 2,
    label: localisedCollectionName,
    url: convertUidToUrl({
      uid: concertCollectionDocUid,
      lang: headoutLanguagecode,
    }),
  };
  breadcrumbs[`level_3`] = {
    level: 3,
    label: name,
    url: pageUrl,
  };

  return breadcrumbs;
};

export const getShowPageBreadcrumbs = async (doc: ShowpageDocument) => {
  const { uid } = doc;
  const isLTT = checkIfLTTMB(uid);
  const isBroadway = checkIfBroadwayMB(uid);
  const isViennaConcert = checkIfViennaConcertMB(uid);

  let breadcrumbs: TBreadcrumbs = {};

  switch (true) {
    case isLTT:
      breadcrumbs = await getLTTBroadwayShowPageBreadcrumbs({
        doc,
        isLTT: true,
      });
      break;
    case isBroadway:
      breadcrumbs = await getLTTBroadwayShowPageBreadcrumbs({
        doc,
        isBroadway: true,
      });
      break;
    case isViennaConcert:
      breadcrumbs = await getViennaConcertShowPageBreadcrumbs(doc);
      break;
    default:
      breadcrumbs = {};
  }

  return breadcrumbs;
};

export const getVenuePageBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { uid, data, lang } = doc;
  const { theatreName } = data || {};
  const isLTT = checkIfLTTMB(uid);
  const isBroadway = checkIfBroadwayMB(uid);
  const isViennaConcert = checkIfViennaConcertMB(uid);

  if (!theatreName || (!isLTT && !isBroadway && !isViennaConcert)) return {};

  let breadcrumbs: TBreadcrumbs = {};

  const { HOME, VENUE_PAGE_HOME } = getEntMBLabels({
    isLTT,
    isBroadway,
    isViennaConcert,
  });
  const headoutLanguagecode = getHeadoutLanguagecode(lang);
  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  breadcrumbs[`level_1`] = {
    level: 1,
    label: HOME,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };

  let venueHomePageUid = '';
  if (isViennaConcert && lang !== SUPPORTED_LOCALE_MAP.en) {
    try {
      const baseLangDocUid = `${pageUrlObject.host}.${pathArray[0]}`;
      const prismicClient = createClient();
      const baseLangDoc =
        (await prismicClient.getByUID('content_page', baseLangDocUid, {
          lang: DEFAULT_PRISMIC_LANG,
        })) || {};

      venueHomePageUid =
        getAlternateLanguageDocUid({
          doc: baseLangDoc,
          lang,
        }) || '';
    } catch (error) {
      sendLog({ err: error, message: `viennaConcert getBaseLangDoc failed` });
    }
  } else {
    venueHomePageUid = `${pageUrlObject.host}.${pathArray[0]}`;
  }

  if (!venueHomePageUid) return {};

  breadcrumbs[`level_2`] = {
    level: 2,
    label: VENUE_PAGE_HOME,
    url: convertUidToUrl({
      uid: venueHomePageUid,
      lang: headoutLanguagecode,
    }),
  };

  breadcrumbs[`level_3`] = {
    level: 3,
    label: theatreName,
    url: pageUrl,
  };

  return breadcrumbs;
};

export const getNewsPageBreadcrumbs = async (doc: PrismicDocumentWithUID) => {
  const { data } = doc || {};
  const { tgid } = data || {};

  if (tgid) {
    return getTgidBasedNewsPageBreadcrumbs(doc);
  } else return getNonTgidBasedNewsPageBreadcrumbs(doc);
};

export const getTgidBasedNewsPageBreadcrumbs = async (
  doc: PrismicDocumentWithUID
) => {
  const { uid, lang, data } = doc || {};
  const { tgid, heading } = data || {};

  const isLTT = checkIfLTTMB(uid);
  const isBroadway = checkIfBroadwayMB(uid);

  if (!isLTT && !isBroadway) return {};

  let breadcrumbs: TBreadcrumbs = {};
  const headoutLanguagecode = getHeadoutLanguagecode(lang);
  const { primarySubCategory = '', name = '' } = tgid
    ? (await fetchTourGroupV6({
        tgid,
        language: headoutLanguagecode,
      })) || {}
    : {};

  const prismicClient = createClient();

  const showPageDocument = await prismicClient.getByType('showpage', {
    predicates: [
      predicate.any(`my.${CUSTOM_TYPES.SHOW_PAGE}.${PRISMIC_FIELD_ID.TGID}`, [
        tgid,
      ]),
    ],
  });

  const showPageUid = showPageDocument?.results?.[0]?.uid;
  const localisedShowPageUrl = convertUidToUrl({
    uid: showPageUid,
    lang: headoutLanguagecode,
  });
  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const { displayName: localisedSubCategoryName } = primarySubCategory;

  const { HOME } = getEntMBLabels({
    isLTT,
    isBroadway,
  });

  breadcrumbs[`level_1`] = {
    level: 1,
    label: HOME,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };

  breadcrumbs[`level_2`] = {
    level: 2,
    label: localisedSubCategoryName,
    url: convertUidToUrl({
      uid: getShowpageBreadcrumbUid(localisedSubCategoryName, isLTT || false),
      lang: headoutLanguagecode,
    }),
  };

  breadcrumbs[`level_3`] = {
    level: 3,
    label: name,
    url: localisedShowPageUrl,
  };

  breadcrumbs[`level_4`] = {
    level: 4,
    label: heading,
    url: pageUrl,
  };

  return breadcrumbs;
};

export const getNonTgidBasedNewsPageBreadcrumbs = async (
  doc: PrismicDocumentWithUID
) => {
  const { uid, lang, data } = doc;
  const { heading, is_landing_page: isLandingPage } = data;

  const isLTT = checkIfLTTMB(uid);
  const isBroadway = checkIfBroadwayMB(uid);

  if (!isLTT && !isBroadway) return {};

  let breadcrumbs: TBreadcrumbs = {};
  const headoutLanguagecode = getHeadoutLanguagecode(lang);

  const pageUrl = convertUidToUrl({
    uid,
    lang: headoutLanguagecode,
  });
  const pageUrlObject = new URL(pageUrl);
  const pathArray = getSanitizedPathArray(pageUrlObject);

  const { HOME } = getEntMBLabels({
    isLTT,
    isBroadway,
  });

  breadcrumbs[`level_1`] = {
    level: 1,
    label: HOME,
    url: convertUidToUrl({
      uid: pageUrlObject.host,
      lang: headoutLanguagecode,
    }),
  };

  breadcrumbs[`level_2`] = {
    level: 2,
    label: isLTT ? LONDON_THEATRE_NEWS : BROADWAY_SHOW_NEWS,
    url: convertUidToUrl({
      uid: `${pageUrlObject.host}.${pathArray[0]}`,
      lang: headoutLanguagecode,
    }),
  };

  breadcrumbs[`level_3`] = {
    level: 3,
    label: heading,
    url: pageUrl,
  };

  if (isLandingPage) {
    delete breadcrumbs.level_3;
  }

  return breadcrumbs;
};
