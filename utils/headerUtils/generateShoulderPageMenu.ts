import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getMenuUrl } from 'utils/headerUtils';
import generateAboutMenuItem from './generateAboutMenuItem';
import generateSubAttractionsMenu from './generateSubAttractionsMenu';
import shouldIncludeinQueries from './shouldIncludeInQueries';

const generateShoulderPageMenu = async ({
  isAboutMenu = false,
  menuType,
  categorisationMetadata,
  lang,
  shoulderPageDocsStore,
  subattractionPageDocsStore = [],
}: {
  isAboutMenu?: boolean;
  menuType: Record<string, any>;
  categorisationMetadata: TCategorisationMetadata;
  lang: string;
  shoulderPageDocsStore: PrismicDocumentWithUID[];
  subattractionPageDocsStore?: PrismicDocumentWithUID[];
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
        shoulderPageDocsStore,
        subattractionPageDocsStore,
      });
    } else if (menuItem.types.includes(mbType)) {
      const docFound = shoulderPageDocsStore.find(
        (doc) =>
          doc?.data?.shoulder_page_type?.toLowerCase() ===
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

  if (isAboutMenu) {
    const aboutPage = await generateAboutMenuItem({
      docsStore: shoulderPageDocsStore,
      lang,
      categorisationMetadata,
    });
    const subAttractionsPages = await generateSubAttractionsMenu({
      docsStore: [...subattractionPageDocsStore, ...shoulderPageDocsStore],
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

export default generateShoulderPageMenu;
