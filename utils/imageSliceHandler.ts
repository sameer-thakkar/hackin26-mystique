import { FALLBACK_IMAGE, SLICE_TYPES } from 'const/index';
import { VideoSitemap } from 'pages/video-sitemap.xml';
import { getCollectionSection } from 'utils';

import { getHeadoutApiUrl, HeadoutEndpoints } from './apiUtils';
import { tourListApiParser } from './dataParsers';
import { getHostName, getLangObject } from './helper';

export interface UrlProps {
  url?: string;
  imageURL?: string;
}

export interface ReviewerImageProps {
  reviewer_image_url?: UrlProps;
  reviewer_image?: UrlProps;
}

export interface InstaImageProps {
  instagram_posts?: UrlProps;
}

export interface CarouselGalleryImageProps {
  linked_image?: UrlProps;
}

export interface ImageGalleryProps extends CarouselGalleryImageProps {
  uploaded_image?: UrlProps;
}

export interface InternalContentImageCardProps {
  image_link?: UrlProps;
  image_source?: UrlProps;
}

export interface CardImageProps extends InternalContentImageCardProps {
  image_url?: UrlProps;
}

export interface TrustBoosterImageProps {
  icon_url?: UrlProps;
  uploaded_icon?: UrlProps;
}

export interface QuestionImageProps {
  linked_image?: string;
  upload_image?: UrlProps;
}
export interface ImageProps
  extends ReviewerImageProps,
    InstaImageProps,
    ImageGalleryProps,
    TrustBoosterImageProps,
    InternalContentImageCardProps,
    CardImageProps {}

export const storeImage = ({
  mediaArray,
  firstImage,
  secondImage,
  thirdImage,
}: {
  mediaArray: string[] | VideoSitemap[];
  firstImage?: string;
  secondImage?: string;
  thirdImage?: any;
}) => {
  let imgUrlObj;
  try {
    if (firstImage) {
      imgUrlObj = new URL(firstImage);
    } else if (secondImage) {
      imgUrlObj = new URL(secondImage);
    }
    if (imgUrlObj?.hostname) {
      imgUrlObj.search = '';
      imgUrlObj.hash = '';
      const imgUrlWithoutQueryParams = imgUrlObj.toString();
      (mediaArray as Array<string>).push(imgUrlWithoutQueryParams);
    } else {
      mediaArray.push(firstImage || secondImage || thirdImage);
    }
  } catch (e) {
    /* tslint:disable:no-empty */
  }
};

const fetchData = async (endpoint: any) => {
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
};

