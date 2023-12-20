import type { PrismicDocumentWithUID } from '@prismicio/types';
import shouldIncludeinQueries from './shouldIncludeInQueries';
import { getMenuUrl } from '.';

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
            menuItem.label.toLowerCase() && shouldIncludeinQueries(doc)
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

export default generateCityGuideMenu;
