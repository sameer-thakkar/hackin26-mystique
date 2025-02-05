import { ANALYTICS_PROPERTIES, COLLECTION_PAGE } from 'const/index';
import { strings } from 'constants/strings';
import { MAX_FULL_WIDTH_PRODUCT_CARDS } from './constants';

export const getJumpLinkItems = (
  hasReviews: boolean,
  isDesktop: boolean,
  totalServed: string | number
) => {
  return [
    {
      title: strings.formatString(
        strings.DAY_TRIPS.JUMP_LINK_ITEMS.TESTIMONIALS.TITLE,
        totalServed
      ),
      subtitle: hasReviews
        ? strings.DAY_TRIPS.JUMP_LINK_ITEMS.TESTIMONIALS.SUBTITLE_WITH_REVIEWS
        : strings.DAY_TRIPS.JUMP_LINK_ITEMS.TESTIMONIALS
            .SUBTITLE_WITHOUT_REVIEWS,
      images: [
        {
          url: 'https://cdn-imgix.headout.com/assets/svg/daytrips/review_image.png',
          alt: 'reviews-section',
        },
      ],
      scrollToId: 'reviews-section',
      scrollTopOffset: isDesktop ? -20 : 52,
      isClickable: hasReviews,
      eventData: {
        [ANALYTICS_PROPERTIES.LINK_TYPE]: COLLECTION_PAGE.REVIEWS,
      },
    },
    {
      title: strings.DAY_TRIPS.JUMP_LINK_ITEMS.HEADOUT_VERIFIED.TITLE,
      subtitle: strings.DAY_TRIPS.JUMP_LINK_ITEMS.HEADOUT_VERIFIED.SUBTITLE,
      images: [
        {
          url: 'https://cdn-imgix.headout.com/assets/svg/daytrips/headout_verified.png',
          alt: 'why-day-trips-with-ho',
        },
      ],
      scrollToId: 'why-day-trips-with-ho',
      scrollTopOffset: isDesktop ? 72 : 62,
      eventData: {
        [ANALYTICS_PROPERTIES.LINK_TYPE]: COLLECTION_PAGE.WHY_DAY_TRIPS_WITH_HO,
      },
    },
  ];
};

export const getBannerMediaByType = (banners: any[]) => {
  return banners.reduce(
    (acc: any, banner: any) => {
      if (banner.type === 'IMAGE') {
        acc.images = [
          ...acc.images,
          {
            ...banner,
            alt: banner?.metadata?.altText,
          },
        ];
      } else if (banner.type === 'VIDEO') {
        acc.video = { ...banner };
      }
      return acc;
    },
    { images: [], video: null }
  );
};

export const canShowFullWidthCards = (
  hasValidHighlightedTGID: boolean,
  totalItems: number
) => {
  return hasValidHighlightedTGID || totalItems <= MAX_FULL_WIDTH_PRODUCT_CARDS;
};
