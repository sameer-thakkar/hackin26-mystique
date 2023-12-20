import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { sendLog } from 'utils/logger';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG } from 'const/index';
import { showpageTgidsGq } from './showPage/graphQuery';

const getShowPageCollections = async ({
  pageSize = 100,
  lang,
}: {
  pageSize: number;
  lang: string;
}) => {
  try {
    const prismicClient = createClient();
    const showpageDocs = prismicClient.getAllByType('showpage', {
      pageSize,
      lang,
      predicates: [predicate.not('document.tags', [PRISMIC_DEV_TAG])],
      graphQuery: showpageTgidsGq,
    });

    sendLog({
      message: {
        documentType: CUSTOM_TYPES.SHOW_PAGE,
        functionality: 'showpageDocs',
        queryingMultipleDocs: true,
        lang,
        msg: 'Prismic API call from Canary',
      },
    });

    return showpageDocs;
  } catch (error) {
    sendLog({
      message: `getShowPageCollections failed`,
      err: error,
    });
  }
};

export const getShowPageCollectionsByTgid = async ({
  tgids,
  pageSize = 100,
  lang,
}: {
  tgids: any[];
  pageSize: number;
  lang?: string;
}) => {
  try {
    const prismicClient = createClient();
    const { results: showpageDocs } = await prismicClient.getByType(
      'showpage',
      {
        pageSize,
        predicates: [
          predicate.not('document.tags', [PRISMIC_DEV_TAG]),
          predicate.any(`my.${CUSTOM_TYPES.SHOW_PAGE}.tgid`, tgids),
        ],
        graphQuery: showpageTgidsGq,
        ...(lang && {
          lang,
        }),
      }
    );

    sendLog({
      message: {
        documentType: CUSTOM_TYPES.SHOW_PAGE,
        functionality: 'showpageDocs',
        queryingMultipleDocs: true,
        lang,
        msg: 'Prismic API call from Canary',
      },
    });

    return showpageDocs;
  } catch (error) {
    sendLog({
      message: `[getShowPageCollectionsByTgid] failed`,
      err: error,
    });
  }
};

export default getShowPageCollections;
