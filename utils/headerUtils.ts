import { Client } from 'config/prismic-config';
import Prismic from 'prismic-javascript';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import cloneDeep from 'lodash.clonedeep';
import { TMenuItem } from 'components/CategoryHeader/interface';
import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';
import {
  getEnglishDocUid,
  getAlternateLanguageDocUid,
  getHeadoutLanguagecode,
  legacyBooleanCheck,
  handleSettledPromiseResults,
} from 'utils';
import {
  fetchCollection,
  fetchCollectionTop,
  fetchCategory,
} from 'utils/apiUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import { getStructure } from 'utils/lookerUtils';
import {
  getShoulderPageDocs,
  getCityGuideDocs,
  getAlternateLanguageDocs,
} from 'utils/prismicUtils';
import { constantCase } from 'utils/stringUtils';
import { addToNestedObject, sortObjectByKeys } from 'utils/gen';
import { trackEvent, getCommonEventMetaData } from 'utils/analytics';
import {
  CUSTOM_TYPES,
  PAGE_URL_STRUCTURE,
  SEO_SUBDOMAINS,
  MB_CATEGORISATION,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRISMIC_FIELD_ID,
  LANGUAGE_MAP,
} from 'const/index';
import {
  SUB_ATTRACTIONS,
  MISC,
  ABOUT,
  VISIT,
  THINGS_TO_DO,
  CITY_GUIDE,
  DOCUMENT_PRIORITY,
  COLLECTION_MB_MENU_ORDER,
  NON_COLLECTION_MB_MENU_ORDER,
  NESTED_MENU_ORDER,
  labels,
} from 'const/header';

export type TCategorisationMetadata = {
  tagged_category: string | null;
  tagged_city: string | null;
  tagged_collection: string | null;
  tagged_content_type: Object[] | [];
  tagged_country: string | null;
  tagged_mb_type: string | null;
  tagged_page_type: string | null;
  tagged_sub_category: string | null;
  shoulder_page_type: string | null;
};

type TCategoryApiData = {
  categories: Record<string, any>[];
  starredCategoriesAndSubCategories: Record<string, any>[];
  city: string | null;
};

export const getRankedDocuments = (
  docs: PrismicDocumentWithUID[]
): PrismicDocumentWithUID[] => {
  return docs.sort(
    (docA, docB) =>
      DOCUMENT_PRIORITY.indexOf(docA?.data?.tagged_mb_type) -
      DOCUMENT_PRIORITY.indexOf(docB?.data?.tagged_mb_type)
  );
};

const shouldIncludeinMenu = (doc: PrismicDocumentWithUID) => {
  const { uid, lang, data } = doc || {};
  const { noindex, redirect_url, canonical_link } = data || {};
  const pageUrl = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });
  const isSelfCanonical = !canonical_link || pageUrl === canonical_link;

  if (!pageUrl || !!redirect_url?.url || !isSelfCanonical) return false;

  const url = new URL(pageUrl);
  const isSubdomain =
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN ||
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN_SUBFOLDER;
  const parentDomainUrl = convertUidToUrl({
    uid: url.hostname,
    lang: getHeadoutLanguagecode(lang),
  });
  const isSeoSubdomain =
    SEO_SUBDOMAINS.includes(pageUrl) ||
    SEO_SUBDOMAINS.includes(parentDomainUrl);

  const finalNoIndex =
    isSubdomain && !isSeoSubdomain ? true : legacyBooleanCheck(noindex);

  return !finalNoIndex;
};

const getMenuUrl = ({
  docFound,
  lang,
}: {
  docFound: PrismicDocumentWithUID;
  lang: string;
}) => {
  return convertUidToUrl({
    uid:
      lang === LANGUAGE_MAP.en.locale
        ? docFound.uid
        : getAlternateLanguageDocUid({ doc: docFound, lang }) || '',
    lang: getHeadoutLanguagecode(lang),
  });
};

