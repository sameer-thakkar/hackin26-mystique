import type { PrismicDocumentWithUID } from '@prismicio/types';
import cloneDeep from 'lodash.clonedeep';
import { TMenuItem } from 'components/CategoryHeader/interface';
import { getAlternateLanguageDocUid, getHeadoutLanguagecode } from 'utils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { addToNestedObject, sortObjectByKeys } from 'utils/gen';
import { constantCase } from 'utils/stringUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  COLLECTION_MB_MENU_ORDER,
  labels,
  MISC,
  NESTED_MENU_ORDER,
  NON_COLLECTION_MB_MENU_ORDER,
} from 'const/header';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
} from 'const/index';
import getAlternateLanguageDocs from '../prismicUtils/getAlternateLanguageDocs';
import generateThemesMenu from './generateThemesMenu';
import shouldIncludeinQueries from './shouldIncludeInQueries';

export const getMenuUrl = ({
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

export const getMenuName = ({
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

export const isMainMenu = ({
  isCollectionMB,
  isA1CollectionMB,
  isA2MB,
  menuLabel,
  menu,
}: {
  isCollectionMB?: boolean;
  isA1CollectionMB?: boolean;
  isA2MB?: boolean;
  menuLabel: string;
  menu: Record<string, any>;
}) => {
  if (isCollectionMB && isA1CollectionMB) {
    return (
      menuLabel === 'ABOUT' ||
      menuLabel === 'VISIT' ||
      (menuLabel === 'THINGS_TO_DO' && Object.keys(menu).length >= 5) ||
      menuLabel === 'CITY_ATTRACTIONS' ||
      menuLabel === 'CITY_GUIDE'
    );
  } else if (isCollectionMB && !isA1CollectionMB) {
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

export const addMiscMenuItems = async ({
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
    if (customLabel && shouldIncludeinQueries(doc)) {
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

export const getSubCategoriesData = ({
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

export const applyTransformations = (menu: Record<string, any>) => {
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

export const sortMenu = ({
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
