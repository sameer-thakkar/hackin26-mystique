import type { PrismicDocumentWithUID } from '@prismicio/types';
import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';
import { getHeadoutLanguagecode } from 'utils';
import { fetchCollection } from 'utils/apiUtils';
import getAlternateLanguageDocs from 'utils/prismicUtils/getAlternateLanguageDocs';
import { ABOUT } from 'const/header';
import { LANGUAGE_MAP } from 'const/index';
import shouldIncludeinQueries from './shouldIncludeInQueries';
import { getMenuUrl } from '.';

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
      shouldIncludeinQueries(doc)
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

export default generateAboutMenuItem;
