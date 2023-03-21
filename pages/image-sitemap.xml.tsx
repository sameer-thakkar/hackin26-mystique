import { CUSTOM_TYPES, DESIGN, FALLBACK_IMAGES } from 'constants/index';

import { NextPageContext } from 'next';
import { convertUidToUrl, getLangUID } from 'utils/urlUtils';
import { getPageData } from 'utils/prismicUtils';
import imageSliceHandler, {
  storeImage,
  UrlProps,
} from 'utils/imageSliceHandler';
import { getHeadoutLanguagecode, isCollectionMB, reflect } from 'utils';
import { groupSlices } from 'utils/helper';
import { sendLog } from 'utils/logger';
interface SitemapContext extends NextPageContext {
  localizedStrings: any;
}

const ImageSitemapXml = () => {
  return <></>;
};

const getBannerImages = (payload: any, pageType: any) => {
  if (pageType === CUSTOM_TYPES.MICROSITE)
    return payload?.CMSContent?.data?.data?.images;
  else return payload?.CMSContent?.data?.banner_images;
};

const extractSliceImages = (
  payload: any,
  lang: any,
  isDev: boolean,
  finalImages: string[],
  host: string,
  isStage: boolean
) => {
  const slices = payload?.refs?.contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormContent = payload?.data?.body2;
  const longFormSlices = [...contentFWSlices, ...longFormContent];

  longFormSlices?.forEach((slice: any) =>
    imageSliceHandler(slice, lang, isDev, finalImages, host, isStage)
  );
};

ImageSitemapXml.getInitialProps = async ({
  req,
  res,
  query,
  localizedStrings,
}: SitemapContext) => {
  let uid: string;

  if (query.mystique_uid) {
    uid = query.mystique_uid as string;
  } else {
    uid = req?.headers?.host?.replace('stage-', '') as string;
  }

  let sitemap: string = '';
  let finalImages: string[] = [];
  let bannerImages = [];

  const { host } = req?.headers || window.location;
  const { lang } = getLangUID(req, query);
  const isDev = host?.includes('localhost');
  const isStage = host?.includes('stage-');

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

    const pageType = payload?.ContentType + (payload?.MBDesign || '');
    const CMSContent = payload?.CMSContent?.data;
    const categoryTourListData = payload?.categoryTourListData;
    bannerImages = getBannerImages(payload, pageType);

    if (pageType === CUSTOM_TYPES.MICROSITE) {
      extractSliceImages(
        CMSContent,
        lang,
        isDev as boolean,
        finalImages,
        host as string,
        isStage as boolean
      );
    }

    if (
      pageType === CUSTOM_TYPES.MICROSITE + DESIGN.V2 ||
      pageType === CUSTOM_TYPES.MICROSITE + DESIGN.V3
    ) {
      bannerImages?.forEach(
        (item: { image_src: UrlProps; uploaded_image: UrlProps }) =>
          storeImage({
            sliceImages: finalImages,
            firstImage: item?.uploaded_image?.url,
            secondImage: item?.image_src?.url,
          })
      );

      let tourListCategoryAllTours = {};

      const tourListCategoryData = CMSContent.data.body?.filter(
        (body: any) => body?.slice_type === 'tour_list_category'
      );

      const hasCategoryTourList =
        categoryTourListData &&
        Object.keys(categoryTourListData)?.length > 1 &&
        tourListCategoryData?.length > 0;

      if (hasCategoryTourList) {
        const tourListSlice = tourListCategoryData?.reduce(
          (acc: any, curr: any) => acc + curr
        );

        tourListSlice?.items?.forEach((item: any) => {
          const { collection, category, sub_category } = item || {};
          const tgidData =
            categoryTourListData[collection] ||
            categoryTourListData[category] ||
            categoryTourListData[sub_category];

          tgidData?.forEach((data: { tgid?: any }) => {
            const { tgid } = data;
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            tourListCategoryAllTours[tgid] = data;
          });
        });
      } else {
        tourListCategoryAllTours = CMSContent?.data?.all_tours?.reduce(
          (accum: any, tour: any) => {
            let tourData = tour?.primary;
            const scorpioTour = payload?.tourGroupData?.[tourData.tgid] || {};

            return {
              ...accum,
              [tourData.tgid]: {
                productImage:
                  tourData?.product_image_url?.url ||
                  tourData?.product_image_override?.url ||
                  scorpioTour?.images?.[0]?.url,
              },
            };
          },
          {}
        );
      }

      const productImages = Object.keys(tourListCategoryAllTours)?.map(
        (item) => {
          return (tourListCategoryAllTours as any)[item].productImage;
        }
      );

      productImages?.forEach((image: string) => finalImages.push(image));
    } else if (
      pageType === CUSTOM_TYPES.MICROSITE ||
      pageType === CUSTOM_TYPES.MICROSITE + DESIGN.V1
    ) {
      const mbType = CMSContent?.mbType;
      const isCollectionMicrobrand = isCollectionMB(mbType);
      const {
        scorpioData: scorpioDataCategorised,
        collectionVideo,
        orderedTours: categorizedToursList,
      } = categoryTourListData || {};

      if (isCollectionMicrobrand) {
        if (!collectionVideo) {
          const image = CMSContent?.data?.images[0];
          const firstImage = image?.image_src?.url;
          const secondImage = image?.uploaded_image?.url;
          storeImage({ sliceImages: finalImages, firstImage, secondImage });
        }
      } else {
        bannerImages?.forEach(
          (item: { image_src: UrlProps; uploaded_image: UrlProps }) => {
            storeImage({
              sliceImages: finalImages,
              firstImage: item?.image_src?.url,
            });
          }
        );
      }

      const isCategorisedTours =
        Object.keys(categoryTourListData || {})?.length > 0;

      const scorpioData = isCategorisedTours
        ? scorpioDataCategorised
        : payload?.tourGroupData;

      const orderedUncategorizedTours = isCategorisedTours
        ? categorizedToursList
        : payload?.toursList;

      orderedUncategorizedTours?.forEach((item: { tgid?: any }) => {
        const images = scorpioData[item?.tgid]?.images;
        images?.forEach((image: { url?: string }) =>
          finalImages.push(image?.url as string)
        );
      });
    } else {
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

    sitemap = `<?xml version="1.0" encoding="UTF-8"?>
               <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
               <url>
               ${finalImages
                 .map((item: string, index: number) => {
                   const result = `<image:image>
                  <image:loc>${item}</image:loc>
                </image:image>`;
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

    res?.setHeader('Content-Type', 'text/xml');
    res?.write(sitemap);
    res?.end();
  } catch (e) {
    sendLog({ err: JSON.stringify(e) });
    res?.end();
  }
};

export default ImageSitemapXml;
