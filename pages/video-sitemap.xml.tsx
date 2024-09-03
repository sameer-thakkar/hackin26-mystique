import { NextPageContext } from 'next';
import { getHeadoutLanguagecode, isCollectionMB, reflect } from 'utils';
import { groupSlices } from 'utils/helper';
import imageSliceHandler from 'utils/imageSliceHandler';
import getPageData from 'utils/prismicUtils/getPageData';
import { convertUidToUrl, getLangUID } from 'utils/urlUtils';
import { CUSTOM_TYPES, DESIGN } from 'constants/index';

interface SitemapContext extends NextPageContext {
  localizedStrings: any;
}
export interface VideoSitemap {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

const VideoSitemapXml = () => {
  return <></>;
};

// removes special characters which isnt supported by a sitemap from a given string
const getStringWithoutSpecialCharacters = (str: string | null) =>
  str ? str?.replace(/[•,&]/g, '') : '';

function generateSiteMap(
  finalVideos: Array<VideoSitemap>,
  uid: string,
  lang: string
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    <url>
    ${finalVideos
      .map((item: VideoSitemap, index: number) => {
        const result = `<video:video>
        <video:thumbnail_loc>${item.thumbnail}</video:thumbnail_loc>
        <video:title>${getStringWithoutSpecialCharacters(
          item.title
        )}</video:title>
        <video:description>${getStringWithoutSpecialCharacters(
          item.description
        )}</video:description>
        <video:player_loc>${item.url}</video:player_loc>
       </video:video>`;
        return index === 0
          ? `<loc>${convertUidToUrl({
              uid,
              lang: getHeadoutLanguagecode(lang as string),
            })}</loc>${result}`
          : result;
      })
      .join('')}
    </url>
    </urlset>
  `;
}

const extractSliceVideos = (
  payload: Record<string, any>,
  finalVideos: VideoSitemap[],
  title?: string,
  description?: string
) => {
  const slices = payload?.refs?.contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormContent = payload?.data?.body2;
  const longFormSlices = [...contentFWSlices, ...longFormContent];

  longFormSlices?.forEach((slice: any) =>
    imageSliceHandler({
      slice,
      mediaArray: finalVideos,
      isVideoSitemap: true,
      videoTitle: title,
      videoDescription: description,
    })
  );
};

VideoSitemapXml.getInitialProps = async ({
  req,
  res,
  query,
  localizedStrings,
}: SitemapContext) => {
  let uid: string;
  if (query.mystique_uid) {
    uid = query.mystique_uid as string;
  } else {
    uid = req?.headers?.host as string;
  }

  const { host } = req?.headers || window.location;
  const { lang } = getLangUID(req, query);
  const isDev = host?.includes('localhost');

  let sitemap = '';
  let finalVideos: VideoSitemap[] = [];

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

    const pageType = payload.ContentType + (payload.MBDesign || '');

    const CMSContent = payload?.CMSContent?.data;
    const title = CMSContent?.data?.title;
    const description = CMSContent?.data?.description;

    if (pageType !== CUSTOM_TYPES.GLOBAL_HOMEPAGE) {
      extractSliceVideos(CMSContent, finalVideos, title, description);
    }

    if (
      pageType === CUSTOM_TYPES.MICROSITE ||
      pageType === CUSTOM_TYPES.MICROSITE + DESIGN.V1
    ) {
      const mbType = payload?.CMSContent?.data?.mbType;
      const isCollectionMicrobrand = isCollectionMB(mbType);
      const { collectionVideos } = payload?.categoryTourListData || {};

      if (isCollectionMicrobrand) {
        if (collectionVideos?.length) {
          const image = CMSContent?.data?.images[0];
          const firstImage = image?.image_src?.url;
          const secondImage = image?.uploaded_image?.url;
          finalVideos.push({
            title,
            thumbnail: firstImage || secondImage,
            description,
            url: collectionVideos[0].url,
          });
        }
      }
    }

    sitemap = generateSiteMap(finalVideos, uid, lang as string);

    res?.setHeader('Content-Type', 'text/xml');
    res?.write(sitemap);
    res?.end();
  } catch (e) {
    res?.end();
  }
};

export default VideoSitemapXml;