const getMenuName = ({
  mbType,
  parentCategory,
}: {
  mbType?: string | null;
  parentCategory?: string;
}): string => {
  switch (true) {
    case parentCategory === MB_CATEGORISATION.CATEGORY.TOURS:
      return `CITY_TOURS`;
    case parentCategory === MB_CATEGORISATION.CATEGORY.TICKETS:
      return 'ATTRACTIONS';
    case parentCategory === MB_CATEGORISATION.CATEGORY.CRUISES:
      return 'CRUISES';
    case mbType === MB_CATEGORISATION.MB_TYPE.C1_COLLECTION ||
      mbType === MB_CATEGORISATION.MB_TYPE.A1_COLLECTION ||
      mbType === MB_CATEGORISATION.MB_TYPE.A2_CATEGORY ||
      mbType === MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY:
      return `CITY_ATTRACTIONS`;
    default:
      return `TOP_THINGS_TO_DO`;
  }
};

const isMainMenu = ({
  isCollectionMB,
  isA2MB,
  menuLabel,
  menu,
}: {
  isCollectionMB?: boolean;
  isA2MB?: boolean;
  menuLabel: string;
  menu: Record<string, any>;
}) => {
  if (isCollectionMB) {
    return (
      menuLabel === 'ABOUT' ||
      menuLabel === 'VISIT' ||
      (menuLabel === 'THINGS_TO_DO' && Object.keys(menu).length >= 5) ||
      menuLabel === 'CITY_ATTRACTIONS'
    );
  } else if (isA2MB) {
    return (
      menuLabel === 'ABOUT' ||
      menuLabel === 'VISIT' ||
      (menuLabel === 'THINGS_TO_DO' && Object.keys(menu).length >= 5) ||
      menuLabel === 'CITY_ATTRACTIONS' ||
      menuLabel === 'CITY_GUIDE'
    );
  } else {
    return (
      menuLabel === 'TOP_THINGS_TO_DO' ||
      menuLabel === 'CITY_TOURS' ||
      menuLabel === 'CITY_GUIDE'
    );
  }
};

const generateAboutMenuItem = async ({
  docsStore,
  lang,
  categorisationMetadata,
}: {
  docsStore: PrismicDocumentWithUID[];
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}) => {
  const menu: Record<string, TMenu> = {};
  const { tagged_collection } = categorisationMetadata;

  const docFound = docsStore.find(
    (doc) =>
      doc?.data?.shoulder_page_type === ABOUT.ABOUT.label &&
      shouldIncludeinMenu(doc)
  );

  if (docFound) {
    let collectionHeading;
    if (tagged_collection) {
      const { collection: collectionData } =
        (await fetchCollection({
          collectionId: tagged_collection,
          language: getHeadoutLanguagecode(lang),
        })) || {};
      collectionHeading = collectionData?.heading;
    }

    let shoulderPageLabelOverride;
    if (lang !== LANGUAGE_MAP.en.locale) {
      const alternateLanguageDocs = await getAlternateLanguageDocs({
        baseLangDocs: [docFound],
        lang,
      });
      shoulderPageLabelOverride =
        alternateLanguageDocs?.[0]?.data?.shoulder_page_custom_label;
    } else {
      shoulderPageLabelOverride = docFound?.data?.shoulder_page_custom_label;
    }

    const finalLabel = shoulderPageLabelOverride || collectionHeading;
    const url = getMenuUrl({ docFound, lang });

    if (finalLabel && url) {
      menu['ABOUT'] = {
        label: finalLabel,
        url,
      };
    }
  }

  return menu;
};

const generateSubAttractionsMenu = async ({
  docsStore,
  lang,
}: {
  docsStore: PrismicDocumentWithUID[];
  lang: string;
}): Promise<Record<string, any>> => {
  let subAttractionsDocs;
  const baseLangSubAttractionsDocs = docsStore.filter(
    (doc) => doc?.data?.shoulder_page_type === SUB_ATTRACTIONS
  );

  if (lang === LANGUAGE_MAP.en.locale) {
    subAttractionsDocs = baseLangSubAttractionsDocs;
  } else {
    subAttractionsDocs = await getAlternateLanguageDocs({
      baseLangDocs: baseLangSubAttractionsDocs,
      lang,
    });
  }

  const map = new Map();
  subAttractionsDocs.forEach((doc) => {
    const { uid, data } = doc;
    const { shoulder_page_custom_label: customLabel } = data || {};
    if (customLabel && !map.has(customLabel) && shouldIncludeinMenu(doc)) {
      const data = {
        label: customLabel,
        url: convertUidToUrl({
          uid,
          lang: getHeadoutLanguagecode(lang),
        }),
      };
      map.set(customLabel, data);
    }
  });

  const menu = Object.fromEntries(map);

  return menu;
};

