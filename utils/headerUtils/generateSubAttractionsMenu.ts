import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getHeadoutLanguagecode } from 'utils';
import getAlternateLanguageDocs from 'utils/prismicUtils/getAlternateLanguageDocs';
import { convertUidToUrl } from 'utils/urlUtils';
import { SUB_ATTRACTIONS } from 'const/header';
import { LANGUAGE_MAP } from 'const/index';
import shouldIncludeinQueries from './shouldIncludeInQueries';

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
    if (customLabel && !map.has(customLabel) && shouldIncludeinQueries(doc)) {
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

export default generateSubAttractionsMenu;