const sliceHandler = async ({
  slice,
  lang,
  isDev,
  mediaArray,
  host,
  isStage,
  isVideoSitemap,
  videoTitle,
  videoDescription,
}: {
  slice: any;
  lang?: string | null;
  isDev?: boolean;
  mediaArray: string[] | VideoSitemap[];
  host?: string;
  isStage?: boolean;
  isVideoSitemap?: boolean;
  videoTitle?: string;
  videoDescription?: string;
}) => {
  if (
    slice?.primary?.hide_slice ||
    (isVideoSitemap && slice.slice_type !== SLICE_TYPES.RICH_TEXT)
  )
    return;

  switch (slice.slice_type) {
    case SLICE_TYPES.RICH_TEXT: {
      if (isVideoSitemap) {
        slice?.items?.forEach((item: any) => {
          item?.text?.forEach((textItem: any) => {
            if (textItem?.text?.includes('https://www.youtube.com/')) {
              const urlRegex = /(https?:\/\/[^ ]*)/;
              let url = textItem?.text?.match(urlRegex)[0]?.split(`"`)[0];
              const thumbNailUrl = url.split('www.')[1];
              (mediaArray as Array<VideoSitemap>).push({
                url,
                thumbnail: `img.${thumbNailUrl}`,
                description: videoDescription as string,
                title: videoTitle as string,
              });
            }
          });
        });
      }
      break;
    }

    case SLICE_TYPES.INTERNAL_CONTENT_CARD: {
      const items = slice?.items;
      items?.forEach((image: ImageProps) =>
        storeImage({
          mediaArray,
          firstImage: image?.image_link?.url,
          secondImage: image?.image_source?.url,
        })
      );
      break;
    }

    case SLICE_TYPES.MICROBRAND_CARDS:
    case SLICE_TYPES.FEATURE_BOX:
    case SLICE_TYPES.CARD_CAROUSEL:
    case SLICE_TYPES.CARD:
      {
        const items = slice?.items;
        items?.forEach((item: ImageProps) =>
          storeImage({
            mediaArray,
            firstImage: item?.image_url?.url,
            secondImage: item?.image_source?.url,
            thirdImage: slice.slice_type === SLICE_TYPES.CARD && FALLBACK_IMAGE,
          })
        );
      }
      break;

    case SLICE_TYPES.TRUST_BOOSTERS: {
      const items = slice?.items;
      items?.forEach((item: ImageProps) =>
        storeImage({
          mediaArray,
          firstImage: item?.icon_url?.url,
          secondImage: item?.uploaded_icon?.url,
        })
      );
      break;
    }

    case SLICE_TYPES.IMAGE_GALLERY:
    case SLICE_TYPES.IMAGE_LINKS_CAROUSEL: {
      const items = slice?.items;
      items?.forEach((image: ImageProps) =>
        storeImage({
          mediaArray,
          firstImage:
            slice.slice_type === SLICE_TYPES.IMAGE_LINKS_CAROUSEL
              ? image?.uploaded_image?.url
              : image?.linked_image?.url,
          secondImage:
            slice.slice_type === SLICE_TYPES.IMAGE_LINKS_CAROUSEL
              ? image?.linked_image?.url
              : image?.uploaded_image?.url,
        })
      );
      break;
    }

    case SLICE_TYPES.CARD_SECTION:
    case SLICE_TYPES.TAB:
    case SLICE_TYPES.BACKGROUND:
    case SLICE_TYPES.TAB_WRAPPER: {
      const slices = slice?.slices;
      slices?.forEach((slice: any) =>
        sliceHandler({ slice, lang, isDev, mediaArray, host, isStage })
      );
      break;
    }

    case SLICE_TYPES.QUESTION: {
      const faqs = slice?.items;
      faqs?.forEach((faqSlice: any) =>
        faqSlice?.items?.forEach((image: QuestionImageProps) =>
          storeImage({
            mediaArray,
            firstImage: image?.linked_image,
            secondImage: image?.upload_image?.url,
          })
        )
      );
      break;
    }

    case SLICE_TYPES.UGC_CAROUSEL:
    case SLICE_TYPES.CAROUSEL_GALLERY: {
      const items = slice?.items;
      items?.forEach((image: ImageProps) =>
        storeImage({
          mediaArray,
          firstImage:
            slice.slice_type === SLICE_TYPES.UGC_CAROUSEL
              ? image?.instagram_posts?.imageURL
              : image?.linked_image?.url,
        })
      );
      break;
    }

    case SLICE_TYPES.AUTOMATED_COMPARISION_TABLE: {
      const params = {
        language: getLangObject(lang as string).code,
        'include-unavailable': 'true',
      };
      const endpoint = HeadoutEndpoints.CollectionSections;
      const id = slice?.primary?.collection_id;
      const hostname = isDev && !isStage ? `http://${host}` : `https://${host}`;

      const collectionEndpoint = getHeadoutApiUrl({
        endpoint,
        hostname,
        params,
        id,
      });

      try {
        const collectionData = await fetchData(collectionEndpoint);
        const headoutPicks = collectionData
          ? getCollectionSection(collectionData, 'HEADOUT_PICKS')
          : [];
        const tourGroups =
          collectionData &&
          headoutPicks?.filter(
            (item: any) => item?.language?.toLowerCase() === lang
          );

        tourGroups?.forEach((tour: { imageUrl?: string }) =>
          (mediaArray as Array<string>).push(tour?.imageUrl as string)
        );
      } catch (e) {
        /* tslint:disable:no-empty */
      }

      break;
    }

    case SLICE_TYPES.CUSTOM_LINKED_TOURS: {
      const tgids: any = [];
      slice?.items?.reduce((acc: any, tour: any) => {
        tgids.push(tour.tgid);
        return {
          ...acc,
          [tour.tgid]: { tgid: tour.tgid, ...tour.link_override },
        };
      }, {});

      const hostname = host && getHostName(!!isStage, !!isDev, host);
      const params = {
        'ids[]': tgids,
        ...(lang && {
          language: lang,
        }),
      };
      const tourListEndpoint = getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.TourGroupsV6,
        hostname,
        params,
        id: null,
      });

      try {
        const tourListData = await fetchData(tourListEndpoint);
        const apiTours = tourListData
          ? tourListApiParser(tourListData, lang as string)
          : {};
        if (apiTours && tgids?.length > 0) {
          tgids?.forEach((item: any) => {
            mediaArray.push(apiTours[item]?.image);
          });
        }
      } catch (e) {
        /* tslint:disable:no-empty */
      }
      break;
    }

    case SLICE_TYPES.REVIEWS: {
      const reviews = slice?.items;
      reviews?.forEach((image: ImageProps, index: number) => {
        const n = (index % 202) + 1;
        storeImage({
          mediaArray,
          firstImage: image?.reviewer_image_url?.url,
          secondImage: image?.reviewer_image?.url,
          thirdImage: `https://cdn-s3-open.headout.com/reviews/${n}.jpg`,
        });
      });
      break;
    }

    default:
  }
};

export default sliceHandler;