const addMiscMenuItems = async ({
  menu,
  docsStore,
  lang,
}: {
  menu: Record<string, any>;
  docsStore: PrismicDocumentWithUID[];
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}): Promise<Record<string, any>> => {
  let miscDocs;
  const baseLangMiscDocs = docsStore.filter(
    (doc) => doc?.data?.shoulder_page_type === MISC
  );

  if (lang === LANGUAGE_MAP.en.locale) {
    miscDocs = baseLangMiscDocs;
  } else {
    miscDocs = await getAlternateLanguageDocs({
      baseLangDocs: baseLangMiscDocs,
      lang,
    });
  }

  miscDocs.forEach((doc) => {
    const { uid, data } = doc;
    const {
      shoulder_page_custom_label: customLabel,
      misc_page_mapping: menuMapping,
    } = data || {};
    const finalMenuMapping = menuMapping || labels.ABOUT;
    if (customLabel && shouldIncludeinMenu(doc)) {
      const data = {
        label: customLabel,
        url: convertUidToUrl({
          uid,
          lang: getHeadoutLanguagecode(lang),
        }),
      };
      addToNestedObject(menu, finalMenuMapping, data);
    }
  });

  return menu;
};

const generateShoulderPageMenu = async ({
  isAboutMenu = false,
  menuType,
  categorisationMetadata,
  lang,
  docsStore,
}: {
  isAboutMenu?: boolean;
  menuType: Record<string, any>;
  categorisationMetadata: TCategorisationMetadata;
  lang: string;
  docsStore: PrismicDocumentWithUID[];
}): Promise<Record<string, any>> => {
  const { tagged_mb_type: mbType } = categorisationMetadata;

  let menu: Record<string, any> = {};

  Object.keys(menuType).forEach(async (key) => {
    const menuItem = menuType[key];
    if (typeof menuItem?.children === 'object') {
      menu[key] = await generateShoulderPageMenu({
        menuType: menuItem.children,
        categorisationMetadata,
        lang,
        docsStore,
      });
    } else if (menuItem.types.includes(mbType)) {
      const docFound = docsStore.find(
        (doc) =>
          doc?.data?.shoulder_page_type?.toLowerCase() ===
            menuItem.label.toLowerCase() && shouldIncludeinMenu(doc)
      );
      if (docFound) {
        const url = getMenuUrl({ docFound, lang });
        if (key && url) {
          menu[key] = {
            label: key,
            url,
          };
        }
      }
    }
  });

  if (isAboutMenu) {
    const aboutPage = await generateAboutMenuItem({
      docsStore,
      lang,
      categorisationMetadata,
    });
    const subAttractionsPages = await generateSubAttractionsMenu({
      docsStore,
      lang,
    });

    menu['ABOUT'] = {
      ...aboutPage,
      ...subAttractionsPages,
      ...menu['ABOUT'],
    };
  }

  return menu;
};

const generateCityAttractionsMenu = async ({
  categorisationMetadata,
  lang,
}: {
  categorisationMetadata: TCategorisationMetadata;
  lang: string;
}): Promise<Record<string, any>> => {
  const {
    tagged_city: mbCity,
    tagged_collection: mbCollection,
    tagged_mb_type: mbType,
  } = categorisationMetadata;
  const menuName = getMenuName({ mbType });

  if (!mbCity) return { [menuName]: {} };

  const { pageData: topCollectionsData } =
    (await fetchCollectionTop({
      city: mbCity || '',
      limit: 20,
      language: getHeadoutLanguagecode(lang),
    })) || {};

  const topCollectionsIds = topCollectionsData?.items?.map(
    (collection: Record<string, any>) => collection.id.toString()
  );

  if (!topCollectionsIds) return { [menuName]: {} };

  const { results: filteredMicrosites } =
    (await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, ['[DEV]']),
        mbCollection &&
          Prismic.Predicates.not(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
            mbCollection
          ),
        mbCity &&
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
            mbCity
          ),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
          MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
        ),
        Prismic.Predicates.any(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
          topCollectionsIds || []
        ),
      ],
      { pageSize: 100 }
    )) || {};

  const docsStore = getRankedDocuments(filteredMicrosites);

  const menu = topCollectionsData?.items?.reduce(
    (
      acc: Record<string, any>,
      collection: Record<string, any>,
      index: number
    ) => {
      const docFound = docsStore?.find(
        (doc) =>
          collection?.id?.toString() === doc?.data?.tagged_collection &&
          shouldIncludeinMenu(doc)
      );

      if (docFound) {
        const url = getMenuUrl({ docFound, lang });
        if (collection.displayName && url) {
          return {
            ...acc,
            [`COLLECTION_${index + 1}`]: {
              label: collection.displayName,
              url,
            },
          };
        }
      }
      return acc;
    },
    {}
  );

  return { [menuName]: menu };
};

