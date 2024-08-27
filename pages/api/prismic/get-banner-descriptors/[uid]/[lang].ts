import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLog } from 'utils/logger';
import { fetchBannerDescriptors } from 'utils/prismicUtils';
import { TFetchBannerDescriptors } from 'utils/prismicUtils/interface';
import { ONE_WEEK_CACHE, SHORTER_CACHE_AGE } from 'const/index';

const getBannerDescriptors = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req;
  const { uid, lang } = query;

  if (!uid || !lang) res.status(404);
  try {
    const bannerDescriptorRes: TFetchBannerDescriptors =
      await fetchBannerDescriptors({
        uid: uid as string,
        lang,
      });

    const {
      category_descriptors: categoryDescriptors = [],
      body: subcategoryDescriptors = [],
    } = bannerDescriptorRes ?? {};

    if (bannerDescriptorRes) {
      res.setHeader('Cache-Control', `max-age=${ONE_WEEK_CACHE}`);
      res.status(200).json({
        categoryDescriptors,
        subcategoryDescriptors,
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
      message: `[getBannerDescriptors] - ${uid}`,
    });
    res.status(500).json({
      error,
    });
  }
};

export default getBannerDescriptors;
