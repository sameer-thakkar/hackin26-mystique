import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { NumberField } from '@prismicio/types';
import { documentUidUpdateRedirectHandler } from 'utils';
import getShowPageCollections from 'utils/prismicUtils/getShowPageCollections';
import { CUSTOM_TYPES, PRISMIC_DEV_TAG, PRISMIC_FIELD_ID } from 'const/index';
import { showpageGq } from './graphQuery';

const getPrismicReviewsPageByTgid = (tgid: NumberField) => {
  const prismicClient = createClient();
  return prismicClient.getByType('reviews_page', {
    predicates: [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(
        `my.${CUSTOM_TYPES.REVIEWS_PAGE}.${PRISMIC_FIELD_ID.TGID}`,
        tgid as number
      ),
    ],
  });
};

const getShowPage = async ({ req, lang, uid, isDev, host }: any) => {
  const prismicClient = createClient({ req });
  const showpage = await prismicClient.getByUID('showpage', uid, {
    lang,
    graphQuery: showpageGq,
  });

  const relatedShowPage = (
    (await getPrismicReviewsPageByTgid(showpage?.data?.tgid)) || {}
  )?.results?.[0];

  const { uid: currentPageUid } = showpage ?? {};

  if (currentPageUid !== uid) {
    const handlerData = documentUidUpdateRedirectHandler({
      toUid: currentPageUid,
      isDev,
      host,
      lang,
    });
    if (handlerData?.redirectInfo) {
      return handlerData;
    }
  }

  const allDocuments = await getShowPageCollections({
    pageSize: 100,
    lang,
  });

  if (showpage) {
    return {
      CMSContent: {
        ...showpage,
        allShowPagesDocuments: allDocuments?.map(({ uid, data: { tgid } }) => ({
          data: { tgid },
          uid,
        })),
        relatedShowPage,
      },
      ContentType: CUSTOM_TYPES.SHOW_PAGE,
    };
  } else {
    return Promise.reject();
  }
};

export default getShowPage;