const getSubCategoriesData = ({
  categoriesData,
  parentCategory,
}: {
  categoriesData: Record<string, any>[];
  parentCategory: string;
}): Record<string, Record<string, string>> => {
  const parentCategoryData = categoriesData.find(
    (cat: Record<string, any>) => cat.name === parentCategory
  );
  const subCategoryData =
    parentCategoryData?.subCategories?.reduce(
      (
        acc: Record<string, Record<string, string>>,
        subcat: Record<string, any>
      ) => {
        const { name, displayName } = subcat;
        const constantCasedSubCatName = constantCase(name);
        acc[constantCasedSubCatName] = {
          baseLangName: name,
          label: displayName,
        };
        return acc;
      },
      {}
    ) || {};

  return subCategoryData;
};

const generateSubCategoryMenu = async ({
  parentCategory,
  categorisationMetadata,
  categoryApiData,
  lang,
}: {
  parentCategory: string;
  categorisationMetadata: TCategorisationMetadata;
  categoryApiData: TCategoryApiData;
  lang: string;
}): Promise<Record<string, any>> => {
  const { tagged_city: mbCity } = categorisationMetadata;

  const subCategories = getSubCategoriesData({
    categoriesData: categoryApiData.categories,
    parentCategory,
  });
  const subCategoriesArray = Object.values(subCategories).reduce(
    (acc: string[], subcat: Record<string, string>) => {
      acc.push(subcat.baseLangName);
      return acc;
    },
    []
  );

  const { results: filteredMicrosites } =
    (await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, ['[DEV]']),
        mbCity &&
          Prismic.Predicates.at(
            `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
            mbCity
          ),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
          MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
        ),
        Prismic.Predicates.any(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_MB_TYPE}`,
          [
            MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
            MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
            MB_CATEGORISATION.MB_TYPE.B1_GLOBAL,
            MB_CATEGORISATION.MB_TYPE.B1_GLOBAL_HOMEPAGE,
          ]
        ),
        Prismic.Predicates.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
          parentCategory
        ),
        Prismic.Predicates.any(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_SUB_CATEGORY}`,
          subCategoriesArray
        ),
      ],
      { pageSize: 100 }
    )) || {};

  const docsStore = getRankedDocuments(filteredMicrosites);

  const menu = Object.keys(subCategories).reduce((acc, subcat) => {
    const subCategoryData = subCategories[subcat as keyof typeof subCategories];
    const { baseLangName, label } = subCategoryData;

    const docFound = docsStore?.find(
      (doc) =>
        baseLangName === doc?.data?.tagged_sub_category &&
        shouldIncludeinMenu(doc)
    );

    if (docFound) {
      const url = getMenuUrl({ docFound, lang });
      if (label && url) {
        return {
          ...acc,
          [subcat]: {
            label,
            url,
          },
        };
      }
    }
    return acc;
  }, {});

  const menuName = getMenuName({ parentCategory });

  return { [menuName]: menu };
};

const generateCityGuideMenu = ({
  menuType,
  categorisationMetadata,
  lang,
  docsStore,
}: {
  menuType: Record<string, any>;
  categorisationMetadata: TCategorisationMetadata;
  lang: string;
  docsStore: PrismicDocumentWithUID[];
}) => {
  let menu: Record<string, any> = {};

  Object.keys(menuType).forEach((key) => {
    const menuItem = menuType[key as keyof typeof menuType];

    if (typeof menuItem?.children === 'object') {
      const subMenu = generateCityGuideMenu({
        menuType: menuItem.children,
        categorisationMetadata,
        lang,
        docsStore,
      });
      if (Object.keys(subMenu).length > 0) {
        menu[key] = subMenu;
      }
    } else {
      const docFound = docsStore.find(
        (doc) =>
          doc?.data?.primary_tag?.toLowerCase() ===
            menuItem.label.toLowerCase() && shouldIncludeinMenu(doc)
      );
      if (docFound) {
        const url = getMenuUrl({ docFound, lang });
        if (key && url) {
          menu[key] = {
            label: key,
            url,
          };
        }
      }
    }
  });

  return menu;
};

const generateThemesMenu = (menu: Record<string, any>): Record<string, any> => {
  const {
    CITY_TOURS: cityToursMenu = {},
    CRUISES: cruisesMenu = {},
    ATTRACTIONS: attractionsMenu = {},
  } = menu;
  if (
    Object.keys(cityToursMenu).length +
      Object.keys(cruisesMenu).length +
      Object.keys(attractionsMenu).length <
    5
  ) {
    menu[`THEMES`] = {
      ...cityToursMenu,
      ...cruisesMenu,
      ...attractionsMenu,
    };
    delete menu?.CITY_TOURS;
    delete menu?.CRUISES;
    delete menu?.ATTRACTIONS;
  }

  return menu;
};

const applyTransformations = (menu: Record<string, any>) => {
  const {
    ABOUT: aboutMenu = {},
    VISIT: visitMenu = {},
    THINGS_TO_DO: thingsToDoMenu = {},
  } = menu;

  if (Object.keys(thingsToDoMenu).length < 4) {
    menu['ABOUT'] = {
      ...aboutMenu,
      ...thingsToDoMenu,
    };
    delete menu?.THINGS_TO_DO;
  }

  if (
    Object.keys(aboutMenu).length +
      Object.keys(visitMenu).length +
      Object.keys(thingsToDoMenu).length <
    6
  ) {
    menu['ABOUT'] = {
      ...aboutMenu,
      ...visitMenu,
      ...thingsToDoMenu,
    };
    delete menu?.VISIT;
    delete menu?.THINGS_TO_DO;
  }

  const themesMenuAdded = generateThemesMenu(cloneDeep(menu));

  return themesMenuAdded;
};

const sortMenu = ({
  menuObject,
  isCollectionMB,
  isA2MB,
}: {
  menuObject: Record<string, any>;
  isCollectionMB?: boolean;
  isA2MB?: boolean;
}) => {
  Object.values(menuObject).forEach((parentMenu: TMenuItem) => {
    if (
      NESTED_MENU_ORDER[parentMenu.label as keyof typeof NESTED_MENU_ORDER]
        ?.length > 0
    ) {
      parentMenu['menu'] = sortObjectByKeys({
        obj: parentMenu['menu'],
        order:
          NESTED_MENU_ORDER[parentMenu.label as keyof typeof NESTED_MENU_ORDER],
      });
    }
  });

  return sortObjectByKeys({
    obj: menuObject,
    order:
      isCollectionMB || isA2MB
        ? COLLECTION_MB_MENU_ORDER
        : NON_COLLECTION_MB_MENU_ORDER,
  });
};

const getCollectionMBMenu = async ({
  lang,
  categorisationMetadata,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}): Promise<Record<string, any>> => {
  const shoulderPageDocs = await getShoulderPageDocs({
    categorisationMetadata,
  });

  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const aboutMenuPromise = generateShoulderPageMenu({
    isAboutMenu: true,
    menuType: ABOUT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const visitMenuPromise = generateShoulderPageMenu({
    menuType: VISIT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const thingsToDoMenuPromise = generateShoulderPageMenu({
    menuType: THINGS_TO_DO,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const cityAttractionsMenuPromise = generateCityAttractionsMenu({
    categorisationMetadata,
    lang,
  });

  const cityToursMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TOURS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cruisesMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.CRUISES,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const menuPromiseSettledResults = await Promise.allSettled([
    aboutMenuPromise,
    visitMenuPromise,
    thingsToDoMenuPromise,
    cityAttractionsMenuPromise,
    cityToursMenuPromise,
    cruisesMenuPromise,
  ]);

  const [
    aboutMenu,
    visitMenu,
    thingsToDoMenu,
    cityAttractionsMenu,
    cityToursMenu,
    cruisesMenu,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...aboutMenu,
    ...visitMenu,
    ...thingsToDoMenu,
    ...cityAttractionsMenu,
    ...cityToursMenu,
    ...cruisesMenu,
  };

  const menuWithMiscItems = await addMiscMenuItems({
    menu: cloneDeep(aggregatedMenu),
    docsStore: shoulderPageDocs,
    lang,
    categorisationMetadata,
  });

  const transformedMenu = applyTransformations(cloneDeep(menuWithMiscItems));

  Object.keys(transformedMenu).forEach((menuKey) => {
    if (Object.keys(transformedMenu[menuKey]).length === 0) {
      delete transformedMenu[menuKey];
    }
    if (typeof transformedMenu[menuKey] === 'object') {
      const something = transformedMenu[menuKey];
      transformedMenu[menuKey] = {
        label: menuKey,
        menu: something,
        mainMenu: isMainMenu({
          isCollectionMB: true,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isCollectionMB: true,
  });

  return finalMenu;
};

const getNonCollectionMBMenu = async ({
  lang,
  categorisationMetadata,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}): Promise<Record<string, any>> => {
  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const cityGuideDocs = await getCityGuideDocs(categorisationMetadata);

  const topThingsToDoMenuPromise = generateCityAttractionsMenu({
    categorisationMetadata,
    lang,
  });

  const cityToursMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TOURS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cityGuideMenuPromise = generateCityGuideMenu({
    menuType: CITY_GUIDE,
    categorisationMetadata,
    lang,
    docsStore: cityGuideDocs,
  });

  const attractionsMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TICKETS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cruisesMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.CRUISES,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const menuPromiseSettledResults = await Promise.allSettled([
    topThingsToDoMenuPromise,
    cityToursMenuPromise,
    cityGuideMenuPromise,
    attractionsMenuPromise,
    cruisesMenuPromise,
  ]);

  const [
    topThingsToDoMenu,
    cityToursMenu,
    cityGuideMenu,
    attractionsMenu,
    cruisesMenu,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...topThingsToDoMenu,
    ...cityToursMenu,
    ...cityGuideMenu,
    ...attractionsMenu,
    ...cruisesMenu,
  };

  const miscShoulderPageDocs = await getShoulderPageDocs({
    categorisationMetadata,
    filterMiscDocs: true,
    lang,
  });

  const menuWithMiscItems = await addMiscMenuItems({
    menu: cloneDeep(aggregatedMenu),
    docsStore: miscShoulderPageDocs,
    lang,
    categorisationMetadata,
  });

  const transformedMenu = applyTransformations(cloneDeep(menuWithMiscItems));

  Object.keys(transformedMenu).forEach((menuKey) => {
    if (Object.keys(transformedMenu[menuKey]).length === 0) {
      delete transformedMenu[menuKey];
    }
    if (typeof transformedMenu[menuKey] === 'object') {
      const something = transformedMenu[menuKey];
      transformedMenu[menuKey] = {
        label: menuKey,
        menu: something,
        mainMenu: isMainMenu({
          isCollectionMB: false,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isCollectionMB: false,
  });

  return finalMenu;
};

const getA2CatMBMenu = async ({
  lang,
  categorisationMetadata,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}): Promise<Record<string, any>> => {
  const shoulderPageDocs = await getShoulderPageDocs({
    categorisationMetadata,
    isA2CatMB: true,
  });
  const cityGuideDocs = await getCityGuideDocs(categorisationMetadata);

  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const aboutMenuPromise = generateShoulderPageMenu({
    isAboutMenu: true,
    menuType: ABOUT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const visitMenuPromise = generateShoulderPageMenu({
    menuType: VISIT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const thingsToDoMenuPromise = generateShoulderPageMenu({
    menuType: THINGS_TO_DO,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const cityAttractionsMenuPromise = generateCityAttractionsMenu({
    categorisationMetadata,
    lang,
  });

  const cityToursMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TOURS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cityGuideMenuPromise = generateCityGuideMenu({
    menuType: CITY_GUIDE,
    categorisationMetadata,
    lang,
    docsStore: cityGuideDocs,
  });

  const menuPromiseSettledResults = await Promise.allSettled([
    aboutMenuPromise,
    visitMenuPromise,
    thingsToDoMenuPromise,
    cityAttractionsMenuPromise,
    cityToursMenuPromise,
    cityGuideMenuPromise,
  ]);

  const [
    aboutMenu,
    visitMenu,
    thingsToDoMenu,
    cityAttractionsMenu,
    cityToursMenu,
    cityGuideMenu,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...aboutMenu,
    ...visitMenu,
    ...thingsToDoMenu,
    ...cityAttractionsMenu,
    ...cityToursMenu,
    ...cityGuideMenu,
  };

  const menuWithMiscItems = await addMiscMenuItems({
    menu: cloneDeep(aggregatedMenu),
    docsStore: shoulderPageDocs,
    lang,
    categorisationMetadata,
  });

  const transformedMenu = applyTransformations(cloneDeep(menuWithMiscItems));

  Object.keys(transformedMenu).forEach((menuKey) => {
    if (Object.keys(transformedMenu[menuKey]).length === 0) {
      delete transformedMenu[menuKey];
    }
    if (typeof transformedMenu[menuKey] === 'object') {
      const something = transformedMenu[menuKey];
      transformedMenu[menuKey] = {
        label: menuKey,
        menu: something,
        mainMenu: isMainMenu({
          isA2MB: true,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isA2MB: true,
  });

  return finalMenu;
};

const getA2SubcatMBMenu = async ({
  lang,
  categorisationMetadata,
}: {
  lang: string;
  categorisationMetadata: TCategorisationMetadata;
}): Promise<Record<string, any>> => {
  const shoulderPageDocs = await getShoulderPageDocs({
    categorisationMetadata,
    isA2SubcatMB: true,
  });
  const cityGuideDocs = await getCityGuideDocs(categorisationMetadata);

  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
  });

  const aboutMenuPromise = generateShoulderPageMenu({
    isAboutMenu: true,
    menuType: ABOUT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const visitMenuPromise = generateShoulderPageMenu({
    menuType: VISIT,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const thingsToDoMenuPromise = generateShoulderPageMenu({
    menuType: THINGS_TO_DO,
    categorisationMetadata,
    lang,
    docsStore: shoulderPageDocs,
  });

  const cityAttractionsMenuPromise = generateCityAttractionsMenu({
    categorisationMetadata,
    lang,
  });

  const cityToursMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.TOURS,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cruisesMenuPromise = generateSubCategoryMenu({
    parentCategory: MB_CATEGORISATION.CATEGORY.CRUISES,
    categorisationMetadata,
    categoryApiData,
    lang,
  });

  const cityGuideMenuPromise = generateCityGuideMenu({
    menuType: CITY_GUIDE,
    categorisationMetadata,
    lang,
    docsStore: cityGuideDocs,
  });

  const menuPromiseSettledResults = await Promise.allSettled([
    aboutMenuPromise,
    visitMenuPromise,
    thingsToDoMenuPromise,
    cityAttractionsMenuPromise,
    cityToursMenuPromise,
    cruisesMenuPromise,
    cityGuideMenuPromise,
  ]);

  const [
    aboutMenu,
    visitMenu,
    thingsToDoMenu,
    cityAttractionsMenu,
    cityToursMenu,
    cruisesMenu,
    cityGuideMenu,
  ] = handleSettledPromiseResults(menuPromiseSettledResults);

  const aggregatedMenu = {
    ...aboutMenu,
    ...visitMenu,
    ...thingsToDoMenu,
    ...cityAttractionsMenu,
    ...cityToursMenu,
    ...cruisesMenu,
    ...cityGuideMenu,
  };

  const menuWithMiscItems = await addMiscMenuItems({
    menu: cloneDeep(aggregatedMenu),
    docsStore: shoulderPageDocs,
    lang,
    categorisationMetadata,
  });

  const transformedMenu = applyTransformations(cloneDeep(menuWithMiscItems));

  Object.keys(transformedMenu).forEach((menuKey) => {
    if (Object.keys(transformedMenu[menuKey]).length === 0) {
      delete transformedMenu[menuKey];
    }
    if (typeof transformedMenu[menuKey] === 'object') {
      const something = transformedMenu[menuKey];
      transformedMenu[menuKey] = {
        label: menuKey,
        menu: something,
        mainMenu: isMainMenu({
          isA2MB: true,
          menuLabel: menuKey,
          menu: something,
        }),
      };
    }
  });

  const finalMenu = sortMenu({
    menuObject: cloneDeep(transformedMenu),
    isA2MB: true,
  });

  return finalMenu;
};

export const getCategoryHeaderMenu = async (doc: PrismicDocumentWithUID) => {
  const { uid, lang, alternate_languages, data } = doc || {};

  const baseLangUid = getEnglishDocUid(alternate_languages);
  const baseLangData =
    lang !== LANGUAGE_MAP.en.locale
      ? await Client()
          .getByUID(CUSTOM_TYPES.MICROSITE, baseLangUid || uid, {
            lang: LANGUAGE_MAP.en.locale,
          })
          .then((res: PrismicDocumentWithUID) => res.data)
      : data;

  const {
    tagged_category,
    tagged_city,
    tagged_collection,
    tagged_content_type,
    tagged_country,
    tagged_mb_type,
    tagged_page_type,
    tagged_sub_category,
    shoulder_page_type,
  } = baseLangData || {};

  const categorisationMetadata = {
    tagged_category,
    tagged_city,
    tagged_collection,
    tagged_content_type,
    tagged_country,
    tagged_mb_type,
    tagged_page_type,
    tagged_sub_category,
    shoulder_page_type,
  };

  let categoryHeaderMenu: Record<string, any>;

  switch (tagged_mb_type) {
    case MB_CATEGORISATION.MB_TYPE.A1_COLLECTION:
    case MB_CATEGORISATION.MB_TYPE.C1_COLLECTION:
      categoryHeaderMenu = await getCollectionMBMenu({
        lang,
        categorisationMetadata,
      });
      break;
    case MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE:
    case MB_CATEGORISATION.MB_TYPE.A1_CATEGORY:
    case MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY:
    case MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE:
      categoryHeaderMenu = await getNonCollectionMBMenu({
        lang,
        categorisationMetadata,
      });
      break;
    case MB_CATEGORISATION.MB_TYPE.A2_CATEGORY:
      categoryHeaderMenu = await getA2CatMBMenu({
        lang,
        categorisationMetadata,
      });
      break;
    case MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY:
      categoryHeaderMenu = await getA2SubcatMBMenu({
        lang,
        categorisationMetadata,
      });
      break;
    default:
      categoryHeaderMenu = {};
  }

  return categoryHeaderMenu;
};

export const trackHeaderMenuItemClicked = ({
  eventTarget,
  label,
  level,
  pageMetaData,
}: {
  eventTarget: EventTarget;
  label: string;
  level: number;
  pageMetaData: Record<string, any>;
}) => {
  const { parentNode } = eventTarget as HTMLAnchorElement;
  let ranking = 0;
  if (parentNode && parentNode.parentNode) {
    const grandParentNode = parentNode.parentNode;
    const parentElements = grandParentNode.children;
    const filteredParentListItems = Array.prototype.filter.call(
      parentElements,
      (elem: HTMLElement) =>
        elem.tagName === 'LI' && !elem.className.includes('main-menu')
    );
    ranking =
      Array.prototype.indexOf.call(filteredParentListItems, parentNode) + 1;
  }

  trackEvent({
    eventName: ANALYTICS_EVENTS.DROPDOWN_OPTION_SELECTED,
    [ANALYTICS_PROPERTIES.OPTION_TEXT]: label,
    [ANALYTICS_PROPERTIES.RANKING]: ranking,
    [ANALYTICS_PROPERTIES.LEVEL]: level,
    ...getCommonEventMetaData(pageMetaData),
  });
};
