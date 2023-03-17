import { CUSTOM_TYPES, FALLBACK_IMAGES } from 'constants/index';
import { LOG_LEVELS } from 'constants/logs';

import { NextPageContext } from 'next';
import { getPageData } from 'utils/prismicUtils';
import { reflect } from 'utils';
import { sendLog } from 'utils/logger';

interface SitemapContext extends NextPageContext {
  localizedStrings: any;
}

const ImageSitemapXml = () => {
  return <></>;
};

ImageSitemapXml.getInitialProps = async ({
  req,
  res,
  query,
  localizedStrings,
}: SitemapContext) => {
  let uid: string;

  sendLog({ level: LOG_LEVELS.INFO, message: req?.headers?.host });

  if (query.mystique_uid) {
    uid = query.mystique_uid as string;
  } else {
    uid = req?.headers?.host?.replace('stage-', '') as string;
  }

  let isDev = false;

  const hostname = req?.headers?.host || window.location.host;

  if (hostname?.includes('localhost')) {
    isDev = true;
  }

  let sitemap = '';
  let finalImages: string[] = [];

  try {
    const { payload } = await reflect(
      getPageData({
        res,
        req,
        query,
        isDev,
        localizedStrings,
      })
    );

    sendLog({ level: LOG_LEVELS.INFO, message: JSON.stringify(payload) });

    const pageType = payload?.ContentType + (payload?.MBDesign || '');

    if (pageType === CUSTOM_TYPES.GLOBAL_HOMEPAGE) {
      const bannerImages = payload?.CMSContent?.data?.banner_images;

      sendLog({
        level: LOG_LEVELS.INFO,
        message: payload?.CMSContent?.data?.banner_images,
      });

      bannerImages?.forEach((item: { image_url: { url: string } }) => {
        finalImages.push(item.image_url.url);
      });

      if (payload?.CMSContent?.cityCollections) {
        const {
          results: cityCollectionsData,
        } = payload.CMSContent.cityCollections;

        const finalCities = cityCollectionsData?.filter(
          (destination: { data: { city_name: string; body: Array<any> } }) =>
            destination?.data?.city_name && destination?.data?.body?.length
        );

        sendLog({
          level: LOG_LEVELS.INFO,
          message: JSON.stringify(finalCities),
        });

        payload?.CMSContent?.data?.banner_images;
        finalCities?.forEach((city: { data: { body: any } }) => {
          const { data } = city || {};
          const { body: slices } = data || {};
          const images = slices
            ?.filter(
              (slice: { slice_type: string }) => slice?.slice_type === 'banner'
            )
            ?.reduce((acc: any, curr: any) => acc + curr);
          const image = images?.items[0]?.banner_image;
          finalImages.push(image || FALLBACK_IMAGES.THEMEPARKS);
        });
      }
    }

    sendLog({ level: LOG_LEVELS.INFO, message: JSON.stringify(finalImages) });

    sitemap = `<?xml version="1.0" encoding="UTF-8"?>
               <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
               <url>
               ${finalImages
                 .map((item: string, index: number) => {
                   if (index === 0)
                     return `
                  <loc>${uid}</loc>
                  <image:image>
                  <image:loc>${item}</image:loc>
                </image:image>
                  `;
                   else
                     return `
                  <image:image>
                  <image:loc>${item}</image:loc>
                </image:image>
                  `;
                 })
                 .join('')}
               </url>
               </urlset>
             `;

    res?.setHeader('Content-Type', 'text/xml');
    res?.write(sitemap);
    res?.end();
  } catch (e) {
    sendLog({ err: JSON.stringify(e) });
    res?.end();
  }
};

export default ImageSitemapXml;
