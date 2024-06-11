import type { NextApiRequest, NextApiResponse } from 'next';
import { getHeadoutApiUrl, HeadoutEndpoints } from '../../utils/apiUtils';

const CollectionList = async (req: NextApiRequest, res: NextApiResponse) => {
  let curPage = Number(req.query.page) || 1;

  const perPage = 50;
  try {
    const endpoint = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CollectionTop,
      params: { limit: '1200' },
      id: null,
    });
    const collectionRes = await fetch(endpoint);
    const collectionJSON = await collectionRes.json();
    const collectionData = await collectionJSON?.pageData?.items;
    const totalCollections = collectionData?.length;

    const maxPage = Math.ceil(totalCollections / perPage);
    if (curPage > maxPage) {
      curPage = maxPage;
    }
    const startIndex = (curPage - 1) * perPage;
    const endIndex = curPage * perPage;

    const collectionsResult: Record<string, any>[] = collectionData.slice(
      startIndex,
      endIndex
    );
    res.setHeader('Content-type', 'application/json');
    const response = {
      results_size: totalCollections,
      results: collectionsResult?.map((collection) => {
        const { id: collectionId, displayName: collectionName } =
          collection || {};
        return {
          id: collectionId.toString(),
          title: collectionId.toString(),
          description: collectionName,
          image_url:
            'https://www.headout.com/static/favicons/favicon-32x32.png',
          last_update: new Date().getTime(),
          blob: {
            collectionId,
            collectionName,
          },
        };
      }),
      curPage,
      maxPage,
    };
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default CollectionList;
