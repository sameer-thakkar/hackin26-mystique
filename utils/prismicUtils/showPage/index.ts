import { createClient } from 'prismicio';
import { documentUidUpdateRedirectHandler } from 'utils';
import getShowPageCollections from 'utils/prismicUtils/getShowPageCollections';
import { CUSTOM_TYPES } from 'const/index';
import { showpageGq } from './graphQuery';

const getShowPage = async ({ req, lang, uid, isDev, host }: any) => {
  const prismicClient = createClient({ req });
  const showpage = await prismicClient.getByUID('showpage', uid, {
    lang,
    graphQuery: showpageGq,
  });

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
      },
      ContentType: CUSTOM_TYPES.SHOW_PAGE,
    };
  } else {
    return Promise.reject();
  }
};

export default getShowPage;
