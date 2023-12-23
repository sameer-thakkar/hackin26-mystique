import type { NextApiRequest, NextApiResponse } from 'next';
import { handleSettledPromiseResults } from 'utils';
import { sendLog } from 'utils/logger';
import { generateDocumentTypePromises } from 'utils/prismicUtils/getDocumentType';
import type { AllDocumentContentTypes } from 'utils/prismicUtils/interface';
import { SHORTER_CACHE_AGE, SIXTY_DAYS_CACHE } from 'const/index';

const contentTypes: AllDocumentContentTypes[] = [
  'microsite',
  'content_page',
  'showpage',
  'venue_page',
  'news_page',
  'global_collection',
  'global_experience',
  'global_city',
  'global_homepage',
];

const getPrismicDocumentType = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req;
  const uid = query?.uid as string;
  if (!uid) res.status(404);
  try {
    const settledPromises = await Promise.allSettled(
      generateDocumentTypePromises({
        documentTypesArray: contentTypes,
        req,
        uid,
      })
    );

    const [settledResult] = handleSettledPromiseResults(settledPromises) ?? [];
    if (settledResult) {
      res.setHeader('Cache-Control', `max-age=${SIXTY_DAYS_CACHE}`);
      res.status(200).json({
        type: settledResult?.type,
      });
    } else {
      res.setHeader('Cache-Control', `max-age=${SHORTER_CACHE_AGE}`);
      res.status(404).json({
        error: 'No prismic document found!',
      });
    }
  } catch (error) {
    sendLog({
      err: error,
      message: `[getPrismicDocumentType] - ${uid}`,
    });
    res.status(500).json({
      error,
    });
  }
};

export default getPrismicDocumentType;
