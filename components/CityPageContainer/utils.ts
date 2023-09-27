import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BANNER_API_PARAMS,
  RESOURCE_ASSET_TYPE,
} from 'const/index';
import {
  ICollectionCardTracking,
  ICtyPageBannerData,
  IgetCatSubCatMedia,
  IHandleCarouselControlTracking,
  ISubCatCardTracking,
  ITrackCTA,
  ITrackPageSection,
} from './interface';

export const handleCarouselControlTracking = ({
  direction,
  section,
}: IHandleCarouselControlTracking) => {
  trackEvent({
    eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
    [ANALYTICS_PROPERTIES.DIRECTION]: direction,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  });
};

export const getBannerParams = (cityPageBannerData: ICtyPageBannerData) => {
  let videoElmArr = cityPageBannerData?.banners?.filter(
    (item) => (item.type = BANNER_API_PARAMS.ELM_TYPE.VIDEO)
  );
  if (videoElmArr?.length) {
    const {
      url: videoUrl,
      info: { videoFallbackUrl } = {},
      metadata: { altText = '' } = {},
    } = videoElmArr[0];

    return { videoUrl, videoFallbackUrl, altText };
  }
};

export const handleCollectionCardTracking = ({
  event,
  url,
  rank,
  name,
  id,
  section,
}: ICollectionCardTracking) => {
  event.preventDefault();
  trackEvent({
    eventName: ANALYTICS_EVENTS.COLLECTION_CARD_CLICKED,
    [ANALYTICS_PROPERTIES.COLLECTION_NAME]: name,
    [ANALYTICS_PROPERTIES.COLLECTION_ID]: id,
    [ANALYTICS_PROPERTIES.POSITION]: rank,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  });
  window.open(url, '_blank');
};

export const handleSubCatCardTracking = ({
  event,
  url,
  rank,
  name,
  id,
  section,
  categoryId,
}: ISubCatCardTracking) => {
  event.preventDefault();
  trackEvent({
    eventName: ANALYTICS_EVENTS.SUBCAT_CARD_CLICKED,
    [ANALYTICS_PROPERTIES.CATEGORY_ID]: categoryId,
    [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: name,
    [ANALYTICS_PROPERTIES.SUB_CAT_ID]: id,
    [ANALYTICS_PROPERTIES.POSITION]: rank,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  });
  window.open(url, '_blank');
};

export const trackCTA = ({ event, url, section, ctaType }: ITrackCTA) => {
  event.preventDefault();
  trackEvent({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
    [ANALYTICS_PROPERTIES.CTA_TYPE]: ctaType,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  });
  window.open(url, '_blank');
};

export const trackPageSection = ({ section }: ITrackPageSection) => {
  trackEvent({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    [ANALYTICS_PROPERTIES.SECTION]: section,
  });
};

export const getCatSubCatMedia = (obj: IgetCatSubCatMedia) => {
  let imageUrl = '';
  let altText = '';
  const { medias } = obj;
  if (medias?.length) {
    const imageMediaArr = medias.filter(
      (item) => item.type === RESOURCE_ASSET_TYPE.IMAGE
    );
    if (imageMediaArr.length) {
      const {
        url,
        metadata: { altText: altTextString = '' },
      } = imageMediaArr[0] || {};
      imageUrl = url;
      altText = altTextString;
    }
  }

  return { imageUrl, altText };
};
