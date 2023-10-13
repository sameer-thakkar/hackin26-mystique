import { BANNER_DESCRIPTORS } from 'const/index';
import { strings } from 'const/strings';

type BannerMap = () => Record<string, any>;
export const SUB_CATEGORY_BANNER: BannerMap = () => {
  return {
    '1010': [
      {
        icon: BANNER_DESCRIPTORS.TRANSLATE,
        text: strings.BANNER_DESCRIPTORS.EXPERT_MULTILINGUAL_GUIDES,
      },
      {
        icon: BANNER_DESCRIPTORS.STL,
        text: strings.BANNER_DESCRIPTORS.STL,
      },
      {
        icon: BANNER_DESCRIPTORS.SPARKS,
        text: strings.BANNER_DESCRIPTORS.PERSONALIZED,
      },
    ],
    '1026': [
      {
        icon: BANNER_DESCRIPTORS.FnB,
        text: strings.BANNER_DESCRIPTORS.LOCAL_FOOD,
      },
      {
        icon: BANNER_DESCRIPTORS.TRANSLATE,
        text: strings.BANNER_DESCRIPTORS.MULTILINGUAL_GUIDES,
      },
      {
        icon: BANNER_DESCRIPTORS.CULINARY,
        text: strings.BANNER_DESCRIPTORS.CULINARY_EXPERTS,
      },
    ],
    '1108': [
      {
        icon: BANNER_DESCRIPTORS.TICKET,
        text: strings.BANNER_DESCRIPTORS.HASSLE_FREE,
      },
      {
        icon: BANNER_DESCRIPTORS.CLOCK,
        text: strings.BANNER_DESCRIPTORS.FREQUENT_DEPARTURES,
      },
      {
        icon: BANNER_DESCRIPTORS.COFFEE,
        text: strings.BANNER_DESCRIPTORS.ONBOARD_AMENITIES,
      },
    ],
    '1133': [
      {
        icon: BANNER_DESCRIPTORS.TICKET,
        text: strings.BANNER_DESCRIPTORS.HASSLE_FREE,
      },
      {
        icon: BANNER_DESCRIPTORS.CLOCK,
        text: strings.BANNER_DESCRIPTORS.FREQUENT_DEPARTURES,
      },
      {
        icon: BANNER_DESCRIPTORS.COFFEE,
        text: strings.BANNER_DESCRIPTORS.ONBOARD_AMENITIES,
      },
    ],
    '1139': [
      {
        icon: BANNER_DESCRIPTORS.ROUTE,
        text: strings.BANNER_DESCRIPTORS.FLEXI_TRAVEL,
      },
      {
        icon: BANNER_DESCRIPTORS.CANCELLATION,
        text: strings.BANNER_DESCRIPTORS.FLEXI_EXCHANGE_CANCEL,
      },
      {
        icon: BANNER_DESCRIPTORS.DOLLAR,
        text: strings.BANNER_DESCRIPTORS.EXTRA_DISCOUNT,
      },
    ],
    '1023': [
      {
        icon: BANNER_DESCRIPTORS.PAID,
        text: strings.BANNER_DESCRIPTORS.PREPAID,
      },
      {
        icon: BANNER_DESCRIPTORS.CHECK_CIRCLE,
        text: strings.BANNER_DESCRIPTORS.EASY_ACTIVATION,
      },
      {
        icon: BANNER_DESCRIPTORS.GLOBE,
        text: strings.BANNER_DESCRIPTORS.INSTANT_CONNECTIVITY,
      },
    ],
    '1143': [
      {
        icon: BANNER_DESCRIPTORS.ROUND_TRIP,
        text: strings.BANNER_DESCRIPTORS.ROUND_TRIP,
      },
      {
        icon: BANNER_DESCRIPTORS.TRANSLATE,
        text: strings.BANNER_DESCRIPTORS.MULTILINGUAL_GUIDES,
      },
      {
        icon: BANNER_DESCRIPTORS.PEACE,
        text: strings.BANNER_DESCRIPTORS.CULTURAL_EXPERIENCE,
      },
    ],
  };
};

export const CATEGORY_BANNER: BannerMap = () => {
  return {
    '18': [
      {
        icon: BANNER_DESCRIPTORS.SIGHTSEEING,
        text: strings.BANNER_DESCRIPTORS.SIGHTSEEING,
      },
      {
        icon: BANNER_DESCRIPTORS.TRANSLATE,
        text: strings.BANNER_DESCRIPTORS.MULTILINGUAL_GT,
      },
      {
        icon: BANNER_DESCRIPTORS.MAP,
        text: strings.BANNER_DESCRIPTORS.MULTI_ROUTES,
      },
    ],
    '6': [
      {
        icon: BANNER_DESCRIPTORS.ROUND_TRIP,
        text: strings.BANNER_DESCRIPTORS.ROUND_TRIP,
      },
      {
        icon: BANNER_DESCRIPTORS.TRANSLATE,
        text: strings.BANNER_DESCRIPTORS.MULTILINGUAL_GUIDES,
      },
      {
        icon: BANNER_DESCRIPTORS.PEACE,
        text: strings.BANNER_DESCRIPTORS.CULTURAL_EXPERIENCE,
      },
    ],
  };
};
