import { createClient } from 'prismicio';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES } from 'const/index';

const getAlternateLanguageDocs = async ({
  baseLangDocs,
  lang,
}: {
  baseLangDocs: PrismicDocumentWithUID[];
  lang: string;
}) => {
  const alternateLangDocsIds = baseLangDocs
    .map((doc) => {
      const { alternate_languages: alternateLanguages } = doc || {};
      const { id } = alternateLanguages.find((doc) => doc.lang === lang) || {};
      return id;
    })
    .filter(Boolean) as string[];

  try {
    const prismicClient = createClient();

    const alternateLangDocs = await prismicClient.getAllByIDs(
      alternateLangDocsIds,
      {
        pageSize: 100,
        lang,
      }
    );

    sendLog({
      message: {
        documentType: CUSTOM_TYPES.SHOW_PAGE,
        functionality: 'alternateLangDocs',
        queryingMultipleDocs: true,
        lang,
        msg: 'Prismic API call from Canary',
      },
    });

    return alternateLangDocs as PrismicDocumentWithUID[];
  } catch (error) {
    sendLog({
      err: error,
      message: `getAlternateLanguageDocs`,
    });
    return [];
  }
};

export default getAlternateLanguageDocs;
