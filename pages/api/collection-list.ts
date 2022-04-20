import { NextApiRequest, NextApiResponse } from 'next';

const CollectionList = async (req: NextApiRequest, res: NextApiResponse) => {
  let curPage = +req.query.page || 1;

  const perPage = 50;
  try {
    const collectionRes = await fetch(
      `https://api.headout.com/api/v1/collection/top/list?limit=1200`
    );
    const collectionJSON = await collectionRes.json();
    const collectionData = await collectionJSON?.pageData?.items;
    const totalCollections = collectionData?.length;

    const maxPage = Math.ceil(totalCollections / perPage);
    if (curPage > maxPage) {
      curPage = maxPage;
    }
    const startIndex = (curPage - 1) * perPage;
    const endIndex = curPage * perPage;

    const collectionsResult = collectionData.slice(startIndex, endIndex);
    res.setHeader('Content-type', 'application/json');
    const response = {
      results_size: totalCollections,
      results: collectionsResult?.map((items) => {
        const { id: collectionId, displayName: collectionName } = items || {};
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
    res.status(500).json({
      ...error,
    });
  }
};

export default CollectionList;
